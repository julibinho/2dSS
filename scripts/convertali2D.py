import sys



# USE: "python convertali2D.py <inputfile> <outputfile>"

######################################################################################################################################
def convertFile(fileInput, fileOutput):
	"""Converts input file in quick2D.input format to quick2D.output format
	    @param {filepath} fileInput : Filepath of ali2D.input file
	    @param {filepath} fileOutput: Filepath of ali2D.output file
	"""

	try:
		f = open(fileInput, "r")
		
	except 	IOError:
		print "ERROR:: File not found : ", fileInput
		sys.exit(1)
	
	lines = f.readlines()
	f.close()
	
	g = open(fileOutput, "w")
	
	#print "length of lines", len(lines)
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
				seq = seq2[0].split(" ")[1]     # '-------------------ETAYFSDSNGQQKNRI- ...'
				
				g.write("\t")
				g.write(seq)

			if i % 6 == 3:
				words = lines[i].split(":")	# ['seq_struct0',' -------------------CCCCCCCCCCCCCCCC-------CCC---CCH..\n']
				seq1 = words[1].split(" ")	# ['','-------------------CCCCCCCCCCCCCCCC-------CCC---CCH..\n']
				seq = seq1[1].split("\n")[0]	# '-------------------CCCCCCCCCCCCCCCC-------CCC---CCH..'

				g.write("\t")
				g.write(seq)
				
				if (i+6 < len(lines)-1):
					#print "i is:", i
					g.write("\n")
				
	g.close()



######################################################################################################################################
def readArgs(args):
	"""Principal function which reads the arguments on command line and executes the convertali2D.py script (conversion)
 	    Prints 'DONE !' if script executed correctly
	    Prints appropriate Error Message otherwise

	    @param {string} args : Input on command line
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


