import sys



# USE: "python convertquick2D.py <inputfile> <outputfile>"

######################################################################################################################################

def replaceSpace(string, letter):
	""" Function that replaces spaces in string by letter

	    Args : 
		  string (str) : string input
		  letter (char): letter by which spaces have to be replaced

	    Returns:
		  (str) : new string with spaces replaced
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
	"""Function that converts quick2D.input file to quick2D.output format 
	   Prints error message if input file not found
	   
	   Args:
		fileInput (filepath) : the file in quick2D.input format to be converted
		fileOutput(filepath) : the output file
	"""

	try:
		f = open(fileInput, "r")
		
	except 	IOError:
		print "Error: File not found : ", fileInput
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
	"""Function that reads the arguments in command line to execute the convertquick2D.py script correctly
	   The correct format is : 'python convertquick2D.py <inputfile> <outputfile>'
	   Prints 'DONE !' if script executed correctly
	   Prints appropriate Error Message otherwise

	   Args:
		args (str) : the string input on the command line
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


