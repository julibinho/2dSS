var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_predvide = document.getElementById("predvide");
var champ_alignvide = document.getElementById("alignvide");

//Var global stockant les noms eg d1x9fc_, d1jl7a_ ...
var arraySeq = []; 

//var premierefois = 1;

// Boolean indiaquant si IncorrectFormat dans contenu de  Box Align (box 1)
var IFal = 0;


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
    
    alert("entre dans fonction formatincorr box align");
    alert("arrayseq au debut");
    arraySeq = [];
    alert(arraySeq);
    
    
    if (content_missing_box_align()){
        return false;
    }
   
    var textArea = document.getElementById("align");
    var arrayOfLines = textArea.value.split("\n"); 
    var nolignes = arrayOfLines.length; //le nombre de lignes total 
    
    var i;
    
    //Lecture des lignes vides /entres 
    //On commence a i=1 car la premiere ligne contient le titre
    for(i=1; i<arrayOfLines.length; i++){
        if(arrayOfLines[i].length !== 0){
               break;
        }
    }
   
    var j=0; //commencer a partir de la ligne contenant le sequence
    var premiere_i = i;
    
   
   // WHILE  
    while(j<5){
               
        //Arrive a fin      
        if (i+j > nolignes-1){
             break;
        }
        
        //Lecture d'une ligne
        var line = arrayOfLines[i+j]; 
        var longligne = line.length;
        
        if (j===0){
            var longfirsli = longligne;
        }
        /*
         //test si longeur d'une ligne est bien 73
        if(longligne !== 73){
           champ_alignvide.textContent = "Incorrect Format";
           champ_alignvide.style.color = "red";
           return true;
        }
        */
        //test si la premiere colonne ne contient pas d'espace
        var col1 = line.substring(0,7);
        if (col1.includes(" ")){
          //  alert("premiere colonne contient espace donc sort");
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             
             IFal = 1;
             
             return true;
        
        //Sinon on le stock dans notre var global pour verifier la coherence 
        }else{
            if(i  === premiere_i ){
           //     alert("entre dans test premiere ligne, affichons le aray apres ajout");
                 arraySeq.push(col1);
                 alert(arraySeq);
           
            }else{
                
                if(col1 !== arraySeq[j]){
                    
             //       alert("oops ne correspondent pas car");
              //      alert(col1);
               //     alert("nest pas egal a");
                 //   alert(arraySeq[j]);
                    champ_alignvide.textContent = "Incorrect Format";
                    champ_alignvide.style.color = "red";
                    
                    IFal = 1;
                    
                     return true;
                    
                }
            }
        }
        
        //test 2e colonne est bien 'vide'
        var col2 = line.substring(7,13);
        if (col2 !== "      "){
           // alert("col2 pas 'vide' donc sort");
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             
             IFal = 1;
             
             return true;
        }
        
        //test si les longueurs des 3e colonnes d'un meme groupe sont egales       
        var longcol3 = longligne - 13 + 1;
        if (longcol3 !== longfirsli -13 + 1 ){
           //  alert("difference longueur!!! donc sort");
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             
             IFal = 1;
             
             return true;
        }
        //test si la 3e colonne ne contient pas d'espace
        var col3 = line.substring(13,longfirsli);
        if (col3.includes(" ")){
          //  alert("col3 contient estpace donc sort");
            champ_alignvide.textContent = "Incorrect Format";
            champ_alignvide.style.color = "red";
            
            IFal = 1;
            return true;
        }
        
        //Arrive a fin d'un groupe
        if(j===4){
          //  alert("fin de groupe passe au groupe suivant");
            i = i + 7; //Passer au groupe suivant ignorant la ligne contenant les : . *
            j=0;
        }else{
          //  alert("fin ligne passe a ligne suivante");
            j++;
        }
    }
       
    alert("array seq a la fin de tous les groupes");
    alert(arraySeq);
    
   //  if (premierefois === 1){
     //   premierefois = 0;
    //}
    
    IFal = 0;
    
    return false; 
}

// Fonction testant si le format dans box 2 incorrecte   
function format_incorrect_box_pred(){
   // alert("entre dans formatinc box pred");
   // alert("ici arrayseq");
   // alert(arraySeq);
   
   // Sortir de cette fonction si la box 2 est vide
   if (content_missing_box_pred()){
       return false;
   }
   
   // Sortir de cette fonction si la box 1 est vide
   if(content_missing_box_align()){
     //  alert("box pred vide on sort de format pred");
       return false;
   }
   
   // Sortir de cette fonction si le format de la box 1 est incorrect
   if (IFal === 1){
       //alert("comme format box align incorrecte on sort de test format pred");
       return false;
   }

   
     //alert("continue dans fonction box pred, le array seq :");
    //alert(arraySeq);
    
    
    // Lecture des lignes
    var textArea = document.getElementById("pred");
    var arrayOfLines = textArea.value.split("\n"); 
    var i;
    
 
    for(i=0; i<arrayOfLines.length; i++){
            var line = arrayOfLines[i];
          
            // Lecture col1
            var col1 = line.substring(0,7);
            
            // Tester si col1 de box2 correspond a une des col1 de box 1
            if(!arraySeq.includes(col1)){
                
                // Incoherence entre les deux fichiers 
                champ_predvide.textContent = "Mismatch";
                champ_predvide.style.color = "red";
                champ_alignvide.textContent = "Mismatch";
                champ_alignvide.style.color = "red";
                
                arraySeq = [];   // Remarque ask teacher why ...
                return true;
            }
            
            
            
    }
    
    arraySeq = []; // Remarque ask teacher why...
    
    return false; 
}







