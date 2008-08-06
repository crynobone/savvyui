<?php
	$src = '../deploy/';
	$files = $_POST['build'];
	$files = array_reverse($files);
	$compress = $_POST['compress'];
	$option = array('Uncompress', 'None', 'Normal');
	if(!in_array($compress, $option)) :
		$compress = 'None';
	endif;
	
	array_push($files, 'savvy-base.js');
	$files = array_reverse($files);
	require 'class.JavaScriptPacker.php';
	$script = '';
	foreach ($files as $file) :
		$script .= "\n";
		$script .= file_get_contents($src.$file);
	endforeach;
	
	
	header("Content-Type: text/javascript");
	header("Content-Disposition: attachment; filename=savvy-build.js");
	if($compress != 'Uncompress') :
		$packer = new JavaScriptPacker($script, $compress, true, false);
		$packed = $packer->pack();
		echo $packed;
	else :
		echo $script;
	endif;
?>