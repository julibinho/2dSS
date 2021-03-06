import sys
import re


# USE: "python convertquick2D.py <inputfile> <outputfile>"

######################################################################################################################################
def replaceSpace(string, letter):
	""" Fills in spaces in a string by a letter
	    @param {string} string : The original string
	    @param {char} letter: The letter to insert
	    @returns: {string} : The new string with spaces replaced by letter 
	"""
	res = ""
	for c in string:
		if (c==' '):
			res = res + letter
		else:
			res = res + c
		
	return res

######################################################################################################################################
def testInput(fileInput):
	""" Tests the format of the input quick2D.input file
	    @param {filepath} fileInput : Filepath of quick2D.input file
	    @returns: {boolean} : True if file format is correct, False otherwise
	    
	"""
	try:
		f = open(fileInput, "r")
		
	except 	IOError:
		print "ERROR:: File not found"
		sys.exit(1)

	lines = f.readlines()
	f.close()

	for i in range(0, len(lines)):
		if lines[i]!="\n" and lines[i]!="": 
			x = i % 17

			lengthline = len(lines[i])
			line = lines[i]
			col2 = line[17: lengthline-1]


			if x == 0: # Query
				if not(col2.isalpha()):
					return False

			reg=re.compile('^[CHEche \.]+$')
			if (x==1) or (x==3) or (x==5) or (x==7): # SS PSIPRED, SS JNET, SS PROF (Ouali), SS PROF (Rost)
				if not(reg.match(col2)): # If line contains other than C,H,E or space
					return False
	
	return True	
			
######################################################################################################################################
def convertFile(fileInput, fileOutput):
	""" Converts input file in quick2D.input format to quick2D.output format
	    @param {filepath} fileInput : Filepath of quick2D.input file
	    @param {filepath} fileOutput: Filepath of quick2D.output file

	    Prints error message if file not found or quick2D.input file not in expected format
	"""
	try:
		f = open(fileInput, "r")
		
	except 	IOError:
		print "ERROR:: File not found"
		sys.exit(1)
	
	lines = f.readlines()
	f.close()
	
	if (not testInput(fileInput)):
		print "ERROR:: File input format incorrect"
		sys.exit(1)

	query=""
	psipred=""
	jnet=""
	profcOuali=""
	profcRost=""
	
	for i in range (0, len(lines)):
		x = i % 17		

		lengthline = len(lines[i])

		s2 = lines[i]
		s = s2[17: lengthline-1]

		if x == 0:
			query+= s
						
		if (x==1) or (x==3) or (x==5) or (x==7):
			new_s =  replaceSpace(s,'C')		

			if x== 1:
				psipred+= new_s
			
			if x== 3:
				jnet+= new_s
			
			if x== 5:
				profcOuali+= new_s
		
			if x== 7:
				profcRost+= new_s
	
	g = open(fileOutput, "w")
	g.write("QUERY\t"+query+"\n"+"PSIPRED\t"+psipred+"\n"+"JNET\t"+jnet+"\n"+"PROFC(Ouali)\t"+profcOuali+"\n"+"PROFC(Rost)\t"+profcRost)
	
	g.close()



######################################################################################################################################
def readArgs(args):
	""" Principal function which reads the arguments on command line and executes the convertali2D.py script (conversion)
 	    Prints 'DONE !' if script executed correctly
	    Prints appropriate Error Message otherwise

	    @param {string} args : Input on command line
	"""
	if len(args)!= 3 :
		print "ERROR:: Parameters quick2D inputFile and outputFile required\n"
		sys.exit(1)

	if args[1]== "":
		print "ERROR:: Parameter quick2D inputFile is required\n"
		sys.exit(1)
	
	if args[2]== "":
		print "ERROR:: Parameter ali2D outputFile is required\n"
		sys.exit(1)

	convertFile(args[1],args[2])
	print "DONE !"

######################################################################################################################################
## MAIN

readArgs(sys.argv)


