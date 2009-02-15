/**
 * @projectDescription Savvy.UI JavaScript extends the functionality of DOM manipulation via jQuery Framework
 * @namespace Js
 * @version 1.1.4
 * @extends jQuery-1.2.6
 * @author Mior Muhammad Zaki crynobone@gmail.com
 */

/**
 * Global Object for Savvy.UI
 * @alias Js
 */
var Js = {
	adapter: "jQuery-1.2.6",
	version: "1.1.4",
	use: null,
	debug: {},
	data: {},
	ext: {},
	util: {},
	parse: {},
	test: {},
	widget: {},
	config: {
		ext: {},
		util: {},
		widget: {}
	},
	setup: {
		ext: {},
		util: {},
		widget: {}
	},
	language: {
		ext: {},
		util: {},
		widget: {}
	}
};

/**
 * Display Savvy.UI current version
 * 
 * @alias Js.toString
 * @return {String}
 */
Js.toString = function() 
{
	return ["Savvy.UI", "version", Js.version, "using", Js.adapter].join(" ");	
};

/**
 * Return new object without adding any reference to the old object
 * 
 * @alias Js.nue
 * @param {Object} data
 * @return {Object}
 */
Js.nue = function(data) 
{
	// data have to be an object
	if (Jrun.typeOf(data) == "object") {
		// prepare result object
		var result = {};
		
		// loop data object name
		for (var method in data) {
			if (data.hasOwnProperty(method)) {
				result[method] = data[method];
			}
		}
		
		return result;
	}
	else {
		// data not an object, just return the original data
		return data;
	}
};

/**
 * Append data object with value method
 * 
 * @param {Object} data
 * @param {Object} value
 * @param {Object} filter
 */
Js.append = function(data, value, filter, invert) 
{
	var filter = Jrun.pickStrict(filter, null, "array");
	var invert = Jrun.pickStrict(invert, false, "boolean");
	
	if (Jrun.typeOf(data) !== "object") {
		data = {};
	}
	
	if (Jrun.typeOf(data) !== "object") {
		data = {};
	}
	
	var result = data;
		
	// loop value's method
	for (var method in value) {
		// if data doesn't have the method add it
		var valid = (Jrun.isnull(filter) || Jrun.inArray(method, filter));
		var notDuplicate = (!data.hasOwnProperty(method) && value.hasOwnProperty(method));
		var valid = (!!invert ? !valid : valid);
		 
		if (!!notDuplicate && !!valid) {
			result[method] = value[method];
		}
	}
		
	return result;
	
};

Js.filter = function (data, filter) 
{
	return Js.append(data, {}, filter);
};

/**
 * Debugging engine for Savvy.UI
 * 
 * @alias Js.debug
 */
Js.debug = {
	/* Set to true to display error message in the output
	 * e.g: Js.debug.enable = true;
	 */
	enable: false,
	/* Set to true to display all log for dev purpose
	 * e.g: Js.debug.dev = true;
	 */
	dev: false,
	/* error/log stack:
	 * - error[] contain all errors
	 * - log[] contain all logs 
	 */
	data: {
		error: [],
		log: []
	},
	/**
	 * Log a message
	 * 
	 * @alias Js.debug.log
	 * @param {String} text
	 */
	log: function(text) 
	{
		// push log to stack
		this.data.log.push(text);
		
		if (!!this.dev) {
			try {
				console.log(text);
			}
			catch(e) {
				alert(text);
			}
		}
	},
	/**
	 * Log an error
	 * 
	 * @alias Js.debug.error
	 * @param {String} text
	 */
	error: function(text) 
	{
		// push error to stack
		this.data.error.push(text);
		
		// if Js.debug.enable is true, display the error
		if (!!this.enable) {
			try {
				// good browser come with console
				console.log(text);
			} 
			catch (e) {
				// browser doesn't support console so alert
				alert(text);
			}
		}
	}
};

/**
 * Misc function for Savvy.UI
 * 
 * @alias Jrun
 */
var Jrun = {
	/**
	 * Camelize string input
	 * <br>e.g: background-color => backgroundColor
	 * 
	 * @alias Jrun.camelize
	 * @param {String} data
	 * @return {String} string with camelize format
	 */
	camelize: function(data) 
	{
		var values = data.split(/\-/);
		
		// if array only have one value
		if (values.length === 1) {
			return values[0];
		}
		
		var result = (data.indexOf('-') == 0 ? values[0].charAt(0).toUpperCase() + values[0].substr(1) : values[0]);
		
		jQuery.each(values, function(index, value) {
			if (index > 0) {
				result = result + value.charAt(0).toUpperCase() + value.substr(1);
			}
		});
		
		return result;
	},
	/**
	 * Open a URL using JavaScript
	 * 
	 * @alias Jrun.href
	 * @param {String} [url] set the hyperlink of destination path 
	 * @param {String} [target] set the target to show the page, if applicable
	 */
	href: function(url, target) 
	{
		if (this.trim(url) !== "") {
			if (this.isnull(target)) {
				// when target is not define load the url in the same window
				window.location.href = url;
			} 
			else {
				// load the url in the specified target
				window.open(url, target);
			}
		} 
		else {
			Js.debug.error("Jrun.href: failed to load page " + url);
		}
	},
	/**
	 * Encode HTML entities from any given string
	 * 
	 * @alias Jrun.htmlEncode
	 * @param {String} [value] any string with HTML entities
	 * @return {String}
	 */
	htmlEncode: function(value) 
	{
		return value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\+/g, "&#43;");
	},
	/**
	 * Decode HTML entities from any given string
	 * 
	 * @alias Jrun.htmlDecode
	 * @param {String} value
	 * @return {String}
	 */
	htmlDecode: function(value) 
	{
		return value
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#43;/g, "+");
	},
	/**
	 * Check whether the value is in an array
	 * 
	 * @alias Jrun.inArray 
	 * @param {String} value
	 * @param {Array} data
	 * @return {Boolean}
	 */
	inArray: function(value, data) 
	{
		for(var index = 0; index < data.length && !!data[index]; index++) {
			if(data[index] === value) {
				return true;
				break;
			}
		}
		
		return false;
	},
	/**
	 * Check whether the value is in an array, check validity based on Regular Expression
	 * 
	 * @alias Jrun.inArrayGrep
	 * @param {RegExp} value
	 * @param {Array} data
	 * @return {Boolean}
	 */
	inArrayGrep: function(value, data) 
	{
		for(var index = 0; index < data.length && !!data[index]; index++) 
		{
			if(data[index].match(value)) 
			{
				return true;
				break;
			}
		}
		
		return false;
	},
	/**
	 * Get the indexOf based on value in an array
	 * 
	 * @alias Jrun.indexOf
	 * @param {Object} value
	 * @param {Array} data
	 * @return {Number}
	 */
	'indexOf': function(value, data) 
	{
		for (var index = data.length; index-- && data[index] !== value;);
		return index;
	},
	/**
	 * Get the indexOf based on value in an array
	 * 
	 * @alias Jrun.indexOfGrep
	 * @param {RegExp} value
	 * @param {Array} data
	 * @return {Number}
	 */
	indexOfGrep: function(value, data) 
	{
		for (var index = data.length; index-- && !data[index].match(value););
		return index;
	},
	/**
	 * Check if data is not defined
	 * 
	 * @alias Jrun.isnull
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isnull: function(data) 
	{
		return (typeof(data) == "undefined" || data == null);
	},
	/**
	 * Check if data is defined
	 * 
	 * @alias Jrun.isset
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isset: function(data) 
	{
		return !this.isnull(data);
	},
	/**
	 * Check whether the passed value is a function
	 * <br>Replace with jQuery.isFunction
	 * 
	 * @alias Jrun.isfunction
	 * @deprecated
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isfunction: function(data) 
	{
		return jQuery.isFunction(data);
	},
	/**
	 * Trim left of a string
	 * @alias Jrun.ltrim
	 * @param {String} value
	 * @return {String}
	 */
	ltrim: function(value) 
	{
		return new String(value).replace(/^\s+/g, "");
	},
	parameter: function(data, length, values) {
		var data = jQuery.makeArray(data);
		var values = Jrun.pickStrict(values, [], "array");
		
		if (data.length === length) {
			var result = true;
			jQuery.each(data, function(index, value) {
				if (values[index] !== true && Jrun.typeOf(value) !== values[index]) {
					result = false;
				}
			});
			
			return result;
		} 
		else {
			return false;
		}
	},
	/**
	 * Pick the first arguments that is defined
	 * 
	 * @alias Jrun.pick
	 * @param {Object} js
	 * @return {Object}
	 */
	pick: function(js) 
	{
		var data = jQuery.makeArray(arguments);
		
		for(var index = 0; index < data.length; index++) {
			var value = data[index];
            
            if (Jrun.isset(value)) {
                return value;
				break;
            }
		};
		
		return null;
	},
	/**
	 * Pick the first arguments that is defined and typeof match the last arguments
	 * 
	 * @alias Jrun.pickStrict
	 * @param {Object} [js]
	 * @return {Object}
	 */
	pickStrict: function(js) 
	{
		var data = jQuery.makeArray(arguments);
		var length = data.length;
		var last = data[(length - 1)];
		
		for(var index = 0; index < (length - 1); index++) {
			var value = data[index];
            
            if (Jrun.isset(value)) {
                if (this.typeOf(value) == last) {
                    return value;
					break;
                }
            }
		};
		
		return null;
	},
	/**
	 * Pick the first arguments that is defined and match Regular Expression passed in the last arguments
	 * 
	 * @alias Jrun.pickGrep
	 * @param {Object} js
	 * @return {Object}
	 */
	pickGrep: function(js) 
	{
		var data = jQuery.makeArray(arguments);
		var length = data.length;
		var last = data[(length - 1)];
		
		if (this.typeOf(last) == "string") {
			last = new RegExp(last);
		}
		
		for(var index = 0; index < (length - 1); index++) {
			var value = data[index];
            
            if (Jrun.isset(value)) {
                if (!!value.match(last)) {
                    return value;
					break;
                }
            }
		};
		
		return null;
	},
	/**
	 * @alias Jrun.prettyList
	 * @param {Array} data
	 * @param {String} between
	 * @param {String} last
	 * @return {String}
	 */
	prettyList: function(data, between, last) 
	{
		var length = data.length;
		var result = new String;
		
		if (length > 1) {
			jQuery.each(data, function(index, value) {
				result = [result, (index == 0 ? "" : (index == (length - 1) ? last : between)), value].join("");
			});
		} 
		else {
			result = data[0];
		}
		
		return result;
	},
	/**
	 * @alias Jrun.rand
	 * @param {Object} js
	 */
	rand: function(js) 
	{
		var data = arguments;
		var length = 0;
		var offset = 0;
		
		if (data.length === 2) {
			offset = data[0];
			length = data[1];
		} 
		else if (data.length === 1) {
			length = data[0];
		}
		
		return (Math.floor(Math.random() * length) + offset);
	},
	/** 
	 * Trim right of a string.
	 * 
	 * @alias Jrun.rtrim
	 * @param {String} value
	 * @return {String}
	 */
	rtrim: function(value) 
	{
		return new String(value).replace(/\s$/g, "");
	},
	/**
	 * Striptags work similiar to strip_tags() in PHP
	 * <br>strip any html attribute from a string
	 * 
	 * @alias Jrun.stripTags
	 * @param {String} value
	 * @return {String}
	 */
	stripTags: function(value) 
	{
		return new String(value).replace(/<([^>]+)>/g, "");
	},
	/**
	 * Serialize array or object to querystring
	 * <br>All XHR request will be control directly via jQuery.ajax() 
	 * 
	 * @alias Jrun.serialize
	 * @deprecated
	 * @param {Object} data
	 * @return {String}
	 */
	serialize: function(data) 
	{
		var result = [];
		
		if (this.typeOf(data) === "array") {
			jQuery.each(data, function(index, val) {
				if (!!Js.parse.html) {
					val.value = Js.parse.html.to(val.value);
				}
				result.push(data[index].name + "=" + val.value);
			});
		}
		else if (this.typeOf(data) == "object") {
			for (var val in data) {
				if (!!Js.parse.html) {
					data[val] = Js.parse.html.to(data[val]);
				}
					
				result.push(val + "=" + data[val]);
			}
		}
		else {
			return "";
		}
		
		return result.join("&");
	},
	/**
	 * Parse input string value as Number using parseInt
	 * 
	 * @alias Jrun.toNumber
	 * @param {Object} data
	 * @return {Number}
	 */
	toNumber: function(data) 
	{
		// return possible integer value of a string, if not a string then return self
		return (typeof(data) == "string" ? parseInt(data, 10) : data);
	},
	/**
	 * Parse input string value as Float using parseFloat
	 * 
	 * @alias Jrun.toFloat
	 * @param {String} data
	 * @return {Float}
	 */
	toFloat: function(data) 
	{
		return (typeof(data) == "string" ? parseFloat(data, 10) : data);
	},
	/**
	 * @alias Jrun.toProperCase
	 * @param {String} data
	 * @return {String}
	 */
	toProperCase: function(data) 
	{
		var array = data.split(/ /g);
		var result = [];
		
		jQuery.each(array, function(index, value) {
			var val = value.toString();
			var first = val.substr(0, 1).toUpperCase();
			var other = val.substr(1);
			
			result.push([first, other].join(""));
		});
		
		return result.join(" ");
	},
	/**
	 * convert a object (mainly use for arguments) to array & require on .length to check the length to object to convert
	 * @alias jQuery.makeArray
	 * @param {Object, Array} [data] the source of data to be converted to Array 
	 * @param {Number} [offset] offset where to start converting to array, if applicable
	 * @return {Array}
	 */  
	toArray: function(data, offset) 
	{
		var offset = (this.isnull(offset) || offset < 1 ? 0 : offset);
		
		// return empty array
		if (this.isnull(data)) {
			return [];
		}
		else {
			// ensure the offset
			var offsetLength = (data.length - offset);
			var dataLength = data.length;
			var result = [];
			
			// loop and prepare r to be return
			while (offsetLength > 0) {
				--offsetLength;
				--dataLength;
				result[offsetLength] = data[dataLength];
			}
			return result;
		}
	},
	/**
	 * Trim both left and right of a string.
	 * <br>replace with jQuery.trim();
	 * @alias jQuery.trim
	 * @deprecated
	 * @param {String} data
	 * @return {String}
	 */
	trim: function(data) 
	{
		return jQuery.trim(data); 
		/* new String(data).replace(/^\s+|\s+$/g, ""); */
	},
	/**
	 * Return the typeof passed argument, extending JavaScript default typeof
	 * @alias Jrun.typeOf
	 * @param {Object} data
	 * @return {String}
	 */
	typeOf: function(data) 
	{
		if (Jrun.isnull(data)) {
			return "undefined";
		}
		else {
			var value = Object.prototype.toString.call(data).match(/(\w+)\]/)[1];
			
			if (value == "HTMLDocument") {
				return "element";
			}
			else {
				return value.toLowerCase();
			}
			
		}
	},
	/** 
	 * return only unique value of an array
	 * @alias Jrun.unique
	 * @param {Object, Array} [data]
	 * @param {Boolean} [repeat]
	 */
	unique: function(data, repeat) 
	{
		// when option equal true it only reject value which is repeating
		var repeat = this.pick(repeat, false);
		var result = [];
		
		// loop the array
		jQuery.each(data, function(index, value) {
			if (!repeat) {
				// add only if unique
				if (!Jrun.inArray(value, result)) {
					result.push(value);
				}
			} 
			else {
				if (index == 0) {
					result.push(value);
				}
				else if (value !== Jrun.trim(data[index - 1])) {
					result.push(value);
				}
			}
		});
		
		return result;
	},
	prep: function(data)
	{
		if (data.match(/^(#|\.)?(.*)$/gi)) {
			return RegExp.$2;
		}
		else {
			return data;
		}
	}
};

Js.base = function() {};
Js.base.prototype = {
	__destruct: function() 
	{
		// remove all properties and method for this object
		for (var method in this) {
			this[method] = null;
		}
			
		for (var method in this.prototype) {
			this.prototype[method] = null;
		}
		
		// delete this (which doesn't actually totally delete it
		delete this;
		
		return null;
	}
};

/**
 * Create a new Class with some simple Object-Oriented capability
 * 
 * @param {Object} js
 * @return {Object}
 */
Js.base.create = function(js) 
{
	var initialize = true;
	// add prototyping based on Js.base
	var prototype = new Js.base;
	initialize = false;
	
	/*
	 * Class is a dummy constructor allowing user to automatically call __construct or parent::__construct 
	 */
	function Class() 
	{
		// initiate the __construct function if construct available
		if (!initialize && !!this.construct) {
			this.construct.apply(this, jQuery.makeArray(arguments));
		}
	};
	
	Class.prototype = prototype;
	Class.prototype.construct = Jrun.pick(js.__construct, null);
	Class.constructor = Class;
	
	// create inheritance capability using .extend
	Class.extend = function(js) 
	{
		js.extended = this;	
		return Js.base.create(js);
	};
	
	// if this function is being called from .extend, prepare parent method inheritant
	var extended = Jrun.pick(js.extended, null);
	
	// assign object with method provided in js
	(function(js) {
		// restrict object from looping certain method
		var disallow = ["extended", "__construct", "__destruct", "_super", "prototype"];
		
		// add method to this object
		for (var method in js) {
			if (js.hasOwnProperty(method) && (!Jrun.inArray(method, disallow) && !this[method])) {
				this[method] = js[method];
			}
		};
	}).call(prototype, js);
	
	// object called from .extend, inherit parent method if object does not have it's own method
	if(!!Jrun.isset(extended)) {
		try {
			(function(ext) {
				// restrict object from looping certain method
				var disallow = ["extended", "__construct", "__destruct", "_super", "prototype"];
				
				for (var method in ext) {
					if (ext.hasOwnProperty(method) && (!Jrun.inArray(method, disallow) && !this[method])) {
						this[method] = ext[method];
					}
				}
				
				for (var method in ext.prototype) {
					if (ext.prototype.hasOwnProperty(method) && (!Jrun.inArray(method, disallow) && !this[method])) {
						this[method] = ext.prototype[method];
					}
				}
				
				if (ext.prototype.hasOwnProperty('construct')) {
					this['_parentConstruct'] = ext.prototype.construct;
					this['_parentDestruct'] = ext.prototype.__destruct;
				}
				
				// create a linkage to the parent object
				this._super = ext.prototype;
			}).call(prototype, extended);
		} catch(e) {
			// incase something goes wrong
			Js.debug.error("Js.base.create: failed " + e);
		}
	}
	
	// avoid extended to be duplicated in this.prototype 
	delete extended;
	
	return Class;
};/**
 * @projectDescription Adapter for Savvy.UI and jQuery Framework
 * @version 0.0.1
 * @extends jQuery-1.2.6
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	/**
	 * revert and set new className to jQuery object
	 * <br>Equal to: $("div").removeClass().addClass(value);
	 * @param {Object} value
	 * @return {jQuery}
	 */
	setClass: function(value) 
	{
		return this.each(function() {
			this.className = value;
		});
	},
	plainHtml: function(value) {
		if (value == undefined) {
			return (this[0] ? this[0].innerHTML : null);
		}
		else if(this[0]) {
			try {
				this[0].innerHTML = value;
			} catch(e) {}
			return this;
		}
	} 
});
Js.use = window.jQuery;
/**
 * @memberOf Js
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.config = {
	ext: {
		validate: {
			errorNode: "span.form-error-message",
			beforeStart: null,
			success: null,
			onError: null,
			autoExecute: true
		}
	},
	test: {
		email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		url: /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/,
		ip: /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/,
		username: /^([a-zA-Z0-9_\.\-\+])$/,
		postcode: /^\d{5}$/
	},
	util: {
		formSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			success: null
		},
		buttonSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			success: null
		},
		editable: {
			identifier: "Other",
			prefix: ""
		}
	},
	widget: {
		activity: {
			imagePath: "images/",
			boxWidth: 200,
			boxHeight: 20,
			identifier: ".widget-activity",
			opacity: 0.6,
			background: "#fff",
			zIndex: 5000
		},
		datePicker: {
			daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			dateFormat: /^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/,
			onUpdate: null,
			navigation: true,
			fieldType: "hidden",
			beforeStart: null
		},
		iconizer: {
			fileType: "png",
			folder: "icons/"
		},
		message: {
			identifier: "#overlay-message",
			cssSuccess: "message-success",
			cssNote: "message-note",
			cssError: "message-error",
			seconds: 5
		},
		notice: {
			cssSuccess: "notice-success",
			cssNote: "notice-note",
			cssError: "notice-error",
			seconds: 5,
			beforeStart: null,
			onClose: null
		},
		panel: {
			title: "Untitled",
			width: null,
			height: null,
			cssLayout: "sui-panel",
			content: "",
			onClose: null,
			allowClose: true,
			allowMinimize: false
		},
		tab: {
			handler: "click",
			identifier: ".tab",
			closable: "closable",
			disabled: "disabled",
			toolbar: "tab-toolbar",
			toolbarContainer: "tab-toolbar-container",
			container: "tab-container",
			cssHidden: "tab-hidden",
			cssActive: "tab-active",
			cssCurrent: "current",
			cssDisabled: "disabled"
		}
	}
};/**
 * @version 0.0.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.setup = {
	ext: {
		validate: function(option)
		{
			Js.config.ext.validate = Js.append(option, Js.config.ext.validate, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.ext.validate = Js.append(option.lang, Js.language.ext.validate);
			}
		}
	},
	test: function(option)
	{
		Js.config.test = Js.append(option, Js.config.test);
	},
	util: {
		buttonSubmit: function(option)
		{
			Js.config.util.buttonSubmit = Js.append(option, Js.config.util.buttonSubmit);
		},
		formSubmit: function(option)
		{
			Js.config.util.formSubmit = Js.append(option, Js.config.util.formSubmit);
		},
		editable: function(option)
		{
			Js.config.util.editable = Js.append(option, Js.config.util.editable, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.util.editable = Js.append(option.lang, Js.language.util.editable);
			}
		}
	},
	widget: {
		activity: function(option)
		{
			Js.config.widget.activity = Js.append(option, Js.config.widget.activity);
		},
		datePicker: function(option)
		{
			Js.config.widget.datePicker = Js.append(option, Js.config.widget.datePicker, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.widget.datePicker = Js.append(option.lang, Js.language.widget.datePicker);
			}
		},
		iconizer: function(option)
		{
			Js.config.widget.iconizer = Js.append(option, Js.config.widget.iconizer);
		},
		notice: function(option)
		{
			Js.config.widget.notice = Js.append(option, Js.config.widget.notice, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.widget.notice = Js.append(option.lang, Js.language.widget.notice);
			}
		},
		panel: function(option)
		{
			Js.config.widget.panel = Js.append(option, Js.config.widget.panel);
		},
		tab: function(option)
		{
			Js.config.widget.tab = Js.append(option, Js.config.widget.tab);
		}
	}
};/**
 * @projectDescription Language configuration for Savvy.UI
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.language = {
	ext: {
		validate: {
			string: "Require alphanumeric character input",
			number: "Require numberic input",
			email: "Require valid e-mail address input",
			required: "This input field is required",
			length: "This input field require {type} {value} character.",
			lengthExact: "exactly",
			lengthMinimum: "minimum",
			lengthMaximum: "maximum"
		}
	},
	util: {
		editable: {
			message: "Please enter a new option value...",
			title: "Editable Widget"
		}
	},
	widget: {
		datePicker: {
			selectMonthYear: "Jump to specific month and year",
			todayButton: "Select Today",
			days: ["S", "M", "T", "W", "T", "F", "S"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			shortMonths: ["Jan", "Feb", "Mac", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
		},
		notice: {
			titleSuccess: "Congratulation",
			titleNote: "Note",
			titleError: "Error has Occur",
			timer: "This message will automatically close in 5 seconds"
		}
	}
};/**
 * @projectDescription Parser Engine for Savvy.UI
 * @memberOf Js
 * @version 1.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */
   
/**
 * @alias Js.parse
 */
Js.parse = {
	html: {
		/**
		 * @alias Js.parse.html.to
		 * @param {String} data
		 */
		to: function(data) 
		{
			var data = new String(data);
			data = Jrun.htmlEncode(data);
			data = encodeURIComponent(data);
			
			return data;
		},
		/**
		 * @alias Js.parse.html.from
		 * @param {String} data
		 */
		from: function(data) 
		{
			var data = new String(value);
			data = decodeURIComponent(data);
			data = Jrun.htmlDecode(data);
			
			return data;
		}
	},
	/**
	 * @alias Js.parse.bbml
	 * @deprecated
	 * @param {String} data
	 * @return {String}
	 */
	bbml: function(data) 
	{
		return new String(data)
			.replace(/\[lt\]/g, "<")
			.replace(/\[gt\]/g, ">")
			.replace(/\[n\]/g, "&")
			.replace(/\&quot\;/g, "\"")
			.replace(/\&rsquo\;/g, "\'")
			.replace(/\[br\]/g, "\n")
			.replace(/\[break\]/g, "<br />");
	},
	xhr: {
		init: function(reply) 
		{
			var data = eval("(" + reply + ")");
			
			Js.debug.log("XHR: " + data);
			
			if (!!data.SUIXHR) {
				Js.parse.xhr.notice(data);
				Js.parse.xhr.href(data);
				Js.parse.xhr.update(data);
			}
		},
		notice: function(data) 
		{
			var note = Jrun.pickStrict(data.notice, "string");
			
			if (Jrun.isset(note) && note !== "") {
				window.alert(note);
				
				if (!!console) {
					console.log(note);
				}
			}
		},
		href: function(data) 
		{
			var href = Jrun.pickGrep(data.href, /^https?:\/\//g);
			var xhref = Jrun.pickGrep(data.xhref, /^https?:\/\//g);
			
			if (Jrun.isset(xhref) && xhref !== "") {
				Jrun.href(xhref, "_blank");
			} 
			else if (Jrun.isset(href) && href !== "") {
				Jrun.href(href);
			}
		},
		update: function(data) 
		{
			var args = Jrun.pickStrict(data.text, "string");
			var id = Jrun.pickStrict(data.id, "string");
			var selector = Jrun.pickStrict(selector, "string");
			var object = Jrun.pickStrict(data.exec, data.callback, null, "string");
			
			if (!!args) {
				if(!!selector) {
					Js.use(selector).html(args);
				} 
				else if (!!id) {
					Js.use("#" + id).html(args);
				} 
				else if (Jrun.isset(object)) {
					// eval the function without making a callback
					var callback = eval(object);
					// execute the function
					callback(args);
				}
			}
		}
	}
};/**
 * @projectDescription Input test script for Savvy.UI
 * @version 1.0.3
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.test = {
	/**
	 * Check if argument is a string
	 * @alias Js.test.isString
	 * @param {String} [data] argument to be tested
	 * @return {Boolean} return true if argument is a string
	 */
	isString: function(data) 
	{
		return (typeof(data) == "string" && isNaN(data));
	},
	/**
	 * Check if argument is a number
	 * @alias Js.test.isNumber
	 * @param {Number} [data] argument to be tested
	 * @return {Boolean} return true if argument is a number
	 */
	isNumber: function(data) 
	{
		return !isNaN(data);
	},
	/**
	 * Compare data with value
	 * @alias Js.test.isLength
	 * @param {String} [data] 
	 * @param {Number} [value]
	 * @return {Boolean} 
	 */
	isLength: function(data, value) 
	{
		var result = null;
		
		if (data.match(/^(exact|min|max)\-(\d*)$/i)) {
			var length = Jrun.toNumber(RegExp.$2);
			
			switch(RegExp.$1) {
				case 'max':
					result = value <= length;
					break;
				case 'min':
					result = value >= length;
					break;
				case 'exact':
					result = value == length;
					break;
				default:
					result = false;
			}
		}
		else {
			result = false;
		}
		
		return result;
	},
	/**
	 * Check if argument is an email address
	 * @alias Js.test.isEmail
	 * @param {String} data
	 * @return {Boolean}
	 */
	isEmail: function(data) 
	{
		return (data.match(Js.config.test.email));
	},
	/**
	 * Check if argument is a URL
	 * @alias Js.test.isURL
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isURL: function(data) 
	{
		return (data.match(Js.config.test.url));
	},
	/**
	 * Check if argument is an IP Address
	 * @alias Js.test.isIpAddress
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isIpAddress: function(data) 
	{
		return (data.match(Js.config.test.ip));
	},
	isPostcode: function(data)
	{
		return (data.match(Js.config.test.postcode));
	}
};/**
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
	language: null,
	cacheResult: null,
	__construct: function(node, option)
	{
		if (Jrun.isset(node)) {
			return this.init(node, option);
		}
		else {
			return this;
		}
	},
	setup: function(option)
	{
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting, ["lang"], true);
		if(Jrun.isset(option.lang)) {
			this.language = Js.append(option.lang, this.setting);	
		}
		
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
		this.node = Js.use(node).eq(0);
		
		// setup configuration
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.ext.validate);
		this.language = Js.append(this.language, Js.language.ext.validate);
		
		this._prepSetting();
		
		if (Jrun.isset(this.setting.autoExecute) && this.setting.autoExecute === true) {
			this.result();
		}
		
		return this;
	},
	result: function() {
		var that = this;
		
		var setting = this.setting;
		var fnBeforeStart = Jrun.pick(setting.beforeStart,null);
		var fnSuccess = Jrun.pick(setting.success, null);
		var fnOnError = Jrun.pick(setting.onError, null);
		var data = "";
		var lang = this.language;
		
		// set this.first to NULL
		this.first = null;
		
		if (Jrun.isfunction(fnBeforeStart)) {
			// execute the function and free up the memory
			fnBeforeStart(node);
			fnBeforeStart = null;
		}
		
		if (this.node.length >= 1) {
			// based on the form, select on input type
			var fields = Js.use(":input", this.node);
			
			fields.each(function(index, field) {
				var node = Js.use(field);
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
						else if (!!Jrun.inArrayGrep(/^(integer|number)$/, klass) && !Js.test.isNumber(value)) {
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
							if (types == "min") {
								types = lang.lengthMinimum;
							}
							else if (types == "max") {
								types = lang.lengthMaximum;
							}
							else if (types == "exact") {
								types = lang.lengthExact;
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
			this.cacheResult = false;
			return false;
		}
		else {
			// return all field data in querystring format
			if (Jrun.isfunction(fnSuccess)) {
				fnSuccess(data);
			}
			this.cacheResult = data;
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
			if (node.is(':checked')) {
				// only add checked checkbox input
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
	 * @param {Object} field
	 */
	_messageCleanUp: function(node) 
	{
		var errSpan = this.setting.errorNode;
		var errNode = node.siblings(errSpan);
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
		var errorNode = node.siblings(this.setting.errorNode).eq(0);
		
		if (errorNode.length < 1) {
			try {
				Js.use("<" + this.setting.error.node + "/>").addClass(this.setting.error.cssMessage).text(message).insertAfter(node[0]);
			} 
			catch (e) {
				Js.debug.error(e);
			}
		} 
		else {
			try {
				errorNode.eq(0).append('... ' + message);
			} catch (e) {
				Js.debug.error(e);
			}
		}
		
		node.bind("change", function() {
			var jnode = Js.use(this);
			if (jnode.val() != "") {
				that._messageCleanUp(jnode);
				that.first = null;
			}
		});
	}
});/**
 * @memberOf Js.util
 * @extends Js.base
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 */

/**
 * @classDescription Js.util.activeContent is a class
 * @alias Js.util.activeContent
 * @see Js.base.create
 */
Js.util.activeContent = Js.base.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	fnBeforeStart: null,
	fnSuccess: null,
	__construct: function(js) 
	{
		var js = Jrun.pickStrict(js, {}, "object");
		this.element = Jrun.pick(js.element, null);
		this.fnBeforeStart = Jrun.pick(js.beforeStart, this.fnBeforeStart);
		this.fbSuccess = Jrun.pick(js.success, this.fnSuccess);
		
		if(Jrun.isset(this.element)) 
		{
			this._selector();
			this._check();
		} 
		else 
		{
			var that = this;
			this.interval = window.setInterval(function() {
				that._check();
			}, 100);
		}
	},
	__destruct: function() 
	{
		if(Jrun.isset(this.interval)) 
		{
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.element = null;
		return null;
	},
	_selector: function() {
		var that = this;
		
		Js.use(this.element).bind("click", function() 
		{
			var href = Js.use(this).attr("href");
			var anchors = (Jrun.isset(href) ? href : this.href);
			
			if (anchors.match(/^\#/)) {
				var ahref = ["", anchors.substr(1)];
			} 
			else { 
				var ahref = anchors.split(/\#/);
			}
			
			if(Jrun.isfunction(that.fnBeforeStart)) {
				that.fnBeforeStart();
			}
			
			if(Jrun.isset(ahref[1])) {
				that.repeat = (ahref[1] === that.last);
				
				that.last = ahref[1];
				var data = ahref[1].split(/\//);
				that.init(data);
				
				if(Jrun.isfunction(that.fnSuccess)) {
					that.fnSuccess();
				}
			}
		});
	},
	_check: function() 
	{
		if (location.hash != this.last && location.hash !== "#") {
			this.last = location.hash;
			
			if (Jrun.isfunction(this.fnBeforeStart)) {
				this.fnBeforeStart();
			}
			
			var data = location.hash.substr(1).split(/\//);
			this.init(data);
			
			if (Jrun.isfunction(this.fnSuccess)) {
				this.fnSuccess();
			}
		}
	}
});/**
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
						if (Jrun.isfunction(that.setting.success)) {
							that.setting.success(reply);
						}
						
						Js.parse.xhr.init(reply);
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
});/**
 * @version 0.6.2
 * @memberOf Js.util
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.util.dimension = {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function()
			{
				var doc = document.body;
				var result = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
				
				if (typeof(offset) == "number") {
					result = offset;
				}
				else if (doc && doc.scrollLeft) {
					result = doc.scrollLeft;
				}
				else if (el && el.scrollLeft) {
					result = el.scrollLeft;
				}
				
				return result;
			},
			y: function()
			{
				var doc = document.body;
				var result = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if (typeof(offset) == "number") {
					result = offset;
				}
				else if (doc && doc.scrollTop) {
					result = doc.scrollLeft;
				}
				else if (el && el.scrollTop) {
					result = el.scrollLeft;
				}
				
				return result;
			},
			both: function()
			{
				return [
					Js.util.dimension.page.scrolls.x(), 
					Js.util.dimension.page.scrolls.y()
				];
			}
		},
		middle: function(width, height) 
		{
			var doc = document.body;
			var offset = [Js.use(window).width(), Js.use(window).height()];
			var axis = Js.util.dimension.page.scrolls.both();
			var result = [];
					
			result[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
			result[1] = Math.round(((offset[1] - height) / 2) + axis[1]); 
			//Math.round((((screen.height - 200) - height) / 2) + axis[1]);
			result[0] = (result[0] < 0 ? 0 : result[0]);
			result[1] = (result[1] < 0 ? 0 : result[1]);	
			result.reverse();
				
			return result;
		}
	},
	node: {
		scrolls: {},
		size: {},
		offset: function(node) 
		{
			var result = [0, 0, 0, 0];
			var loop = false;
			
			if (Jrun.isset(node)) {
				if (node.offsetParent) {
					loop = true;
					rdata[0] = node.offsetWidth;
					rdata[1] = node.offsetHeight;
					
					while (node.offsetParent) {
						result[2] += node.offsetTop;
						result[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				} 
				else {
					if (loop == false) {
						result[0] = Jrun.pick(node.scrollWidth, 0);
						result[1] = Jrun.pick(node.scrollHeight, 0);
						result[2] = Jrun.pick(node.offsetTop, 0);
						result[3] = Jrun.pick(node.offsetLeft, 0);
					}
				}
				return result;
			} 
			else {
				Js.debug.log("Js.util.dimension.node.offset: failed because node does not exist");
			}
		}
	}
};/**
 * @memberOf Js.util
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */
Js.util.formSubmit = Js.util.buttonSubmit.extend({
	handler: "submit",
	__construct: function(js)
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

/**
 * @projectDescription Checkbox Ticker for Savvy.UI
 * @memberOf Js.util
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 */

/**
 * Initiate new Js.util.ticker
 * @alias Js.util.ticker
 * @constructor
 * @param {Object} node
 */
Js.util.ticker = Js.base.create({
	element: null,
	node: null,
	__construct: function(selector)
	{
		if (Jrun.isset(selector)) {
			this.init(selector);
		}
	},
	/**
	 * Initialize the HTML Element
	 * 
	 * @method
	 * @param {Object} node
	 * @return {Object}
	 */
	init: function(selector) 
	{
		this.element = Jrun.pick(selector, null);
		
		if (Jrun.isset(this.element)) {
			this.node = Js.use(this.element);
		}
		
		return this;
	},
	/**
	 * Tick all checkbox
	 * 
	 * @method
	 */
	check: function() 
	{
		// loop all object
		this.node.each(function(index, value) {
			// set checked to true
			value.checked = true;
		});
	},
	/**
	 * Untick all checkbox
	 * 
	 * @method
	 */
	uncheck: function() 
	{
		// loops all object
		this.node.each(function(index, value) { 
			// set checked to false
			value.checked = false;
		});
	},
	/**
	 * Invert checkbox selection
	 * 
	 * @method
	 */ 
	invert: function() 
	{
		// loops all object
		this.node.each(function(index, value) {
			// reverse checkbox selection
			if (value.checked == true) {
				value.checked = false; // uncheck
			}
			else {
				value.checked = true; // checked
			}
		});
	}
});/**
 * @author crynobone
 */

Js.util.editable = Js.base.create({
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	value: null,
	input: null,
	lastSelected: null,
	__construct: function(element, option) {
		if(!!Jrun.isset(element)) {
			this.init(element, option);
		}
		return this;
	},
	setup: function(option) 
	{
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting, ["lang"], true);
		if(Jrun.isset(option.lang)) {
			this.language = Js.append(option.lang, this.language);
		}
	},
	init: function(selector, option) {
		var that = this;
		
		this.element = Jrun.pick(this.element, selector);
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.util.editable);
		this.language = Js.append(this.language, Js.language.util.editable);
		this.node = Js.use(this.element);
		
		this.node.change(function() {
			var node = Js.use(this);
			
			if (node.val() == that.setting.identifier) {
				that.getModalBox(this);
			}
		});
		
		this.node.each(function() {
			if(Js.use(this).val() == that.setting.identifier) {
				this.options[0].selected = true;
			}
		});
	},
	onModalBoxClose: function(field)
	{
		var opt = [];
		Js.use(field).children("option").each(function(index, value) {
			opt.push(Js.use(value).val());
		});
		var value = this.input.val();
		if(Jrun.isset(value) && Jrun.trim(value) != "" && !Jrun.inArray(value, opt)) {
			Js.use('<option selected="selected" value="' + value + '">' + value + '</option>').appendTo(field);
			this.value = value;
		} 
		else {
			field.options[0].selected = true;
		}
	},
	getModalBox: function(field)
	{
		var that = this;
		var content = Js.use("<div/>");
		
		this.box = new Js.widget.dialog({
			element: "editable_edit_box_" + Jrun.prep(this.element),
			title: this.language.title,
			width: 300,
			height: 100,
			onClose: function() {
				that.onModalBoxClose(field);
			},
			overlay: true
		});
		
		var p = Js.use("<p/>").plainHtml("" + this.language.message).appendTo(this.box.content[0]);
		this.input = Js.use('<input type="text" name="util_editable_' + Jrun.prep(this.element) + '" value="' + this.setting.prefix + '"/>').appendTo(this.box.content[0]);
		var submitBtn = Js.use('<input type="button"/>').val("Ok").setClass("submit-button").appendTo(this.box.content[0]);
		var cancelBtn = Js.use('<input type="button"/>').val("Cancel").setClass("cancel-button").appendTo(this.box.content[0]);
		var box = this.box;
		
		box.overlay.node.click(function() {
			that.input.val("");
			box.closePanel();
		});
		
		box.closeButton.click(function() {
			that.input.val("");
			box.closePanel();
		});
		
		submitBtn.click(function() {
			box.closePanel();
		});
		cancelBtn.click(function() {
			that.input.val("");
			box.closePanel();
		});
	}
});/**
 * @version 0.0.2 
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.util.smartInput = Js.base.create({
	node: null,
	__construct: function(node) 
	{
		if (Jrun.isset(node)) {
			this.init(node);
		}
	},
	init: function(node)
	{
		var node = Jrun.pick(node, this.node);
		this.node = Js.use(node);
		
		this.activate();
	},
	activate: function() 
	{	
		this.node.bind("blur", function() {
			var node = Js.use(this);
			if (Jrun.trim(node.val()) === "") {
				node.val(node.attr("title").toString());
			}
		}).bind("focus", function() {
			var node = Js.use(this);
			if (node.attr("title") == node.val()) {
				node.val("");
			}
		}).val(this.node.attr("title").toString());
	},
	deactivate: function()
	{
		this.node.unbind("blur", function() {
			var node = Js.use(this);
			if (Jrun.trim(node.val()) === "") {
				node.val(node.attr("title").toString());
			}
		}).unbind("focus", function() {
			var node = Js.use(this);
			if (node.attr("title") == node.val()) {
				node.val("");
			}
		});
	}
});/**
 * @projectDescription Activity Overlay for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * Initiate Activity layer to prevent user from interfering with running process.
 * 
 * @constructor
 * @alias Js.widget.activity
 * @param {String, Object} [selector] Any selector format supported by jQuery CSS Selector Engine
 * @param {Object} [option] Provide local setting as based on available option in Js.config.widget.activity
 * @return {Object} return this object
 */
Js.widget.activity = Js.base.create({
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	status: 0,
	__construct: function(selector, option)
	{
		if (Jrun.isset(selector)) {
			this.init(selector, option);
		}
		
		return this;
	},
	/**
	 * Setup local setting for this object
	 * 
	 * @method	
	 * @param {Object} option
	 */
	setup: function(option)
	{
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting, ["lang"], true);
		if(Jrun.isset(option.lang)) {
			this.language = Js.append(option.lang, this.language);
		}
	},
	/**
	 * Initiate internal call, assign DOM element as activity layer and this option
	 * 
	 * @see Js.widget.activity
	 * @method
	 * @param {String, Object} [selector] Any selector format supported by jQuery CSS Selector Engine
	 * @param {Object} [option] Provide local setting as based on available option in Js.config.widget.activity
	 */
	init: function(selector, option) 
	{
		this.element = Jrun.pick(selector, this.element);
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.activity);
		
		this.node = Js.use(this.element);
		
		if (this.node.length == 0) {
			this.node = Js.use("<div/>").attr("id", Jrun.prep(this.element)).appendTo("body");
		}
		
		this.node.css({
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: "none"
		}).setClass(Jrun.prep(this.setting.identifier)).css("opacity", 0.01);
	},
	/**
	 * Activate activity layer
	 * 
	 * @method
	 */
	activate: function(callback) 
	{
		if (this.status == 0) {
			this.node.css({
				"display": "block"
			}).fadeTo("normal", this.setting.opacity);
			
			var t = Js.util.dimension.page.middle(this.setting.boxWidth, this.setting.boxHeight);
			
			if (Jrun.isset(this.box)) {
				this.box.css({
					top: "130px",
					left: t[1] + "px"
				});
			}
		}
		
		this.status++;
		
		if (Jrun.isfunction(callback)) {
			callback();
		}
	},
	/**
	 * Load activity indicator image
	 * 
	 * @method
	 */
	loadImage: function() 
	{
		this.box = Js.use("<img/>").attr({
			src: this.setting.imagePath
		}).css({
			position: "absolute",
			width: this.setting.boxWidth + "px",
			height: this.setting.boxHeight + "px",
			zIndex: (this.setting.zIndex + 1)
		}).appendTo(this.node[0]);
	},
	/**
	 * Deactivate activity layer
	 * 
	 * @method
	 */
	deactivate: function(callback) 
	{
		if (this.status > 0) {
			this.node.fadeTo("normal", 0, function(){
				Js.use(this).css({
					"display": "none"
				});
				if (Jrun.isfunction(callback)) {
					callback();
				}
			});
		}
		
		this.status--;
		this.status = (this.status < 0 ? 0 : this.status);
	}
});/**
 * @version 0.7.3 
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.datePicker = Js.base.create({
	field: null,
	value: "",
	lastDate: null,
	type: null,
	node: null,
	element: null,
	renderTo: null,
	content: null,
	option: null,
	setting: null,
	language: null,
	range: null,
	minDate: null,
	maxDate: null,
	dateObject: new Date,
	date: null,
	day: null,
	month: null,
	year: null,
	__construct: function(js)
	{
		if (Jrun.typeOf(js) === "object") {
			this.init(js);
		}
	},
	/**
	 * Setup local configuration for this object
	 * 
	 * @method
	 * @param {Object} [option] Contains local configuration for this object
	 */
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting, ["lang"], true);
		if(Jrun.isset(option.lang)) {
			this.language = Js.append(option.lang, this.language);
		}
	},
	/**
	 * Initiate internal call, prepare all configuration before loading the calendar
	 * 
	 * @method
	 * @see Js.widget.calendar
	 * @param {Object} [js] Contains local configuration for this object
	 */
	init: function(js) 
	{
		var that = this;
		
		this.setup(js.option);
		this.setting = Js.append(this.setting, Js.config.widget.datePicker);
		this.language = Js.append(this.language, Js.language.widget.datePicker);
		
		this.element = Jrun.prep(Jrun.pick(js.element, this.element));
		this.renderTo = Jrun.pick(js.renderTo, this.renderTo);
		
		if(!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) {
			this.renderTo = Js.use("<div/>").appendTo("body");
		} 
		else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = Js.use(this.renderTo).eq(0);
		}
		
		js.range = Jrun.pickStrict(js.range, this.range, [null, null], "array");
		this.field = Jrun.pickStrict(js.field, this.field, "calendar-value", "string");
		this.type = Jrun.pickGrep(js.type, this.type, "single", /^(single|multiple)$/g);
		
		// check if minimum date have been set
		if (!!js.minDate && this.setting.dateFormat.test(js.minDate)) {
			this.minDate = Jrun.pick(js.minDate, null);
		}
		
		// check if maximum date have been set
		if (!!js.maxDate && this.setting.dateFormat.test(js.maxDate)) {
			this.maxDate = Jrun.pick(js.maxDate, null);
		}
		
		if (!!js.value && this.setting.dateFormat.test(js.value)) {
			var todayDate = js.value.match(this.setting.dateFormat);
			js.month = RegExp.$2;
			js.year = RegExp.$1;
			js.day = RegExp.$3;
		} 
		else if (!!js.value && js.value === "today") {
			// get today date
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this.dateObject.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this.dateObject.getFullYear() : js.year);
		this.day = Jrun.pickStrict(js.day, this.day, "number");
		
		this.date = [this.year, (this.month + 1), Jrun.pick(this.day, 1)].join("-");
		this.navigation = Jrun.pick(js.navigate, true);
		
		var _getRange = function(data) 
		{
			var result = null;
			var year = that.dateObject.getFullYear();
			
			if (!data || data.toLowerCase() == "now") {
				result = year; 
			}
			else if (data.match(/^(\+|\-)?(\d{1,4})$/)) {
				var plus = RegExp.$1;
				var value = RegExp.$2;
				
				if (plus == "+") {
					result = (year + Jrun.toNumber(value));
				}
				else if (plus == "-") {
					result = (year - Jrun.toNumber(value));
				}
				else {
					result = value;
				}
			}
			
			return result;
		};
		
		if (this.navigation == true) {
			js.range[0] = _getRange(js.range[0]);
			js.range[1] = _getRange(js.range[1]);
			
			if (js.range[0] < js.range[1]) {
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.maxYear(js.range[0]), this.minYear(js.range[1])];
		}
		
		if (Jrun.isfunction(this.setting.beforeStart)) {
			this.setting.beforeStart();
		}
		
		this.renderTo.text("");
		this.callback();
		
		return this;
	},
	minYear: function(year) 
	{
		var data = year;
		
		if (this.minDate) {
			var minDate = this.minDate.split("-");
			var newYear = Jrun.toNumber(minDate[0]);
			
			if (newYear > data) {
				data = newYear;
			}
		}
		
		return data;	
	},
	maxYear: function(year) 
	{
		var data = year;
		
		if (this.maxDate) {
			var maxDate = this.maxDate.split("-");
			var newYear = Jrun.toNumber(maxDate[0]);
			
			if (newYear < data) {
				data = newYear;
			}
		}
		
		return data;
	},
	prevMonth: function() 
	{
		this.day = null;
		this.dateObject = new Date(this.year, (this.month - 1));
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, (this.month + 1));
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	prevYear: function() 
	{
		this.day = null;
		this.dateObject = new Date((this.year - 1), this.month);
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date((this.year + 1), this.month);
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextMonth: function() 
	{
		this.day = null;
		this.dateObject = new Date(this.year, (this.month + 1));
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, (this.month - 1));
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextYear: function() 
	{
		this.day = null;
		this.dateObject = new Date((this.year + 1), this.month);
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date((this.year - 1), this.month);
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	customMonth: function(data) 
	{
		this.day = null;
		this.dateObject = new Date(this.year, data);
		var tempMonth = this.dateObject.getMonth();
		var tempYear = this.dateObject.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if (this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.text("");
			this.callback();
		}
		
		return this;
	},
	customYear: function(data) 
	{
		this.day = null;
		this.dateObject = new Date(data, this.month);
		var tempMonth = this.dateObject.getMonth();
		var tempYear = this.dateObject.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if (this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.text("");
			this.callback();
		}
		
		return this;
	},
	today: function() 
	{
		this.dateObject = new Date();
		this.year = this.dateObject.getFullYear();
		this.month = this.dateObject.getMonth();
		this.day = this.dateObject.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		
		this.renderTo.html("");
		this.callback();
	},
	validation: function() 
	{
		var data = false;
		var minDate = Jrun.isset(this.minDate);
		var maxDate = Jrun.isset(this.maxDate);
		
		if (minDate && maxDate && this.compare(minDate, this.date) && this.compare(this.date, maxDate)) {
			data = true;
		} 
		else if (minDate && this.compare(minDate, this.date)) {
			data = true;
		} 
		else if (maxDate && this.compare(this.date, maxDate)) {
			data = true;
		} 
		else if (!minDate && !maxDate) {
			data = true;
		}
		
		return data;
	},
	dayOfMonth: function(month, year) 
	{
		var month = Jrun.pick(month, this.month);
		var year = Jrun.pick(year, this.year);
		
		if (month == 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			var monthLength = 29;
		}
		
		return Jrun.pickStrict(monthLength, this.setting.daysInMonth[month], "number");
	},
	compare: function(first, second) 
	{
		var firsts = first.split("-");
		var seconds = second.split("-");
		
		var firstDate = new Date(firsts[0], (Jrun.toNumber(firsts[1]) - 1));
		firstDate.setDate(firsts[2]);
		
		var secondDate = new Date(seconds[0], (Jrun.toNumber(seconds[1]) - 1));
		secondDate.setDate(seconds[2]);
		
		return (secondDate >= firstDate ? true : false);
	},
	updateValue: function(year, month, day) 
	{
		var field = Js.use("#" + this.element + "_" + year + month + day).eq(0);
		var calendar = Js.use("#" + this.element + "-" + this.field).eq(0);
		
		var months = (month < 10 ? "0" + month : month);
		var days = (day < 10 ? "0" + day : day);
		
		if(this.type == "single") {
			if (!field.hasClass("calendar-day-selected")) {
				if (Jrun.isset(this.lastDate) && Js.use("#" + this.element + "_" + this.lastDate).length > 0) {
					var lastdate = Js.use("#" + this.element + "_" + this.lastDate).setClass("calendar-day");
				}
				
				field.setClass("calendar-day-selected");
				this.value = [year, months, days].join("-");
				
				calendar.val(this.value);
				this.lastDate = [year, month, day].join("");
			}
			else {
				field.setClass("calendar-day");
				calendar.val("");
			}
		} 
		else if (this.type == "multiple") {
			var value = calendar.val();
			var values = value.split("|");
			
			if (Jrun.inArray([year, months, days].join("-"), values)) {
				values.splice(values.indexOf([year, months, days].join("-")), 1);
				value = values.join("|");
				
				field.setClass("calendar-day");
				this.value = value;
				calendar.val(this.value);
			}
			else {
				field.setClass("calendar-day-selected");
				values[values.length] = [year, months, days].join("-");
				this.value = values.join("|");
				calendar.val(this.value);
			}
		}
		
		if (Jrun.isfunction(this.setting.onUpdate)) {
			this.setting.onUpdate.call(this);
		}
		
		return this;
	},
	callback: function() 
	{
		var cal = this.renderTo;
		var that = this;
		var first_day = new Date(this.year, this.month, 1);
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.dayOfMonth();
		cal.text("");
		
		this.node = Js.use("<div/>").attr({
			"id": [this.element, "calendar"].join("-"), 
			"class": "calendar-panel"
		}).css({
			"display": "block"
		}).appendTo(cal[0]);
		
		var wrapper = this.node;
		
		var header = Js.use("<div/>").appendTo(wrapper[0]).setClass("calendar-title");
		var content = Js.use("<div/>").appendTo(wrapper[0]);
		var footer = Js.use("<div/>").appendTo(wrapper[0]);
		
		var prevbtn = Js.use("<span/>").appendTo(header[0]);
		var nextbtn = Js.use("<span/>").appendTo(header[0]);
		var title = Js.use("<span/>").appendTo(header[0]);
		
		this.content = Js.use("<div/>").addClass("calendar-content").hide().appendTo(content[0]);
		this.option = Js.use("<div/>").addClass("calendar-option").hide().appendTo(content[0]);
		
		var table = Js.use("<table cellpadding='0' cellspacing='0'></table>").addClass("calendar-body").appendTo(this.content[0]);
		var tbody = Js.use("<tbody/>").appendTo(table[0]);
		
		var trheader = Js.use("<tr/>").addClass("calendar-header").appendTo(tbody[0]);
		
		for (var i = 0; i <= 6; i++) {
			Js.use("<td/>").addClass("calendar-header-day").text(this.language.days[i]).appendTo(trheader[0]);
		}
		
		var day = 1;
		
		for (var i = 0; i < 6; i++) {
			var weeks = Js.use("<tr/>").addClass("calendar-week").appendTo(tbody[0]);
			
			for (var j = 0; j <= 6; j++) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = Js.use("<td/>").addClass("calendar-" + (this.validation() ? "day" : "invalid")).appendTo(weeks[0]);
				
				if (day <= monthLength && (i > 0 || j >= start_day)) {
					days.attr("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if (this.validation()) {
						days.bind("click", function(){
						
							var i = Js.use(this).attr("id").split("_");
							var count = (i.length - 1);
							var ym = that.year + "" + that.month;
							tday = i[count].substr((ym.length), i[count].length);
							that.updateValue(that.year, (that.month + 1), Jrun.toNumber(tday));
						});
					}
					
					if (day == this.day) {
						days.setClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + Jrun.toNumber(this.day);
					}
					
					days.css("cursor", "pointer");
					
					days.text(day.toString());
					day++;
				}
				else {
					days.plainHtml("&nbsp;").setClass("calendar-invalid");
				}
			}
			
			if (day > monthLength) {
				break;
			}
		}
		
		
		if (this.setting.navigation == true) {
			prevbtn.plainHtml("&laquo;").bind("click", function(){
				that.prevMonth();
			}).setClass("prev-month");
			
			nextbtn.plainHtml("&raquo;").bind("click", function(){
				that.nextMonth();
			}).setClass("next-month");
			
			Js.use("<p/>").text(this.language.selectMonthYear).appendTo(this.option[0]);
			
			var selmonth = Js.use("<select name='month'></select>").bind("change", function(){
				that.customMonth(this.value);
			}).appendTo(this.option[0]);
			
			for (var i = 0; i < 12; i++) {
				if (this.month == i) {
					Js.use("<option value='" + i + "' selected='selected'></option>").text(this.language.months[i]).appendTo(selmonth[0]);
				}
				else {
					Js.use("<option value='" + i + "'></option>").text(this.language.months[i]).appendTo(selmonth[0]);
				}
			}
			
			var selyear = Js.use("<select name='year'></select>").text(" ").bind("change", function() {
				that.customYear(this.value);
			}).appendTo(this.option[0]);
			
			for (var i = this.range[0]; i >= this.range[1]; i--) {
				if (this.year == i) {
					Js.use("<option value='" + i + "' selected='selected'></option>").text(i.toString()).appendTo(selyear[0]);
				}
				else {
					Js.use("<option value='" + i + "'></option>").text(i.toString()).appendTo(selyear);
				}
			}
			
			Js.use("<input type='button' name='today' />").val(this.language.todayButton).bind("click", function(){
				that.today();
			}).addClass("select-today").appendTo(this.option[0]);
			
			title.setClass("this-month").plainHtml(this.language.months[this.month] + "&nbsp;" + this.year);
			this.node.data("toggle", 0);
			
			var _toggleContent = function()
			{
				var i = that.node.data("toggle");
				
				if (i === 1) {
					that.content.slideUp("normal");
					that.option.slideDown("normal");
					that.node.data("toggle", 0);
				}
				else {
					that.option.slideUp("normal");
					that.content.slideDown("normal");
					that.node.data("toggle", 1);
				}
			};
			
			title.css("cursor", "pointer").bind("click", _toggleContent);
			_toggleContent();
		}
		else {
			title.setClass("this-month").text(this.language.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (Jrun.isset(this.field)) {
			var input = Js.use("<input id='" + [this.element, this.field].join("-") + "' name='" + this.field + "' type='" + this.setting.fieldType + "' />").appendTo(this.content[0]);
			
			if (Jrun.isset(this.day)) {
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastDate = [this.year, (this.month + 1), Jrun.toNumber(this.day)].join("");
			}
		}
		
		return this;
	}
});

/**
 * @projectDescription Iconizer widget for Savvy.UI
 * @version 0.0.2
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

/**
 * @alias Js.widget.iconizer
 * @constructor
 * @param {Object} option
 */
Js.widget.iconizer = Js.base.create({
	setting: null,
	__construct: function(option)
	{
		if (Jrun.isset(option)) {
			this.init(option);
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
	 * @param {Object} option
	 */
	init: function(option) 
	{
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.iconizer);
		
		Js.use("*[class*=icon]").each(function(index, value) {
			var node = Js.use(value);
			
			var klas = node.attr("className");
			var klass = klas.split(/ /);
			
			for (var i = 0; i < klass.length; i++) {
				if (klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g)) {
					var append = (RegExp.$1 == "-append" ? true : false);
					var pos = Jrun.pickGrep(RegExp.$1, "left", /^(left|right)$/i);
					var icon = RegExp.$3;
					var bg = that.setting.folder + icon + "." + that.setting.fileType;
					
					if (!!append) {
						var obj = Js.use("<span/>").css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo(node[0]);
						
						if (pos == "left") {
							obj.css({
								"background": "url('" + bg + "') no-repeat left",
								"marginRight": "3px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					}
					else {
						if (pos == "left") {
							object.css({
								"background": "url('" + bg + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						}
						else {
							object.css({
								"background": "url('" + bg + "') no-repeat right center",
								"paddingRight": "17px"
							});
						}
					}
				}
			}
		});
	}
});/**
 * @version 0.2.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.panel = Js.base.create({
	node: null,
	renderTo: null,
	element: null,
	setting: null,
	header: null,
	container: null,
	closeButton: null,
	minimizeButton: null,
	content: null,
	footer: null,
	status: "normal",
	__construct: function(option)
	{
		if (Jrun.isset(option)) {
			this.init(option);
		}
	},
	setup: function(option)
	{
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	_prepSetting: function()
	{
		this.renderTo = Jrun.pick(this.setting.renderTo, "body:eq(0)");
		this.element = this.setting.element;	
	},	
	init: function(option)
	{
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.panel);
		this._prepSetting();
		
		// set renderTo element
		if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = Js.use(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		this._load();
	},
	_load: function()
	{
		var that = this;
		
		// render panel and hide it
		this.node = Js.use("<div/>").attr({
			id: this.element + "_panel",
			className: "widget-panel"
		}).appendTo(this.renderTo[0]);
		
		// set panel width
		if (Jrun.isset(this.setting.width)) {
			this.node.css("width", this.setting.width + "px");
		}
		
		// render header
		this.header = Js.use("<div/>").addClass("panel-header").appendTo(this.node[0]);
		// render content
		this.container = Js.use("<div/>").addClass("panel-content-container").appendTo(this.node[0]);
		// render footer
		this.footer = Js.use("<div/>").css({
			width: "100%",
			height: "15px"
		}).appendTo(this.node[0]);
		
		
		// set panel height
		if (Jrun.isset(this.setting.height)) {
			this.container.css("height", this.setting.height + "px");
		}
		
		// render header container for close and minimize button
		var ext = Js.use("<div/>").attr({
			className: "panel-ext"
		}).css({
			"cssFloat": "right", 
			"overflow": "hidden", 
			"width": "28px", 
			"height": "20px", 
			"textAlign": "right"
		}).appendTo(this.header[0]);
		
		// render header title
		var title = Js.use("<div/>").addClass("panel-title").text(this.setting.title).css({
			"overflow": "hidden", 
			"height": "20px"
		}).appendTo(this.header[0]);
		
		// render Close-Button 
		var tclose = Js.use("<span/>").text("x").css({
			"width": "14px",
			"display": "none"
		}).appendTo(ext[0]);
		
		// render Minimize-Button
		var tmin = Js.use("<span/>").text("_").css({
			"width": "14px",
			"display": "none"
		}).appendTo(ext[0]);
		
		// Enable Minimize-Button option
		if (!!this.setting.allowMinimize) {
			tmin.addClass("panel-min").css({
				"display": "block", 
				"cursor": "pointer"
			}).bind("click", function() {
				if (that.status == "normal") {
					
					that.container.slideUp("normal");
					that.status = "minimize";
				} 
				else {
					that.container.slideDown("normal");
					that.status = "normal";
				}
			});
			
		} else {
			tmin.addClass("panel-disabled");
		}
		this.minimizeButton = tmin;
		
		// Enable Close-Button option
		if (!!this.setting.allowClose) {
			tclose.addClass("panel-close").css({
				"display": "block",
				"cursor": "pointer"
			}).click(function() {
				that.closePanel();
			});
		} else {
			tclose.addClass("panel-disabled");
		}
		this.closeButton = tclose;
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.use("<div/>").attr({
			id: this.element, 
			className: "panel-content"
		}).appendTo(this.container[0]);
		
		try {
			this.content.html(this.setting.content);
		} catch(e) {
			this.content.plainHtml(this.setting.content);
		}
		
		// set height and scrolling option for content CONTAINER
		if (Jrun.isset(this.setting.height) && !!this.setting.scrolling) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px",
				"overflow": "auto"
			});
		}
		
		// make the panel visible
		this.node.show("slow");
		
		return this;
	},
	closePanel: function() 
	{
		var that = this;
		
		// callback to close panel
		this.node.fadeOut("slow", function() {
			if (Jrun.isfunction(that.setting.onClose)) {
				that.setting.onClose();
			}
			
			that.node.remove();
		});
		return this;
	},
	_fixResize: function() 
	{
		if (Jrun.isset(this.setting.height) && !!this.setting.scrolling) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
});
/**
 * @version 0.1.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	allowOverlay: false,
	_prepSetting: function()
	{
		this.renderTo = Jrun.pick(this.setting.renderTo, "body:eq(0)");
		this.element = this.setting.element;
		this.allowOverlay = Jrun.pickStrict(this.setting.overlay, this.allowOverlay, "boolean");
	},
	init: function(option)
	{
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.panel);
		this._prepSetting();
		
		// set renderTo element
		if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = Js.use(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		if (this.allowOverlay == true) {
			this.overlay = new Js.widget.activity("#overlay-panel");	
		}
		
		this._load();
		if (this.allowOverlay == true) {
			this.overlay.activate();
		}
		this._dimension();
	},
	closePanel: function() 
	{
		var that = this;
		if (this.allowOverlay == true) {
			this.overlay.deactivate();
		}
		
		// callback to close panel
		this.node.fadeOut("slow", function() {
			if (Jrun.isfunction(that.setting.onClose)) {
				that.setting.onClose();
			}
			
			that.node.remove();
		});
		return this;
	},
	_dimension: function()
	{
		var offset = [
			this.node.width(),
			this.node.height()
		];
		var center = Js.util.dimension.page.middle(offset[0], offset[1]);
		var left = center[1];
		var top = center[0];
		left = (left < 0 ? 0 : left);
		top = (top < 0 ? 0 : top);
		
		this.node.css({
			"position": "absolute", 
			"top": top + "px", 
			"left": left + "px",
			"zIndex": 6000
		});
	}
});/**
 * @version 0.0.3
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.notice = Js.widget.activity.extend({
	callback: null,
	node: null,
	setting: null,
	language: null,
	__construct: function(selector, option)
	{
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.notice);
		this.language = Js.append(this.language, Js.language.widget.notice);
		this.node = this._super.construct(selector, {
			boxWidth: 550,
			boxHeight: 0,
			opacity: 0.9
		});
		
		this.node.init();
		this.node.box = Js.use("<div/>").css({
			"position": "absolute",
			"width": "550px"
		}).appendTo(this._super.node[0]);
	},
	closeNotice: function() 
	{
		var that = this;
		if (Jrun.isfunction(this.callback)) {
			this.callback();
			this.callback = null;
		}
		
		this.node.deactivate(function() {
			that.node.box.text("");
		});
	},
	_domAddNotice: function(note, status)
	{
		var status = Jrun.pickGrep(status, "note", /^(note|success|error)$/i);
		var that = this;
		
		this.node.box.text("");
		this.node.activate();
		
		var title = this.language[Jrun.camelize("title-" + status)];
		var message = "";
		var opt = false;
		
		if (Jrun.typeOf(note) != "object") {
			title = note;
		}
		else {
			title = Jrun.pick(note.title, "");
			message = Jrun.pick(note.message, "");
			var opt = Jrun.pick(note.sticky, false);
		}
		
		this.node.box.setClass(this.setting['css' + Jrun.toProperCase(status)]);
		Js.use("<h3/>").text(title).appendTo(this.node.box[0]);
		
		if (message != "") {
			var p = Js.use("<p/>").plainHtml("" + message).appendTo(this.node.box[0]);
		}
		
		var span = Js.use("<em/>").text(Js.language.widget.notice.timer).appendTo(this.node.box[0]);
		
		this.node.node.one("click", function() {
			that.closeNotice();
		});
		
		if (opt == false) {
			setTimeout(function(){
				that.closeNotice();
			}, (this.setting.seconds * 1000));
		}
	},
	success: function(note, callback) 
	{
		this.callback = Jrun.pick(callback, null);
		this._domAddNotice(note, 'success');
	},
	note: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this._domAddNotice(note, 'note');
	},
	error: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this._domAddNotice(note, 'error');
	}
});/**
 * @version 0.9.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * @alias Js.widget.tab
 * @constructor
 * @param {String} selector 
 * @param {Object} option
 * @return {Object}
 */
Js.widget.tab = Js.base.create({
	height: null,
	toolbar: null,
	node: null,
	header: null,
	element: null,
	activeTab: null,
	activeHeader: null,
	handler: null,
	statys: "off",
	setting: null,
	__construct: function(selector, option)
	{
		if (!!Jrun.isset(selector)) {
			this.init(selector, option);
		}
	},
	setup: function(option)
	{
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	init: function(selector, option)
	{
		var that = this;
		
		// setting should be available
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.tab);
		
		this.node = Js.use(selector);
		this.node.addClass(this.setting.container);
		this.element = this.node.eq(0).attr("id");
		
		this.handler = Jrun.pickGrep(this.setting.handler, "click", /^(mouseover|click)$/i);
		
		// add tab toolbar on top
		this._addToolbar();
		
		// set the first tab as active
		this.activeHeader = Js.use("a[href=#" + this.activeTab.attr("id") + "]", this.header);
		this.activeHeader.addClass(this.setting.cssCurrent);
		this.activeTab.setClass(this.setting.cssActive);
		
		// tab is activated
		this.status = "on";
	},
	_addToolbar: function() 
	{
		var that = this;
		Js.debug.log("Js.widget.simpleTab: load Toolbar");
		
		// DOM insert tab toolbar container
		var div = Js.use("<div/>").attr({
			className: this.setting.toolbarContainer, 
			id: [this.element, "toolbar", "container"].join("-")
		}).prependTo(this.node[0]);
		this.toolbar = div;
		
		// DOM insert tab toolbar
		this.header = Js.use("<ul/>").attr({
			id: [this.element, "toolbar"].join("-"), 
			className: this.setting.toolbar
		}).appendTo(this.toolbar[0]);
		
		// find all possible tabs
		var child = Js.use(this.setting.identifier, this.node);
		
		child.each(function(index, data) {
			// add the tab title
			that._addHeader(data);
			// hide the tab
			Js.use(data).setClass(that.setting.cssHidden);
		});
		
		// first tab should be activated
		this.activeTab = child.eq(0);
		
		var div2 = Js.use("<div/>").css("display", "block").appendTo(div[0]);
	},
	_addHeader: function(node) 
	{
		Js.debug.log("Js.widget.simpleTab: add header");
		var that = this;
		
		var node = Js.use(node);
		var title = node.attr("title");
		
		var closable = node.hasClass(this.setting.closable);
		var disabled = node.hasClass(this.setting.disabled);
		
		var li = Js.use("<li/>").appendTo(this.header[0]);
		var a = Js.use("<a/>").attr({
			href: "#" + node.attr("id"), 
			title: title
		}).appendTo(li[0]);
		
		Js.use("<em/>").appendTo(a[0]);
		a.text(title);
				
		if (!!closable) {
			Js.use("<span/>").css("paddingLeft", "10px").text("x").click(function(){
				var my = Js.use(this.parentNode).click(function(){
					return false;
				});
				
				var href = my.attr("href");
				that.activeHeader.removeClass();
				that.activeTab.setClass(that.setting.hidden);
				Js.use(href).remove();
				Js.use(this.parentNode.parentNode).remove();
				
				that.revert();
			}).appendTo(a[0]);
		}
		
		if (!!disabled) {
			a.setClass(this.setting.cssDisabled).bind(this.handler, function(){
				return false;
			});
		}
		else {
			a.bind(this.handler, function(){
				that.activateTab(this);
				return false;
			});
		}
	},
	enableTab: function(selector)
	{
		var that = this;
		
		var anchor = Js.use("a[href=" + selector + "]", this.header);
		anchor.removeClass();
		anchor.unbind(this.handler);
		anchor.bind(this.handler, function(){
			that.activateTab(this);
			return false;
		});
				
		return false;
	},
	disableTab: function(selector)
	{
		var that = this;
		var that = this;
		
		var anchor = Js.use("a[href=" + selector + "]", this.header[0]);
		anchor.setClass(this.setting.cssDisabled);
		anchor.unbind(this.handler);
		anchor.bind(this.handler, function(){
			return false;
		});
		
		return false;
	},
	activateTab: function(node) 
	{
		var that = this;
		this.activeHeader.removeClass(this.setting.cssCurrent);
		this.activeTab.setClass(this.setting.cssHidden);
		
		this.activeHeader = Js.use(node);
		var href = this.activeHeader.attr("href");
		this.activeTab = Js.use(href);
		
		this.activeHeader.addClass(this.setting.cssCurrent);
		this.activeTab.setClass(this.setting.cssActive);
		
		return false;
	},
	revert: function() 
	{
		var active = Js.use("li > a", this.header[0]);
		
		if (active.length > 0) {
			this.activateTab(active.eq(0));
		}
	},
	toggle: function() 
	{
		if (this.status == "on") {
			this.toolbar.hide();
			Js.use("div." + this.setting.cssHidden, this.object).setClass(this.setting.cssActive);
			this.status = "off";
		}
		else {
			this.toolbar.show();
			Js.use("div." + this.setting.cssActive, this.object).setClass(this.setting.cssHidden);
			this.activeTab.setClass(this.setting.cssActive);
			this.status = "on";
		}
	},
	addTab: function(js) 
	{
		var that = this;
		
		if (!!js.id && Jrun.typeOf(js.id) === "string") {
			var title = Jrun.pick(js.title, "Untitled");
			var id = js.id;
			var content = Jrun.pick(js.content, "");
			var closable = Jrun.pick(js.closable, false);
			var set = Jrun.pick(js.activate, false);
			
			var node = Js.use('<div/>').attr({
				id: id,
				className: this.setting.cssHidden
			}).plainHtml(content).appendTo(this.node[0]);
			
			var li = Js.use('<li/>').appendTo(this.header[0]);
			var a = Js.use('<a/>').attr({
				href: "#" + id,
				title: title
			}).appendTo(li[0]);
			
			Js.use("<em/>").appendTo(a[0]);
			a.text(title).bind(this.handler, function(){
				that.activateTab(this);
				return false;
			});
			
			if (!!closable) {
				Js.use("<span/>").click(function(){
					var href = Js.use(this.parentNode).attr("href");
					that.activeHeader.removeClass();
					that.activeTab.setClass(that.setting.hidden).fadeOut("normal", function(){
						Js.use(this).remove();
					});
					Js.use(href).remove();
					Js.use(this.parentNode.parentNode).remove();
					
					that.revert();
				}).css("paddingLeft", "10px").text("x").appendTo(a[0]);
			}
			
			if (!!set) {
				this.activateTab(node);
			}
		}
		return this;
	}
});