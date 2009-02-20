/**
 * @projectDescription Allow a customizable form submission via button
 * @memberOf Js.util
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * @alias Js.util.buttonSubmit
 * @constructor
 * @param {Object} js
 */
Js.util.buttonSubmit = Js.base.create({
	id: null,
	url: null,
	button: null,
	setting: null,
	handler: "click",
	formValidate: null,
	__construct: function(js)
	{
		this.id = Jrun.pick(js.id, null);
		this.url = Jrun.pick(js.url, null);
		this.button = Jrun.pick(js.button, null);
		
		// if id, url and button have been defined, straight away call this.init()
		if (!!this.id && !!this.url && this.button) {
			this.init(js.option);
		}
	},
	/**
	 * @method
	 * @param {Object} option
	 */
	setup: function(option)
	{
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	/**
	 * @method
	 */
	_prepSetting: function()
	{
		this.formValidate = Js.nue(this.setting);
		this.formValidate.beforeStart = null;
		this.formValidate.success = null;
		this.formValidate.onError = null;
	},
	/**
	 * @method
	 */
	init: function(option) 
	{
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.util.buttonSubmit);
		this._prepSetting();
		
		var method = Jrun.pickGrep(this.setting.method, /^(get|post)$/i);
		
		// bind onClick event delegation to the button
		Js.use(that.button).bind(this.handler, function() {
			// we need to validate the form
			var form = new Js.ext.validate(that.id, that.formValidate);
			var params = form.cacheResult;
			
			if(!!params) {
			   jQuery.ajax({
					type: method,
					url: that.url,
					data: params,
					beforeSend: function() {
						if (Jrun.isfunction(that.setting.beforeSend)) {
							that.setting.beforeSend();
						}
					},
					success: function(reply) {
						var runDefault = true;
						
						if (Jrun.isfunction(that.setting.success)) {
							runDefault = that.setting.success(reply);
						}
						
						if (runDefault == true) {
							Js.parse.xhr.init(reply);	
						}
					}
				});
			}
			else {
				if(Jrun.isfunction(that.setting.onError)) {
					that.setting.onError();
				}
			}
			
			return false;
		});
	}
});