<?php
include('variableDAmbiance.php');

//ecrit le formulaire a remplir pour avoir view2Dalignement
function formulaire(){
	echo '<form method="post" action="view2Dalign.php" enctype="multipart/form-data">
		<!-- Boite pour mettre sequence-->

		<label for="align">Insert Sequence here :</label>
		<textarea name="align" id="align" rows=12 cols=80></textarea>
		<span id="alignvide"></span>
		<br />
		Or apload file: 
		<input type="file" id="alignFile" name="alignFile" width="630"/>
		<br /> 

		<!-- Boite pour mettre structure 2D-->

		<br />
		<label for="pred">Insert 2D Structures here :</label>
		<textarea name="pred" id="pred" rows=12 cols=80></textarea>
		<span id="predvide"></span>
	 	<br />
	 	Or apload file:
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

//Utiliser pour tester si $_FILES est vide
function array_empty($tab){
	$cpt = 0;
	foreach($tab as $val)	if($val["size"] == 0)	$cpt++;
	return $cpt;
}

//test les champs et decide lesquels des textarea ou des fichiers vont etre utiliser pour generer le view2DAlignement
function testValidite(){
	if(array_empty($_FILES) == 2)	Display("textarea");
	else{
		if(array_empty($_FILES) == 1)	Display("textarea");
		else	Display("files");
	}
	unset($GLOBALS['_FILES']);
	unset($GLOBALS['_POST']);
}

//test et affichage du resultat
function Display($text){

	if(!format_incorrect_align() and !format_incorrect_pred()){
		$separate="";
		$size="";
	
		if($text == "textarea") $files = createFiles();
		else{
			echo format_incorrect_align();
			$files = array(0 => $_FILES['alignFile']['tmp_name'], 1 => $_FILES['predFile']['tmp_name']);
		}
	
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
	}else{
		echo "<form method='get' action='view2DalignFormulaire.php' enctype='multipart/form-data'><center>";
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}
}


/**
 * 
 * @return True si le format du texte dans la boite align est incorrecte, False sinon
 * Cette fonction verifie le format du texte dans la boite align
 */
function format_incorrect_align(){
	/*Ouvre le fichier et retourne un tableau contenant une ligne par élément*/
	$lines = file($_FILES['alignFile']['tmp_name']);
	$tab = array(); //tableau dans lequel les clefs seront 
	/*Construit le dictionnaire*/
	foreach ($lines as $lineNumber => $lineContent){
		if(preg_match('/^[A-Z]/',$lineContent, $m)){		//test que ce n'est pas une ligne vide
			$tmp = split('      ',$lineContent);
			if(count($tmp)!=2)	return true;		//une ligne a plus de deux colonnes
			if(array_key_exists($tmp[0], $tab))	$tab[$tmp[0]] .= $tmp[1];
			else	$tab[$tmp[0]] = $tmp[1];
		}
	}
	
	//On enleve les espaces et on test que les tailles des alinements sont les memes
	$longueur = array();
	$noms_seqs = array();
	global $noms_seqs;
	
	if(isset($tab)){
		foreach($tab as $key=>$val){
			$tab[$key] = str_replace("\s","",$val);
			$tab[$key] = str_replace("\n","",$tab[$key]);
			$tab[$key] = str_replace(" ","",$tab[$key]);
			//test de la presence de bon elements dans l'alignement de la proteine $key
			if(!preg_match('/^([A-Z]|-)+$/',$tab[$key],$m)) return true;
			$longueur[] = strlen($tab[$key]);
			$noms_seqs[$key] = 1;
		}
		$prem = "";
		foreach($longueur as $val){
			if($prem == "")	$prem = $val;
			if($prem != $val) return true;
		}
	}
	return false;
}

/**
 * 
 * @return {Boolean}  True si le format du texte dans la boite pred est incorrecte, False sinon
 */
function format_incorrect_pred(){
	/*Ouvre le fichier et retourne un tableau contenant une ligne par élément*/
	$lines = file($_FILES['predFile']['tmp_name']);
	$tab = array(); //tableau dans lequel les clefs seront 
	/*Construit le dictionnaire*/
	foreach ($lines as $lineNumber => $lineContent){
		$tmp = split("\t",$lineContent);
		if(count($tmp)!=2)	return true;		//une ligne a plus de deux colonnes
		if(array_key_exists($tmp[0], $tab))	$tab[$tmp[0]] .= $tmp[1];
		else	$tab[$tmp[0]] = $tmp[1];
		
	}
	return false;
}	
?>
