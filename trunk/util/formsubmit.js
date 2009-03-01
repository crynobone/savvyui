/**
 * @projectDescription Allow a customizable form submission via submit button complete with XHR Request
 * @memberOf Js.util
 * @version 0.0.2
 * @extends Js.util.buttonSubmit
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */
Js.util.formSubmit = Js.util.buttonSubmit.extend({
	appName: "formSubmit",
	handler: "submit",
	initiate: function(js)
	{
		if (Jrun.parameter(arguments, 1, ["object"])) {
			this.id = Jrun.pick(js.id, null);
			this.url = Jrun.pick(js.url, null);	
		} 
		else if (Jrun.parameter(arguments, 2, [true, "string"])) {
			this.id = Jrun.pick(arguments[0], null);
			this.url = Jrun.pick(arguments[1], null)
		}
		
		this.button = this.id;
		
		// if id, url and button have been defined, straight away call this.init()
		if(!!this.id && !!this.url && this.button) {
			this.init(js.option);
		}
	}
});

