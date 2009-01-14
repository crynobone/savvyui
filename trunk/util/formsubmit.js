/**
 * @memberOf Js.util
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */
Js.util.formSubmit = Js.util.buttonSubmit.extend({
	handler: "submit",
	__construct: function(js)
	{
		this.id = Jrun.pick(js.id, null);
		this.url = Jrun.pick(js.url, null);
		this.button = this.id;
		
		// if id, url and button have been defined, straight away call this.init()
		if(!!this.id && !!this.url && this.button) {
			this.init(js.option);
		}
	}
});