<?php
function formulaireCP(){
	/*
	"""
		Creer le formulaire de Compare prediction 
	"""
	*/
	return '<form name="compare" method="post" action="comparepred.php" enctype="multipart/form-data">
                <!-- Boite pour mettre query-->
       		<label for="query">Insert Query here :</label>
        	<textarea name="query" id="query" rows=1 cols=80></textarea>
        	<button name="b" type="button" onclick="document.compare.query.value=\'\';" >Clear</button>
		<br />
                <span id="queryvide"></span>
        	<!-- Boite pour mettre predictions-->
        	<br /><br />
        	<label for="preds">Insert 2D Predictions here (with respective tool names) :</label>
        	<textarea name="preds" id="preds" rows=3 cols=80></textarea>
        	<button name="b" type="button" onclick="document.compare.preds.value=\'\';" >Clear</button>
		<br />
                <span id="predsvide"></span>
         	<br /><br /><br />
                <!-- Boite pour upload sequence-->
        	<label for="quick2D">Or upload Quick2D File:</label>
        	<input type="file" id="quick2D" name="quick2D" width="630"/>
		<br />
		<span id="filevide"></span>
		<br /><br /><br />	
         	<center><input type="submit" value="submit" id="submit_button"/></center>
               	</form>
                <script type="text/javascript" src="js/submitComparepreds.js"></script>';
}

function createFiles(){
	/*
	"""
	creation du fichier quick si jamais on utilise les textarea
	"""
	*/
	
	$f = fopen(QUICK, 'w');
	fwrite($f, "QUERY ".$_POST['query']."\n");
	fwrite($f, $_POST['preds']);
	fclose($f);
	return "bon";
}

function execute($text){
	if($text != "textarea"){
		exec("python ".SCRIPT_CONVERTQUICK2D." ".$_FILES['quick2D']." ".QUICK);
	}
	echo $text;
	readfile($_POST);
	readfile($_FILES['quick2D']);
	exec("python ".SCRIPT_2DSS." -t 2 -inputFile ".QUICK." -outputFile ".RESULTAT.$_SERVER['REMOTE_ADDR'].".svg");
	return "bon";
}

function testValidite(){
	/*
	"""

	"""
	*/
	
	if($_FILES['quick2D']['size'] != 0)	Display("file");
	else{
		Display("textarea");
	}
	unset($GLOBALS['_FILES']);
	unset($GLOBALS['_POST']);
}

function Display($text){
	/*
	"""
	@param {string} : permettant de savoir quel cas on va traiter
	"""
	*/
	
	$ok="";
	if($text == "textarea") $ok = createFiles();
	else{
		if($text == "file"){
			echo format_incorrect_file();
			if(!format_incorrect_file()){
				$ok = "bon";
			}
		}
	}
	echo $ok;
	if($ok != ""){
		echo "<form method='get' action='comparepredFormulaire.php' enctype='multipart/form-data'><center>";
		execute($text);
		if(readfile(RESULTAT.$_SERVER['REMOTE_ADDR'].".svg")!="")	echo "<button type='submit' formaction='download.php'>PDF</button>";
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}else{
		echo "<form method='get' action='comparepredFormulaire.php' enctype='multipart/form-data'><center>";
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}
}

function format_incorrect_file(){
	/*
	"""
	Cette fonction vérifie le format de la boite 
	@return {Boolean} : True si le format du texte dans la boite query est incorrecte, False sinon
	"""
	*/

	//Ouvre le fichier et retourne un tableau contenant une ligne par élément
	$lines = file($_FILES['quick2D']['tmp_name']);
	var_dump($lines);
	$tab = array(); //tableau dans lequel les clefs seront 
	//Construit le dictionnaire
	foreach ($lines as $lineNumber => $lineContent){
		if(preg_match('/^[A-Z]/',$lineContent, $m)){		//test que ce n'est pas une ligne vide
			$tmp = split(' ',$lineContent);
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
			$tab[$key] = str_replace("\t","",$tab[$key]);
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

?>
