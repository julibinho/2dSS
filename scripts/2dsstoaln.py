import sys


alnFile = ""
ssFile = ""
outputFile = ""
chunkSize = 120


#usage
usage = "python 2dsstoaln.py -alnFile <f> -ssFile <f> -o <f>\n"

########################################################################
### Read parameters
def readParameters(args):
	global alnFile
	global ssFile
	global outputFile
	global chunkSize
	try:
	    for i in range(1,len(args)):
		if (args[i] == "-alnFile"):
		    alnFile = args[i+1]
		elif (args[i] == "-ssFile"):
		    ssFile = args[i+1]
		elif (args[i] == "-o"):
		    outputFile = args[i+1]
		elif (args[i] == "-length" or args[i]=="-l"):
			chunkSize = int(args[i+1])
		elif (args[i] == "-h" or args[i] == "--h" or args[i] == "-help"):
			print (usage)
	except IndexError as e:
		print i
		raise e

            
########################################################################
### Check parameters
def checkParameters():
    if (alnFile == ""):
        print ("ERROR::Parameter -f fastaFile is required\n")
        sys.exit(1);
    elif (ssFile == ""):
        print ("ERROR::Parameter -g groupFile is required\n")
        sys.exit(1);

########################################################################
def readFileToDic(nameFile):
    f=open(nameFile,"r")
    lines=f.readlines()    
    f.close()

    listeCle=[]
 
    hashAln = {}
    for l in lines:
        l = l.strip()
        if (l != ""):
        	array = l.split()
        	if (len(array)==2):
        		if (not array[0] in listeCle ):
	    			listeCle.append(array[0])
	    			#print (array[0]) #, array[1])
	    		if (not hashAln.has_key(array[0])):
	    			hashAln[array[0]] = array[1]
	    		else:
	    			hashAln[array[0]] = hashAln[array[0]] + array[1]

    #print hashAln
    return (hashAln, listeCle)

########################################################################
########################################################################
def mergeFile(hashAln, hash2ss):
	#print (hashAln, hash2ss)
	for cleAln in hashAln.keys() : 
		hash2ss[cleAln]=list(hash2ss[cleAln])
		for i,x in enumerate(hashAln[cleAln]):
			if x=='-':
				hash2ss[cleAln].insert(i,'-')
	return hash2ss

########################################################################
###################################################################

def separateFile(hash2ss,hashAln,listeCle):
	global chunkSize

	for y in hash2ss.keys():hash2ss[y]="".join(hash2ss[y])
		

	for k in hash2ss.keys():
		hash2ss[k]=[hash2ss[k][x:x+chunkSize] for x in xrange(0, len(hash2ss[k]), chunkSize)]
		hashAln[k]=[hashAln[k][x:x+chunkSize] for x in xrange(0, len(hashAln[k]), chunkSize)]
		i=0
	with open(outputFile,"w") as f :
		while i<len(hash2ss[hash2ss.keys()[0]]):
			for j in listeCle :
				f.write(j + "\t" + hashAln[j][i] + "\t" + hash2ss[j][i] + "\n")
			i+=1

###################################################################

def saveFile(hash2ss,hashAln,listeCle):
	with open(outputFile,"w") as f :
		for j in listeCle:
			stru2d = ''.join(hash2ss[j])
			f.write(j + "\t" + str(hashAln[j].upper()) + "\t" + stru2d + "\n")
			
			
############################################################################
############################################################################


# Main

readParameters(sys.argv)
checkParameters()
(hashAln, listeCle) = readFileToDic(alnFile)
(hash2ss, x) = readFileToDic(ssFile)
mergeFile(hashAln, hash2ss)
#separateFile(hash2ss,hashAln,listeCle)
saveFile(hash2ss,hashAln,listeCle)
print("Done !")
sys.exit(1);

