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
*/

Js.widget.autoComplete = function(spec) {
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
	this.success = null;
	
	if(typeof(spec) === "object") {
		this.init(spec);
	}
	
	return this;
};

Js.widget.autoComplete.prototype = {
	init: function(spec) {
		var that = this;
		
		this.element = Jrun.pick(spec.element, this.element);
		this.separator = Jrun.pick(spec.separator, this.separator);
		this.object = Jrun.pick(spec.object, this.object);
		this.minimum = Jrun.pick(spec.minimum, this.minimum);
		this.delay = Jrun.pick(spec.delay, this.delay);
		this.uri = Jrun.pick(spec.uri, this.uri);
		this.type = Jrun.pick(spec.type, this.type);
		this.success = Jrun.pick(spec.success, this.success);
		
		this.type = (!!this.type.match(/^(single|multiple)$/gi) ? this.type.toLowerCase() : 'single');
		
		this.method = ((!!spec.method && !!spec.method.match(/^(get|post)$/gi)) ? spec.method.toUpperCase() : 'GET'); 
		
		if(!!this.element) {
			this.object = jQuery(this.element);
		} else {
			this.object = jQuery(this.object);
		}
		
		this.name = this.object.attr("name");
		
		this.object.keyup(function() {
			if(that.timeoutId) {
				clearTimeout(that.timeoutId);
				that.timeoutId = null;
			}
			
			that.matched = [];
			
			if(that.type === "multiple") {
				var value = this.value;
				var values = value.split(that.separator);
				var length = values.length;
				var value = Jrun.trim(values[(length - 1)]);
				
				for(var i = 0; i < (length - 1); i++) {
					that.matched[that.matched.length] = Jrun.trim(val[i]);
				}
			} else {
				var value = Jrun.trim(this.value);	
			}
			
			if(value.length > that.minimum && value !== that.value) {
				that.timeoutId = window.setTimeout(function() {
					that.show(value);
				}, that.delay);
			}
		}).blur(function() {
			that.timeoutId = window.setTimeout((function() {
				that.status = 0;
				that.hide();
			}), 1000);
		});
		
		return this;
	},
	show: function(value) {
		var that = this;
		this.status = 1;
		
		if(!!this.div) {
			this.div.remove();
			this.div = null;
		}
		
		this.div = jQuery("<div/>").attr({
			id: ["autocomplete", this.name].join("_"),
			className: "x-autocomplete"
		}).appendTo("body").hide();
		
		var t = Js.util.dimension.node.offset(this.object[0]);
		this.div.css({
			"left": t[3] + "px",
			"top": (t[1] + t[2]) + "px",
			"width": t[0] + "px"
		});
		
		jQuery.ajax({
			url: this.uri,
			type: this.method,
			data: "&" + that.name + "=" + value,
			success: (function(reply) {
				that.request(reply);
			})
		});
		
		this.value = value;
	},
	hide: function() {
		var that = this;
		if(!!this.div && this.status === 0) {
			
			this.div.slideUp("normal", function() {
				that.div.remove();
				that.div = null;
				clearTimeout(that.timeoutId);
				that.timeoutId = null;
			});
		}
	},
	request: function(reply) {
		var that = this;
		
		that.div.html("");
		var data = eval("(" + reply + ")");
		var ul = jQuery("<ul/>").appendTo(that.div);
		
		var arr = Jrun.toArray(data);
		
		if(arr.length >= 2 || (arr.length === 1 && Jrun.trim(arr[0]) !== "")) {
			Jrun.each(arr, function() {
				if(Jrun.trim(this) !== "") {
					var text = this.value.toString();
					var desc = this.desc.toString();
					var li = jQuery("<li/>").appendTo(ul);
					
					var a = jQuery("<a/>").attr({href: "#"}).click(function() {
						clearTimeout(that.ctimeout);
						that.ctimeout = null;
						that.status = 1;
						
						var value = text;
						if(that.type == "single") {
							that.matched[0] = value;
							that.object.val(value);
						} else {
							that.matched.push(value);
							that.object.val(that.matched.join(", "));
						}
						
						if(!!Jrun.isfunction(that.success)) {
							that.success(text, desc, that);	
						}
						
						that.status = 0;
						return false;
					}).appendTo(li);
					jQuery("<strong>" + text + "</strong><span>" + desc + "</span>").appendTo(a);
				}
			});
			
		} else {
			var li = jQuery("<li/>").appendTo(ul);
			
			var a = jQuery("<a/>").attr({href: "#"}).click(function() {
				that.status = 0;
				that.hide();																	
			}).mouseover(function() {
				that.status = 0;
				that.hide();
			}).text("No match");
		}
		
		that.div.slideDown("normal");
		that.div.hover(function() {
			that.status = 1;
			clearTimeout(that.ctimeout);
			that.ctimeout = null;
		}, function() {
			that.status = 1;	
			clearTimeout(that.ctimeout);
			that.ctimeout = null;
		});
	}
};
