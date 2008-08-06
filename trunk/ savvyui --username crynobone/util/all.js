/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Util.Anchor
 * Type: Utility/Plug-In
 * Version: 0.1 (alpha-release)
 * Last Updated: 19th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, SUI.JsClass
*/

SUI.Util.include("Anchor", SUI.JsClass.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	sel: null,
	option: null,
	__construct: function(sel) {
		this.sel = SUI.fn.pick(sel, null);
		
		if(SUI.fn.isset(this.sel)) {
			this.selector();
			this.check();
		} else {
			var that = this;
			this.interval = window.setInterval(function() {
				that.check();
			}, 100);
		}
	},
	destroy: function() {
		if(SUI.fn.isset(this.interval)) {
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.sel = null;
		this.__destruct();
		return null;
	},
	selector: function() {
		var that = this;
		
		SUI(this.sel).clicks(function() {
			var h = SUI(this).get("href");
			var an = (SUI.fn.isset(h) ? h : this.href);
			
			if(an.match(/^\#/)) {
				var a = ["", an.substring(1, an.length)];
			} else { 
				var a = an.split(/\#/);
			}
			
			if(SUI.fn.isset(a[1])) {
				that.repeat = (a[1] === that.last);
				
				that.last = a[1];
				var i = a[1].split(/\//);
				that.init(i);
			}
		});
	},
	check: function() {
		if(location.hash != this.last && location.hash !== "#/" && location.hash !== "#"){
			this.last = location.hash;
			var i;
			i = location.hash.substring(1, location.hash.length).split(/\//);
			this.init(i);
		}
	}
}));
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Util.AutoComplete
 * Type: Utility/Plug-In
 * Version: 0.1 (alpha-release)
 * Last Updated: 1st July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: SUI, SUI.Elements
*/

SUI.Util.include("AutoComplete", function(spec) {
	this.element = null;
	this.name = null;
	this.object = null;
	this.div = null;
	this.type = "single";
	this.method = "GET";
	this.uri = "";
	this.minimum = 3;
	this.value = '';
	this.delay = 10;
	this.matched = [];
	this.separator = ',';
	this.timeout = null;
	this.ctimeout = null;
	this.status = 0;
	
	if(typeof(spec) === "object") {
		this.Initialize(spec);
	}
	
	return this;
}).prototype = {
	Initialize: function(spec) {
		var that = this;
		
		this.element = SUI.fn.pick(spec.element, this.element);
		this.separator = SUI.fn.pick(spec.separator, this.separator);
		this.object = SUI.fn.pick(spec.object, this.object);
		this.minimum = SUI.fn.pick(spec.minimum, this.minimum);
		this.delay = SUI.fn.pick(spec.delay, this.delay);
		this.uri = SUI.fn.pick(spec.uri, this.uri);
		this.type = SUI.fn.pick(spec.type, this.type);
		
		this.method = (SUI.fn.inArray(['post','get'], spec.method.toLowerCase()) ? spec.method.toUpperCase() : 'GET'); 
		
		if (!!this.element) {
			this.object = SUI(this.element);
		} else {
			this.object = SUI(this.object);
		}
		
		this.name = this.object.get("name");
		
		this.object.keyups(function() {
			if(that.timeout) {
				clearTimeout(that.timeout);
				that.timeout = null;
			}
			that.matched = [];
			
			if(that.type === "multiple") {
				var values = this.value;
				var val = values.split(that.separator);
				var len = val.length;
				var value = SUI.fn.trim(val[(len - 1)]);
				
				for(var i = 0; i < (len - 1); i++) {
					that.matched.push(SUI.fn.trim(val[i]));
				}
			} else {
				var value = SUI.fn.trim(this.value);	
			}
			
			if(value.length > that.minimum && value !== that.value) {
				that.timeout = window.setTimeout((function() {
					that.__SHOW__(value);
				}), that.delay);
			}
		}).blurs(function() {
			that.ctimeout = window.setTimeout((function() {
				that.status = 0;
				that.__HIDE__();
			}), 5000);
		});
		
		return this;
	},
	__SHOW__: function(value) {
		var that = this;
		this.status = 1;
		
		if(!!this.div) {
			SUI.DOM.Remove(this.div.fetch());
			this.div = null;
		}
		this.div = SUI("body").first().add("div", {
			"id": ["autocomplete", this.name].join("_"),
			"class": "x-autocomplete"
		}).hide();
		
		var t = SUI.Dimension.Node.Offset(this.object.fetch());
		this.div.css({
			"left": t[3] + "px",
			"top": (t[1] + t[2]) + "px",
			"width": t[0] + "px"
		});
		
		new SUI.Ext.Ajax({
			uri: this.uri,
			method: this.method,
			parameters: "&" + that.name + "=" + value,
			onComplete: (function() {
				that.__XHR__(this);
			})
		});
		
		this.value = value;
	},
	__HIDE__: function() {
		if(!!this.div && this.status === 0) {
			SUI.DOM.Remove(this.div.fetch());
			this.div = null;
			clearTimeout(this.ctimeout);
			this.ctimeout = null;
		}
	},
	__XHR__: function(data) {
		var that = this;
		if(data.readyState === 4 && data.status === 200) {
			var text = data.responseText;
			that.div.html("");
			var reply = eval("(" + text + ")");
			var ul = that.div.add("ul");
			
			var arr = SUI.fn.toArray(reply);
			
			if(arr.length >= 2 || (arr.length === 1 && SUI.fn.trim(arr[0]) !== "")) {
				SUI.fn.each(arr, function() {
					if(SUI.fn.trim(this) !== "") {
						var li = ul.add("li");
						var a = li.add("a", {
							"href": "#"
						}).text(this).clicks(function() {
							clearTimeout(that.ctimeout);
							that.ctimeout = null;
							that.status = 1;
							
							var value = SUI(this).html();
							that.matched.push(value);
							that.object.val(that.matched.join(", "));
							that.status = 0;
							that.__HIDE__();
							return false;
						});
					}
				});
				
			} else {
				var li = ul.add("li");
				var a = li.add("a", {"href": "#"}).text("No match").clicks(function() {
					that.status = 0;
					that.__HIDE__();																	
				}).mouseovers(function() {
					that.status = 0;
					that.__HIDE__();
				});
			}
			
			that.div.show("slow").hovers(function() {
				that.status = 1;
				clearTimeout(that.ctimeout);
				that.ctimeout = null;
			}, function() {
				that.status = 1;	
				clearTimeout(that.ctimeout);
				that.ctimeout = null;
			});
			
		}
	}
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Util.Ticker
 * Type: Utility/Plug-in
 * Version: 0.1 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core
*/

// Import Plugin
SUI.Util.include("Ticker", function(sel) {
	// Define Object's properties
	this.element = null;
	this.node = null;
	
	// start __constructor()
	if (!!sel && SUI.fn.trim(sel) !== "") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	// Initialize the HTML Element
	Initialize: function(sel) {
		this.element = SUI.fn.pick(sel, "");
		
		if (SUI.fn.isset(this.element)) { 
			this.node = SUI(this.element);
		}
		
		return this;
	},
	// checked all checkbox
	Check: function() {
		// loop all object
		this.node.each(function() {
			// set checked to true
			this.checked = true;
		});
	},
	// uncheck all checkbox
	Uncheck: function() {
		// loops all object
		this.node.each(function() { 
			// set checked to false
			this.checked = false;
		});
	},
	// invert checkbox selection
	Invert: function() {
		// loops all object
		this.node.each(function() {
			// reverse checkbox selection
			if (this.checked == true) {
				this.checked = false; // uncheck
			} else { 
				this.checked = true; // checked
			}
		});
	}
};
