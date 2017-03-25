import sys



# USE: "python convertquick2D.py <inputfile> <outputfile>"

######################################################################################################################################

def replaceSpace(string, letter):
	""" replace spaces in string by letter
	"""

	res = ""
	for c in string:
		if (c==' '):
			res = res + letter
		else:
			res = res + c
		
	return res
	

######################################################################################################################################
def convertFile(fileInput, fileOutput):

	try:
		f = open(fileInput, "r")
		
	except 	IOError:
		print "Error: File not found"
		sys.exit(1)
	
	lines = f.readlines()
	f.close()
	
	g = open(fileOutput, "w")
	
	for i in range (0, len(lines)):
		x = i % 17		

		lengthline = len(lines[i])

		s2 = lines[i]
		s = s2[17: lengthline-1]
		
		if x == 0:
			g.write("QUERY        ")
			
			g.write(s)
			g.write("\n")
						
		if (x==1) or (x==3) or (x==5) or (x==7):
			new_s =  replaceSpace(s,'C')		

			if x== 1:
				g.write("PSIPRED      ")
			
			if x== 3:
				g.write("JNET         ")
			
			if x== 5:
				g.write("PROFC(Ouali) ")
		
			if x== 7:
				g.write("PROFC(Rost)  ")
			
			g.write(new_s)
			g.write("\n")	

		
		if i % 17 == 16:
			for j in range (0,3):
				g.write("\n")	

	g.close()



######################################################################################################################################
def readArgs(args):
	convertFile(args[1],args[2])

######################################################################################################################################
## MAIN

readArgs(sys.argv)


