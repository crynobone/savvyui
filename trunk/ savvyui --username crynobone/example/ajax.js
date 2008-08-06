// Wait for document to be ready
$$(document).ready(function() {	
							
	// Enable debugger to prompt error.
	SUI.fn.debug = true;
	SUI.Tool.Debugger();
	// Initialize onClick event handler for #ajax2 button
	$$("#ajax-ext").clicks(function() {
		SUI("#hello-ext").html("Loading...");
		// use SUI.Ajax to load new content, return JSON
		new SUI.Ajax({
			method: "GET",
			cache: false,
			data: {
				option: 2
			},
			uri: "ajax.php"
		});
	});	
	
	SUI("#ajax-load").clicks(function() {
		try {
			SUI("#hello-load").loads("ajax.php?option=1");
		} catch(e) { SUI.fn.logger(e); }
	});
});