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
// Js as primary Savvy.UI object
var Js = window.Js = function(selector, context) {
	var selector = selector || document;
	
	if(this === window && !!Js.Elements) {
		// return this as Js.elements Object
		return new Js.Elements(selector, context);
	} else {
		// return as global namespace
		return this;
	}
};

// this Savvy.UI version number
Js.version = "1.0.0-nb1";

// Savvy.UI namespace manager
Js.namespace = {
	// list all namespace
	lists: [],
	// include new namespace
	include: function(name, object) {
		Js.namespace.lists[Js.namespace.lists.length] = name;
		Js[name] = object;
		
		return Js[name];
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
		return Js.code.inArray(Js.namespace.lists, name);	
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
	
		if(!!this.debug) {
			if(!!console.log) {
				console.log(text);
			} else {
				window.alert(text);	
			}
		}
	}
};

// return Savvy.UI version
Js.toString = function() {
	return ["Savvy.UI", "version", Js.version].join(" ");
};
// extends Savvy.UI's Js.elements
Js.extend = function(name, fn) {
	// check whether it's a function
	if(Js.code.isfunction(fn) && !!Js.Elements) {
		// push the function in Js.elements
		Js.Elements.prototype[name] = fn;
		return true;
	} else {
		return false;	
	}
};

Js.nue = function(object) {
	if(Js.code.typeOf(object) == "object") {
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
Js.code = Js.fn = {
	_$: null,
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
			Js.debug.log("Js.code.href() failed: " + e);
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
					}
				}
			}
		} catch(e) {
			Js.debug.log("Js.code.on() failed: " + fn + e);
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
	// Trim right of a string.
	rtrim: function(value) {
		return new String(value).replace(/\s$/g, "");
	},
	stripTags: function(value) {
		return new String(value).replace(/<([^>]+)>/g, '');
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
		
		Js.code.each(data, function() {
			var first = this.substr(0, 1).toUpperCase();
			var other = this.substr(1);
			rdata[rdata.length] = first + other;
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
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		Js.namespace.lists[Js.namespace.lists.length] = "ext." + name;
		
		return this[name] = fn;
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
		return Js.code.inArray(this.lists, name);	
	}
};

Js.widget = {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		Js.namespace.lists[Js.namespace.lists.length] = "widget." + name;
		
		return this[name] = fn;
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
		return Js.code.inArray(this.lists, name);	
	}
};

Js.tool = {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		Js.namespace.lists[Js.namespace.lists.length] = "tool." + name;
		
		return this[name] = fn;
	},
	lists: [],
	require: function(name) {
		var n = this.loaded(name);
		if(!n) {
			Js.debug.log("Required Namespace Js.tool." + name + " is not loaded.");	
		}
		return n;
	},
	loaded: function(name) {
		return Js.code.inArray(this.lists, name);	
	}
};

Js.util = {
	include: function(name, fn) {
		this.lists[this.lists.length] = name;
		Js.namespace.lists[Js.namespace.lists.length] = "util." + name;
		
		return this[name] = fn;
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
		return Js.code.inArray(this.lists, name);	
	}
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: Base
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI/Js
 */

Js.namespace.include("base", function() {});
Js.base.create = function(js) {	
	var initialize = true;
	var prototype = new Js.base;
	initialize = false;
	
	function Class() {
		if(!initialize && !!this.construct) {
			this.construct.apply(this, Js.code.toArray(arguments));
		}
	};
	
	Class.prototype = prototype;
	Class.prototype.construct = Js.code.pick(js.__construct, null);
	Class.constructor = Class;
	Class.extend = function(js) {
		js.ext = this;
		return Js.base.create(js);
	};
	
	var ext = Js.code.pick(js.ext, null);
	
	if(Js.code.isset(ext)) {
		try {
			// try to copy parent object.
			(function(js) {
				var mtd = ["ext", "__construct", "__destruct", "_super", "prototype"];
				// start adding parent method and properties to this object
				for (var method in js.prototype) {
					if (js.prototype.hasOwnProperty(method) && (!Js.code.inArray(mtd, method) && !this[method])) {
						this[method] = js.prototype[method];
					}
				}
				for (var method in js) {
					if (js.hasOwnProperty(method) && (!Js.code.inArray(mtd, method) && !this[method])) {
						this[method] = js[method];
					}
				}
				// create a linkage to the parent object
				this._super = js.prototype;
			}).call(prototype, ext);
		} catch(e) {
			Js.debug.log(e);
		}
	}
	
	// add this object user defined properties and methods
	(function(js) {
		// the following object shouldn't be extended
		var mtd = ["ext", "__construct", "__destruct", "_super", "prototype"];
		
		// start adding method and properties to this object
		for (var method in js) {
			if (js.hasOwnProperty(method) && (!Js.code.inArray(mtd, method) && !this[method])) {
				this[method] = js[method];
			}
		};
	}).call(prototype, js);
	
	// avoid this.ext to be duplicated in this.prototype 
	delete ext;
	
	return Class;
};
Js.base.prototype = {
	__destruct: function() {
		// remove all properties and method for this object
		for (var method in this) {
			this[method] = null;
		}
			
		for (var method in this.prototype) {
			this.prototype[method] = null;
		}
		
		delete this;
		return null;
	}
};/*
 * Savvy.UI JavaScript Library Application
 * Name: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, Base
 */

Js.namespace.include("attr", {
	// Set Attribute value for an Element
	set: function(node, attr, value) {
		var attr = Js.code.trim(attr.toLowerCase());
		
		if(Js.dom.isElement(node)) {
			if(attr == "class") { 
				// set className
				node.className = value;
			} else if(attr == "colspan") {
				// set colspan without creating a conflict in IE
				node.colSpan = value;
			} else if(attr == "rowspan") {
				// set rowspan without creating a conflict in IE
				node.rowSpan = value;
			} else {
				// others just one the native function
				node.setAttribute(attr, value);
			}
			// return the HTML Element
			return node;
		} else { 
			return false;
		}
	},
	// Get Attribute value from an Element
	get: function(node, attr) {
		var attr = Js.code.trim(attr.toLowerCase());
		var value = false;
		
		if(Js.dom.isElement(node)) {
			if(attr == "class" && node.className) {
				// get className
				value = node.className; 
			} else if(attr == "colspan") {
				// get colspan without creating a conflict in IE
				value = node.colSpan;
			} else if(attr == "rowspan") {
				// get rowspan without creating a conflict in IE
				value = node.rowSpan;
			} else {
				// others just one the native function
				value = node.getAttribute(attr);
			}
		}
		// return the value
		return value;
	},
	// Remove Attribute value from an Element
	remove: function(node, attr) {
		var attr = Js.code.trim(attr.toLowerCase());
		
		if(Js.dom.isElement(node)) {
			if(attr == "class" && node.className) {
				// remove className
				node.className = "";
			} else if(attr == "colspan") {
				// remove colspan without creating a conflict in IE
				node.colSpan = "";
			} else if(attr == "rowspan") {
				// remove rowspan without creating a conflict in IE
				node.rowSpan = "";
			} else {
				// others just one the native function
				node.removeAttribute(attr);
			}
			
			// return the HTML Element
			return node;
		} else {
			return false;
		}
	},
	// Set multiple Attribute value for an Element
	setup: function(node, data) {
		// Get the HTML Element
		var node = node;
		
		// Get JSON attributes
		var data = Js.code.pick(data, []);
		
		if(Js.code.typeOf(data) !== "array") {
			data = [data];
		}
		
		// Using loops, but usually there just one.
		for(var i = 0; i < data.length; i++) {
			// loop the Object
			var object = data[i];
			
			for(var value in object) {
				// trim and ensure val's value is lowercased
				value = Js.code.trim(value.toLowerCase());
				
				if(value != "class") {
					if(object.hasOwnProperty(value)) {
						Js.attr.set(node, value, object[value]);
					}
				} else {
					if(Js.dom.isElement(node)) {
						node.className = object[value];
					}
				}
			}
		};
	}
});

Js.namespace.include("className", {
	set: function(node, value) {
		if(Js.dom.isElement(node)) {
			node.className = value;
			return node;
		} else {
			return false;
		}
	},
	append: function(node, value) {
		if(Js.dom.isElement(node)) {
			var klasName = node.className;
			
			if(Js.code.isset(klasName) && Js.code.trim(klasName) != "") {
				var klass = Js.code.trim(klasName).split(/\s/g);
				klass[klass.length] = Js.code.trim(value);
				klass = Js.code.unique(klass);
				value = klass.join(" ");
			} else {
				value = value;	
			}
			node.className = value;
		}
	},
	get: function(node) {
		if(Js.dom.isElement(node)) {
			// get the className value
			return node.className;
		} else { 
			return false;
		}
	},
	has: function(node, value) {
		var klasName = node.className;
		var value = Js.code.trim(value);
		
		if(Js.dom.isElement(node)) {
			if(Js.code.isset(klasName) && Js.code.trim(klasName) != "") {
				return Js.code.inArray(klasName.split(/\s/), value);
			} else { 
				return false;
			}
		} else {
			return false;
		}
	},
	remove: function(node, value) {
		var klasName = node.className;
		
		if(Js.dom.isElement(node)) {
			if(Js.code.isset(klasName) && Js.code.trim(klasName) != ""){
				var data = [];
				var klass = klasName.split(/\s/);
				
				for(var i = 0; i < klass.length && klass[i]; i++) {
					if(klass[i] !== "" && klass[i] != value) { 
						data[data.length] = klass[i];
					}
				}
				node.className = data.join(" ");
			}
			return node;
		} else { 
			return false;
		}
	},
	empty: function(node) {
		if(Js.dom.isElement(node)) { 
			node.className = "";
		} else {
			return false;
		}
	}
});

Js.namespace.include("style", {
	set: function(node, data, value) {
		var data = Js.code.trim(data);
		var val = Js.code.trim(value);
		
		if(Js.dom.isElement(node)) {
			try {
				node.style[data] = value; 
				return node;
			} catch(e) { 
				Js.debug.log("Js.style.get failed: " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	setup: function(node, js) {
		var node = node;
		var data = Js.code.pick(js, []);
		
		if(Js.code.typeOf(data) !== "array") {
			data = [data];
		}
		
		for(var i = 0; i < data.length; i++) {
			var obj = data[i];
			
			for(var value in obj) {
				value = Js.code.trim(value);
				
				if(obj.hasOwnProperty(value)) {
					Js.style.set(node, value, obj[value]);
				}
			}
		};
		return node;
	},
	get: function(node, data) {
		var data = Js.code.trim(data);
		
		if(Js.dom.isElement(node)) {
			try {
				return node.style[data];
			} catch(e) {
				Js.debug.log("Js.style.get failed: " + node + " " + data + " " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	alpha: function(node, value) {
		var value = (value > 100 ? 100 : (value < 0 ? 0 : value));
		
		if(Js.code.isset(node)) {
			try {
				if (value == 0 && this.get(node, "visibility") != "hidden") {
					this.hide(node);
				} else if (value > 0 && this.get(node, "visibility") == "hidden") {
					this.show(node);
				}
				
				if(Js.code.behaviour.ie == true) {
					if(!node.currentStyle || !node.currentStyle.hasLayout) {
						this.set(node, "zoom", 1);
					}
					
					this.set(node, "filter", "alpha(opacity=" + value + ")");
				} else {
					this.set(node, "opacity", (value / 100));
					this.set(node, "MozOpacity", (value / 100));
				}
			} catch(e) { 
				Js.debug.log("Js.style.alpha failed: " + e); 
			}
		} else return false
	},
	png: function(node, uri, js) {
		var node = node;
		var uri = uri;
		var gecko = Js.code.pick(js.gecko, "");
		var ie = Js.code.pick(js.ie, "scale");
		
		ie = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + uri + "',sizingMethod='" + ie + "')";
		gecko = "url('" + uri + "') " + gecko;
		
		if(window.ActiveXObject && (Js.code.behaviour.ie && !Js.code.behaviour.ie7)) {
			this.set(node, "filter", ie);
		} else {
			this.set(node, "background", gecko);
		}
		
		return node;
	},
	show: function(node, fx) {
		var ani = true;
		
		if(Js.dom.isElement(node)) {
			try {
				ani = this.effect(node, fx, "show");
				
				if(!ani) {
					this.set(node, "visibility", "visible");
				}
				return node;
			} catch(e) {
				Js.debug.log("Js.style.show failed: " + e);
				return false;
			}
		} else return false;
	},
	hide: function(node, fx) {
		var ani = true;
		
		if(Js.dom.isElement(node)) {
			try {
				ani = this.effect(node, fx, "hide");
				
				if(!ani) {
					this.set(node, "visibility", "hidden");
				}
				return node;
			} catch(e) {
				Js.debug.log("Js.style.hide failed: " + e);
				return false;
			}
		} else return false;
	},
	effect: function(node, fx, value) {
		var fx = (Js.code.isset(fx) && fx.match(/(fast|slow)/g) ? fx : false);
		var id = Js.attr.get(node, "id");
		var data = [20, 0.8, 80];
		var value = (value.match(/^(show|hide)$/) ? value : 'show');
		var fade = (value == "show" ? [0, 100] : [100, 0]);
		
		if(Js.ext.require("Animator") && !!fx) {
			if (fx == "slow") {
				data[0] = 60;
				data[1] = 1.5;
				data[2] = 40;
			} else if (!fx) {
				return false;
			}
			var effect = new Js.ext.Animator;
			effect.init(node).Fx({
				method: "fade",
				transaction: fade,
				shutter: data[0],
				ease: data[1],
				step: data[2]
			});
			
			return true;
			
		} else { 
			return false;
		}
	}
});

Js.namespace.include("dom", {
	add: function(parent, child) {
		if(!Js.code.isset(child)) {
			var child = parent;
			var parent = document.body;
		}
		
		try {
			parent.appendChild(child);
			return parent;
		} catch(e) {
			Js.debug.log("Js.dom.add failed: " + e);
			return false;
		}
	},
	addText: function(parent, text) {
		if(Js.code.isset(parent)) {
			return this.add(parent, document.createTextNode(text));
		} else {
			Js.debug.log("Js.dom.addText failed: " + e);
			return false;
		}
	},
	addBefore: function(args) {
		var args = Js.code.toArray(arguments);
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && Js.code.isset(args[0]) && Js.code.isset(args[1]) && Js.code.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = args[2];
		} else if(args.length == 2 && Js.code.isset(args[0]) && Js.code.isset(args[1])) {
			parent = args[1].parentNode;
			child = args[0];
			reference = args[1];
		} else {
			Js.debug.log("Js.dom.addBefore failed: Reference Object is null");
			return false;
		}
		
		try {
			parent.insertBefore(child, reference);
			return true;
		} catch(e) {
			Js.debug.log("Js.dom.addBefore failed: " + parent + " " + child + " " + reference + e);
			return false;
		}
	},
	addAfter: function(args) {
		var args = arguments;
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && Js.code.isset(args[0]) && Js.code.isset(args[1]) && Js.code.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = this.next(args[2]);
		} else {
			parent = this.parent(args[1]);
			child = args[0];
			reference = this.next(args[1]);
		}
		
		try {
			if(Js.code.isset(reference)) {
				return this.addBefore(parent, child, reference);
			} else {
				return this.add(parent, child);
			}
		} catch(e) {
			Js.debug.log("Js.dom.addAfter failed: " + e);
			return false;
		}
	},
	remove : function(params) {
		var args = arguments;
		var parent = null;
		var child = null;
		
		if(args.length === 2 && Js.code.isset(args[0]) && Js.code.isset(args[1])){
			parent = args[0];
			child = args[1];
		} else if(args.length == 1 && Js.code.isset(args[0])){
			parent = args[0].parentNode;
			child = args[0];
		}
		
		try {
			parent.removeChild(child);
			return parent;
		} catch(e) {
			Js.debug.log("Js.dom.remove failed: " + e);
			return false;
		}
	},
	empty: function(node) {
		while(node.firstChild) {
			this.remove(node);
		}
		
		return node;
	},
	change: function(args) {
		var args = arguments;
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && !!args[0] && !!args[1] && !!args[2]) {
			parent = args[0];
			child = args[1];
			reference = args[2];
		} else if(args.length == 2 && !!args[0] && !!args[1]) {
			parent = args[1].parentNode;
			child = args[0];
			reference = args[1];
		}
		
		try {
			parent.replaceChild(child, reference);
			return true;
		} catch(e) {
			Js.debug.log("Js.dom.change failed: " + e);
			return false;
		}
	},
	clone: function(node, bool) {
		return node.cloneNode(bool);
	},
	prev: function(node) {
		do {
		   node = node.previousSibling;
		} while(node && node.nodeType != 1);
		
		return node;
	},
	next: function(node) {
		do {
			node = node.nextSibling;
		} while(node && node.nodeType != 1);
		
		return node;
	},
	first: function(node) {
		node = node.firstChild;
		return (node && node.nodeType != 1 ? this.next(node) : node);
	},
	last: function(node) {
		node = node.lastChild;
		return (node && node.nodeType != 1 ? this.prev(node) : node);
	},
	isFirst: function(node) {
		var n = this.next(this.parent(node).firstChild);
		return n === node;
	},
	isLast: function(node) {
		var n = this.prev(this.parent(node).lastChild);
		return n === node;
	},
	isParentOf: function(node, parNode) {
		return this.parent(node) === parNode;
	},
	isOnlyChild: function(node) {
		var f = this.first(node);
		var l = this.last(node);
		
		return f === l;
	},
	isElement: function(node) {
		return (Js.code.isset(node) && node.nodeType ? true : false);
	},
	parent: function(node) {
		return node.parentNode;
	}
});

Js.namespace.include("domReady", {
	fn: [],
	node: [],
	script: null,
	timer: null,
	done: null,
	add: function(node, fn) {
		var that = Js.domReady;
		
		return (function(fn, node) {
			if (!!that.done) {
				if(!!node && node !== document) {
					Js.code.callback(node, fn);
				} else { 
					fn();
				}
				
				return;
			}
			
			if (/Konqueror/i.test(navigator.userAgent)) {
				new Js.domEvent("on", {
					on: "load",
					callback: function() {
						that.callback();
					}
				});
			} else if (document.addEventListener) {
				try { 
					document.addEventListener("DOMContentLoaded", that.callback, false); 
				} catch(e) { 
					new Js.domEvent("on", {
						on: "load",
						callback: function() {
							that.callback();	
						}
					});
				}
			}
			
			if (/WebKit/i.test(navigator.userAgent)) { 
				var timer = setInterval(function() {
					if (/loaded|complete/.test(document.readyState)) {
						that.callback();
						clearInterval(that.timer);
						that.timer = null;
					}
				}, 10);
			}
			
			if (!!Js.code.behaviour.ie) {
				try {
					document.write("<script id=__ie_onload defer src=//0><\/scr"+"ipt>");
					that.script = document.getElementById("__ie_onload");
					that.script.onreadystatechange = function() {
						if(this.readyState == "complete") {
							that.callback(); // call the onload handler
						}
					};
				} catch(e) { 
					Js.debug.log(e);
				}
			} else {
				new Js.domEvent("on", {
					on: "load",
					callback: (function() {
						that.callback();
					})
				});
			}
			
			that.fn[that.fn.length] = fn;
			that.node[that.node.length] = node;
		})(fn, node);
	},
	callback: function() {
		if(!Js.domReady.done) {
			Js.domReady.done = true;
			
			if (!!Js.domReady.timer) {
				clearInterval(that.timer);
				Js.domReady.timer = null;
			}
			
			for (var i = 0; i < Js.domReady.fn.length; i++) {
				var fn = Js.domReady.fn[i];
				var node = Js.domReady.node[i];
				
				if (Js.code.isfunction(fn)) {
					if(!!node && node !== document) {
						Js.code.callback(node, fn);
					} else { 
						fn();
					}
				}
			}
			
			Js.domReady.fn = new Array;
			Js.domReady.node = new Array;
			
			if(!!Js.domReady.script) {
				Js.domReady.script.onreadystatechange = '';
			}
		}
	}
});

Js.namespace.include("domEvent", function(handler, js) {
	this.node = window;
	this.type = null;
	this.fn = null;
	
	if(handler == "on") {
		return this.on(js);
	} else if(handler == "off") {
		return this.off(js);
	}
	
	return this;
}).prototype = {
	on: function(js) {
		var that = this;
		var p = true;
		var r;
		
		this.node = Js.code.pick(js.object, this.node);
		this.type = Js.code.pick(js.on, this.type, "load");
		this.fn = Js.code.pick(js.callback, this.fn);
		
		if (this.node.addEventListener) {
			try { 
				r = this.node.addEventListener(this.type, this.fn, false);
				return r;
			} catch(e) {
				try {
					this.node.attachEvent("on" + this.type, this.fn);
				} catch(e) {
					p = false;
				}
			}
		} else if (this.node.attachEvent) {
			try { 
				this.node.attachEvent("on" + this.type, this.fn);
			} catch(e) { 
				p = false; 
			}
			
			return true;
		} else {
			p = false;
		}
		
		if (!pass) {
			var fn = Js.code.pick(this.object["on" + this.type], null);
			Js.code.on(this.node, this.type, function() {
				if(Js.code.isset(fn) && Js.code.isfunction(fn)) {
					fn();
				}
				that.fn();
			});
		}
	},
	off: function (js) {
		var that = this;
		var r = false;
		this.node = Js.code.pick(js.object, this.node);
		this.type = Js.code.pick(js.on, this.type, "load");
		this.fn = Js.code.pick(js.callback, this.fn);
		
		if (this.node.detachEvent) {
			try { 
				r = this.node.detachEvent("on" + this.type, this.fn);
			} catch(e) {
				try { 
					r = this.node.removeEventListener(this.type, this.fn, false);
				} catch(e) { 
					r = "Unable to load window.attachEvent: " + e;
				}
			}
		} else { 
			try { 
				r = this.node.removeEventListener(this.type, this.fn, false);
			} catch(e) {
				r = "Unable to load window.addEventListener: " + e;
			}
		}
		return r;
	}
};

Js.namespace.include("hash", {
	object: {},
	set: function(node, data, value) {
		var name = this.verify(node);
		
		if (Js.code.isset(name)) {
			if (!Js.code.isset(this.object[name])) {
				this.object[name] = {};
			}
			
			this.object[name][data] = value;
		}
	},
	get: function(node, data) {
		var name = this.verify(node);
		
		if (Js.code.isset(name)) {
			if (Js.code.isset(this.object[name]) && Js.code.isset(this.object[name][data])) {
				return this.object[name][data];
			} else {
				return false;
			}
		} else { 
			return false;
		}
	},
	remove: function(node, data) {
		var name = this.verify(node);
		
		if (Js.code.isset(name)) {
			this.object[name][data] = null;
			
			if (Js.code.isset(this.object[name]) && Js.code.isset(this.object[name][data])) {
				this.object[name][data] = null;
			} else {
				return false;
			}
		} else { 
			return false;
		}
	},
	verify: function(node) {
		return (typeof(node) == "object" ? Js.attr.get(node, "id") : node);
	}
});

Js.namespace.include("parse", {
	// Parse string value with Parsed HTML value
	html: {
		to: function(value) {
			var value = new String(value);
			value = Js.code.htmlEntities(value);
			value = encodeURIComponent(value);
			
			return value;
		},
		from: function(value) {
			var value = new String(value);
			value = decodeURIComponent(value);
			value = Js.code.htmlEntityDecode(value);
			
			return value;
		}
	},
	// Convert back bbml string to normal string
	bbml: function(value) {
		return new String(value).replace(/\[lt\]/g, "<").replace(/\[gt\]/g, ">").replace(/\[n\]/g, "&").replace(/\&quot\;/g, "\"").replace(/\&rsquo\;/g, "\'").replace(/\[br\]/g, "\n").replace(/\[break\]/g, "<br />");
	}
});

Js.namespace.include("query", {
	isValid: function(node, data) {
		var data = Js.code.trim(data);
		var r = null;
		var status = null;
		var value = false;
		var prev = node.previousSibling;
		var next = node.nextSibling;
		
		if (data.match(/^(enabled|disabled|checked|selected)$/)) {
			status = data;
			data = "input";
			
			if (status === "enabled") {
				value = true;
				status = "disabled";
			}
		}
		
		if(data == 'visible') {
			return ((Js.style.get(node, "display") === "none" || Js.style.get(node, "visibility") === "hidden") || (node.tagName.toLowerCase() === "input" && Js.attr.get(node, "type") === "hidden") ? false : true);
		} else if(data == 'hidden') {
			return (Js.style.get(node, "display") === "none" || Js.style.get(node, "visibility") === "hidden" || (node.tagName.toLowerCase() === "input" && Js.attr.get(node, "type") === "hidden") ? true : false);
		} else if(data == 'first-child') {
			if(!!prev) {
				return (!prev || !!Js.dom.isFirst(prev) ? true : false);
			} else {
				return true;
			}
		} else if(data == 'last-child') {
			if(!!next) { 
				return (!next || !!Js.dom.isLast(next) ? true : false);
			} else {
				return true;
			}
		} else if(data == 'only-child') {
			if(!!node) { 
				return Js.dom.isOnlyChild(node);
			} else {
				return true;
			}
		} else if(data == 'input') {
			r = (!!node.tagName && !!node.tagName.toLowerCase().match(/^(input|select|textarea)$/g) ? true : false);
			if(Js.code.isset(status)) {
				r = (Js.attr.get(node, status) !== false ? true : false);
				if(!!value) { 
					r = (!!r ? false : true);
				}
			}
			return r;
		} else {
			if(data.match(/^(text|password|radio|checkbox|submit|image|reset|button|file|hidden)$/)) {
				return (!!node.tagName && node.tagName.toLowerCase() === "input" && Js.attr.get(node, "type") === data ? true : false);
			} else { 
				return false;
			}
		}
	},
	hasClass: function(node, klasName) {
		return (!!Js.className.has(node, klasName) ? true : false);
	},
	hasAttrs: function(node, attrs) {
		var data = Js.attr.get(node, attrs[0]);
		
		if(!!data) {
			switch (attrs[1]) {
				case '=': // Equality
					return (data === attrs[2]);
					break;
				case '~': // Match one of space seperated
					return (data.match(new RegExp('\\b' + attrs[2] + '\\b')));
					break;
				case '|': // Match start with value followed by optional hyphen
					return (data.match(new RegExp('^' + attrs[2] + '-?')));
					break;
				case '^': // Match starts with value
					return (data.indexOf(attrs[2]) === 0);
					break;
				case '$': // Match ends with value - fails with "Warning" in Opera 7
					return (at.lastIndexOf(attrs[2]) === at.length - attrs[2].length);
					break;
				case '*': // Match ends with value
					return (data.indexOf(attrs[2]) > -1);
					break;
				default : // Just test for existence of attribute
					return data;
			}
		} else {
			return false;
		}
	},
	tagParentOf: function(tags, parents, klasName, is, attr) {
		var context = [];
		
		if(parents.length > 0) {
			var tag = (tags === "*" && document.all ? document.all : document.getElementsByTagName(tags));
			
			for(var i = 0; i < parents.length && parents[i]; i++) {
				for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
					var node = tag[ii];
					
					if(node.nodeType === 1 && !!Js.query.validate(node, klasName, is, attr) && node === parents[i].parentNode) {
						context[context.length] = node;
					}
				}
			}
		}
		return context;
	},
	tagNextOf: function(tags, parents, klasName, is, attr) {
		var context = [];
		
		if(parents.length > 0) {
			for(var i = 0; i < parents.length && parents[i]; i++) {
				var parent = parents[i].parentNode;
				
				if(!!parent && parent.nodeType) {
					var tag = (tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(tags));
				
					for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
						var node = tag[ii];
						var tnode = Js.dom.prev(node);
						
						if(tnode === parents[i] && node.nodeType === 1 && !!Js.query.validate(node, klasName, is, attr)) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	tagSiblingOf: function(tags, parents, klasName, is, attr) {
		var context = [];
		
		if(parents.length > 0) {
			for(var i = 0; i < parents.length && parents[i]; i++) {
				var parent = parents[i].parentNode;
				
				if(!!parent && parent.nodeType) {
					var tag = (tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(tags));
				
					for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
						var node = tag[ii];
						
						if(node.nodeType === 1 && !!Js.query.validate(node, klasName, is, attr) && node.parentNode === parent) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	tagChildOf: function(tags, parents, klasName, is, attr) {
		var context = [];
		
		if(parents.length > 0) {
			for(var i = 0; i < parents.length && parents[i]; i++) {
				var parent = parents[i];
				
				if(!!parent && parent.nodeType == 1) {
					var tag = (tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(tags));
				
					for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
						var node = tag[ii];
						
						if(node.nodeType === 1 && !!Js.query.validate(node, klasName, is, attr) && node.parentNode === parent) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	validate: function(node, klasName, data, attr) {
		var valid = false;
		var klasName = Js.code.pick(klasName, "");
		var data = Js.code.pick(data, null);
		var attr = Js.code.pick(attr, []);
		
		valid = (klasName === "" || !!Js.query.hasClass(node, klasName) ? true : false);
		valid = ((attr.length === 0 || (attr.length === 3 && !!Js.query.hasAttrs(node, attr))) && !!valid ? true : false); 
		valid = ((!data || (!!data && !!Js.query.isValid(node, data))) && !!valid ? true : false);
		
		return valid;
	},
	create: function(tags, attr) {
		var node = null;
		var tags = Js.code.trim(tags);
		
		if(/\#/.test(tags)) {
			var tag = tags.split(/\#/);
			var el = Js.code.trim(tag[0]);
			var id = Js.code.trim(tag[1]);
			node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', el) : document.createElement(el);
			Js.attr.set(node, "id", id);
		} else {
			node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', tags) : document.createElement(tags);
		}
		
		if (Js.code.isset(attr)) { 
			Js.attr.setup(node, attr);
		}
		
		return node;
	},
	tags: function(tags, parents, klasName, is, attr, type) {
		var context = [];
		var klasName = Js.code.trim(Js.code.pick(klasName, ""));
		var is = Js.code.pick(is, null);
		var attr = Js.code.pick(attr, []);
		var tags = Js.code.pick(tags, "*");
		
		if(Js.code.isset(type) && type > 0) {
			if(type === 4) {
				context = Js.query.tagParentOf(tags, parents, klasName, is, attr);
			} else if (type === 2) {
				context = Js.query.tagNextOf(tags, parents, klasName, is, attr);
			} else if (type === 3) {
				context = Js.query.tagSiblingOf(tags, parents, klasName, is, attr);
			} else if (type === 1) {
				context = Js.query.tagChildOf(tags, parents, klasName, is, attr);
			}
		} else {
			if(!parents || parents.length === 0 || !parents.length) {
				parents = [document];
			}
			
			for(var i = 0; i < parents.length && parents[i]; i++) {
				var parent = parents[i];
				var tag = (tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(tags));
				
				for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
					var node = tag[ii];
					
					if(node.nodeType === 1 && Js.query.validate(node, klasName, is, attr)) {
						context[context.length] = node;
					}
				}
			}
		}
		return (context.length > 0 ? context : false);
	},
	id: function(id, parents, tags, is) {
		var tags = Js.code.trim(Js.code.pick(tags, "*")).toUpperCase();
		var el = document.getElementById(id);
		var is = (!!is ? this.is(el, is) : true);
			
		if (el && (tags == "*" || tags == el.tagName.toUpperCase()) && !!is) {
			return el;
		} else { 
			return false;
		}
	},
	selector: function(selector, parents) {
		var context = [];
		
		var init = function(selector, parents) {
			var context = [];
			
			if (!!parents && !parents.length) {
				context = [parents];
			} else if (!!parents && parents.length > 0) { 
				context = parents;
			}
			var type = 0;
			
			var elem = selector.split(/\s/);
			
			for (var i = 0; i < elem.length; i++){
				if(context.length === 0 && i > 0) {
					context = false;
					break;
				}
				
				var el = Js.code.trim(elem[i]);
				
				if (el !== "") {
					var tags = "";
					var id = "";
					var klasName = "";
					var attr = [];
					var is = null;
					type = 0;
					
					if (el === ">") {
						type = 1;
					} else if (el === "+") { 
						type = 2;
					} else if (el === "~") {
						type = 3;
					} else if (el === "<") {
						type = 4;
					} else {
						if (el.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)){
							tags = RegExp.$1;
							attr[0] = RegExp.$2;
							attr[1] = RegExp.$3;
							attr[2] = RegExp.$4;
						} else {
							if (el.indexOf(":") > -1) {
								var pr = el.split(":");
								el = pr[0];
								is = pr[1];
							}
							
							if (el.indexOf(".") > -1) {
								var pr = el.split(".");
								tags = pr[0];
								klasName = pr[1];
							} else if (el.indexOf("#") > -1) {
								var pr = el.split("#");
								tags = pr[0];
								id = pr[1];
							} else {
								tags = el;
							}
							
							tags = (tags == "" ? "*" : tags);
						}
						
						if (!!id && id !== "") {
							context = [Js.query.id(id, context, tags, is)];
						} else {
							context = Js.query.tags(tags, context, klasName, is, attr, type);
						}
						
						if (!context) {
							context = [];
							break;
						} else {
							context = Js.code.unique(context);
						}
						
						type = 0;
					}
				}
			}
			return context;
		};
		
		var elem = Js.code.trim(selector).split(/,/);
		elem = Js.code.unique(elem);
		
		for (var m = 0; m < elem.length && !!elem[m]; m++) {
			var el = Js.code.trim(elem[m]);
			
			if (el !== "") {
				var node = init(el, parents);
				
				if (!!node && node.length > 0) {
					for (var i = 0; i < node.length; i++) {
						if (node[i].nodeType === 1) {
							context[context.length] = node[i];
						}
					}
				}
			}
		}
		return (context.length > 0 ? context : false);
	}
});

Js.namespace.include("test", {
	isString: function(value) {
		return (typeof(value) == "string" && isNaN(value));
	},
	isInteger: function(value) {
		return !isNaN(value);
	},
	isNumber: function(value) {
		return this.isInteger(value);
	},
	isEmail: function(value) {
		return (value.match(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/));
	},
	isLength: function(datas, value) {
		var data = datas.split(/\-/);
		var length = Js.code.toNumber(data[1]);
		var rdata = null;
		
		if(data[0] === "max") {
			rdata = (value <= length ? true : false);
		} else if(data[0] === "min") {
			rdata = (value >= length ? true : false);
		} else if(data[0] === "exact") {
			rdata = (value == length ? true : false);
		} else { 
			rdata = true;
		}
		
		return rdata;
	},
	isURL: function(value) {
		return (value.match(/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/));
	},
	isIpAddress: function(value) {
		return (value.match(/^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/));
	}
});/*
 * Savvy.UI JavaScript Library Application
 * Name: Elements
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, SUI.Attr, SUI.Classes, SUI.DOM, SUI.onDOMReady, SUI.Hash, SUI.Query
 * Optional: SUI.Ext.Animator
 */

Js.namespace.include("Elements", function(selector, parent) {
	this.node = [];
	this.animate = [];
	this._node = [];
	this._animate = [];
	this.index = null;
	this.length = 0;
	
	if(!!selector && selector.nodeType) {
		this.__ADD__([selector]);
	} else if(!!selector && typeof(selector) !== "string" && selector.length > 0) {
		this.__ADD__(selector);
	} else if (!!selector && typeof(selector) == "string") {
		this.query(selector, parent);
	}
	
	return this;
}).prototype = {
	create: function(el) {
		var node = [];
		var args = arguments;
		var parent = document.body;
		var tags = null;
		var attr = null;
		
		if(args.length === 3 && (!!args[0] && typeof(args[0]) == "string" && !!args[1] && args[1].nodeType && !!args[2])) {
			parent = args[1];
			tags = args[0];
			attr = args[2];
		} else if(!!args[0] && typeof(args[0]) == "string") {
			tags = args[0];
			
			if(!!args[1] && args[1].nodeType) {
				parent = args[1];
			} else if(!!args[1] && typeof(args[1]) == "object") {
				attr = args[1];
			}
		}
		
		try {
			node[node.length] = Js.query.create(tags, attr);
			Js.dom.add(parent, node[0]);
		} catch(e) {
			Js.debug.log("Js.Elements.create failed: " + e);
		}
		
		if(node.length > 0) {
			this.__ADD__(node);
		}
		
		// continue chaining
		return this;
	},
	query: function(selector, parent) {
		var node = [];
		node = Js.query.selector(selector, parent);
		
		if(node.length > 0) {
			this.__ADD__(node);
		}
		// continue chaining
		return this;
	},
	__ADD__: function(nodes) {
		if(!!nodes) {
			for(var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				
				if(!!node && node.nodeType) {
					this.node[this.node.length] = node;
					
					if(Js.ext.loaded("Animator") && node != document) {
						var length = (this.node.length - 1);
						
						try {
							this.animate[length] = new Js.ext.Animator;
							this.animate[length].init(node);
						} catch(e) {
							Js.debug.log("Js.Elements.__ADD__ error on Initialize Animator: " + node +  e);
						};
					}
				} else {
					Js.debug.log("node is not a HTMLelement" + (!!node && node.nodeType));	
				}
			}
		}
		
		this.index = (!this.index && this.node.length === 1 ? 0 : null);
	},
	__PUSH__: function(fn) {
		if(Js.code.isfunction(fn)) {
			var key = Js.code.pick(this.index, null);
			
			if(Js.code.isnull(key)) {
				Js.code.each(this.node, fn);
			} else if(!!this.node[key]) {
				try { 
					fn.call(this.node[key]);
				} catch(e) {
					fn.apply(this.node[key]);
				}
			}
		}
	},
	start: function() {
		var that = this;
		
		if(this._node.length === 0) {
			this._node = this.node;
			this._animate = this.animate;
			this.index = null;
			this.node = [];
			this.animate = [];
		}
		return this;
	},
	end: function() {
		if(this._node.length > 0) {
			this.node = this._node;
			this.animate = this._animate;
			this.index = null;
			this._node = [];
			this._animate = [];
		}
		return this;
	},
	andSelf: function() {
		this.__ADD__(this._node);
		return this;						
	},
	'find': function(selector) {
		var key = Js.code.pick(this.index, null);
		var n1 = (!key ? this.node : this.node[key]);
		var n2 = (!key ? this._node : this._node[key]);
		var node = Js.code.pick(n1, n2);
		
		return new Js.Elements(selector, node);
	},
	childOf: function(selector) {
		var key = Js.code.pick(this.index, null);
		var elem = selector.split(",");
		
		for(var i = 0; i < elem.length && !!elem[i]; i++) {
			elem[i] = ["< ", elem[i]].join("");
		}
		
		selector = elem.join(",");
		
		if(this._node.length > 0) {
			if(this.node.length === 0) {
				var node = (!key ? this._node : this._node[key]);
				var object = Js.query.selector(selector, node);
				
				if(object.length > 0) {
					this.__ADD__(object);
				}
			} else if(this.node.length > 0) {
				var node = (!key ? this.node : this.node[key]);
				var object = Js.query.selector(selector, node);
				
				if(object.length > 0) { 
					this.__ADD__(object);
				}
			}
			return this;
		} else if(this._node.length === 0) {
			var node = (!key ? this.node : this.node[key]);
			return new Js.Elements(selector, node);
		}
	},
	has: function(selector) {
		var key = Js.code.pick(this.index, null);
		var elem = selector.split(",");
		
		for(var i = 0; i < elem.length && !!elem[i]; i++) {
			elem[i] = ["> ", elem[i]].join("");
		}
		
		selector = elem.join(",");
		
		if(this._node.length > 0) {
			if(this.node.length === 0) {
				var node = (!key ? this._node : this._node[key]);
				var object = Js.query.selector(selector, node);
				
				if(object.length > 0) {
					this.__ADD__(object);
				}
			} else if(this.node.length > 0) {
				var node = (!key ? this.node : this.node[key]);
				var object = Js.query.selector(elem, node);
				
				if(object.length > 0) { 
					this.__ADD__(object);
				}
			}
			return this;
		} else if(this._node.length === 0) {
			var node = (!key ? this.node : this.node[key]);
			return new Js.Elements(selector, node);
		}
	},
	is: function(selector) {
		var key = Js.code.pick(this.index, 0);
		var node = Js.query.selector(selector);
		var object = null;
		
		for(var i = 0; i < node.length && !!node[i]; i++) {
			if(node[i] === this.node[key]) {
				object = new Js.Elements(node[i]);
				break;
			}
		}
			
		if(!!object) {
			if(this._node.length > 0) {
				object._node = this._node;
			}
			return object;
		} else { 
			return new Js.Elements();
		}
	},
	use: function(key) {
		var node = this.fetch(key);
		return (!!node ? new Js.Elements(node) : false);						
	},
	fetch: function(key) {
		var key = Js.code.pick(this.index, key);
		
		if (Js.code.isnull(key)) { 
			return this.node;
		} else if (!!Js.code.isset(this.node[key])) {
			return this.node[key];
		} else {
			return false;
		}
	},
	useParent: function() {
		// refer this.parent function
		return this.parent();
	},
	parent: function(key) {
		var key = Js.code.pick(this.index, 0);
		var node = Js.code.pick(this.node[key].parentNode, false);
		
		return (!!node ? new Js.Elements(node) : false);
	},
	siblings: function(selector) {
		var key = Js.code.pick(this.index, 0);
		var elem = selector.split(",");
		
		for(var i = 0; i < elem.length && !!elem[i]; i++) {
			elem[i] = "~ " + elem[i];
		}
		
		selector = elem.join(",");
		
		if (this._node.length > 0) {
			if (this.node.length === 0) {
				var node = (!key ? this._node : this._node[key]);
				var object = Js.query.selector(selector, node);
				
				if(object.length > 0) {
					this.__ADD__(object);
				}
			} else if (this.node.length > 0) {
				var node = (!key ? this.node : this.node[key]);
				var object = Js.query.selector(selector, node);
				
				if(object.length > 0) {
					this.__ADD__(object);
				}
			}
			// continue chaining
			return this;
		} else if (this._node.length === 0) {
			var node = (!key ? this.node : this.node[key]);
			return new Js.Elements(selector, node);
		}
	},
	first: function() {
		this.index = 0;
		// continue chaining
		return this;
	},
	last: function() {
		this.index = (this.node.length - 1);
		// continue chaining
		return this;
	},
	prev: function() {
		if (!this.index) {
			this.last();
		}
		
		var key = (this.index - 1);
		
		if (!!this.node[key]) { 
			this.index--;
		}
		// continue chaining
		return this;
	},
	next: function() {
		if (!this.index) {
			this.first();
		}
		
		var key = (this.index + 1);
		
		if (!!this.node[key]) {
			this.index++;
		}
		// continue chaining
		return this;
	},
	'all': function() {
		if (this.count() > 1) {
			this.index = null;
		}
		// continue chaining
		return this;
	},
	count: function() {
		return this.node.length;
	},
	each: function(fn) {
		if(this.count() > 0 && Js.code.isfunction(fn)) {
			Js.code.each(this.node, fn);
		}
		// continue chaining
		return this;
	},
	callback: function(fn) {
		if(Js.code.isfunction(fn)) {
			try {
				fn.apply(this);
			} catch(e) {
				fn.call(this);
			}
		}
		// continue chaining
		return this;
	},
	add: function(selector, data) {
		var args = arguments;
		
		var key = Js.code.pick(this.index, 0);
		
		if (Js.code.isset(this.node[key])) {
			var node = new Js.Elements;
			node.create(selector, this.node[key], data);
			
			return node;
		} else {
			return false;
		}
	},
	insertion: function(element, data, i) {
		return this.add(element, data);
	},
	set: function(data, value) {
		// stack the callback
		this.__PUSH__(function() { 
			Js.attr.set(this, data, value);
		});
		// continue chaining
		return this;
	},
	setup: function(js) {
		// stack the callback
		this.__PUSH__(function() {
			Js.attr.setup(this, js);
		});
		// continue chaining
		return this;
	},
	get: function(data) {
		var key = Js.code.pick(this.index, null);
		
		if (Js.code.isnull(key)){
			var value = [];
			
			Js.code.each(this.node, function() { 
				value[value.length] = Js.attr.get(this, data);
			});
			
			return value;
		} else if (!!this.node[key]) {
			return Js.attr.get(this.node[key], data);
		}
	},
	unset: function(name) {
		// stack the callback
		this.__PUSH__(function() {
			Js.attr.remove(this, name);
		});
		// continue chaining
		return this;
	},
	addClass: function(name) {
		return this.setClass(name);
	},
	setClass: function(name) {
		// stack the callback
		this.__PUSH__(function(){
			Js.className.set(this, name);
		});
		// continue chaining
		return this;
	},
	appendClass: function(name) {
		// stack the callback
		this.__PUSH__(function() { 
			Js.className.append(this, name);
		});
		// continue chaining
		return this;
	},
	hasClass: function(name) {
		var key = Js.code.pick(this.index, null);		
		
		if (Js.code.isnull(key)) {
			var value = [];
			Js.code.each(this.node, function() { 
				value[value.length] = Js.className.has(this, name);
			});
			return value;
		} else if(!!this.node[key]) {
			return Js.className.has(this.node[key], name);
		}
	},
	removeClass: function(name) {
		// stack the callback
		this.__PUSH__(function() {
			Js.className.remove(this, name);
		});
		// continue chaining
		return this;
	},
	css: function(data) {
		var args = arguments;
		
		if(args.length === 1 && typeof(args[0]) == "object") { 
			return this.setStyles(args[0]);
		} else if(args.length === 2) {
			if(typeof(args[0]) == "string") {
				if(args[0] == "alpha") { 
					return this.alpha(args[1]);
				} else { 
					return this.setStyle(args[0], args[1]);
				}
			}
		}
	},
	setStyle: function(data, value) {
		// stack the callback
		this.__PUSH__(function() {
			Js.style.set(this, data, value);
		});
		// continue chaining
		return this;
	},
	setStyles: function(js) {
		// stack the callback
		this.__PUSH__(function() { 
			Js.style.setup(this, js);
		});
		// continue chaining
		return this;
	},
	getStyle: function(data) {
		var key = Js.code.pick(this.index, null);
		
		if(Js.code.isnull(key)) {
			var value = [];
			
			Js.code.each(this.node, function() {
				value[value.length] = Js.code.pick(Js.style.get(this, data), false);
			});
			
			return value;
		} else if(!!this.node[key]) {
			return Js.code.pick(Js.style.get(this.node[key], data), false);
		}
	},
	alpha: function(value) {
		// refer this.opacity function
		return this.opacity(value);
	},
	opacity: function(value) {
		// stack the callback
		this.__PUSH__(function() {
			Js.style.alpha(this, value);
		});

		// continue chaining
		return this;
	},
	png: function(uri, js) {
		// stack the callback
		this.__PUSH__(function() {
			Js.style.png(this, uri, js);
		});
		// continue chaining
		return this;
	},
	hide: function(fx) {
		var fx = (!!fx ? fx : null);
		// stack the callback
		this.__PUSH__(function() {
			Js.style.hide(this, fx);
		});
		// continue chaining
		return this;
	},
	show: function(fx) {
		var fx = (!!fx ? fx : null);
		// stack the callback
		this.__PUSH__(function() {
			Js.style.show(this, fx);
		});
		// continue chaining
		return this;
	},
	insert: function(child) {
		if(Js.code.isset(this.index)) {
			// stack the callback
			this.__PUSH__(function() { 
				Js.dom.add(this, child);
			});
		}
		// continue chaining
		return this;
	},
	text: function(text) {
		// stack the callback
		this.__PUSH__(function() {
			Js.dom.addText(this, text);	
		});
		// continue chaining
		return this;
	},
	remove: function(child) {
		if(Js.code.isset(this.index)) {
			// stack the callback
			this.__PUSH__(function() { 
				Js.dom.remove(this, child);
			});
		}
		// continue chaining
		return this;
	},
	html: function(text, option) {
		var args = arguments;
		
		if(typeof(text) == "string") {
			var option = (!!option && option.match(/^(before|after)$/g) ? option : false);
			
			if(!option) {
				// stack the callback
				this.__PUSH__(function() { 
					this.innerHTML = text; // set/overwrite HTML string for multiple HTMLelement
				});
			} else { 
				this.htmlManip(text, option); // append/prepend HTML string for multiple HTMLelement
			}
			// continue chaining
			return this;
		} else if (!text || typeof(text) == "number") {
			var key = Js.code.pick(this.index, null);
			
			if(Js.code.isnull(key)) {
				var value = [];
				// retrieve the value of each HTMLelement
				Js.code.each(this.node, function() {
					value[value.length] = Js.code.pick(this.innerHTML, ""); // return HTML string for multiple HTMLelement
				});
				// return value as array
				return value;
			} else if(!!this.node[key]) {
				return Js.code.pick(this.node[key].innerHTML, ""); // return HTML string for single HTMLelement
			}
		}
	},
	// set or retrieve HTMLelement's value
	val: function(text) {
		var args = arguments;
		
		if(typeof(text) == "string") {
			// stack the callback
			this.__PUSH__(function() {
				this.value = text; // set the value
			});
			// continue chaining
			return this;
		} else if(!text || typeof(text) == "number") {
			var key = Js.code.pick(this.index, null);
			
			if(Js.code.isnull(key)) {
				var value = [];
				// retrieve the value of each HTMLelement
				Js.code.each(this.node, function() {
					value[value.length] = Js.code.pick(this.node[key].value, "");
				});
				// return the value as array
				return value;
			} else if(!!this.node[key]) {
				return Js.code.pick(this.node[key].value, ""); // retrieve single HTMLelement value
			}
		}
	},
	// append HTML string
	append: function(text) {
		// refer this.__HTML__ function
		return this.htmlManip(text, "after");
	},
	// prepend HTML string
	prepend: function(text) {
		// refer this.__HTML__ function
		return this.htmlManip(text, "before");
	},
	// bind a event handler
	on: function(handler, fn1, fn2) {
		// stack the callback
		this.__PUSH__(function() { 
			Js.code.on(this, handler, fn1, fn2);
		});
		// continue chaining
		return this;
	},
	// bind a event handler
	bind: function(handler, fn1, fn2) {
		// refer this.on function
		return this.on(handler, fn1, fn2);
	},
	// unbind a event handler
	unbind: function(handler) {
		// stack the callback
		this.__PUSH__(function() {
			Js.code.on(this, handler, function() {
				return true;
			});
		});
		// continue chaining
		return this;
	},
	// extend onDOMReady function to Js.Elements
	ready: function(fn) {
		// include document if node empty
		if(this.node.length == 0) {
			this.__ADD__([document]);
		}
		
		// stack the callback
		this.__PUSH__(function() {
			Js.domReady.add(this, fn);		 
		});
		// continue chaining
		return this;
	},
	setHash: function(data, value) {
		// stack the callback
		this.__PUSH__(function() {
			Js.hash.set(this, data, value);
		});
		// continue chaining
		return this;
	},
	// get hashtable value
	getHash: function(data) {
		var key = Js.code.pick(this.index, null);
		
		if (Js.code.isnull(key)) {
			var value = [];			
			// get each value of hash from an array
			Js.code.each(this.node, function() { 
				value[value.length] = Js.hash.get(this, data);
			});
			// return the value in array
			return value;
		} else if (!!this.node[key]) {
			// get single hash value
			return Js.hash.get(this.node[key], data);
		}
	},
	// remove hashtable
	removeHash: function(data) {
		// stack the callback
		this.__PUSH__(function() {
			Js.hash.remove(this, data);
		});
		// continue chaining
		return this;
	},
	// I'm done with the current chain. Clear the memory
	done: function() {
		// clear memory
		return null;							
	},
	// manipulating HTML string for Element
	htmlManip: function(text, option) {
		var option = (option.match(/^(before|after)$/g) ? option : "after");
		
		// stack the callback
		this.__PUSH__(function() {
			// get current HTML string
			var html = Js.code.pick(this.innerHTML, "");
			
			if(option == "after") {
				// append the HTML string
				this.innerHTML = [html,text].join("");
			} else if(option == "before") {
				// prepend the HTML string
				this.innerHTML = [text,html].join("");
			}
		});
		// enable chaining
		return this;
	}
};

// Extend misc event handler function to Js.Elements
(function() {
	// array listing all the supported event handler
	var handler = ["click", "mouseover", "mouseout", "change", "keyup", "keypress", "submit", "blur", "focus", "hover"];
	// Loop the array and implement each event handler
	Js.code.each(handler, function() {
		// this is the values of array
		var that = this;
		// add 's' or 'es' at the end of array value (prevent problem without having s)
		var event1 = (!that.match(/(es)$/g) ? [that, (!that.match(/s$/g) ? "s" : "")].join("") : that);
		var event2 = ['on', that].join("");
		try {
			// extend it to Js.Elements
			Js.extend(event1, function(fn1, fn2) {
				return this.on(that, fn1, fn2);
			});
			Js.extend(event2, function(fn1, fn2) {
				return this.on(that, fn1, fn2);						   
			});
		} catch(e) { 
			// Just in case any error occur (but doubt it)
			Js.debug.log(e);
		}
	});
})();

Js.code._$ = window.$$;
var $$ = function(selector, parent) {
	return Js(selector, parent);
};

Js.code.restore = function() {
	if(this.isset(this._$)) {
		window.$$ = this._$;
		this._$ = null;
	}
	
	return (function(selector, parent) {
		return Js(selector, parent);
	});
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Ext.Ajax
 * Type: Extension
 * Last Updated: 12th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 */

// Import as Extension
Js.ext.include("Ajax", function(js) {
	this.object = null;
	this.debug = false;
	this.data = null;
	this.parameter = "";
	this.uri = "";
	this.type = "";
	this.reply = null;
	this.method = null;
	this.cache = true;
	this.timeout = 0;
	this.timeoutid = null;
	
	// create a XHR Request
	if(!!js && typeof(js) === "object") {
		this.init(js);
	}
	
	// chain this
	return this;
}).prototype = {
	declare: function() {
		var xhr = false;
		
		if(window.XMLHttpRequest) {
			// Majority of modern browser support XMLHttpRequest()
			xhr = new XMLHttpRequest();
		} else if(window.ActiveXObject) {
			// Enable support for IE browser, IE7 and above provide option to use XMLHttpRequest()
			var ie = ["MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			
			for(var i = 0; i < ie.length && !!ie[i]; i++) {
				try {
					xhr = new ActiveXObject(ie[i]);
					break;
				} catch(e){ }
			}
		}
		
		if(!xhr) {
			// Failed to attach any XHR object
			Js.debug.log("Js.ext.Ajax.init() failed: browser does not support Ajax!");
		}
		
		this.object = xhr;
	},
	init: function(js) {
		if(this.object == null) {
			// Initialize XHR object if undefined.
			this.declare();
		}
		
		// Check XHR method: GET/POST
		this.method = (!Js.code.isset(js.method) || js.method != "GET" ? "POST" : "GET");
		// Set caching option for the request
		this.cache = Js.code.pick(js.cache, this.cache);
		// Enable debugging for XHR request
		this.debug = Js.code.pick(js.debug, this.debug);
		// XHR uri request
		this.uri = (js.uri ? Js.code.trim(js.uri) : this.uri);
		// XHR parameters
		this.parameter = (js.parameters ? Js.code.trim(js.parameters) : this.parameter);
		// XHR data
		this.data = (!!js.data ? js.data : this.data);
		this.data = (!!this.data ? Js.code.serialize(this.data) : "");
		
		// Set timeout.
		this.timeout = Js.code.pick(js.timeout, this.timeout);
		this.timeout = (!!Js.test.isInteger(this.timeout) ? this.timeout : 0);
		
		// check whether XHR object is ready
		if(this.object.readyState == 4 || this.object.readyState == 0) {
			if(this.method == "POST") {
				// use method POST
				this.object.open("POST", this.uri, true);
				
				this.type = Js.code.trim(Js.code.pick(js.type, "application/x-www-form-urlencoded"));
				this.object.setRequestHeader("Content-Type", this.type);
				
				if(this.object.overrideMimeType) {
					this.object.setRequestHeader("Connection", "close");
				}
				
				this.methodPost();
				this.object.send(this.parameter);
			} else {
				// use method GET
				this.methodGet();
				this.object.open("GET", [this.uri, this.parameter].join(""), true);
				this.object.send("");
			}
			
			// set timeout count
			if(this.timeout > 0) {
				this.timeoutid = setTimeout(function() {
					that.requestCancel();
				}, this.timeout);
			}
			
			var that = this;
			var object = this.object;
			// Run custom callback to function
			if(Js.code.isfunction(js.onComplete)) {
				try {
					this.object.onreadystatechange = function() {
						// clear timeout (if exist)
						if(this.readyState === 4 && that.requestStatus()) {
							if(Js.code.isset(that.timeoutid)) {
								clearTimeout(that.timeoutid);
								that.timeoutid = null;
							}
							
						}
						js.onComplete.apply(that.object);
					};
				} catch(e) { 
					Js.debug.log(e); 
				}
			} else {
				// Run default callback to function
				this.object.onreadystatechange = function() {
					try {
						// if request is complete and page is available
						if(that.object.readyState === 4 && that.requestStatus()) {
							// clear timeout (if exist)
							if(Js.code.isset(that.timeoutid)) {
								clearTimeout(that.timeoutid);
								that.timeoutid = null;
							}
							
							// get response text
							var reply = that.reply = Js.code.trim(that.object.responseText);
							
							// add to logs (if enable)
							if(that.debug === true) {
								Js.debug.log("Response from XHR: " + reply);
							}
							
							// reply shouldn't be empty
							if(reply !== "") {
								// eval the JSON string
								var data = eval("(" + reply + ")");
								
								// check for SUIXHR object
								if(!!data.SUIXHR) {
									that.responseNotice(data);
									that.responseGoto(data);
									that.responseUpdate(data);
								}
								that.requestDone();
							} else {
								that.requestCancel(); // cancel the object
							}
						}
					} catch(e) {
						// log if anything goes wrong
						Js.debug.log("onreadychange error: " +e);
					}
				};
			}
		}
	},
	// Cancel the currently running XHR Object/request
	requestCancel: function() {
		this.object.abort();
		this.object = null;
		Js.debug.log("Js.ext.Ajax: Cancel XHR request"); 
	},
	requestDone: function() {
		this.object = null;
	},
	methodPost: function() {
		var p = this.parameter;
		
		if(p.match(/^\?/)) {
			p = ["&", p.substr(1)].join("");
		}
		
		this.parameter = p;
		this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "") + this.data : "");
		
		if(this.cache === false) {
			var s = new Date;
			this.parameter += (this.parameter !== "" ? "&" : "?") + "suicache=" + s.getTime(); 
		}
	},
	methodGet: function() {
		var par = [];
		var param = "";
		var p = this.parameter;
		
		if(this.uri.match(/\?/)) {
			var u = this.uri.split(/\?/);
			
			if (u.length > 1) {
				this.uri = u[0];
				
				for (var i = 1; i < u.length; i++) {
					par.push(u[i]);
				}
				
				param = ["&", par.join("&")].join("");
			}
		}
		
		if(p.match(/^\?/) && p.length > 0) {
			p = "&" + p.substr(1);
		}
		
		p = [param, p].join("");
		
		if(p.length > 0 && p.match(/^(\&|\?)/)) {
			p = ["?", p.substr(1)].join("");
		}
		
		this.parameter = p;
		this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "?") + this.data : "");
		
		if(this.cache === false) {
			var s = new Date;
			this.parameter += (this.parameter !== "" ? "&" : "?") + "suicache=" + s.getTime(); 
		}
	},
	requestStatus: function() {
		var r = this.object.status;
		
		try {
			var local = (!r && location.protocol == 'file:');
			var range = (r >= 200 && r < 300);
			var unmodified = (r == 304);
			var safari = (Js.code.behaviour.safari && typeof(r) == "undefined");
			return  (local || range || unmodified || safari);
		} catch(e) {
			Js.debug.log("Status failed: " + e);	
		}
		return false;
	},
	responseNotice: function(data) {
		var a = Js.code.pick(data.alertpop, data.notice);
		
		if(Js.code.isset(a) && a !== "") {
			window.alert(a);
		}
	},
	responseGoto: function(data) {
		var h = Js.code.pick(data.jumpto, data.href);
		
		if(Js.code.isset(h) && h !== "") {
			Js.code.href(h);
		}
	},
	responseUpdate: function(data) {
		var p = Js.code.pick(data.result, data.text);
		var id = Js.code.pick(data.add2id, data.id);
		var fn = Js.code.pick(data.exec, data.callback);
		
		if(!!p) {
			if(!!id && typeof(id) === "string") {
				var node = Js.query.selector("#" + id);
				node[0].innerHTML = Js.parse.bbml(p);
			} else if(Js.code.isfunction(fn)) {
				fn(p);
			}
		}
	}
};

// Make it easier for people to code
Js.namespace.include("Ajax", Js.ext.Ajax);

Js.extend("load", (function(url, method) {
	var key = Js.code.pick(this.index, 0);
	var method = ((!!method && !!Js.code.inArray(['post','get'], method.toLowerCase())) ? method.toUpperCase() : 'GET');
	
	if(Js.code.isset(key) && !!this.node[key]) {
		var node = this.node[key];
		
		var updateNode = function() {
			if(this.readyState == 4) {
				var text = this.responseText;
				node.innerHTML = Js.parse.bbml(text);
			}
		};
		
		new Js.ext.Ajax({
			uri: url,
			method: method,
			cache: false,
			onComplete: updateNode
		});
	}
	return this;
}));
/*
 * Savvy.UI JavaScript Library Extension
 * Name: Js.ext.Animator
 * Type: Extension
 * Version: 0.4 (alpha-release)
 * Last Updated: 12th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 */
 
// Import to Extension
Js.ext.include("Animator", function(spec) {
	// Define Object's properties
	this.object = null;
	this.interval = null;
	this.does = null;
	this.width = 0;
	this.height = 0;
	this.margin = [];
	this.top = 0;
	this.left = 0;
	this.oncomplete = null;
	this.type = null;
	this.transaction = [];
	this.methods = ["move","moveUp", "moveDown", "moveLeft", "moveRight", "slideUp", "slideDown", "slideLeft", "slideRight", "resize", "resizeWidth", "resizeHeight", "fade", "custom"];
	this.withPx = ["margin", "marginTop", "marginLeft", "marginBottom", "marginRight", "padding", "paddingTop", "paddingLeft", "paddingBottom", "paddingRight", "top", "left", "right", "bottom", "width", "height"];
	this.shutter = 20;
	this.step = 0;
	this.ease = 0;
	this.prevEase = 0;
	this.actStep = 0;
	
	// create a animation transaction
	if(!!spec) {
		this.init(spec);
	}
	
	return this;
}).prototype = {
	init: function(spec) {
		var node;
		
		if (typeof(spec) == "string") {
			var el = spec;
			
			if (Js.code.finds(el)) {
				node = Js.query.id(el);
			} else {
				node = Js.query.create("div");
				Js.attr.get(node, "id", el);
			}
		} else if (spec && spec.nodeType === 1) {
			node = spec;
		} else {
			var object = Js.code.pick(spec.object, spec.node);
			node = Js.code.prepare(object, spec.element, "object");
		}
		
		this.object = node;
		return this;
	},
	queue: function(spec) {
		var that = this;
		fn = this.oncomplete;
		this.onComplete = function() {
			if (Js.code.isfunction(fn)) {
				fn();
			}
			
			new Js.ext.Animator(this.object).fx(spec);
		};
		return this;
	},
	sync: function(spec) {
		new Js.ext.Animator(this.object).fx(spec);
		return this;
	},
	fx: function(spec) {
		if (this.interval === null) {
			this.does = spec.method = (Js.code.inArray(this.methods, spec.method) ? spec.method : "moveUp");
			this.oncomplete = spec.oncomplete = Js.code.pick(spec.onComplete, null);
			this.grid();
			this.shutter = spec.shutter = Js.code.pick(spec.shutter, 20);
			this.step = spec.step = Js.code.pick(spec.step, 80);
			this.ease = Js.code.pick(spec.ease, 0.8);
			this.actStep = 0;
			var that = this;
			
			if (this.does.match(/^move(Up|Down|Left|Right)$/)) {
				var ts = spec.transaction;
				
				if (this.does.match(/^move(Left|Right)$/)) {
					this.type = Js.code.pick(spec.property, "marginLeft");
					
					if (this.type != "marginLeft" && Js.style.get(this.object, "position")) {
						this.type = "left";
						this.transaction[0] = Js.code.pick(ts[0], this.left);
						this.transaction[1] = ts[1];
					} else {
						this.type = "marginLeft";
						this.transaction[0] = Js.code.pick(ts[0], this.margin[3]);
						this.transaction[1] = ts[1];
					}
				} else if (this.does.match(/^move(Up|Down)$/)) {
					this.type = Js.code.pick(spec.property, "marginTop");
					
					if (this.type != "marginTop" && Js.style.get(this.object, "position")) {
						this.type = "top";
						this.transaction[0] = Js.code.pick(ts[0], this.top);
						this.transaction[1] = ts[1];
					} else {
						this.type = "marginTop";
						this.transaction[0] = Js.code.pick(ts[0], this.margin[0]);
						this.transaction[1] = ts[1];
					}
				}
				
				this.interval = setInterval(function(){ 
					that.custom(); 
				}, this.shutter);
			} else if (this.does == "move") {
				var ts = spec.transaction;
				this.type = Js.code.pick(spec.property, "margin");
				
				if (this.type != "margin" && Js.style.get(this.object, "position")) {
					this.type = "position";	
					this.transaction[0] = Js.code.pick(ts[0], this.top);
					this.transaction[1] = ts[1];
					this.transaction[2] = Js.code.pick(ts[2], this.left);
					this.transaction[3] = ts[3];
				} else {
					this.type = "margin";
					this.transaction[0] = Js.code.pick(ts[0], this.margin[0]);
					this.transaction[1] = ts[1];
					this.transaction[2] = Js.code.pick(ts[2], this.margin[3]);
					this.transaction[3] = ts[3];
				}
				
				this.interval = setInterval(function() {
					that.customMove();
				}, this.shutter);
			} else if (this.does.match(/^resize(Width|Height)$/)) {
				this.type = Js.code.pick(spec.property, "normal");
				this.does = (spec.method == "resizeWidth" ? "width" : "height");
				var ts 	= spec.transaction;
				
				if (this.does == "width") {
					this.transaction[0] = Js.code.pick(ts[0], this.width);
					this.transaction[1] = ts[1];
				} else {
					this.transaction[0] = Js.code.pick(ts[0], this.height);
					this.transaction[1] = ts[1];
				}
				
				this.interval = setInterval(function() {
					that.size();
				}, this.shutter);
			} else if (this.does == "resize") {
				this.type = Js.code.pick(spec.property, "normal");
				var ts 	= spec.transaction;
				this.transaction[0] = Js.code.pick(ts[0], this.width);
				this.transaction[1] = ts[1];
				this.transaction[2] = Js.code.pick(ts[2], this.height);
				this.transaction[3] = ts[3];
				
				this.interval = setInterval(function() {
					that.sizeBoth();
				}, this.shutter);
			} else if (this.does == "fade") {
				this.type = spec.property = spec.method;
				var ts = spec.transaction;
				this.transaction[0] = (ts[0] < 0 ? 0 : (ts[0] > 100 ? 100 : ts[0]));
				this.transaction[1] = (ts[1] < 0 ? 0 : (ts[1] > 100 ? 100 : ts[1]));
				
				this.interval = setInterval(function() {
					that.fade();
				}, this.shutter);
			} else if (this.does == "custom") {
				this.type = spec.property;
				this.transaction = spec.transaction;
				
				this.interval = setInterval(function() {
					that.__CUSTOM__();
				}, this.shutter);
			}
		}
		return this;
	},
	fade: function() {
		var node = this.object;
		
		if (Js.code.isset(node)) {
			var t = this.transaction;
			this.actStep = (this.actStep + 1);
			this.prevEase = t[0];
			var s = this.easeOut(t[0], t[1], this.step, this.actStep, this.ease);
			
			if (s === this.prevEase) {
				try {
					if (s == 0 && Js.style.get(node, "visibility") != "hidden") {
						Js.style.hide(node);
					} else if (s > 0 && Js.style.get(node, "visibility") == "hidden") {
						Js.style.show(node);
					}
					
					if (window.ActiveXObject || Js.code.behaviour.ie == true) {
						if (!node.currentStyle || !node.currentStyle.hasLayout) {
							Js.style.set(node, "zoom", 1);
						}
						
						Js.style.set(node, "filter", (t[1] < 100 ? "alpha(opacity=" + t[1] + ")" : ""));
					} else {
						Js.style.set(node, "opacity", (t[1] / 100));
						Js.style.set(node, "MozOpacity", (t[1] / 100));
					}
				} catch(e) { 
					Js.debug.log("Js.ext.Animator.fade failed: " + e);
				}
				
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			} else if (t[0] != t[1]) {
				try {
					if (s == 0 && Js.style.get(node, "visibility") != "hidden") {
						Js.style.hide(node);
					} else if (s > 0 && Js.style.get(node, "visibility") == "hidden") {
						Js.style.show(node);
					}
					
					if (window.ActiveXObject || Js.code.behaviour.ie == true) {
						if (!node.currentStyle || !node.currentStyle.hasLayout) {
							Js.style.set(node, "zoom", 1);
						}
						
						Js.style.set(node, "filter", (s < 100 ? "alpha(opacity=" + s + ")" : ""));
					} else {
						Js.style.set(node, "opacity", (s / 100));
						Js.style.set(node, "MozOpacity", (s / 100));
					}
				} catch(e) { 
					Js.debug.log("Animator.Fade failed: " + e);
				}
				this.transaction[0] = s;
			} else {
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			}
		}
		return this;
	},
	size: function() {
		var node = this.object;
		var does = this.does;
		var type = this.type;
		
		if (does.match(/^(width|height)$/)) {
			var t = this.transaction;
			this.actStep = (this.actStep + 1);
			this.prevEase = t[0];
			var s = this.easeOut(t[0], t[1], this.step, this.actStep, this.ease);
			
			if(s === this.prevEase) {
				Js.style.set(node, does, t[1] + "px");
				
				if (type == "center") {
					if (does == "height") {
						var center = Js.ext.dimension.page.middle(10, t[1]);
						Js.style.set(node, "top", center[0] + "px");
					} else if (does == "width") {
						var center = Js.ext.dimension.page.middle(t[1], 10);
						Js.style.set(node, "left", center[1] + "px");
					}
				}
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			} else if (t[0] != t[1]) {
				Js.style.set(node, does, s + "px");
				
				if (type == "center") {
					if (does == "height") {
						var center = Js.ext.dimension.page.middle(10, s);
						Js.style.set(node, "top", center[0] + "px");
					} else if (does == "width") {
						var center = Js.ext.dimension.page.middle(s, 10);
						Js.style.set(node, "left", center[1] + "px");
					}
				}
				this.transaction = [s, t[1]];
			} else {
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			}
		} else {
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	sizeBoth: function() {
		var node = this.object;
		var does = this.does;
		var type = this.type;
		var t = this.transaction;
		this.actStep = (this.actStep + 1);
		var s = this.easeOut(t[0], t[1], this.step, this.actStep, this.ease);
		var u = this.easeOut(t[2], t[3], this.step, this.actStep, this.ease);
		
		if (t[0] != t[1] || t[2] != t[3]) { 
			if (t[0] != t[1]) {
				Js.style.set(node, "width", s + "px");
				
				if (type == "center") {
					var center = Js.ext.dimension.page.middle(s, 10);
					Js.style.set(node, "left", center[1] + "px");
				}
				this.transaction[0] = s;
			} else {
				this.transaction[0] = t[1];
			}
			
			if (t[2] != t[3]){
				Js.style.set(node, "height", u + "px");
				
				if (type == "center") {
					var gctr = Js.ext.dimension.page.middle(10, u);
					Js.style.set(node, "top", center[1] + "px");
				}
				this.transaction[2] = u;
			} else {
				this.transaction[2] = t[3];
			}
		} else {
			var fn = this.oncomplete;
			if (Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	custom: function() {
		var node = this.object;
		var t = this.transaction;
		var type = this.type;
		this.actStep = (this.actStep + 1);
		this.prevEase = t[0];
		var s = this.easeOut(t[0], t[1], this.step, this.actStep, this.ease);
		
		if(s === this.prevEase) {
			if (Js.code.inArray(this.withPx, type)) {
				Js.style.set(node, type, t[1] + "px");
			} else {
				Js.style.set(node, type, t[1]);
			}
			
			var fn = this.oncomplete;
			if (Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		} else if (t[0] !== t[1]) {
			if (Js.code.inArray(this.withPx, type)) {
				Js.style.set(node, type, s + "px");
			} else {
				Js.style.set(node, type, s);
			}
			
			this.transaction[0] = s;
		} else {
			var fn = this.oncomplete;
			if (Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	customMove: function() {
		var node = this.object;
		var t = this.transaction;
		var type = (this.type == "margin" ? "margin" : "position");
		this.actStep = (this.actStep + 1);
		
		var s = this.easeOut(t[0], t[1], this.step, this.actStep, this.ease);
		var u = this.easeOut(t[2], t[3], this.step, this.actStep, this.ease);
		
		if (t[0] != t[1] || t[2] != t[3]) {
			var does = "";
			
			if (t[0] != t[1]) {
				does = (type == "margin" ? "marginTop" : "top");
				Js.style.set(node, does, s + "px");
				this.transaction[0]	= s;
			} else { 
				this.transaction[0] = t[1];
			}
			
			if (t[2] != t[3]) {
				does = (type == "margin" ? "marginLeft" : "left");
				Js.style.set(node, does, u + "px");
				this.transaction[2]	= u;
			} else {
				this.transaction[2] = t[3];
			}
		} else {
			var fn = this.oncomplete;
			if(Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	easeOut: function(minval, maxval, t, a, p) {
		var i =  Math.ceil(minval + (Math.pow(((1 / t) * a), p) * (maxval - minval)));
		return i;
    },
	getStyling: function(node, option, alt) {
		return Js.code.pick(Js.code.toNumber(Js.style.get(node, option)), alt);
	},
	grid: function() {
		var node = this.object;
		
		if(Js.style.get(node, "position")) {
			this.top = this.getStyling(node, "top", 0);
			this.left = this.getStyling(node, "left", 0);
		}
		
		this.width = this.getStyling(node, "width", node.offsetWidth);
		this.height	= this.getStyling(node, "height", node.offsetHeight);
		
		var mT = this.getStyling(node, "marginTop", 0);
		var mB = this.getStyling(node, "marginBottom", 0);
		var mL = this.getStyling(node, "marginLeft", 0);
		var mR = this.getStyling(node, "marginRight", 0);
		var m = [];
		
		m = (Js.style.get(node, "margin") ? Js.style.get(node, "margin").split(" ") : [0, 0, 0, 0]);
		m[0] = Js.code.toNumber(m[0]);
		m[1] = (Js.code.isset(m[1]) || !isNaN(m[1]) ? Js.code.toNumber(m[1]) : m[0]);
		m[2] = (Js.code.isset(m[2]) || !isNaN(m[2]) ? Js.code.toNumber(m[2]) : m[0]);
		m[3] = (Js.code.isset(m[3]) || !isNaN(m[3]) ? Js.code.toNumber(m[3]) : m[1]);
		
		var mgT = (Js.code.isnull(mT) || isNaN(mT) ? 0 : mT);
		mgT = (Js.code.isnull(m[0]) || isNaN(m[0]) ? mgT : m[0]);
		var mgB = (Js.code.isnull(mB) || isNaN(mB) ? 0 : mB);
		mgB = (Js.code.isnull(m[2]) || isNaN(m[2]) ? marginBottom : m[2]);
		var mgL = (Js.code.isnull(mL) || isNaN(mL) ? 0 : mL);
		mgL = (Js.code.isnull(m[3]) || isNaN(m[3]) ? mgL : m[3]);
		var mgR = (Js.code.isnull(mR) || isNaN(mR) ? 0 : mR);
		mgR = (Js.code.isnull(m[1]) || isNaN(m[1]) ? mgR : m[1]);
		
		Js.style.setup(this.object, {
			"marginTop": mgT + "px",
			"marginBottom": mgB + "px",
			"marginLeft": mgL + "px",
			"marginRight": mgR + "px"
		});
		this.margin = [mgT, mgR, mgB, mgL];
		return this;
	}
};

Js.namespace.include("Animator", Js.ext.Animator);

Js.extend('fx', (function(spec) {
	var key = Js.code.pick(this.index, null);
	
	if (Js.code.isnull(key)) {
		Js.code.each(this.animate, function() {
			this.fx(spec);
		});
	} else if (!!this.node[key]) {
		this.animate[key].fx(spec);
	}
							  
	return this;
}));

Js.extend('syncFx', (function(spec) {
	var key = Js.code.pick(this.index, null);
	
	if (Js.code.isnull(key)) {
		Js.code.each(this.animate, function(){
			this.sync(spec);
		});
	} else if (!!this.node[key]) { 
		this.animate[key].sync(spec);
	}
	
	return this;
}));

Js.extend('queueFx', (function(spec) {
	var key = Js.code.pick(this.index, null);
	
	if (Js.code.isnull(key)) {
		Js.code.each(this.animate, function(){ 
			this.queue(spec); 
		});
	} else if (!!this.node[key]) {
		this.animate[key].queue(spec);
	}
	
	return this;
}));
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Ext.Dimension
 * Type: Ext
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */

Js.ext.include("dimension", {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function() {
				var doc = document.body;
				var rdata = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
					
				if(typeof(offset) == "number") {
					rdata = offset;
				} else if(doc && doc.scrollLeft) {
					rdata = doc.scrollLeft;
				} else if(el && el.scrollLeft) {
					rdata = el.scrollLeft;	
				}
				return rdata;
			},
			y: function() {
				var doc = document.body;
				var rdata = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if(typeof(offset) == "number") {
					rdata = offset;
				} else if(doc && doc.scrollTop) {
					rdata = doc.scrollLeft;
				} else if(el && el.scrollTop) {
					rdata = el.scrollLeft;
				}
				return rdata;
			},
			xy: function() {
				return [Js.ext.dimension.page.scrolls.x(), Js.ext.dimension.page.scrolls.y()];
			}
		},
		size: {
			width: function() {
				
			},
			height: function() {
				
			}
		},
		middle: function(width, height) {
			var doc = document.body;
			var offset = [Js.code.toNumber(doc.offsetWidth), Js.code.toNumber(doc.offsetHeight)];
			var axis = Js.ext.dimension.page.scrolls.xy();
			var rdata = [];
					
			rdata[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
			rdata[1] = Math.round((((screen.height - 200) - height) / 2) + axis[1]);
			rdata[0] = (rdata[0] < 0 ? 0 : rdata[0]);
			rdata[1] = (rdata[1] < 0 ? 0 : rdata[1]);	
			rdata.reverse();
				
			return rdata;
		}
	},
	node: {
		scrolls: {},
		size: {},
		offset: function(node) {
			var rdata = [0, 0, 0, 0];
			var loop = false;
			
			if(Js.code.isset(node)) {
				if(node.offsetParent) {
					loop = true;
					rdata[0] = node.offsetWidth;
					rdata[1] = node.offsetHeight;
					
					while(node.offsetParent) {
						rdata[2] += node.offsetTop;
						rdata[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				} else {
					if(loop == false) {
						rdata[0] = Js.code.pick(node.scrollWidth, 0);
						rdata[1] = Js.code.pick(node.scrollHeight, 0);
						rdata[2] = Js.code.pick(node.offsetTop, 0);
						rdata[3] = Js.code.pick(node.offsetLeft, 0);
					}
				}
				return rdata;
			} else {
				Js.debug.log("Js.ext.dimension.node.offset error : " + node + " does not exist");
				return ret;
			}
		}
	}
});
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Drag
 * Type: Extension
 * Version: 0.5 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, SUI.CSS
 * Optional: Core
 */
 
// Import as Extension
Js.ext.include("Draggable", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		var node = this.object = Js.code.pick(js.object, js.node);
		var that = this;
		node.root = Js.code.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) {
			that.start(e);
		};
		
		node.hmode = Js.code.pick(js.hmode, true);
		node.vmode = Js.code.pick(js.vmode, true);
		node.hswap = Js.code.pick(js.hswap, false);
		node.vswap = Js.code.pick(js.vswap, false);
		node.minX = Js.code.pick(js.minX, null);
		node.maxX = Js.code.pick(js.maxX, null);
		node.minY = Js.code.pick(js.minY, null);
		node.maxY = Js.code.pick(js.maxY, null);
		
		if (isNaN(Js.code.toNumber(Js.style.get(node.root, "left")))) {
			Js.style.set(node.root, "left", "0px");
		}
		if (isNaN(Js.code.toNumber(Js.style.get(node.root, "top")))) { 
			Js.style.set(node.root, "top", "0px");
		}
		node.root.onDragStart = new Function();
		node.root.onDragEnd = new Function();
		node.root.onDrag = new Function();
	},
	clearDrag: function() {
		this.object = null;
	},
	start: function(e) {
		var that = this;
		var node = this.object;
		var e = this.fixE(e);
		var y = Js.code.toNumber(Js.style.get(node.root, "top"));
		var x = Js.code.toNumber(Js.style.get(node.root, "left"));
		
		node.root.onDragStart(x, y);
		node.lastMouseX = e.clientX;
		node.lastMouseY = e.clientY;
		
		if (node.minX != null) {
			node.minMouseX = e.clientX - x + node.minX;
		}
		if (node.maxX != null) {
			node.maxMouseX = node.minMouseX + node.maxX - node.minX;
		}
		if (node.minY != null) { 
			node.minMouseY = e.clientY - y + node.minY;
		}
		if (node.maxY != null) {
			node.maxMouseY = node.minMouseY + node.maxY - node.minY;
		}
		
		document.onmousemove = function(e) { 
			that.startDrag(e);
		};
		document.onmouseup = function(e){ 
			that.stopDrag(e);
		};
		
		return false;
	},
	startDrag: function(e) {
		var e = this.fixE(e);
		var node = this.object;
		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = Js.code.toNumber(Js.style.get(node.root, "top"));
		var x = Js.code.toNumber(Js.style.get(node.root, "left"));
		var nx;
		var ny;
		
		ex = (node.minX != null ? Math.min(ex, node.mixMouseX) : ex);
		ex = (node.maxX != null ? Math.max(ex, node.maxMouseX) : ex);
		ey = (node.minY != null ? Math.min(ey, node.minMouseY) : ey);
		ey = (node.maxY != null ? Math.max(ey, node.maxMouseY) : ey);
		
		nx = x + ((ex - node.lastMouseX) * (node.hswap ? -1 : 1));
		ny = y + ((ey - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if (node.hmode) {
			Js.style.set(node.root, "left", nx + "px");
		} 
		if (node.vmode) {
			Js.style.set(node.root, "top", ny + "px");
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onDrag(nx, ny);
		
		return false;
	},
	stopDrag: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var data = node.root;
		data.onDragEnd(Js.code.toNumber(data.style.left), Js.code.toNumber(data.style.top), data);
		node = null;
	},
	fixE: function(e) {
		if(Js.code.isnull(e)) {
			e = window.event;
		}
		if(Js.code.isnull(e.layerX)) {
			e.layerX = e.offsetX;
		}
		if(Js.code.isnull(e.layerY)) {
			e.layerY = e.offsetY;
		}
		
		return e;
	}
};

// Shortern the Namespace
Js.namespace.include("Draggable", Js.ext.Draggable);

Js.extend('draggable', function(js) {
	var js = (!js ? {} : js);
	
	this.__PUSH__(function() {
		if (!Js.style.get(this, "position")) {
			var t = Js.ext.dimension.node.offset(this);
			Js.style.setup(this, {"position": "absolute", "top": t[2]+"px", "left": t[3]+"px"});
		}
		
		js.node = this;
		new Js.ext.Draggable(js);
	});
	return this;
});
/*
 * Savvy.UI JavaScript Library Extension
 * Name: Form
 * Type: Extension
 * Version: 0.7 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.coms
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 */
 
Js.ext.include("Form", function() {
	this.first = null;
	this.object = null;
	
	return this;
}).prototype = {
	liveValidate: function(node, custom) {
		this.object = Js.code.pick(node, this.object);
		
		var formId = Js.attr.get(this.object, "id");
		var custom = Js.code.pick(custom, null);
		var post = "";
		var that = this;
		
		if(!!this.object) {
			var field = Js("#" + formId + " :input");
			
			field.onblur(function() {
				var errorNode = Js(this).siblings("span.extform-errormessage").first();
				if(errorNode.count() == 1) {
					Js.dom.remove(errorNode.fetch());
				}
				
				if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/)) {
					if(this.name != "") {
						this.className = (Js.code.isset(this.className) ? this.className : "");
						var klass = this.className.split(/\s/);
						var error = "";
						
						if(Js.code.inArray(klass, "required") && Js.code.trim(this.value) === "") {
							error = "This field require an input!";
						}
						
						if(Js.code.inArray(klass, "string") && !Js.test.isString(this.value) && Js.code.trim(this.value) !== "") {
							error = "This field require valid alphanumeric!";
						} else if((Js.code.inArray(klass, "integer") || Js.code.inArray(klass, "number")) && !Js.test.isInteger(this.value) && Js.code.trim(this.value) !== "") { 
							error = "This field require valid numbers!";
						} else if(Js.code.inArray(klass, "email") && !Js.test.isEmail(this.value) && Js.code.trim(this.value) !== "") {
							error = "This field require valid e-mail address!";
						}
						
						if(Js.code.isset(custom)) {
							var validate = custom[Js.attr.get(this, "id")];
							
							if(Js.code.isset(validate)) {
								if(Js.code.isfunction(validate.callback) && !validate.callback(this.value)) { 
									error = Js.code.pick(validate.error, error);
								} else if(Js.code.isset(validate.test) && !this.value.match(validate.test)) {
									error = Js.code.pick(validate.error, error);
								}
							}
						}
						
						if(error !== "") {
							that.liveError(this, error);
						} else {
							Js.className.remove(this, "extform-error");
							
							var errorNode = Js(this).siblings("span.extform-errormessage").first();
							if(errorNode.count() == 1) {
								Js.dom.remove(errorNode.fetch());	
							}
						}
						
						for(var i = 0; i < klass.length; i++) {
							if(klass[i].match(/(max|min|exact)\-(\d*)/)) {
								if(!Js.test.isLength(klass[i], this.value.length)) {
									var error = klass[i].split(/\-/);
									that.liveError(this, "This field require " + error[0] + " of " + error[1] + " characters.", true);
								}
							}
						}
					}
				}
			});
		}
		
		if(Js.code.isset(this.first)) { 
			// stop form processing
			return false;
		} else {
			return true;
		}
	},
	liveError: function(field, text, data) {
		// Mark first error occured!
		var form = Js(this.object);
		var field = Js(field);
		var fieldId = field.get("name");
		var fieldErrorId = [form.get("id"), fieldId, "error"].join("-");
		var data = Js.code.pick(data, false);
		var that = this;
		
		if (!Js.code.finds(fieldErrorId)) {
			field.appendClass("extform-error").parent().add("span", {"id": fieldErrorId, "class": "extform-errormessage"}).html(text);
			
			field.onfocus(function() {
				if(this.value != "") { 
					var node = Js(this).removeClass("extform-error");
					var errorNode = node.siblings("span.extform-errormessage").first();
					
					if(errorNode.count() == 1) {
						Js.dom.remove(errorNode.fetch());
					}
				}
			});
		} else if (Js.code.finds(fieldErrorId) && data) {
			field.appendClass("extform-error");
			var errorNode = field.siblings("span.extform-errormessage").first();
			var html = errorNode.html();
			
			if (html.match(text) === false && Js.code.trim(html) != "") {
				errorNode.append(" " + text);
			}
			
			field.onfocus(function() {
				if (this.value != "") {
					var node = Js(this).removeClass("extform-error");
					var errorNode = node.siblings("span.extform-errormessage").first();
					
					if(errorNode.count() == 1) {
						Js.dom.remove(errorNode.fetch());
					}
					
				}
			});
		}
	},
	validate: function(node, custom) {
		this.object = Js.code.pick(node, this.object);
		
		var formId = Js.attr.get(this.object, "id");
		var custom = Js.code.pick(custom, null);
		var post = "";
		
		this.first = null;
		var that = this;
		
		if(!!this.object) {
			var field = Js("#" + formId + " :input");
			
			field.each(function() {
				if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/g)) {
					if(this.name != "") {
						this.className = (Js.code.isset(this.className) ? this.className : "");
						var klass = this.className.split(/\s/);
						var error = "";
												
						if(Js.code.inArray(klass, "required") && Js.code.trim(this.value) === "") {
							error = "This field require an input!";
						}
						
						if(Js.code.inArray(klass, "string") && !Js.test.isString(this.value) && Js.code.trim(this.value) !== "") {
							error = "This field require valid alphanumeric!";
						} else if((Js.code.inArray(klass, "integer") || Js.code.inArray(klass, "number")) && !Js.test.isInteger(this.value) && Js.code.trim(this.value) !== "") { 
							error = "This field require valid numbers!";
						} else if(Js.code.inArray(klass, "email") && !Js.test.isEmail(this.value) && Js.code.trim(this.value) !== "") {
							error = "This field require valid e-mail address!";
						}
						
						if(Js.code.isset(custom)) {
							var validate = custom[Js.attr.get(this, "id")];
							
							if(Js.code.isset(validate)) {
								if(Js.code.isfunction(validate.callback) && !validate.callback(this.value)) {
									error = Js.code.pick(validate.error, error);
								} else if(Js.code.isset(validate.test) && !this.value.match(validate.test)) {
									error = Js.code.pick(validate.error, error);
								} else {
									error = Js.code.pick(validate.error, error);
								}
							}
						}
						
						if(error !== "") {
							that.error(this, error);
						} else {
							Js.className.remove(this, "extform-error");
							var errorObject = Js(this).siblings("span.extform-errormessage").first();
							
							if(errorObject.count() == 1) {
								Js.dom.remove(errorObject.fetch());	
							}
						}
						
						for(var i = 0; i < klass.length; i++) {
							if(klass[i].match(/(max|min|exact)\-(\d*)/)) {
								if(!Js.test.isLength(klass[i], this.value.length)) {
									var error = klass[i].split(/\-/);
									that.error(this, "This field require " + error[0] + " of " + error[1] + " characters.", true);
								}
							}
						}
						
						// dump name and value to opt in querystring format ( &name=value )
						if(this.type.toLowerCase().match(/^(checkbox|radio)$/)) {
							if(this.type == "checkbox" && this.checked == true) {
								// only add checked checkbox input
								post += "&" + this.name + "=" + Js.parse.html.to(this.value);
							} else if (this.type == "radio" && this.checked == true) {
								// only add checked radiobox input
								post += "&" + this.name + "=" + Js.parse.html.to(this.value);
							}
						} else { 
							// add all input (except radio/checkbox)
							post += "&" + this.name + "=" + Js.parse.html.to(this.value);
						}
					}
				}
			});
		}
		
		if(Js.code.isset(this.first)) { 
			// there an error, set focus to first invalid field
			this.first.focus();
			// stop form processing
			return false;
		} else {
			return post; // return all field data in querystring formatting
		}
	},
	error: function(field, text, data) {
		// Mark first error occured!
		this.first = (Js.code.isnull(this.first) ? field : this.first);
		
		var field = Js(field);
		var form = Js(this.object);
		var fieldName = field.get("name");
		var fieldErrorId = [form.get("id"), fieldName, "error"].join("-");
		var data = Js.code.pick(data, false);
		var that = this;
		
		if(!Js.code.finds(fieldErrorId)) {
			field.appendClass("jsextform-error").parent().add("span", {"id": fieldErrorId, "class": "extform-errormessage"}).html(text);
			
			field.onchange(function() {
				if(this.value != "") { 
					var node = Js(this).removeClass("extform-error");
					
					var errorNode = node.siblings("span.extform-errormessage").first();
					if(errorNode.count() == 1) {
						Js.dom.remove(errorNode.fetch());
					}
					that.first = null;
				}
			});
		} else if(Js.code.finds(fieldErrorId) && data) {
			field.appendClass("extform-error");
			var errorNode = field.siblings("span.extform-errormessage").first();
			var html = errorNode.html();
			
			if(html.match(text) === false && Js.code.trim(html) != "") {
				errorNode.append(text);
			}
			
			field.onchange(function() {
				if(this.value != "") {
					var node = Js(this).removeClass("extform-error");
					
					var errorNode = node.siblings("span.extform-errormessage").first();
					
					if(errorNode.count() == 1) {
						Js.dom.remove(errorNode.fetch());
					}
					
					that.first = null;
				}
			});
		}
	},
	post: function(js) {
		// form object
		var object = Js.code.pick(js.object, js.node);
		// choose to use object
		var node = Js.code.prepare(object, js.element, "object");
		// add custom field validation
		var custom = Js.code.pick(js.custom, null);
		// onsuccess function
		var onInit = Js.code.pick(js.onSuccess, js.onStart, null);
		// onfaild function
		var onFail = Js.code.pick(js.onFail, null);
		// validate selected form
		var post = this.validate(node, custom);
		// parameters
		var parameter = Js.code.pick(js.parameters, js.params, "");
		
		if(post) {
			// callback to onsuccess function
			if(Js.code.isfunction(onInit)) {
				onInit();
			}
			
			parameter += (Js.code.trim(post) !== "" ? post : "");
			
			// send XHR request
			new Js.ext.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "POST"
			});
			
			return true;
		} else {
			// callback to onfail function
			if(Js.code.isfunction(onFail)) {
				onFail();
			}
			return false;
		}
	},
	get: function(js) {
		// form object
		var object = Js.code.pick(js.object, js.node);
		// choose to use object
		var node = Js.code.prepare(object, js.element, "object");
		// add custom field validation
		var custom = Js.code.pick(js.custom, null);
		// onsuccess function
		var onInit = Js.code.pick(js.onSuccess, js.onStart, null);
		// onfaild function
		var onFail = Js.code.pick(js.onFail, null);
		// validate selected form
		var get = this.validate(node, custom);
		// parameters
		var parameter = Js.code.pick(js.parameters, js.params, "");
		
		if(get) {
			// callback to onsuccess function
			if(Js.code.isfunction(onInit)) {
				onInit();
			}
			
			parameter += (Js.code.trim(get) !== "" ? post : "");
			
			// send XHR request
			new Js.ext.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "GET",
				cache: false
			});
			
			return true;
		} else {
			// callback to onfail function
			if(Js.code.isfunction(onFail)) {
				onFail();
			}
			return false;
		}
	}
};

Js.namespace.include("Form", Js.ext.Form);

Js.ext.include("formErrorMessage", {
	required: "",
	email: "",
	string: "",
	number: ""
});
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Resize
 * Type: Extension
 * Version: 0.5 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, SUI.CSS
 * Optional: Core
 */

Js.ext.include("Resizable", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		var that = this;
		var node = this.object = Js.code.pick(js.object, js.node);
		node.root = Js.code.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) { 
			that.start(e);
		};
		
		node.hmode = Js.code.pick(js.hmode, true);
		node.vmode = Js.code.pick(js.vmode, true);
		node.hswap = Js.code.pick(js.hswap, false);
		node.vswap = Js.code.pick(js.vswap, false);
		node.minX = Js.code.pick(js.minX, null);
		node.minY = Js.code.pick(js.minY, null);
		node.maxX = Js.code.pick(js.maxX, null);
		node.maxY = Js.code.pick(js.maxY, null);
		
		node.root.onResizeStart = new Function();
		node.root.onResizeEnd = new Function();
		node.root.onResize	= new Function();
	},
	clearResize: function() {
		this.object = null;
	},
	start: function(e) {
		var that = this;
		var node = this.object;
		var e = this.fixE(e);
		var height = Js.code.toNumber(Js.style.get(node.root, "height"));
		var width = Js.code.toNumber(Js.style.get(node.root, "width"));
		
		node.root.onResizeStart(width, height);
		node.lastMouseX = e.clientX;
		node.lastMouseY = e.clientY;
		
		node.minMouseX = (node.minX != null ? (e.clientX - x + node.minX) : null);
		node.maxMouseX = (node.maxX != null ? (node.minMouseX + node.maxX - node.minX) : null);
		node.minMouseY = (node.minY != null ? (e.clientY - y + node.minY) : null);
		node.maxMouseY = (node.maxY != null ? (node.minMouseY + node.maxY - node.minY) : null);
		
		document.onmousemove = function(e) {
			that.startResize(e);
		};
		document.onmouseup = function(e) {
			that.stopResize(e);
		};
		
		return false;
	},
	startResize: function(e) {
		var e = this.fixE(e);
		var node = this.object;
		var eHeight = e.clientY;
		var eWidth = e.clientX;
		var height = Js.code.toNumber(Js.style.get(node.root, "height"));
		var width = Js.code.toNumber(Js.style.get(node.root, "width"));
		var nodeWidth = width;
		var nodeHeight = height;
		var newWidth;
		var newHeight;
		
		eWidth = (node.minX != null ? Math.max(eWidth, node.minMouseX) : eWidth);
		eWidth = (node.maxX != null ? Math.min(eWidth, node.maxMouseX) : eWidth);
		eHeight = (node.minY != null ? Math.max(eHeight, node.minMouseY) : eHeight);
		eHeight = (node.maxY != null ? Math.min(eHeight, node.maxMouseY) : eHeight);
		
		newWidth = width + ((eWidth - node.lastMouseX) * (node.hswap ? -1 : 1));
		newHeight = height + ((eHeight - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if(node.hmode) {
			Js.style.set(node.root, "width", (nodeWidth + (newWidth - width)) + "px");
		} else {
			newWidth = width = 0;
		}
		
		if(node.vmode) {
			Js.style.set(node.root, "height", (nodeHeight + (newHeight - height)) + "px");
		} else {
			newHeight = height = 0;
		}
		
		node.lastMouseX = eWidth;
		node.lastMouseY = eHeight;
		node.root.onResize(Math.round(newWidth - width), Math.round(newHeight - height));
		
		return false;
	},
	stopResize: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var data = node.root;
		data.onResizeEnd(Js.code.toNumber(data.style.width), Js.code.toNumber(data.style.height), data);
		node = null;
	},
	fixE: function(e) {
		if(Js.code.isnull(e)) { 
			e = window.event;
		}
		if(Js.code.isnull(e.layerX)) {
			e.layerX = e.offsetX;
		}
		if(Js.code.isnull(e.layerY)) { 
			e.layerY = e.offsetY;
		}
		return e;
	},
	childResize: function(js){
		var parend = js.object;
		var child = js.child;
		
		Js.code.each(child, function() {
			try { 
				Js.style.set(this, "width", (Js.code.toNumber(Js.style.get(this, "width")) + js.width)+"px");
			} catch(e) { /* on failed continue */ }
			
			Js.style.set(this, "height", (Js.code.toNumber(Js.style.get(this, "height")) + js.height)+"px");
		});
	}
};

Js.namespace.include("Resizable", Js.ext.Resizable);

Js.extend('resizable', (function(js, i) {
	var i = Js.code.pick(this.index, i);
	var js = (!js ? {} : js);
		
	this.__PUSH__(function() {
		if(!Js.style.get(this, "width")) {
			var t = Js.ext.dimension.node.offset(this);
			Js.style.setup(this, {"width": t[0]+"px", "height": t[1]+"px", "cursor": "move"});
		}
		js.node = this;
		new Js.ext.Resizable(js);
	}, i);
	return this;
}));
Js.namespace.include("array", Js.base.create({
	ext: Array.prototype,
	value: null,
	__construct: function(value) {
		this._super = value;
		this.value = this._super;
		return this;
	},
	exec: function(data, args) {
		var args = Js.code.toArray(arguments, 1);
		var value = this._super;
		value = new Number(value);
		value = value[data].apply(value, args);
		this.value = this._super = value;
		
		return this;
	},
	append: function(value) {
		this.value[this.value.length] = this._super[this._super.length] = value;
	}
}));
Js.tool.include("Debugger", function() {
	Js.code.debug = true;
	var div = Js.query.create("div#tooldebugger");
	Js.dom.add(div);
		
	var object = Js.query.create("ul");
	Js.dom.add(div, object);
	Js.style.hide(object);
	
	Js.debug.object = object;
	Js.debug.log = function(text) {
		var text = Js.code.trim(text);
		Js.debug.message[Js.debug.message.length] = text;
		
		try {
			console.log(text);	
		} catch(e) { /* do nothing */ }
		
		var li = Js.query.create("li", Js.debug.object);
		Js.dom.addText(li, text);
		
		if(!!Js.widget.loaded("message")) {
			Js.widget.message.add({text: text, type: "error"});	
		}
	};
});Js.namespace.include("number", Js.base.create({
	ext: Number.prototype,
	value: null,
	__construct: function(value) {
		this._super = value;
		this.value = this._super;
		return this;
	},
	exec: function(data, args) {
		var args = Js.code.toArray(arguments, 1);
		var value = this._super;
		value = new Number(value);
		value = value[data].apply(value, args);
		this.value = this._super = value;
		return this;
	}
}));Js.namespace.include("string", Js.base.create({
	ext: String.prototype,
	value: null,
	__construct: function(value) {
		this.value = this._super = value;
		return this;
	},
	exec: function(data, args) {
		var args = Js.code.toArray(arguments, 1);
		var value = this._super;
		value = new String(value);
		value = value[data].call(value, args);
		this.value = this._super = value;
		return this;
	},
	trim: function() {
		this.value = this._super = Js.code.trim(this._super);
		return this;
	},
	htmlEntities: function() {
		this.value = this._super = Js.code.htmlEntities(this._super);
		return this;
	},
	stripTags: function () {
		this.value = this._super = Js.code.stripTags(this._super);
		return this;
	}
}));

/*
['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']
*//*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Util.Anchor
 * Type: Utility/Plug-In
 * Version: 0.1 (alpha-release)
 * Last Updated: 19th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, SUI.JsClass
*/

Js.util.include("ActiveContent", Js.base.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	__construct: function(selector) {
		this.element = Js.code.pick(selector, null);
		
		if(Js.code.isset(this.sel)) {
			this.selector();
			this.check();
		} else {
			var that = this;
			this.interval = window.setInterval(function() {
				that.check();
			}, 100);
		}
	},
	destroy: function() {
		if(Js.code.isset(this.interval)) {
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.element = null;
		this.__destruct();
		return null;
	},
	selector: function() {
		var that = this;
		
		Js(this.element).onclick(function() {
			var href = Js(this).get("href");
			var anchors = (Js.code.isset(href) ? href : this.href);
			
			if(anchors.match(/^\#/)) {
				var ahref = ["", anchors.substr(1)];
			} else { 
				var ahref = anchors.split(/\#/);
			}
			
			if(Js.code.isset(ahref[1])) {
				that.repeat = (ahref[1] === that.last);
				
				that.last = ahref[1];
				var data = ahref[1].split(/\//);
				that.init(data);
			}
		});
	},
	check: function() {
		if(location.hash != this.last && location.hash !== "#") {
			this.last = location.hash;
			
			var data = location.hash.substr(1).split(/\//);
			this.init(data);
		}
	}
}));
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Util.AutoComplete
 * Type: Utility/Plug-In
 * Version: 0.1 (alpha-release)
 * Last Updated: 1st July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: SUI, SUI.Elements
*/

Js.util.include("AutoComplete", function(spec) {
	this.element = null;
	this.name = null;
	this.object = null;
	this.div = null;
	this.type = "single";
	this.method = "GET";
	this.uri = "";
	this.minimum = 3;
	this.value = '';
	this.delay = 10;
	this.matched = [];
	this.separator = ',';
	this.timeout = null;
	this.timeoutId = null;
	this.status = 0;
	
	if(typeof(spec) === "object") {
		this.init(spec);
	}
	
	return this;
}).prototype = {
	init: function(spec) {
		var that = this;
		
		this.element = Js.code.pick(spec.element, this.element);
		this.separator = Js.code.pick(spec.separator, this.separator);
		this.object = Js.code.pick(spec.object, this.object);
		this.minimum = Js.code.pick(spec.minimum, this.minimum);
		this.delay = Js.code.pick(spec.delay, this.delay);
		this.uri = Js.code.pick(spec.uri, this.uri);
		this.type = Js.code.pick(spec.type, this.type);
		
		this.method = ((!!spec.method && !!spec.method.match(/^(get|post)$/gi)) ? spec.method.toUpperCase() : 'GET'); 
		
		if(!!this.element) {
			this.object = Js(this.element);
		} else {
			this.object = Js(this.object);
		}
		
		this.name = this.object.get("name");
		
		this.object.onkeyup(function() {
			if(that.timeoutId) {
				clearTimeout(that.timeoutId);
				that.timeoutId = null;
			}
			that.matched = [];
			
			if(that.type === "multiple") {
				var value = this.value;
				var values = value.split(that.separator);
				var length = values.length;
				var value = Js.code.trim(values[(length - 1)]);
				
				for(var i = 0; i < (length - 1); i++) {
					that.matched[that.matched.length] = Js.code.trim(val[i]);
				}
			} else {
				var value = Js.code.trim(this.value);	
			}
			
			if(value.length > that.minimum && value !== that.value) {
				that.timeoutId = window.setTimeout(function() {
					that.show(value);
				}, that.delay);
			}
		}).onblur(function() {
			that.timeoutId = window.setTimeout((function() {
				that.status = 0;
				that.hide();
			}), 5000);
		});
		
		return this;
	},
	show: function(value) {
		var that = this;
		this.status = 1;
		
		if(!!this.div) {
			Js.dom.remove(this.div.fetch());
			this.div = null;
		}
		this.div = Js("body").first().add("div", {
			"id": ["autocomplete", this.name].join("_"),
			"class": "x-autocomplete"
		}).hide();
		
		var t = Js.ext.dimension.node.offset(this.object.fetch());
		this.div.css({
			"left": t[3] + "px",
			"top": (t[1] + t[2]) + "px",
			"width": t[0] + "px"
		});
		
		new Js.ext.Ajax({
			uri: this.uri,
			method: this.method,
			parameters: "&" + that.name + "=" + value,
			onComplete: (function() {
				that.request(this);
			})
		});
		
		this.value = value;
	},
	hide: function() {
		if(!!this.div && this.status === 0) {
			Js.dom.remove(this.div.fetch());
			this.div = null;
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	},
	request: function(data) {
		var that = this;
		if(data.readyState === 4 && data.status === 200) {
			var text = data.responseText;
			that.div.html("");
			var reply = eval("(" + text + ")");
			var ul = that.div.add("ul");
			
			var arr = Js.code.toArray(reply);
			
			if(arr.length >= 2 || (arr.length === 1 && Js.code.trim(arr[0]) !== "")) {
				Js.code.each(arr, function() {
					if(Js.code.trim(this) !== "") {
						var li = ul.add("li");
						var a = li.add("a", {
							"href": "#"
						}).text(this).onclick(function() {
							clearTimeout(that.ctimeout);
							that.ctimeout = null;
							that.status = 1;
							
							var value = Js(this).html();
							that.matched.push(value);
							that.object.val(that.matched.join(", "));
							that.status = 0;
							that.hide();
							return false;
						});
					}
				});
				
			} else {
				var li = ul.add("li");
				var a = li.add("a", {"href": "#"}).text("No match").onclick(function() {
					that.status = 0;
					that.hide();																	
				}).mouseovers(function() {
					that.status = 0;
					that.hide();
				});
			}
			
			that.div.show("slow").hovers(function() {
				that.status = 1;
				clearTimeout(that.ctimeout);
				that.ctimeout = null;
			}, function() {
				that.status = 1;	
				clearTimeout(that.ctimeout);
				that.ctimeout = null;
			});
			
		}
	}
};
Js.util.include("includer", {
	script: function(src) {
		var head = Js.query.tags("head")[0];
		var script = Js.query.create("script", {
			"type": "text/javascript",
			"src": src
		});
		Js.dom.add(head, script);
	},
	style: function(src, media) {
		var head = Js.query.tags("head")[0];
		var style = Js.query.create("link", {
			"type": "text/css",
			"href": src,
			"media": media
		});
		Js.dom.add(head, style);
	},
	flash: function(src, js) {
		
	}
});/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Util.Ticker
 * Type: Utility/Plug-in
 * Version: 0.1 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core
*/

// Import Plugin
Js.util.include("Ticker", function(selector) {
	// Define Object's properties
	this.element = null;
	this.node = null;
	
	// start __constructor()
	if (!!selector && Js.code.trim(selector) !== "") {
		this.init(selector);
	}
	
	return this;
}).prototype = {
	// Initialize the HTML Element
	init: function(selector) {
		this.element = Js.code.pick(selector, "");
		
		if (Js.code.isset(this.element)) { 
			this.node = Js(this.element);
		}
		
		return this;
	},
	// checked all checkbox
	check: function() {
		// loop all object
		this.node.each(function() {
			// set checked to true
			this.checked = true;
		});
	},
	// uncheck all checkbox
	unCheck: function() {
		// loops all object
		this.node.each(function() { 
			// set checked to false
			this.checked = false;
		});
	},
	// invert checkbox selection
	invert: function() {
		// loops all object
		this.node.each(function() {
			// reverse checkbox selection
			if (this.checked == true) {
				this.checked = false; // uncheck
			} else { 
				this.checked = true; // checked
			}
		});
	}
};
/*
 * Savvy.UI JavaScript Library Extension
 * Name: Calendar
 * Type: Widget
 * Version: 0.7 (alpha-release)
 * Last Updated: 20th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 * History:
 *	Calendar object based from The Strange Zen of JavaScript's How to build a simple calendar with JavaScript:
 *	<http://jszen.blogspot.com/2007/03/how-to-build-simple-calendar-with.html>
*/

Js.widget.include("Calendar", function(js) {
	this.days = ["S", "M", "T", "W", "T", "F", "S"];	
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	this.shortmonths = ["Jan", "Feb", "Mac", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	this.daysinmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	this.field = null;
	this.value = "";
	this.lastdate = null;
	this.fieldtype = "hidden";
	this.type = null;
	this.navigation = null;
	
	this.object	= null;
	this.element = null;
	this.renderTo = null;
	this.calnode = null;
	this.optnode = null;
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
	
	if (js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		this.element = Js.code.prepare(js.object, js.element);
		var regexp = new RegExp(/^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
		this.renderTo = Js.code.pick(js.renderTo, this.renderTo);
		
		if(!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) {
			this.renderTo = Js("body").first().add("div");
		} else if(typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = Js(this.renderTo).first();
		}
		
		js.range = Js.code.pick(js.range, this.range, [null, null]);
		this.field = Js.code.pick(js.field, this.field, "value");
		this.type = Js.code.pick(js.type, this.type, "single");
		
		if(!!js.mindate && regexp.test(js.mindate)) {
			this.mindate = Js.code.pick(js.mindate, null);
		}
		
		if(!!js.maxdate && regexp.test(js.maxdate)) {
			this.maxdate = Js.code.pick(js.maxdate, null);
		}
		
		if(!!js.value && regexp.test(js.value)) {
			var tdate = js.value.split("-");
			js.month = tdate[1];
			js.year = tdate[0];
			js.day = tdate[2];
		} else if(!!js.value && js.value === "today") {
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this.Dates.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this.Dates.getFullYear() : js.year);
		this.day = Js.code.pick(js.day, this.day);
		
		this.date = [this.year, (this.month + 1), Js.code.pick(this.day, 1)].join("-");
		this.onupdate = Js.code.pick(js.onUpdate, null);
		this.navigation = Js.code.pick(js.navigate, true);
		
		if(this.navigation == true) {
			if(!js.range[0] || js.range[0].toLowerCase() == "now") {
				js.range[0] = this.Dates.getFullYear();
			} else if(Js.test.isInteger(js.range[0]) && (js.range[0] > 1000 && js.range[0] < 9999)) {
				js.range[0] = js.range[0];
			} else if(js.range[0].charAt(0) == "-") {
				js.range[0] = (this.Dates.getFullYear() + Js.code.toNumber(js.range[0]));
			} else if(js.range[0].charAt(0) == "+") {
				js.range[0] = (this.Dates.getFullYear() + Js.code.toNumber(js.range[0]));
			}
			
			if(!js.range[1] || js.range[1].toLowerCase() == "now") {
				js.range[1] = this.Dates.getFullYear();
			} else if(Js.test.isInteger(js.range[1]) && (js.range[1] > 1000 && js.range[1] < 9999)) {
				js.range[1] = s_.range[1];
			} else if(js.range[1].charAt(0) == "-") {
				js.range[1] = (this.Dates.getFullYear() + (Js.code.toNumber(js.range[1]) + 0));
			} else if(js.range[1].charAt(0) == "+") {
				js.range[1] = (this.Dates.getFullYear() + Js.code.toNumber(js.range[1]));
			}
			
			if(js.range[0] < js.range[1]) {
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.maxYear(js.range[0]), this.minYear(js.range[1])];
		}
		
		this.drag = Js.code.pick(js.draggable, false);
		this.renderTo.html("");
		this.callback();
		
		return this;
	},
	minYear: function(year) {
		var data = year;
		if(this.mindate) {
			var minDate = this.minDate.split("-");
			var newYear = Js.code.toNumber(minDate[0]);
			
			if(newYear > data) { 
				data = newYear;
			}
		}
		return data;	
	},
	maxYear: function(year) {
		var data = year;
		if(this.maxdate) {
			var maxDate = this.maxdate.split("-");
			var newYear = Js.code.toNumber(maxDate[0]);
			
			if(newYear < data) {
				data = newYear;
			}
		}
		return data;
	},
	prevMonth: function() {
		this.day = null;
		this.Dates = new Date(this.year, (this.month - 1));
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) {
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, (this.month + 1));
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	prevYear: function() {
		this.day = null;
		this.Dates = new Date((this.year - 1), this.month);
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) {
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date((this.year + 1), this.month);
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextMonth: function() {
		this.day = null;
		this.Dates = new Date(this.year, (this.month + 1));
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) {
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, (this.month - 1));
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	nextYear: function() {
		this.day = null;
		this.Dates = new Date((this.year + 1), this.month);
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()){
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date((this.year - 1), this.month);
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	customMonth: function(data) {
		this.day = null;
		this.Dates = new Date(this.year, data);
		var tempMonth = this.Dates.getMonth();
		var tempYear = this.Dates.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if(this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("");
			this.callback();
		}
		return this;
	},
	customYear: function(data) {
		this.day = null;
		this.Dates = new Date(data, this.month);
		var tempMonth = this.Dates.getMonth();
		var tempYear = this.Dates.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if(this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("");
			this.callback();
		}
		return this;
	},
	today: function() {
		this.Dates = new Date();
		this.year = this.Dates.getFullYear();
		this.month = this.Dates.getMonth();
		this.day = this.Dates.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		this.renderTo.html("");
		this.callback();
	},
	validation: function() {
		var data = false;
		var minDate = Js.code.isset(this.mindate);
		var maxDate = Js.code.isset(this.maxdate);
		
		if(minDate && maxDate && this.compare(this.mindate, this.date) && this.compare(this.date, this.maxdate)) {
			data = true;
		} else if(minDate && this.compare(this.mindate, this.date)) {
			data = true;
		} else if(maxDate && this.compare(this.date, this.maxdate)) {
			data = true;
		} else if(!minDate && !maxDate) {
			data = true;
		}
		
		return data;
	},
	dayOfMonth: function(month, year) {
		var month = Js.code.pick(month, this.month);
		var year = Js.code.pick(year, this.year);
		
		if(month == 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			var monthLength = 29;
		}
		
		return Js.code.pick(monthLength, this.daysinmonth[month]);
	},
	compare: function(first, second) {
		var firsts = first.split("-");
		var seconds = second.split("-");
		
		var firstDate = new Date(firstDate[0], (Js.code.toNumber(firstDate[1]) - 1));
		firstDate.setDate(firstDate[2]);
		
		var secondDate = new Date(secondDate[0], (Js.code.toNumber(secondDate[1]) - 1));
		secondDate.setDate(secondDate[2]);
		
		return (secondDate >= firstDate ? true : false);
	},
	updateValue: function(year, month, day) {
		var field = Js("#" + this.element + "_" + year + month + day).first();
		var calendar = Js("#" + this.element + "_" + this.field);
		var months = (month < 10 ? "0" + month : month);
		var days = (day < 10 ? "0" + day : day);
		
		if(this.type == "single") {
			if(!field.hasClass("calendar-day-selected")) {
				if (Js.code.isset(this.lastdate) && Js.code.finds(this.element + "_" + this.lastdate)) {
					var lastdate = Js("#" + this.element + "_" + this.lastdate).set("class", "calendar-day");
				}
				
				field.setClass("calendar-day-selected");
				this.value = [year, months, days].join("-");
				
				calendar.val(this.value);
				this.lastdate = [year, month, day].join("");
			} else {
				field.setClass("calendar-day");
				calendar.val("");
			}
		} else if (this.type == "multiple") {
			var value = calendar.val();
			var values = value.split("|");
			
			if(Js.code.inArray(values, [year, months, days].join("-"))){
				values.splice(values.indexOf([year, months, days].join("-")), 1);
				value = values.join("|");
				
				field.setClass("calendar-day");
				this.value = value;
				calendar.val(this.value);
			} else {
				field.setClass("calendar-day-selected");
				values[values.length] = [year, months, days].join("-");
				this.value = values.join("|");
				calendar.val(this.value);
			}
		}
		
		var fn = this.onupdate;
		if(fn != null && typeof(fn) == "function") {
			Js.code.callback(this, fn);
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
		
		var mtable = this.object = cal.add("table", {
			"id": [this.element, "calendar"].join("-"), 
			"class": "calendar-panel", 
			"cellSpacing": 0, 
			"cellPadding": 0
		}).css("display", "block");
		
		var table = mtable.add("tbody");
		
		var tr1 = table.add("tr");
		var tr2 = table.add("tr");
		var tr3 = table.add("tr");
		
		var th1 = tr1.add("td", {"class": "sui-panel-hl"}).html("&nbsp;");
		var th2 = tr1.add("td", {"class": "sui-panel-header"});
		var th3 = tr1.add("td", {"class": "sui-panel-hr"}).html("&nbsp;");
		
		var prevbtn = th2.add("span");
		var nextbtn = th2.add("span");
		var title = th2.add("span");
		
		var tc1 = tr2.add("td", {"class": "sui-panel-cl"}).html("&nbsp;");
		var tc2 = tr2.add("td", {"class": "sui-panel-container"}).html("&nbsp;");
		var tc3 = tr2.add("td", {"class": "sui-panel-cr"}).html("&nbsp;");
		
		this.calnode = tc2.add("div", {"class": "calendar-content"});
		var con = this.calnode.add("table", {
			"class": "calendar-body", 
			"cellPadding": 0, 
			"cellSpacing": 0
		}).add("tbody");
		
		var contrh = con.add("tr", {"class": "calendar-header"});
		
		for(var i = 0; i <= 6; i++) {
			contrh.add("td").setClass("calendar-header-day").text(this.days[i]);
		}
		
		var day = 1;
		
		for(var i = 0; i < 6; i++) {
			var weeks = con.add("tr", {"class": "calendar-week"});
			
			for(var j = 0; j <= 6; j++) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = weeks.add("td", {"class": "calendar-" + (this.validation() ? "day" : "invalid")});
				
				if(day <= monthLength && (i > 0 || j >= start_day)) {
					days.set("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if(this.validation()) {
						days.onclick(function() {
							var i = Js(this).get("id").split("_");
							var ym = that.year + "" + that.month;
							tday = i[1].substr((ym.length), i[1].length);
							that.updateValue(that.year, (that.month + 1), Js.code.toNumber(tday));  
						});
					}
					
					if(day == this.day) {
						days.setClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + Js.code.toNumber(this.day);
					} 
					
					days.css("cursor", "pointer");
					
					days.html(day.toString());
					day++;
				} else {
					days.html("&nbsp;").setClass("calendar-invalid");
				}
			}
			
			if(day > monthLength) {
				break;
			}
		}
		
		var tf1 = tr3.add("td", {"class": "sui-panel-fl"}).html("&nbsp;");
		var tf2 = tr3.add("td", {"class": "sui-panel-footer"}).html("&nbsp;");
		var tf3 = tr3.add("td", {"class": "sui-panel-fr"}).html("&nbsp;");
		
		if(this.navigation == true) {
			prevbtn.setClass("prev-month").html("&nbsp;").onclick(function() {
				that.prevMonth();															  
			});
			
			nextbtn.setClass("next-month").html("&nbsp;").onclick(function() {
				that.nextMonth();
			});
			var divmon = this.optnode = tc2.add("div", {"class": "calendar-content-selector"});
			
			divmon.add("p").text("Select a specific combination of month and year");
			
			var selmonth = divmon.add("select", {"name": "month"}).onchange(function() {
				that.customMonth(this.value);							
			});
			
			for(var i = 0; i < 12; i++) {
				if(this.month == i) {
					selmonth.add("option", {"value": i, "selected": "selected"}).text(this.months[i]);
				} else {
					selmonth.add("option", {"value": i}).text(this.months[i]);
				}
			}
			
			var selyear = divmon.text(" ").add("select", {"name": "year"}).onchange(function() {
				that.customYear(this.value);									
			});
			
			for(var i = this.range[0]; i >= this.range[1]; i--) {
				if(this.year == i) {
					selyear.add("option", {"value": i, "selected": "selected"}).text(i.toString());
				} else { 
					selyear.add("option", {"value": i}).text(i.toString());
				}
			}
			
			var ps = divmon.add("p").text("Select ");
			ps.add("input", {
				"type": "button", 
				"value": "Today", 
				"name": "today"
			}).onclick(function() {
				that.today();													
			});
			
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
			Js.hash.set(this.element, "toggle", 1);
			
			title.css("cursor", "pointer").onclick(function() {
				var i = Js.hash.get(that.element, "toggle");
				
				if(i === 1) {
					that.calnode.css("display", "none");
					that.optnode.css("display", "block");
					
					Js.hash.set(that.element, "toggle", 0);
				} else {
					that.optnode.css("display", "none");
					that.calnode.css("display", "block");
					
					Js.hash.set(that.element, "toggle", 1);
				}
			});
		} else {
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (Js.code.isset(this.field)) {
			var input = tf2.add("input", {
				"id": [this.element, this.field].join("-"),
				"name": this.field,
				"type": this.fieldtype
			});
			
			if (Js.code.isset(this.day)) {
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastdate = [this.year, (this.month + 1), Js.code.toNumber(this.day)].join("");
			}
		}
		return this;
	}
};

Js.util.include("Calendar", Js.widget.Calendar);
/*
 * Savvy.UI JavaScript Library Application
 * Name: DropMenu
 * Type: Utility/Plug-In
 * Version: 0.5 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
*/

Js.widget.include("DropMenu", function(selector) {
	this.object = null;
	this.node = null;
	this.lastnode = null;
	this.content = null;
	this.child = null;
	this.status = 0;
	
	if (!!selector && typeof(selector) === "string") {
		this.init(selector);
	}
	
	return this;
}).prototype = {
	init: function(selector) {
		if (!!selector && Js.code.trim(selector) !== "") {
			var that = this;
			this.object = Js(selector);
			var mList = Js(selector + " ul > li > a");
			
			mList.each(function() {
				Js(this).hovers(function() {
					that.node = this.parentNode;
					that.show(selector, this.parentNode);
				}, function() {
					that.status = 0;
					setTimeout((function() { 
						that.hide(selector);
					}), 5);
				}).done();
			});
		}
		return this;
	},
	show: function(sel, node) {
		var that = this;
		var sUL = Js("> ul", node);
		
		if(sUL.count() > 0) {
			this.status = 1;
			var t = Js.ext.dimension.node.offset(node);
			
			if(Js.code.finds([sel,"menucontainer"].join("_")) && Js.code.isset(this.child)) {
				if(Js.code.isset(this.lastnode)) {
					Js(this.lastnode).insert(this.content);
					this.lastnode = null;
				}
				
				Js.dom.remove(this.child.first().fetch());
				this.child = null;
			}
			
			this.child = Js("body").add("div").css("visibility", "hidden").alpha(0);
			this.child.setup({
				"id": [sel, "menucontainer"].join("_"),
				"class": "menu"
			});
			
			this.content = sUL.first().fetch();
			
			var text = "<ul>" + this.content.innerHTML + "</ul>";
			
			if (this.child.html() != text) {
				this.child.insert(this.content);
				var h = this.child.fetch().offsetHeight;
				
				this.child.css({
					"left": t[3] + "px",
					"top": (t[1] + t[2] - 4) + "px",
					"height": "0px"
				}).fx({
					method: "fade",
					transaction: [0, 97],
					ease: 1.3,
					step: 40,
					shutter: 40
				}).syncFx({
					method: "resizeHeight",
					transaction: [0, h],
					ease: 0.9,
					step: 100,
					shutter: 20
				});
				
			}
			this.lastnode = node;
			
			this.child.hovers(function() {
				that.status = 1;
				that.node = node;
			}, function() {
				if(Js.code.finds([sel, "menucontainer"].join("_"))) {
					that.status = 0;
					setTimeout((function() {
						that.hide(sel);
					}), 5);
				}
			}).done();
		}
		sUL.done();
	},
	hide: function(sel) {
		if(this.status == 0) {
			if(Js.code.isset([sel, "menucontainer"].join("_")) && Js.code.isset(this.child)) {
				if(Js.code.isset(this.lastnode)) {
					Js(this.lastnode).insert(this.content).done();
					this.lastnode = null;
				}
				
				Js.dom.remove(this.child.first().fetch());
				this.child = null;
			}
		}
	}
};

Js.util.include("DropMenu", Js.widget.DropMenu);
/*
 * Savvy.UI JavaScript Library Application
 * Name: message
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
*/

Js.widget.include("message", {
	node: null,
	add: function(spec) {
		if(Js.code.isnull(this.node)) {
			this.init();
		}
		
		var that = this;
		var text = Js.code.pick(spec.text, "");
		var timeout = Js.code.pick(spec.timeout, 5000);
		var type = Js.code.pick(spec.type, "note");
		var closable = Js.code.pick(spec.closable, true);
		
		timeout = (Js.test.isInteger(timeout) ? timeout : 5000);
		
		(function() {
			var div = that.node.add("div", {"class": "sui-messagebox"}).css("margin", "2px 0px").hide();
			
			if(!!closable) {
				var span = div.add("span", {"class": "sui-messagebox-close"}).text("x");
			}
			
			var p = div.add("p").text(text);
			var t = setTimeout(function() {
				div.remove(span.fetch());
				div.remove(p.fetch());
				div.hide("slow");
			}, timeout);
			
			if(!!closable) {
				span.onclick(function() {
					clearTimeout(t);
					t = null;
					div.remove(span.fetch());
					div.remove(p.fetch());
					div.hide("slow");
				});
			}
			div.appendClass(type);
			div.show("slow");
		})();
	},
	init: function() {
		this.node = Js("body").first().add("div", {"id": "sui-message"}).show();
	}
});
/*
 * Savvy.UI JavaScript Library Extension
 * Name: Panel
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, Js.ext.Resizable
*/

Js.widget.include("Panel", function(js) {
	// Declare Object's properties
	this.object = null;
	this.node = null;
	this.header = null;
	this.content = null;
	this.footer = null;
	this.renderTo = null;
	this.element = "";
	this.title = "Untitled Panel";
	this.width = 300;
	this.height = 300;
	this.minWidth = 100;
	this.minHeight = 200;
	this.layout = "sui-panel";
	this.onclose = null;
	this.scrolling = true;
	this.allowClose = true;
	this.allowMinimize = false;
	this.allowResize = false;
	this.css = "";
	
	// Start __constructor()
	if (js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		var that = this;
		// Set Object's properties value for usage
		this.width = Js.code.pick(js.width, this.width);
		this.height = Js.code.pick(js.height, this.height);
		this.layout = Js.code.pick(js.layout, this.layout);
		this.title = Js.code.pick(js.title, this.title);
		this.renderTo = Js.code.pick(js.renderTo, this.renderTo);
		this.allowClose = Js.code.pick(js.allowClose, this.allowClose);
		this.allowMinimize = Js.code.pick(js.allowMinimize, this.allowMinimize);
		this.allowResize = Js.code.pick(js.allowResize, this.allowResize);
		this.scrolling = Js.code.pick(js.scrolling, this.scrolling);
		this.css = Js.code.pick(js.css, this.css);
		this.onclose = Js.code.pick(js.onClose, null);
		
		// set renderTo DOM.Element
		if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = Js("body").first();
		} else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = Js(this.renderTo).first();
		}
		// define TABLE id attribute
		var el = this.element = js.element;
		
		// render TABLE DOM.Element, hide the TABLE
		this.object = this.renderTo.add("table", {
			"id": el + "_win", 
			"cellSpacing": "0", 
			"cellPadding": "0",	
			"class": this.layout
		}).hide();
		
		this.renderTo.done();
		
		// set TABLE width
		if (Js.code.isset(this.width)) {
			this.object.css("width", this.width + "px");
		}
		
		// set TABLE height
		if (Js.code.isset(this.height)) {
			this.object.css("height", this.height + "px");
		}
		
		// render TBODY DOM.Element 
		var tbody = this.object.add("tbody");
		
		// render header TR DOM.Element
		var tr1 = tbody.add("tr");
		// render content TR DOM.Element
		var tr2 = tbody.add("tr");
		// render footer TR DOM.Element
		var tr3 = tbody.add("tr");
		
		tbody.done();
		
		// render header TD-left DOM.Element
		var th1 = tr1.add("td", {"class": this.layout + "-hl"}).html("&nbsp;").set("width", "7px");
		// render header TD-content DOM.Element
		var th2 = tr1.add("td", {"class": this.layout + "-header"}).css({
			"height": "22px", 
			"width": (this.width - 15) + "px"
		});
		// render header TD-right DOM.Element
		var th3 = tr1.add("td", {"class": this.layout + "-hr"}).html("&nbsp;").set("width", "8px");
		// render header container DOM.Element
		var ext = th2.add("div", {"class": this.layout + "-ext"}).css({
			"cssFloat": "right", 
			"overflow": "hidden", 
			"width": "28px", 
			"height": "20px", 
			"textAlign": "right"
		});
		// render header title DOM.Element
		var title = th2.add("div", {"class": this.layout + "-title"}).text(this.title).css({
			"overflow": "hidden", 
			"height": "20px"
		});
		// render Close-Button DOM.Element 
		var tclose = ext.add("span").html("&nbsp;").set("width", "14px").css("display", "none");
		// render Minimize-Button DOM.Element
		var tmin = ext.add("span").html("&nbsp;").set("width", "14px").css("display", "none");
		
		// Enable Minimize-Button option
		if (!!this.allowMinimize) {
			tmin.setClass(this.layout + "-min").css({
				"display": "block", 
				"cursor": "pointer"
			});
		} else {
			tmin.setClass(this.layout + "-disabled");
		}
		
		// Enable Close-Button option
		if (!!this.allowClose) {
			tclose.setClass(this.layout + "-close").css({
				"display": "block",
				"cursor": "pointer"
			}).onclick(function() {
				that.closePanel();
			});
		} else { 
			tclose.setClass(this.layout + "-disabled");
		}
		
		tmin.done();
		tclose.done();
		title.done();
		ext.done();
		
		// render content TD-left DOM.Element
		var tc1 = tr2.add("td", {"class": this.layout + "-cl"}).html("&nbsp;");
		// render content TD-content DOM.Element
		var tc2 = tr2.add("td", {"class": this.layout + "-container"}).css({
			"padding": "5px", 
			"width": (this.width - 15) + "px"
		}).html("");
		// render content TD-right DOM.Element
		var tc3 = tr2.add("td", {"class": this.layout + "-cr"}).html("&nbsp;");
		
		// render content CONTAINER DOM.Element
		// THIS IS WHERE YOUR CONTAIN SHOULD GO
		this.node = tc2.add("div", {
			"id": el, 
			"class": this.layout + "-content"
		}).css("cssText", this.css);
		
		// set height and scrolling option for content CONTAINER
		if(Js.code.isset(this.height) && !!this.scrolling) {
			this.node.css({
				"height": (this.height - (23 + 11)) + "px",
				"overflow": "auto"
			});
		}
		
		// render footer TD-left DOM.Element
		var tf1 = tr3.add("td", {"class": this.layout + "-fl"}).html("&nbsp;");
		// render footer TD-content DOM.Element
		var tf2 = tr3.add("td", {"class": this.layout + "-footer"}).html("&nbsp;").css("width", (this.width - 15) + "px");
		// render footer TD-right DOM.Element
		var tf3 = tr3.add("td", {"class": this.layout + "-fr"}).html("&nbsp;");
		
		// extends DOM.Elements as Object's properties
		this.header = th2;
		this.content = tc2;
		this.footer = tf2;
		
		tr1.done();
		tr2.done();
		tr3.done();
		
		// Enable Resizing option
		if (!!this.allowResize) {
			// enable right (vertical only) resizing
			new Js.ext.Resizable({
				object: tf2.fetch(),
				objectRoot: that.object.fetch(),
				hmode: false
			});
			// enable bottom (horizontal only) resizing
			new Js.ext.Resizable({
				object: tc3.fetch(),
				objectRoot: that.object.fetch(),
				vmode: false
			});
			// enable bottom-right resizing
			new Js.ext.Resizable({
				object: tf3.fetch(),
				objectRoot: that.object.fetch()
			});
			// change button to look more like resize
			tc3.css("cursor", "e-resize");
			tf2.css("cursor", "n-resize");
			tf3.css("cursor", "se-resize");
			
			// onResize function help maintain TABLE child width and height size
			that.object.fetch().onResize = function(x, y) {
				that.width = that.width + x;
				that.height = that.height + y;
				Js(that).css("width", that.width + "px");
				Js(that).css("height", that.height + "px");
				that.header.css("width", (that.width - 15) + "px");
				that.content.css("width", (that.width - 15) + "px");
				that.footer.css("width", (that.width - 15) + "px");
				that.fixResize();
			};
		}
		// make the TABLE visible
		this.object.show().css("display", "block");
		
		return this;
	},
	closePanel: function() {
		// callback to close panel
		var fn = this.onclose;
		if (Js.code.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		this.object.done();
		return this;
	},
	fixResize: function() {
		if(Js.code.isset(this.height) && !!this.scrolling) {
			this.node.css({
				"height": (this.height - (23 + 11)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: SimpleTab
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core
*/

Js.widget.include("SimpleTab", function(sel) {
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.object = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	
	// start __constructor()
	if(Js.code.typeOf(sel) === "object" || Js.code.typeOf(sel) === "string") {
		this.init(sel);
	}
	
	return this;
}).prototype = {
	init: function(sel) {
		var that = this;
		this.object = Js(sel);
		this.object.setClass("simpletab-container");
		this.element = this.object.first().get("id");
		
		var child = this.object.has("div.x-simpletab-panel");
		var h = window.location.hash;
		
		if(h.match(/^#(.+)/)) {
			var hashtab = this.object.has(h);
			if(hashtab.count() > 0) {
				this.activeTab = hashtab;
			} else {
				this.activeTab = Js(child.first().fetch());
			}
		} else {
			this.activeTab = Js(child.first().fetch());
		}
		
		this.addToolbar(this.element);
		
		child.each(function() {
			that.addHeader(this);
			Js(this).setClass("simpletab-hidden");			
		});
			
		this.activeHeader = Js("a[href=#" + this.activeTab.get("id") + "]");
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
	},
	makeActive: function(hash) {
		
	},
	addTab: function(spec) {
		var that = this;
		if(!!spec.id && Js.code.typeOf(spec.id) === "string") {
			var title = Js.code.pick(spec.title, "Untitled");
			var id = spec.id;
			var content = Js.code.pick(spec.content, "");
			var closable = Js.code.pick(spec.closable, false);
			var set = Js.code.pick(spec.activate, false);
			
			var obj = this.object.add("div", {"id": id, "class": "simpletab-hidden"}).html(content);
			var li = this.header.add("li");
			var a = li.add("a", {
				"href": "#" + id,
				"title": title
			});
			a.add("em");
			a.text(title).onclick(function() {
				that.activate(this);
			});
			
			if (!!closable) {
				a.add("span").css("paddingLeft", "10px").text("x").onclick(function() { // clicks to mouseovers
					var href = Js(this.parentNode).get("href");
					that.activeHeader.setClass("").done();
					that.activeTab.setClass("simpletab-hidden").done();
					that.object.remove(Js(href).fetch());
					Js.dom.remove(this.parentNode.parentNode);
					
				});
			}
			if(!!set) {
				this.activate(obj);
			}
		}
		return this;
	},
	addToolbar: function(el) {
		div = Js("body").first().add("div", {
			"class": "simpletab-toolbar-container",
			"id": this.element + "toolbar"
		});
		
		Js.dom.addBefore(div.fetch(), this.object.fetch());
		this.toolbar = div;
		
		this.header = this.toolbar.add("ul", {
			"id": [el, "toolbar"].join("-"),
			"class": "simpletab-toolbar"
		});
		var div2 = div.add("div").css("display", "block");
	},
	activate: function(obj) {
		var that = this;
		this.activeHeader.setClass("");
		this.activeTab.setClass("simpletab-hidden");
		
		this.activeHeader = Js(obj);
		var href = this.activeHeader.get("href");
		this.activeTab = Js(href);
		
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
		window.location.hash = href;
	},
	revert: function() {
		var activecon = this.header.has("li > a");
		if(activecon.count() > 0) {
			this.activate(activecon.first().fetch());
		}
	},
	addHeader: function(obj) {
		var that = this;
		var obj = Js(obj);
		var title = obj.get("title");
		var closable = obj.hasClass("tab-closable");
		
		var li = this.header.insertion("li");
		
		var a = li.add("a", {
			"href": "#" + obj.get("id"),
			"title": title
		});
		
		a.add("em");
		a.text(title).onclick(function() {
			that.activate(this);
		});
		
		if(!!closable) {
			a.add("span").css("paddingLeft", "10px").text("x").onclick(function() {
				var my = Js(this.parentNode).onclick(function() { 
					return false; 
				});
				
				var href = my.get("href");
				that.activeHeader.setClass("").done();
				that.activeTab.setClass("simpletab-hidden").done();
				that.object.remove(Js(href).fetch());
				Js.dom.remove(this.parentNode.parentNode);
				
				that.revert();
			});
		}
	}
};

// Backward Compatiblity
Js.util.include("SimpleTab", Js.widget.SimpleTab);
/*
 * Savvy.UI JavaScript Library Widget
 * Name: Toggler
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 3rd July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
 */

Js.widget.include("Toggler", function(js) {
	this.button = null;
	this.container = null;
	this.content = null;
	
	this.buttonc = null;
	this.containerc = null;
	this.contentc = null;
	
	if(Js.code.isset(js) && typeof(js) == "object") {
		this.init(js);
	}
		
	return this;
}).prototype = {
	init: function(js) {
		var that = this;
		
		var button = this.button = js.button;
		var container = this.container = js.container;
		var content = this.content = js.content;
		
		if(Js.code.isset(button) && Js.code.isset(container) && Js.code.isset(content)) {
			Js(button).onclick(function() {
				var dwl = Js(container).first();
				var stack = Js(content).first();
				var button = Js(this).first();
				
				if(!button.getHash("done") || button.getHash("done") == "no") {
					dwl.fx({
						method:"resizeHeight",
						type:"height",
						transaction:[0, stack.fetch().scrollHeight]
					});
					
					button.setHash("done", "yes");
				} else if(button.getHash("done") == "yes") {
					dwl.fx({
						method:"resizeHeight",
						type:"height",
						transaction:[stack.fetch().scrollHeight, 0]
					});
					
					button.setHash("done", "no");
				}
				
				return false;
			});
		}
	}
};

// Backward Compatibility
Js.util.include("Toggler", Js.widget.Toggler);
/*
 * Savvy.UI JavaScript Library Extension
 * Name: WinPanel
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, Js.widget.Panel, Js.ext.Draggable, SUI.Ext.Resize
*/

Js.widget.include("WinPanel", function(js) {
	// Declare Object's properties
	this.panel = null;
	this.element = null;
	this.zindex = 100;
	this.allowDrag = false;
	this.autoFocus = true;
	this.status = "";
	this.node = null;
	this.object = null;
	this.initialize = false;
	this.onclose = null;
	
	// Declare constant
	Js.widget.WinPanel.nodes;
	Js.widget.WinPanel.zindex;
	
	// start __constructor()
	if (js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		var that = this;
		
		if (!this.initialize) {
			this.initialize = true;
			Js.widget.WinPanel.zindex = Js.code.pick(Js.widget.WinPanel.zindex, 101);
			
			var elem = this.element = js.element + "_win";
			Js.widget.WinPanel.nodes = Js.code.pick(Js.widget.WinPanel.nodes, []);
			Js.widget.WinPanel.nodes.push(elem);
			
			this.zindex = Js.code.pick(js.zindex, ++Js.widget.WinPanel.zindex);
			this.autoFocus = Js.code.pick(js.autoFocus, this.autoFocus);
			this.allowDrag = Js.code.pick(js.allowDrag, this.allowDrag);
			this.onclose = Js.code.pick(js.onClose, this.onclose);
			js.onclose = null;
			
			if(this.allowDrag) { 
				js.scrolling = true;
			}
			
			this.panel = new Js.widget.Panel(js);
			this.node = this.panel.node;
			this.object = this.panel.object;
			this.object.hide();
			
			if (!!this.autoFocus) {
				this.object.onclick(function() {
					var m = Js(this).first();
					m.css("alpha", 100);
					
					if (!m.getStyle("zIndex") || m.getStyle("zIndex") < Js.widget.WinPanel.zindex) {
						++Js.widget.WinPanel.zindex;
						m.css("zIndex", Js.widget.WinPanel.zindex);
					}
					
					for (var i = 0; i < Js.widget.WinPanel.nodes.length; i++) {
						if (Js.widget.WinPanel.nodes[i] != that.element) 
							Js("#" + Js.widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				});
				
				for (var i = 0; i < Js.widget.WinPanel.nodes.length; i++) {
					if (Js.widget.WinPanel.nodes[i] != that.element) {
						Js("#" + Js.widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				}
			} else {
				this.object.css("zIndex", this.zindex);
			}
			
			var doc = document.body;
			var hW = Js.code.toNumber(doc.offsetWidth);
			var hH = Js.code.toNumber(doc.offsetHeight);
			var oW = this.panel.width;
			var oH = this.panel.height;
			var sXY = Js.ext.dimension.page.scrolls.xy();
			var center = Js.ext.dimension.page.middle(oW, oH);
			var xS = center[1];
			var yS = center[0];
			xS = (xS < 0 ? 0 : xS);
			yS = (yS < 0 ? 0 : yS);
			
			if (!!this.allowDrag) {
				try {
					new Js.ext.Draggable({
						node: that.panel.header.fetch(),
						nodeRoot: that.panel.object.fetch()
					});
					
					that.panel.header.css("cursor", "move");
				} catch(e) {
					Js.debug.log("Js.widget.WinPanel.Initialize error at DRAG: " + e);
				}
			}
			
			this.object.show();
			this.status = "Loaded";
			
			if(this.autoFocus == true) {
				this.makeActive();
			}
			
			this.object.css({"position": "absolute", "top": yS + "px", "left": xS + "px"});
		}
		return this;
	},
	makeActive: function() {
		++Js.widget.WinPanel.zindex;
		this.object.css("zIndex", Js.widget.WinPanel.zindex);
	},
	closePanel: function() {
		var fn = this.onclose;
		if (Js.code.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		
		try {
			this.object = null;
			this.element = null;
			var arrays = Js.widget.WinPanel.nodes;
			var deindex = Js.code.indexOf(arrays, this.element);
			arrays.splice(deindex, 1);
			Js.widget.WinPanel.nodes = arrays;
		} catch(e) { }
		return this;
	}
};
