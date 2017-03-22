<?php
include('variableDAmbiance.php');

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

//test et affichage du resultat
function testAndDisplay(){
	unlink(RESULTAT);
	$separate="";
	$size="";

	if(isset($_POST['align']) and isset($_POST['pred']))	$files = createFiles();
	else	if(isset($_FILES['align']) and isset($_FILES['pred']))	$files = array(0 => $_FILES['align']['tmp_name'], 1 => $_FILES['pred']['tmp_name']);

	if(isset($_POST['separate']))	$separate = " --s";

	if(isset($_POST['size'])){
		if($_POST['size']>68)	$size .= " -size 68";
		else{
			if($_POST['size']<60)	$size .= " -size 60";
			else	$size .= " -size ".$_POST['size'];
		}
	}		

	echo "<form method='get' action='view2Dalign.html' enctype='multipart/form-data'><center>";
	execute($files[0],$files[1],$size, $separate);
	if(readfile(RESULTAT)!="")	echo "<button type='submit' formaction='download.php'>PDF</button>";
	
	echo "<input type='submit' value='previous'/></center>";
	echo "</form>";

	unset($GLOBALS['_FILES']);
	unset($GLOBALS['_POST']);
}
?>
