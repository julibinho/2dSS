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
        	<input type="file" id="quick2D" name="quick2D" width="630"/><a href="https://toolkit.tuebingen.mpg.de/quick2_d">site quick2D</a>
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
	fwrite($f, "QUERY\t".$_POST['query']."\n");
	fwrite($f, $_POST['preds']);
	fclose($f);
	return "bon";
}

function execute($text){
	/*
	"""
	Execution des script si le textarea est rempli et non les fichiers on n'execute que le script 2DSS sinon il faut qu'on passe le fichier dans le script convertquick2D pour qu'il corresponde à la sortie que l'on veut et ensuite on n'execute que le script 2DSS.
	@return {String} : on retourne un string non vide pour satisfaire le test dans display.
	"""
	*/
	if($text != "textarea"){
		exec("python ".SCRIPT_CONVERTQUICK2D." ".$_FILES['quick2D']['tmp_name']." ".QUICK);
	}
	exec("python ".SCRIPT_2DSS." -t 2 -inputFile ".QUICK." -outputFile ".RESULTAT.$_SERVER['REMOTE_ADDR'].".svg");
	unlink(QUICK);
	return "bon";
}

function testValidite(){
	/*
	"""
	permet de savoir ce qu'on va utiliser du textarea ou du fichier
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
	Excecute et affiche le resultat
	@param {string} : permettant de savoir quel cas on va traiter
	"""
	*/
	
	$ok="";
	if($text == "textarea") $ok = createFiles();
	else{
		if($text == "file"){
			$ok = "bon";
		}
	}
	if($ok != ""){
		echo "<form method='get' action='comparepredFormulaire.php' enctype='multipart/form-data'><center>";
		execute($text);
		readfile(RESULTAT.$_SERVER['REMOTE_ADDR'].".svg");
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}else{
		echo "<form method='get' action='comparepredFormulaire.php' enctype='multipart/form-data'><center>";
		echo "<input type='submit' value='previous'/></center>";
		echo "</form>";
	}
}
?>
