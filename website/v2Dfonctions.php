<?php
function formulaire(){
	/*
	"""
		Creer le formulaire de ViewAlignement2D 
	"""
	*/
	
	return '<form method="post" action="view2Dalign.php" enctype="multipart/form-data">
		<!-- Boite pour mettre sequence-->

		<label for="align">Insert Sequence here :</label>
		<textarea name="align" id="align" rows=12 cols=80></textarea>
		<span id="alignvide"></span>
		<br />
		<label for="alignFile">Or upload file: </label>
		<input type="file" id="alignFile" name="alignFile" width="630"/>
		<br /> 

		<!-- Boite pour mettre structure 2D-->

		<br />
		<label for="pred">Insert 2D Structures here :</label>
		<textarea name="pred" id="pred" rows=12 cols=80></textarea>
		<span id="predvide"></span>
	 	<br />
	 	<label for="predFile">Or upload file:</label>
		<input type="file" id="predFile" name="predFile" width="630"/>
		<br />
		<br />
		<br />
		<label for="ali2D">Or upload file alignement2D :</label>
		<input name="ali2D" id="ali2D" type="file" width="630"/>
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
		<center><input type="submit" value="submit" id="submit_button"/></center>
	 	<br />
	      </form>
	      <script type="text/javascript" src="js/submit.js"></script>';
}

function createFiles(){
	/*
	"""
	creation des fichiers alignements de proteines et prediction 2D de celles ci
	"""
	*/
	
	$f = fopen(ALIGN, 'a+');
	$f2 = fopen(PRED, 'a+');
	fwrite($f, $_POST['align']);
	fwrite($f2, $_POST['pred']);
	fclose($f);
	fclose($f2);
	return array(0=>ALIGN,1=>PRED);
}

function execute($files, $size, $separate){
	/*
	"""
	execution et creation du resultat dans le fichier donne par la variable RESULTAT de visualisation l'alignement 2D
	@param {array} files : contient les fichiers utiliser lors du premier traitement c'est a dire soit le fichier d'alignement et le fichier de prediction soit le fichier d'alignement 2D
	@param {string} size : contient une dimension particuliere pour la largeur de la visualisation peut etre vide
	@param {string} separate : option permettant de savoir si l'alignement doit etre separer de sa prediction peut etre vide
	"""
	*/
	
	//execution des scripts
	if(count($files)==2){
		exec("python ".SCRIPT_2DSSTOALN." -alnFile ".$files[0]." -ssFile ".$files[1]." -o ".PREMIER_RESULTAT);
	}else{
		exec("python ".SCRIPT_CONVERTALI2D." ".$files[0]." ".PREMIER_RESULTAT);
	}
	exec("python ".SCRIPT_2DSS." -t 1 -inputFile ".PREMIER_RESULTAT." -o ".RESULTAT.$size.$separate);
	unlink(PREMIER_RESULTAT);
	unlink(ALIGN);
	unlink(PRED);
}

function array_empty(){
	/*
	"""
	Permet de savoir dans quel cas utiliser les informations contenu dans les textarea dans les files leurs correspondant ou bien dans le fichier recuperer du site web ????
	"""
	*/
	
	$cpt = 0;
	if($FILES["alignFile"]["size"] == 0)	$cpt++;
	if($FILES["predFile"]["size"] == 0)	$cpt++;
	if($FILES["ali2D"]["size"] == 0 && $cpt==2)	return $cpt;
	else{
		if($FILES["ali2D"]["size"] != 0)	return 3;
		else {
			if($cpt==1)	return 2;
			else return 1;
		} 
	}
}

function testValidite(){
	/*
	"""
	Test les champs et decide lesquels des textarea, des fichiers leur correspondant ou bien le fichier recuperer du site web ??? vont etre utiliser pour generer le view2DAlignement
	"""
	*/
	
	if(array_empty() == 3)	Display("ali2D");
	else{
		if(array_empty() == 2){
			Display("textarea");
		}
		else{
			Display("files");
		}
	}
	unset($GLOBALS['_FILES']);
	unset($GLOBALS['_POST']);
}

//test et affichage du resultat
function Display($text){
	/*
	"""
	Permet l'affichage de la visualisation de l'alignement 2D dans les trois cas.
	Si jamais on utilise les fichiers une verification est operer si jamais on utilise les textarea la verification a ete faite dans le submit.js et enfin si on utilise le fichier ali2d du site web ??? 
	@param {string} : permettant de savoir quel cas on va traiter
	"""
	*/
	
	$separate="";
	$size="";
	$files ="";
	if($text == "textarea") $files = createFiles();
	else{
		if($text == "files"){
			if(!format_incorrect_align() && !format_incorrect_pred()){
				$files = array(0 => $_FILES['alignFile']['tmp_name'], 1 => $_FILES['predFile']['tmp_name']);
			}
		}else{	
			$files = array(0 => $_FILES['ali2D']['tmp_name']);
		}
	}
	if($files != ""){
		if(isset($_POST['separate']))	$separate = " --s";

		if(isset($_POST['size'])){
			if($_POST['size']>68)	$size .= " -size 68";
			else{
				if($_POST['size']<60)	$size .= " -size 60";
				else	$size .= " -size ".$_POST['size'];
			}
		}		

		echo "<form method='get' action='view2DalignFormulaire.php' enctype='multipart/form-data'><center>";
		execute($files,$size, $separate);
		if(readfile(RESULTAT)!="")	echo "<button type='submit' formaction='download.php'>PDF</button>";
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}else{
		echo "<form method='get' action='view2DalignFormulaire.php' enctype='multipart/form-data'><center>";
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}
}

function format_incorrect_align(){
	/*
	"""
	Cette fonction verifie le format du texte dans la boite align
	@return {Boolean} : True si le format du texte dans la boite align est incorrecte, False sinon
	"""
	*/

	//Ouvre le fichier et retourne un tableau contenant une ligne par élément
	$lines = file($_FILES['alignFile']['tmp_name']);
	$tab = array(); //tableau dans lequel les clefs seront 
	//Construit le dictionnaire
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

function format_incorrect_pred(){
	/*
	"""
	Cette fonction verifie le format du texte dans la boite pred
	@return {Boolean}  True si le format du texte dans la boite pred est incorrecte, False sinon
	"""
	*/

	//Ouvre le fichier et retourne un tableau contenant une ligne par élément
	$lines = file($_FILES['predFile']['tmp_name']);
	$tab = array(); //tableau dans lequel les clefs seront 
	//Construit le dictionnaire
	foreach ($lines as $lineNumber => $lineContent){
		$tmp = split("\t",$lineContent);
		if(count($tmp)!=2)	return true;		//une ligne a plus de deux colonnes
		if(array_key_exists($tmp[0], $tab))	$tab[$tmp[0]] .= $tmp[1];
		else	$tab[$tmp[0]] = $tmp[1];
		
	}
	return false;
}	
?>
