/*
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

Js.namespace.include({
	name: "Elements", 
	object: function(selector, context) {
		this.node = [];
		this.animate = [];
		this._node = [];
		this._animate = [];
		this.index = null;
		this.length = 0;
		
		if(!!selector && selector.nodeType) {
			// selector is actually a node, convert to Array before adding to stack
			this.addStack([selector]);
		} else if(!!selector && typeof(selector) !== "string" && selector.length > 0) {
			// selector is actually a nodeList (semi Array), add to stack
			this.addStack(selector);
		} else if(!!selector && typeof(selector) == "string") {
			// selector is a string.
			this.query(selector, context);
		}
		
		return this;
	},
	proto: {
		create: function(el) {
			var node = [];
			var args = arguments;
			var parent = document.body;
			var tags = null;
			var attr = null;
			
			if(args.length === 3 && ((!!args[0] && typeof(args[0]) == "string") && (!!args[1] && args[1].nodeType) && !!args[2])) {
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
				this.addStack(node);
			}
			
			// continue chaining
			return this;
		},
		query: function(selector, parent) {
			var node = [];
			node = Js.query.selector(selector, parent);
			
			if(node.length > 0) {
				this.addStack(node);
			}
			// continue chaining
			return this;
		},
		addStack: function(nodes) {
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
								Js.debug.log("Js.Elements.addStack error on Initialize Animator: " + node +  e);
							};
						}
					} else {
						Js.debug.log("node is not a HTMLelement" + (!!node && node.nodeType));	
					}
				}
			}
			
			this.index = (!this.index && this.node.length === 1 ? 0 : null);
		},
		pushStack: function(fn) {
			if(Jrun.isfunction(fn)) {
				var key = Jrun.pick(this.index, null);
				
				if(Jrun.isnull(key)) {
					Jrun.each(this.node, fn);
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
			this.addStack(this._node);
			return this;						
		},
		'find': function(selector) {
			var key = Jrun.pick(this.index, null);
			var n1 = (!key ? this.node : this.node[key]);
			var n2 = (!key ? this._node : this._node[key]);
			var node = Jrun.pick(n1, n2);
			
			return new Js.Elements(selector, node);
		},
		childOf: function(selector) {
			var key = Jrun.pick(this.index, null);
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
						this.addStack(object);
					}
				} else if(this.node.length > 0) {
					var node = (!key ? this.node : this.node[key]);
					var object = Js.query.selector(selector, node);
					
					if(object.length > 0) { 
						this.addStack(object);
					}
				}
				return this;
			} else if(this._node.length === 0) {
				var node = (!key ? this.node : this.node[key]);
				return new Js.Elements(selector, node);
			}
		},
		has: function(selector) {
			var key = Jrun.pick(this.index, null);
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
						this.addStack(object);
					}
				} else if(this.node.length > 0) {
					var node = (!key ? this.node : this.node[key]);
					var object = Js.query.selector(elem, node);
					
					if(object.length > 0) { 
						this.addStack(object);
					}
				}
				return this;
			} else if(this._node.length === 0) {
				var node = (!key ? this.node : this.node[key]);
				return new Js.Elements(selector, node);
			}
		},
		is: function(selector) {
			var key = Jrun.pick(this.index, 0);
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
			var key = Jrun.pick(this.index, key);
			
			if (Jrun.isnull(key)) { 
				return this.node;
			} else if (!!Jrun.isset(this.node[key])) {
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
			var key = Jrun.pick(this.index, 0);
			var node = Jrun.pick(this.node[key].parentNode, false);
			
			return (!!node ? new Js.Elements(node) : false);
		},
		siblings: function(selector) {
			var key = Jrun.pick(this.index, 0);
			var elem = selector.split(",");
			
			for(var i = 0; i < elem.length && !!elem[i]; i++) {
				elem[i] = "~ " + elem[i];
			}
			
			selector = elem.join(",");
			
			if (this._node.length > 0) {
				if (this.node.length === 0) {
					//Js.debug.log("using start()");
					var node = (!key ? this._node : this._node[key]);
					var object = Js.query.selector(selector, node);
					
					if(object.length > 0) {
						this.addStack(object);
					}
				} else if(this.node.length > 0) {
					//Js.debug.log("extend node");
					var node = (!key ? this.node : this.node[key]);
					var object = Js.query.selector(selector, node);
					
					if(object.length > 0) {
						this.addStack(object);
					}
				}
				// continue chaining
				return this;
			} else {
				//Js.debug.log("new process");
				var node = (!!key && !!this.node[key] ? this.node[key] : this.node);
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
			if(this.count() > 0 && Jrun.isfunction(fn)) {
				Jrun.each(this.node, fn);
			}
			// continue chaining
			return this;
		},
		callback: function(fn) {
			if(Jrun.isfunction(fn)) {
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
			
			var key = Jrun.pick(this.index, 0);
			
			if (Jrun.isset(this.node[key])) {
				var node = new Js.Elements;
				node.create(selector, this.node[key], data);
				
				return node;
			} else {
				return false;
			}
		},
		addBefore: function(selector, data) {
			var args = arguments;
			
			var key = Jrun.pick(this.index, 0);
			
			if(Jrun.isset(this.node[key])) {
				var node = new Js.Elements;
				node.create(selector, data);
				Js.dom.addBefore(node.node[0], this.node[key]);
				
				return node;
			} else {
				return false;	
			}
		},
		addAfter: function(selector, data) {
			var args = arguments;
			
			var key = Jrun.pick(this.index, 0);
			
			if(Jrun.isset(this.node[key])) {
				var node = new Js.Elements;
				node.create(selector, data);
				Js.dom.addAfter(node.node[0], this.node[key]);
				
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
			this.pushStack(function() { 
				Js.attr.set(this, data, value);
			});
			// continue chaining
			return this;
		},
		setup: function(js) {
			// stack the callback
			this.pushStack(function() {
				Js.attr.setup(this, js);
			});
			// continue chaining
			return this;
		},
		get: function(data) {
			var key = Jrun.pick(this.index, null);
			
			if (Jrun.isnull(key)){
				var value = [];
				
				Jrun.each(this.node, function() { 
					value[value.length] = Js.attr.get(this, data);
				});
				
				return value;
			} else if (!!this.node[key]) {
				return Js.attr.get(this.node[key], data);
			}
		},
		unset: function(name) {
			// stack the callback
			this.pushStack(function() {
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
			this.pushStack(function(){
				Js.className.set(this, name);
			});
			// continue chaining
			return this;
		},
		appendClass: function(name) {
			// stack the callback
			this.pushStack(function() { 
				Js.className.append(this, name);
			});
			// continue chaining
			return this;
		},
		hasClass: function(name) {
			var key = Jrun.pick(this.index, null);		
			
			if (Jrun.isnull(key)) {
				var value = [];
				Jrun.each(this.node, function() { 
					value[value.length] = Js.className.has(this, name);
				});
				return value;
			} else if(!!this.node[key]) {
				return Js.className.has(this.node[key], name);
			}
		},
		removeClass: function(name) {
			// stack the callback
			this.pushStack(function() {
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
			this.pushStack(function() {
				Js.style.set(this, data, value);
			});
			// continue chaining
			return this;
		},
		setStyles: function(js) {
			// stack the callback
			this.pushStack(function() { 
				Js.style.setup(this, js);
			});
			// continue chaining
			return this;
		},
		getStyle: function(data) {
			var key = Jrun.pick(this.index, null);
			
			if(Jrun.isnull(key)) {
				var value = [];
				
				Jrun.each(this.node, function() {
					value[value.length] = Jrun.pick(Js.style.get(this, data), false);
				});
				
				return value;
			} else if(!!this.node[key]) {
				return Jrun.pick(Js.style.get(this.node[key], data), false);
			}
		},
		alpha: function(value) {
			// refer this.opacity function
			return this.opacity(value);
		},
		opacity: function(value) {
			// stack the callback
			this.pushStack(function() {
				Js.style.alpha(this, value);
			});
	
			// continue chaining
			return this;
		},
		png: function(uri, js) {
			// stack the callback
			this.pushStack(function() {
				Js.style.png(this, uri, js);
			});
			// continue chaining
			return this;
		},
		hide: function(fx) {
			var fx = (!!fx ? fx : null);
			// stack the callback
			this.pushStack(function() {
				Js.style.hide(this, fx);
			});
			// continue chaining
			return this;
		},
		show: function(fx) {
			var fx = (!!fx ? fx : null);
			// stack the callback
			this.pushStack(function() {
				Js.style.show(this, fx);
			});
			// continue chaining
			return this;
		},
		insert: function(child) {
			if(Jrun.isset(this.index)) {
				// stack the callback
				this.pushStack(function() { 
					Js.dom.add(this, child);
				});
			}
			// continue chaining
			return this;
		},
		text: function(text) {
			// stack the callback
			this.pushStack(function() {
				Js.dom.addText(this, text);	
			});
			// continue chaining
			return this;
		},
		remove: function(child) {
			if(Jrun.isset(this.index)) {
				// stack the callback
				this.pushStack(function() { 
					Js.dom.remove(this, child);
				});
			}
			// continue chaining
			return this;
		},
		removeSelf: function() {
			this.pushStack(function() {
				Jd.dom.remove(this);			
			});
			
			return this;
		},
		html: function(text, option) {
			var args = arguments;
			
			if(typeof(text) == "string") {
				var option = (!!option && option.match(/^(before|after)$/g) ? option : false);
				
				if(!option) {
					// stack the callback
					this.pushStack(function() { 
						this.innerHTML = text; // set/overwrite HTML string for multiple HTMLelement
					});
				} else { 
					this.htmlManip(text, option); // append/prepend HTML string for multiple HTMLelement
				}
				// continue chaining
				return this;
			} else if (!text || typeof(text) == "number") {
				var key = Jrun.pick(this.index, null);
				
				if(Jrun.isnull(key)) {
					var value = [];
					// retrieve the value of each HTMLelement
					Jrun.each(this.node, function() {
						value[value.length] = Jrun.pick(this.innerHTML, ""); // return HTML string for multiple HTMLelement
					});
					// return value as array
					return value;
				} else if(!!this.node[key]) {
					return Jrun.pick(this.node[key].innerHTML, ""); // return HTML string for single HTMLelement
				}
			}
		},
		// set or retrieve HTMLelement's value
		val: function(text) {
			var args = arguments;
			
			if(typeof(text) == "string") {
				// stack the callback
				this.pushStack(function() {
					this.value = text; // set the value
				});
				// continue chaining
				return this;
			} else if(!text || typeof(text) == "number") {
				var key = Jrun.pick(this.index, null);
				
				if(Jrun.isnull(key)) {
					var value = [];
					// retrieve the value of each HTMLelement
					Jrun.each(this.node, function() {
						value[value.length] = Jrun.pick(this.node[key].value, "");
					});
					// return the value as array
					return value;
				} else if(!!this.node[key]) {
					return Jrun.pick(this.node[key].value, ""); // retrieve single HTMLelement value
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
			this.pushStack(function() { 
				Jrun.on(this, handler, fn1, fn2);
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
			this.pushStack(function() {
				Jrun.on(this, handler, function() {
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
				this.addStack([document]);
			}
			
			// stack the callback
			this.pushStack(function() {
				Js.domReady.add(this, fn);		 
			});
			// continue chaining
			return this;
		},
		setHash: function(data, value) {
			// stack the callback
			this.pushStack(function() {
				Js.hash.set(this, data, value);
			});
			// continue chaining
			return this;
		},
		// get hashtable value
		getHash: function(data) {
			var key = Jrun.pick(this.index, null);
			
			if (Jrun.isnull(key)) {
				var value = [];			
				// get each value of hash from an array
				Jrun.each(this.node, function() { 
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
			this.pushStack(function() {
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
			this.pushStack(function() {
				// get current HTML string
				var html = Jrun.pick(this.innerHTML, "");
				
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
	}
});

// Extend misc event handler function to Js.Elements
(function() {
	// array listing all the supported event handler
	var handler = ["click", "mouseover", "mouseout", "change", "keyup", "keypress", "submit", "blur", "focus", "hover"];
	// Loop the array and implement each event handler
	Jrun.each(handler, function() {
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

Js.use = function(selector, context) {
	return Js(selector, context);	
};

Js.restore = function(opt) {
	var opt = Jrun.pick(opt, true);
	if(opt == true) {
		if(Jrun.isset(Jrun.$)) {
			window.$ = Jrun.$;
			Jrun.$ = null;
		}
	}
	
	return Js.use;
};
Js.simplify = function() {
	Jrun.$ = window.$;
	window.$ = Js.use;
};
