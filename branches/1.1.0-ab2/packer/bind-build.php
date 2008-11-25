<?php
	require 'packer/class.JavaScriptPacker.php';
	
	$files = array(
		'base',
		'core',
		'draggable',
		'resizable',
		'form',
		'dimension',
		'activecontent',
		'autocomplete',
		'calendar',
		'iconizer',
		'message',
		'panel',
		'dialog',
		'simpletab',
		'ticker',
		'toggler'
	);
	
	$script = '';
	
	
	// Loop file
	foreach ($files as $file) :
		$script .= file_get_contents('../'.$file.'.js');
	endforeach;
	
	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../packed/build.js', $packed);
	
	echo "Savvy.UI compiled";
?>