<?php
	require 'class.JavaScriptPacker.php';
	
	$files = array(
		'base',
		'adapter',
		'ext/form',
		'util/dimension',
		'util/activecontent',
		'widget/activity',
		'widget/calendar',
		'widget/iconizer',
		'widget/notice',
		'widget/simpletab',
		'util/ticker'
	);
	
	$script = '';
	
	
	// Loop file
	foreach ($files as $file) :
		$script .= file_get_contents('../../'.$file.'.js');
	endforeach;
	
	
	$src = 'all';
	file_put_contents('../savvyui.js', $script);
	
	$packer = new JavaScriptPacker($script, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../savvyui.min.js', $min);
	
	$packer = new JavaScriptPacker($script, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../savvyui.pack.js', $packed);
	
	echo "Savvy.UI compiled";
?>