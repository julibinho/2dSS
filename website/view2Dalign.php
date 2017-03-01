<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Voope</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="css/coin-slider.css" />
<script type="text/javascript" src="js/cufon-yui.js"></script>
<script type="text/javascript" src="js/cufon-yanone.js"></script>
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/script.js"></script>
<script type="text/javascript" src="js/coin-slider.min.js"></script>
</head>
<body>
<div class="main">
  <div class="header">
    <div class="header_resize">
      <div class="menu_nav">
        <ul>
          <li class="active"><a href="index.html"><span>Home</span></a></li>
          <li><a href="support.html"><span>Help</span></a></li>
          <li><a href="about.html"><span>Examples</span></a></li>
          <li><a href="contact.html"><span>Contact Us</span></a></li>
        </ul>
      </div>
      <div class="clr"></div>
      <div class="logo">
        <h1><a href="index.html">2d<span>SS</span> <small>secondary structure visualization</small></a></h1>
      </div>
      <div class="clr"></div>
      <div class="slider">
        <div id="coin-slider"> 
        <a href="#">
        <img src="images/slide1.png" width="960" height="320" alt="" /> </a>
        <img src="images/slide2.png" width="960" height="320" alt="" /></a>
        </div>
        <div class="clr"></div>
      </div>
      <div class="clr"></div>
    </div>
  </div>
    
    <!--BODY OF SECTION -->
  <div class="content">
    <div class="content_resize">
      <div class="mainbar">
        <div class="article"> 
            <h2><center>Compute 2d Alignment</center></h2>
        <!-- <p class="infopost">Posted <span class="date">on 11 sep 2018</span> by <a href="#">Admin</a> &nbsp;&nbsp;|&nbsp;&nbsp; Filed under <a href="#">templates</a>, <a href="#">internet</a></p> -->    
        
        </div> 
          
        <div class="article"> 
          
          <div class="clr"></div>
            <div class="post_content">
<?php
//chemin vers le premiers script 
$script = "/var/www/html/2dSS-master/scripts/2dsstoaln.py";

//chemin vers le deuxieme script
$script2 = "/var/www/html/2dSS-master/scripts/2dss.py";

//premier resultat
$aln = "/tmp/f.txt";

//le fichier a afficher
$res = "/tmp/resultat.txt";
$separate="";
$size="";

//On test si les textarea sont rempli
if(isset($_POST['align']) and isset($_POST['pred'])){ 
	$align = "/tmp/align.txt";
	$pred = "/tmp/pred.txt";	
	$f = fopen($align, 'a+');
	$f2 = fopen($pred, 'a+');
	fwrite($f, $_POST['align']);
	fwrite($f2, $_POST['pred']);
	fclose($f);
	fclose($f2);
//On test si des fichiers on ete rentres
}else{
	if(isset($_FILES['align']) and isset($_FILES['pred'])){
		$align = $_FILES['align']['tmp_name'];
		$pred = $_FILES['pred']['tmp_name'];
	}		
}

//test si l'option separate a ete utilise
if(isset($_POST['separate'])){
	$separate = " --s";
}

//test si la largeur a ete modifie
if(isset($_POST['size'])){
	if($_POST['size']>68){
		$size .= " -size 68";
	}else{
		if($_POST['size']<50){
			$size .= " -size 50";
		}else{
			$size .= " -size ".$_POST['size'];
		}
	}
}

//execution des scripts
exec("python ".$script." -alnFile ".$align." -ssFile ".$pred." -o ".$aln);	
exec("python ".$script2." -inputFile ".$aln." -o ".$res.$size.$separate);
	
//affichage sur la page dans mainbar
readfile($res);

//les fichiers sont vider et les variables globales remises a vide
file_put_contents($aln,'');
file_put_contents($align,'');
file_put_contents($pred,'');
file_put_contents($res, '');
unset($GLOBALS['_FILES']);
unset($GLOBALS['_POST']);

echo "<form method='get' action='compute.html' enctype='multipart/form-data'>";
echo "<center><input type='submit' value='previous'/></center>";
echo "</form>";
?> 
               
          </div> 
          <div class="clr"></div>
        </div>
      </div>
      
        
      <!--MENU A DROITE-->
        
      <div class="sidebar">
        <div class="gadget">
          <h2 class="star">Menu</h2>
          <div class="clr"></div>
          <ul class="sb_menu">
            <li><a href="#">View 2d Alignment</a></li>
            <li><a href="compute.html">Compute 2d Alignment</a></li>
            <li><a href="#">Compare Predictions</a></li>
          </ul>
        </div>
        <div class="gadget">
         
          <div class="clr"></div>
        </div>
      </div>
      <div class="clr"></div>
    </div>
  </div>
  <div class="fbg">
    <div class="fbg_resize">
      <div class="col c1">
        <h2><span>Image</span> Gallery</h2>
        <a href="#"><img src="images/gal1.jpg" width="75" height="75" alt="" class="gal" /></a> <a href="#"><img src="images/gal2.jpg" width="75" height="75" alt="" class="gal" /></a> <a href="#"><img src="images/gal3.jpg" width="75" height="75" alt="" class="gal" /></a> <a href="#"><img src="images/gal4.jpg" width="75" height="75" alt="" class="gal" /></a> <a href="#"><img src="images/gal5.jpg" width="75" height="75" alt="" class="gal" /></a> <a href="#"><img src="images/gal6.jpg" width="75" height="75" alt="" class="gal" /></a> </div>
      <div class="col c2">
        <h2><span>Services</span> Overview</h2>
        <p>Curabitur sed urna id nunc pulvinar semper. Nunc sit amet tortor sit amet lacus sagittis posuere cursus vitae nunc.Etiam venenatis, turpis at eleifend porta, nisl nulla bibendum justo.</p>
        <ul class="fbg_ul">
          <li><a href="#">Lorem ipsum dolor labore et dolore.</a></li>
          <li><a href="#">Excepteur officia deserunt.</a></li>
          <li><a href="#">Integer tellus ipsum tempor sed.</a></li>
        </ul>
      </div>
      <div class="col c3">
        <h2><span>Contact</span> Us</h2>
        <p>Nullam quam lorem, tristique non vestibulum nec, consectetur in risus. Aliquam a quam vel leo gravida gravida eu porttitor dui.</p>
        <p class="contact_info"> <span>Address:</span> 1458 TemplateAccess, USA<br />
          <span>Telephone:</span> +123-1234-5678<br />
          <span>FAX:</span> +458-4578<br />
          <span>Others:</span> +301 - 0125 - 01258<br />
          <span>E-mail:</span> <a href="#">mail@yoursitename.com</a> </p>
      </div>
      <div class="clr"></div>
    </div>
  </div>
  <div class="footer">
    <div class="footer_resize">
      <p class="lf">Copyright &copy; <a href="#">Domain Name</a>. All Rights Reserved</p>
      <p class="rf">Design by <a target="_blank" href="http://www.dreamtemplate.com/">DreamTemplate</a></p>
      <div style="clear:both;"></div>
    </div>
  </div>
</div>
</body>
</html>
