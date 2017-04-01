import sys
import re

inputFile = ""
outputFile = ""
separate = False
COLOR_TEXT = "black"
html = False
typeProg=1 # 1 for 2dalignment; 2 for compare predictions
x = 5;              yBase = 45;     yHigh = 35;   yLow = 55;  yHighCORRECTION = 5; 
sizeAln= 50;        typeShw = 3;    yHighPosCORRECTION = 10;

#Constantes
COL_ID = 0;     COL_ALN = 1;    COL_2SS = 2;


SYTYLE_HELIX = "style='fill:transparent;stroke:black;stroke-width:2'"
STYLE_SHEET_END = "style='fill:yellow;stroke:black;stroke-width:2'"
STYLE_SHEET = "style='fill:yellow;stroke:black;stroke-width:2'"
STYLE_REC_HIGH = "style='stroke:#009900;stroke-width: 1;stroke-dasharray: 10 5;fill: none;'"
STYLE_TEXT = "style='font-weight: bold;'"
#STYLE_LOOP = "style='stroke:black;stroke-width:2'"
STYLE_LOOP = "style='stroke:rgb(255,0,0);stroke-width:2'"

aa_classes = {
'I': 'DarkBlue', 'V': 'DarkBlue','L': 'DarkBlue', 'F': 'DarkBlue', 'M': 'DarkBlue',
'A': 'DarkBlue', 'W': 'DarkBlue', 'C': 'DarkSalmon', 'G': 'Orange', 'T': 'green',
'S': 'green', 'Y': 'LightSeaGreen ', 'P': 'DarkGoldenRod', 'H': 'LightSeaGreen ',
'N': 'green', 'D': 'DarkOrchid', 'Q': 'green', 'E': 'DarkOrchid', 'K': 'red',
'R': 'red', 'X': 'black', '-': 'black'
}

H_HIGHLIGHT = 15
Y_TRIANGULE_CORRECTION = 4
X_TEXT_CORRECTION = 135
W_SHEET = 8
JUMP_SIZE = 8



# Usage
usage = "python 2dss.py [options] -inputFile f1 -outputFile f2\n"
usage += "where basic options are:\n-h : show brief help on version and usage\n"
usage += "-size <x> : x is the alignment length (default 50)\n"
usage += "--separate : show sequences and secondary structure separately (defaut False) \n"
usage += "--html : save the otput file in a HTML format otherwise save it in a svg format (defaut False) \n"

### Read parameters
def readParameters(args):
    global inputFile, outputFile, sizeAln, separate, html, typeProg

    for i in range(1, len(args)):
        if args[i] == "-inputFile" or args[i] == "-i":
            inputFile = args[i + 1]
        elif args[i] == "-outputFile" or args[i] == "-o":
            outputFile = args[i + 1]
        elif args[i] == "-size" or args[i] == "-sz":
            sizeAln = int(args[i + 1])
        elif args[i] == "-h":
            print usage
        elif args[i] == "--separate" or args[i] == "--s":
            separate = True
        elif args[i] == "--html" or args[i] == "--ht":
            html = True
        elif args[i] == "-typeProg" or args[i] == "-t":
            typeProg = int(args[i + 1])

#######################################################################
### Check parameters
def checkParameters():
    if inputFile == "":
        print ("ERROR::Parameter -inputFile is required\n")
        sys.exit(1)
    elif outputFile == "":
        print ("ERROR::Parameter -outputFile  is required\n")
        sys.exit(1)
    elif separate == "":
        print("ERROR::Parameter -separate is required\n")
        sys.exit(1)


#######################################################################
###
def represent2DSS(x, yBase, yHigh, yLow, seqID, structure, aligSequence, start, end, firstSeq):
    seqPosSVG = ""
    seqIDSVG = representText(x, yBase, seqID);
    structure = structure[start:end]
    sequence = aligSequence[start:end]
    if (firstSeq): seqPosSVG = representAAPositions(x + X_TEXT_CORRECTION, yHigh - yHighPosCORRECTION, start, end, structure)
    sequenceSVG = representAAsequence(x + X_TEXT_CORRECTION, yHigh, sequence)
    seq2DSSSVG = represent2DObjects(x + X_TEXT_CORRECTION, yBase, yHigh, yLow, structure);
    return seqPosSVG + seqIDSVG + sequenceSVG + seq2DSSSVG;

#######################################################################
def highlityDomain(x, y, start, end):
    w = (end - start) * JUMP_SIZE
    info = "<rect x='{x}' y='{y}' width='{w}'".format(x=str(x),y=str(y),w=str(w))
    info = info + "' height='" + str(H_HIGHLIGHT) + "' " + STYLE_REC_HIGH + " />\n"
    return info


#######################################################################
def representText(x, y, seqText):
    global COLOR_TEXT
    info = "<text x='" + str(x) + "' y='" + str(y) + "' fill='" + COLOR_TEXT + "'" + ">"
    info = info + seqText + "</text>"
    return info


#######################################################################
def representAAsequence(x, y, aaSeq):
    info = ""
    for elem in (aaSeq):
        info += "<text x='{x}' y='{y}' style='font-size:11px;font-family:monospace;fill:{color}'>{aa}</text>\n" \
            .format(x=x, y=y, color=aa_classes[elem], aa=elem)
        x += JUMP_SIZE
    return info

#######################################################################
def representAAPositions(x, y, start, end, aaSeq):
    info = ""
    position = 1
    for elem in (aaSeq):
        if (position % 10 == 0):
            info += "<text x='{x}' y='{y}' style='font-size:11px;font-family:monospace;'>{pos}</text>\n" \
            .format(x=x, y=y, pos=position + start)
        x += JUMP_SIZE
        position += 1
    return info

#######################################################################
###
def represent2DObjects(xStart, yBase, yHigh, yLow, seq2DSS):
  
    yBase2=0

    count = 0
    i = 0;
    info = ""
    x = xStart
    while i < len(seq2DSS):
        # alpha helix
        if (i < len(seq2DSS) and seq2DSS[i].upper() == "H"):
            while i < len(seq2DSS) and seq2DSS[i].upper() == "H":
                count = count + 1;
                i = i + 1

            #(x, infoL) = createHelix(x, yBase-yBase2*2 + Y_TRIANGULE_CORRECTION, yHigh, count)
            #print (x, yBase, yHigh, yLow, count)
            (x, infoL) = createHelixPath(x, yBase, yHigh, yLow, count)
            info = info + infoL + "\n"
            count = 0
        # beta sheeting
        if (i < len(seq2DSS) and seq2DSS[i].upper() == "E"):
            while i < len(seq2DSS) and seq2DSS[i].upper() == "E":
                # print seq2DSS[i], i
                count = count + 1;
                i = i + 1
            (x, infoL) = createSheet(x, yBase, (count - 1) * JUMP_SIZE, W_SHEET)
            info = info + infoL + "\n"
            count = 0
        # Loop
        if (i < len(seq2DSS) and seq2DSS[i].upper() == "C"):
            while i < len(seq2DSS) and seq2DSS[i].upper() == "C":
                # print seq2DSS[i], i
                count = count + 1;
                i = i + 1

            (x, infoL) = createLoop(x, yBase + Y_TRIANGULE_CORRECTION, x + count * JUMP_SIZE,
                                    yBase + Y_TRIANGULE_CORRECTION)
            info = info + infoL + "\n"
            count = 0
        # gap
        if (i < len(seq2DSS) and seq2DSS[i].upper() == "-"):
            x = x + JUMP_SIZE
            i = i + 1
    return info


#######################################################################
def createSheet(x, y, w, h):
    """
        Permet de creer le style graphique des feuillets beta
    """
    info = "<rect  x='" + str(x) + "' y='" + str(y) + "' width='" + str(w)
    info = info + "' height='" + str(h) + "' " + STYLE_SHEET + " />\n"

    points = ""
    x = x + w
    y -= Y_TRIANGULE_CORRECTION
    points = points + str(x) + "," + str(y) + " ";
    x += JUMP_SIZE
    y += JUMP_SIZE
    points = points + str(x) + "," + str(y) + " ";
    x -= JUMP_SIZE
    y += JUMP_SIZE
    points = points + str(x) + "," + str(y) + " "
    x += JUMP_SIZE

    info = info + " <polygon points='" + points + "' " + STYLE_SHEET_END + " />"

    return (x, info)


#######################################################################
def createLoop(x1, y1, x2, y2):
    """
        Permet de creer le style graphique des boucles
    """
    global STYLE_LOOP

    info = "<line  x1='{x1}' y1='{y1}' x2='".format(x1=str(x1),y1=str(y1))
    info = info + str(x2) + "' y2='{y2}' {loop} />\n".format(y2=str(y2),loop=STYLE_LOOP)

    return (x2, info)


#######################################################################
def createHelix(xStart, yBase, yHigh, sizeH):
    """
        Permet de creer le style graphique des helices alpha
    """
    global JUMP_SIZE, SYTYLE_HELIX
    info = "<polyline points='"
    points = ""
    x = xStart
    JUMP_SIZE_H = JUMP_SIZE / 2.0
    yBase += Y_TRIANGULE_CORRECTION
    yHigh += Y_TRIANGULE_CORRECTION
    for i in range(0, sizeH):
        points = points + str(x) + "," + str(yBase) + " "
        x += JUMP_SIZE_H
        points = points + str(x) + "," + str(yHigh) + " "
        x += JUMP_SIZE_H
        points = points + str(x) + "," + str(yBase) + " "
        x += JUMP_SIZE_H
        x -= JUMP_SIZE_H
    info = info + points + "' " + SYTYLE_HELIX + "/>"
    return (x, info)


#######################################################################
def createHelixPath(xStart, yBase, yHigh, yLow, sizeH):
    """
        Permet de creer le style graphique des helices alpha
    """
    global JUMP_SIZE, SYTYLE_HELIX
    info = ""
    points = ""
    x = xStart
    JUMP_SIZE_H = JUMP_SIZE / 3.0
    yBase += Y_TRIANGULE_CORRECTION
    yHigh += Y_TRIANGULE_CORRECTION
    yLow += Y_TRIANGULE_CORRECTION
    for i in range(0, sizeH):
    	if i%2==0:
    		points += "<path d='M" + str(x) + " " + str(yBase) + " " 
    		x += JUMP_SIZE_H
    		points += "C " + str(x) + " " + str(yHigh) + ", " 
    		x += JUMP_SIZE_H
    		points +=  str(x) + " " + str(yHigh) + ", " 
    		x += JUMP_SIZE_H
    		points +=  str(x) + " " + str(yBase) + "' " 
    		points += SYTYLE_HELIX + "/>\n"
    	else:
    		points += "<path d='M" + str(x) + " " + str(yBase) + " " 
    		x += JUMP_SIZE_H
    		points += "C " + str(x) + " " + str(yLow) + ", " 
    		x += JUMP_SIZE_H
    		points +=  str(x) + " " + str(yLow) + ", " 
    		x += JUMP_SIZE_H
    		points +=  str(x) + " " + str(yBase) + "' " 
    		points += SYTYLE_HELIX + "'/>\n"	
    return (x, points)

#######################################################################
def readFile(inputFile):
    
    f=open(inputFile,"r")
    lines=f.readlines()
    f.close()
    matrix = []
    for i, line in enumerate(lines):
        line = line.strip()
        seqArray = line.split("\t")
        matrix.append(seqArray)
    return matrix

#######################################################################
def showAlig(data, i, x, yBase, yHigh, yLow, typeShw, start, end, firstSeq, CORRECTION, COL_ID, COL_2SS, COL_ALN):
    info = ""
    for i in range(len(data)):
        seqID = data[i][COL_ID]; structure= data[i][COL_2SS]; aligSeq= data[i][COL_ALN];
        if (typeShw == 1 ): aligSeq = '';
        elif (typeShw == 2): structure = '';
        info += represent2DSS(x, yBase, yHigh, yLow, seqID, structure, aligSeq, start, end, firstSeq)
        if (firstSeq): firstSeq = False
        yBase += CORRECTION
        yHigh += CORRECTION
        yLow += CORRECTION
    return info


#######################################################################
def saveFile (info, larg, long):
    htmlHead = ""; htmlTail = ""
    head = "<svg width='{largeur}px' height='{nbl}px'>\n".format(nbl=long, largeur=larg)
    tail = "\n</svg>\n"
    if (html == True):
        htmlHead = "<html><body>\n"; htmlTail="</body></html>"
    with open(outputFile,"w") as f :
        f.write(htmlHead + head + info + tail + htmlTail)

#######################################################################
def show2dAlignment(inputFile, x, yBase, yHigh, yLow, separate):  
	it = 0; info = ""
	if (separate): CORRECTION = 20; 
	else: CORRECTION = 30; yHighCORRECTION = 30; 
   
	data = readFile(inputFile)
	sizeAlnFile = len(data[0][COL_ALN]) #take the alignment length

	runs = int(sizeAlnFile/sizeAln)
	if (sizeAlnFile % sizeAln >=1):
		runs +=1;
	start = 0;  end = sizeAln

	while (it < runs):
		if (separate):
			info = info + showAlig(data, it, x, yBase, yHigh, yLow, 1, start, end, True, CORRECTION, COL_ID, COL_2SS, COL_ALN)
			yBase += CORRECTION *len(data) + 30
			yHigh += CORRECTION *len(data) + 30
			yLow  += CORRECTION *len(data) + 30
			info = info + showAlig(data, it, x, yBase, yHigh, yLow, 2, start, end, False, CORRECTION, COL_ID, COL_2SS, COL_ALN)
		else:
			info = info + showAlig(data, it, x, yBase, yHigh, yLow, 3, start, end, True, CORRECTION, COL_ID, COL_2SS, COL_ALN)
		start = end; 
		end = end + sizeAln
		it= it + 1
		yBase += CORRECTION *len(data) + 30
		yHigh += CORRECTION *len(data) + 30
		yLow += CORRECTION *len(data) + 30
	saveFile(info , sizeAln*12,  yBase)

#######################################################################
def comparePred(inputFile, x, yBase, yHigh, yLow):  
	it = 0; info = ""; CORRECTION = 30;
	data = readFile(inputFile)
	sizeAlnFile = len(data[0][1]) #take the alignment length
	
	runs = int(sizeAlnFile/sizeAln)
	if (sizeAlnFile % sizeAln >=1):
		runs +=1;
	
	start = 0;  end = sizeAln
	while (it < runs):
		for j in range(len(data)):
			if j == 0:
				info += represent2DSS(x, yBase, yHigh, yLow,  data[j][0], "", data[j][1], start, end, True)	
			else:
				info += represent2DSS(x, yBase, yHigh, yLow, data[j][0],  data[j][1], "", start, end, False)
			yBase += CORRECTION
			yHigh += CORRECTION
			yLow  += CORRECTION 
		start = end; 
		end = end + sizeAln
		it= it + 1
		yBase += CORRECTION  + 30
		yHigh += CORRECTION  + 30
		yLow += CORRECTION  + 30
	saveFile(info , sizeAln*12,  yBase)
	
#######################################################################	
### Main


readParameters(sys.argv)
checkParameters()


if (typeProg==1):
	show2dAlignment(inputFile, x, yBase, yHigh,yLow, separate)
elif (typeProg==2):
	comparePred(inputFile, x, yBase, yHigh, yLow)

print ("Done!")
sys.exit(0)
