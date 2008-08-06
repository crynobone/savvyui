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
