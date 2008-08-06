/*
 * Savvy.UI JavaScript Library
 * Name: Base
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

// Enable SUI to not only work as the global namespace of Savvy.UI but also the initializer for SUI.Elements
var SUI = window.SUI = function(sel, parent) {
	var sel = sel || document;
	
	if(this === window && !!SUI.Elements) {
		// Initialize call to Query Elements
		return new SUI.Elements(sel, parent);
	} else {
		// else return as this
		return this;
	}
};

// Savvy.UI Namespace Manager.
SUI.namespace = {
	lists: [],
	include: function(name, fn) {
		SUI.namespace.lists[SUI.namespace.lists.length] = name;
		SUI[name] = fn;
		return SUI[name];
	},
	require: function(name) {
		var isload = this.loaded(name);
		
		if(!isload) {
			SUI.fn.logger("Required Namespace SUI." + name + " is not loaded");
		}
		
		return isload;
	},
	loaded: function(name) {
		return SUI.namespace.inArray(SUI.namespace.lists, name);	
	}
};

SUI.toString = function() {
	return ["Savvy.UI", "version", SUI.fn.version].join(" ");
};
SUI.extend = function(name, fn) {
	// check whether it's a function
	if(SUI.fn.isfunction(fn) && !!SUI.Elements) {
		// push the function in SUI.Elements
		SUI.Elements.prototype[name] = fn;
	}
};

// Add a numbers of function to SUI.Base
SUI.fn = {
	_$: null,
	// Return current running version/build of Savvy.UI
	version: "0.1.4-ab1", // leave this value alone
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
	// By default, Savvy.UI will store all error log in SUI.fn.logs Arrays. 
	// To display an alert or use Firebug's console display (if Firebug is enabled) set SUI.fn.debug to true.
	debug: false, // Debug option value, choose true to enable debugging mode.
	// create a callback function for node
	callback: function(node, fn, args) {
		if (this.isfunction(fn)) {
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
	each: function(node, fn, args) {
		if(this.isfunction(fn)) {
			// loop each node (node should be an array)
			for (var i = 0; i < node.length && !!node[i]; i++) {
				try {
					var args = this.toArray(arguments, 2);
					fn.apply(node[i], [node[i], i]);
				} catch(e) {
					// alternatively use call, but only can support one arguments
					fn.call(node[i], node[i] + "," + i);
				}
			}
		}
	},
	// extends SUI.Ext.Elements with additional function
	extend: function(name, fn) {
		// check whether it's a function
		SUI.extend(name, fn);
	},
	// finds whether HTML Elements existed.
	finds: function(elem) {
		return (document.getElementById(this.trim(elem)) ? true : false);
	},
	// prepare whether object or element have been send
	prepare: function(node, elem, value) {
		var value = (this.isset(value) && value.match(/(object|element)/g) ? value : "element");
		var data = [this.isset(node), this.isset(elem)];
		
		return (function(node, elem, value, data) {
			
			if (data[0] && data[1]) {
				// both first and second are equal
				return (SUI.Attr.Get(node, "id") == elem ? (value == "object" ? node : elem) : false);
			} else if (data[1]) {
				// return second element
				return (value == "object" ? document.getElementById(elem) : elem);
			} else if (data[0]) {
				// return first element
				return (value == "object" ? node : SUI.Attr.Get(node, "id"));
			} else {
				// all failed
				return false;
			}
		})(node, elem, value, data);
	},
	// Load a URL location using JavaScript,
	// equivalent to JavaScript native location.href.
	href: function(url, target) {
		try {
			
			if (this.isnull(target)) {
				// load new URL in same window
				window.location.href = url;
			} else {
				// load new URL in a new window
				window.open(url, target);
			}
		} catch(e) {
			this.logger("SUI.fn.href() failed: " + e);
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
	"indexOf": function(data, value) {
		for (var i = data.length; i-- && data[i] !== value;);
		return i;
	},
	// Check whether the value is in an array
	inArray: function(data, value) {
		// loop the array to check each of it's value
		for (var i = 0; i < data.length && !!data[i]; i++) {
			if (data[i] === value) {
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
	// Contain all errors/logs string generated by Savvy.UI.
	logs: [],
	// Initialize error logging and notify user using either window.alert or console.log (using Firebug) 
	// when SUI.fn.debug is set to true.
	logger: function(text) {
		var text = this.trim(text);
		this.logs[this.logs.length] = text;
		
		if (this.debug) {
			try {
				// try to use console.log (for FireBug, Opera (I think) and Safari)
				console.log(text);
			} catch(e) {
				// for IE based browser
				alert(text);
			}
		}
		return false;
	},
	// Trim left of a string.
	ltrim: function(value) {
		return new String(value).replace(/^\s+/g, "");
	},
	// create a event handler function for any HTML Element
	on: function(node, handler, fn1, fn2) {
		var handler = this.trim(handler);
		try {
			if (!!node && node !== document) {
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
					}
				}
			}
		} catch(e) {
			this.logger("SUI.fn.on() failed: " + fn + e);
		}
	},
	// Loop each option until find an option which does not return null and return it.
	pick: function(value) {
		var data = arguments;
		// loop all arguments.
		for (var i = 0; i < data.length; i++) {
			// Return the first option/n-option only if the previous option return null.
			if (this.isset(data[i])) {
				return data[i];
			}
		}
		return null;
	},
	// Trim right of a string.
	rtrim: function(value) {
		return new String(value).replace(/\s$/g, "");
	},
	stripTags: function(value) {
		return new String(value).replace(/<([^>]+)>/g, '');
	},
	serialize: function(data) {
		var val = [];
		
		if(this.typeOf(data) === "array") {
			for(var i = 0; i < data.length && data[i]; i++) {
				if(!!SUI.Parser) { 
					data[i].value = SUI.Parser.HTML.to(data[i].value);
				}
				val[val.length] = data[i].name + "=" + data[i].value;
			}
		} else if(this.typeOf(data) == "object") {
			for(var value in data) {
				if(!!SUI.Parser) { 
					data[value] = SUI.Parser.HTML.to(data[value]);
				}
				
				val[val.length] = value + "=" + data[value];
			}
		} else {
			return "";
		}
		
		return val.join("&");
	},
	// Parse input string value as Number using ParseInt
	toNumber: function(value) {
		// return possible integer value of a string, if not a string then return self
		return (typeof(value) == "string" ? parseInt(value, 10) : value);
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
			while (offsetLength > 0) {
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
				return "HTMLelement";
			} else if(value.constructor === Array) {
				return "array";
			} else if(value.nodeType) {
				return "HTMLelement";
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
	unique: function(data, value) {
		// set val to true to enable only unique based on previous value
		var value = this.pick(value, false);
		var rdata = [];
		
		for (var i = 0; i < data.length && !!data[i]; i++) {
			if(!value) {
				// add only if unique
				if (!this.inArray(rdata, data[i])) {
					rdata[rdata.length] = data[i];
				}
			} else {
				// add only if previous value isn't the same
				if (i == 0) {
					rdata[rdata.length] = data[i];
				} else if (data[i] !== this.trim(data[i - 1])) { 
					rdata[rdata.length] = data[i];
				}
			}
		}
		
		return rdata;
	}
};
// Namespace for Savvy.UI Extension
SUI.namespace.include("Ext", {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		SUI.namespace.lists[SUI.namespace.lists.length] = "Ext." + name;
		
		return this[name] = fn;
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			SUI.fn.logger("Required Namespace SUI.Ext." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return SUI.fn.inArray(this.lists, name);	
	}
});

SUI.namespace.include("Widget", {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		SUI.namespace.lists[SUI.namespace.lists.length] = "Widget." + name;
		
		return this[name] = fn;
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			SUI.fn.logger("Required Namespace SUI.Widget." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return SUI.fn.inArray(this.lists, name);	
	}
});

SUI.namespace.include("Tool", {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		SUI.namespace.lists[SUI.namespace.lists.length] = "SUI.Tool." + name;
		
		return this[name] = fn;
	},
	lists: [],
	require: function(name) {
		var n = this.loaded(name);
		if(!n) {
			SUI.fn.logger("Required Namespace SUI.Tool." + name + " is not loaded.");	
		}
		return n;
	},
	loaded: function(name) {
		return SUI.fn.inArray(this.lists, name);	
	}
});

SUI.namespace.include("Util", {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		SUI.namespace.lists[SUI.namespace.lists.length] = "Util." + name;
		
		return this[name] = fn;
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			SUI.fn.logger("Required Namespace SUI.Util." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return SUI.fn.inArray(this.lists, name);	
	}
});

SUI.namespace.include("Storage", {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		SUI.namespace.lists[SUI.namespace.lists.length] = "Storage." + name;
		
		return this[name] = fn;
	},
	lists: [],
	require: function(name) {
		var isload = this.loaded(name);
		if(!isload) {
			SUI.fn.logger("Required Namespace SUI.Storage." + name + " is not loaded.");	
		}
		return isload;
	},
	loaded: function(name) {
		return SUI.fn.inArray(this.lists, name);	
	}
});
