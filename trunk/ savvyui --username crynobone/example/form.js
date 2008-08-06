$$.fn.debug = true;
var custom = {
	"radio": {
		err: "Please select test/radio",
		test: new RegExp(/(test|radio)/)
	}
};
$$("#hello-world").submits(function() {
	var form = new SUI.Form;
	var bool = form.Validate(this, custom);
	if(!!bool) 
		alert(SUI.fn.serialize(bool));
	else 
		alert("fail");
	return false;
});

var lv = new SUI.Form;
lv.LiveValidate(SUI("#hello-world").fetch(), custom);