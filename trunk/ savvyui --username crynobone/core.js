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
		
		if(Js.dom.verifyNode(node)) {
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
		
		if(Js.dom.verifyNode(node)) {
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
		
		if(Js.dom.verifyNode(node)) {
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
					if(Js.dom.verifyNode(node)) {
						node.className = object[value];
					}
				}
			}
		};
	}
});
					
Js.namespace.include("className", {
	set: function(node, value) {
		if(Js.dom.verifyNode(node)) {
			node.className = value;
			return node;
		} else {
			return false;
		}
	},
	append: function(node, value) {
		if(Js.dom.verifyNode(node)) {
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
		if(Js.dom.verifyNode(node)) {
			// get the className value
			return node.className;
		} else { 
			return false;
		}
	},
	has: function(node, value) {
		var klasName = node.className;
		var value = SUI.fn.trim(value);
		
		if(Js.dom.verifyNode(node)) {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != "") {
				return SUI.fn.inArray(klasName.split(/\s/), value);
			} else { 
				return false;
			}
		} else {
			return false;
		}
	},
	remove: function(node, value) {
		var klasName = node.className;
		
		if(Js.dom.verifyNode(node)) {
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
		if(Js.dom.verifyNode(node)) { 
			node.className = "";
		} else {
			return false;
		}
	}
});

Js.namespace.include("css", {
	set: function(node, data, value) {
		var data = Js.fn.trim(data);
		var val = Js.fn.trim(value);
		
		if(Js.dom.verifyNode(node)) {
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
	setup: function(node, js) {
		var node = node;
		var data = Js.fn.pick(js, []);
		
		if(Js.fn.typeOf(data) !== "array") {
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

Js.namespace.include("dom", {
	add: function(parent, child) {
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
	addText: function(parent, text) {
		if (SUI.fn.isset(parent)) {
			return this.Add(parent, document.createTextNode(text));
		} else {
			SUI.fn.logger("SUI.DOM.AddText failed: " + e);
			return false;
		}
	},
	addBefore: function(args) {
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
	addAfter: function(args) {
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
	remove : function(params) {
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
	empty: function(node) {
		while(node.firstChild) {
			this.Remove(node);
		}
		
		return node;
	},
	change: function(args) {
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
	clone: function(node, bool) {
		return node.cloneNode(bool);
	},
	verifyElement: function(node) {
		if(!node || !node.nodeType || node.nodeType !== 1) {
			return false;
		} else { 
			return true;
		}
	}
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