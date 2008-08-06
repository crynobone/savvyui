SUI(document).ready(function() {
	// get the #content's innerHTML
	var html = SUI("#content").html();
	
	// striptag the value of html
	var output1 = new SUI.string(html).trim().exec('split', ' ').value.join("-");
	// htmlentities the value of html
	var output2 = new SUI.string(html).htmlEntities();
	
	// output it in #output1-content
	SUI("#output1-content").html(output1);
	// output it to #output2-content
	SUI("#output2-content").html(SUI.fn.htmlEntityDecode(output2.value));
});