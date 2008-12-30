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
};/**
 * @projectDescription Form extension for Savvy.UI
 * @memberOf Js.ext
 * @version 0.9.4
 * @author Mior Muhammad Zaki crynobone
 * @license MIT
 */

/**
 * @constructor
 * @return {Object} this object
 */
Js.ext.form = function() {
	this.node = null;
	this.first = null;
	this.callback = null;
	this.setting = Js.config.ext.form;
	
	return this;
};

Js.ext.form.prototype = {
	validate: function(node, option) {		
		// ensure that refer to this
		var that = this;
		
		this.node = jQuery(node);
		
		var setting = Jrun.pick(option, {});
		setting = this.setting = Js.append(setting, this.setting);
		
		var beforeStart = Jrun.pick(setting.beforeStart,null);
		var success = Jrun.pick(setting.success, null);
		var onError = Jrun.pick(setting.onError, null);
		var data = "";
		var custom = Jrun.pick(setting.custom, null);
		
		this.first = null;
		
		if(Jrun.isfunction(beforeStart)) {
			beforeStart(this.node);
		}
		
		if(!!this.node) {
			// based on the form, select on input type
			jQuery(":input", this.node).each(function() {
				var object = jQuery(this);
				
				// remove previously loaded error message
				that.cleanUpMessage(this);
				
				// Double confirm the element is either input, select or textarea
				if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/g)) {
					if(this.name != "") {
						// turn the className into array so we can do some testing
						this.className = (!!this.className ? this.className : "");
						var klass = this.className.split(/\s/);
						var error = "";
						
						// if the element is required
						if(!!Jrun.inArray("required", klass) && Jrun.trim(this.value) === "") {
							error = Js.lang.ext.form.required;
						}
						
						// this set of validate only triggered when this.value isn't empty
						if (Jrun.trim(this.value) != "") {
							if (!!Jrun.inArray("string", klass) && !Js.test.isString(this.value)) {
								error = Js.lang.ext.form.string;
							} else if ((!!Jrun.inArray("integer", klass) || !!Jrun.inArray("number", klass)) && !Js.test.isNumber(this.value)) {
								error = Js.lang.ext.form.number;
							} else if (!!Jrun.inArray("email", klass) && !Js.test.isEmail(this.value)) {
								error = Js.lang.ext.form.email;
							}
						}
						
						if(Jrun.isset(custom)) {
							var testindex = Jrun.indexOfGrep(/^(custom)\-(\w*)$/g, klass);
							if (testindex >= 0) {
								klass[testindex].match(/^(custom)\-(\w*)$/g);
								
								var tester = RegExp.$2;
								var validate = custom[tester];
								var required = Jrun.pickStrict(validate.required, false, "boolean");
								
								if (Jrun.isset(validate)) {
									if (required === true && Jrun.trim(this.value) === "") {
										error = validate.error || error;
									}
									
									if(Jrun.trim(this.value) !== "") {
										if (Jrun.isfunction(validate.callback) && !validate.callback(this.value)) {
											error = validate.error || error;
										}
										else if (validate.test && !this.value.match(validate.test)) {
											error = validate.error || error;
										}
									}
								}
							}
						}
						
						for(var i = 0; i < klass.length; i++) {
							if(klass[i].match(/(max|min|exact)\-(\d*)/) && Jrun.trim(this.value) !== "") {
								var type = RegExp.$1;
								var value = RegExp.$2;
								
								if(!Js.test.isLength(klass[i], this.value.length)) {
									if(type == "min") {
										type = Js.lang.ext.form.lengthOption.minimum;	
									} else if(type == "max") {
										type = Js.lang.ext.form.lengthOption.maximum;	
									} else  if(type == "exact") {
										type = Js.lang.ext.form.lengthOption.exact;	
									}
									
									var note = Js.lang.ext.form.length;
									
									note = note.replace(/{type}/, type);
									note = note.replace(/{value}/, value);
									
									that.error(this, note, true);
								}
							}
						}
						
						if(error !== "") {
							that.error(this, error);
						}
						
						data += that.invokeQueryString(this);
						
					}
				}
			});
		}
		
		if(Jrun.isset(this.first)) { 
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} catch(e) {
				Js.debug.error("Cannot trigger onFirstFormError: " + e);
			}
			
			if(Jrun.isfunction(onError)) {
				onError(this.first);
			}
			// stop form processing
			return false;
		} else {
			// return all field data in querystring format
			if(Jrun.isfunction(success)) {
				success(data);
			}
			return data;
		}
	},
	error: function(field, text, data) {		
		var that = this;
		
		// Mark first error occured!
		this.first = (Jrun.isnull(this.first) ? field : this.first);
		
		var field = jQuery(field);
		var form = jQuery(this.node);
		var fieldName = field.attr("name");
		
		var fieldErrorId = [form.attr("id"), fieldName, "error"].join("-");
		var data = data || false;
		
		if (jQuery("#" + fieldErrorId).length == 0) {
			this.addMessage(field, text);
			
			field.change(function() {
				if (jQuery(this).val() != "") {
					that.cleanUpMessage(this);
					that.first = null;
				}
			});
		} 
		else if (jQuery("#" + fieldErrorId).length == 1 && !!data) {
			field.addClass("extform-error");
			var errorNode = field.siblings(this.setting.error.node + "." + this.setting.error.cssMessage).eq(0);
			var html = errorNode.html();
			
			if(html.match(text) === false && Jrun.trim(html) != "") {
				errorNode.append(text);
			}
			
			field.change(function() {
				if(jQuery(this).val() != "") {
					that.cleanUpMessage(this);
					that.first = null;
				}
			});
		}
	},
	invokeQueryString: function(node) {
		var data = "";
		
		// dump name and value to opt in querystring format ( &name=value )
		if(node.type.toLowerCase().match(/^(checkbox|radio)$/)) {
			if(node.type == "checkbox" && node.checked == true) {
				// only add checked checkbox input
				data = "&" + node.name + "=" + Js.parse.html.to(node.value);
			} else if (node.type == "radio" && node.checked == true) {
				// only add checked radiobox input
				data += "&" + node.name + "=" + Js.parse.html.to(node.value);
			}
		} else { 
			// add all input (except radio/checkbox)
			data = "&" + node.name + "=" + Js.parse.html.to(node.value);
		}
		
		return data;
	},
	cleanUpMessage: function(node) {
		var errSpan = this.setting.error.node + "." + this.setting.error.cssMessage;
		var errNode = jQuery(node).siblings(errSpan).eq(0);
		if (errNode.length == 1) {
			errNode.remove();
		}
	},
	addMessage: function(node, message) {
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

/**
 * Configuration option for Js.ext.form
 */
Js.config.ext.form = {
	error: {
		node: "span",
		cssMessage: "form-error-message",
		cssField: ""
	},
	beforeStart: null,
	success: null,
	onError: null,
	custom: {}
};

/**
 * Language option for Js.ext.form
 */
Js.lang.ext.form = {
	string: "Require alphanumeric character input",
	number: "Require numberic input",
	email: "Require valid e-mail address input",
	required: "This input field is required",
	length: "This input field require {type} {value} character.",
	lengthOption: {
		exact: "exactly",
		minimum: "minimum",
		maximum: "maximum"
	}
};/**
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
				
				if (typeof(offset) == "number") 
				{
					result = offset;
				}
				else if (doc && doc.scrollLeft) 
				{
					result = doc.scrollLeft;
				}
				else if (el && el.scrollLeft) 
				{
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
				
				if (typeof(offset) == "number") 
				{
					result = offset;
				}
				else if (doc && doc.scrollTop) 
				{
					result = doc.scrollLeft;
				}
				else if (el && el.scrollTop) 
				{
					result = el.scrollLeft;
				}
				
				return result;
			},
			both: function(){
				return [
					Js.util.dimension.page.scrolls.x(), 
					Js.util.dimension.page.scrolls.y()
				];
			}
		},
		middle: function(width, height) 
		{
			var doc = document.body;
			var offset = [Jrun.toNumber(doc.offsetWidth), Jrun.toNumber(doc.offsetHeight)];
			var axis = Js.util.dimension.page.scrolls.both();
			var result = [];
					
			result[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
			result[1] = Math.round((((screen.height - 200) - height) / 2) + axis[1]);
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
			
			if(Jrun.isset(node)) 
			{
				if(node.offsetParent) 
				{
					loop = true;
					rdata[0] = node.offsetWidth;
					rdata[1] = node.offsetHeight;
					
					while(node.offsetParent) 
					{
						result[2] += node.offsetTop;
						result[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				} 
				else 
				{
					if(loop == false) 
					{
						result[0] = Jrun.pick(node.scrollWidth, 0);
						result[1] = Jrun.pick(node.scrollHeight, 0);
						result[2] = Jrun.pick(node.offsetTop, 0);
						result[3] = Jrun.pick(node.offsetLeft, 0);
					}
				}
				return result;
			} 
			else 
			{
				Js.debug.log("Js.util.dimension.node.offset: failed because node does not exist");
			}
		}
	}
};
/**
 * 
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 * @extends Js.base
 */

Js.util.activeContent = Js.base.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	beforeStart: null,
	success: null,
	__construct: function(js) 
	{
		var js = Jrun.pickStrict(js, {}, "object");
		this.element = Jrun.pick(js.element, null);
		this.beforeStart = Jrun.pick(js.beforeStart, this.beforeStart);
		this.success = Jrun.pick(js.success, this.success);
		
		if(Jrun.isset(this.element)) 
		{
			this.selector();
			this.check();
		} 
		else 
		{
			var that = this;
			this.interval = window.setInterval(function() {
				that.check();
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
		this.__destruct();
		return null;
	},
	selector: function() {
		var that = this;
		
		jQuery(this.element).bind("click", function() 
		{
			var href = jQuery(this).attr("href");
			var anchors = (Jrun.isset(href) ? href : this.href);
			
			if(anchors.match(/^\#/)) 
			{
				var ahref = ["", anchors.substr(1)];
			} 
			else 
			{ 
				var ahref = anchors.split(/\#/);
			}
			
			if(Jrun.isfunction(this.beforeStart)) 
			{
				this.beforeStart();
			}
			
			if(Jrun.isset(ahref[1])) 
			{
				that.repeat = (ahref[1] === that.last);
				
				that.last = ahref[1];
				var data = ahref[1].split(/\//);
				that.init(data);
				
				if(Jrun.isfunction(this.success)) 
				{
					this.success();
				}
			}
		});
	},
	check: function() 
	{
		if (location.hash != this.last && location.hash !== "#") 
		{
			this.last = location.hash;
			
			if(Jrun.isfunction(this.beforeStart)) 
			{
				this.beforeStart();
			}
			
			var data = location.hash.substr(1).split(/\//);
			this.init(data);
			
			if(Jrun.isfunction(this.success)) 
			{
				this.success();
			}
		}
	}
});/**
 * @last-modified: 
 * @projectDescription Activity Overlay for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.activity = function(selector, option) 
{
	this.node = null;
	this.element = null;
	this.box = null;
	this.setting = Js.config.widget.activity;
	this.opacity = 0;
	this.status = 0;
	
	if(Jrun.isset(selector))
	{
		this.init(selector, option);
	}
};
Js.widget.activity.prototype = {
	init: function(selector, option) 
	{
		this.element = Jrun.pick(selector, this.element);
		this.setting = Js.append(Jrun.pick(option, {}), this.setting);
		
		this.node = jQuery(this.element).css({
			background: this.setting.css.backgroundColor
		}).fadeTo("slow", 0.01);
	},
	activate: function() 
	{
		if (this.status == 0) 
		{
			this.object.css({
				display: "block"
			}).fadeTo("normal", this.opacity);
			
			var t = Js.util.dimension.page.middle(this.boxWidth, this.boxHeight);
			
			if (Jrun.isset(this.box)) 
			{
				this.box.css({
					top: "130px",
					left: t[1] + "px"
				});
			}
			// we the time out for the procession to 20 seconds. Just in case the connection hangs
			setTimeout(function(){
				Js.widget.overlay.deactivate();
			}, 20000);
		}
		
		this.status++;
	},
	loadImage: function() 
	{
		this.box = jQuery("<img/>").attr({
			src: this.setting.box.imagePath
		}).css({
			position: "absolute",
			width: this.setting.box.width + "px",
			height: this.setting.box.height + "px",
			zIndex: this.setting.box.zIndex
		}).appendTo(this.node);
	},
	deactivate: function() 
	{
		if(this.status == 1) 
		{
			this.object.fadeTo("normal", 0, function() {
				jQuery(this).css({
					display: "none"
				});
			});
		}
		
		this.status--;
		this.status = (this.status < 0 ? 0 : this.status);
	}
};

Js.config.widget.activity = {
	box: {
		imagePath: "images/",
		width: 200,
		height: 20,
		zIndex: 5000
	},
	css: {
		backgroundColor: "#fff"
	}
};
/**
 * Calendar widget for Savvy.UI
 * <br>History:
 * <br>Calendar object based from The Strange Zen of JavaScript's How to build a simple calendar with JavaScript
 * <br>http://jszen.blogspot.com/2007/03/how-to-build-simple-calendar-with.html
 * @extends Js.widget
 * @version 0.7.1
 * @author Mior Muhammad Zaki
 * @license MIT
 */

/**
 * @id Js.widget.calendar
 * @constructor
 * @param {Object} js
 * @return {Object}
 */
Js.widget.calendar = function(js) 
{
	this.days = ["S", "M", "T", "W", "T", "F", "S"];	
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	this.shortmonths = ["Jan", "Feb", "Mac", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	this.daysinmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.grep = new RegExp(/^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
	
	this.field = null;
	this.value = "";
	this.lastdate = null;
	this.fieldtype = "hidden";
	this.type = null;
	this.navigation = null;
	
	this.object	= null;
	this.element = null;
	this.renderTo = null;
	this.node = {
		content: null,
		option: null
	};
	
	this.setting = Js.config.widget.calendar;
	this.drag = null;
	this.range = null;
	this.onupdate = null;
	
	this.mindate = null;
	this.maxdate = null;
	
	this.Dates = new Date();
	this.date = "";
	this.day = null;
	this.month = null;
	this.year = null;
	
	if (js && typeof(js) === "object") 
	{
		this.init(js);
	}
	
	return this;
};

Js.widget.calendar.prototype = 
{
	init: function(js) 
	{
		var that = this;
		
		this.element = Jrun.pick(js.element, this.element);
		this.renderTo = Jrun.pick(js.renderTo, this.renderTo);
		
		if(!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) 
		{
			this.renderTo = jQuery("<div/>").appendTo("body");
		} 
		else if(typeof(this.renderTo) === "string" || this.renderTo.nodeType) 
		{
			this.renderTo = jQuery(this.renderTo).eq(0);
		}
		
		//jQuery.facebox(this.renderTo);
		
		js.range = Jrun.pick(js.range, this.range, [null, null]);
		this.field = Jrun.pick(js.field, this.field, "value");
		this.type = Jrun.pickGrep(js.type, this.type, "single", /^(single|multiple)$/g);
		
		// check if minimum date have been set
		if (!!js.mindate && regexp.test(js.mindate)) 
		{
			this.mindate = Jrun.pick(js.mindate, null);
		}
		
		// check if maximum date have been set
		if (!!js.maxdate && regexp.test(js.maxdate)) 
		{
			this.maxdate = Jrun.pick(js.maxdate, null);
		}
		
		if (!!js.value && regexp.test(js.value)) 
		{
			var tdate = js.value.match(this.grep);
			js.month = RegExp.$2;
			js.year = RegExp.$1;
			js.day = RegExp.$3;
		} 
		else if (!!js.value && js.value === "today") 
		{
			// get today date
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this.Dates.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this.Dates.getFullYear() : js.year);
		this.day = Jrun.pickStrict(js.day, this.day, "number");
		
		this.date = [this.year, (this.month + 1), Jrun.pick(this.day, 1)].join("-");
		this.onupdate = Jrun.pick(js.onUpdate, null);
		this.navigation = Jrun.pick(js.navigate, true);
		
		var _getRange = function(data) 
		{
			var result = null;
			var year = that.Dates.getFullYear();
			
			if (!data || data.toLowerCase() == "now") 
			{
				result = year; 
			}
			else if (data.match(/^(+|-)?(\d{1,4})$/)) 
			{
				var plus = RegExp.$1;
				var value = RegExp.$2;
				
				if(plus == "+")
				{
					result = (year + Jrun.toNumber(value));
				}
				else if(plus == "-")
				{
					result = (year - Jrun.toNumber(value));
				}
				else 
				{
					result = value;
				}
			}
			
			return result;
		};
		
		if(this.navigation == true) 
		{
			js.range[0] = _getRange(js.range[0]);
			js.range[1] = _getRange(js.range[1]);
			
			if(js.range[0] < js.range[1]) 
			{
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.maxYear(js.range[0]), this.minYear(js.range[1])];
		}
		
		/*
		 * this.drag = Jrun.pick(js.draggable, false);
		 * Require Js.ext.draggable
		 */
		this.renderTo.html("");
		this.callback();
		
		return this;
	},
	minYear: function(year) 
	{
		var data = year;
		
		if (this.mindate) 
		{
			var minDate = this.mindate.split("-");
			var newYear = Jrun.toNumber(minDate[0]);
			
			if(newYear > data) 
			{ 
				data = newYear;
			}
		}
		
		return data;	
	},
	maxYear: function(year) 
	{
		var data = year;
		
		if(this.maxdate) 
		{
			var maxDate = this.maxdate.split("-");
			var newYear = Jrun.toNumber(maxDate[0]);
			
			if(newYear < data) 
			{
				data = newYear;
			}
		}
		
		return data;
	},
	prevMonth: function() 
	{
		this.day = null;
		this.Dates = new Date(this.year, (this.month - 1));
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) 
		{
			this.renderTo.html("");
			this.callback();
		} 
		else 
		{
			this.Dates = new Date(this.year, (this.month + 1));
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	prevYear: function() 
	{
		this.day = null;
		this.Dates = new Date((this.year - 1), this.month);
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) 
		{
			this.renderTo.html("");
			this.callback();
		} 
		else 
		{
			this.Dates = new Date((this.year + 1), this.month);
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextMonth: function() 
	{
		this.day = null;
		this.Dates = new Date(this.year, (this.month + 1));
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) 
		{
			this.renderTo.html("");
			this.callback();
		} 
		else 
		{
			this.Dates = new Date(this.year, (this.month - 1));
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextYear: function() 
	{
		this.day = null;
		this.Dates = new Date((this.year + 1), this.month);
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation())
		{
			this.renderTo.html("");
			this.callback();
		} 
		else 
		{
			this.Dates = new Date((this.year - 1), this.month);
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	customMonth: function(data) 
	{
		this.day = null;
		this.Dates = new Date(this.year, data);
		var tempMonth = this.Dates.getMonth();
		var tempYear = this.Dates.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if(this.validation()) 
		{
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.html("");
			this.callback();
		} 
		else 
		{
			this.Dates = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("");
			this.callback();
		}
		
		return this;
	},
	customYear: function(data) 
	{
		this.day = null;
		this.Dates = new Date(data, this.month);
		var tempMonth = this.Dates.getMonth();
		var tempYear = this.Dates.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if(this.validation()) 
		{
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.html("");
			this.callback();
		} 
		else 
		{
			this.Dates = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("");
			this.callback();
		}
		
		return this;
	},
	today: function() 
	{
		this.Dates = new Date();
		this.year = this.Dates.getFullYear();
		this.month = this.Dates.getMonth();
		this.day = this.Dates.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		
		this.renderTo.html("");
		this.callback();
	},
	validation: function() 
	{
		var data = false;
		var minDate = Jrun.isset(this.mindate);
		var maxDate = Jrun.isset(this.maxdate);
		
		if (minDate && maxDate && this.compare(this.mindate, this.date) && this.compare(this.date, this.maxdate)) 
		{
			data = true;
		} 
		else if (minDate && this.compare(this.mindate, this.date)) 
		{
			data = true;
		} 
		else if (maxDate && this.compare(this.date, this.maxdate)) 
		{
			data = true;
		} 
		else if (!minDate && !maxDate) 
		{
			data = true;
		}
		
		return data;
	},
	dayOfMonth: function(month, year) 
	{
		var month = Jrun.pick(month, this.month);
		var year = Jrun.pick(year, this.year);
		
		if (month == 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) 
		{
			var monthLength = 29;
		}
		
		return Jrun.pickStrict(monthLength, this.daysinmonth[month], "number");
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
		var field = jQuery("#" + this.element + "_" + year + month + day).eq(0);
		var calendar = jQuery("#" + this.element + "-" + this.field).eq(0);
		
		var months = (month < 10 ? "0" + month : month);
		var days = (day < 10 ? "0" + day : day);
		
		if(this.type == "single") 
		{
			if(!field.hasClass("calendar-day-selected")) 
			{
				if (Jrun.isset(this.lastdate) && Jrun.finds(this.element + "_" + this.lastdate)) 
				{
					var lastdate = jQuery("#" + this.element + "_" + this.lastdate).setClass("calendar-day");
				}
				
				field.setClass("calendar-day-selected");
				this.value = [year, months, days].join("-");
				
				calendar.val(this.value);
				this.lastdate = [year, month, day].join("");
			} 
			else 
			{
				field.setClass("calendar-day");
				calendar.val("");
			}
		} 
		else if (this.type == "multiple") 
		{
			var value = calendar.val();
			var values = value.split("|");
			
			if(Jrun.inArray([year, months, days].join("-"), values)){
				values.splice(values.indexOf([year, months, days].join("-")), 1);
				value = values.join("|");
				
				field.setClass("calendar-day");
				this.value = value;
				calendar.val(this.value);
			} 
			else 
			{
				field.setClass("calendar-day-selected");
				values[values.length] = [year, months, days].join("-");
				this.value = values.join("|");
				calendar.val(this.value);
			}
		}
		
		var fn = this.onupdate;
		if(fn != null && typeof(fn) == "function") {
			fn(this.value);
		}
		
		return this;
	},
	callback: function() {
		var cal = this.renderTo;
		var that = this;
		var first_day = new Date(this.year, this.month, 1);
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.dayOfMonth();
		cal.html("");
		
		var wrapper = this.object = jQuery("<div/>").attr({
			"id": [this.element, "calendar"].join("-"), 
			"class": "calendar-panel"
		}).css({
			"display": "block"
		}).appendTo(cal);
		
		var header = jQuery("<div/>").appendTo(wrapper);
		var content = jQuery("<div/>").appendTo(wrapper);
		var footer = jQuery("<div/>").appendTo(wrapper);
		
		var prevbtn = jQuery("<span/>").appendTo(header);
		var nextbtn = jQuery("<span/>").appendTo(header);
		var title = jQuery("<span/>").appendTo(header);
		
		this.node.content = jQuery("<div/>").addClass("calendar-content").appendTo(content);
		this.node.option = jQuery("<div/>").addClass("calendar-option").appendTo(content);
		
		var table = jQuery("<table cellpadding='0' cellspacing='0'></table>").addClass("calendar-body").appendTo(this.node.content);
		var tbody = jQuery("<tbody/>").appendTo(table);
		
		var trheader = jQuery("<tr/>").addClass("calendar-header").appendTo(tbody);
		
		for(var i = 0; i <= 6; i++) 
		{
			jQuery("<td/>").addClass("calendar-header-day").text(this.days[i]).appendTo(trheader);
		}
		
		var day = 1;
		
		for(var i = 0; i < 6; i++) 
		{
			var weeks = jQuery("<tr/>").addClass("calendar-week").appendTo(tbody);
			
			for(var j = 0; j <= 6; j++) 
			{
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = jQuery("<td/>").addClass("calendar-" + (this.validation() ? "day" : "invalid")).appendTo(weeks);
				
				if(day <= monthLength && (i > 0 || j >= start_day)) 
				{
					days.attr("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if(this.validation()) 
					{
						days.bind("click", function() {
							
							var i = jQuery(this).attr("id").split("_");
							var count = (i.length - 1);
							var ym = that.year + "" + that.month;
							tday = i[count].substr((ym.length), i[count].length);
							that.updateValue(that.year, (that.month + 1), Jrun.toNumber(tday));  
						});
					}
					
					if(day == this.day) 
					{
						days.setClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + Jrun.toNumber(this.day);
					} 
					
					days.css("cursor", "pointer");
					
					days.html(day.toString());
					day++;
				} 
				else 
				{
					days.html("&nbsp;").setClass("calendar-invalid");
				}
			}
			
			if(day > monthLength) 
			{
				break;
			}
		}
		
		
		if(this.navigation == true) 
		{
			prevbtn.html("&laquo;").bind("click", function() {
				that.prevMonth();					  
			}).setClass("prev-month");
			
			nextbtn.html("&raquo;").bind("click", function() {
				that.nextMonth();
			}).setClass("next-month");
			
			jQuery("<p/>").text("Sila pilih bulan dan tahun:").appendTo(this.node.option);
			
			var selmonth = jQuery("<select name='month'></select>").bind("change", function() {
				that.customMonth(this.value);
			}).appendTo(this.node.option);
			
			for(var i = 0; i < 12; i++) 
			{
				if(this.month == i) 
				{
					jQuery("<option value='" + i + "' selected='selected'></option>").text(this.months[i]).appendTo(selmonth);
				} 
				else 
				{
					jQuery("<option value='" + i + "'></option>").text(this.months[i]).appendTo(selmonth);
				}
			}
			
			var selyear = jQuery("<select name='year'></select>").text(" ").bind("change", function() {
				that.customYear(this.value);
			}).appendTo(this.node.option);
			
			for(var i = this.range[0]; i >= this.range[1]; i--) 
			{
				if(this.year == i) 
				{
					jQuery("<option value='" + i + "' selected='selected'></option>").text(i.toString()).appendTo(selyear);
				} 
				else 
				{ 
					jQuery("<option value='" + i + "'></option>").text(i.toString()).appendTo(selyear);
				}
			}
			
			jQuery("<input type='button' value='Pilih Hari Ini' name='today' />").bind("click", function() {
				that.today();													
			}).addClass("select-today").appendTo(this.node.option);
			
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
			this.object.data("toggle", 1);
			//Js.hash.set(this.element, "toggle", 1);
			
			title.css("cursor", "pointer").bind("click", function() {
				var i = that.object.data("toggle");
				
				if(i === 1) 
				{
					that.node.content.hide("normal");
					that.node.option.show("normal");
					that.object.data("toggle", 0);
				} 
				else 
				{
					that.node.option.hide("normal");
					that.node.content.show("normal");
					that.object.data("toggle", 1);
				}
			});
		} 
		else 
		{
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (Jrun.isset(this.field)) 
		{
			var input = jQuery("<input id='" + [this.element, this.field].join("-") + "' name='" + this.field + "' type='" + this.fieldtype + "' />").appendTo(this.node.content);
			
			if (Jrun.isset(this.day)) 
			{
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastdate = [this.year, (this.month + 1), Jrun.toNumber(this.day)].join("");
			}
		}
		
		return this;
	}
};/**
 * @projectDescription Iconizer widget for Savvy.UI
 * @version 0.0.2
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.iconizer = function(option) 
{
	this.setting = Js.config.widget.iconizer;
	
	if(Jrun.isset(option))
	{
		this.init(option);
	}
	
	return this;
};
Js.widget.iconizer.prototype = {
	init: function(option) 
	{
		var that = this;
		
		this.setting = Js.append(Js.append(option, {}), this.setting);
		
		jQuery("*[class*=icon]").each(function(index, value) {
			var node = jQuery(value);
			
			var klas = object.attr("className");
			var klass = klas.split(/ /);
			
			for(var i = 0; i < klass.length; i++) 
			{
				if(klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g)) 
				{
					var append = (RegExp.$1 == "-append" ? true : false);
					var pos = Jrun.pickGrep(RegExp.$1, "left", /^(left|right)$/i);
					var icon = RegExp.$3;
					var bg = that.setting.folder + icon + "." + that.setting.filetype;
					
					if(!!append) 
					{
						var obj = jQuery("<span/>").css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo(object);
						
						if(pos == "left") 
						{
							obj.css({
								"background": "url('" + bg + "') no-repeat left",
								"marginRight": "3px"
							});
						} 
						else 
						{
							obj.css({
								"background": "url('" + bg + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					} 
					else 
					{
						if(pos == "left") 
						{
							object.css({
								"background": "url('" + bg + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						} 
						else 
						{
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
};

Js.config.widget.iconizer = {
	filetype: "png",
	folder: "icons/"
};/**
 * @version 0.0.3
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.notice = {
	callback: null,
	node: null,
	href: "",
	setting: {},
	init: function()
	{
		this.setting = Js.append(this.setting, Js.config.widget.notice);
		
		this.node = new Js.widget.activity(this.setting.overlay);
		this.node.init();
		this.node.box = jQuery("<div/>").css({
			"position": "absolute",
			"width": "550px"
		}).appendTo(this.node);
		
		this.node.boxWidth = 550;
		this.node.boxHeight = 0;
		this.node.opacity = 0.9;
		
		return this;
	},
	closeNotice: function() 
	{
		if(Jrun.isfunction(this.callback)) 
		{
			this.callback();
		}
		
		Js.widget.notice.node.deactivate();
	},
	domAddNotice: function(note, status)
	{
		var status = Jrun.pickGrep(status, "note", /^(note|success|error)$/i);
		var that = this;
		
		Js.widget.notice.node.box.html("");
		Js.widget.notice.node.activate();
		
		var title = this.setting.title[status];
		var message = "";
		var opt = false;
		
		if(Jrun.typeOf(note) != "object") 
		{
			title = note;
		} 
		else 
		{
			title = Jrun.pick(note.title, "");
			message = Jrun.pick(note.message, "");
			this.href = Jrun.pick(note.href, "");
			var opt = Jrun.pick(note.sticky, false);
		}
		
		Js.widget.notice.node.box.setClass(this.setting.css[status]);
		jQuery("<h3/>").text(title).appendTo(Js.widget.notice.node.box);
		
		if(msg != "") 
		{
			var p = jQuery("<p/>").html("" + msg).appendTo(Js.widget.notice.node.box);
		}
		
		var span = jQuery("<em/>").text(this.setting.timer.text).appendTo(Js.widget.notice.node.box);
		
		setTimeout((function() {
			Js.widget.notice.node.click(function() {
				Js.widget.notice.closeNotice();
			});
		}), 1000);
		
		if(opt == false) {
			setTimeout(function() { 
				Js.widget.notice.closeNotice();
			}, (this.setting.timer.seconds * 1000));
		}
	},
	success: function(note, callback) 
	{
		this.callback = Jrun.pick(callback, null);
		this.domAddNotice(note, 'success');
	},
	note: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this.domAddNotice(note, 'note');
	},
	error: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this.domAddNotice(note, 'error');
	}
};

Js.config.widget.notice = {
	overlay: "#overlay-notice",
	title: {
		success: "Congratulation",
		note: "Note",
		error: "Error has Occur"
	},
	css: {
		success: "message-success",
		note: "message-note",
		error: "message-error"
	},
	timer: {
		text: "This message will automatically close in 5 seconds",
		seconds: 5
	}
};/**
 * Tab widget for Savvy.UI
 * @version 0.9.1
 * @author Mior Muhammad Zaki
 * @extends Js.widget
 * @license MIT
 */

/**
 * Initialize Js.widget.simpleTab using it constructor:<br>
 * e.g: <b>new Js.widget.simpleTab</b>
 * @id Js.widget.simpleTab
 * @constructor
 * @param {Object} node
 * @param {Object} option
 * @return {Object}
 */
Js.widget.simpleTab = function(node, option) 
{
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.node = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	this.handler = null;
	this.status = "off";
	this.setting = Js.config.widget.simpleTab;
	
	// load the tab module if selector already provided in the arguments
	if(!!Jrun.isset(node)) 
	{
		this.init(node, option);
	}
	
	return this;
};
Js.widget.simpleTab.prototype = {
	init: function(node, option) 
	{
		var that = this;
		
		// setting should be available
		this.setting = Js.append(Jrun.pick(option, {}), this.setting);
		
		this.node = jQuery(node);
		this.node.addClass(this.setting.panel.container);
		this.element = this.node.eq(0).attr("id");
		
		this.handler = Jrun.pickGrep(this.setting.handler, "click", /^(mouseover|click)$/i);
		
		// add tab toolbar on top
		this.addToolbar();
		
		// set the first tab as active
		this.activeHeader = jQuery("a[href=#" + this.activeTab.attr("id") + "]", this.header);
		this.activeHeader.addClass(this.setting.panel.currentHeader);
		this.activeTab.setClass(this.setting.panel.active);
		
		// tab is activated
		this.status = "on";
	},
	addToolbar: function() 
	{
		var that = this;
		
		// find all possible tabs
		var child = jQuery(this.setting.identifier, this.node);
		
		child.each(function(index, data) {
			// add the tab title
			that.addHeader(data);
			// hide the tab
			jQuery(data).setClass(that.setting.panel.hidden);
		});
		
		// first tab should be activated
		this.activeTab = child.eq(0);
		
		// DOM insert tab toolbar container
		var div = jQuery("<div/>").attr({
			className: this.setting.panel.toolbarContainer, 
			id: [this.element, "toolbar", "container"].join("-")
		}).prependTo(this.node);
		this.toolbar = div;
		
		// DOM insert tab toolbar
		this.header = jQuery("<ul/>").attr({
			id: [this.element, "toolbar"].join("-"), 
			className: this.setting.panel.toolbar
		}).appendTo(this.toolbar);
		
		var div2 = jQuery("<div/>").css("display", "block").appendTo(div);
	},
	addHeader: function(node) 
	{
		var that = this;
		
		var node = jQuery(node);
		var title = node.attr("title");
		var closable = node.hasClass("tab-closable");
		
		var li = jQuery("<li/>").appendTo(this.header);
		var a = jQuery("<a/>").attr({
			href: "#" + node.attr("id"), 
			title: title
		}).appendTo(li);
		
		jQuery("<em/>").appendTo(a);
		
		a.text(title).bind(this.handler, function() {
			that.activate(this);
			return false;
		});
		
		if(!!closable) 
		{
			jQuery("<span/>").css("paddingLeft", "10px").text("x").click(function() {
				var my = jQuery(this.parentNode).click(function() {
					return false;
				});
				
				var href = my.attr("href");
				that.activeHeader.removeClass();
				that.activeTab.setClass(that.setting.panel.hidden);
				jQuery(href).remove();
				jQuery(this.parentNode.parentNode).remove();
				
				that.revert();
			}).appendTo(a);
		}
	},
	activate: function(node) 
	{
		var that = this;
		this.activeHeader.removeClass(this.setting.panel.currentHeader);
		this.activeTab.setClass(this.setting.panel.hidden);
		
		this.activeHeader = jQuery(obj);
		var href = this.activeHeader.attr("href");
		this.activeTab = jQuery(href);
		
		this.activeHeader.addClass(this.setting.panel.currentHeader);
		this.activeTab.setClass(this.setting.panel.active);
		
		return false;
	},
	revert: function() 
	{
		var active = jQuery("li > a", this.header);
		
		if(active.length > 0) 
		{
			this.activate(active.eq(0));
		}
	},
	toggle: function() 
	{
		if(this.status == "on") 
		{
			this.toolbar.hide();
			jQuery("div." + this.setting.panel.hidden, this.object).setClass(this.setting.panel.active);
			this.status = "off";
		} 
		else 
		{
			this.toolbar.show();
			jQuery("div." + this.setting.panel.active, this.object).setClass(this.setting.panel.hidden);
			this.activeTab.setClass(this.setting.panel.active);
			this.status = "on";	
		}
	},
	addTab: function(js) 
	{
		var that = this;
		
		if(!!js.id && Jrun.typeOf(js.id) === "string") 
		{
			var title = Jrun.pick(js.title, "Untitled");
			var id = js.id;
			var content = Jrun.pick(js.content, "");
			var closable = Jrun.pick(js.closable, false);
			var set = Jrun.pick(js.activate, false);
			
			var node = jQuery('<div/>').attr({
				id: id, 
				className: this.setting.panel.hidden
			}).html(content).appendTo(this.node);
			
			var li = jQuery('<li/>').appendTo(this.header);
			var a = jQuery('<a/>').attr({
				href: "#" + id, 
				title: title
			}).appendTo(li);
			
			jQuery("<em/>").appendTo(a);
			a.text(title).bind(this.handler, function() {
				that.activate(this);
				return false;
			});
			
			if (!!closable) 
			{
				jQuery("<span/>").click(function() {
					var href = jQuery(this.parentNode).attr("href");
					that.activeHeader.removeClass();
					that.activeTab.setClass(that.setting.panel.hidden).fadeOut("normal", function() {
						jQuery(this).remove();
					});
					jQuery(href).remove();
					jQuery(this.parentNode.parentNode).remove();
				}).css("paddingLeft", "10px").text("x").appendTo(a);
			}
			
			if(!!set) 
			{
				this.activate(node);
			}
		}
		return this;
	}
};

/**
 * Js.widget.simpleTab configuration
 * @id Js.config.widget.simpleTab
 */
Js.config.widget.simpleTab = {
	handler: "click",
	identifier: "simpletab",
	closable: "tab-closable",
	panel: {
		toolbar: "simpletab-toolbar",
		toolbarContainer: "simpletab-toolbar-container",
		container: "simple-container",
		hidden: "simpletab-hidden",
		active: "simpletab-active",
		currentHeader: "current"
	}
};/**
 * Checkbox Ticker for Savvy.UI
 * @version 0.1.2
 * @memberOf Js.util
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.util.ticker = function(node) 
{
	// Define Object's properties
	this.element = null;
	this.node = null;
	
	// start __constructor()
	if (!!node && Jrun.trim(node) !== "") 
	{
		this.init(node);
	}
	
	return this;
};
Js.util.ticker.prototype = {
	/**
	 * Initialize the HTML Element
	 * @param {Object} node
	 * @return {Object}
	 */
	init: function(node) 
	{
		this.element = Jrun.pick(node, null);
		
		if (Jrun.isset(this.element)) 
		{ 
			this.node = jQuery(this.element);
		}
		
		return this;
	},
	/**
	 * checked all checkbox
	 * @return {void}
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
	 * uncheck all checkbox
	 * @return {void}
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
	 * invert checkbox selection
	 * @return {void}
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
};
