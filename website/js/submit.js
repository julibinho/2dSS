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

// Fonction retournant true si le format dans box 1 incorrecte, false sinon
function format_incorrect_box_align(){
    
    // Si la box 1 est vide, retourner faux directement et sortir de la fonction 
    if (content_missing_box_align()){
        return false;
    }
   
    var textArea = document.getElementById("align");
    var arrayOfLines = textArea.value.split("\n");  // les lignes sont stockees dans arrayOfLines
    var nolignes = arrayOfLines.length; //le nombre de lignes total 

    var i=0;
    
    //parcourir chaque ligne jusqu'a la fin
    while(i<nolignes){
        
        // recuperer ligne courante
	var ligne = arrayOfLines[i]; 
        
        // S'il ne s'agit pas de la ligne vide
        if ((ligne.match(/[a-z]/i))!==null){
    
            //recuperer 14 premiers caracteres ( la colonne 1 )
            var col1 = ligne.substring(0,15);
            
            // Si la col1 ne contient pas de lettres 
            if ((col1.match(/[a-z]/i))===null){
                    //alert("col1 ne contient pas de lettres");
                    champ_alignvide.textContent = "Incorrect Format";
                    champ_alignvide.style.color = "red";
                    IFal = 1;
                    return true;
            }        
            
            
            
            // TEST DE PRESENCE D'ESPACE AU MILIEU DE LA COL1
            var j;
            var prev = false;   // si la precedente est espace 
            for(j=0; j<15; j++){
                
                var current = col1[j]; // caractere courant
               
               // si precedent est espace et courant est un caractere(pas espace)
                if(prev && (current!==" ")){ 
                  //  alert("espace suivi de lettre");
                    champ_alignvide.textContent = "Incorrect Format";
                    champ_alignvide.style.color = "red";
                    IFal = 1;
                    return true;
                }
                
                if (current === " "){
                   prev = true;
                }    
            }
       
        }   
        //passage a la ligne suivante
	i++;
    }

    // alert("tout va bien align");
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
     
    //parcourir chaque ligne jusqu'a la fin
    while(i<nolignes){
        
        // recuperer ligne courante
	var ligne = arrayOfLines[i]; 
        
      
        //recuperer 14 premiers caracteres ( la colonne 1 )
        var col1 = ligne.substring(0,15);
            
         // Si la col1 ne contient pas de lettres 
        if ((col1.match(/[a-z]/i))===null){
            //alert("col1 ne contient pas de lettres");
            champ_predvide.textContent = "Incorrect Format";
            champ_predvide.style.color = "red";
            IFal = 1;
            return true;
        }        
            
        var j;
        var prev = false;   // si la precedente est espace 
        for(j=0; j<15; j++){
                
            var current = col1[j]; // caractere courant
               
            // si precedent est espace et courant est un caractere(pas espace)
            if(prev && (current!==" ")){ 
            //  alert("espace suivi de lettre");
                champ_predvide.textContent = "Incorrect Format";
                champ_predvide.style.color = "red";
                IFal = 1;
                return true;
            }
                
            if (current === " "){
                      prev = true;
            }    
        }
 
        //passage a la ligne suivante
	i++;
    }
  
    // tout va bien 
    return false; 
}







