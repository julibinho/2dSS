<?php
function createFiles(){
	$align = "/tmp/align.txt";
	$pred = "/tmp/pred.txt";	
	$f = fopen($align, 'a+');
	$f2 = fopen($pred, 'a+');
	fwrite($f, $_POST['align']);
	fwrite($f2, $_POST['pred']);
	fclose($f);
	fclose($f2);
	return array(0=>$align,1=>$pred);
}

function execute($align, $pred, $size, $separate){
	//chemin vers le premiers script 
	$script = "../scripts/2dsstoaln.py";
	//chemin vers le deuxieme script
	$script2 = "../scripts/2dss.py";
	//premier resultat
	$aln = "/tmp/f.txt";
	//le fichier a afficher
	$res = "/tmp/resultat.txt";
	//execution des scripts
	exec("python ".$script." -alnFile ".$align." -ssFile ".$pred." -o ".$aln);	
	exec("python ".$script2." -inputFile ".$aln." -o ".$res.$size.$separate);
	unlink($aln);
	unlink($align);
	unlink($pred);
	return $res;
}
?>
