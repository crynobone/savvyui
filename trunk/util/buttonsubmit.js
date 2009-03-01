/**
 * @projectDescription Allow a customizable form submission via button complete with XHR Request
 * @memberOf Js.util
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.util.buttonSubmit = Js.create({
	appName: "buttonSubmit",
	id: null,
	url: null,
	button: null,
	setting: null,
	handler: "click",
	formValidate: null,
	initiate: function(js) {
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
	setup: function(option) {
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	/**
	 * @method
	 */
	_prepSetting: function() {
		this.formValidate = Js.nue(this.setting);
		this.formValidate.success = null;
		this.formValidate.onError = null;
	},
	/**
	 * @method
	 */
	init: function(option) {
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.util[this.appName]);
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
						
						if (runDefault !== false) {
							Js.parse.xhr.init(reply);	
						}
					},
					onError: function() {
						if(Jrun.isfunction(that.setting.onError)) {
							that.setting.onError();
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