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
