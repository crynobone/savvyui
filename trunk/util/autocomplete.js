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

Js.util.include("AutoComplete", function(spec) {
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
	this.timeoutId = null;
	this.status = 0;
	
	if(typeof(spec) === "object") {
		this.init(spec);
	}
	
	return this;
}).prototype = {
	init: function(spec) {
		var that = this;
		
		this.element = Js.code.pick(spec.element, this.element);
		this.separator = Js.code.pick(spec.separator, this.separator);
		this.object = Js.code.pick(spec.object, this.object);
		this.minimum = Js.code.pick(spec.minimum, this.minimum);
		this.delay = Js.code.pick(spec.delay, this.delay);
		this.uri = Js.code.pick(spec.uri, this.uri);
		this.type = Js.code.pick(spec.type, this.type);
		
		this.method = (spec.method.match(/^(get|post)$/gi) ? spec.method.toUpperCase() : 'GET'); 
		
		if(!!this.element) {
			this.object = Js(this.element);
		} else {
			this.object = Js(this.object);
		}
		
		this.name = this.object.get("name");
		
		this.object.onkeyup(function() {
			if(that.timeoutId) {
				clearTimeout(that.timeoutId);
				that.timeoutId = null;
			}
			that.matched = [];
			
			if(that.type === "multiple") {
				var values = this.value;
				var val = values.split(that.separator);
				var length = value.length;
				var value = Js.code.trim(val[(length - 1)]);
				
				for(var i = 0; i < (length - 1); i++) {
					that.matched[that.matched.length] = Js.code.trim(val[i]);
				}
			} else {
				var value = Js.code.trim(this.value);	
			}
			
			if(value.length > that.minimum && value !== that.value) {
				that.timeoutId = window.setTimeout(function() {
					that.show(value);
				}, that.delay);
			}
		}).onblur(function() {
			that.timeoutId = window.setTimeout((function() {
				that.status = 0;
				that.hide();
			}), 5000);
		});
		
		return this;
	},
	show: function(value) {
		var that = this;
		this.status = 1;
		
		if(!!this.div) {
			Js.dom.remove(this.div.fetch());
			this.div = null;
		}
		this.div = Js("body").first().add("div", {
			"id": ["autocomplete", this.name].join("_"),
			"class": "x-autocomplete"
		}).hide();
		
		var t = Js.ext.dimension.node.offset(this.object.fetch());
		this.div.css({
			"left": t[3] + "px",
			"top": (t[1] + t[2]) + "px",
			"width": t[0] + "px"
		});
		
		new Js.ext.Ajax({
			uri: this.uri,
			method: this.method,
			parameters: "&" + that.name + "=" + value,
			onComplete: (function() {
				that.request(this);
			})
		});
		
		this.value = value;
	},
	hide: function() {
		if(!!this.div && this.status === 0) {
			Js.dom.remove(this.div.fetch());
			this.div = null;
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	},
	request: function(data) {
		var that = this;
		if(data.readyState === 4 && data.status === 200) {
			var text = data.responseText;
			that.div.html("");
			var reply = eval("(" + text + ")");
			var ul = that.div.add("ul");
			
			var arr = Js.code.toArray(reply);
			
			if(arr.length >= 2 || (arr.length === 1 && Js.code.trim(arr[0]) !== "")) {
				Js.code.each(arr, function() {
					if(Js.code.trim(this) !== "") {
						var li = ul.add("li");
						var a = li.add("a", {
							"href": "#"
						}).text(this).onclick(function() {
							clearTimeout(that.ctimeout);
							that.ctimeout = null;
							that.status = 1;
							
							var value = Js(this).html();
							that.matched.push(value);
							that.object.val(that.matched.join(", "));
							that.status = 0;
							that.hide();
							return false;
						});
					}
				});
				
			} else {
				var li = ul.add("li");
				var a = li.add("a", {"href": "#"}).text("No match").onclick(function() {
					that.status = 0;
					that.hide();																	
				}).mouseovers(function() {
					that.status = 0;
					that.hide();
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
