/**
 * @memberOf Js.util
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.config.util.buttonSubmit = {
	method: "POST",
	beforeStart: null,
	beforeSend: null,
	success: null,
	custom: {}
};

Js.setup.util.buttonSubmit = function(data)
{
	Js.config.util.buttonSubmit = Js.append(Jrun.pickStrict(option, {}), Js.config.util.buttonSubmit);
};

Js.util.buttonSubmit = function(js) 
{
	this.id = Jrun.pick(js.id, null);
	this.url = Jrun.pick(js.url, null);
	this.button = Jrun.pick(js.button, null);
	this.option = Jrun.pick(js.option, {});
	this.debug = true;
	
	this.setting = Js.config.util.buttonSubmit;
	
	if(!!this.id && !!this.url && this.button) 
	{
		this.init();
	}
};

Js.util.buttonSubmit.prototype = {
	init: function() 
	{
		var that = this;
		
		this.setting = Js.append(Js.pick(this.option, {}), this.setting);
		var method = Jrun.pickGrep(this.setting.method, /^(get|post)$/i);
		
		jQuery(that.button).bind("click", function() {
			if(Jrun.isfunction(that.setting.beforeStart)) 
			{
				that.setting.beforeStart();
			}
			
			var form = new Js.ext.form();
			var params = form.validate(that.id, that.setting.custom);
			
			if(!!params) 
			{
			   jQuery.ajax({
					type: method,
					url: that.url,
					data: params,
					beforeSend: function() {
						if(Jrun.isfunction(that.setting.beforeSend))
						{
							that.setting.beforeSend();
						}
					},
					success: function(reply) {
						if(Jrun.isfunction(that.setting.success)) 
						{
							that.setting.success(reply);
						}
						
						Js.parse.xhr.init(reply);
					}
				});
			}
			
			return false;
		});
	}
};