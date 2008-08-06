<?php
	require 'packer/class.JavaScriptPacker.php';
	
	$files = array(
		'attr',
		'canvas',
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
	$src = '../core/';
	$out = '../deploy/pack/';
	$script = '';
	
	foreach ($files as $file) :
		$script .= file_get_contents($src.$file.'.js');
	endforeach;
	$script = preg_replace("/\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\//", "", $script);
	file_put_contents('../savvy-core.js', $script);
	
	$files = array(
		'ajax',
		'animator',
		'drag',
		'drop',
		'form',
		'fx',
		'resize'
	);
	$src = '../ext/';
	$script = '';
	
	foreach ($files as $file) :
		$script .= file_get_contents($src.$file.'.js');
	endforeach;
	$script = preg_replace("/\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\//", "", $script);
	file_put_contents('../savvy-ext.js', $script);
	
	$files = array(
		'array',
		'debugger',
		'helper',
		'number',
		'string'
	);
	$src = '../tool/';
	$script = '';
	
	foreach ($files as $file) :
		$script .= file_get_contents($src.$file.'.js');
	endforeach;
	$script = preg_replace("/\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\//", "", $script);
	file_put_contents('../savvy-tool.js', $script);
	
	$files = array(
		'anchor',
		'autocomplete',
		'imagebox',
		'ticker'
	);
	$src = '../util/';
	$script = '';
	
	foreach ($files as $file) :
		$script .= file_get_contents($src.$file.'.js');
	endforeach;
	$script = preg_replace("/\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\//", "", $script);
	file_put_contents('../savvy-util.js', $script);
	
	$files = array(
		'calendar',
		'dropmenu',
		'form',
		'panel',
		'simpletab',
		'toggler',
		'tooltip',
		'winpanel'
	);
	$src = '../widget/';
	$script = '';
	
	foreach ($files as $file) :
		$script .= file_get_contents($src.$file.'.js');
	endforeach;
	$script = preg_replace("/\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\//", "", $script);
	file_put_contents('../savvy-widget.js', $script);
?>