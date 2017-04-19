var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_predvide = document.getElementById("predvide");
var champ_alignvide = document.getElementById("alignvide");


//Global variable storing names eg d1x9fc_, d1jl7a_ ...
var setSeq = new Set();

/**
 * 
 * @param {type} e : event 
 * Principal function preventing submission of data if data format in text boxes is incorrect
 */
function f_valid(e){
	if ((content_missing_box("alignFile") && content_missing_box("predFile") && content_missing_box("ali2D")) || (content_missing_box("alignFile") && content_missing_box("ali2D")) || (content_missing_box("predFile") && content_missing_box("ali2D"))){
   		if(content_missing_box("align") || content_missing_box("pred")){
	        	if(content_missing_box("align")){
		        	affiche(champ_alignvide, "Contents Missing");
		    		e.preventDefault();
	       		}else{
		    		champ_alignvide.textContent = "";
	       		}
	       
	       		if (content_missing_box("pred")){
			     	affiche(champ_predvide, "Contents Missing");
		     		e.preventDefault();
	       		}else{
		    		affiche(champ_predvide,"");
	       		}
       		}else{
			if (format_incorrect_align()){
		        	affiche(champ_alignvide,"Incorrect Format");
		        	e.preventDefault();
			}else{
		    		affiche(champ_alignvide,"");
       			}
	
			if (format_incorrect_pred()){
	     			affiche(champ_predvide,"Incorrect Format");
	    		 	e.preventDefault();
			}else{
	     			affiche(champ_predvide,"");
	 		}
	     	}
	}
	   
    //e.preventDefault();
    
}


/**
 * 
 * @param {type} champ
 * @param {type} message
 * Display message in field champ 
 */
function affiche(champ,message){
    champ.textContent = message;
    champ.style.color = "red";
}


/**
 * 
 * @param {type} id of box field
 * @returns {Boolean} True if box field empty, False otherwise
 */
function content_missing_box(id){
    var a = document.getElementById(id).value;
    if ((a.length) < 1){
        return true;
    }
    return false;
}

/**
 * 
 * @param {type} arrStr Array containing strings
 * @returns {Boolean} True if only two columns(elements in the Array) contain characters, False otherwise
 * 
 *  This function is useful to verify whether there are only two columns in the align text box 
 */
function test_only_2_columns(arrStr){
	var i;
	var cpt=0;
	for(i=0; i< arrStr.length; i++ ){
		if( (arrStr[i].match(/^[a-z0-9_-]+$/i)) !==null){
			cpt++;
		}
		if (cpt > 2){
			return false;
		}	
	}
	return true;
}
/**
 * 
 * @param {type} arrStr Array of strings
 * @returns {Array|col1_col2.col1col2} The array containing only the character elements of arrStr
 * The Array is in the form of the two columns of a line in the align text box
 */
function col1_col2(arrStr){
    var col1col2 = [];
    var i;
    for(i=0; i< arrStr.length; i++ ){
        if( (arrStr[i].match(/^[a-z0-9_-]+$/i)) !==null){
            col1col2.push(arrStr[i]);
        }
    }
    
    return col1col2;
}

/**
 * 
 * @returns True if data format in align text box is incorrect, False otherwise
 */
function format_incorrect_align(){

    setSeq = new Set();

    var textArea = document.getElementById("align").value;
    var arrayOfLines = textArea.split("\n");
    var noOfLines = arrayOfLines.length; // No of lines in text
   
    var i = 0;
    var line = arrayOfLines[i];
    
	
    // First parse -> Collect sequence names 
   while( (i<noOfLines) && ((line.match(/[a-z]/i))!==null) ){ // Test end not yet reached 
                                                              // and first blank line not yet encountered
        var colsOfLine = line.split(" ");

        if(!test_only_2_columns(colsOfLine)){ // Test if there are more than 2 columns
            return true;
        }
        
        var col1col2 = col1_col2(colsOfLine);
        var col1 = col1col2[0];
        var col2 = col1col2[1];

	if( (col2.match(/^[a-z-]+$/i)) === null ){ // Test if there are characters other than ABC..Z or -
		return true;
	}

        setSeq.add(col1); // Store sequence names
        i++;
        line = arrayOfLines[i];  

    }

    // Parse remaining lines -> See if sequence names match 
    while (i < noOfLines){
        
        line = arrayOfLines[i];
        
        if ((line.match(/[a-z]/i))!==null){ // If not blank line
             colsOfLine = line.split(" ");
             
            if(!test_only_2_columns(colsOfLine)){ // Test if there are more than 2 columns
                 return true;
            }
		
	    col1col2 = col1_col2(colsOfLine);            
            col1 = col1col2[0];
            col2 = col1col2[1]; 
            
            if (!setSeq.has(col1)){ // Test for incoherence/ sequence names don't repeat
                return true;
            }

	    if( (col2.match(/^[a-z-]+$/i)) === null ){ // Test if there are characters other than ABC..Z or -
		return true;
	    }
     
        }   
        i++;     
    }
    return false;   
}


/**
 * 
 * @returns True if data format in pred text box is incorrect, False otherwise
 */
function format_incorrect_pred(){
    
    var textArea = document.getElementById("pred").value;
    var arrayOfLines = textArea.split("\n");
    var noOfLines = arrayOfLines.length;
    
    var i=0; 
    while( i < noOfLines ){         // End not yet reached
        var line = arrayOfLines[i];
        
        var colsOfLine = line.split("\t"); 

	if (colsOfLine.length !== 2){ // Test if there are more than 2 columns
		return true;
	}

        var col1 = colsOfLine[0];
	var col2 =colsOfLine[1];
	
        if(!setSeq.has(col1)){      // Tester if sequence not in global var setSeq
            return true;
        }
	
	if (col2.includes(" ")){    // Test if column 2 contains spaces
		return true;
	}

	if( (col2.match(/^[che]+$/i)) === null ){  // Test if col2 contains characters other than C,H or E
		return true;
	}
        
        i++;         
    }
    
    return false;
}
