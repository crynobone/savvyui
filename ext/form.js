/**
 * @projectDescription Form extension for Savvy.UI
 * @memberOf Js.ext
 * @version 0.9.4
 * @author Mior Muhammad Zaki crynobone
 * @license MIT
 */

/**
 * Configuration option for Js.ext.form
 */

Js.ext.form = function() 
{
	this.node = null;
	this.first = null;
	this.callback = null;
	this.setting = null;
	
	return this;
};

Js.ext.form.prototype = {
	setup: function(option) 
	{
		this.setting = Js.append(option, this.setting);
	},
	_prepSetting: function() 
	{
		this.setting.errorNode.match(/^([A-Za-z]{1,10})\.(.*)$/i);
		this.setting.error = {
			node: RegExp.$1,
			cssMessage: RegExp.$2
		};
	},
	validate: function(node, option) 
	{		
		// ensure that refer to this
		var that = this;
		
		this.node = jQuery(node);
		
		this.setup(option);
		
		this.setting = Js.append(this.setting, Js.config.ext.form);
		var setting = this.setting;
		
		this._prepSetting();
		
		var beforeStart = Jrun.pick(setting.beforeStart,null);
		var success = Jrun.pick(setting.success, null);
		var onError = Jrun.pick(setting.onError, null);
		var data = "";
		
		this.first = null;
		
		if(Jrun.isfunction(beforeStart)) 
		{
			beforeStart(this.node);
		}
		
		if(!!this.node) 
		{
			// based on the form, select on input type
			jQuery(":input", this.node).each(function() {
				var object = jQuery(this);
				
				// remove previously loaded error message
				that._messageCleanUp(this);
				
				// Double confirm the element is either input, select or textarea
				if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/g)) 
				{
					if (this.name != "") {
						// turn the className into array so we can do some testing
						this.className = (!!this.className ? this.className : "");
						var klass = this.className.split(/\s/);
						var error = "";
						
						// if the element is required
						if (!!Jrun.inArray("required", klass) && Jrun.trim(this.value) === "") {
							error = Js.lang.ext.form.required;
						}
						
						// this set of validate only triggered when this.value isn't empty
						if (Jrun.trim(this.value) != "") {
							if (!!Jrun.inArray("string", klass) && !Js.test.isString(this.value)) {
								error = Js.lang.ext.form.string;
							}
							else 
								if ((!!Jrun.inArray("integer", klass) || !!Jrun.inArray("number", klass)) && !Js.test.isNumber(this.value)) {
									error = Js.lang.ext.form.number;
								}
								else 
									if (!!Jrun.inArray("email", klass) && !Js.test.isEmail(this.value)) {
										error = Js.lang.ext.form.email;
									}
						}
						
						var testindex = Jrun.indexOfGrep(/^(custom)\-(\w*)$/g, klass);
						
						if (testindex >= 0) {
							var tester = Jrun.camelize(klass[testindex]);
							var validate = that.setting[tester];
							
							if (Jrun.isset(validate)) {
								var required = Jrun.pickStrict(validate.required, false, "boolean");
								
								if (required === true && Jrun.trim(this.value) === "") {
									error = validate.error || error;
								}
								
								if (Jrun.trim(this.value) !== "") {
									if (Jrun.isfunction(validate.callback) && !validate.callback(this.value)) {
										error = validate.error || error;
									}
									else 
										if (validate.test && !this.value.match(validate.test)) {
											error = validate.error || error;
										}
								}
							}
						}
						
						
						for (var i = 0; i < klass.length; i++) 
						{
							if (klass[i].match(/(max|min|exact)\-(\d*)/) && Jrun.trim(this.value) !== "") 
							{
								var type = RegExp.$1;
								var value = RegExp.$2;
								
								if (!Js.test.isLength(klass[i], this.value.length)) 
								{
									if (type == "min") 
									{
										type = Js.lang.ext.form.lengthOption.minimum;
									}
									else if (type == "max") 
									{
										type = Js.lang.ext.form.lengthOption.maximum;
									}
									else if (type == "exact") 
									{
										type = Js.lang.ext.form.lengthOption.exact;
									}
									
									var note = Js.lang.ext.form.length;
									
									note = note.replace(/{type}/, type);
									note = note.replace(/{value}/, value);
									
									that.error(this, note, true);
								}
							}
						}
						
						if (error !== "") 
						{
							that._error(this, error);
						}
						
						data += that._invokeQueryString(this);
					}
				}
			});
		}
		
		if(Jrun.isset(this.first)) 
		{ 
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} catch(e) {
				Js.debug.error("Js.ext.form: Cannot trigger onFirstFormError " + e);
			}
			
			if(Jrun.isfunction(onError)) 
			{
				onError(this.first);
			}
			// stop form processing
			return false;
		} 
		else 
		{
			// return all field data in querystring format
			if(Jrun.isfunction(success)) 
			{
				success(data);
			}
			return data;
		}
	},
	_error: function(field, text, data) 
	{		
		var that = this;
		
		// Mark first error occured!
		this.first = (Jrun.isnull(this.first) ? field : this.first);
		
		var field = jQuery(field);
		var form = jQuery(this.node);
		var fieldName = field.attr("name");
		
		var fieldErrorId = [form.attr("id"), fieldName, "error"].join("-");
		var data = data || false;
		
		if (jQuery("#" + fieldErrorId).length == 0) 
		{
			this._messageAdd(field, text);
			
			field.change(function() {
				if (jQuery(this).val() != "") 
				{
					that._messageCleanUp(this);
					that.first = null;
				}
			});
		} 
		else if (jQuery("#" + fieldErrorId).length == 1 && !!data) 
		{
			field.addClass("extform-error");
			var errorNode = field.siblings(this.setting.error.node + "." + this.setting.error.cssMessage).eq(0);
			var html = errorNode.html();
			
			if(html.match(text) === false && Jrun.trim(html) != "") 
			{
				errorNode.append(text);
			}
			
			field.change(function() {
				if(jQuery(this).val() != "") 
				{
					that.messageCleanUp(this);
					that.first = null;
				}
			});
		}
	},
	_invokeQueryString: function(node) 
	{
		var data = "";
		
		// dump name and value to opt in querystring format ( &name=value )
		if(node.type.toLowerCase().match(/^(checkbox|radio)$/)) 
		{
			if(node.type == "checkbox" && node.checked == true) 
			{
				// only add checked checkbox input
				data = "&" + node.name + "=" + Js.parse.html.to(node.value);
			} 
			else if (node.type == "radio" && node.checked == true) 
			{
				// only add checked radiobox input
				data += "&" + node.name + "=" + Js.parse.html.to(node.value);
			}
		} 
		else 
		{ 
			// add all input (except radio/checkbox)
			data = "&" + node.name + "=" + Js.parse.html.to(node.value);
		}
		
		return data;
	},
	_messageCleanUp: function(node) 
	{
		var errSpan = this.setting.error.node + "." + this.setting.error.cssMessage;
		var errNode = jQuery(node).siblings(errSpan).eq(0);
		if (errNode.length == 1) 
		{
			errNode.remove();
		}
	},
	_messageAdd: function(node, message) 
	{
		try {
			jQuery("<" + this.setting.error.node + "/>")
				.addClass(this.setting.error.cssMessage)
				.html(message)
				.appendTo(node.parent());
		} catch(e) {
			Js.debug.error(e);
		}
	}
};