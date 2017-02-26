var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);

var champ_predvide = document.getElementById("predvide");


//Fonction principale de validation quand on click sur le bouton submit
function f_valid(e){
   // var cm = content_missing();
    //var fa= format_align();
    //alert("le or");
   // alert( ( cm|| fa));
    if(content_missing() ){
		//|| format_align()){
      //  alert("content missing or format align");
      //  alert(content_missing());
       // alert(format_align());
       // alert("Well a content is missing")
        e.preventDefault();
    }
}

//Fonction testant si le contenus des cases est vide
//renvoie true si une des cases est vide
//et affiche le message "contents missing" a cote de la case vide
function content_missing(){
    //alert("passe dans fonc content missing()");
   var align = document.getElementById("align").value;
   var pred = document.getElementById("pred").value;
   var bool=false;
   
    
     if(align.length < 1 ){
                   //alert('alignlength <1');
                   var champ_alignvide = document.getElementById("alignvide");
                   champ_alignvide.textContent = "Contents missing";
                   champ_alignvide.style.color = "red";
                    bool = true;
     }             
                    
    if(pred.length < 1 ){
                    //alert('pred length <1');
                    // var champ_predvide = document.getElementById("predvide");
                     champ_predvide.textContent = "Contents missing";
                     champ_predvide.style.color = "red";
                     bool = true;
            
    }
   // alert("content missing retourne");
    //alert(bool);
    return bool;
}

//Fonction verifiant le format du texte align
// renvoie true si le format est incorrecte
// NOTE : MAUVAIS TEST POUR LE MOMENT JUSTE EN TRAIN DE TESTER LONG = 3 
function format_align(){
    
      if(content_missing()==false){
        champ_predvide.textContent ="";
        
        //alert("passe meme ici");
    }
    
   // alert("passe dans fonc format");
   //alert("format align retourne");
    var align = document.getElementById("align").value;
    var textArea = document.getElementById("align");
    var arrayOfLines = textArea.value.split("\n"); 
    
 
    
    var i;
    for(i=0; i<arrayOfLines.length; i++){
     //   alert("test length");
       // alert((arrayOfLines[i].length != 3));
        if(arrayOfLines[i].length !== 3){
           //  alert("rentre dans if");
            var champ_alignvide = document.getElementById("alignvide");
             champ_alignvide.textContent = "Incorrect Format";
             champ_alignvide.style.color = "red";
             //alert("true");
            return true;
        }
    }
    
    
  /*  var bool = false;
    var align = document.getElementById("align").value;
    if (align !="a"){
         var champ_alignvide = document.getElementById("alignvide");
                   champ_alignvide.textContent = "Incorrect Format";
                   champ_alignvide.style.color = "red";
                    bool = true;
        
    }
    */
    //alert("false");
    return false;
    
}



