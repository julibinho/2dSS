var validation = document.getElementById('submit_button');
validation.addEventListener('click',f_valid);


//Fonction principale de validation quand on click sur le bouton submit
function f_valid(e){
    if(content_missing()){
        e.preventDefault();
    }
}

//Fonction testant si le contenus des cases est vide
function content_missing(){
   var align2 = document.getElementById("align").value;
   var pred2 = document.getElementById("pred").value;
   var bool=false;
   
    
     if(align2.length < 1 ){
                  //  alert('hello');
                    var champ_vide1 = document.getElementById('AlignManquant');
                    champ_vide1.textContent = "Content missing";
                    champ_vide1.style.color = "red";
                    bool = true;
     }             
                    
    if(pred2.length < 1 ){
                    //alert('helllooo');
                     var champ_vide2 = document.getElementById('2Dmanquant');
                     champ_vide2.textContent = "Contents missing";
                     champ_vide2.style.color = "red";
                     bool = true;
            
    }
                  
    return bool || bool2;
}
