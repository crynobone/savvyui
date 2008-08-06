<?php
	$files = array(
		'savvy-base.js',
		'ext/ajax.js',
		'ext/animator.js',
		'ext/drag.js',
		'ext/jsclass.js',
		'ext/form.js',
		'ext/helper.js',
		'ext/panel.js',
		'ext/resize.js',
		'ext/winpanel.js',
		'ext/cookie.js',
		'util/anchor.js',
		'util/calendar.js',
		'util/dropmenu.js',
		'util/simpletab.js',
		'util/ticker.js',
		'util/toggler.js'
	);
	$src = '../deploy/';
	$out = '../deploy/pack/savvy.js';
	
	
	require 'class.JavaScriptPacker.php';
	$script = '';
	foreach ($files as $file) :
		$script .= "\n";
		$script .= file_get_contents($src.$file);
	endforeach;
	$t1 = microtime(true);
	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();
	$t2 = microtime(true);
	$time = sprintf('%.4f', ($t2 - $t1) );
	echo 'script ', $src.$file, ' packed in ' , $out.$file, ', in ', $time, ' s.', "<br />";
	file_put_contents($out, $packed);
?>
