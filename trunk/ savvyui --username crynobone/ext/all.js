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
