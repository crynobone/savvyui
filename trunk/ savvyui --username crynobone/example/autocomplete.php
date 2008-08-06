<?php
$db = mysql_connect('localhost', 'root', '');
mysql_select_db('geoip', $db);

$put = array();

function pretty_List($array = array(), $between = '', $last = '') {
	$count = count($array);
	$str = '';
			
	if($count > 1) :
		for($loop = 0; $loop <($count-1); $loop++) :
			$str .= ($loop == 0 ? '' : $between).$array[$loop];
		endfor;
		$str .= $last.$array[($count-1)];
	elseif($count == 1) :
		$str = $array[0];
	endif;
			
	return $str;
}

$query = "SELECT DISTINCT(rc_name) FROM ref_country WHERE rc_name LIKE '".$_GET['name']."%' LIMIT 35";
$result = mysql_query($query, $db);
while($row = mysql_fetch_array($result)) :
	array_push($put, $row['rc_name']);	
endwhile;
$output = pretty_List($put, '","', '","');
print <<<TEXT
["{$output}"]
TEXT;
?>