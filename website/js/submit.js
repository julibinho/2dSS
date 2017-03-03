var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_predvide = document.getElementById("predvide");
var champ_alignvide = document.getElementById("alignvide");

//Var global stockant les noms eg d1x9fc_, d1jl7a_ ...
var arraySeq = []; 


// Boolean indiaquant si IncorrectFormat dans contenu de  Box Align (box 1)
var IFal = 0;

var CMal = 0;

//Fonction principale de validation quand on click sur le bouton submit
function f_valid(e){
    if(content_missing_box_align() ){
                e.preventDefault();
    }
    if (content_missing_box_pred()) {
        e.preventDefault();
    }
    
    if (format_incorrect_box_align()){
        e.preventDefault();
        
    }
    
    if (format_incorrect_box_pred()){
        e.preventDefault();
    }
 }
 
// Fonction testant si al box 1 est vide  
function content_missing_box_align(){
        var align = document.getElementById("align").value;
        if(align.length < 1 ){
                   //alert('alignlength <1');
                  
            champ_alignvide.textContent = "Contents missing";
            champ_alignvide.style.color = "red";
            CMal = 1;
            return true;
        }
        
        champ_alignvide.textContent="";
        return false;  
}

// Fonction testant si la box 2 est vide
function content_missing_box_pred(){ 
        var pred = document.getElementById("pred").value;
        if(pred.length < 1 ){
                    //alert('pred length <1');
                    // var champ_predvide = document.getElementById("predvide");
            champ_predvide.textContent = "Contents missing";
            champ_predvide.style.color = "red";
            return true;
        }
        
        champ_predvide.textContent = "";
        return false;
              
}

// Fonction testant si le format dans box 1 incorrecte
function format_incorrect_box_align(){
     
  //  arraySeq = []; 
   // var first = 1; // boolean pour dire qu'on passe dans le premier groupe
    
    if (content_missing_box_align()){
        return false;
    }
   
    var textArea = document.getElementById("align");
    var arrayOfLines = textArea.value.split("\n"); 
    var nolignes = arrayOfLines.length; //le nombre de lignes total 

    var i=0;
    while(i<nolignes){
        /*
        if (arraySeq.includes(col1)){
            first = 0;
        }*/
	
	var ligne = arrayOfLines[i]; // recuperer ligne courante
	var cols = ligne.split(" "); // spliter la ligne 
	var col1 = cols[0]; // recuperer la col1

	// test si longeur >= 15
	if (col1.length >= 15){
		 champ_alignvide.textContent = "Incorrect Format";
           	 champ_alignvide.style.color = "red";
		 IFal = 1;
		 return true;
	}

	// test si ce n'est pas la ligne vide entre et si col1 contient espace 
	if ((col1!==" ") && col1.includes(" ")){
		 champ_alignvide.textContent = "Incorrect Format";
           	 champ_alignvide.style.color = "red";
		 IFal = 1;
		 return true;
	}
        
	i++;
    }

//    alert("tout va bien align");
    // tout va bien
    return false;
	

}


// Fonction testant si le format dans box 2 incorrecte   
function format_incorrect_box_pred(){

   
   // Sortir de cette fonction si la box 2 est vide
   if (content_missing_box_pred()){
       return false;
   }
   
   // Sortir de cette fonction si la box 1 est vide
   if(CMal === 1){
       return false;
   }
   
   // Sortir de cette fonction si le format de la box 1 est incorrect
   if (IFal === 1){
       return false;
   }

    // Lecture des lignes
    var textArea = document.getElementById("pred");
    var arrayOfLines = textArea.value.split("\n"); 
    var nolignes = arrayOfLines.length; //le nombre de lignes total 
    
    var i=0;
    
 
    while(i<nolignes){
	           
           var ligne = arrayOfLines[i]; // recuperer ligne courante
	   var cols = ligne.split("\t"); // spliter la ligne          -> TAB OR NOT ?? Des fois ca marche des fois non
           var col1 = cols[0]; // recuperer la col1
	  

           // test si longeur >=15
	   //alert(col1.length);
	  if (col1.length >= 15){
		 champ_predvide.textContent = "Incorrect Format";
           	 champ_predvide.style.color = "red";
		 return true;
	  }
        
        /*
	// test si col1 contient espace 
	if (col1.includes(" ")){
		 champ_predvide.textContent = "Incorrect Format";
           	 champ_predvide.style.color = "red";
		 return true;
	}
        */

	// test si col1 correspond bien au nom stoke dans arraySeq
      //  alert("does arrayseq include col1?");
        //alert(arraySeq.includes(col1));
	//if(!arraySeq.includes(col1)){
	//	 champ_predvide.textContent = "Mismatch";
          // 	 champ_predvide.style.color = "red";
	//	 return true;
		
	//}

	i++;

    }
    
 //   alert("tout va bien pred");
  
    // tout va bien 
    return false; 
}







