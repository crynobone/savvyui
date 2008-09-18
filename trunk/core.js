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

Js.namespace.include({
	name: "attr", 
	object: {
		// Set Attribute value for an Element
		set: function(node, attr, value) {
			var attr = Jrun.trim(attr.toLowerCase());
			
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
			var attr = Jrun.trim(attr.toLowerCase());
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
			var attr = Jrun.trim(attr.toLowerCase());
			
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
			var data = Jrun.pick(data, []);
			
			if(Jrun.typeOf(data) !== "array") {
				data = [data];
			}
			
			// Using loops, but usually there just one.
			for(var i = 0; i < data.length; i++) {
				// loop the Object
				var object = data[i];
				
				for(var value in object) {
					// trim and ensure val's value is lowercased
					value = Jrun.trim(value.toLowerCase());
					
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
			}
		}
	}
});

Js.namespace.include({
	name: "className", 
	object: {
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
				
				if(Jrun.isset(klasName) && Jrun.trim(klasName) != "") {
					var klass = Jrun.trim(klasName).split(/\s/g);
					klass[klass.length] = Jrun.trim(value);
					klass = Jrun.unique(klass);
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
			var value = Jrun.trim(value);
			var re = new RegExp("(^|\\s)" + value + "(\\s|$)");
			
			if(Js.dom.isElement(node)) {
				if(Jrun.isset(klasName) && Jrun.trim(klasName) != "") {
					return (re.test(klasName) ? true : false);
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
				if(Jrun.isset(klasName) && Jrun.trim(klasName) != ""){
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
	}
});

Js.namespace.include({
	name: "style", 
	object: {
		set: function(node, data, value) {
			var data = Jrun.trim(data);
			var val = Jrun.trim(value);
			
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
			var data = Jrun.pick(js, []);
			
			if(Jrun.typeOf(data) !== "array") {
				data = [data];
			}
			
			for(var i = 0; i < data.length; i++) {
				var obj = data[i];
				
				for(var value in obj) {
					value = Jrun.trim(value);
					
					if(obj.hasOwnProperty(value)) {
						Js.style.set(node, value, obj[value]);
					}
				}
			};
			return node;
		},
		get: function(node, data) {
			var data = Jrun.trim(data);
			
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
			
			if(Jrun.isset(node)) {
				try {
					if (value == 0 && this.get(node, "visibility") != "hidden") {
						this.hide(node);
					} else if (value > 0 && this.get(node, "visibility") == "hidden") {
						this.show(node);
					}
					
					if(Jrun.behaviour.ie == true) {
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
			var js = Jrun.pick(js, {});
			var gecko = Jrun.pick(js.gecko, "");
			var ie = Jrun.pick(js.ie, "scale");
			
			ie = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + uri + "',sizingMethod='" + ie + "')";
			gecko = "url('" + uri + "') " + gecko;
			
			if(window.ActiveXObject && (Jrun.behaviour.ie && !Jrun.behaviour.ie7)) {
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
			var fx = (Jrun.isset(fx) && fx.match(/(fast|slow)/g) ? fx : false);
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
				effect.init(node).fx({
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
	}
});

Js.namespace.include({
	name: "dom", 
	object: {
		add: function(parent, child) {
			if(!Jrun.isset(child)) {
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
			if(Jrun.isset(parent)) {
				return this.add(parent, document.createTextNode(text));
			} else {
				Js.debug.log("Js.dom.addText failed: " + e);
				return false;
			}
		},
		addBefore: function(args) {
			var args = Jrun.toArray(arguments);
			var parent = null;
			var child = null;
			var reference = null;
			
			if(args.length == 3 && Jrun.isset(args[0]) && Jrun.isset(args[1]) && Jrun.isset(args[2])) {
				parent = args[0];
				child = args[1];
				reference = args[2];
			} else if(args.length == 2 && Jrun.isset(args[0]) && Jrun.isset(args[1])) {
				parent = this.parent(args[1]);
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
			var args = Jrun.toArray(arguments);
			var parent = null;
			var child = null;
			var reference = null;
			
			if(args.length == 3 && Jrun.isset(args[0]) && Jrun.isset(args[1]) && Jrun.isset(args[2])) {
				parent = args[0];
				child = args[1];
				reference = this.next(args[2]);
			} else if(args.length == 2 && Jrun.isset(args[0]) && Jrun.isset(args[1])) {
				parent = this.parent(args[1]);
				child = args[0];
				reference = this.next(args[1]);
			}
			
			try {
				if(Jrun.isset(reference)) {
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
			
			if(args.length === 2 && Jrun.isset(args[0]) && Jrun.isset(args[1])){
				parent = args[0];
				child = args[1];
			} else if(args.length == 1 && Jrun.isset(args[0])){
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
			} while(!!node && node.nodeType != 1);
			
			return node;
		},
		next: function(node) {
			do {
				node = node.nextSibling;
			} while(!!node && node.nodeType != 1);
			
			return node;
		},
		first: function(node) {
			var node = node.firstChild;
			return (!!node && node.nodeType != 1 ? this.next(node) : node);
		},
		last: function(node) {
			var node = node.lastChild;
			return (!!node && node.nodeType != 1 ? this.prev(node) : node);
		},
		isFirst: function(node) {
			var n = this.first(this.parent(node));
			return n === node;
		},
		isLast: function(node) {
			var n = this.last(this.parent(node));
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
			return (Jrun.isset(node) && node.nodeType ? true : false);
		},
		parent: function(node) {
			return node.parentNode;
		}
	}
});

Js.namespace.include({
	name: "domReady", 
	object: {
		fn: [],
		node: [],
		script: null,
		timer: null,
		done: null,
		add: function(node, fn) {
			var that = Js.domReady;
			
			return (function(fn, node) {
				if(!!that.done) {
					if(!!node && node !== document) {
						Jrun.callback(node, fn);
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
				
				if (!!Jrun.behaviour.ie) {
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
					
					if (Jrun.isfunction(fn)) {
						if(!!node && node !== document) {
							Jrun.callback(node, fn);
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
	}
});

Js.namespace.include({
	name: "domEvent", 
	object: function(handler, js) {
		this.node = window;
		this.type = null;
		this.fn = null;
		
		if(handler == "on") {
			return this.on(js);
		} else if(handler == "off") {
			return this.off(js);
		}
		return this;
	},
	proto: {
		on: function(js) {
			var that = this;
			var p = true;
			var r;
			
			this.node = Jrun.pick(js.object, this.node);
			this.type = Jrun.pick(js.on, this.type, "load");
			this.fn = Jrun.pick(js.callback, this.fn);
			
			if(this.node.addEventListener) {
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
			} else if(this.node.attachEvent) {
				try { 
					this.node.attachEvent("on" + this.type, this.fn);
				} catch(e) { 
					p = false; 
				}
				
				return true;
			} else {
				p = false;
			}
			
			if(!pass) {
				var fn = Jrun.pick(this.object["on" + this.type], null);
				Jrun.on(this.node, this.type, function() {
					if(Jrun.isset(fn) && Jrun.isfunction(fn)) {
						fn();
					}
					that.fn();
				});
			}
		},
		off: function (js) {
			var that = this;
			var r = false;
			this.node = Jrun.pick(js.object, this.node);
			this.type = Jrun.pick(js.on, this.type, "load");
			this.fn = Jrun.pick(js.callback, this.fn);
			
			if(this.node.detachEvent) {
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
	}
});

Js.namespace.include({
	name: "hash", 
	object: {
		object: {},
		set: function(node, data, value) {
			var name = this.verify(node);
			
			if (Jrun.isset(name)) {
				if (!Jrun.isset(this.object[name])) {
					this.object[name] = {};
				}
				
				this.object[name][data] = value;
			}
		},
		get: function(node, data) {
			var name = this.verify(node);
			
			if (Jrun.isset(name)) {
				if (Jrun.isset(this.object[name]) && Jrun.isset(this.object[name][data])) {
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
			
			if (Jrun.isset(name)) {
				this.object[name][data] = null;
				
				if (Jrun.isset(this.object[name]) && Jrun.isset(this.object[name][data])) {
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
	}
});

Js.namespace.include({
	name: "parse", 
	object: {
		// Parse string value with Parsed HTML value
		html: {
			to: function(value) {
				var value = new String(value);
				value = Jrun.htmlEntities(value);
				value = encodeURIComponent(value);
				
				return value;
			},
			from: function(value) {
				var value = new String(value);
				value = decodeURIComponent(value);
				value = Jrun.htmlEntityDecode(value);
				
				return value;
			}
		},
		// Convert back bbml string to normal string
		bbml: function(value) {
			return new String(value).replace(/\[lt\]/g, "<").replace(/\[gt\]/g, ">").replace(/\[n\]/g, "&").replace(/\&quot\;/g, "\"").replace(/\&rsquo\;/g, "\'").replace(/\[br\]/g, "\n").replace(/\[break\]/g, "<br />");
		}
	}
});

Js.namespace.include({
	name: "query", 
	object: {
		isValid: function(node, data) {
			var data = Jrun.trim(data);
			var r = null;
			var status = null;
			var value = false;
			var tagName = node.tagName.toLowerCase();
			
			if(data.match(/^(enabled|disabled|checked|selected)$/)) {
				status = data;
				data = "input";
				
				if(status === "enabled") {
					value = true;
					status = "disabled";
				}
			}
			
			if(data == 'visible') {
				r = (Js.style.get(node, "display") === "none" ? true : false);
				r = (r === true || Js.style.get(node, "visibility") === "hidden" ? true : false);
				r = (r === true || Js.style.get(node, "visibility") === "hidden" ? true : false);
				r = (r === true || (tagName === "input" && Js.attr.get(node, "type") !== "hidden") ? true : false);
				return r;
			} else if(data == 'hidden') {
				r = (Js.style.get(node, "display") === "none" ? true : false);
				r = (r === true || Js.style.get(node, "visibility") === "hidden" ? true : false);
				r = (r === true || Js.style.get(node, "visibility") === "hidden" ? true : false);
				r = (r === true || (tagName === "input" && Js.attr.get(node, "type") === "hidden") ? true : false);
				return r;
			} else if(data == 'first-child') {
				return Js.dom.isFirst(node);
			} else if(data == 'last-child') {
				return Js.dom.isLast(node);
			} else if(data == 'only-child') {
				return Js.dom.isOnlyChild(node);
			} else if(data == 'input') {
				r = (!!tagName && !!tagName.match(/^(input|select|textarea)$/g) ? true : false);
				if(Jrun.isset(status)) {
					r = (Js.attr.get(node, status) !== false ? true : false);
					if(!!value) { 
						r = (!!r ? false : true);
					}
				}
				return r;
			} else if(data.match(/^contains\(.*\)$/)) {
				var value = RegExp.$1;
				var content = (!!node.innerText && Jrun.typeOf(node.innerText) == "string" ? node.innerText : "");
				var re = new RegExp("(^|\\s)" + value + "(\\s|$)");
				return (re.test(content) ? true : false);
			} else if(data.match(/^not\(.*\)$/)) {
				var value = RegExp.$1;
				var elem = this.selector(value);
				r = true;
				for(var i = 0; i < elem.length && !!elem; i++) {
					if(node === elem[i]) {
						r = false;	
					}
				}
				return r;
			} else {
				if(data.match(/^(text|password|radio|checkbox|submit|image|reset|button|file|hidden)$/)) {
					return (!!tagName && tagName === "input" && Js.attr.get(node, "type") === data ? true : false);
				} else { 
					return false;
				}
			}
		},
		hasClass: function(node, klasName) {
			return (!!Js.className.has(node, klasName) ? true : false);
		},
		hasAttrs: function(node, attr) {
			var runTest = function(node, attrs, type, value) {
				var data = Js.attr.get(node, attrs);
				if(!!data) {
					switch (type) {
						case '=': // Equality
							return (data === value);
							break;
						case '~': // Match one of space separated
							return (data.match(new RegExp('\\b' + value + '\\b')));
							break;
						case '|': // Match start with value followed by optional hyphen
							return (data.match(new RegExp('^' + value + '-?')));
							break;
						case '^': // Match starts with value
							return (data.indexOf(value) === 0);
							break;
						case '$': // Match ends with value7
							return data.match(new RegExp(value + '$'));
							break;
						case '*': // Match any with value
							return (data.indexOf(value) > -1);
							break;
						default : // Just test for existence of attribute
							return !!data;
					}
				} else {
					return false;
				}
			};
			var r = true;
			var temp = true;
			for(var i = 0; i < attr.length; i++) {
				temp = (runTest(node, attr[i][0], attr[i][1], attr[i][2]) ? true : false);
				r = (!!r && !!temp ? true : false);
			}
			return r;
		},
		tagParentOf: function(dom, parents) {
			var context = [];
			
			if(parents.length > 0) {
				var tag = (dom.tags === "*" && document.all ? document.all : document.getElementsByTagName(dom.tags));
				
				for(var i = 0; i < parents.length && parents[i]; i++) {
					for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
						var node = tag[ii];
						
						if(node.nodeType === 1 && !!Js.query.validate(node, dom) && node === parents[i].parentNode) {
							context[context.length] = node;
						}
					}
				}
			}
			return context;
		},
		tagNextOf: function(dom, parents) {
			var context = [];
			
			if(parents.length > 0) {
				for(var i = 0; i < parents.length && parents[i]; i++) {
					var parent = parents[i].parentNode;
					
					if(!!parent && parent.nodeType) {
						var tag = (dom.tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(dom.tags));
					
						for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
							var node = tag[ii];
							var tnode = Js.dom.prev(node);
							
							if(tnode === parents[i] && node.nodeType === 1 && !!Js.query.validate(node, dom)) {
								context[context.length] = node;
							}
						}
					}
				}
			}
			return context;
		},
		tagSiblingOf: function(dom, parents) {
			var context = [];
			
			if(parents.length > 0) {
				for(var i = 0; i < parents.length && parents[i]; i++) {
					var parent = parents[i].parentNode;
					
					if(!!parent && parent.nodeType) {
						var tag = (dom.tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(dom.tags));
					
						for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
							var node = tag[ii];
							
							if(node.nodeType === 1 && !!Js.query.validate(node, dom) && node.parentNode === parent) {
								context[context.length] = node;
							} 
						}
					}
				}
			}
			
			return context;
		},
		tagChildOf: function(dom, parents) {
			var context = [];
			
			if(parents.length > 0) {
				for(var i = 0; i < parents.length && parents[i]; i++) {
					var parent = parents[i];
					
					if(!!parent && parent.nodeType == 1) {
						var tag = (dom.tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(dom.tags));
						
						for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
							var node = tag[ii];
							
							if(node.nodeType === 1 && !!Js.query.validate(node, dom) && node.parentNode === parent) {
								context[context.length] = node;
							}
						}
					}
				}
			}
			return context;
		},
		validate: function(node, dom) {
			var valid = false;
			
			valid = (dom.klasName === "" || !!Js.query.hasClass(node, dom.klasName) ? true : false);
			valid = ((dom.attr.length === 0 || (!!Js.query.hasAttrs(node, dom.attr))) && !!valid ? true : false); 
			valid = ((!dom.is || (!!dom.is && !!Js.query.isValid(node, dom.is))) && !!valid ? true : false);
			
			return valid;
		},
		create: function(tags, attr) {
			var node = null;
			var tags = Jrun.trim(tags);
			
			if(/\#/.test(tags)) {
				var tag = tags.split(/\#/);
				var el = Jrun.trim(tag[0]);
				var id = Jrun.trim(tag[1]);
				node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', el) : document.createElement(el);
				Js.attr.set(node, "id", id);
			} else {
				node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', tags) : document.createElement(tags);
			}
			
			if (Jrun.isset(attr)) { 
				Js.attr.setup(node, attr);
			}
			
			return node;
		},
		tags: function(dom, parents, type) {
			var context = [];
			dom.klasName = Jrun.trim(Jrun.pick(dom.klasName, ""));
			dom.is = Jrun.pick(dom.is, null);
			dom.attr = Jrun.pick(dom.attr, []);
			dom.tags = Jrun.pick(dom.tags, "*");
			
			if(Jrun.isset(type) && type > 0) {
				if(type === 4) {
					//Js.debug.log("use tagParentOf");
					context = Js.query.tagParentOf(dom, parents);
				} else if(type === 2) {
					//Js.debug.log("use tagNextOf");
					context = Js.query.tagNextOf(dom, parents);
				} else if(type === 3) {
					//Js.debug.log("use tagSiblingOf");
					context = Js.query.tagSiblingOf(dom, parents);
				} else if(type === 1) {
					//Js.debug.log("use tagChildOf");
					context = Js.query.tagChildOf(dom, parents);
				}
			} else {
				//Js.debug.log("use tagNormal");
				if(!parents || parents.length === 0 || !parents.length) {
					parents = [document];
				}
				
				for(var i = 0; i < parents.length && parents[i]; i++) {
					var parent = parents[i];
					var tag = (dom.tags === "*" && parent.all ? parent.all : parent.getElementsByTagName(dom.tags));
					
					for(var ii = 0; ii < tag.length && tag[ii]; ii++) {
						var node = tag[ii];
						
						if(node.nodeType === 1 && Js.query.validate(node, dom)) {
							context[context.length] = node;
						}
					}
				}
			}
			return (context.length > 0 ? context : false);
		},
		id: function(dom, parents) {
			var tags = Jrun.trim(Jrun.pick(dom.tags, "*")).toUpperCase();
			var node = document.getElementById(dom.id);
			var is = (!!dom.is ? this.is(node, dom.is) : true);
				
			if(node && (tags == "*" || tags == node.tagName.toUpperCase()) && !!is) {
				return node;
			} else { 
				return false;
			}
		},
		selector: function(selector, parents) {
			var context = [];
			
			var init = function(selector, parents) {
				var context = [];
				
				if(!!parents && !parents.length) {
					context = [parents];
				} else if(!!parents && parents.length > 0) { 
					context = parents;
				}
				var type = 0;
				
				var elem = selector.split(/\s/);
				
				for(var i = 0; i < elem.length; i++){
					if(context.length === 0 && i > 0) {
						context = false;
						break;
					}
					
					var el = Jrun.trim(elem[i]);
					
					if(el !== "") {
						var dom = {
							tags: "",
							id: "",
							klasName: "",
							attr: [],
							is: null,
							name: ""
						};
						
						if(el === ">") {
							type = 1;
						} else if(el === "+") { 
							type = 2;
						} else if(el === "~") {
							type = 3;
						} else if(el === "<") {
							type = 4;
						} else {
							if(el.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)){
	 							dom.tags = RegExp.$1;
								var attrs = [RegExp.$2, RegExp.$3, RegExp.$4];
								
								dom.attr[dom.attr.length] = attrs;
							} else {
								if (el.indexOf(":") > -1) {
									var fragment = el.split(":");
									el = fragment[0];
									dom.is = fragment[1];
								}
								
								if (el.indexOf("@") > -1) {
									var fragment = el.split("@");
									el = fragment[0];
									var attrs = ["name", "=", fragment[1]];
									dom.attr[dom.attr.length] = attrs;
								}
								
								if(el.indexOf(".") > -1) {
									var fragment = el.split(".");
									dom.tags = fragment[0];
									dom.klasName = fragment[1];
								} else if(el.indexOf("#") > -1) {
									var fragment = el.split("#");
									dom.tags = fragment[0];
									dom.id = fragment[1];
								} else {
									dom.tags = el;
								}
								
								dom.tags = Jrun.trim(Jrun.trim(dom.tags) == "" ? "*" : dom.tags);
								if(dom.is == "root") {
									dom.is = null;
									dom.tags = "body";
								}
							}
							
							if(!!dom.id && dom.id !== "") {
								context = [Js.query.id(dom, context)];
							} else {
								context = Js.query.tags(dom, context, type);
							}
							
							if(!context) {
								context = [];
								break;
							} else {
								context = Jrun.unique(context);
							}
							
							type = 0;
						}
					}
				}
				return context;
			};
			
			var elem = Jrun.trim(selector).split(/,/);
			elem = Jrun.unique(elem);
			
			for(var m = 0; m < elem.length && !!elem[m]; m++) {
				var el = Jrun.trim(elem[m]);
				
				if(el !== "") {
					var node = init(el, parents);
					
					if(!!node && node.length > 0) {
						for(var i = 0; i < node.length; i++) {
							if(node[i].nodeType === 1) {
								context[context.length] = node[i];
							}
						}
					}
				}
			}
			return (context.length > 0 ? context : false);
		}
	}
});

Js.namespace.include({
	name: "test", 
	object: {
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
			var length = Jrun.toNumber(data[1]);
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
	}
});
