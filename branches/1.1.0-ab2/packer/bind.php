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
	
	
	$src = 'all';
	file_put_contents('../packed/sui.js', $script);
	
	$packer = new JavaScriptPacker($script, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../packed/sui-min.js', $min);
	
	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../packed/sui-packed.js', $packed);
	
	echo "Savvy.UI compiled";
?>