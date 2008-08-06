<?php
	if(!isset($_GET['option'])) :
		die('Invalid request!');
	elseif($_GET['option'] == 1) :
		echo "Hello from <strong>Ajax</strong>, do visit our start-up site at <a href='http://codenitive.com'>Codenitive</a>.";
	elseif($_GET['option'] == 2) :
		echo '{SUIXHR: true, id: "hello-ext", text: "Another hello by Ajax, do visit our start-up site at <a href=\"http://codenitive.com\">Codenitive</a>."}';	
	endif;
?>