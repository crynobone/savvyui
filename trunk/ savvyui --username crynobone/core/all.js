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
