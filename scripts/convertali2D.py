import sys



# USE: "python convertali2D.py <inputfile> <outputfile>"

######################################################################################################################################
def convertFile(fileInput, fileOutput):
	"""Function that converts ali2D.input file to ali2D.output format 
	   Prints error message if input file not found
	   
	   Args:
		fileInput (filepath) : the file in ali2D.input format to be converted
		fileOutput(filepath) : the output file
	"""

	try:
		f = open(fileInput, "r")
		
	except 	IOError:
		print "ERROR:: File not found : ", fileInput
		sys.exit(1)
	
	lines = f.readlines()
	f.close()
	
	g = open(fileOutput, "w")
	
	for i in range (0, len(lines)):
		
		if lines[i]!="\n" and lines[i]!="":             # because file may contain blank lines at the end

			if i % 6 == 0:
				words = lines[i].split(":")   	# ['  name0', ' d1or4a_\n']
				seq1 = words[1].split("\n")	# [' d1itha_', '']
				seq = seq1[0].split(" ")[1]	# 'd1itha_'
				g.write(seq)

			if i % 6 == 1:
				words = lines[i].split(":")	# ['  seq0', ' -------------------ETAYFSDSNGQQKNRI- ... \n']
				seq2 = words[1].split("\n")	# [' -------------------ETAYFSDSNGQQKNRI- ...', '']
				seq = seq2[0]			# '-------------------ETAYFSDSNGQQKNRI- ...'
			
				g.write(seq)

			if i % 6 == 3:
				words = lines[i].split(":")	# ['seq_struct0',' -------------------CCCCCCCCCCCCCCCC-------CCC---CCH..\n']
				seq1 = words[1].split(" ")	# ['','-------------------CCCCCCCCCCCCCCCC-------CCC---CCH..\n']
				seq = seq1[1].split("\n")[0]	# '-------------------CCCCCCCCCCCCCCCC-------CCC---CCH..'

				g.write("\t")
				g.write(seq)
				g.write("\n")
	g.close()



######################################################################################################################################
def readArgs(args):
	"""Function that reads the arguments in command line to execute the convertali2D.py script correctly
	   The correct format is : 'python convertali2D.py <inputfile> <outputfile>'
	   Prints 'DONE !' if script executed correctly
	   Prints appropriate Error Message otherwise

	   Args:
		args (str) : the string input on the command line
	"""


	if len(args)!= 3 :
		print "ERROR:: Parameters ali2D inputFile and outputFile required\n"
		sys.exit(1)

	if args[1]== "":
		print "ERROR:: Parameter ali2D inputFile is required\n"
		sys.exit(1)
	
	if args[2]== "":
		print "ERROR:: Parameter ali2D outputFile is required\n"
		sys.exit(1)
	
	convertFile(args[1],args[2])
	print "DONE !"


######################################################################################################################################
## MAIN

readArgs(sys.argv)


