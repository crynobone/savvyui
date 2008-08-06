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
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Attr
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base
 */
 
SUI.namespace.include("Attr", {
	// Set Attribute value for an Element
	Set: function(node, attr, value) {
		var attr = SUI.fn.trim(attr.toLowerCase());
		
		if(this.__FN__(node, "Set")) {
			if(attr == "class") { 
				// set class (using SUI.Classes Namespace)
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
	Get: function(node, attr) {
		var attr = SUI.fn.trim(attr.toLowerCase());
		var value = false;
		
		if(this.__FN__(node, "Get")) {
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
	Remove: function(node, attr) {
		var attr = SUI.fn.trim(attr.toLowerCase());
		
		if(this.__FN__(node, "Remove")) {
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
	Setup: function(node, data) {
		// Get the HTML Element
		var node = node;
		// Get JSON attributes
		var data = SUI.fn.pick(data, []);
		
		if(SUI.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		// Using loops, but usually there just one.
		for(var i = 0; i < data.length; i++) {
			// loop the Object
			var object = data[i];
			
			for(var value in object) {
				// trim and ensure val's value is lowercased
				value = SUI.fn.trim(value.toLowerCase());
				
				if(value != "class") {
					if(object.hasOwnProperty(value)) {
						SUI.Attr.Set(node, value, object[value]);
					}
				} else {
					SUI.Classes.Set(node, object[value]);
				}
			}
		};
	},
	// Check whether HTML element is valid
	__FN__: function(node, from) {
		if(!node || !node.nodeType || node.nodeType !== 1) {
			SUI.fn.logger("SUI.Attr." + from + " failed: Object " + node + " is null");
			return false;
		} else { 
			return true;
		}
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Classes
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base
 */
 
SUI.namespace.include("Classes", {
	Set: function(node, value) {
		if(this.__FN__(node, "Set")) {
			node.className = value;
			return node;
		} else {
			return false;
		}
	},
	Append: function(node, value) {
		if(this.__FN__(node, "Append")) {
			var klasName = node.className;
			try {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != "") {
				var klass = SUI.fn.trim(klasName).split(/\s/g);
				klass[klass.length] = SUI.fn.trim(value);
				klass = SUI.fn.unique(klass);
				value = klass.join(" ");
			} else {
				value = value;	
			}
			node.className = value;
			
			} catch(e) {
				console.log(e);	
			}
		}
	},
	Get: function(node) {
		if(this.__FN__(node, "Get")) {
			// get the className value
			return node.className;
		} else { 
			// HTML Element isn't defined
			return false;
		}
	},
	Has: function(node, value) {
		var klasName = node.className;
		var value = SUI.fn.trim(value);
		
		if(this.__FN__(node, "Has")) {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != "") {
				return SUI.fn.inArray(klasName.split(/\s/), value);
			} else { 
				return false;
			}
		} else {
			return false;
		}
	},
	Remove: function(node, value) {
		var klasName = node.className;
		
		if(this.__FN__(node, "Empty")) {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != ""){
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
	Empty: function(node) {
		if(this.__FN__(node, "Empty")) { 
			node.className = "";
		} else {
			return false;
		}
	},
	__FN__: function(node, from) {
		if(!node || !node.nodeType || node.nodeType !== 1) {
			SUI.fn.logger("SUI.Classes." + from + " failed: Object " + node + " is null");
			return false;
		} else {
			return true;
		}
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Dimension
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base
 * Optional: SUI.Ext.Animator
 */
 
SUI.namespace.include("CSS", {
	Set: function(node, data, value) {
		var data = SUI.fn.trim(data);
		var val = SUI.fn.trim(value);
		
		if (this.__FN__(node, "Set")) {
			try {
				node.style[data] = value; 
				return node;
			} catch(e) { 
				SUI.fn.logger("SUI.CSS.Set failed: " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	Setup: function(node, js) {
		var node = node;
		var data = SUI.fn.pick(js, []);
		
		if(SUI.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			
			for (var value in obj) {
				value = SUI.fn.trim(value);
				
				if (obj.hasOwnProperty(value)) {
					SUI.CSS.Set(node, value, obj[value]);
				}
			}
		};
		return node;
	},
	Get: function(node, data) {
		var data = SUI.fn.trim(data);
		
		if (this.__FN__(node, "Get")) {
			try {
				return node.style[data];
			} catch(e) {
				SUI.fn.logger("SUI.CSS.Get failed: " + node + " " + data + " " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	Alpha: function(node, value) {
		var value = (value > 100 ? 100 : (value < 0 ? 0 : value));
		
		if (SUI.fn.isset(node)) {
			try {
				if (value == 0 && this.Get(node, "visibility") != "hidden") {
					this.Hide(node);
				} else if (value > 0 && this.Get(node, "visibility") == "hidden") {
					this.Show(node);
				}
				
				if (SUI.fn.behaviour.ie == true) {
					if (!node.currentStyle || !node.currentStyle.hasLayout) {
						this.Set(node, "zoom", 1);
					}
					
					this.Set(node, "filter", "alpha(opacity=" + value + ")");
				} else {
					this.Set(node, "opacity", (value / 100));
					this.Set(node, "MozOpacity", (value / 100));
				}
			} catch(e) { 
				SUI.logger("SUI.CSS.Alpha() failed: " + e); 
			}
		} else return false
	},
	Png: function(node, uri, js) {
		var node = node;
		var uri = uri;
		var gecko = SUI.fn.pick(js.gecko, "");
		var ie = SUI.fn.pick(js.ie, "scale");
		
		ie = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + uri + "',sizingMethod='" + ie + "')";
		gecko = "url('" + uri + "') " + gecko;
		
		if (window.ActiveXObject && (SUI.fn.behaviour.ie && !SUI.fn.behaviour.ie7)) {
			this.Set(node, "filter", ie);
		} else {
			this.Set(node, "background", gecko);
		}
		
		return node;
	},
	Show: function(node, fx) {
		var ani = true;
		
		if (this.__FN__(node, "Show")) {
			try {
				ani = this.__FX__(node, fx, "show");
				
				if(!ani) {
					this.Set(node, "visibility", "visible");
				}
				return node;
			} catch(e) {
				SUI.fn.logger("SUI.CSS.Show failed: " + e);
				return false;
			}
		} else return false;
	},
	Hide: function(node, fx) {
		var ani = true;
		
		if (this.__FN__(node, "Hide")) {
			try {
				ani = this.__FX__(node, fx, "hide");
				
				if (!ani) {
					this.Set(node, "visibility", "hidden");
				}
				return node;
			} catch(e) {
				SUI.fn.logger("SUI.CSS.Hide failed: " + e);
				return false;
			}
		} else return false;
	},
	__FX__: function(node, fx, value) {
		var fx = (SUI.fn.isset(fx) && fx.match(/(fast|slow)/g) ? fx : false);
		var id = SUI.Attr.Get(node, "id");
		var data = [20, 0.8, 80];
		var value = (value.match(/^(show|hide)$/) ? value : 'show');
		var fade = (value == "show" ? [0, 100] : [100, 0]);
		
		if (SUI.Ext.require("Animator") && !!fx) {
			if (fx == "slow") {
				data[0] = 60;
				data[1] = 1.5;
				data[2] = 40;
			} else if (!fx) {
				return false;
			}
			var anim = new SUI.Ext.Animator;
			anim.Initialize(node).Fx({
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
	},
	__FN__: function(node, from) {
		if (!node || !node.nodeType || node.nodeType !== 1) {
			SUI.fn.logger("SUI.CSS." + from + " failed: Object " + node + " is null");
			return false;
		} else { 
			return true;
		}
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Dimension
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */

SUI.namespace.include("Dimension", {
	// Get scrolled value of a page
	Page: {
		Scroll: {
			X: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
				
				if(typeof(offset) == "number") {
					ret = offset;
				} else if(doc && doc.scrollLeft) {
					ret = doc.scrollLeft;
				} else if(el && el.scrollLeft) {
					ret = el.scrollLeft;	
				}
				return ret;
			},
			Y: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if(typeof(offset) == "number") {
					ret = offset;
				} else if(doc && doc.scrollTop) {
					ret = doc.scrollLeft;
				} else if(el && el.scrollTop) {
					ret = el.scrollLeft;
				}
				return ret;
			},
			XY: function() {
				var ret = [0, 0];
				ret[0] = SUI.Dimension.Page.Scroll.X();
				ret[1] = SUI.Dimension.Page.Scroll.Y();
				
				return ret;
			}
		},
		Size: {
			Width: function() {
				
			},
			Height: function() {
				
			}
		},
		Center: function(width, height) {
			var doc = document.body;
			var offset = [SUI.fn.toNumber(doc.offsetWidth), SUI.fn.toNumber(doc.offsetHeight)];
			var axis = SUI.Dimension.Page.Scroll.XY();
			var ret = [];
				
			ret[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
			ret[1] = Math.round((((screen.height - 200) - height) / 2) + axis[1]);
			ret[0] = (ret[0] < 0 ? 0 : ret[0]);
			ret[1] = (ret[1] < 0 ? 0 : ret[1]);	
			ret.reverse();
			
			return ret;
		}
	},
	Node: {
		Scroll: {},
		Size: {},
		Offset: function(node) {
			var ret = [0, 0, 0, 0];
			var loop = false;
			
			if(SUI.fn.isset(node)) {
				if(node.offsetParent) {
					loop = true;
					ret[0] = node.offsetWidth;
					ret[1] = node.offsetHeight;
					
					while(node.offsetParent) {
						ret[2] += node.offsetTop;
						ret[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				} else {
					if(loop == false) {
						ret[0] = SUI.fn.pick(node.scrollWidth, 0);
						ret[1] = SUI.fn.pick(node.scrollHeight, 0);
						ret[2] = SUI.fn.pick(node.offsetTop, 0);
						ret[3] = SUI.fn.pick(node.offsetLeft, 0);
					}
				}
				return ret;
			} else {
				SUI.fn.logger("SUI.Dimension.Node.Offset error : " + node + " does not exist");
				return ret;
			}
		}
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.DOM
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("DOM", {
	Add: function(parent, child) {
		if (!SUI.fn.isset(child)) {
			var child = parent;
			var parent = document.body;
		}
		
		try {
			parent.appendChild(child);
			return parent;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.Add failed: " + e);
			return false;
		}
	},
	AddText: function(parent, text) {
		if (SUI.fn.isset(parent)) {
			return this.Add(parent, document.createTextNode(text));
		} else {
			SUI.fn.logger("SUI.DOM.AddText failed: " + e);
			return false;
		}
	},
	AddBefore: function(args) {
		var args = SUI.fn.toArray(arguments);
		var parent = null;
		var child = null;
		var reference = null;
		
		if (args.length == 3 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1]) && SUI.fn.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = args[2];
		} else if (args.length == 2 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1])) {
			parent = args[1].parentNode;
			child = args[0];
			reference = args[1];
		} else {
			SUI.fn.logger("SUI.DOM.AddBefore failed: Reference Object is null");
			return false;
		}
		
		try {
			parent.insertBefore(child, reference);
			return true;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.AddBefore failed: " + parent + " " + child + " " + reference + e);
			return false;
		}
	},
	AddAfter: function(args) {
		var args = arguments;
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1]) && SUI.fn.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = this.next(args[2]);
		} else {
			parent = this.parent(args[1]);
			child = args[0];
			reference = this.next(args[1]);
		}
		
		try {
			if (SUI.fn.isset(reference)) {
				return this.AddBefore(parent, child, reference);
			} else {
				return this.Add(parent, child);
			}
		} catch(e) {
			SUI.fn.logger("SUI.DOM.AddAfter failed: " + e);
			return false;
		}
	},
	Remove : function(params) {
		var args = arguments;
		var parNode = null;
		var chiNode = null;
		
		if (args.length === 2 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1])){
			parNode = args[0];
			chiNode = args[1];
		} else if (args.length == 1 && SUI.fn.isset(args[0])){
			parNode = args[0].parentNode;
			chiNode = args[0];
		}
		
		try {
			parNode.removeChild(chiNode);
			return parNode;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.Remove failed: " + e);
			return false;
		}
	},
	Empty: function(node) {
		while(node.firstChild) {
			this.Remove(node);
		}
		
		return node;
	},
	Change: function(args) {
		var args = arguments;
		var parNode = null;
		var chiNode = null;
		var refNode = null;
		
		if (args.length == 3 && !!args[0] && !!args[1] && !!args[2]) {
			parNode = args[0];
			chiNode = args[1];
			refNode = args[2];
		} else if (args.length == 2 && !!args[0] && !!args[1]) {
			parNode = args[1].parentNode;
			chiNode = args[0];
			refNode = args[1];
		}
		
		try {
			parNode.replaceChild(chiNode, refNode);
			return true;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.Change failed: " + e);
			return false;
		}
	},
	Clone: function(node, bool) {
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
		return (!!node && node.nodeType == 1 ? true : false);
	},
	parent: function(node) {
		return node.parentNode;
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Dimension
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, SUI.Attr, SUI.Classes, SUI.DOM, SUI.onDOMReady, SUI.Hash, SUI.Query
 * Optional: SUI.Ext.Animator
 */

SUI.namespace.include("Elements", function(sel, parNode) {
	this.node = [];
	this._node = [];
	this.a$ = [];
	this._a$ = [];
	this.fn$$ = [];
	this.node$$ = [];
	this.index = null;
	
	if (!!sel && sel.nodeType) {
		this.__ADD__([sel]);
	} else if (!!sel && typeof(sel) == "string") {
		this.query(sel, parNode);
	}
	
	return this;
}).prototype = {
	create: function(el) {
		var node = [];
		var args = arguments;
		var parNode = document.body;
		var tags = null;
		var attr = null;
		
		
		if (args.length === 3 && (!!args[0] && typeof(args[0]) == "string" && !!args[1] && args[1].nodeType && !!args[2])) {
			parNode = args[1];
			tags = args[0];
			attr = args[2];
		} else if (!!args[0] && typeof(args[0]) == "string") {
			tags = args[0];
			
			if (!!args[1] && args[1].nodeType) {
				parNode = args[1];
			} else if (!!args[1] && typeof(args[1]) == "object") {
				attr = args[1];
			}
		}
		
		try {
			node.push(SUI.Query.create(tags, attr));
			SUI.DOM.Add(parNode, node[0]);
		} catch(e) {
			SUI.fn.logger("SUI.Elements.create failed: " + e);
		}
		
		if (node.length > 0) {
			this.__ADD__(node);
		}
		
		// continue chaining
		return this;
	},
	query: function(sel, parNode) {
		var node = [];
		node = SUI.Query.selector(sel, parNode);
		
		if(node.length > 0) 
			this.__ADD__(node);
			
		// continue chaining
		return this;
	},
	__ADD__: function(nodes) {
		if (!!nodes) {
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				
				if (!!node && node.nodeType) {
					this.node.push(node);
					
					if (SUI.Ext.loaded("Animator") && node != document) {
						var len = (this.node.length - 1);
						
						try {
							this.a$[len] = new SUI.Ext.Animator;
							this.a$[len].Initialize(node);
						} catch(e) {
							SUI.fn.logger("SUI.Elements.__ADD__ error on Initialize Animator: " + node +  e);
						};
					}
				}
			}
		}
		
		this.index = (!this.index && this.node.length === 1 ? 0 : null);
	},
	__PUSH__: function(fn, i) {
		if(SUI.fn.isfunction(fn)) {
			var i = SUI.fn.pick(this.index, i);
			
			if (SUI.fn.isnull(i)) {
				SUI.fn.each(this.node, fn);
			} else if (!!this.node[i]) {
				try { 
					fn.call(this.node[i]);
				} catch(e) {
					fn.apply(this.node[i]);
				}
			}
		}
	},
	start: function() {
		var that = this;
			
		if (this._node.length === 0) {
			this._node = this.node;
			this._a$ = this.a$;
			this.index = null;
			this.node = [];
			this.a$ = [];
		}
		return this;
	},
	end: function() {
		if (this._node.length > 0) {
			this.node = this._node;
			this.a$ = this._a$;
			this.index = null;
			this._node = [];
			this._a$ = [];
		}
		return this;
	},
	andSelf: function() {
		this.__ADD__(this._node);
		return this;						
	},
	'find': function(elem, i) {
		var i = SUI.fn.pick(this.index, i);
		var n1 = (!i ? this.node : this.node[i]);
		var n2 = (!i ? this._node : this._node[i]);
		var node = SUI.fn.pick(n1, n2);
		
		return new SUI.Elements(elem, node);
	},
	childOf: function(elem, i) {
		var i = SUI.fn.pick(this.index, i);
		var e = elem.split(",");
		
		for(var ii = 0; ii < e.length && !!e[ii]; ii++) {
			e[ii] = ["< ", e[ii]].join("");
		}
			
		elem = e.join(",");
		
		if (this._node.length > 0) {
			if (this.node.length === 0) {
				var node = (!i ? this._node : this._node[i]);
				var obj = SUI.Query.selector(elem, node);
				
				if(obj.length > 0) {
					this.__ADD__(obj);
				}
			} else if (this.node.length > 0) {
				var node = (!i ? this.node : this.node[i]);
				var obj = SUI.Query.selector(elem, node);
				
				if(obj.length > 0) { 
					this.__ADD__(object);
				}
			}
			return this;
		} else if (this._node.length === 0) {
			var node = (!i ? this.node : this.node[i]);
			return new SUI.Elements(elem, node);
		}
	},
	has: function(elem, i) {
		var i = SUI.fn.pick(this.index, i);
		var e = elem.split(",");
		
		for(var ii = 0; ii < e.length && !!e[ii]; ii++) {
			e[ii] = ["> ", e[ii]].join("");
		}
		
		elem = e.join(",");
		
		if (this._node.length > 0) {
			if (this.node.length === 0) {
				var node = (!i ? this._node : this._node[i]);
				var obj = SUI.Query.selector(elem, node);
				
				if (obj.length > 0) {
					this.__ADD__(obj);
				}
			} else if (this.node.length > 0) {
				var node = (!i ? this.node : this.node[i]);
				var obj = SUI.Query.selector(elem, node);
				
				if (obj.length > 0) { 
					this.__ADD__(obj);
				}
			}
			return this;
		} else if (this._node.length === 0) {
			var node = (!i ? this.node : this.node[i]);
			return new SUI.Elements(elem, node);
		}
	},
	is: function(elem, i) {
		var i = SUI.fn.pick(this.index, i, 0);
		var node = SUI.Query.selector(elem);
		var obj = null;
		
		for(var ii = 0; ii < node.length && !!node[ii]; i++) {
			if(node[ii] === this.node[i]) {
				obj = new SUI.Elements(node[ii]);
				break;
			}
		}
			
		if (!!obj) {
			if(this._node.length > 0) {
				obj._node = this._node;
			}
			return obj;
		} else { 
			return new SUI.Elements();
		}
	},
	use: function(i) {
		var node = this.fetch(i);
		return (!!node ? new SUI.Elements(node) : false);						
	},
	fetch: function(i) {
		var i = SUI.fn.pick(this.index, i, 0);
		
		if (SUI.fn.isnull(i)) { 
			return this.node;
		} else if (!!SUI.fn.isset(this.node[i])) {
			return this.node[i];
		} else {
			return false;
		}
	},
	useParent: function(i) {
		// refer this.parent function
		return this.parent(i);
	},
	parent: function(i) {
		var i = SUI.fn.pick(this.index, i, 0);
		var node = SUI.fn.pick(this.node[i].parentNode, false);
		
		return (!!node ? new SUI.Elements(node) : false);
	},
	siblings: function(elem, i) {
		var i = SUI.fn.pick(this.index, i, 0);
		var e = elem.split(",");
		
		for(var ii = 0; ii < e.length && !!e[ii]; ii++) {
			e[ii] = "~ " + e[ii];
		}
		
		elem = e.join(",");
		
		if (this._node.length > 0) {
			if (this.node.length === 0) {
				var node = (!i ? this._node : this._node[i]);
				var obj = SUI.Query.selector(elem, node);
				
				if(obj.length > 0) {
					this.__ADD__(obj);
				}
			} else if (this.node.length > 0) {
				var node = (!i ? this.node : this.node[i]);
				var obj = SUI.Query.selector(elem, node);
				
				if(obj.length > 0) {
					this.__ADD__(obj);
				}
			}
			// continue chaining
			return this;
		} else if (this._node.length === 0) {
			var node = (!i ? this.node : this.node[i]);
			return new SUI.Elements(elem, node);
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
		
		var i = (this.index - 1);
		
		if (!!this.node[i]) { 
			this.index--;
		}
		// continue chaining
		return this;
	},
	next: function() {
		if (!this.index) {
			this.first();
		}
		
		var i = (this.index + 1);
		
		if (!!this.node[i]) {
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
		if(this.count() > 0 && SUI.fn.isfunction(fn)) {
			SUI.fn.each(this.node, fn);
		}
		// continue chaining
		return this;
	},
	callback: function(fn) {
		if(SUI.fn.isfunction(fn)) {
			try {
				fn.apply(this);
			} catch(e) {
				fn.call(this);
			}
		}
		// continue chaining
		return this;
	},
	add: function(elem, data, i) {
		return this.insertion(elem, data, i);
	},
	insertion: function(elem, data, i) {
		var ar = arguments;
		
		if (ar.length === 2 && typeof(data) !== "object") {
			var i = data;
			var data = null;
		}
		
		var i = SUI.fn.pick(this.index, i, 0);
		
		if (!!this.node[i]) {
			var node = new SUI.Elements;
			node.create(elem, this.node[i], data);
			
			return node;
		} else {
			return false;
		}
	},
	set: function(data, value, i) {
		// stack the callback
		this.__PUSH__(function() { 
			SUI.Attr.Set(this, data, value);
		}, i);
		// continue chaining
		return this;
	},
	setup: function(js, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.Attr.Setup(this, js);
		}, i);
		// continue chaining
		return this;
	},
	get: function(data, i) {
		var i = SUI.fn.pick(this.index, i);
		
		if (SUI.fn.isnull(i)){
			var value = [];
			
			SUI.fn.each(this.node, function() { 
				value.push(SUI.Attr.Get(this, data));
			});
			
			return value;
		} else if (!!this.node[i]) {
			return SUI.Attr.Get(this.node[i], data);
		}
	},
	unset: function(name, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.Attr.Remove(this, name);
		}, i);
		// continue chaining
		return this;
	},
	addClass: function(name, i) {
		// stack the callback
		this.__PUSH__(function(){
			SUI.Classes.Set(this, name);
		}, i);
		// continue chaining
		return this;
	},
	setClass: function(name, i) {
		// stack the callback
		this.__PUSH__(function(){
			SUI.Classes.Set(this, name);
		}, i);
		// continue chaining
		return this;
	},
	appendClass: function(name, i) {
		// stack the callback
		this.__PUSH__(function() { 
			SUI.Classes.Append(this, name);
		}, i);
		// continue chaining
		return this;
	},
	hasClass: function(name, i) {
		var i = SUI.fn.pick(this.index, i);		
		
		if (SUI.fn.isnull(i)) {
			var value = [];
			SUI.fn.each(this.node, function() { 
				value.push(SUI.Classes.Has(this, name));
			});
			return value;
		} else if (!!this.node[i]) {
			return SUI.Classes.Has(this.node[i], name);
		}
	},
	removeClass: function(name, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.Classes.Remove(this, name);
		}, i);
		// continue chaining
		return this;
	},
	css: function(data) {
		var ar = arguments;
		
		if (ar.length === 1 && typeof(ar[0]) == "object") { 
			return this.setStyles(ar[0]);
		} else if (ar.length === 2) {
			if (typeof(ar[0]) == "object" && typeof(ar[1]) == "number") {
				return this.setStyles(ar[0], ar[1]);
			} else if (typeof(ar[0]) == "string") {
				if (ar[0] == "alpha") { 
					return this.alpha(ar[1]);
				} else { 
					return this.setStyle(ar[0], ar[1]);
				}
			}
		} else if (ar.length === 3 && typeof(ar[0]) == "string" && typeof(ar[2]) == "number") {
			if (ar[0] == "alpha") { 
				return this.alpha(ar[1], ar[2]);
			} else {
				return this.setStyle(ar[0], ar[1], ar[2]);
			}
		}
	},
	setStyle: function(data, value, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.CSS.Set(this, data, value);
		}, i);
		// continue chaining
		return this;
	},
	setStyles: function(js, i) {
		// stack the callback
		this.__PUSH__(function() { 
			SUI.CSS.Setup(this, js);
		}, i);
		// continue chaining
		return this;
	},
	getStyle: function(data, i) {
		var i = SUI.fn.pick(this.index, i);
		
		if (SUI.fn.isnull(i)) {
			var value = [];
			
			SUI.fn.each(this.node, function() {
				value.push(SUI.fn.pick(SUI.CSS.Get(this, data), false));
			});
			
			return value;
		} else if (!!this.node[i]) {
			return SUI.fn.pick(SUI.CSS.Get(this.node[i], data), false);
		}
	},
	alpha: function(value, i) {
		// refer this.opacity function
		return this.opacity(value, i);
	},
	opacity: function(value, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.CSS.Alpha(this, value);
		}, i);
		// continue chaining
		return this;
	},
	png: function(uri, js, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.CSS.Png(this, uri, js);
		}, i);
		// continue chaining
		return this;
	},
	hide: function(fx, i) {
		var fx = (!!fx ? fx : null);
		// stack the callback
		this.__PUSH__(function() {
			SUI.CSS.Hide(this, fx);
		}, i);
		// continue chaining
		return this;
	},
	show: function(fx, i) {
		var fx = (!!fx ? fx : null);
		// stack the callback
		this.__PUSH__(function() {
			SUI.CSS.Show(this, fx);
		}, i);
		// continue chaining
		return this;
	},
	insert: function(chiNode, i) {
		var i = SUI.fn.pick(this.index, i);
		if(SUI.fn.isset(i)) {
			// stack the callback
			this.__PUSH__(function() { 
				SUI.DOM.Add(this, chiNode);
			}, i);
		}
		// continue chaining
		return this;
	},
	text: function(text, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.DOM.AddText(this, text);	
		}, i);
		// continue chaining
		return this;
	},
	remove: function(chiNode, i) {
		var i = SUI.fn.pick(this.index, i);
		
		if (SUI.fn.isset(i)) {
			// stack the callback
			this.__PUSH__(function() { 
				SUI.DOM.Remove(this, chiNode);
			}, i);
		}
		// continue chaining
		return this;
	},
	html: function(text, pos, i) {
		var ar = arguments;
		
		if (typeof(text) == "string") {
			var pos = (!!pos && pos.match(/^(before|after)$/g) ? pos : false);
			
			if (!pos) {
				// stack the callback
				this.__PUSH__(function() { 
					this.innerHTML = text; // set/overwrite HTML string for multiple HTMLelement
				}, i);
			} else { 
				this.__HTML__(text, pos, i); // append/prepend HTML string for multiple HTMLelement
			}
			// continue chaining
			return this;
		} else if (!text || typeof(text) == "number") {
			var i = SUI.fn.pick(this.index, i);
			
			if (SUI.fn.isnull(i)) {
				var value = [];
				// retrieve the value of each HTMLelement
				SUI.fn.each(this.node, function() {
					value.push(SUI.fn.pick(this.node[i].innerHTML, "")); // return HTML string for multiple HTMLelement
				});
				// return value as array
				return value;
			} else if (!!this.node[i]) {
				return SUI.fn.pick(this.node[i].innerHTML, ""); // return HTML string for single HTMLelement
			}
		}
	},
	// set or retrieve HTMLelement's value
	val: function(text, i) {
		var ar = arguments;
		
		if (typeof(text) == "string") {
			// stack the callback
			this.__PUSH__(function() {
				this.value = text; // set the value
			}, i);
			// continue chaining
			return this;
		} else if (!text || typeof(text) == "number") {
			var i = SUI.fn.pick(this.index, text, i);
			
			if (SUI.fn.isnull(i)) {
				var value = [];
				// retrieve the value of each HTMLelement
				SUI.fn.each(this.node, function() {
					value.push(SUI.fn.pick(this.node[i].value, ""));
				});
				// return the value as array
				return value;
			} else if (!!this.node[i]) {
				return SUI.fn.pick(this.node[i].value, ""); // retrieve single HTMLelement value
			}
		}
	},
	// append HTML string
	append: function(text, i) {
		// refer this.__HTML__ function
		return this.__HTML__(text, "after", i);
	},
	// prepend HTML string
	prepend: function(text, i) {
		// refer this.__HTML__ function
		return this.__HTML__(text, "before", i);
	},
	// bind a event handler
	on: function(handler, fn1, fn2, i) {
		// prefer the arguments value based on situation
		if (handler !== "hover") {
			var i = SUI.fn.pick(this.index, fn2); 
		} else {
			var i = SUI.fn.pick(this.index, i, fn2);
		}
		
		// stack the callback
		this.__PUSH__(function() { 
			SUI.fn.on(this, handler, fn1, fn2);
		}, i);
		// continue chaining
		return this;
	},
	// bind a event handler
	bind: function(handler, fn1, fn2, i) {
		// refer this.on function
		return this.on(handler, fn1, fn2, i);
	},
	// unbind a event handler
	unbind: function(handler, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.fn.on(this, handler, (function() {
				return true;	  
			}));
		}, i);
		// continue chaining
		return this;
	},
	// extend onDOMReady function to SUI.Elements
	ready: function(fn, i) {
		var i = SUI.fn.pick(this.index, i, null);
		
		// include document if node empty
		if(this.node.length == 0) {
			this.__ADD__([document]);
		}
		
		// stack the callback
		this.__PUSH__(function() {
			SUI.onDOMReady.Initialize(this, fn);		 
		}, i);
		// continue chaining
		return this;
	},
	setHash: function(data, value, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.Hash.Set(this, data, value);
		}, i);
		// continue chaining
		return this;
	},
	// get hashtable value
	getHash: function(data, i) {

		var i = SUI.fn.pick(this.index, i);
		
		if (SUI.fn.isnull(i)) {
			var value = [];			
			// get each value of hash from an array
			SUI.fn.each(this.node, function() { 
				value.push(SUI.Hash.Get(this, data));
			});
			// return the value in array
			return value;
		} else if (!!this.node[i]) {
			// get single hash value
			return SUI.Hash.Get(this.node[i], data);
		}
	},
	// remove hashtable
	removeHash: function(data, i) {
		// stack the callback
		this.__PUSH__(function() {
			SUI.Hash.Remove(this, data);
		}, i);
		// continue chaining
		return this;
	},
	// I'm done with the current chain. Clear the memory
	done: function() {
		// clear memory
		return null;							
	},
	// manipulating HTML string for Element
	__HTML__: function(text, pos, i) {
		var pos = (pos.match(/^(before|after)$/g) ? pos : "after");
		// stack the callback
		this.__PUSH__(function() {
			// get current HTML string
			var html = SUI.fn.pick(this.innerHTML, "");
			
			if (pos == "after") {
				// append the HTML string
				this.innerHTML = [html,text].join("");
			} else if (pos == "before") {
				// prepend the HTML string
				this.innerHTML = [text,html].join("");
			}
		}, i);
		// enable chaining
		return this;
	}
};

// Extend misc event handler function to SUI.Elements
(function() {
	// array listing all the supported event handler
	var handler = ["click", "mouseover", "mouseout", "change", "keyup", "keypress", "submit", "blur", "focus", "hover"];
	// Loop the array and implement each event handler
	SUI.fn.each(handler, function() {
		// this is the values of array
		var that = this;
		// add 's' or 'es' at the end of array value (prevent problem without having s)
		var n = (!that.match(/(s|es)$/g) ? [that, (that.match(/es$/g) ? "" : "s")].join("") : that);
		
		try {
			// extend it to SUI.Elements
			SUI.fn.extend(n, function(fn1, fn2) {
				return this.on(that, fn1, fn2);					  
			});
		} catch(e) { 
			// Just in case any error occur (but doubt it)
			SUI.fn.logger(e);
		}
	});
})();

SUI.fn._$ = window.$$;
var $$ = function(sel, par) {
	return SUI(sel, par);
};

SUI.fn.restore = function() {
	if(this.isset(this._$)) {
		window.$$ = this._$;
		this._$ = null;
	}
	
	return (function(sel, par) {
		return SUI(sel, par);
	});
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Event
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("Event", function(handler, js) {
	this.node = window;
	this.type = null;
	this.fn = null;
	
	if(handler == "on") {
		return this.On(js);
	} else if(handler == "off") {
		return this.Off(js);
	}
	
	return this;
}).prototype = {
	On: function(js) {
		var that = this;
		var p = true;
		var r;
		
		this.node = SUI.fn.pick(js.object, this.node);
		this.type = SUI.fn.pick(js.on, this.type, "load");
		this.fn = SUI.fn.pick(js.callback, this.fn);
		
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
			var fn = SUI.fn.pick(this.object["on" + this.type], null);
			SUI.fn.on(this.node, this.type, function() {
				if(SUI.fn.isset(fn) && SUI.fn.isfunction(fn)) {
					fn();
				}
				that.fn();
			});
		}
	},
	Off: function (js) {
		var that = this;
		var r = false;
		this.node = SUI.fn.pick(js.object, this.node);
		this.type = SUI.fn.pick(js.on, this.type, "load");
		this.fn = SUI.fn.pick(js.callback, this.fn);
		
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

/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.onDOMReady
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, SUI.Event
 */

SUI.namespace.include("onDOMReady", {
	_FN_: [],
	_NODE_: [],
	script: null,
	timer: null,
	done: null,
	Initialize: function(node, fn) {
		var that = SUI.onDOMReady;
		
		return (function(fn, node) {
			if (!!that.done) {
				if(!!node && node !== document) {
					SUI.fn.callback(node, fn);
				} else { 
					fn();
				}
				
				return;
			}
			
			if (/Konqueror/i.test(navigator.userAgent)) {
				new SUI.Event("on", {
					on: "load",
					callback: function() {
						that.__CALLBACK__();
					}
				});
			} else if (document.addEventListener) {
				try { 
					document.addEventListener("DOMContentLoaded", that.__CALLBACK__, false); 
				} catch(e) { 
					new SUI.Event("on", {
						on: "load",
						callback: function() {
							that.__CALLBACK__();	
						}
					});
				}
			}
			
			if (/WebKit/i.test(navigator.userAgent)) { 
				var timer = setInterval(function() {
					if (/loaded|complete/.test(document.readyState)) {
						that.__CALLBACK__();
						clearInterval(that.timer);
						that.timer = null;
					}
				}, 10);
			}
			
			if (!!SUI.fn.behaviour.ie) {
				try {
					document.write("<script id=__ie_onload defer src=//0><\/scr"+"ipt>");
					that.script = document.getElementById("__ie_onload");
					that.script.onreadystatechange = function() {
						if (this.readyState == "complete") 
							that.__CALLBACK__(); // call the onload handler
					};
				} catch(e) { 
					SUI.fn.logger(e);
				}
			} else {
				new SUI.Event("on", {
					on: "load",
					callback: (function() {
						that.__CALLBACK__();
					})
				});
			}
			
			that._FN_.push(fn);
			that._NODE_.push(node);
		})(fn, node);
	},
	__CALLBACK__: function() {
		if(!SUI.onDOMReady.done) {
			SUI.onDOMReady.done = true;
			
			if (!!SUI.onDOMReady.timer) {
				clearInterval(that.timer);
				SUI.onDOMReady.timer = null;
			}
			
			for (var i = 0; i < SUI.onDOMReady._FN_.length; i++) {
				var fn = SUI.onDOMReady._FN_[i];
				var node = SUI.onDOMReady._NODE_[i];
				
				if (SUI.fn.isfunction(fn)) {
					if(!!node && node !== document) {
						SUI.fn.callback(node, fn);
					} else { 
						fn();
					}
				}
			}
			
			SUI.onDOMReady._FN_ = new Array;
			SUI.onDOMReady._NODE_ = new Array;
			
			if(!!SUI.onDOMReady.script) {
				SUI.onDOMReady.script.onreadystatechange = '';
			}
		}
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Hash
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
// Hashtable function to store variable for object without having any complication with IE based browser
SUI.Storage.include("Hash", {
	object: {},
	Set: function(node, data, value) {
		var name = this.__FN__(node);
		
		if (SUI.fn.isset(name)) {
			if (!SUI.fn.isset(this.object[name])) {
				this.object[name] = {};
			}
			
			this.object[name][data] = value;
		}
	},
	Get: function(node, data) {
		var name = this.__FN__(node);
		
		if (SUI.fn.isset(name)) {
			if (SUI.fn.isset(this.object[name]) && SUI.fn.isset(this.object[name][data])) {
				return this.object[name][data];
			} else {
				return false;
			}
		} else { 
			return false;
		}
	},
	Remove: function(node, data) {
		var name = this.__FN__(node);
		
		if (SUI.fn.isset(name)) {
			this.object[name][data] = null;
			
			if (SUI.fn.isset(this.object[name]) && SUI.fn.isset(this.object[name][data])) {
				this.object[name][data] = null;
			} else {
				return false;
			}
		} else { 
			return false;
		}
	},
	__FN__: function(node) {
		return (typeof(node) == "object" ? SUI.Attr.Get(node, "id") : node);
	}
});

SUI.namespace.include("Hash", SUI.Storage.Hash);
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.JsClass
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("JsClass", function() {});
SUI.JsClass.create = function(js) {	
	var initialize = true;
	var prototype = new SUI.JsClass;
	initialize = false;
	
	function Class() {
		if(!initialize && !!this.construct) {
			this.construct.apply(this, SUI.fn.toArray(arguments));
		}
	};
	
	Class.prototype = prototype;
	Class.prototype.construct = SUI.fn.pick(js.__construct, null);
	Class.constructor = Class;
	Class.extend = function(js) {
		js.ext = this;
		var eClass = SUI.JsClass.create(js);
		
		return eClass;
	};
	
	var ext = SUI.fn.pick(js.ext, null);
	
	if(SUI.fn.isset(ext)) {
		try {
			// try to copy parent object.
			(function(js) {
				var mtd = ["ext", "__construct", "__destruct", "_super", "prototype"];
				// start adding parent method and properties to this object
				for (var method in js.prototype) {
					if (js.prototype.hasOwnProperty(method) && (!SUI.fn.inArray(mtd, method) && !this[method])) {
						this[method] = js.prototype[method];
					}
				}
				for (var method in js) {
					if (js.hasOwnProperty(method) && (!SUI.fn.inArray(mtd, method) && !this[method])) {
						this[method] = js[method];
					}
				}
				// create a linkage to the parent object
				this._super = js.prototype;
			}).call(prototype, ext);
		} catch(e) {
			SUI.fn.logger(e);
		}
	}
	
	// add this object user defined properties and methods
	(function(js) {
		// the following object shouldn't be extended
		var mtd = ["ext", "__construct", "__destruct", "_super", "prototype"];
		
		// start adding method and properties to this object
		for (var method in js) {
			if (js.hasOwnProperty(method) && (!SUI.fn.inArray(mtd, method) && !this[method])) {
				this[method] = js[method];
			}
		};
	}).call(prototype, js);
	
	// avoid this.ext to be duplicated in this.prototype 
	delete ext;
	
	return Class;
};
SUI.JsClass.prototype = {
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
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.KeyEvent
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */

SUI.namespace.include("KeyEvent", {
	
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Parser
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("Parser", {
	// Parse string value with Parsed HTML value
	HTML: {
		to: function(value) {
			var value = new String(value);
			value = SUI.fn.htmlEntities(value);
			value = encodeURIComponent(value);
			
			return value;
		},
		from: function(value) {
			var value = new String(value);
			value = decodeURIComponent(value);
			value = SUI.fn.htmlEntityDecode(value);
			
			return value;
		}
	},
	// Convert back SuiML string to normal string
	SuiML: function(value) {
		return new String(value).replace(/\[lt\]/g, "<").replace(/\[gt\]/g, ">").replace(/\[n\]/g, "&").replace(/\&quot\;/g, "\"").replace(/\&rsquo\;/g, "\'").replace(/\[br\]/g, "\n").replace(/\[break\]/g, "<br />");
	}
});
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Dimension
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, SUI.Attr, SUI.Classes, SUI.CSS, SUI.DOM
 */
 
SUI.namespace.include("Query", {
	is: function(node, is) {
		var is = SUI.fn.trim(is);
		var r = null;
		var status = null;
		var value = false;
		var prev = node.previousSibling;
		var next = node.nextSibling;
		
		if (is.match(/^(enabled|disabled|checked|selected)$/)) {
			status = is;
			is = "input";
			
			if (status === "enabled") {
				value = true;
				status = "disabled";
			}
		}
		
		switch (is) {
			case 'visible':
				return ((SUI.CSS.Get(node, "display") === "none" || SUI.CSS.Get(node, "visibility") === "hidden") || (node.tagName.toLowerCase() === "input" && SUI.Attr.Get(node, "type") === "hidden") ? false : true);
				break;
			case 'hidden':
				return (SUI.CSS.Get(node, "display") === "none" || SUI.CSS.Get(node, "visibility") === "hidden" ? true : false);
				break;
			case 'first-child':
				return (function(prev) {
					if (!!prev) {
						return (!prev || !!SUI.DOM.isFirst(prev) ? true : false);
					} else {
						return true;
					}
				})(prev);
				break;
			case 'last-child':
				return (function(next) {
					if (!!next) { 
						return (!next || !!SUI.DOM.isLast(next) ? true : false);
					} else {
						return true;
					}
				})(next);
				break;
			case 'only-child':
				return (function(node) {
					if (!!node) { 
						return SUI.DOM.isOnlyChild(node);
					} else {
						return true;
					}
				})(node);
				break;
			case 'input':
				return (function(node, r, status, value) {
					r = node.tagName.toLowerCase().match(/^(input|select|textarea)$/);
					if (!!status) {
						r = (SUI.Attr.Get(node, status) !== false ? true : false);
						
						if(!!value) { 
							r = (r ? false : true);
						}
					}
					return r;			 
				})(node, r, status, value);
				break;
			default:
				return (function(node, is) {
					if (is.match(/^(text|password|radio|checkbox|submit|image|reset|button|file|hidden)$/)) {
						return (node.tagName.toLowerCase() === "input" && SUI.Attr.Get(node, "type") === is ? true : false);
					} else { 
						return false;
					}
				})(node, is);
		};
	},
	hasClass: function(node, klasName) {
		return (SUI.Classes.Has(node, klasName) ? true : false);
	},
	hasAttr: function(node, attrs) {
		var at = SUI.Attr.Get(node, attrs[0]);
		
		if(at) {
			switch (attrs[1]) {
				case '=': // Equality
					return (at === attrs[2]);
					break;
				case '~': // Match one of space seperated
					return (at.match(new RegExp('\\b' + attrs[2] + '\\b')));
					break;
				case '|': // Match start with value followed by optional hyphen
					return (at.match(new RegExp('^' + attrs[2] + '-?')));
					break;
				case '^': // Match starts with value
					return (at.indexOf(attrs[2]) === 0);
					break;
				case '$': // Match ends with value - fails with "Warning" in Opera 7
					return (at.lastIndexOf(attrs[2]) === at.length - attrs[2].length);
					break;
				case '*': // Match ends with value
					return (at.indexOf(attrs[2]) > -1);
					break;
				default : // Just test for existence of attribute
					return at;
			}
		} else 
			return false;
	},
	tagParentOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			var t = (tags === "*" && document.all ? document.all : document.getElementsByTagName(tags));
			
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				for(var ii = 0; ii < t.length && t[ii]; ii++) {
					var node = t[ii];
					
					if(node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr) && node === parNode[i].parentNode) {
						context[context.length] = node;
					}
				}
			}
		}
		return context;
	},
	tagNextOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var pn = parNode[i].parentNode;
				
				if(!!pn && pn.nodeType == 1) {
					var t = (tags === "*" && pn.all ? pn.all : pn.getElementsByTagName(tags));
				
					for(var ii = 0; ii < t.length && t[ii]; ii++) {
						var node = t[ii];
						var tnode = SUI.DOM.prev(node);
						
						if(tnode === parNode[i] && node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr)) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	tagSiblingOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var pn = parNode[i].parentNode;
				
				if(!!pn && pn.nodeType == 1) {
					var t = (tags === "*" && pn.all ? pn.all : pn.getElementsByTagName(tags));
				
					for(var ii = 0; ii < t.length && t[ii]; ii++) {
						var node = t[ii];
						
						if(node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr) && node.parentNode === pn) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	tagChildOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var pn = parNode[i];
				
				if(!!pn && pn.nodeType == 1) {
					var t = (tags === "*" && pn.all ? pn.all : pn.getElementsByTagName(tags));
				
					for(var ii = 0; ii < t.length && t[ii]; ii++) {
						var node = t[ii];
						
						if(node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr) && node.parentNode === pn) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	__VALIDATE__: function(node, klasName, is, attr) {
		var valid = false;
		var klasName = SUI.fn.pick(klasName, "");
		var is = SUI.fn.pick(is, null);
		var attr = SUI.fn.pick(attr, []);
		
		valid = (klasName === "" || !!SUI.Query.hasClass(node, klasName) ? true : false);
		valid = ((attr.length === 0 || (attr.length === 3 && !!SUI.Query.hasAttr(node, attr))) && !!valid ? true : false); 
		valid = ((!is || (!!is && !!SUI.Query.is(node, is))) && !!valid ? true : false);
		
		return valid;
	},
	create: function(tags, attr) {
		var node = null;
		var tags = SUI.fn.trim(tags);
		
		if(/\#/.test(tags)) {
			var tag = tags.split(/\#/);
			var el = SUI.fn.trim(tag[0]);
			var id = SUI.fn.trim(tag[1]);
			node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', el) : document.createElement(el);
			SUI.Attr.Set(node, "id", id);
		} else {
			node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', tags) : document.createElement(tags);
		}
		
		if (SUI.fn.isset(attr)) { 
			SUI.Attr.Setup(node, attr);
		}
		
		return node;
	},
	tags: function(tags, parNode, klasName, is, attr, type) {
		var context = [];
		var klasName = SUI.fn.trim(SUI.fn.pick(klasName, ""));
		var is = SUI.fn.pick(is, null);
		var attr = SUI.fn.pick(attr, []);
		var tags = SUI.fn.pick(tags, "*");
		
		if(SUI.fn.isset(type) && type > 0) {
			if(type === 4) {
				context = SUI.Query.tagParentOf(tags, parNode, klasName, is, attr);
			} else if (type === 2) {
				context = SUI.Query.tagNextOf(tags, parNode, klasName, is, attr);
			} else if (type === 3) {
				context = SUI.Query.tagSiblingOf(tags, parNode, klasName, is, attr);
			} else if (type === 1) {
				context = SUI.Query.tagChildOf(tags, parNode, klasName, is, attr);
			}
		} else {
			if(!parNode || parNode.length === 0 || !parNode.length) {
				parNode = [document];
			}
			
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var t = (tags === "*" && parNode[i].all ? parNode[i].all : parNode[i].getElementsByTagName(tags));
				
				for(var ii = 0; ii < t.length && t[ii]; ii++) {
					var node = t[ii];
					
					if(node.nodeType === 1 && SUI.Query.__VALIDATE__(node, klasName, is, attr)) {
						context[context.length] = node;
					}
				}
			}
		}
		return (context.length > 0 ? context : false);
	},
	id: function(id, parNode, tags, is) {
		var tags = SUI.fn.trim(SUI.fn.pick(tags, "*")).toUpperCase();
		var el = document.getElementById(id);
		var is = (!!is ? this.is(el, is) : true);
			
		if (el && (tags == "*" || tags == el.tagName.toUpperCase()) && !!is) {
			return el;
		} else { 
			return false;
		}
	},
	selector: function(elem, parNode) {
		var context = [];
		
		var init = function(elem, parNode) {
			var context = [];
			
			if (!!parNode && !parNode.length) {
				context = [parNode];
			} else if (!!parNode && parNode.length > 0) { 
				context = parNode;
			}
			
			var type = 0;
			var elm = elem.split(/\s/);
			
			for (var i = 0; i < elm.length; i++){
				if(context.length === 0 && i > 0) {
					context = false;
					break;
				}
				
				var el = SUI.fn.trim(elm[i]);
				
				if (el !== "") {
					var tags = "";
					var id = "";
					var klasName = "";
					var attr = [];
					var is = null;
					
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
							context = [SUI.Query.id(id, context, tags, is)];
						} else {
							context = SUI.Query.tags(tags, context, klasName, is, attr, type);
						}
						
						if (!context) {
							context = [];
							break;
						} else {
							context = SUI.fn.unique(context);
						}
						
						type = 0;
					}
				}
			}
			return context;
		};
		
		var el = SUI.fn.trim(elem).split(/,/);
		el = SUI.fn.unique(el);
		
		for (var m = 0; m < el.length && !!el[m]; m++) {
			var elm = SUI.fn.trim(el[m]);
			
			if (elm !== "") {
				var node = init(elm, parNode);
				
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
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Test
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("Test", {
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
	isLength: function(data, value) {
		var ar = data.split(/\-/);
		var len = SUI.fn.toNumber(ar[1]);
		var r = null;
		
		if (ar[0] === "max") {
			r = (value <= len ? true : false);
		} else if (ar[0] === "min") {
			r = (value >= len ? true : false);
		} else if (ar[0] === "exact") {
			r = (value == len ? true : false);
		} else { 
			r = true;
		}
		
		return r;
	},
	isURL: function(value) {
		return (value.match(/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/));
	},
	isIpAddress: function(value) {
		return (value.match(/^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/));
	}
});
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
SUI.Ext.include("Ajax", function(js) {
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
		this.Call(js);
	}
	
	// chain this
	return this;
}).prototype = {
	Initialize: function() {
		var xhr = false;
		
		if (window.XMLHttpRequest) {
			// Majority of modern browser support XMLHttpRequest()
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			// Enable support for IE browser, IE7 and above provide option to use XMLHttpRequest()
			var ms = ["MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			
			for (var i = 0; i < ms.length && !!ms[i]; i++) {
				try {
					xhr = new ActiveXObject(ms[i]);
					break;
				} catch(e){ }
			}
		}
		
		if (!xhr) {
			// Failed to attach any XHR object
			SUI.fn.logger("SUI.Ext.Ajax.Initialize() failed: browser does not support Ajax!");
		}
		
		this.object = xhr;
	},
	Call: function(js) {
		if (this.object == null) {
			// Initialize XHR object if undefined.
			this.Initialize();
		}
		
		// Check XHR method: GET/POST
		this.method = (!SUI.fn.isset(js.method) || js.method != "GET" ? "POST" : "GET");
		// Set caching option for the request
		this.cache = SUI.fn.pick(js.cache, this.cache);
		// Enable debugging for XHR request
		this.debug = SUI.fn.pick(js.debug, this.debug);
		// XHR uri request
		this.uri = (js.uri ? SUI.fn.trim(js.uri) : this.uri);
		// XHR parameters
		this.parameter = (js.parameters ? SUI.fn.trim(js.parameters) : this.parameter);
		// XHR data
		this.data = (!!js.data ? js.data : this.data);
		this.data = (!!this.data ? SUI.fn.serialize(this.data) : "");
		
		// Set timeout.
		this.timeout = SUI.fn.pick(js.timeout, this.timeout);
		this.timeout = (!!SUI.Test.isInteger(this.timeout) ? this.timeout : 0);
		
		// check whether XHR object is ready
		if (this.object.readyState == 4 || this.object.readyState == 0) {
			if (this.method == "POST") {
				// use method POST
				this.object.open("POST", this.uri, true);
				
				this.type = SUI.fn.trim(SUI.fn.pick(js.type, "application/x-www-form-urlencoded"));
				this.object.setRequestHeader("Content-Type", this.type);
				
				if(this.object.overrideMimeType) {
					this.object.setRequestHeader("Connection", "close");
				}
				
				this.__POST__();
				this.object.send(this.parameter);
			} else {
				// use method GET
				this.__GET__();
				this.object.open("GET", [this.uri, this.parameter].join(""), true);
				this.object.send("");
			}
			
			// set timeout count
			if(this.timeout > 0) {
				this.timeoutid = setTimeout(function() {
					that.Cancel();
				}, this.timeout);
			}
			
			var that = this;
			var object = this.object;
			// Run custom callback to function
			if (SUI.fn.isfunction(js.onComplete)) {
				try {
					this.object.onreadystatechange = function() {
						// clear timeout (if exist)
						if(this.readyState === 4 && that.__STATUS__()) {
							if(SUI.fn.isset(that.timeoutid)) {
								clearTimeout(that.timeoutid);
								that.timeoutid = null;
							}
							
						}
						js.onComplete.apply(that.object);
					};
				} catch(e) { 
					SUI.fn.logger(e); 
				}
			} else {
				// Run default callback to function
				this.object.onreadystatechange = function() {
					try {
						// if request is complete and page is available
						if (that.object.readyState === 4 && that.__STATUS__()) {
							// clear timeout (if exist)
							if(SUI.fn.isset(that.timeoutid)) {
								clearTimeout(that.timeoutid);
								that.timeoutid = null;
							}
							
							// get response text
							var reply = that.reply = SUI.fn.trim(that.object.responseText);
							
							// add to logs (if enable)
							if (that.debug === true) {
								SUI.fn.logger("Response from XHR: " + reply);
							}
							
							// reply shouldn't be empty
							if (reply !== "") {
								// eval the JSON string
								var data = eval("(" + reply + ")");
								
								// check for SUIXHR object
								if(!!data.SUIXHR) {
									that.__ALERT__(data);
									that.__GOTO__(data);
									that.__UPDATE__(data);
								}
								that.__DONE__();
							} else 
								that.Cancel(); // cancel the object
						}
					} catch(e) {
						// log if anything goes wrong
						SUI.fn.logger("onreadychange error: " +e);
					}
				};
			}
		}
	},
	// Cancel the currently running XHR Object/request
	Cancel: function() {
		this.object.abort();
		this.object = null;
		SUI.fn.logger("SUI.Ajax: Cancel XHR request"); 
	},
	__DONE__: function() {
		this.object = null;
	},
	__POST__: function() {
		var p = this.parameter;
		
		if (p.match(/^\?/)) {
			p = ["&", p.substring(1, p.length)].join("");
		}
		
		this.parameter = p;
		this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "") + this.data : "");
		
		if(this.cache === false) {
			var s = new Date;
			this.parameter += (this.parameter !== "" ? "&" : "?") + "suicache=" + s.getTime(); 
		}
	},
	__GET__: function() {
		var par = [];
		var param = "";
		var p = this.parameter;
		
		if (this.uri.match(/\?/)) {
			var u = this.uri.split(/\?/);
			
			if (u.length > 1) {
				this.uri = u[0];
				
				for (var i = 1; i < u.length; i++) {
					par.push(u[i]);
				}
				
				param = ["&", par.join("&")].join("");
			}
		}
		
		if (p.match(/^\?/) && p.length > 0) {
			p = "&" + p.substring(1, p.length);
		}
		
		p = [param, p].join("");
		
		if (p.length > 0 && p.match(/^(\&|\?)/)) {
			p = ["?", p.substring(1, p.length)].join("");
		}
		
		this.parameter = p;
		this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "?") + this.data : "");
		
		if(this.cache === false) {
			var s = new Date;
			this.parameter += (this.parameter !== "" ? "&" : "?") + "suicache=" + s.getTime(); 
		}
	},
	__STATUS__: function() {
		var r = this.object.status;
		
		try {
			var local = (!r && location.protocol == 'file:');
			var range = (r >= 200 && r < 300);
			var unmodified = (r == 304);
			var safari = (SUI.fn.behaviour.safari && typeof(r) == "undefined");
			return  (local || range || unmodified || safari);
		} catch(e) {
			SUI.fn.logger("Status failed: " + e);	
		}
		return false;
	},
	__ALERT__: function(data) {
		var a = SUI.fn.pick(data.alertpop, data.notice);
		
		if (SUI.fn.isset(a) && a !== "") {
			window.alert(a);
		}
	},
	__GOTO__: function(data) {
		var h = SUI.fn.pick(data.jumpto, data.href);
		
		if (SUI.fn.isset(h) && h !== "") {
			SUI.fn.href(h);
		}
	},
	__UPDATE__: function(data) {
		var p = SUI.fn.pick(data.result, data.text);
		var id = SUI.fn.pick(data.add2id, data.id);
		var fn = SUI.fn.pick(data.exec, data.callback);
		var args = SUI.fn.pick(data.args, null);
		
		if (!!p) {
			if (!!id && typeof(id) === "string") {
				SUI("#" + id).html(SUI.Parser.SuiML(p));
			} else if (SUI.fn.isfunction(fn)) {
				if(args !== null && args.length > 0) {
					fn.apply(data, args);
				} else {
					fn(p);
				}
			}
		}
	}
};

// Make it easier for people to code
SUI.namespace.include("Ajax", SUI.Ext.Ajax);

SUI.extend("load", (function(url, method, i) {
	var i = SUI.fn.pick(this.index, i, 0);
	var imethod = (!!SUI.fn.inArray(['post','get'], method.toLowerCase()) ? method.toUpperCase() : 'GET');
	
	if (SUI.fn.isset(i) && !!this.node[i]) {
		var node = this.node[i];
		
		var updateNode = function() {
			if (this.readyState == 4) {
				var text = this.responseText;
				node.innerHTML = SUI.Parser.SuiML(text);
			}
		};
		
		new SUI.Ext.Ajax({
			uri: url,
			method: imethod,
			cache: false,
			onComplete: updateNode
		});
	}
	return this;
}));
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Animator
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
SUI.Ext.include("Animator", function(spec) {
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
		this.Initialize(spec);
	}
	
	return this;
}).prototype = {
	Initialize: function(spec) {
		var node;
		
		if (typeof(spec) == "string") {
			var el = spec;
			
			if (SUI.fn.finds(el)) {
				node = SUI.Query.id(el);
			} else {
				node = SUI.Query.create("div");
				SUI.Attr.Get(node, "id", el);
			}
		} else if (spec && spec.nodeType === 1) {
			node = spec;
		} else {
			var object = SUI.fn.pick(spec.object, spec.node);
			node = SUI.fn.prepare(object, spec.element, "object");
		}
		
		this.object = node;
		return this;
	},
	Queue: function(spec) {
		var that = this;
		fn = this.oncomplete;
		this.onComplete = function() {
			if (SUI.fn.isfunction(fn)) {
				fn();
			}
			
			new SUI.Ext.Animator(this.object).Fx(spec);
		};
		return this;
	},
	Sync: function(spec) {
		new SUI.Ext.Animator(this.object).Fx(spec);
		return this;
	},
	Fx: function(spec) {
		if (this.interval === null) {
			this.does = spec.method = (SUI.fn.inArray(this.methods, spec.method) ? spec.method : "moveUp");
			this.oncomplete = spec.oncomplete = SUI.fn.pick(spec.onComplete, null);
			this.__GRID__();
			this.shutter = spec.shutter = SUI.fn.pick(spec.shutter, 20);
			this.step = spec.step = SUI.fn.pick(spec.step, 80);
			this.ease = SUI.fn.pick(spec.ease, 0.8);
			this.actStep = 0;
			var that = this;
			
			if (this.does.match(/^move(Up|Down|Left|Right)$/)) {
				var ts = spec.transaction;
				
				if (this.does.match(/^move(Left|Right)$/)) {
					this.type = SUI.fn.pick(spec.property, "marginLeft");
					
					if (this.type != "marginLeft" && SUI.CSS.Get(this.object, "position")) {
						this.type = "left";
						this.transaction[0] = SUI.fn.pick(ts[0], this.left);
						this.transaction[1] = ts[1];
					} else {
						this.type = "marginLeft";
						this.transaction[0] = SUI.fn.pick(ts[0], this.margin[3]);
						this.transaction[1] = ts[1];
					}
				} else if (this.does.match(/^move(Up|Down)$/)) {
					this.type = SUI.fn.pick(spec.property, "marginTop");
					
					if (this.type != "marginTop" && SUI.CSS.Get(this.object, "position")) {
						this.type = "top";
						this.transaction[0] = SUI.fn.pick(ts[0], this.top);
						this.transaction[1] = ts[1];
					} else {
						this.type = "marginTop";
						this.transaction[0] = SUI.fn.pick(ts[0], this.margin[0]);
						this.transaction[1] = ts[1];
					}
				}
				
				this.interval = setInterval(function(){ 
					that.__CUSTOM__(); 
				}, this.shutter);
			} else if (this.does == "move") {
				var ts = spec.transaction;
				this.type = SUI.fn.pick(spec.property, "margin");
				
				if (this.type != "margin" && SUI.CSS.Get(this.object, "position")) {
					this.type = "position";	
					this.transaction[0] = SUI.fn.pick(ts[0], this.top);
					this.transaction[1] = ts[1];
					this.transaction[2] = SUI.fn.pick(ts[2], this.left);
					this.transaction[3] = ts[3];
				} else {
					this.type = "margin";
					this.transaction[0] = SUI.fn.pick(ts[0], this.margin[0]);
					this.transaction[1] = ts[1];
					this.transaction[2] = SUI.fn.pick(ts[2], this.margin[3]);
					this.transaction[3] = ts[3];
				}
				
				this.interval = setInterval(function() {
					that.__CUSTOMMOVE__();
				}, this.shutter);
			} else if (this.does.match(/^resize(Width|Height)$/)) {
				this.type = SUI.fn.pick(spec.property, "normal");
				this.does = (spec.method == "resizeWidth" ? "width" : "height");
				var ts 	= spec.transaction;
				
				if (this.does == "width") {
					this.transaction[0] = SUI.fn.pick(ts[0], this.width);
					this.transaction[1] = ts[1];
				} else {
					this.transaction[0] = SUI.fn.pick(ts[0], this.height);
					this.transaction[1] = ts[1];
				}
				
				this.interval = setInterval(function() {
					that.__SIZE__();
				}, this.shutter);
			} else if (this.does == "resize") {
				this.type = SUI.fn.pick(spec.property, "normal");
				var ts 	= spec.transaction;
				this.transaction[0] = SUI.fn.pick(ts[0], this.width);
				this.transaction[1] = ts[1];
				this.transaction[2] = SUI.fn.pick(ts[2], this.height);
				this.transaction[3] = ts[3];
				
				this.interval = setInterval(function() {
					that.__SIZEBOTH__();
				}, this.shutter);
			} else if (this.does == "fade") {
				this.type = spec.property = spec.method;
				var ts = spec.transaction;
				this.transaction[0] = (ts[0] < 0 ? 0 : (ts[0] > 100 ? 100 : ts[0]));
				this.transaction[1] = (ts[1] < 0 ? 0 : (ts[1] > 100 ? 100 : ts[1]));
				
				this.interval = setInterval(function() {
					that.__FADE__();
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
	__FADE__: function() {
		var node = this.object;
		
		if (SUI.fn.isset(node)) {
			var t = this.transaction;
			this.actStep = (this.actStep + 1);
			this.prevEase = t[0];
			var s = this.__EASE__(t[0], t[1], this.step, this.actStep, this.ease);
			
			if (s === this.prevEase) {
				try {
					if (s == 0 && SUI.CSS.Get(node, "visibility") != "hidden") {
						SUI.CSS.Hide(node);
					} else if (s > 0 && SUI.CSS.Get(node, "visibility") == "hidden") {
						SUI.CSS.Show(node);
					}
					
					if (window.ActiveXObject || SUI.fn.behaviour.ie == true) {
						if (!node.currentStyle || !node.currentStyle.hasLayout) {
							SUI.CSS.Set(node, "zoom", 1);
						}
						
						SUI.CSS.Set(node, "filter", (t[1] < 100 ? "alpha(opacity=" + t[1] + ")" : ""));
					} else {
						SUI.CSS.Set(node, "opacity", (t[1] / 100));
						SUI.CSS.Set(node, "MozOpacity", (t[1] / 100));
					}
				} catch(e) { 
					SUI.fn.logger("SUI.Ext.Animator.Fade failed: " + e);
				}
				
				var fn = this.oncomplete;
				if(SUI.fn.isfunction(fn)) {
					SUI.fn.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			} else if (t[0] != t[1]) {
				try {
					if (s == 0 && SUI.CSS.Get(node, "visibility") != "hidden") {
						SUI.CSS.Hide(node);
					} else if (s > 0 && SUI.CSS.Get(node, "visibility") == "hidden") {
						SUI.CSS.Show(node);
					}
					
					if (window.ActiveXObject || SUI.fn.behaviour.ie == true) {
						if (!node.currentStyle || !node.currentStyle.hasLayout) {
							SUI.CSS.Set(node, "zoom", 1);
						}
						
						SUI.CSS.Set(node, "filter", (s < 100 ? "alpha(opacity=" + s + ")" : ""));
					} else {
						SUI.CSS.Set(node, "opacity", (s / 100));
						SUI.CSS.Set(node, "MozOpacity", (s / 100));
					}
				} catch(e) { 
					SUI.fn.logger("Animator.Fade failed: " + e);
				}
				this.transaction[0] = s;
			} else {
				var fn = this.oncomplete;
				if(SUI.fn.isfunction(fn)) {
					SUI.fn.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			}
		}
		return this;
	},
	__SIZE__: function() {
		var node = this.object;
		var does = this.does;
		var type = this.type;
		
		if (does.match(/^(width|height)$/)) {
			var t = this.transaction;
			this.actStep = (this.actStep + 1);
			this.prevEase = t[0];
			var s = this.__EASE__(t[0], t[1], this.step, this.actStep, this.ease);
			
			if(s === this.prevEase) {
				SUI.CSS.Set(node, does, t[1] + "px");
				
				if (type == "center") {
					if (does == "height") {
						var center = SUI.Dimension.Page.Center(10, t[1]);
						SUI.CSS.Set(node, "top", center[0] + "px");
					} else if (does == "width") {
						var center = SUI.Dimension.Page.Center(t[1], 10);
						SUI.CSS.Set(node, "left", center[1] + "px");
					}
				}
				var fn = this.oncomplete;
				if(SUI.fn.isfunction(fn)) {
					SUI.fn.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			} else if (t[0] != t[1]) {
				SUI.CSS.Set(node, does, s + "px");
				
				if (type == "center") {
					if (does == "height") {
						var center = SUI.Dimension.Page.Center(10, s);
						SUI.CSS.Set(node, "top", center[0] + "px");
					} else if (does == "width") {
						var center = SUI.Dimension.Page.Center(s, 10);
						SUI.CSS.Set(node, "left", center[1] + "px");
					}
				}
				this.transaction = [s, t[1]];
			} else {
				var fn = this.oncomplete;
				if(SUI.fn.isfunction(fn)) {
					SUI.fn.callback(this, fn);
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
	__SIZEBOTH__: function() {
		var node = this.object;
		var does = this.does;
		var type = this.type;
		var t = this.transaction;
		this.actStep = (this.actStep + 1);
		var s = this.__EASE__(t[0], t[1], this.step, this.actStep, this.ease);
		var u = this.__EASE__(t[2], t[3], this.step, this.actStep, this.ease);
		
		if (t[0] != t[1] || t[2] != t[3]) { 
			if (t[0] != t[1]) {
				SUI.CSS.Set(node, "width", s + "px");
				
				if (type == "center") {
					var center = SUI.Dimension.Page.Center(s, 10);
					SUI.CSS.Set(node, "left", center[1] + "px");
				}
				this.transaction[0] = s;
			} else {
				this.transaction[0] = t[1];
			}
			
			if (t[2] != t[3]){
				SUI.CSS.Set(node, "height", u + "px");
				
				if (type == "center") {
					var gctr = SUI.Dimension.Page.Center(10, u);
					SUI.CSS.Set(node, "top", center[1] + "px");
				}
				this.transaction[2] = u;
			} else {
				this.transaction[2] = t[3];
			}
		} else {
			var fn = this.oncomplete;
			if (SUI.fn.isfunction(fn)) {
				SUI.fn.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	__CUSTOM__: function() {
		var node = this.object;
		var t = this.transaction;
		var type = this.type;
		this.actStep = (this.actStep + 1);
		this.prevEase = t[0];
		var s = this.__EASE__(t[0], t[1], this.step, this.actStep, this.ease);
		
		if(s === this.prevEase) {
			if (SUI.fn.inArray(this.withPx, type)) {
				SUI.CSS.Set(node, type, t[1] + "px");
			} else {
				SUI.CSS.Set(node, type, t[1]);
			}
			
			var fn = this.oncomplete;
			if (SUI.fn.isfunction(fn)) {
				SUI.fn.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		} else if (t[0] !== t[1]) {
			if (SUI.fn.inArray(this.withPx, type)) {
				SUI.CSS.Set(node, type, s + "px");
			} else {
				SUI.CSS.Set(node, type, s);
			}
			
			this.transaction[0] = s;
		} else {
			var fn = this.oncomplete;
			if (SUI.fn.isfunction(fn)) {
				SUI.fn.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	__CUSTOMMOVE__: function() {
		var node = this.object;
		var t = this.transaction;
		var type = (this.type == "margin" ? "margin" : "position");
		this.actStep = (this.actStep + 1);
		
		var s = this.__EASE__(t[0], t[1], this.step, this.actStep, this.ease);
		var u = this.__EASE__(t[2], t[3], this.step, this.actStep, this.ease);
		
		if (t[0] != t[1] || t[2] != t[3]) {
			var does = "";
			
			if (t[0] != t[1]) {
				does = (type == "margin" ? "marginTop" : "top");
				SUI.CSS.Set(node, does, s + "px");
				this.transaction[0]	= s;
			} else { 
				this.transaction[0] = t[1];
			}
			
			if (t[2] != t[3]) {
				does = (type == "margin" ? "marginLeft" : "left");
				SUI.CSS.Set(node, does, u + "px");
				this.transaction[2]	= u;
			} else {
				this.transaction[2] = t[3];
			}
		} else {
			var fn = this.oncomplete;
			if(SUI.fn.isfunction(fn)) {
				SUI.fn.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	__EASE__: function(minval, maxval, t, a, p) {
		var i =  Math.ceil(minval + (Math.pow(((1 / t) * a), p) * (maxval - minval)));
		return i;
    },
	__GRID__: function() {
		var node = this.object;
		
		if(SUI.CSS.Get(node, "position")) {
			this.top = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "top")), 0);
			this.left = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "left")), 0);
		}
		
		this.width = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "width")), node.offsetWidth);
		this.height	= SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "height")), node.offsetHeight);
		
		var mT = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "marginTop")), 0);
		var mB = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "marginBottom")), 0);
		var mL = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "marginLeft")), 0);
		var mR = SUI.fn.pick(SUI.fn.toNumber(SUI.CSS.Get(node, "marginRight")), 0);
		var m = [];
		
		m = (SUI.CSS.Get(node, "margin") ? SUI.CSS.Get(node, "margin").split(" ") : [0, 0, 0, 0]);
		m[0] = SUI.fn.toNumber(m[0]);
		m[1] = (SUI.fn.isset(m[1]) || !isNaN(m[1]) ? SUI.fn.toNumber(m[1]) : m[0]);
		m[2] = (SUI.fn.isset(m[2]) || !isNaN(m[2]) ? SUI.fn.toNumber(m[2]) : m[0]);
		m[3] = (SUI.fn.isset(m[3]) || !isNaN(m[3]) ? SUI.fn.toNumber(m[3]) : m[1]);
		
		var mgT = (SUI.fn.isnull(mT) || isNaN(mT) ? 0 : mT);
		mgT = (SUI.fn.isnull(m[0]) || isNaN(m[0]) ? mgT : m[0]);
		var mgB = (SUI.fn.isnull(mB) || isNaN(mB) ? 0 : mB);
		mgB = (SUI.fn.isnull(m[2]) || isNaN(m[2]) ? marginBottom : m[2]);
		var mgL = (SUI.fn.isnull(mL) || isNaN(mL) ? 0 : mL);
		mgL = (SUI.fn.isnull(m[3]) || isNaN(m[3]) ? mgL : m[3]);
		var mgR = (SUI.fn.isnull(mR) || isNaN(mR) ? 0 : mR);
		mgR = (SUI.fn.isnull(m[1]) || isNaN(m[1]) ? mgR : m[1]);
		
		SUI.CSS.Setup(this.object, {
			"marginTop": mgT + "px",
			"marginBottom": mgB + "px",
			"marginLeft": mgL + "px",
			"marginRight": mgR + "px"
		});
		this.margin = [mgT, mgR, mgB, mgL];
		return this;
	}
};

SUI.namespace.include("Animator", SUI.Ext.Animator);

SUI.extend('fx', (function(spec, i) {
	var i = SUI.fn.pick(this.index, i);
	
	if (SUI.fn.isnull(i)) {
		SUI.fn.each(this.a$, function() {
			this.Fx(spec);
		});
	} else if (!!this.node[i]) {
		this.a$[i].Fx(spec);
	}
							  
	return this;
}));

SUI.extend('syncFx', (function(spec, i) {
	var i = SUI.fn.pick(this.index, i);
	
	if (SUI.fn.isnull(i)) {
		SUI.fn.each(this.a$, function(){
			this.Sync(spec);
		});
	} else if (!!this.node[i]) { 
		this.a$[i].Sync(spec);
	}
	
	return this;
}));

SUI.extend('queueFx', (function(spec, i) {
	var i = SUI.fn.pick(this.index, i);
	
	if (SUI.fn.isnull(i)) {
		SUI.fn.each(this.a$, function(){ 
			this.Queue(spec); 
		});
	} else if (!!this.node[i]) {
		this.a$[i].Queue(spec);
	}
	
	return this;
}));
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
SUI.Ext.include("Drag", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
});

SUI.Ext.Drag.prototype = {
	Initialize: function(js) {
		var node = this.object = SUI.fn.pick(js.object, js.node);
		var that = this;
		node.root = SUI.fn.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) {
			that.__START__(e);
		};
		
		node.hmode = SUI.fn.pick(js.hmode, true);
		node.vmode = SUI.fn.pick(js.vmode, true);
		node.hswap = SUI.fn.pick(js.hswap, false);
		node.vswap = SUI.fn.pick(js.vswap, false);
		node.minX = SUI.fn.pick(js.minX, null);
		node.maxX = SUI.fn.pick(js.maxX, null);
		node.minY = SUI.fn.pick(js.minY, null);
		node.maxY = SUI.fn.pick(js.maxY, null);
		
		if (isNaN(SUI.fn.toNumber(SUI.CSS.Get(node.root, "left")))) {
			SUI.CSS.Set(node.root, "left", "0px");
		}
		if (isNaN(SUI.fn.toNumber(SUI.CSS.Get(node.root, "top")))) { 
			SUI.CSS.Set(node.root, "top", "0px");
		}
		node.root.onDragStart = new Function();
		node.root.onDragEnd = new Function();
		node.root.onDrag = new Function();
	},
	clearDrag: function() {
		this.object = null;
	},
	__START__: function(e) {
		var that = this;
		var node = this.object;
		var e = this.__FIXE__(e);
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "top"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "left"));
		
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
			that.__ON__(e);
		};
		document.onmouseup = function(e){ 
			that.__END__(e);
		};
		
		return false;
	},
	__ON__: function(e) {
		var e = this.__FIXE__(e);
		var node = this.object;
		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "top"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "left"));
		var nx;
		var ny;
		
		ex = (node.minX != null ? Math.min(ex, node.mixMouseX) : ex);
		ex = (node.maxX != null ? Math.max(ex, node.maxMouseX) : ex);
		ey = (node.minY != null ? Math.min(ey, node.minMouseY) : ey);
		ey = (node.maxY != null ? Math.max(ey, node.maxMouseY) : ey);
		
		nx = x + ((ex - node.lastMouseX) * (node.hswap ? -1 : 1));
		ny = y + ((ey - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if (node.hmode) {
			SUI.CSS.Set(node.root, "left", nx + "px");
		} 
		if (node.vmode) {
			SUI.CSS.Set(node.root, "top", ny + "px");
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onDrag(nx, ny);
		
		return false;
	},
	__END__: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var r = node.root;
		r.onDragEnd(SUI.fn.toNumber(r.style.left), SUI.fn.toNumber(r.style.top), r);
		node = null;
	},
	__FIXE__: function(e) {
		if (SUI.fn.isnull(e)) 
			e = window.event;
		if (SUI.fn.isnull(e.layerX)) 
			e.layerX = e.offsetX;
		if (SUI.fn.isnull(e.layerY)) 
			e.layerY = e.offsetY;
		
		return e;
	}
};

// Shortern the Namespace
SUI.namespace.include("Drag", SUI.Ext.Drag);

SUI.extend('makeDraggable', (function(js, i) {
	var i = SUI.fn.pick(this.index, i);
	var js = (!js ? {} : js);
	
	this.__PUSH__(function() {
		if (!SUI.CSS.Get(this, "position")) {
			var t = SUI.Dimension.Node.Offset(this);
			SUI.CSS.Setup(this, {"position": "absolute", "top": t[2]+"px", "left": t[3]+"px"});
		}
		
		js.node = this;
		new SUI.Ext.Drag(js);
	}, i);
	return this;
}));

SUI.Ext.include("Drop", function() {
								 
});
SUI.namespace.include("Drop", SUI.Ext.Drop);
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Form
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
 
SUI.Ext.include("Form", function() {
	this.first = null;
	this.object = null;
	
	return this;
});

SUI.Ext.Form.prototype = {
	LiveValidate: function(node, custom) {
		var node = this.object = SUI.fn.pick(node, this.object);
		var el = SUI.Attr.Get(node, "id");
		var custom = SUI.fn.pick(custom, null);
		var post = "";
		var that = this;
		
		if(!!node) {
			var inputs = SUI("#" + el + " :input");
			
			inputs.blurs(function() {
				var errnode = SUI(this).siblings("span.form_error").first();
				if(errnode.count() == 1) {
					SUI.DOM.Remove(errnode.fetch());	
				}
				
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (SUI.fn.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
						
						if (SUI.fn.inArray(cl, "required") && SUI.fn.trim(this.value) === "") {
							err = "This field require an input!";
						}
						
						if (SUI.fn.inArray(cl, "string") && !SUI.Test.isString(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid alphanumeric!";
						} else if (SUI.fn.inArray(cl, "integer") && !SUI.Test.isInteger(this.value) && SUI.fn.trim(this.value) !== "") { 
							err = "This field require valid numbers!";
						} else if (SUI.fn.inArray(cl, "email") && !SUI.Test.isEmail(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid e-mail address!";
						}
						
						if(SUI.fn.inArray(cl, "custom") || SUI.fn.isset(custom)) {
							var id = SUI.Attr.Get(this, "id");
							if(SUI.fn.isset(custom[id])) {
								if(SUI.fn.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									
									if(!callback) { 
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								} else if(SUI.fn.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									
									if(!test) {
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								}
							}
						}
						
						if(err !== "") {
							that.__LIVERROR__(node, this, err);
						} else {
							SUI.Classes.Remove(this, "sui-form-error");
							
							var errnode = SUI(this).siblings("span.form_error").first();
							if(errnode.count() == 1) {
								SUI.DOM.Remove(errnode.fetch());	
							}
						}
						
						for (var i = 0; i < cl.length; i++) {
							if (cl[i].match(/(max|min|exact)\-(\d*)/)) {
								if (!SUI.Test.isLength(cl[i], this.value.length)) {
									var err = cl[i].split(/\-/);
									that.__LIVERROR__(node, this, "This field require " + err[0] + " of " + err[1] + " characters.", true);
								}
							}
						}
					}
				}
			});
		}
		
		if (SUI.fn.isset(this.first)) { 
			// stop form processing
			return false;
		} else {
			return true;
		}
	},
	__LIVERROR__: function(node, form, text, data) {
		// Mark first error occured!
		var form = SUI(form);
		var node = SUI(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "error"].join("_");
		var data = SUI.fn.pick(data, false);
		var that = this;
		
		if (!SUI.fn.finds(fid)) {
			form.appendClass("sui-form-error").parent().add("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.focus(function() {
				if(this.value != "") { 
					var obj = SUI(this).removeClass("sui-form-error");
					var errnode = obj.siblings("span.form_error").first();
					
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
				}
			});
		} else if (SUI.fn.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = form.siblings("span.form_error").first();
			var ohtml = errnode.html();
			
			if (ohtml.match(text) === false && SUI.fn.trim(ohtml) != "") {
				errnode.append(" " + text);
			}
			
			form.focus(function() {
				if (this.value != "") {
					var obj = SUI(this).removeClass("sui-form-error");
					var errnode = obj.siblings("span.form_error").first();
					
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
					
				}
			});
		}
	},
	Validate: function(node, custom) {
		var node = this.object = SUI.fn.pick(node, this.object);
		var el = SUI.Attr.Get(node, "id");
		var custom = SUI.fn.pick(custom, null);
		var post = "";
		this.first = null;
		var that = this;
		
		if(!!node) {
			var inputs = SUI("#" + el + " :input");
			
			inputs.each(function() {
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (SUI.fn.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
												
						if (SUI.fn.inArray(cl, "required") && SUI.fn.trim(this.value) === "") {
							err = "This field require an input!";
						}
						
						if (SUI.fn.inArray(cl, "string") && !SUI.Test.isString(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid alphanumeric!";
						} else if (SUI.fn.inArray(cl, "integer") && !SUI.Test.isInteger(this.value) && SUI.fn.trim(this.value) !== "") { 
							err = "This field require valid numbers!";
						} else if (SUI.fn.inArray(cl, "email") && !SUI.Test.isEmail(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid e-mail address!";
						}
						
						if(SUI.fn.inArray(cl, "custom") || SUI.fn.isset(custom)) {
							var id = SUI.Attr.Get(this, "id");
							
							if(SUI.fn.isset(custom[id])) {
								if(SUI.fn.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									
									if(!callback) {
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								} else if(SUI.fn.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									
									if(!test) {
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								} else {
									err	= SUI.fn.pick(custom[id]['err'], err);
								}
							}
						}
						
						if(err !== "") {
							that.__ERROR__(node, this, err);
						} else {
							SUI.Classes.Remove(this, "sui-form-error");
							var errnode = SUI(this).siblings("span.form_error").first();
							
							if(errnode.count() == 1) {
								SUI.DOM.Remove(errnode.fetch());	
							}
						}
						
						for (var i = 0; i < cl.length; i++) {
							if (cl[i].match(/(max|min|exact)\-(\d*)/)) {
								if (!SUI.Test.isLength(cl[i], this.value.length)) {
									var err = cl[i].split(/\-/);
									that.__ERROR__(node, this, "This field require " + err[0] + " of " + err[1] + " characters.", true);
								}
							}
						}
						
						// dump name and value to opt in querystring format ( &name=value )
						if (this.type.toLowerCase().match(/^(checkbox|radio)$/)) {
							// only add checked checkbox input
							if (this.type == "checkbox" && this.checked == true) 
								post += "&" + this.name + "=" + SUI.Parser.HTML.to(this.value);
							// only add checked radiobox input
							else if (this.type == "radio" && this.checked == true) 
								post += "&" + this.name + "=" + SUI.Parser.HTML.to(this.value);
						} else 
							post += "&" + this.name + "=" + SUI.Parser.HTML.to(this.value);  // add all input (except radio/checkbox)
					}
				}
			});
		}
		
		if (SUI.fn.isset(this.first)) { 
			// there an error, set focus to first invalid field
			this.first.focus();
			// stop form processing
			return false;
		} else {
			return post; // return all field data in querystring formatting
		}
	},
	__ERROR__: function(node, form, text, data) {
		// Mark first error occured!
		this.first = (SUI.fn.isnull(this.first) ? node : this.first);
		
		var form = SUI(form);
		var node = SUI(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "_error"].join("");
		var data = SUI.fn.pick(data, false);
		var that = this;
		
		if (!SUI.fn.finds(fid)) {
			form.appendClass("sui-form-error").parent().add("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.changes(function() {
				if(this.value != "") { 
					var obj = SUI(this).removeClass("sui-form-error");
					
					var errnode = obj.siblings("span.form_error").first();
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
					that.first = null;
				}
			});
		} else if (SUI.fn.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = form.siblings("span.form_error").first();
			ohtml = form.html();
			
			if (ohtml.match(text) === false && SUI.fn.trim(ohtml) != "") {
				errnode.append(text);
			}
			
			form.changes(function() {
				if (this.value != "") {
					var obj = SUI(this).removeClass("sui-form-error");
					
					var errnode = obj.siblings("span.form_error").first();
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
					that.first = null;
				}
			});
		}
	},
	Post: function(js) {
		// form object
		var object = SUI.fn.pick(js.object, js.node);
		// choose to use object
		var node = SUI.fn.prepare(object, js.element, "object");
		// add custom field validation
		var custom = SUI.fn.pick(js.custom, null);
		// onsuccess function
		var ifn = SUI.fn.pick(js.onsuccess, js.onstart, null);
		// onfaild function
		var ffn = SUI.fn.pick(js.onfail, null);
		// validate selected form
		var post = this.Validate(node, custom);
		// parameters
		var parameter = SUI.fn.pick(js.parameters, js.params, "");
		
		if (post) {
			// callback to onsuccess function
			if (SUI.fn.isfunction(ifn)) {
				ifn();
			}
			
			parameter += (SUI.fn.trim(post) !== "" ? post : "");
			
			// send XHR request
			new SUI.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "POST"
			});
			
			return true;
		} else {
			// callback to onfail function
			if (SUI.fn.isfunction(ffn)) {
				ffn();
			}
			return false;
		}
	},
	Get: function(js) {
		// form object
		var object = SUI.fn.pick(js.object, js.node);
		// choose to use object
		var node = SUI.fn.prepare(object, js.element, "object");
		// add custom field validation
		var custom = SUI.fn.pick(js.custom, null);
		// onsuccess function
		var ifn = SUI.fn.pick(js.onsuccess, js.onstart, null);
		// onfaild function
		var ffn = SUI.fn.pick(js.onfail, null);
		// validate selected form
		var get = this.Validate(node, custom);
		// parameters
		var parameter = SUI.fn.pick(js.parameters, js.params, "");
		
		if (get) {
			// callback to onsuccess function
			if (SUI.fn.isfunction(ifn)) {
				ifn();
			}
			
			parameter += (SUI.fn.trim(get) !== "" ? post : "");
			
			// send XHR request
			new SUI.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "GET",
				cache: false
			});
			
			return true;
		} else {
			// callback to onfail function
			if (SUI.fn.isfunction(ffn)) {
				ffn();
			}
			return false;
		}
	}
};

SUI.namespace.include("Form", SUI.Ext.Form);

SUI.Ext.include("Effect", function() {

});
SUI.namespace.include("Effect", SUI.Ext.Effect);
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
 
SUI.Ext.include("Resize", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
});

SUI.Ext.Resize.prototype = {
	Initialize: function(js) {
		var that = this;
		var node = this.object = SUI.fn.pick(js.object, js.node);
		node.root = SUI.fn.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) { 
			that.__START__(e);
		};
		
		node.hmode = SUI.fn.pick(js.hmode, true);
		node.vmode = SUI.fn.pick(js.vmode, true);
		node.hswap = SUI.fn.pick(js.hswap, false);
		node.vswap = SUI.fn.pick(js.vswap, false);
		node.minX = SUI.fn.pick(js.minX, null);
		node.minY = SUI.fn.pick(js.minY, null);
		node.maxX = SUI.fn.pick(js.maxX, null);
		node.maxY = SUI.fn.pick(js.maxY, null);
		
		node.root.onResizeStart = new Function();
		node.root.onResizeEnd = new Function();
		node.root.onResize	= new Function();
	},
	clearResize: function() {
		this.object = null;
	},
	__START__: function(e) {
		var that = this;
		var node = this.object;
		var e = this.__FIXE__(e);
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "height"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "width"));
		
		node.root.onResizeStart(x, y);
		node.lastMouseX = e.clientX;
		node.lastMouseY = e.clientY;
		
		node.minMouseX = (node.minX != null ? (e.clientX - x + node.minX) : null);
		node.maxMouseX = (node.maxX != null ? (node.minMouseX + node.maxX - node.minX) : null);
		node.minMouseY = (node.minY != null ? (e.clientY - y + node.minY) : null);
		node.maxMouseY = (node.maxY != null ? (node.minMouseY + node.maxY - node.minY) : null);
		
		document.onmousemove = function(e) {
			that.__ON__(e);
		};
		document.onmouseup = function(e) {
			that.__END__(e);
		};
		
		return false;
	},
	__ON__: function(e) {
		var e = this.__FIXE__(e);
		var node = this.object;
		var ey = e.clientY;
		var ex = e.clientX;
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "height"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "width"));
		var ow = x;
		var oh = y;
		var nx;
		var ny;
		
		ex = (node.minX != null ? Math.max(ex, node.minMouseX) : ex);
		ex = (node.maxX != null ? Math.min(ex, node.maxMouseX) : ex);
		ey = (node.minY != null ? Math.max(ey, node.minMouseY) : ey);
		ey = (node.maxY != null ? Math.min(ey, node.maxMouseY) : ey);
		
		nx = x + ((ex - node.lastMouseX) * (node.hswap ? -1 : 1));
		ny = y + ((ey - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if (node.hmode) {
			SUI.CSS.Set(node.root, "width", (ow + (nx - x)) + "px");
		} else {
			nx = x = 0;
		}
		
		if(node.vmode) {
			SUI.CSS.Set(node.root, "height", (oh + (ny - y)) + "px");
		} else {
			ny = y = 0;
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onResize(Math.round(nx - x), Math.round(ny - y));
		
		return false;
	},
	__END__: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var r = node.root;
		r.onResizeEnd(SUI.fn.toNumber(r.style.width), SUI.fn.toNumber(r.style.height), r);
		node = null;
	},
	__FIXE__: function(e) {
		if (SUI.fn.isnull(e)) { 
			e = window.event;
		}
		if (SUI.fn.isnull(e.layerX)) {
			e.layerX = e.offsetX;
		}
		if (SUI.fn.isnull(e.layerY)) { 
			e.layerY = e.offsetY;
		}
		return e;
	},
	childResize: function(js){
		var parNode = js.object;
		var chiNode = js.child;
		
		SUI.fn.each(chiNode, function() {
			try { 
				SUI.CSS.Set(this, "width", (SUI.fn.toNumber(SUI.CSS.Get(this, "width")) + js.width)+"px");
			} catch(e) { /* on failed continue */ }
			
			SUI.CSS.Set(this, "height", (SUI.fn.toNumber(SUI.CSS.Get(this, "height")) + js.height)+"px");
		});
	}
};

SUI.namespace.include("Resize", SUI.Ext.Resize);

SUI.extend('makeResizable', (function(js, i) {
	var i = SUI.fn.pick(this.index, i);
	var js = (!js ? {} : js);
		
	this.__PUSH__(function() {
		if(!SUI.CSS.Get(this, "width")) {
			var t = SUI.Dimension.Node.Offset(this);
			SUI.CSS.Setup(this, {"width": t[0]+"px", "height": t[1]+"px", "cursor": "move"});
		}
		js.node = this;
		new SUI.Ext.Resize(js);
	}, i);
	return this;
}));
SUI.namespace.include("array", SUI.JsClass.create({
	ext: Array.prototype,
	__construct: function(s) {
		this._super = s;
		this.value = this._super;
		return this;
	},
	exec: function(m, arg) {
		var args = SUI.fn.toArray(arguments, 1);
		var s = this._super;
		s = new Array(s);
		s = s[m].apply(s, args);
		this._super = s;
		return this;
	},
	append: function(value) {
		var len = this._super.length;
		this._super[len] = value;
	}
}));
SUI.Tool.include("Debugger", function() {
	SUI.fn.debug = true;
	var div = SUI.Query.create("div#sui-debugger");
	SUI.DOM.Add(div);
		
	var object = SUI.Query.create("ul");
	SUI.DOM.Add(div, object);
	SUI.CSS.Hide(object);
	SUI.fn.logobject = object;
	SUI.fn.logger = function(text) {
		var text = SUI.fn.trim(text);
		SUI.fn.logs.push(text);
		
		try {
			console.log(text);	
		} catch(e) { 
			// do nothing
		}
		var li = SUI.Query.create("li", SUI.fn.logobject);
		SUI.DOM.AddText(li, text);
		SUI.DOM.Add(object, li);
		
		if(!!SUI.Widget.Message) {
			SUI.Widget.Message.Add({text: text, type: "error"});	
		}
	};
});SUI.namespace.include("number", SUI.JsClass.create({
	ext: Number.prototype,
	__construct: function(s) {
		this._super = s;
		this.value = this._super;
		return this;
	},
	exec: function(m, arg) {
		var args = SUI.fn.toArray(arguments, 1);
		var s = this._super;
		s = new Number(s);
		s = s[m].apply(s, args);
		this._super = s;
		return this;
	}
}));SUI.namespace.include("string", SUI.JsClass.create({
	ext: String.prototype,
	value: null,
	__construct: function(s) {
		var that = this;
		this.value = this._super = s;
		return this;
	},
	exec: function(m, args) {
		var args = SUI.fn.toArray(arguments, 1);
		var s = this._super;
		s = new String(s);
		s = s[m].call(s, args);
		this.value = this._super = s;
		return this;
	},
	trim: function() {
		this.value = this._super = SUI.fn.trim(this._super);
		return this;
	},
	htmlEntities: function() {
		this.value = this._super = SUI.fn.htmlEntities(this._super);
		return this;
	},
	stripTags: function () {
		this.value = this._super = SUI.fn.stripTags(this._super);
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

SUI.Util.include("Anchor", SUI.JsClass.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	sel: null,
	option: null,
	__construct: function(sel) {
		this.sel = SUI.fn.pick(sel, null);
		
		if(SUI.fn.isset(this.sel)) {
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
		if(SUI.fn.isset(this.interval)) {
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.sel = null;
		this.__destruct();
		return null;
	},
	selector: function() {
		var that = this;
		
		SUI(this.sel).clicks(function() {
			var h = SUI(this).get("href");
			var an = (SUI.fn.isset(h) ? h : this.href);
			
			if(an.match(/^\#/)) {
				var a = ["", an.substring(1, an.length)];
			} else { 
				var a = an.split(/\#/);
			}
			
			if(SUI.fn.isset(a[1])) {
				that.repeat = (a[1] === that.last);
				
				that.last = a[1];
				var i = a[1].split(/\//);
				that.init(i);
			}
		});
	},
	check: function() {
		if(location.hash != this.last && location.hash !== "#/" && location.hash !== "#"){
			this.last = location.hash;
			var i;
			i = location.hash.substring(1, location.hash.length).split(/\//);
			this.init(i);
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

SUI.Util.include("AutoComplete", function(spec) {
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
	this.ctimeout = null;
	this.status = 0;
	
	if(typeof(spec) === "object") {
		this.Initialize(spec);
	}
	
	return this;
}).prototype = {
	Initialize: function(spec) {
		var that = this;
		
		this.element = SUI.fn.pick(spec.element, this.element);
		this.separator = SUI.fn.pick(spec.separator, this.separator);
		this.object = SUI.fn.pick(spec.object, this.object);
		this.minimum = SUI.fn.pick(spec.minimum, this.minimum);
		this.delay = SUI.fn.pick(spec.delay, this.delay);
		this.uri = SUI.fn.pick(spec.uri, this.uri);
		this.type = SUI.fn.pick(spec.type, this.type);
		
		this.method = (SUI.fn.inArray(['post','get'], spec.method.toLowerCase()) ? spec.method.toUpperCase() : 'GET'); 
		
		if (!!this.element) {
			this.object = SUI(this.element);
		} else {
			this.object = SUI(this.object);
		}
		
		this.name = this.object.get("name");
		
		this.object.keyups(function() {
			if(that.timeout) {
				clearTimeout(that.timeout);
				that.timeout = null;
			}
			that.matched = [];
			
			if(that.type === "multiple") {
				var values = this.value;
				var val = values.split(that.separator);
				var len = val.length;
				var value = SUI.fn.trim(val[(len - 1)]);
				
				for(var i = 0; i < (len - 1); i++) {
					that.matched.push(SUI.fn.trim(val[i]));
				}
			} else {
				var value = SUI.fn.trim(this.value);	
			}
			
			if(value.length > that.minimum && value !== that.value) {
				that.timeout = window.setTimeout((function() {
					that.__SHOW__(value);
				}), that.delay);
			}
		}).blurs(function() {
			that.ctimeout = window.setTimeout((function() {
				that.status = 0;
				that.__HIDE__();
			}), 5000);
		});
		
		return this;
	},
	__SHOW__: function(value) {
		var that = this;
		this.status = 1;
		
		if(!!this.div) {
			SUI.DOM.Remove(this.div.fetch());
			this.div = null;
		}
		this.div = SUI("body").first().add("div", {
			"id": ["autocomplete", this.name].join("_"),
			"class": "x-autocomplete"
		}).hide();
		
		var t = SUI.Dimension.Node.Offset(this.object.fetch());
		this.div.css({
			"left": t[3] + "px",
			"top": (t[1] + t[2]) + "px",
			"width": t[0] + "px"
		});
		
		new SUI.Ext.Ajax({
			uri: this.uri,
			method: this.method,
			parameters: "&" + that.name + "=" + value,
			onComplete: (function() {
				that.__XHR__(this);
			})
		});
		
		this.value = value;
	},
	__HIDE__: function() {
		if(!!this.div && this.status === 0) {
			SUI.DOM.Remove(this.div.fetch());
			this.div = null;
			clearTimeout(this.ctimeout);
			this.ctimeout = null;
		}
	},
	__XHR__: function(data) {
		var that = this;
		if(data.readyState === 4 && data.status === 200) {
			var text = data.responseText;
			that.div.html("");
			var reply = eval("(" + text + ")");
			var ul = that.div.add("ul");
			
			var arr = SUI.fn.toArray(reply);
			
			if(arr.length >= 2 || (arr.length === 1 && SUI.fn.trim(arr[0]) !== "")) {
				SUI.fn.each(arr, function() {
					if(SUI.fn.trim(this) !== "") {
						var li = ul.add("li");
						var a = li.add("a", {
							"href": "#"
						}).text(this).clicks(function() {
							clearTimeout(that.ctimeout);
							that.ctimeout = null;
							that.status = 1;
							
							var value = SUI(this).html();
							that.matched.push(value);
							that.object.val(that.matched.join(", "));
							that.status = 0;
							that.__HIDE__();
							return false;
						});
					}
				});
				
			} else {
				var li = ul.add("li");
				var a = li.add("a", {"href": "#"}).text("No match").clicks(function() {
					that.status = 0;
					that.__HIDE__();																	
				}).mouseovers(function() {
					that.status = 0;
					that.__HIDE__();
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
/*
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
SUI.Util.include("Ticker", function(sel) {
	// Define Object's properties
	this.element = null;
	this.node = null;
	
	// start __constructor()
	if (!!sel && SUI.fn.trim(sel) !== "") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	// Initialize the HTML Element
	Initialize: function(sel) {
		this.element = SUI.fn.pick(sel, "");
		
		if (SUI.fn.isset(this.element)) { 
			this.node = SUI(this.element);
		}
		
		return this;
	},
	// checked all checkbox
	Check: function() {
		// loop all object
		this.node.each(function() {
			// set checked to true
			this.checked = true;
		});
	},
	// uncheck all checkbox
	Uncheck: function() {
		// loops all object
		this.node.each(function() { 
			// set checked to false
			this.checked = false;
		});
	},
	// invert checkbox selection
	Invert: function() {
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
 * Name: SUI.Widget.Calendar
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

SUI.Widget.include("Calendar", function(js) {
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
	
	this._DATE_ = new Date();
	this.date = "";
	this.day = null;
	this.month = null;
	this.year = null;
	
	if (js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		this.element = SUI.fn.prepare(js.object, js.element);
		var regexp = new RegExp(/^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
		this.renderTo = SUI.fn.pick(js.renderTo, this.renderTo);
		
		if (!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) {
			this.renderTo = SUI("body").first().add("div");
		} else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = SUI(this.renderTo).first();
		}
		
		js.range = SUI.fn.pick(js.range, this.range, [null, null]);
		this.field = SUI.fn.pick(js.field, this.field, "value");
		this.type = SUI.fn.pick(js.type, this.type, "single");
		
		if (!!js.mindate && regexp.test(js.mindate)) {
			this.mindate = SUI.fn.pick(js.mindate, null);
		}
		
		if (!!js.maxdate && regexp.test(js.maxdate)) {
			this.maxdate = SUI.fn.pick(js.maxdate, null);
		}
		
		if (!!js.value && regexp.test(js.value)) {
			var tdate = js.value.split("-");
			js.month = tdate[1];
			js.year = tdate[0];
			js.day = tdate[2];
		} else if (!!js.value && js.value === "today") {
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this._DATE_.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this._DATE_.getFullYear() : js.year);
		this.day = SUI.fn.pick(js.day, this.day);
		
		this.date = [this.year, (this.month + 1), SUI.fn.pick(this.day, 1)].join("-");
		this.onupdate = SUI.fn.pick(js.onUpdate, null);
		this.navigation = SUI.fn.pick(js.navigate, true);
		
		if (this.navigation == true) {
			if (!js.range[0] || js.range[0].toLowerCase() == "now") {
				js.range[0] = this._DATE_.getFullYear();
			} else if (SUI.Test.isInteger(js.range[0]) && (js.range[0] > 1000 && js.range[0] < 9999)) {
				js.range[0] = js.range[0];
			} else if (js.range[0].charAt(0) == "-") {
				js.range[0] = (this._DATE_.getFullYear() + SUI.fn.toNumber(js.range[0]));
			} else if (js.range[0].charAt(0) == "+") {
				js.range[0] = (this._DATE_.getFullYear() + SUI.fn.toNumber(js.range[0]));
			}
			
			if (!js.range[1] || js.range[1].toLowerCase() == "now") {
				js.range[1] = this._DATE_.getFullYear();
			} else if (SUI.Test.isInteger(js.range[1]) && (js.range[1] > 1000 && js.range[1] < 9999)) {
				js.range[1] = s_.range[1];
			} else if (js.range[1].charAt(0) == "-") {
				js.range[1] = (this._DATE_.getFullYear() + (SUI.fn.toNumber(js.range[1]) + 0));
			} else if (js.range[1].charAt(0) == "+") {
				js.range[1] = (this._DATE_.getFullYear() + SUI.fn.toNumber(js.range[1]));
			}
			
			if (js.range[0] < js.range[1]) {
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.__MAXYEAR__(js.range[0]), this.__MINYEAR__(js.range[1])];
		}
		
		this.drag = SUI.fn.pick(js.draggable, false);
		this.renderTo.html("");
		this.__CALLBACK__();
		
		return this;
	},
	__MINYEAR__: function(y) {
		var ret = y;
		if (this.mindate) {
			var md = this.mindate.split("-");
			var ny = SUI.fn.toNumber(md[0]);
			
			if(ny > ret) { 
				ret = ny;
			}
		}
		return ret;	
	},
	__MAXYEAR__: function(y) {
		var ret = y;
		if (this.maxdate) {
			var md = this.maxdate.split("-");
			var ny = SUI.fn.toNumber(md[0]);
			
			if(ny < ret) {
				ret = ny;
			}
		}
		return ret;
	},
	__PREVMONTH__: function() {
		this.day = null;
		this._DATE_ = new Date(this.year, (this.month - 1));
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()) {
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, (this.month + 1));
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	__PREVYEAR__: function() {
		this.day = null;
		this._DATE_ = new Date((this.year - 1), this.month);
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()) {
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date((this.year + 1), this.month);
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	__NEXTMONTH__: function() {
		this.day = null;
		this._DATE_ = new Date(this.year, (this.month + 1));
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()) {
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, (this.month - 1));
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	__NEXTYEAR__: function() {
		this.day = null;
		this._DATE_ = new Date((this.year + 1), this.month);
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()){
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date((this.year - 1), this.month);
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	__CUSTOMMONTH__: function(data) {
		this.day = null;
		this._DATE_ = new Date(this.year, data);
		var tmpmonth = this._DATE_.getMonth();
		var tmpyear = this._DATE_.getFullYear();
		this.date = [tmpyear, (tmpmonth + 1), this.__DOM__(tmpmonth, tmpyear)].join("-");
		
		if (this.__VALIDATE__()) {
			this.year = tmpyear;
			this.month = tmpmonth;
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		}
		return this;
	},
	__CUSTOMYEAR__: function(data) {
		this.day = null;
		this._DATE_ = new Date(data, this.month);
		var tmpmonth = this._DATE_.getMonth();
		var tmpyear = this._DATE_.getFullYear();
		this.date = [tmpyear, (tmpmonth + 1), this.__DOM__(tmpmonth, tmpyear)].join("-");
		
		if (this.__VALIDATE__()) {
			this.year = tmpyear;
			this.month = tmpmonth;
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		}
		return this;
	},
	__TODAY__: function() {
		this._DATE_ = new Date();
		this.year = this._DATE_.getFullYear();
		this.month = this._DATE_.getMonth();
		this.day = this._DATE_.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		this.renderTo.html("Regenerating Calendar...");
		this.__CALLBACK__();
	},
	__VALIDATE__: function() {
		var ret = false;
		var mi = SUI.fn.isset(this.mindate);
		var ma = SUI.fn.isset(this.maxdate);
		
		if (mi && ma && this.Compare(this.mindate, this.date) && this.Compare(this.date, this.maxdate)) {
			ret = true;
		} else if (mi && this.Compare(this.mindate, this.date)) {
			ret = true;
		} else if (ma && this.Compare(this.date, this.maxdate)) {
			ret = true;
		} else if (!mi && !ma) {
			ret = true;
		}
		
		return ret;
	},
	__DOM__: function(m, y) {
		var m = SUI.fn.pick(m, this.month);
		var y = SUI.fn.pick(y, this.year);
		
		if (m == 1 && (y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
			var monthLength = 29;
		}
		
		return SUI.fn.pick(monthLength, this.daysinmonth[m]);
	},
	Compare: function(f, s) {
		var fD = f.split("-");
		var sD = s.split("-");
		
		var fDO = new Date(fD[0], (SUI.fn.toNumber(fD[1]) - 1));
		fDO.setDate(fD[2]);
		
		var sDO = new Date(sD[0], (SUI.fn.toNumber(sD[1]) - 1));
		sDO.setDate(sD[2]);
		
		return (sDO >= fDO ? true : false);
	},
	__UPDATE__: function(Y, m, d) {
		var f = SUI("#" + this.element + "_" + Y + m + d).first();
		var calf = SUI("#" + this.element + "_" + this.field);
		var mi = (m < 10 ? "0" + m : m);
		var di = (d < 10 ? "0" + d : d);
		
		if (this.type == "single") {
			if (!f.hasClass("calendar-day-selected")) {
				if (SUI.fn.isset(this.lastdate) && SUI.fn.finds(this.element + "_" + this.lastdate)) {
					var lastdate = SUI("#" + this.element + "_" + this.lastdate).set("class", "calendar-day");
				}
				
				f.setClass("calendar-day-selected");
				this.value = Y + "-" + mi + "-" + di;
				
				calf.val(this.value);
				this.lastdate = Y + "" + m + "" + d;
			} else {
				f.setClass("calendar-day");
				calf.val("");
			}
		} else if (this.type == "multiple") {
			var v = calf.val();
			var vs = v.split("|");
			
			if (SUI.fn.inArray(vs, Y + "-" + mi + "-" + di)){
				vs.splice(vs.indexOf(Y + "-" + mi + "-" + di), 1);
				v = vs.join("|");
				
				f.setClass("calendar-day");
				this.value = v;
				calf.val(v);
			} else {
				f.setClass("calendar-day-selected");
				
				if(vs.length > 0 && vs[0] != "") {
					vs[vs.length] = (Y + "-" + mi + "-" + di);
				} else {
					vs[0] = Y + "-" + mi + "-" + di;
				}
				
				this.value = vs.join("|");
				calf.val(this.value);
			}
		}
		
		var fn = this.onupdate;
		if(fn != null && typeof(fn) == "function") {
			SUI.fn.callback(this, fn);
		}
		
		return this;
	},
	__CALLBACK__: function() {
		var cal = this.renderTo;
		var that = this;
		var first_day = new Date(this.year, this.month, 1);
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.__DOM__();
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
		
		for (var i = 0; i <= 6; i++) {
			contrh.add("td").setClass("calendar-header-day").text(this.days[i]);
		}
		
		var day = 1;
		
		for (var i = 0; i < 6; i++) {
			var weeks = con.add("tr", {"class": "calendar-week"});
			
			for (var j = 0; j <= 6; j++) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = weeks.add("td", {"class": "calendar-" + (this.__VALIDATE__() ? "day" : "invalid")});
				
				if (day <= monthLength && (i > 0 || j >= start_day)) {
					days.set("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if (this.__VALIDATE__()) {
						days.clicks(function() {
							var i = SUI(this).get("id").split("_");
							var ym = that.year + "" + that.month;
							tday = i[1].substring((ym.length), i[1].length);
							that.__UPDATE__(that.year, (that.month + 1), SUI.fn.toNumber(tday));  
						});
					}
					
					if (day == this.day) {
						days.setClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + SUI.fn.toNumber(this.day);
					} 
					
					days.css("cursor", "pointer");
					
					days.html(day.toString());
					day++;
				} else {
					days.html("&nbsp;").setClass("calendar-invalid");
				}
			}
			
			if (day > monthLength) {
				break;
			}
		}
		
		var tf1 = tr3.add("td", {"class": "sui-panel-fl"}).html("&nbsp;");
		var tf2 = tr3.add("td", {"class": "sui-panel-footer"}).html("&nbsp;");
		var tf3 = tr3.add("td", {"class": "sui-panel-fr"}).html("&nbsp;");
		
		if (this.navigation == true) {
			prevbtn.setClass("prev-month").html("&nbsp;").clicks(function() {
				that.__PREVMONTH__();															  
			});
			
			nextbtn.setClass("next-month").html("&nbsp;").clicks(function() {
				that.__NEXTMONTH__();
			});
			var divmon = this.optnode = tc2.add("div", {"class": "calendar-content-selector"});
			
			divmon.add("p").text("Select a specific combination of month and year");
			
			var selmonth = divmon.add("select", {"name": "month"}).changes(function() {
				that.__CUSTOMMONTH__(this.value);							
			});
			
			for (var i = 0; i < 12; i++) {
				if(this.month == i) {
					selmonth.add("option", {"value": i, "selected": "selected"}).text(this.months[i]);
				} else {
					selmonth.add("option", {"value": i}).text(this.months[i]);
				}
			}
			
			var selyear = divmon.text(" ").add("select", {"name": "year"}).changes(function() {
				that.__CUSTOMYEAR__(this.value);									
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
			}).clicks(function() {
				that.__TODAY__();													
			});
			
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
			SUI.Hash.Set(this.element, "toggle", 1);
			
			title.css("cursor", "pointer").clicks(function() {
				var i = SUI.Hash.Get(that.element, "toggle");
				
				if(i === 1) {
					that.calnode.css("display", "none");
					that.optnode.css("display", "block");
					
					SUI.Hash.Set(that.element, "toggle", 0);
				} else {
					that.optnode.css("display", "none");
					that.calnode.css("display", "block");
					
					SUI.Hash.Set(that.element, "toggle", 1);
				}
			});
		} else {
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (SUI.fn.isset(this.field)) {
			var input = tf2.add("input", {
				"id": [this.element, this.field].join("-"),
				"name": this.field,
				"type": this.fieldtype
			});
			
			if (SUI.fn.isset(this.day)) {
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastdate = [this.year, (this.month + 1), SUI.fn.toNumber(this.day)].join("");
			}
		}
		return this;
	}
};

SUI.Util.include("Calendar", SUI.Widget.Calendar);
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Utils.DropMenu
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

SUI.Widget.include("DropMenu", function(sel) {
	this.object = null;
	this.node = null;
	this.lastnode = null;
	this.content = null;
	this.child = null;
	this.status = 0;
	
	if (!!sel && typeof(sel) === "string") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	Initialize: function(sel) {
		if (!!sel && SUI.fn.trim(sel) !== "") {
			var that = this;
			this.object = SUI(sel);
			var mList = SUI(sel + " ul > li > a");
			
			mList.each(function() {
				SUI(this).hovers(function() {
					that.node = this.parentNode;
					that.__SHOW__(sel, this.parentNode);
				}, function() {
					that.status = 0;
					setTimeout((function() { 
						that.__HIDE__(sel);
					}), 5);
				}).done();
			});
		}
		return this;
	},
	__SHOW__: function(sel, node) {
		var that = this;
		var sUL = SUI("> ul", node);
		if (sUL.count() > 0) {
			this.status = 1;
			var t = SUI.Dimension.Node.Offset(node);
			
			if (SUI.fn.finds([sel,"menucontainer"].join("_")) && SUI.fn.isset(this.child)) {
				if(SUI.fn.isset(this.lastnode)) {
					SUI(this.lastnode).insert(this.content);
					this.lastnode = null;
				}
				
				SUI.DOM.Remove(this.child.first().fetch());
				this.child = null;
			}
			
			this.child = SUI("body").insertion("div").css("visibility", "hidden").alpha(0);
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
					"left":t[3] + "px",
					"top":(t[1] + t[2] - 4) + "px",
					"height":"0px"
				}).fx({
					method:"fade",
					transaction:[0, 97],
					ease:1.3,
					step:40,
					shutter:40
				}).syncFx({
					method:"resizeHeight",
					transaction:[0, h],
					ease:0.9,
					step:100,
					shutter:20
				});
				
			}
			this.lastnode = node;
			
			this.child.hovers(function() {
				that.status = 1;
				that.node = node;
			}, function() {
				if(SUI.fn.finds([sel, "menucontainer"].join("_"))) {
					that.status = 0;
					setTimeout((function() {
						that.__HIDE__(sel);
					}), 5);
				}
			}).done();
		}
		sUL.done();
	},
	__HIDE__: function(sel) {
		if (this.status == 0) {
			if (SUI.fn.isset([sel, "menucontainer"].join("_")) && SUI.fn.isset(this.child)) {
				if (SUI.fn.isset(this.lastnode)) {
					SUI(this.lastnode).insert(this.content).done();
					this.lastnode = null;
				}
				
				SUI.DOM.Remove(this.child.first().fetch());
				this.child = null;
			}
		}
	}
};

SUI.Util.include("DropMenu", SUI.Widget.DropMenu);
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Widget.Message
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

SUI.Widget.include("Message", {
	node: null,
	Add: function(spec) {
		if(SUI.fn.isnull(this.node)) {
			this.Initialize();
		}
		var that = this;
		var text = SUI.fn.pick(spec.text, "");
		var timeout = SUI.fn.pick(spec.timeout, 5000);
		var type = SUI.fn.pick(spec.type, "note");
		var closable = SUI.fn.pick(spec.closable, true);
		
		timeout = (SUI.Test.isInteger(timeout) ? timeout : 5000);
		
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
				span.clicks(function() {
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
	Initialize: function() {
		this.node = SUI("body").first().add("div", {"id": "sui-message"}).show();
	}
});
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Widget.Panel
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Resize
*/

SUI.Widget.include("Panel", function(js) {
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
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		// Set Object's properties value for usage
		this.width = SUI.fn.pick(js.width, this.width);
		this.height = SUI.fn.pick(js.height, this.height);
		this.layout = SUI.fn.pick(js.layout, this.layout);
		this.title = SUI.fn.pick(js.title, this.title);
		this.renderTo = SUI.fn.pick(js.renderTo, this.renderTo);
		this.allowClose = SUI.fn.pick(js.allowClose, this.allowClose);
		this.allowMinimize = SUI.fn.pick(js.allowMinimize, this.allowMinimize);
		this.allowResize = SUI.fn.pick(js.allowResize, this.allowResize);
		this.scrolling = SUI.fn.pick(js.scrolling, this.scrolling);
		this.css = SUI.fn.pick(js.css, this.css);
		this.onclose = SUI.fn.pick(js.onClose, null);
		
		// set renderTo DOM.Element
		if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = SUI("body").first();
		} else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = SUI(this.renderTo).first();
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
		if (SUI.fn.isset(this.width)) {
			this.object.css("width", this.width + "px");
		}
		
		// set TABLE height
		if (SUI.fn.isset(this.height)) {
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
			}).clicks(function() {
				that.Close();
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
		if(SUI.fn.isset(this.height) && !!this.scrolling) {
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
			new SUI.Ext.Resize({
				object: tf2.fetch(),
				objectRoot: that.object.fetch(),
				hmode: false
			});
			// enable bottom (horizontal only) resizing
			new SUI.Ext.Resize({
				object: tc3.fetch(),
				objectRoot: that.object.fetch(),
				vmode: false
			});
			// enable bottom-right resizing
			new SUI.Ext.Resize({
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
				SUI(that).css("width", that.width + "px");
				SUI(that).css("height", that.height + "px");
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
	Close: function() {
		// callback to close panel
		var fn = this.onclose;
		if (SUI.fn.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		this.object.done();
		return this;
	},
	fixResize: function() {
		if(SUI.fn.isset(this.height) && !!this.scrolling) {
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
 * Name: SUI.Widget.SimpleTab
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

SUI.Widget.include("SimpleTab", function(sel) {
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.object = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	
	// start __constructor()
	if(SUI.fn.typeOf(sel) === "object" || SUI.fn.typeOf(sel) === "string") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	Initialize: function(sel) {
		var that = this;
		this.object = SUI(sel);
		this.object.setClass("simpletab-container");
		this.element = this.object.first().get("id");
		
		var child = this.object.has("div.x-simpletab-panel");
		var h = window.location.hash;
		
		if(h.match(/^#(.+)/)) {
			var hashtab = this.object.has(h);
			if(hashtab.count() > 0) {
				this.activeTab = hashtab;
			} else {
				this.activeTab = SUI(child.first().fetch());
			}
		} else {
			this.activeTab = SUI(child.first().fetch());
		}
		
		this.__TOOLBAR__(this.element);
		
		child.each(function() {
			that.__HEADER__(this);
			SUI(this).setClass("simpletab-hidden");			
		});
			
		this.activeHeader = SUI("a[href=#" + this.activeTab.get("id") + "]");
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
	},
	makeActive: function(hash) {
		
	},
	addTab: function(spec) {
		var that = this;
		if(!!spec.id && SUI.fn.typeOf(spec.id) === "string") {
			var title = SUI.fn.pick(spec.title, "Untitled");
			var id = spec.id;
			var content = SUI.fn.pick(spec.content, "");
			var closable = SUI.fn.pick(spec.closable, false);
			var set = SUI.fn.pick(spec.activate, false);
			
			var obj = this.object.add("div", {"id": id, "class": "simpletab-hidden"}).html(content);
			var li = this.header.add("li");
			var a = li.add("a", {
				"href": "#" + id,
				"title": title
			});
			a.add("em");
			a.text(title).clicks(function() {
				that.__ACTIVE__(this);
			});
			
			if (!!closable) {
				a.add("span").css("paddingLeft", "10px").text("x").clicks(function() { // clicks to mouseovers
					var href = SUI(this.parentNode).get("href");
					that.activeHeader.setClass("").done();
					that.activeTab.setClass("simpletab-hidden").done();
					that.object.remove(SUI(href).fetch());
					SUI.DOM.Remove(this.parentNode.parentNode);
					
					//that.__REVERT__();
				});
			}
			if(!!set) {
				this.__ACTIVE__(obj);
			}
		}
		return this;
	},
	__TOOLBAR__: function(el) {
		var div = SUI("body").first().add("div", {
			"class": "simpletab-toolbar-container",
			"id": this.element + "toolbar"
		});
		
		SUI.DOM.AddBefore(div.fetch(0), this.object.fetch());
		this.toolbar = div;
		
		this.header = this.toolbar.add("ul", {
			"id": [el, "toolbar"].join("-"),
			"class": "simpletab-toolbar"
		});
		var div2 = div.add("div").css("display", "block");
	},
	__ACTIVE__: function(obj) {
		var that = this;
		this.activeHeader.setClass("");
		this.activeTab.setClass("simpletab-hidden");
		
		this.activeHeader = SUI(obj);
		var href = this.activeHeader.get("href");
		this.activeTab = SUI(href);
		
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
		window.location.hash = href;
	},
	__REVERT__: function() {
		var activecon = this.header.has("li > a");
		if(activecon.count() > 0) {
			this.__ACTIVE__(activecon.first().fetch());
		}
	},
	__HEADER__: function(obj) {
		var that = this;
		var obj = SUI(obj);
		var title = obj.get("title");
		var closable = obj.hasClass("tab-closable");
		
		var li = this.header.insertion("li");
		
		var a = li.add("a", {
			"href": "#" + obj.get("id"),
			"title": title
		});
		
		a.add("em");
		a.text(title).clicks(function() {
			that.__ACTIVE__(this);
		});
		
		if (!!closable) {
			a.add("span").css("paddingLeft", "10px").text("x").clicks(function() {
				var my = SUI(this.parentNode).clicks(function() { return false; });
				
				var href = my.get("href");
				that.activeHeader.setClass("").done();
				that.activeTab.setClass("simpletab-hidden").done();
				that.object.remove(SUI(href).fetch());
				SUI.DOM.Remove(this.parentNode.parentNode);
				
				that.__REVERT__();
			});
		}
	}
};

// Backward Compatiblity
SUI.Util.include("SimpleTab", SUI.Widget.SimpleTab);
/*
 * Savvy.UI JavaScript Library Widget
 * Name: SUI.Widget.Toggler
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

SUI.Widget.include("Toggler", function(js) {
	this.button = null;
	this.container = null;
	this.content = null;
	
	this.buttonc = null;
	this.containerc = null;
	this.contentc = null;
	
	if(SUI.fn.isset(js) && typeof(js) == "object") {
		this.Initialize(js);
	}
		
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		
		var button = this.button = js.button;
		var container = this.container = js.container;
		var content = this.content = js.content;
		
		if(SUI.fn.isset(button) && SUI.fn.isset(container) && SUI.fn.isset(content)) {
			SUI(button).clicks(function() {
				var dwl = SUI(container).first();
				var stack = SUI(content).first();
				var button = SUI(this).first();
				
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
SUI.Util.include("Toggler", SUI.Widget.Toggler);
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Widget.WinPanel
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Widget.Panel, SUI.Ext.Drag, SUI.Ext.Resize
*/

SUI.Widget.include("WinPanel", function(js) {
	// Declare Object's properties
	this.panel = null;
	this.element = null;
	this.zindex = 100;
	this.allowDrag = false;
	this.autoFocus = true;
	this.status = "";
	this.node = null;
	this.object = null;
	this.init = false;
	this.onclose = null;
	
	// Declare constant
	SUI.Widget.WinPanel.nodes;
	SUI.Widget.WinPanel.zindex;
	
	// start __constructor()
	if (js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		
		if (!this.init) {
			this.init = true;
			SUI.Widget.WinPanel.zindex = SUI.fn.pick(SUI.Widget.WinPanel.zindex, 101);
			
			var elem = this.element = js.element + "_win";
			SUI.Widget.WinPanel.nodes = SUI.fn.pick(SUI.Widget.WinPanel.nodes, []);
			SUI.Widget.WinPanel.nodes.push(elem);
			
			this.zindex = SUI.fn.pick(js.zindex, ++SUI.Widget.WinPanel.zindex);
			this.autoFocus = SUI.fn.pick(js.autoFocus, this.autoFocus);
			this.allowDrag = SUI.fn.pick(js.allowDrag, this.allowDrag);
			this.onclose = SUI.fn.pick(js.onClose, this.onclose);
			js.onclose = null;
			
			if(this.allowDrag) { 
				js.scrolling = true;
			}
			
			this.panel = new SUI.Widget.Panel(js);
			this.node = this.panel.node;
			this.object = this.panel.object;
			this.object.hide();
			
			if (!!this.autoFocus) {
				this.object.clicks(function() {
					var m = SUI(this).first();
					m.css("alpha", 100);
					
					if (!m.getStyle("zIndex") || m.getStyle("zIndex") < SUI.Widget.WinPanel.zindex) {
						++SUI.Widget.WinPanel.zindex;
						m.css("zIndex", SUI.Widget.WinPanel.zindex);
					}
					
					for (var i = 0; i < SUI.Widget.WinPanel.nodes.length; i++) {
						if (SUI.Widget.WinPanel.nodes[i] != that.element) 
							SUI("#" + SUI.Widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				});
				
				for (var i = 0; i < SUI.Widget.WinPanel.nodes.length; i++) {
					if (SUI.Widget.WinPanel.nodes[i] != that.element) {
						SUI("#" + SUI.Widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				}
			} else {
				this.object.css("zIndex", this.zindex);
			}
			
			var doc = document.body;
			var hW = SUI.fn.toNumber(doc.offsetWidth);
			var hH = SUI.fn.toNumber(doc.offsetHeight);
			var oW = this.panel.width;
			var oH = this.panel.height;
			var sXY = SUI.Dimension.Page.Scroll.XY();
			var center = SUI.Dimension.Page.Center(oW, oH);
			var xS = center[1];
			var yS = center[0];
			xS = (xS < 0 ? 0 : xS);
			yS = (yS < 0 ? 0 : yS);
			
			if (!!this.allowDrag) {
				try {
					new SUI.Ext.Drag({
						node: that.panel.header.fetch(),
						nodeRoot: that.panel.object.fetch()
					});
					
					that.panel.header.css("cursor", "move");
				} catch(e) {
					SUI.fn.logger("SUI.Widget.WinPanel.Initialize error at DRAG: " + e);
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
		++SUI.Widget.WinPanel.zindex;
		this.object.css("zIndex", SUI.Widget.WinPanel.zindex);
	},
	Close: function() {
		var fn = this.onclose;
		if (SUI.fn.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		
		try {
			this.object = null;
			this.element = null;
			var arrays = SUI.Widget.WinPanel.nodes;
			var deindex = SUI.fn.indexOf(arrays, this.element);
			arrays.splice(deindex, 1);
			SUI.Widget.WinPanel.nodes = arrays;
		} catch(e) { }
		return this;
	}
};

SUI.Ext.include("WinPanel", SUI.Widget.WinPanel);
