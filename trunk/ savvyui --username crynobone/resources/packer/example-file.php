<?php
// you can pass this script to PHP CLI to convert your file.

// adapt these 2 paths to your files.
$file = ['savvy.animator.js','savvy.base.js','savvy.calendar.js','savvy.drag.js','savvy.dropmenu.js','savvy.form.js','savvy.resize.js','savvy.tabber.js','savvy.ticker.js','savvy.window.js'];
$src = '../deploy/';
$out = '../deploy/pack/';

// or uncomment these lines to use the argc and argv passed by CLI :
/*
if ($argc >= 3) {
	$src = $argv[1];
	$out = $argv[2];
} else {
	echo 'you must specify  a source file and a result filename',"\n";
	echo 'example :', "\n", 'php example-file.php myScript-src.js myPackedScript.js',"\n";
	return;
}
*/

require 'class.JavaScriptPacker.php4';
foreach ($files as $file) :
	$script = file_get_contents($src.$file);
	
	$t1 = microtime(true);
	
	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();
	
	$t2 = microtime(true);
	$time = sprintf('%.4f', ($t2 - $t1) );
	echo 'script ', $src, ' packed in ' , $out, ', in ', $time, ' s.', "\n";
	
	file_put_contents($out.$file, $packed);
endforeach;
?>
