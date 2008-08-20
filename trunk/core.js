/*
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
			r = (!!node.tagName.toLowerCase().match(/^(input|select|textarea)$/) ? true : false);
			if(Js.code.isset(status)) {
				r = (Js.attr.get(node, status) !== false ? true : false);
				if(!!value) { 
					r = (!!r ? false : true);
				}
			}
			return r;
		} else {
			if(data.match(/^(text|password|radio|checkbox|submit|image|reset|button|file|hidden)$/)) {
				return (node.tagName.toLowerCase() === "input" && Js.attr.get(node, "type") === data ? true : false);
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
});