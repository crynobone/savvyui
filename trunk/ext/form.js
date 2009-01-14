/**
 * @projectDescription Form Validation extension for Savvy.UI
 * @memberOf Js.ext
 * @version 0.9.4
 * @author Mior Muhammad Zaki crynobone
 * @license MIT
 */


/**
 * @alias Js.ext.validate
 * @constructor
 * @return {Object} this object
 */
Js.ext.validate = Js.base.create({
	node: null,
	first: null,
	setting: null,
	__construct: function(node, option)
	{
		if(Jrun.isset(node)) 
		{
			this.init(node, option);
		}
		
		return this;
	},
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	},
	_prepSetting: function()
	{
		this.setting.errorNode.match(/^(span|div|p|em|label|strong|b|i)\.(.*)$/i);
		this.setting.error = {
			node: RegExp.$1,
			cssMessage: RegExp.$2
		};
	},
	/**
	 * @method
	 * @param {Object} node
	 * @param {Object} option
	 */
	init: function(node, option) 
	{		
		Js.debug.log("Js.ext.validate: Initiated");
		
		// ensure that refer to this
		var that = this;
		
		// node should refer to only one object
		this.node = jQuery(node).eq(0);
		
		// setup configuration
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.ext.validate);
		this._prepSetting();
		
		var setting = this.setting;
		var fnBeforeStart = Jrun.pick(setting.beforeStart,null);
		var fnSuccess = Jrun.pick(setting.success, null);
		var fnOnError = Jrun.pick(setting.onError, null);
		var data = "";
		var lang = Js.lang.ext.validate;
		
		// set this.first to NULL
		this.first = null;
		
		if(Jrun.isfunction(fnBeforeStart)) 
		{
			// execute the function and free up the memory
			fnBeforeStart(node);
			fnBeforeStart = null;
		}
		
		Js.debug.log("Js.ext.validate: Prepared to start validation");
		
		if(this.node.length >= 1) 
		{
			// based on the form, select on input type
			jQuery(":input", this.node).each(function(index, node) {
				//var object = jQuery(node);
				
				// Double confirm the element is either input, select or textarea
				if(node.tagName.toLowerCase().match(/^(input|select|textarea)$/g)) 
				{
					if (node.name != "") {
						Js.debug.log("Js.ext.validate: use field " + node.name);
						
						Js.debug.log("Js.ext.validate: clean up old error");
						// remove previously loaded error message
						that._messageCleanUp(node);
						
						Js.debug.log("Js.ext.validate: convert className to Array");
						
						// turn the className into array so we can do some testing
						node.className = (!!node.className ? node.className : "");
						var klass = node.className.split(/\s/);
						var error = "";
						
						Js.debug.log("Js.ext.validate: Run required check");
						// if the element is required
						if (!!Jrun.inArray("required", klass) && Jrun.trim(node.value) === "") {
							error = lang.required;
						}
						
						// this set of validate only triggered when this.value isn't empty
						if (Jrun.trim(node.value) != "") 
						{
							Js.debug.log("Js.ext.validate: run string/number/email check");
							if (!!Jrun.inArray("string", klass) && !Js.test.isString(node.value)) 
							{
								error = lang.string;
							}
							
							else if ((!!Jrun.inArray("integer", klass) || !!Jrun.inArray("number", klass)) && !Js.test.isNumber(node.value)) 
							{
								error = lang.number;
							}
							else if (!!Jrun.inArray("email", klass) && !Js.test.isEmail(node.value))
							{
								error = lang.email;
							}
						}
						
						Js.debug.log("Js.ext.validate: run custom check");
						var testIndex = Jrun.indexOfGrep(/^(custom)\-(\w*)$/g, klass);
						
						if (testIndex >= 0) 
						{
							var tester = Jrun.camelize(klass[testIndex]);
							var validate = that.setting[tester];
							
							if (Jrun.isset(validate)) 
							{
								var required = Jrun.pickStrict(validate.required, false, "boolean");
								
								if (required === true && Jrun.trim(node.value) === "") 
								{
									error = Jrun.pickStrict(validate.error, error, "string");
								}
								
								if (Jrun.trim(node.value) !== "") 
								{
									if (Jrun.isfunction(validate.callback) && !validate.callback(node.value)) 
									{
										error = Jrun.pickStrict(validate.error, error, "string");
									}
									else if (validate.regex && !node.value.match(validate.regex)) 
									{
										error = Jrun.pickStrict(validate.error, error, "string");
									}
								}
							}
						}
						
						Js.debug.log("Js.ext.validate: add error message (if any)");
						if (error !== "") 
						{
							that._error(node, error);
						}
						
						Js.debug.log("Js.ext.validate: run length check");
						for (var i = 0; i < klass.length; i++) 
						{
							if (klass[i].match(/(max|min|exact)\-(\d*)/) && Jrun.trim(node.value) !== "") 
							{
								var type = RegExp.$1;
								var value = RegExp.$2;
								
								if (!Js.test.isLength(klass[i], node.value.length)) 
								{
									if (type == "min") 
									{
										type = lang.lengthOption.minimum;
									}
									else if (type == "max") 
									{
										type = lang.lengthOption.maximum;
									}
									else if (type == "exact") 
									{
										type = lang.lengthOption.exact;
									}
									
									var note = lang.length;
									
									note = note.replace(/{type}/, type);
									note = note.replace(/{value}/, value);
									
									that._error(node, note);
								}
							}
						}
						
						Js.debug.log("Js.ext.validate: populate query string");
						data += that._invokeQueryString(node);
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
				Js.debug.log("Js.ext.form: Cannot trigger onFirstFormError " + e);
			}
			
			if(Jrun.isfunction(fnOnError)) 
			{
				fnOnError(this.first);
			}
			// stop form processing
			return false;
		} 
		else 
		{
			// return all field data in querystring format
			if(Jrun.isfunction(fnSuccess)) 
			{
				fnSuccess(data);
			}
			
			return data;
		}
	},
	/**
	 * @method
	 * @param {Object} field
	 * @param {Object} text
	 * @param {Object} data
	 */
	_error: function(field, text) 
	{		
		var that = this;
		
		// Mark first error occured!
		this.first = (Jrun.isnull(this.first) ? field : this.first);
		
		var field = jQuery(field);
		var fieldName = field.attr("name");
		
		this._messageAdd(field, text);
	},
	/**
	 * @method
	 * @param {Object} node
	 */
	_invokeQueryString: function(node) 
	{
		var data = "";
		
		// dump name and value to opt in querystring format ( &name=value )
		if(node.type.toLowerCase().match(/^(checkbox|radio)$/)) {
			if(node.type == "checkbox" && node.checked == true) {
				// only add checked checkbox input
				data += "&" + node.name + "=" + Js.parse.html.to(node.value);
			} 
			else if (node.type == "radio" && node.checked == true) {
				// only add checked radiobox input
				data += "&" + node.name + "=" + Js.parse.html.to(node.value);
			}
		} 
		else { 
			// add all input (except radio/checkbox)
			data += "&" + node.name + "=" + Js.parse.html.to(node.value);
		}
		
		return data;
	},
	/**
	 * @method
	 * @param {Object} node
	 */
	_messageCleanUp: function(node) 
	{
		var errSpan = this.setting.error.node + "." + this.setting.error.cssMessage;
		var errNode = jQuery(node).siblings(errSpan).eq(0);
		if (errNode.length == 1) {
			errNode.remove();
		}
	},
	/**
	 * @method
	 * @param {Object} node
	 * @param {Object} message
	 */
	_messageAdd: function(field, message) 
	{
		var that = this;
		var errorNode = field.siblings(this.setting.error.node + "." + this.setting.error.cssMessage).eq(0);
		
		if (errorNode.length == 0) {
			try {
				jQuery("<" + this.setting.error.node + "/>").addClass(this.setting.error.cssMessage).html(message).appendTo(field.parent());
			} 
			catch (e) {
				Js.debug.error(e);
			}
		} 
		else {
			errorNode.eq(0).append(message);
		}
		
		field.bind("change", function() {
			if (jQuery(this).val() != "") {
				that.messageCleanUp(this);
				that.first = null;
			}
		});
	}
});