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
		if (Jrun.isset(node)) {
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
		
		if (Jrun.isfunction(fnBeforeStart)) {
			// execute the function and free up the memory
			fnBeforeStart(node);
			fnBeforeStart = null;
		}
		
		if (this.node.length >= 1) {
			// based on the form, select on input type
			var fields = jQuery(":input", this.node);
			
			fields.each(function(index, field) {
				var node = jQuery(field);
				var value = node.val();
				// Double confirm the element is either input, select or textarea
				
				if (node.attr('name') != "") {
					// remove previously loaded error message
					that._messageCleanUp(node);
					
					// turn the className into array so we can do some testing
					var klasses = (!!node.attr('class') ? node.attr('class') : "");
					var klass = klasses.split(/\s/);
					var error = "";
						
					// if the element is required
					if (!!Jrun.inArray("required", klass) && Jrun.trim(value) === "") {
						error = lang.required;
					}
					/*
					var indexMatch = Jrun.indexOfGrep(/^match-(.*)$/i, klass);
					if (indexMatch > -1) {
						var matched = fields.is(":input[name='" + RegExp.$1 + "']");
						if (value != matched.val() && error == "") {
							error = lang.matched;
						}
					}
					*/
					
					// this set of validate only triggered when this.value isn't empty
					if (Jrun.trim(value) != "") {
						if (!!Jrun.inArray("string", klass) && !Js.test.isString(value)) {
							error = lang.string;
						}
						else if ((!!Jrun.inArray("integer", klass) || !!Jrun.inArray("number", klass)) && !Js.test.isNumber(value)) {
							error = lang.number;
						}
						else if (!!Jrun.inArray("email", klass) && !Js.test.isEmail(value)) {
							error = lang.email;
						}
					}
					
					var testIndex = Jrun.indexOfGrep(/^(custom)\-(\w*)$/g, klass);
					if (testIndex > -1) {
						var tester = Jrun.camelize(klass[testIndex]);
						var validate = that.setting[tester];
						
						if (Jrun.isset(validate)) {
							var required = Jrun.pickStrict(validate.required, false, "boolean");
							
							if (required === true && Jrun.trim(value) === "") {
								error = Jrun.pickStrict(validate.error, error, "string");
							}
							
							if (Jrun.trim(value) !== "") {
								if (Jrun.isfunction(validate.callback) && !validate.callback(value)) {
									error = Jrun.pickStrict(validate.error, error, "string");
								}
								else if (validate.regex && !value.match(validate.regex)) {
									error = Jrun.pickStrict(validate.error, error, "string");
								}
							}
						}
					}
						
					if (error !== "") {
						that._error(node, error);
					}
					
					var indexLength = Jrun.indexOfGrep(/^(max|min|exact)\-(\d*)$/i, klass);
					if (indexLength > -1) {
						var types = RegExp.$1;
						var values = RegExp.$2;
						
						if (!Js.test.isLength(klass[indexLength], value.length)) {
							if (type == "min") {
								type = lang.lengthOption.minimum;
							}
							else if (type == "max") {
								type = lang.lengthOption.maximum;
							}
							else if (type == "exact") {
								type = lang.lengthOption.exact;
							}
								
							var note = lang.length;
							note = note.replace(/{type}/, types);
							note = note.replace(/{value}/, values);
								
							that._error(node, note);
						}
					}
					
					data += that._invokeQueryString(node);
				}
			});
		}
		
		if (Jrun.isset(this.first)) {
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} 
			catch (e) {
				Js.debug.log("Js.ext.form: Cannot trigger onFirstFormError " + e);
			}
			
			if (Jrun.isfunction(fnOnError)) {
				fnOnError(this.first);
			}
			// stop form processing
			return false;
		}
		else {
			// return all field data in querystring format
			if (Jrun.isfunction(fnSuccess)) {
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
	_error: function(node, text) 
	{		
		var that = this;
		
		// Mark first error occured!
		this.first = (Jrun.isnull(this.first) ? node : this.first);
		
		this._messageAdd(node, text);
	},
	/**
	 * @method
	 * @param {Object} node
	 */
	_invokeQueryString: function(node) 
	{
		var data = "";
		
		// dump name and value to opt in querystring format ( &name=value )
		if (node.is(':checkbox, :radio')) {
			if (node.is(':checkbox, :checked')) {
				// only add checked checkbox input
				data += "&" + node.attr('name') + "=" + Js.parse.html.to(node.val());
			} 
			else if (node.is(':radio, :checked')) {
				// only add checked radiobox input
				data += "&" + node.attr('name') + "=" + Js.parse.html.to(node.val());
			}
		} 
		else { 
			// add all input (except radio/checkbox)
			data += "&" + node.attr('name') + "=" + Js.parse.html.to(node.val());
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
		var errNode = node.siblings(errSpan).eq(0);
		if (errNode.length > 0) {
			errNode.remove();
		}
	},
	/**
	 * @method
	 * @param {Object} node
	 * @param {Object} message
	 */
	_messageAdd: function(node, message) 
	{
		var that = this;
		var errorNode = node.siblings(this.setting.error.node + "." + this.setting.error.cssMessage).eq(0);
		
		if (errorNode.length == 0) {
			try {
				jQuery("<" + this.setting.error.node + "/>").addClass(this.setting.error.cssMessage).html(message).insertAfter(node);
			} 
			catch (e) {
				Js.debug.error(e);
			}
		} 
		else {
			try {
				errorNode.eq(0).append(message);
			} catch (e) {
				Js.debug.error(e);
			} 
		}
		
		node.bind("change", function() {
			if (jQuery(this).val() != "") {
				that._messageCleanUp(this);
				that.first = null;
			}
		});
	}
});