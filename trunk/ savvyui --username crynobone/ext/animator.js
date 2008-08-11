/*
 * Savvy.UI JavaScript Library Extension
 * Name: Js.ext.Animator
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
Js.ext.include("Animator", function(spec) {
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
		this.init(spec);
	}
	
	return this;
}).prototype = {
	init: function(spec) {
		var node;
		
		if (typeof(spec) == "string") {
			var el = spec;
			
			if (Js.code.finds(el)) {
				node = Js.query.id(el);
			} else {
				node = Js.query.create("div");
				Js.attr.get(node, "id", el);
			}
		} else if (spec && spec.nodeType === 1) {
			node = spec;
		} else {
			var object = Js.code.pick(spec.object, spec.node);
			node = Js.code.prepare(object, spec.element, "object");
		}
		
		this.object = node;
		return this;
	},
	queue: function(spec) {
		var that = this;
		fn = this.oncomplete;
		this.onComplete = function() {
			if (Js.code.isfunction(fn)) {
				fn();
			}
			
			new Js.ext.Animator(this.object).Fx(spec);
		};
		return this;
	},
	sync: function(spec) {
		new Js.ext.Animator(this.object).Fx(spec);
		return this;
	},
	fx: function(spec) {
		if (this.interval === null) {
			this.does = spec.method = (Js.code.inArray(this.methods, spec.method) ? spec.method : "moveUp");
			this.oncomplete = spec.oncomplete = Js.code.pick(spec.onComplete, null);
			this.grid();
			this.shutter = spec.shutter = Js.code.pick(spec.shutter, 20);
			this.step = spec.step = Js.code.pick(spec.step, 80);
			this.ease = Js.code.pick(spec.ease, 0.8);
			this.actStep = 0;
			var that = this;
			
			if (this.does.match(/^move(Up|Down|Left|Right)$/)) {
				var ts = spec.transaction;
				
				if (this.does.match(/^move(Left|Right)$/)) {
					this.type = Js.code.pick(spec.property, "marginLeft");
					
					if (this.type != "marginLeft" && Js.style.get(this.object, "position")) {
						this.type = "left";
						this.transaction[0] = Js.code.pick(ts[0], this.left);
						this.transaction[1] = ts[1];
					} else {
						this.type = "marginLeft";
						this.transaction[0] = Js.code.pick(ts[0], this.margin[3]);
						this.transaction[1] = ts[1];
					}
				} else if (this.does.match(/^move(Up|Down)$/)) {
					this.type = Js.code.pick(spec.property, "marginTop");
					
					if (this.type != "marginTop" && Js.style.get(this.object, "position")) {
						this.type = "top";
						this.transaction[0] = Js.code.pick(ts[0], this.top);
						this.transaction[1] = ts[1];
					} else {
						this.type = "marginTop";
						this.transaction[0] = Js.code.pick(ts[0], this.margin[0]);
						this.transaction[1] = ts[1];
					}
				}
				
				this.interval = setInterval(function(){ 
					that.custom(); 
				}, this.shutter);
			} else if (this.does == "move") {
				var ts = spec.transaction;
				this.type = Js.code.pick(spec.property, "margin");
				
				if (this.type != "margin" && Js.style.get(this.object, "position")) {
					this.type = "position";	
					this.transaction[0] = Js.code.pick(ts[0], this.top);
					this.transaction[1] = ts[1];
					this.transaction[2] = Js.code.pick(ts[2], this.left);
					this.transaction[3] = ts[3];
				} else {
					this.type = "margin";
					this.transaction[0] = Js.code.pick(ts[0], this.margin[0]);
					this.transaction[1] = ts[1];
					this.transaction[2] = Js.code.pick(ts[2], this.margin[3]);
					this.transaction[3] = ts[3];
				}
				
				this.interval = setInterval(function() {
					that.customMove();
				}, this.shutter);
			} else if (this.does.match(/^resize(Width|Height)$/)) {
				this.type = Js.code.pick(spec.property, "normal");
				this.does = (spec.method == "resizeWidth" ? "width" : "height");
				var ts 	= spec.transaction;
				
				if (this.does == "width") {
					this.transaction[0] = Js.code.pick(ts[0], this.width);
					this.transaction[1] = ts[1];
				} else {
					this.transaction[0] = Js.code.pick(ts[0], this.height);
					this.transaction[1] = ts[1];
				}
				
				this.interval = setInterval(function() {
					that.size();
				}, this.shutter);
			} else if (this.does == "resize") {
				this.type = Js.code.pick(spec.property, "normal");
				var ts 	= spec.transaction;
				this.transaction[0] = Js.code.pick(ts[0], this.width);
				this.transaction[1] = ts[1];
				this.transaction[2] = Js.code.pick(ts[2], this.height);
				this.transaction[3] = ts[3];
				
				this.interval = setInterval(function() {
					that.sizeBoth();
				}, this.shutter);
			} else if (this.does == "fade") {
				this.type = spec.property = spec.method;
				var ts = spec.transaction;
				this.transaction[0] = (ts[0] < 0 ? 0 : (ts[0] > 100 ? 100 : ts[0]));
				this.transaction[1] = (ts[1] < 0 ? 0 : (ts[1] > 100 ? 100 : ts[1]));
				
				this.interval = setInterval(function() {
					that.fade();
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
	fade: function() {
		var node = this.object;
		
		if (Js.code.isset(node)) {
			var t = this.transaction;
			this.actStep = (this.actStep + 1);
			this.prevEase = t[0];
			var s = this.ease(t[0], t[1], this.step, this.actStep, this.ease);
			
			if (s === this.prevEase) {
				try {
					if (s == 0 && Js.style.get(node, "visibility") != "hidden") {
						Js.style.hide(node);
					} else if (s > 0 && Js.style.get(node, "visibility") == "hidden") {
						Js.style.show(node);
					}
					
					if (window.ActiveXObject || Js.code.behaviour.ie == true) {
						if (!node.currentStyle || !node.currentStyle.hasLayout) {
							Js.style.set(node, "zoom", 1);
						}
						
						Js.style.set(node, "filter", (t[1] < 100 ? "alpha(opacity=" + t[1] + ")" : ""));
					} else {
						Js.style.set(node, "opacity", (t[1] / 100));
						Js.style.set(node, "MozOpacity", (t[1] / 100));
					}
				} catch(e) { 
					Js.debug.log("Js.ext.Animator.fade failed: " + e);
				}
				
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			} else if (t[0] != t[1]) {
				try {
					if (s == 0 && Js.style.get(node, "visibility") != "hidden") {
						Js.style.hide(node);
					} else if (s > 0 && Js.style.get(node, "visibility") == "hidden") {
						Js.style.show(node);
					}
					
					if (window.ActiveXObject || Js.code.behaviour.ie == true) {
						if (!node.currentStyle || !node.currentStyle.hasLayout) {
							Js.style.set(node, "zoom", 1);
						}
						
						Js.style.set(node, "filter", (s < 100 ? "alpha(opacity=" + s + ")" : ""));
					} else {
						Js.style.set(node, "opacity", (s / 100));
						Js.style.set(node, "MozOpacity", (s / 100));
					}
				} catch(e) { 
					Js.debug.log("Animator.Fade failed: " + e);
				}
				this.transaction[0] = s;
			} else {
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			}
		}
		return this;
	},
	size: function() {
		var node = this.object;
		var does = this.does;
		var type = this.type;
		
		if (does.match(/^(width|height)$/)) {
			var t = this.transaction;
			this.actStep = (this.actStep + 1);
			this.prevEase = t[0];
			var s = this.ease(t[0], t[1], this.step, this.actStep, this.ease);
			
			if(s === this.prevEase) {
				Js.style.set(node, does, t[1] + "px");
				
				if (type == "center") {
					if (does == "height") {
						var center = Js.ext.dimension.page.middle(10, t[1]);
						Js.style.set(node, "top", center[0] + "px");
					} else if (does == "width") {
						var center = Js.ext.dimension.page.middle(t[1], 10);
						Js.style.set(node, "left", center[1] + "px");
					}
				}
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
				}
				
				clearInterval(this.interval);
				this.interval = null;
			} else if (t[0] != t[1]) {
				Js.style.set(node, does, s + "px");
				
				if (type == "center") {
					if (does == "height") {
						var center = Js.ext.dimension.page.middle(10, s);
						Js.style.set(node, "top", center[0] + "px");
					} else if (does == "width") {
						var center = Js.ext.dimension.page.middle(s, 10);
						Js.style.set(node, "left", center[1] + "px");
					}
				}
				this.transaction = [s, t[1]];
			} else {
				var fn = this.oncomplete;
				if(Js.code.isfunction(fn)) {
					Js.code.callback(this, fn);
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
	sizeBoth: function() {
		var node = this.object;
		var does = this.does;
		var type = this.type;
		var t = this.transaction;
		this.actStep = (this.actStep + 1);
		var s = this.ease(t[0], t[1], this.step, this.actStep, this.ease);
		var u = this.ease(t[2], t[3], this.step, this.actStep, this.ease);
		
		if (t[0] != t[1] || t[2] != t[3]) { 
			if (t[0] != t[1]) {
				Js.style.set(node, "width", s + "px");
				
				if (type == "center") {
					var center = Js.ext.dimension.page.middle(s, 10);
					Js.style.set(node, "left", center[1] + "px");
				}
				this.transaction[0] = s;
			} else {
				this.transaction[0] = t[1];
			}
			
			if (t[2] != t[3]){
				Js.style.set(node, "height", u + "px");
				
				if (type == "center") {
					var gctr = Js.ext.dimension.page.middle(10, u);
					Js.style.set(node, "top", center[1] + "px");
				}
				this.transaction[2] = u;
			} else {
				this.transaction[2] = t[3];
			}
		} else {
			var fn = this.oncomplete;
			if (Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	custom: function() {
		var node = this.object;
		var t = this.transaction;
		var type = this.type;
		this.actStep = (this.actStep + 1);
		this.prevEase = t[0];
		var s = this.ease(t[0], t[1], this.step, this.actStep, this.ease);
		
		if(s === this.prevEase) {
			if (Js.code.inArray(this.withPx, type)) {
				Js.style.set(node, type, t[1] + "px");
			} else {
				Js.style.set(node, type, t[1]);
			}
			
			var fn = this.oncomplete;
			if (Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		} else if (t[0] !== t[1]) {
			if (Js.code.inArray(this.withPx, type)) {
				Js.style.set(node, type, s + "px");
			} else {
				Js.style.set(node, type, s);
			}
			
			this.transaction[0] = s;
		} else {
			var fn = this.oncomplete;
			if (Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	customMove: function() {
		var node = this.object;
		var t = this.transaction;
		var type = (this.type == "margin" ? "margin" : "position");
		this.actStep = (this.actStep + 1);
		
		var s = this.ease(t[0], t[1], this.step, this.actStep, this.ease);
		var u = this.ease(t[2], t[3], this.step, this.actStep, this.ease);
		
		if (t[0] != t[1] || t[2] != t[3]) {
			var does = "";
			
			if (t[0] != t[1]) {
				does = (type == "margin" ? "marginTop" : "top");
				Js.style.set(node, does, s + "px");
				this.transaction[0]	= s;
			} else { 
				this.transaction[0] = t[1];
			}
			
			if (t[2] != t[3]) {
				does = (type == "margin" ? "marginLeft" : "left");
				Js.style.set(node, does, u + "px");
				this.transaction[2]	= u;
			} else {
				this.transaction[2] = t[3];
			}
		} else {
			var fn = this.oncomplete;
			if(Js.code.isfunction(fn)) {
				Js.code.callback(this, fn);
			}
			
			clearInterval(this.interval);
			this.interval = null;
		}
		return this;
	},
	ease: function(minval, maxval, t, a, p) {
		var i =  Math.ceil(minval + (Math.pow(((1 / t) * a), p) * (maxval - minval)));
		return i;
    },
	getStyling: function(node, option, alt) {
		return Js.code.pick(Js.code.toNumber(Js.style.get(node, option)), alt);
	},
	grid: function() {
		var node = this.object;
		
		if(Js.style.get(node, "position")) {
			this.top = this.getStyling(node, "top", 0);
			this.left = this.getStyling(node, "left", 0);
		}
		
		this.width = this.getStyling(node, "width", node.offsetWidth);
		this.height	= this.getStyling(node, "height", node.offsetHeight);
		
		var mT = this.getStyling(node, "marginTop", 0);
		var mB = this.getStyling(node, "marginBottom", 0);
		var mL = this.getStyling(node, "marginLeft", 0);
		var mR = this.getStyling(node, "marginRight", 0);
		var m = [];
		
		m = (Js.style.get(node, "margin") ? Js.style.get(node, "margin").split(" ") : [0, 0, 0, 0]);
		m[0] = Js.code.toNumber(m[0]);
		m[1] = (Js.code.isset(m[1]) || !isNaN(m[1]) ? Js.code.toNumber(m[1]) : m[0]);
		m[2] = (Js.code.isset(m[2]) || !isNaN(m[2]) ? Js.code.toNumber(m[2]) : m[0]);
		m[3] = (Js.code.isset(m[3]) || !isNaN(m[3]) ? Js.code.toNumber(m[3]) : m[1]);
		
		var mgT = (Js.code.isnull(mT) || isNaN(mT) ? 0 : mT);
		mgT = (Js.code.isnull(m[0]) || isNaN(m[0]) ? mgT : m[0]);
		var mgB = (Js.code.isnull(mB) || isNaN(mB) ? 0 : mB);
		mgB = (Js.code.isnull(m[2]) || isNaN(m[2]) ? marginBottom : m[2]);
		var mgL = (Js.code.isnull(mL) || isNaN(mL) ? 0 : mL);
		mgL = (Js.code.isnull(m[3]) || isNaN(m[3]) ? mgL : m[3]);
		var mgR = (Js.code.isnull(mR) || isNaN(mR) ? 0 : mR);
		mgR = (Js.code.isnull(m[1]) || isNaN(m[1]) ? mgR : m[1]);
		
		Js.style.setup(this.object, {
			"marginTop": mgT + "px",
			"marginBottom": mgB + "px",
			"marginLeft": mgL + "px",
			"marginRight": mgR + "px"
		});
		this.margin = [mgT, mgR, mgB, mgL];
		return this;
	}
};

Js.namespace.include("Animator", Js.ext.Animator);

Js.extend('fx', (function(spec) {
	var key = Js.code.pick(this.index, null);
	
	if (Js.code.isnull(key)) {
		Js.code.each(this.animate, function() {
			this.fx(spec);
		});
	} else if (!!this.node[key]) {
		this.animate[key].fx(spec);
	}
							  
	return this;
}));

Js.extend('syncFx', (function(spec) {
	var key = Js.code.pick(this.index, null);
	
	if (Js.code.isnull(key)) {
		Js.code.each(this.animate, function(){
			this.sync(spec);
		});
	} else if (!!this.node[key]) { 
		this.animate[key].sync(spec);
	}
	
	return this;
}));

Js.extend('queueFx', (function(spec) {
	var key = Js.code.pick(this.index, null);
	
	if (Js.code.isnull(key)) {
		Js.code.each(this.animate, function(){ 
			this.queue(spec); 
		});
	} else if (!!this.node[key]) {
		this.animate[key].queue(spec);
	}
	
	return this;
}));
