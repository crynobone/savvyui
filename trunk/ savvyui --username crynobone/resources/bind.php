<?php
	require 'packer/class.JavaScriptPacker.php';
	
	$files_core = array(
		'attr',
		'classes',
		'css',
		'dimension',
		'dom',
		'elements',
		'event',
		'hash',
		'jsclass',
		'keyevent',
		'parser',
		'query',
		'test'
	);
	$files_ext = array(
		'ajax',
		'animator',
		'drag',
		'drop',
		'form',
		'effect',
		'resize'
	);
	$files_tool = array(
		'array',
		'debugger',
		'helper',
		'number',
		'string'
	);
	$files_util = array(
		'anchor',
		'autocomplete',
		'ticker'
	);
	$files_widget = array(
		'calendar',
		'dropmenu',
		'message',
		'panel',
		'simpletab',
		'toggler',
		'winpanel'
	);
	
	// Base
	$script_base = file_get_contents('../savvy-base.js');
	$packer = new JavaScriptPacker($script_base, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../savvy-base-min.js', $min);
	$packer = new JavaScriptPacker($script_base, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../savvy-base-packed.js', $packed);
	
	// Core
	$src = 'core';
	$script_core = '';
	foreach ($files_core as $file) :
		$script_core .= file_get_contents('../'.$src.'/'.$file.'.js');
	endforeach;
	file_put_contents('../'.$src.'/all.js', $script_core);
	$packer = new JavaScriptPacker($script_core, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../'.$src.'/all-min.js', $min);
	$packer = new JavaScriptPacker($script_core, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../'.$src.'/all-packed.js', $packed);
	
	// Ext
	$src = 'ext';
	$script_ext = '';
	foreach ($files_ext as $file) :
		$script_ext .= file_get_contents('../'.$src.'/'.$file.'.js');
	endforeach;
	file_put_contents('../'.$src.'/all.js', $script_ext);
	$packer = new JavaScriptPacker($script_ext, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../'.$src.'/all-min.js', $min);
	$packer = new JavaScriptPacker($script_ext, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../'.$src.'/all-packed.js', $packed);
	
	// Tool
	$src = 'tool';
	$script_tool = '';
	foreach ($files_tool as $file) :
		$script_tool .= file_get_contents('../'.$src.'/'.$file.'.js');
	endforeach;
	file_put_contents('../'.$src.'/all.js', $script_tool);
	$packer = new JavaScriptPacker($script_tool, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../'.$src.'/all-min.js', $min);
	$packer = new JavaScriptPacker($script_tool, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../'.$src.'/all-packed.js', $packed);
	
	// Util
	$src = 'util';
	$script_util = '';
	foreach ($files_util as $file) :
		$script_util .= file_get_contents('../'.$src.'/'.$file.'.js');
	endforeach;
	file_put_contents('../'.$src.'/all.js', $script_util);
	$packer = new JavaScriptPacker($script_util, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../'.$src.'/all-min.js', $min);
	$packer = new JavaScriptPacker($script_util, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../'.$src.'/all-packed.js', $packed);
	
	// Widget
	$src = 'widget';
	$script_widget = '';
	foreach ($files_widget as $file) :
		$script_widget .= file_get_contents('../'.$src.'/'.$file.'.js');
	endforeach;
	file_put_contents('../'.$src.'/all.js', $script_widget);
	$packer = new JavaScriptPacker($script_widget, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../'.$src.'/all-min.js', $min);
	$packer = new JavaScriptPacker($script_widget, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../'.$src.'/all-packed.js', $packed);
	
	
	$src = 'all';
	$script_all = $script_base.$script_core.$script_ext.$script_tool.$script_util.$script_widget;
	file_put_contents('../'.$src.'.js', $script_all);
	$packer = new JavaScriptPacker($script_all, 'None', true, false);
	$min = $packer->pack();
	file_put_contents('../'.$src.'-min.js', $min);
	$packer = new JavaScriptPacker($script_all, 'Normal', true, false);
	$packed = $packer->pack();
	file_put_contents('../'.$src.'-packed.js', $packed);
	
?>