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
Js.append = function(data, value, filter) 
{
	var filter = Jrun.pickStrict(filter, null, "array");
	
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
};