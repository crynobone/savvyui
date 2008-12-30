/**
 * Last-modified: 30-12-2008 12:15pm
 * @projectDescription Savvy.UI JavaScript extends the functionality of DOM manipulation via jQuery Framework
 * @namespace Js
 * @version 1.1.2
 * @extends jQuery-1.2.6
 * @author Mior Muhammad Zaki crynobone@gmail.com
 */

var Js = {
	adapter: "jQuery-1.2.6",
	version: "1.1.2",
	config: {
		ext: {},
		util: {},
		lang: {},
		parse: {},
		test: {},
		widget: {}
	},
	ext: {},
	util: {},
	lang: {
		ext: {},
		util: {},
		lang: {},
		parse: {},
		test: {},
		widget: {}
	},
	debug: {},
	parse: {},
	test: {},
	widget: {}
};

/**
 * Display Savvy.UI current version
 * @return {String}
 */
Js.toString = function() 
{
	return ["Savvy.UI", "version", Js.version, "using", Js.adapter].join(" ");	
};

/**
 * Return an inheritence of data
 * @param {Object} data
 * @return {Object}
 */
Js.nue = function(data) 
{
	if (Jrun.typeOf(data) == "object") 
	{
		var result = {};
		
		for (var method in data) 
		{
			if (data.hasOwnProperty(method)) 
			{
				result[method] = data[method];
			}
		}
		
		return result;
	}
	else 
	{
		// data not an object, just return the original data
		return data;
	}
};

/**
 * Append data Object with value's method
 * @param {Object} data
 * @param {Object} value
 * @return {Object}
 */
Js.append = function(data, value) 
{
	// check whether both are object
	if (Jrun.typeOf(data) == "object" && Jrun.typeOf(value) == "object") 
	{
		var result = data;
		
		// loop value's method
		for (var method in value) 
		{
			// if data doesn't have the method add it
			if (!data.hasOwnProperty(method) && value.hasOwnProperty(method)) 
			{
				result[method] = value[method];
			}
		}
		
		return result;
	}
	else 
	{
		// data isn't an object
		return data;
	}
};

Js.debug = {
	enable: false,
	data: {
		error: [],
		log: []
	},
	/**
	 * Log message
	 * @param {String} text
	 */
	log: function(text) 
	{
		this.data.log.push(text);
	},
	/**
	 * Log error
	 * @param {String} text
	 */
	error: function(text) 
	{
		this.data.error.push(text);
		
		// if Js.debug.enable is true, display the error
		if (!!this.enable) 
		{
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

var Jrun = {
	camelize: function(data) 
	{
		var values = data.split(/\-/);
		
		if (values.length) 
		{
			return values[0];
		}
		
		var result = (data.indexOf('-') == 0 ? values[0].charAt(0).toUpperCase() + values[0].substr(1) : values[0]);
		
		jQuery.each(values, function(index, value) {
			result = result + value.charAt(0).toUpperCase() + value.substr(1);
		});
		
		return result;
	},
	/**
	 * Open a webpage/URL using JavaScript
	 * @param {String} [url] set the hyperlink of destination path 
	 * @param {String} [target] set the target to show the page, if applicable
	 */
	href: function(url, target) 
	{
		if (this.trim(url) !== "") 
		{
			if (this.isnull(target)) 
			{
				// when target is not define load the page in the same window
				window.location.href = url;
			} 
			else 
			{
				window.open(url, target);
			}
		} 
		else 
		{
			Js.debug.error("Jrun.href: failed to load page " + url);
		}
	},
	/**
	 * Encode HTML entities from any given string
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
	 * @param {String} value
	 * @param {Array} data
	 * @return {Number}
	 */
	inArray: function(value, data) 
	{
		for(var index = 0; index < data.length && !!data[index]; index++) 
		{
			if(data[index] === value) 
			{
				return true;
				break;
			}
		}
		
		return false;
	},
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
	 * Get the indexOf based array's value
	 * @param {String} value
	 * @param {Array} data
	 * @return {Number}
	 */
	'indexOf': function(value, data) 
	{
		for (var index = data.length; index-- && data[index] !== value;);
		return index;
	},
	'indexOfGrep': function(value, data) 
	{
		for (var index = data.length; index-- && !data[index].match(value););
		return index;
	},
	/**
	 * 
	 * @param {Object} data
	 */
	isnull: function(data) 
	{
		return (typeof(data) == "undefined" || data == null);
	},
	/**
	 * Check whether passed value is defined
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isset: function(data) 
	{
		return !this.isnull(data);
	},
	/**
	 * Check whether the passed value is a function
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isfunction: function(data) 
	{
		return (!!data && typeof(data) === "function");
	},
	/**
	 * Trim left of a string
	 * @param {String} value
	 * @return {String}
	 */
	ltrim: function(value) 
	{
		return new String(value).replace(/^\s+/g, "");
	},
	/**
	 * Pick the first arguments that is defined
	 * @param {Object} js
	 */
	pick: function(js) 
	{
		var data = jQuery.makeArray(arguments);
		
		for(var index = 0; index < data.length; index++) 
		{
			var value = data[index];
            
            if (Jrun.isset(value)) 
			{
                return value;
            }
		};
		
		return null;
	},
	pickStrict: function(js) 
	{
		var data = jQuery.makeArray(arguments);
		var length = data.length;
		var last = data[(length - 1)];
		
		for(var index = 0; index < (length - 1); index++) 
		{
			var value = data[index];
            
            if (Jrun.isset(value)) 
			{
                if (this.typeOf(value) == last) 
				{
                    return value;
                }
            }
		};
		
		return null;
	},
	pickGrep: function(js) 
	{
		var data = jQuery.makeArray(arguments);
		var length = data.length;
		var last = data[(length - 1)];
		
		if (this.typeOf(last) == "string") 
		{
			last = new RegExp(last);
		}
		
		for(var index = 0; index < (length - 1); index++) 
		{
			var value = data[index];
            
            if (Jrun.isset(value)) 
			{
                if (!!value.match(last)) 
				{
                    return value;
                }
            }
		};
		
		return null;
	},
	prettyList: function(data, between, last) 
	{
		var length = data.length;
		var result = new String;
		
		if (length > 1) 
		{
			jQuery.each(data, function(index, value) {
				result = [result, (index == 0 ? "" : (index == (length - 1) ? last : between)), value].join("");
			});
		} 
		else 
		{
			result = data[0];
		}
		
		return result;
	},
	rand: function(js) 
	{
		var data = arguments;
		var length = 0;
		var offset = 0;
		
		if (data.length === 2) 
		{
			offset = data[0];
			length = data[1];
		} 
		else if (data.length === 1) 
		{
			length = data[0];
		}
		
		return (Math.floor(Math.random() * length) + offset);
	},
	/** 
	 * Trim right of a string.
	 * @param {String} value
	 * @return {String}
	 */
	rtrim: function(value) 
	{
		return new String(value).replace(/\s$/g, "");
	},
	/**
	 * Striptags work similiar to striptags in PHP, strip any html attribute from a string
	 * @param {String} value
	 * @return {String}
	 */
	stripTags: function(value) 
	{
		return new String(value).replace(/<([^>]+)>/g, "");
	},
	/**
	 * Serialize array or object to querystring 
	 * @param {Object} data
	 * @return {String}
	 */
	serialize: function(data) 
	{
		var result = [];
		
		if (this.typeOf(data) === "array") 
		{
			jQuery.each(data, function(index, val){
				if (!!Js.parse.html) 
				{
					val.value = Js.parse.html.to(val.value);
				}
				result.push(data[index].name + "=" + val.value);
			});
		}
		else if (this.typeOf(data) == "object") 
		{
			for (var val in data) 
			{
				if (!!Js.parse.html) 
				{
					data[val] = Js.parse.html.to(data[val]);
				}
					
				result.push(val + "=" + data[val]);
			}
		}
		else 
		{
			return "";
		}
		
		return result.join("&");
	},
	/**
	 * Parse input string value as Number using parseInt
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
	 * @param {String} data
	 * @return {Float}
	 */
	toFloat: function(data) 
	{
		return (typeof(data) == "string" ? parseFloat(data, 10) : data);
	},
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
	 * <br>This function conflicts with jQuery.makeArray
	 * @deprecated
	 * @param {Object, Array} [data] the source of data to be converted to Array 
	 * @param {Number} [offset] offset where to start converting to array, if applicable
	 * @return {Array}
	 */  
	toArray: function(data, offset) 
	{
		var offset = (this.isnull(offset) || offset < 1 ? 0 : offset);
		
		// return empty array
		if (this.isnull(data)) 
		{
			return [];
		}
		else 
		{
			// ensure the offset
			var offsetLength = (data.length - offset);
			var dataLength = data.length;
			var result = [];
			
			// loop and prepare r to be return
			while (offsetLength > 0) 
			{
				--offsetLength;
				--dataLength;
				result[offsetLength] = data[dataLength];
			}
			return result;
		}
	},
	/**
	 * Trim both left and right of a string.
	 * @param {String} data
	 * @return {String}
	 */
	trim: function(data) 
	{
		return new String(data).replace(/^\s+|\s+$/g, "");
	},
	/**
	 * Return the typeof passed argument, extending JavaScript default typeof
	 * @param {Object} data
	 * @return {String}
	 */
	typeOf: function(data) 
	{
		if (typeof(data) == "object") 
		{
			// object doesn't always turn out to be object
			if (data.length > 0 && data[0].nodeType) 
			{
				return "element";
			}
			else if (data.constructor === Array) 
			{
				return "array";
			}
			else if (data.nodeType) 
			{
				return "element";
			}
			else if (data.constructor !== Object) 
			{
				return "function";
			}
			else 
			{
				return "object";
			}
		}
		else 
		{
			return typeof(data);
		}
	},
	/** 
	 * return only unique value of an array
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
			if (!repeat) 
			{
				// add only if unique
				if (!Jrun.inArray(value, result)) 
				{
					result.push(value);
				}
			} 
			else 
			{
				if (index == 0) 
				{
					result.push(value);
				} 
				else if (value !== Jrun.trim(data[index - 1])) 
				{
					result.push(value);
				}
			}
		});
		
		return result;
	}
};

Js.base = function() {};
Js.base.prototype = {
	__destruct: function() 
	{
		// remove all properties and method for this object
		for (var method in this) 
		{
			this[method] = null;
		}
			
		for (var method in this.prototype) 
		{
			this.prototype[method] = null;
		}
		
		// delete this (which doesn't actually totally delete it
		delete this;
		
		return null;
	}
};

/**
 * Create a new Class with some simple Object-Oriented capability
 * @param {Object} js
 * @return {Object}
 */
Js.base.create = function(js) 
{
	var initialize = true;
	// add prototyping based on Js.base
	var prototype = new Js.base;
	initialize = false;
	
	// make a dummy class so that this.constructor will return Class
	function Class() 
	{
		if (!initialize && !!this.construct) 
		{
			this.construct.apply(this, jQuery.makeArray(arguments));
		}
	};
	
	Class.prototype = prototype;
	Class.prototype.construct = Jrun.pick(js.__construct, null);
	Class.constructor = Class;
	
	// createvar ext = Jrun.pick(js.ext, null); the extends available through our class
	Class.extend = function(js) 
	{
		js.extended = this;	
		return Js.base.create(js);
	};
	
	var extended = Jrun.pick(js.extended, null);
	
	// add this object user defined properties and methods
	(function(js) {
		// the following object shouldn't be extended
		var disallow = ["extended", "__construct", "__destruct", "_super", "prototype"];
		
		// start adding method and properties to this object
		for (var method in js) 
		{
			if (js.hasOwnProperty(method) && (!Jrun.inArray(method, disallow) && !this[method])) 
			{
				this[method] = js[method];
			}
		};
	}).call(prototype, js);
	
	if(!!Jrun.isset(extended)) 
	{
		try {
			// try to copy parent object.
			(function(js) {
				var disallow = ["extended", "__construct", "__destruct", "_super", "prototype"];
				
				// start adding parent method and properties to this object
				
				for (var method in js) 
				{
					if (js.hasOwnProperty(method) && (!Jrun.inArray(method, disallow) && !this[method])) 
					{
						this[method] = js[method];
					}
				}
				
				for (var method in js.prototype) 
				{
					if (js.prototype.hasOwnProperty(method) && (!Jrun.inArray(method, disallow) && !this[method])) 
					{
						this[method] = js.prototype[method];
					}
				}
				
				// create a linkage to the parent object
				this._super = js.prototype;
			}).call(prototype, extended);
		} catch(e) {
			Js.debug.error(e);
		}
	}
	
	// avoid this.ext to be duplicated in this.prototype 
	delete extended;
	
	return Class;
};

Js.parse = {
	html: {
		to: function(data) 
		{
			var data = new String(data);
			data = Jrun.htmlEncode(data);
			data = encodeURIComponent(data);
			
			return data;
		},
		from: function(data) 
		{
			var data = new String(value);
			data = decodeURIComponent(data);
			data = Jrun.htmlDecode(data);
			
			return data;
		}
	},
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
			
			if (!!data.SUIXHR) 
			{
				Js.parse.xhr.notice(data);
				Js.parse.xhr.href(data);
				Js.parse.xhr.update(data);
			}
		},
		notice: function(data) 
		{
			var note = Jrun.pickStrict(data.notice, "string");
			
			if (Jrun.isset(note) && note !== "") 
			{
				window.alert(note);
				
				if (!!console) 
				{
					console.log(note);
				}
			}
		},
		href: function(data) 
		{
			var href = Jrun.pickGrep(data.href, /^https?:\/\//g);
			var xhref = Jrun.pickGrep(data.xhref, /^https?:\/\//g);
			
			if (Jrun.isset(xhref) && xhref !== "") 
			{
				Jrun.href(xhref, "_blank");
			} 
			else if (Jrun.isset(href) && href !== "") 
			{
				Jrun.href(href);
			}
		},
		update: function(data) 
		{
			var args = Jrun.pickStrict(data.text, "string");
			var id = Jrun.pickStrict(data.id, "string");
			var selector = Jrun.pickStrict(selector, "string");
			var object = Jrun.pickStrict(data.exec, data.callback, null);
			
			if (!!args) 
			{
				if(!!selector) 
				{
					jQuery(selector).html(args);
				} 
				else if (!!id) 
				{
					jQuery("#" + id).html(args);
				} 
				else if (Jrun.isset(object)) 
				{
					// eval the function without making a callback
					var callback = eval(object);
					// execute the function
					callback(args);
				}
			}
		}
	}
};

Js.test = {
	/**
	 * Check whether passed argument is a string
	 * @param {String} data
	 * @return {String}
	 */
	isString: function(data) 
	{
		return (typeof(data) == "string" && isNaN(data));
	},
	/**
	 * Check whether passed argument is a number
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isNumber: function(data) 
	{
		return !isNaN(data);
	},
	/**
	 * Check if 'data' is an email address
	 * @param {String} data
	 * @return {Boolean}
	 */
	isEmail: function(data) 
	{
		return (data.match(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/));
	},
	/**
	 * Compare 'regexp' with provided 'value'
	 * @param {String} regexp
	 * @param {Object} value
	 * @return {Boolean}
	 */
	isLength: function(regexp, value) 
	{
		var data = regexp.split(/\-/);
		var length = Jrun.toNumber(data[1]);
		var result = null;
		
		if (data[0] === "max") 
		{
			result = (value <= length ? true : false);
		}
		else if (data[0] === "min") 
		{
			result = (value >= length ? true : false);
		} 
		else if (data[0] === "exact") 
		{
			result = (value == length ? true : false);
		} 
		else 
		{
			result = true;
		}
		
		return result;
	},
	/**
	 * Check if 'data' is a URL
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isURL: function(data) 
	{
		return (data.match(/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/));
	},
	/**
	 * Check if 'data' is an IP Address
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isIpAddress: function(data) 
	{
		return (data.match(/^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/));
	}
};