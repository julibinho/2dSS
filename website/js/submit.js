var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_predvide = document.getElementById("predvide");
var champ_alignvide = document.getElementById("alignvide");

//var champ_align2vide = document.getElementById("align2vide");
//var champ_pred2vide = document.getElementById("pred2vide");

//Var global stockant les noms eg d1x9fc_, d1jl7a_ ...
var setSeq = new Set();

/**
 * 
 * @param {type} e : evenement 
 * Fonction principale bloquant l'envoi des donnees si les formats dans les boites ne sont pas bonnes
 */
function f_valid(e){
	//alert("ici");
    
   if (content_missing_box("align") || content_missing_box("pred")){
       
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
 * Affiche un message dans le champ 
 */
function affiche(champ,message){
    champ.textContent = message;
    champ.style.color = "red";
}
/**
 * 
 * @param {type} id de la boite
 * @returns {Boolean} True si la boite est vide, False sinon
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
 * @param {type} arrStr tableau contenant de strings
 * @returns {Boolean} True s'il n'y a que deux colonnes contenant des caracteres, False sinon
 * 
 *  Cette fonction est utilisee pour verifier qu'il n'y a que deux colonnes dans le text de la boite align
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
 * @param {type} arrStr tableau de strings
 * @returns {Array|col1_col2.col1col2} Le tableau contenant que les elements caracteres de arrStr
 * Le tableau est sous la forme des deux colonnes d'une ligne dans le texte de la boite align
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
 * @returns True si le format du texte dans la boite align est incorrecte, False sinon
 * Cette fonction verifie le format du texte dans la boite align
 */
function format_incorrect_align(){

    setSeq = new Set();

    var textArea = document.getElementById("align").value;
    var arrayOfLines = textArea.split("\n");
    var noOfLines = arrayOfLines.length; // Nb de lignes dans le texte
   
    var i = 0;
    var line = arrayOfLines[i];
    
	
    // Premier passage -> Recuperer les noms des sequences
   while( (i<noOfLines) && ((line.match(/[a-z]/i))!==null) ){ // Tester pas encore arrive a fin et
                                                              // que premiere ligne vide pas encore rencontree
        var colsOfLine = line.split(" ");

        if(!test_only_2_columns(colsOfLine)){ // Tester s'il y a plus que deux colonnes 
            return true;
        }
        
        var col1col2 = col1_col2(colsOfLine);
        var col1 = col1col2[0];
        var col2 = col1col2[1];

	if( (col2.match(/^[a-z-]+$/i)) === null ){ // Tester si il y a autre que ABC..Z et -
		return true;
	}

        setSeq.add(col1); // Stockage des noms des sequences
        i++;
        line = arrayOfLines[i];  

    }

    // Passage sur reste des lignes -> Voir si les noms des sequences matchent 
    while (i < noOfLines){
        
        line = arrayOfLines[i];
        
        if ((line.match(/[a-z]/i))!==null){ // Si pa la ligne vide
             colsOfLine = line.split(" ");
             
            if(!test_only_2_columns(colsOfLine)){ // Tester s'il y a plus que deux colonnes 
                 return true;
            }
		
	    col1col2 = col1_col2(colsOfLine);            
            col1 = col1col2[0];
            col2 = col1col2[1]; 
            
            if (!setSeq.has(col1)){ // Tester s'il n'y a pas la coherence/ les sequences ne repetent pas
                return true;
            }

	    if( (col2.match(/^[a-z-]+$/i)) === null ){ // Tester si il y a autre que ABC..Z et -
		return true;
	    }
     
        }   
        i++;     
    }
    return false;   
}

/**
 * 
 * @returns {Boolean}  True si le format du texte dans la boite pred est incorrecte, False sinon
 */

function format_incorrect_pred(){
    
    var textArea = document.getElementById("pred").value;
    var arrayOfLines = textArea.split("\n");
    var noOfLines = arrayOfLines.length;
    
    var i=0; 
    while( i < noOfLines ){         // Tant que pas arrive a la fin
        var line = arrayOfLines[i];
        
        var colsOfLine = line.split("\t"); 

	if (colsOfLine.length !== 2){ // Tester s'il y a plus que deux colonnes 
		return true;
	}

        var col1 = colsOfLine[0];
	var col2 =colsOfLine[1];
	
        if(!setSeq.has(col1)){      // Tester si la sequence n'est pas dans var global setSeq
            return true;
        }
	
	if (col2.includes(" ")){    // Tester si la col2 contient des espaces
		return true;
	}

	if( (col2.match(/^[che]+$/i)) === null ){  // Tester si col2 contient autre que des C,H et E
		return true;
	}
        
        i++;         
    }
    
    return false;
}
