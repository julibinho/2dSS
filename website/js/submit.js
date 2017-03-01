var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_predvide = document.getElementById("predvide");
var champ_alignvide = document.getElementById("alignvide");

//Var global stockant les noms eg d1x9fc_, d1jl7a_ ...
var arraySeq = []; 


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
 
// Fonction testant si al boite 1 est vide  
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

// Fonction testant si la boite 2 est vide
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

// Fonction testant si le format dans boite 1 incorrecte
function format_incorrect_box_align(){
    
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
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             return true;
        
        //Sinon on le stock dans notre var global pour verifier la coherence 
        }else{
            if(i  === premiere_i ){
            arraySeq.push(col1);
           
            }else{
                
                if(col1 !== arraySeq[j]){
                    alert("oops ne correspondent pas");
                    champ_alignvide.textContent = "Incorrect Format";
                    champ_alignvide.style.color = "red";
                     return true;
                    
                }
            }
        }
        
        //test 2e colonne est bien 'vide'
        var col2 = line.substring(7,13);
        if (col2 !== "      "){
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             return true;
        }
        
        //test si les longueurs des 3e colonnes d'un meme groupe sont egales       
        var longcol3 = longligne - 13 + 1;
        if (longcol3 !== longfirsli -13 + 1 ){
             alert("difference longueur!!!");
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             return true;
        }
        //test si la 3e colonne ne contient pas d'espace
        var col3 = line.substring(13,longfirsli);
        if (col3.includes(" ")){
            champ_alignvide.textContent = "Incorrect Format";
            champ_alignvide.style.color = "red";
            return true;
        }
        
        //Arrive a fin d'un groupe
        if(j===4){
            i = i + 7; //Passer au groupe suivant ignorant la ligne contenant les : . *
            j=0;
        }else{
            j++;
        }
    }
       
    return false; 
}

// TO DO TO DO ! INCOMPLETE 
// Fonction testant si le format dans boite 2 incorrecte   -> TO DO 
function format_incorrect_box_pred(){
   if (content_missing_box_pred()){
       return false;
   }
   
    var textArea = document.getElementById("pred");
    var arrayOfLines = textArea.value.split("\n"); 
    var i;
    for(i=0; i<arrayOfLines.length; i++){
     //   alert("test length");
       // alert((arrayOfLines[i].length != 3));
        if(arrayOfLines[i].length !== 3){
     
             champ_predvide.textContent = "Incorrect Format";
             champ_predvide.style.color = "red";
             //alert("true");
            return true;
        }
    }
    
    return false; 
}







