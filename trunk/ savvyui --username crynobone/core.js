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
		var attr = Js.fn.trim(attr.toLowerCase());
		
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
		var attr = Js.fn.trim(attr.toLowerCase());
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
		var attr = Js.fn.trim(attr.toLowerCase());
		
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
		var data = Js.fn.pick(data, []);
		
		if(Js.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		// Using loops, but usually there just one.
		for(var i = 0; i < data.length; i++) {
			// loop the Object
			var object = data[i];
			
			for(var value in object) {
				// trim and ensure val's value is lowercased
				value = Js.fn.trim(value.toLowerCase());
				
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
			
			if(Js.fn.isset(klasName) && Js.fn.trim(klasName) != "") {
				var klass = Js.fn.trim(klasName).split(/\s/g);
				klass[klass.length] = Js.fn.trim(value);
				klass = Js.fn.unique(klass);
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
		var value = Js.fn.trim(value);
		
		if(Js.dom.isElement(node)) {
			if(Js.fn.isset(klasName) && Js.fn.trim(klasName) != "") {
				return Js.fn.inArray(klasName.split(/\s/), value);
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
			if(Js.fn.isset(klasName) && Js.fn.trim(klasName) != ""){
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
		var data = Js.fn.trim(data);
		var val = Js.fn.trim(value);
		
		if(Js.dom.isElement(node)) {
			try {
				node.style[data] = value; 
				return node;
			} catch(e) { 
				Js.logs("Js.style.get failed: " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	setup: function(node, js) {
		var node = node;
		var data = Js.fn.pick(js, []);
		
		if(Js.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		for(var i = 0; i < data.length; i++) {
			var obj = data[i];
			
			for(var value in obj) {
				value = Js.fn.trim(value);
				
				if(obj.hasOwnProperty(value)) {
					Js.style.set(node, value, obj[value]);
				}
			}
		};
		return node;
	},
	get: function(node, data) {
		var data = Js.fn.trim(data);
		
		if(Js.dom.isElement(node)) {
			try {
				return node.style[data];
			} catch(e) {
				Js.logs("Js.style.get failed: " + node + " " + data + " " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	alpha: function(node, value) {
		var value = (value > 100 ? 100 : (value < 0 ? 0 : value));
		
		if(Js.fn.isset(node)) {
			try {
				if (value == 0 && this.get(node, "visibility") != "hidden") {
					this.hide(node);
				} else if (value > 0 && this.get(node, "visibility") == "hidden") {
					this.show(node);
				}
				
				if(Js.fn.behaviour.ie == true) {
					if(!node.currentStyle || !node.currentStyle.hasLayout) {
						this.set(node, "zoom", 1);
					}
					
					this.set(node, "filter", "alpha(opacity=" + value + ")");
				} else {
					this.set(node, "opacity", (value / 100));
					this.set(node, "MozOpacity", (value / 100));
				}
			} catch(e) { 
				Js.logs("Js.style.alpha failed: " + e); 
			}
		} else return false
	},
	png: function(node, uri, js) {
		var node = node;
		var uri = uri;
		var gecko = Js.fn.pick(js.gecko, "");
		var ie = Js.fn.pick(js.ie, "scale");
		
		ie = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + uri + "',sizingMethod='" + ie + "')";
		gecko = "url('" + uri + "') " + gecko;
		
		if(window.ActiveXObject && (Js.fn.behaviour.ie && !Js.fn.behaviour.ie7)) {
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
				ani = this.__FX__(node, fx, "show");
				
				if(!ani) {
					this.set(node, "visibility", "visible");
				}
				return node;
			} catch(e) {
				Js.logs("Js.style.show failed: " + e);
				return false;
			}
		} else return false;
	},
	hide: function(node, fx) {
		var ani = true;
		
		if(Js.dom.isElement(node)) {
			try {
				ani = this.__FX__(node, fx, "hide");
				
				if(!ani) {
					this.set(node, "visibility", "hidden");
				}
				return node;
			} catch(e) {
				Js.logs("Js.style.hide failed: " + e);
				return false;
			}
		} else return false;
	},
	__FX__: function(node, fx, value) {
		var fx = (Js.fn.isset(fx) && fx.match(/(fast|slow)/g) ? fx : false);
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
			var effect = new Js.ext.animator;
			effect.Initialize(node).Fx({
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
		if(!Js.fn.isset(child)) {
			var child = parent;
			var parent = document.body;
		}
		
		try {
			parent.appendChild(child);
			return parent;
		} catch(e) {
			Js.logs("Js.dom.add failed: " + e);
			return false;
		}
	},
	addText: function(parent, text) {
		if(Js.fn.isset(parent)) {
			return this.Add(parent, document.createTextNode(text));
		} else {
			Js.logs("Js.dom.addText failed: " + e);
			return false;
		}
	},
	addBefore: function(args) {
		var args = Js.fn.toArray(arguments);
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && Js.fn.isset(args[0]) && Js.fn.isset(args[1]) && Js.fn.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = args[2];
		} else if(args.length == 2 && Js.fn.isset(args[0]) && Js.fn.isset(args[1])) {
			parent = args[1].parentNode;
			child = args[0];
			reference = args[1];
		} else {
			Js.logs("Js.dom.addBefore failed: Reference Object is null");
			return false;
		}
		
		try {
			parent.insertBefore(child, reference);
			return true;
		} catch(e) {
			Js.logs("Js.dom.addBefore failed: " + parent + " " + child + " " + reference + e);
			return false;
		}
	},
	addAfter: function(args) {
		var args = arguments;
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && Js.fn.isset(args[0]) && Js.fn.isset(args[1]) && Js.fn.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = this.next(args[2]);
		} else {
			parent = this.parent(args[1]);
			child = args[0];
			reference = this.next(args[1]);
		}
		
		try {
			if(Js.fn.isset(reference)) {
				return this.addBefore(parent, child, reference);
			} else {
				return this.add(parent, child);
			}
		} catch(e) {
			Js.logs("Js.dom.addAfter failed: " + e);
			return false;
		}
	},
	remove : function(params) {
		var args = arguments;
		var parNode = null;
		var chiNode = null;
		
		if(args.length === 2 && Js.fn.isset(args[0]) && Js.fn.isset(args[1])){
			parNode = args[0];
			chiNode = args[1];
		} else if(args.length == 1 && Js.fn.isset(args[0])){
			parNode = args[0].parentNode;
			chiNode = args[0];
		}
		
		try {
			parNode.removeChild(chiNode);
			return parNode;
		} catch(e) {
			Js.logs("Js.dom.remove failed: " + e);
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
			Js.logs("Js.dom.change failed: " + e);
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
		return (!!node && node.nodeType == 1 ? true : false);
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
	init: function(node, fn) {
		var that = Js.domReady;
		
		return (function(fn, node) {
			if (!!that.done) {
				if(!!node && node !== document) {
					Js.fn.callback(node, fn);
				} else { 
					fn();
				}
				
				return;
			}
			
			if (/Konqueror/i.test(navigator.userAgent)) {
				new Js.events("on", {
					on: "load",
					callback: function() {
						that.callback();
					}
				});
			} else if (document.addEventListener) {
				try { 
					document.addEventListener("DOMContentLoaded", that.callback, false); 
				} catch(e) { 
					new Js.events("on", {
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
			
			if (!!Js.fn.behaviour.ie) {
				try {
					document.write("<script id=__ie_onload defer src=//0><\/scr"+"ipt>");
					that.script = document.getElementById("__ie_onload");
					that.script.onreadystatechange = function() {
						if (this.readyState == "complete") 
							that.callback(); // call the onload handler
					};
				} catch(e) { 
					Js.logs(e);
				}
			} else {
				new Js.events("on", {
					on: "load",
					callback: (function() {
						that.__CALLBACK__();
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
			
			for (var i = 0; i < SUI.onDOMReady._FN_.length; i++) {
				var fn = Js.domReady.fn[i];
				var node = Js.domReady.node[i];
				
				if (SUI.fn.isfunction(fn)) {
					if(!!node && node !== document) {
						SUI.fn.callback(node, fn);
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