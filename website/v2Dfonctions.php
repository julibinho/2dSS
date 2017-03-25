<?php
include('variableDAmbiance.php');

function formulaire(){
	echo '<h2>You can insert your data directly here</h2>
                
                <form method="post" action="view2Dalign.php" enctype="multipart/form-data">

                        <!-- Boite pour mettre sequence-->

               		<label for="align">Insert Sequence here :</label>
                	<textarea name="align" id="align" rows=12 cols=80></textarea>
                        <span id="alignvide"></span>
                        Or apload : 
                	<input type="file" id="alignFile" name="alignFile" width="630"/>
			<br /> 

                	<!-- Boite pour mettre structure 2D-->

                	<br />
                	<label for="pred">Insert 2D Structures here :</label>
                	<textarea name="pred" id="pred" rows=12 cols=80></textarea>
                        <span id="predvide"></span>
                 	<br />
                 	Or apload :
                	<input type="file" id="predFile" name="predFile" width="630"/>
                	<br />
                	<br />
                	<input<!--Specifier taille sortie-->
                	<label for="size">Output Size:</label>
                	<input type="number" id="size" name="size" rows=1 cols=1 min="0"/>
			<br />
			<!--Separer-->
			<label for="separate">Separate</label>
                	<input type="checkbox" id="separate" name="separate" />	
                	<br />
                	<br />
                	<input type="submit" value="submit" id="submit_button"/>
                 	<br />
                </form>
                <script type="text/javascript" src="js/submit.js"></script>';
}

//creation des fichiers alignements de proteines et prediction 2D de celles ci
function createFiles(){
	$f = fopen(ALIGN, 'a+');
	$f2 = fopen(PRED, 'a+');
	fwrite($f, $_POST['align']);
	fwrite($f2, $_POST['pred']);
	fclose($f);
	fclose($f2);
	return array(0=>ALIGN,1=>PRED);
}

//execution et renvois du resultat c'est a dire le fichier de l'alignement 2D
function execute($align, $pred, $size, $separate){
	//execution des scripts
	exec("python ".SCRIPT_2DSSTOALN." -alnFile ".$align." -ssFile ".$pred." -o ".PREMIER_RESULTAT);	
	exec("python ".SCRIPT_2DSS." -inputFile ".PREMIER_RESULTAT." -o ".RESULTAT.$size.$separate);
	unlink(PREMIER_RESULTAT);
	unlink(ALIGN);
	unlink(PRED);
}

function testValidite(){
	error_reporting(E_ALL);
	$retour = 1;
	if(empty($_FILES["alignFile"]) and empty($_FILES["predFile"])){
		if(!empty($_POST["align"]) and !empty($_POST["pred"])){
			Display("textarea");
		}else{
			print "jaja";
			echo '<a href="javascript:history.go(-1);">Remplissez les champs !</a>';
		}
	}else{
		if(empty($_FILES["alignFile"])){
			if(!empty($_POST["align"]) and !empty($_POST["pred"])){
				Display("textarea");
			}else{
				echo "Le fichier d'alignement des proteines est obligatoire.<br />";
			}
		}else{
			if(empty($_FILES["predFile"])){
				if(empty($_POST["align"]) and empty($_POST["pred"])){
					Display("textarea");
				}else{
					echo "Le fichier de prediction 2D des proteines est obligatoire.<br />";
				}
			}else{
				print "hoho";
				Display("files");
			}
		}
			
	}
	unset($GLOBALS['_FILES']);
	unset($GLOBALS['_POST']);
}

//test et affichage du resultat
function Display($textOrFiles){
	unlink(RESULTAT);
	$separate="";
	$size="";
	
	if($textOrFiles == "textarea") createFiles();
	else $files = array(0 => $_FILES['alignFile']['tmp_name'], 1 => $_FILES['predFile']['tmp_name']);

	if(isset($_POST['separate']))	$separate = " --s";

	if(isset($_POST['size'])){
		if($_POST['size']>68)	$size .= " -size 68";
		else{
			if($_POST['size']<60)	$size .= " -size 60";
			else	$size .= " -size ".$_POST['size'];
		}
	}		

	echo "<form method='get' action='view2DalignFormulaire.php' enctype='multipart/form-data'><center>";
	execute($files[0],$files[1],$size, $separate);
	if(readfile(RESULTAT)!="")	echo "<button type='submit' formaction='download.php'>PDF</button>";
	
	echo "<input type='submit' value='previous'/></center>";
	echo "</form>";
}
?>
