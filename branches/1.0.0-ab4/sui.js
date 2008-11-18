/*
 * Savvy.UI JavaScript Library
 * Name: SUI
 * Build: 0.1.4-ab1
 * Last Updated: 2nd July 2008
 * Author: 
 * - Mior Muhammad Zaki Mior Khairuddin for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://www.savvyui.com
 * Licensed: the MIT License
 ***************************************************
 * Require: JavaScript (obviously)
*/

// Enable the code work as the global namespace of Savvy.UI but also the initializer for Js.elements Object
var Js = window.Js = function(selector, context) {
	var selector = (selector || document);
	
	if(this ===  window && !!Js.Elements) {
		return new Js.Elements(selector, context);
	} else {
		return this;
	}
};

// If you prefer SUI as global namespace, there it is.
var SUI = window.SUI = Js;

// this Savvy.UI version number
Js.version = "1.0.0";

// Savvy.UI namespace manager
Js.namespace = {
	// list all namespace
	lists: [],
	// include new namespace
	include: function(js) {
		if(Jrun.isset(js.name)) {
			this.lists[this.lists.length] = js.name;
			
			var that = Js[js.name] = js.object;
			if(Jrun.isset(js.proto)) {
				Js[js.name].prototype = js.proto;
			}
			
			return that;
		}
	},
	// check whether the namespace is available (log if namespace not available)
	require: function(name) {
		var isload = this.loaded(name);
		
		if(!isload) {
			Js.debug.log("Required Namespace Js." + name + " is not loaded");
		}
		
		return isload;
	},
	// identical to this.require but just return boolean
	loaded: function(name) {
		return Jrun.inArray(Js.namespace.lists, name);	
	}
};

Js.debug = {
	// Savvy.UI debugger option
	enable: false, 
	// Savvy.UI debugger message list
	message: [],
	// Savvy.UI debugger logging function
	log: function(text) {
		this.message[this.message.length] = text;
	
		if(!!this.enable) {
			try {
				console.log(text);	
			} catch(e) { 
				alert(text);
			}
		}
	}
};

// return Savvy.UI version
Js.toString = function() {
	return ["Savvy.UI", "version", Js.version].join(" ");
};
// extends Savvy.UI's Js.elements
Js.extend = function(name, object) {
	// check whether it's a function
	if(Jrun.isfunction(object) && !!Js.Elements) {
		// push the function in Js.elements
		Js.Elements.prototype[name] = object;
		return true;
	} else {
		return false;	
	}
};

Js.nue = function(object) {
	if(Jrun.typeOf(object) == "object") {
		var node = {};
		
		for(var method in object) {
			if(object.hasOwnProperty(method)) {
				node[method] = object[method];
			}
		}
		return node;
	} else {
		return object;
	}
};

// Add a numbers of function to Js.fn
var Jrun = Js.code = {
	// Check browser behaviour to determine whether it's based on IE, IE6, IE7, GECKO, OPERA or KHTML.
	behaviour: function() {
		// Return Object containing Boolean value of each browser object.
		return function() {
			var win = window;
			var doc = document;
			// make sure ie6 or ie7 is either false or true only.
			var items = { 
				ie: false,
				ie6: false,
				ie7: false,
				khtml: false,
				gecko: false,
				opera: false
			};
			// detect IE
			items.ie = items[win.XMLHttpRequest ? "ie7" : "ie6"] = (win.ActiveXObject ? true : false);
			// detect KHTML
			items.khtml = ((doc.childNodes && !doc.all && !navigator.taintEnabled) ? true : false);
			// detect Gecko
			items.gecko = (doc.getBoxObjectFor != null ? true : false);
			// detect Opera
			items.opera = (items.opera ? true : false);
			// return the object
			return items;
		}();
	}(),
	// (c) modified based on Douglas Crockford is function (taken from Pro JavaScript Technique - John Resig)
	browser: function() {
		return function() {
			var items = {
				ie: navigator.appName == 'Microsoft Internet Explorer',
				java: navigator.javaEnabled(),
				ns: navigator.appName == 'Netscape',
				ua: navigator.userAgent.toLowerCase(),
				version: parseFloat(navigator.appVersion.substr(21)) || parseFloat(navigator.appVersion),
				win: navigator.platform == 'Win32',
				opera: false,
				gecko: false,
				mac: false
			};
			items.mac = items.ua.indexOf('mac') >= 0;
			
			if(items.ua.indexOf('opera') >= 0) {
				items.ns = items.ie = false;
				items.opera = true;
			}
			if(items.ua.indexOf('gecko') >= 0) {
				items.ie = items.ns = false;
				items.gecko = true;
			}
			
			return items;
		}();
	}(),
	camelize: function(values) {
		var data = values.split(/\-/);
		
		if(data.length) {
			return data[0];
		}
		
		var value = (values.indexOf('-') == 0 ? data[0].charAt(0).toUpperCase() + data[0].substr(1) : data[0]);
		
		for(var i = 1; i < data.length && data[i]; i++) { 
			value += data[i].charAt(0).toUpperCase() + data[i].substr(1);
		}
		
		return value;
	},
	// create a callback function for node
	callback: function(node, fn, args) {
		if(this.isfunction(fn)) {
			try {
				// try to use apply (support multiple arguments)
				var args = this.toArray(arguments, 2);
				fn.apply(node, args);
			} catch(e) {
				// alternatively use call, but only can support one arguments
				fn.call(node, args);
			}
		}
		return node;
	},
	// loop callback function to each of the node
	each: function(node, fn) {
		if(this.isfunction(fn)) {
			// loop each node (node should be an array)
			for(var i = 0; i < node.length && !!node[i]; i++) {
				try {
					fn.apply(node[i], [node[i], i]);
				} catch(e) {
					// alternatively use call, but only can support one arguments
					try {
						fn.call(node[i], node[i] + "," + i);
					} catch(e) {
						fn(node[i], i);	
					}
				}
			}
		}
	},
	// finds whether HTML Elements existed.
	finds: function(element) {
		return (document.getElementById(this.trim(element)) ? true : false);
	},
	// prepare whether object or element have been send
	prepare: function(node, element, value) {
		var value = (this.isset(value) && value.match(/(object|element)/g) ? value : "element");
		var data = [this.isset(node), this.isset(element)];
		
		return (function(node, element, value, data) {
			if(data[0] && data[1]) {
				// both first and second are equal
				return (Js.attr.get(node, "id") == elem ? (value == "object" ? node : element) : false);
			} else if(data[1]) {
				// return second element
				return (value == "object" ? document.getElementById(element) : element);
			} else if(data[0]) {
				// return first element
				return (value == "object" ? node : Js.attr.get(node, "id"));
			} else {
				// all failed
				return false;
			}
		})(node, element, value, data);
	},
	// Load a URL location using JavaScript,
	// equivalent to JavaScript native location.href.
	href: function(url, target) {
		try {
			
			if(this.isnull(target)) {
				// load new URL in same window
				window.location.href = url;
			} else {
				// load new URL in a new window
				window.open(url, target);
			}
		} catch(e) {
			Js.debug.log("Jrun.href() failed: " + e);
		}
	},
	// Convert all string characters to HTML entities
	htmlEntities: function(value) {
		return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\+/g, "&#43;");
	},
	htmlEntityDecode: function(value) {
		return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#43;/g, "+");
	},
	// Get the indexOf based array's value
	'indexOf': function(data, value) {
		for(var i = data.length; i-- && data[i] !== value;);
		return i;
	},
	// Check whether the value is in an array
	inArray: function(data, value) {
		// loop the array to check each of it's value
		for(var i = 0; i < data.length && !!data[i]; i++) {
			if(data[i] === value) {
				return true;
				break;
			}
		}
		return false;
	},
	// Check whether the object is null or undefined.
	isnull: function(value) {
		// false if the object is defined and true if null/undefined.
		return (typeof(value) == "undefined" || value == null);
	},
	// Check whether the object is defined and not null.
	isset: function(value) {
		// true if the object is defined and false if null/undefined.
		return (this.isnull(value) ? false : true);
	},
	isfunction: function(value) {
		return ((!!value && typeof(value) === "function") ? true : false);
	},
	// Trim left of a string.
	ltrim: function(value) {
		return new String(value).replace(/^\s+/g, "");
	},
	// create a event handler function for any HTML Element
	on: function(node, handler, fn1, fn2) {
		var handler = this.trim(handler);
		try {
			if(!!node && node !== document) {
				if(handler === "hover") {
					// Add special event handler for "hover"
					if(this.isfunction(fn1)) {
						node["onmouseover"] = fn1;
					}
					if(this.isfunction(fn2)) {
						node["onmouseout"] = fn2;
					}
				} else { 
					// Anything else
					if(this.isfunction(fn1)) {
						node["on" + handler] = fn1;
					} else {
						return node["on" + handler];	
					}
				}
			}
		} catch(e) {
			Js.debug.log("Jrun.on: " + e);
		}
	},
	// Loop each option until find an option which does not return null and return it.
	pick: function(value) {
		var data = arguments;
		// loop all arguments.
		for(var i = 0; i < data.length; i++) {
			// Return the first option/n-option only if the previous option return null.
			if(this.isset(data[i])) {
				return data[i];
			}
		}
		return null;
	},
	prettyList: function(data, between, last) {
		var length = data.length;
		var value = new String;
		if(length > 1) {
			for(var i = 0; i < (length - 1); i++) {
				value = value + (i == 0 ? "" : between).data[i];	
			}
			value = value + last + data[(length - 1)];
		} else {
			value = data[0];	
		}
		
		return value;
	},
	rand: function(args) {
		var args = this.toArray(arguments);
		var length = 0;
		var offset = 0;
		
		if(args.length === 2) {
			offset = args[0];
			length = args[1];
		} else if(args.length === 1) {
			length = args[0];
		}
		return (Math.floor(Math.random() * length) + offset);
	},
	// Trim right of a string.
	rtrim: function(value) {
		return new String(value).replace(/\s$/g, "");
	},
	stripTags: function(value) {
		return new String(value).replace(/<([^>]+)>/g, "");
	},
	serialize: function(data) {
		var value = [];
		
		if(this.typeOf(data) === "array") {
			for(var i = 0; i < data.length && data[i]; i++) {
				if(!!Js.parse) { 
					data[i].value = Js.parse.html.to(data[i].value);
				}
				value[value.length] = data[i].name + "=" + data[i].value;
			}
		} else if(this.typeOf(data) == "object") {
			for(var values in data) {
				if(!!Js.parse) { 
					data[values] = Js.parse.html.to(data[values]);
				}
				
				value[value.length] = values + "=" + data[values];
			}
		} else {
			return "";
		}
		
		return value.join("&");
	},
	// Parse input string value as Number using ParseInt
	toNumber: function(value) {
		// return possible integer value of a string, if not a string then return self
		return (typeof(value) == "string" ? parseInt(value, 10) : value);
	},
	toProperCase: function(value) {
		var data = value.split(/ /g);
		var rdata = [];
		
		Jrun.each(data, function() {
			var val = this.toString();
			var first = val.substr(0, 1).toUpperCase();
			var other = val.substr(1);
			rdata[rdata.length] = [first, other].join("");
		});
		
		return rdata.join(" ");
	},
	// convert a object (mainly use for arguments) to array
	// & require on .length to check the length to object to convert 
	toArray: function(values, offset) {
		var offset = (this.isnull(offset) || offset < 1 ? 0 : offset);
		
		// return empty array
		if(this.isnull(values)) {
			return [];
		} else {
			// ensure the offset
			var offsetLength = (values.length - offset);
			var valueLength = values.length;
			var rdata = [];
			// loop and prepare r to be return
			while(offsetLength > 0) {
				--offsetLength;
				--valueLength;
				rdata[offsetLength] = values[valueLength];
			}
			return rdata;
		}
	},
	// Trim both left and right of a string.
	trim: function(value) {
		return new String(value).replace(/^\s+|\s+$/g, "");
	},
	typeOf: function(value) {
		if(typeof(value) == "object") {
			if(value.length > 0 && value[0].nodeType) {
				return "element";
			} else if(value.constructor === Array) {
				return "array";
			} else if(value.nodeType) {
				return "element";
			} else if(value.constructor !== Object) {
				return "function";
			} else {
				return "object";
			}
		} else { 
			return typeof(value);
		}
	},
	// return only unique value of an array
	unique: function(data, repeat) {
		// when option equal true it only reject value which is repeating
		var repeat = this.pick(repeat, false);
		var rdata = [];
		
		for(var i = 0; i < data.length && !!data[i]; i++) {
			if(!repeat) {
				// add only if unique
				if(!this.inArray(rdata, data[i])) {
					rdata[rdata.length] = data[i];
				}
			} else {
				// add only if previous value isn't the same
				if(i == 0) {
					rdata[rdata.length] = data[i];
				} else if(data[i] !== this.trim(data[i - 1])) { 
					rdata[rdata.length] = data[i];
				}
			}
		}
		
		return rdata;
	}
};

// Namespace for Savvy.UI Extension
Js.ext = {
	include: function(js) {
		if(Jrun.isset(js.name)) {
			this.lists[this.lists.length] = js.name;
			Js.namespace.lists[Js.namespace.lists.length] = "ext." + js.name;
			
			var that = this[js.name] = js.object;
			if(Jrun.isset(js.proto)) {
				this[js.name].prototype = js.proto;
			}
			
			return that;
		}
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			Js.debug.log("Required Namespace Js.ext." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return Jrun.inArray(this.lists, name);	
	}
};

Js.widget = {
	include: function(js) {
		if(Jrun.isset(js.name)) {
			this.lists[this.lists.length] = js.name;
			Js.namespace.lists[Js.namespace.lists.length] = "widget." + js.name;
			
			var that = Js.widget[js.name] = js.object;
			if(Jrun.isset(js.proto)) {
				this[js.name].prototype = js.proto;
			}
			
			return that;
		}
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			Js.debug.log("Required Namespace Js.widget." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return Jrun.inArray(this.lists, name);	
	}
};

Js.tool = {
	include: function(js) {
		if(Jrun.isset(js.name)) {
			this.lists[this.lists.length] = js.name;
			Js.namespace.lists[Js.namespace.lists.length] = "tool." + js.name;
			
			var that = this[js.name] = js.object;
			if(Jrun.isset(js.proto)) {
				this[js.name].prototype = js.proto;
			}
			
			return that;
		}
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			Js.debug.log("Required Namespace Js.tool." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return Jrun.inArray(this.lists, name);	
	}
};

Js.util = {
	include: function(js) {
		if(Jrun.isset(js.name)) {
			this.lists[this.lists.length] = js.name;
			Js.namespace.lists[Js.namespace.lists.length] = "util." + js.name;
			
			var that = this[js.name] = js.object;
			if(Jrun.isset(js.proto)) {
				this[js.name].prototype = js.proto;
			}
			
			return that;
		}
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			Js.debug.log("Required Namespace Js.util." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return Jrun.inArray(this.lists, name);	
	}
};