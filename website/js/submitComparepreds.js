var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_queryvide = document.getElementById("queryvide");
var champ_predsvide = document.getElementById("predsvide");
var champ_filevide = document.getElementById("filevide");

/**
 * 
 * @param {type} e : event 
 * Principal function preventing submission of data if data format in text boxes is incorrect
 */
function f_valid(e){

	if (content_missing_box("quick2D")){
		if (content_missing_box("query") || content_missing_box("preds")){
			if(content_missing_box("query")){
		        	affiche(champ_queryvide, "Contents Missing");
		    		e.preventDefault();
	       		}else{
		    		champ_queryvide.textContent = "";
	       		}
	       
	       		if (content_missing_box("preds")){
			     	affiche(champ_predsvide, "Contents Missing");
		     		e.preventDefault();
	       		}else{
		    		affiche(champ_predsvide,"");
	       		}
	       		
	       		if(content_missing_box("query") && content_missing_box("preds")){
	       			affiche(champ_filevide, "Contents Missing");
		     		e.preventDefault();
	       		}else{
	       			affiche(champ_filevide,"");
	       		}
	       		
		}else{
			if (format_incorrect_query()){
		        	affiche(champ_queryvide,"Incorrect Format");
		        	e.preventDefault();
			}else{
		    		affiche(champ_queryvide,"");
       			}


			if (format_incorrect_preds()){
	     			affiche(champ_predsvide,"Incorrect Format");
	    		 	e.preventDefault();
			}else{
	     			affiche(champ_predsvide,"");
	 		}
		}
	}
	
	//alert("tout ok");
	//e.preventDefault();
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
 * @param {type} field
 * @param {type} message
 * Display message in field 
 */
function affiche(field,message){
    field.textContent = message;
    field.style.color = "red";
}

/**
 * 
 * @returns True if data format in Query text box is incorrect, False otherwise
 */
function format_incorrect_query(){
	var textArea = document.getElementById("query").value;
	if( (textArea.match(/^[a-z\n]+$/i)) === null ){ // Tester si il y a autre que ABC..Z
		return true;
	}
	return false;
}

/**
 * 
 * @returns True if data format in Preds text box is incorrect, False otherwise
 */
function format_incorrect_preds(){
	var textArea = document.getElementById("preds").value;
	var arrayOfLines = textArea.split("\n");
	var noOfLines = arrayOfLines.length;

	var i=0;
	while ( i < noOfLines){
		line = arrayOfLines[i];
		
		if ((line.match(/[a-z]/i))!==null){ // If not empty line
				
			var index = line.indexOf('\t'); // Return true if space not found
			if (index < 0){			
				return true;
			}

			toolName = line.substr(0,line.indexOf('\t'));
			pred = line.substr(line.indexOf('\t')+1);
			
			if (toolName==="" || pred===""){ 
				return true;
			
			}

			if (((pred.match(/^[che\s]+$/i)) === null)){ // Return true if pred contains characters other than C, H,E or spaces
				return true;
					
			}

		}
	      	
		i++;
	}
	return false;
}	

