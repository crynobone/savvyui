<?php
	require 'class.JavaScriptPacker.php';
	
	$files = array(
		'base',
		'create',
		'adapter',
		'config',
		'setup',
		'language/lang-en',
		'parse',
		'test',
		'ext/validate',
		'util/activecontent',
		'util/buttonsubmit',
		'util/dimension',
		'util/formsubmit',
		'util/ticker',
		'util/editable',
		'util/includer',
		'util/smartinput',
		'widget/activity',
		'widget/datepicker',
		'widget/dropmenu',
		'widget/iconizer',
		'widget/panel',
		'widget/dialog',
		'widget/notice',
		'widget/tab'
	);
	
	$cp = file_get_contents('header.txt');
	$cp .= "\n\n";
	
	// Loop file
	foreach ($files as $file) :
		$script .= file_get_contents('../../'.$file.'.js');
		$script .= "\n";
	endforeach;
	
	
	$src = 'all';
	file_put_contents('../savvyui.js', $cp.$script);
	
	$packer = new JavaScriptPacker($script, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../savvyui.min.js', $cp.$min);
	
	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../savvyui.pack.js', $cp.$packed);
	
	echo "Savvy.UI compiled";
?>