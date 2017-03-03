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
    
    //alert("entre dans fonction formatincorr box align");
    //alert("arrayseq au debut");
    arraySeq = [];
 //   alert(arraySeq);
 
    
    if (content_missing_box_align()){
        return false;
    }
   
    var textArea = document.getElementById("align");
    var arrayOfLines = textArea.value.split("\n"); 
    var nolignes = arrayOfLines.length; //le nombre de lignes total 
    alert("nolignes");
    alert(nolignes);
   
    
    //Lecture des lignes vides /entres 
    //On commence a i=1 car la premiere ligne contient le titre
     var i;
    for(i=1; i<arrayOfLines.length; i++){
        if(arrayOfLines[i].length !== 0){
               break;
        }
    }
   

    var cols = arrayOfLines[i].split(" ");
    var col1 = cols[0];
    //Longeur generale de la col1
    var length_col1 = col1.length;

   
   // PREMIER GROUPE -> RECUEILLIR LES INFORMATIONS //
    
   //Indice indiquant debut col3
   var ind_col3 = length_col1;
   while(arrayOfLines[i][ind_col3] === " "){
       ind_col3++;
   }
   //Longeur general col3
   var length_col3 = arrayOfLines[i].length - ind_col3;
   

   
   var j=0; 
   // While de Premiere passage -> Compteur le nd de sequences, la longeur de la sequence
   while(col1.length>0 && i < nolignes){


        //test si long col1 pas coherent
        if (col1.length !== length_col1){
            champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             IFal = 1;
             return true;
             
        }
        
        //test si la col1 contient espace
        if (col1.includes(" ")){
            champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             IFal = 1;
             return true;
        }
        
       // alert("le push");
       //Stoker le nom de dans le tableau global
       arraySeq.push(col1);
    
       //  alert(arraySeq);
       
       /*var col3 = substring(line(ind_col3, line.length-1));
       if (col3.length !== length_col3){
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             IFal = 1;
             return true;
       }
       */
       i++;
       j++;

       cols = arrayOfLines[i].split(" ");
       col1 = cols[0];
    }
 
    
    //On a desormais le nb de sequences dans un groupe
    var nbseq = j;
  //  alert("nb in seq");
    //alert(nbseq);
    // FIN PREMIER GROUPE //
    
    // AUTRES GROUPES //
    
    //Chercher debut autre groupe (ignorer les lignes vides ou les : : , . )
    while(col1.length===0 && i < nolignes){
  
         i++;
        
         if (i>= nolignes){
             alert("fin de la page atteinte  break");
             break;
         }
         
         cols = arrayOfLines[i].split(" ");
         col1 = cols[0];
    
         //Debut d(un groupe
         if ( col1.length>0) {
        
             var g;
             for(g = 0; g< nbseq; g++){
     
                 
                 if (arraySeq[g] !== col1){
                    // alert("ne corresp pas");
                    champ_alignvide.textContent = "Incorrect Format";
                    champ_alignvide.style.color = "red";
                    IFal = 1;
                    return true;
                 }
                   
                 i++;    
                 cols = arrayOfLines[i].split(" ");
                 col1 = cols[0]; 
             
            }
            
            //alert("fin de boucle groupe avec i:");
          //  alert(i);
      
         }
         
         
         
        
    }
    
    alert("sort de tous les boucles");
   
   //Tout va bien format correcte 
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
     //  alert("box pred vide on sort de format pred");
       return false;
   }
   
   // Sortir de cette fonction si le format de la box 1 est incorrect
   if (IFal === 1){
       //alert("comme format box align incorrecte on sort de test format pred");
       return false;
   }

   

    
    // Lecture des lignes
    var textArea = document.getElementById("pred");
    var arrayOfLines = textArea.value.split("\n"); 
    var i;
    
 
    for(i=0; i<arrayOfLines.length; i++){
            var line = arrayOfLines[i];
          
            // Lecture col1
            var col1 = line.substring(0,7); // a changer ce 7 par longueur d'une col1
            
            // Tester si col1 de box2 correspond a une des col1 de box 1
            if(!arraySeq.includes(col1)){
                
                // Incoherence entre les deux fichiers 
                champ_predvide.textContent = "Mismatch";
                champ_predvide.style.color = "red";
                champ_alignvide.textContent = "Mismatch";
                champ_alignvide.style.color = "red";
                
                arraySeq = [];   // Remettre var globale a vide..
                return true;
            }
    
    }
    
    arraySeq = []; // Remettre var globale a vide
    
    return false; 
}







