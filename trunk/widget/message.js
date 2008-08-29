/*
 * Savvy.UI JavaScript Library Application
 * Name: message
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
*/

Js.widget.include({
	name: "message", 
	object: {
		node: null,
		add: function(spec) {
			if(Jrun.isnull(this.node)) {
				this.init();
			}
			
			var that = this;
			var text = Jrun.pick(spec.text, "");
			var timeout = Jrun.pick(spec.timeout, 5000);
			var type = Jrun.pick(spec.type, "note");
			var closable = Jrun.pick(spec.closable, true);
			
			timeout = (Js.test.isInteger(timeout) ? timeout : 5000);
			
			(function() {
				var div = that.node.add("div", {"class": "widgetmessage-box"}).css("margin", "2px 0px").hide();
				
				if(!!closable) {
					var span = div.add("span", {"class": "widgetmessage-close"}).text("x");
				}
				
				var p = div.add("p").text(text);
				var t = setTimeout(function() {
					div.remove(span.fetch());
					div.remove(p.fetch());
					div.hide("slow");
				}, timeout);
				
				if(!!closable) {
					span.onclick(function() {
						clearTimeout(t);
						t = null;
						div.remove(span.fetch());
						div.remove(p.fetch());
						div.hide("slow");
					});
				}
				div.appendClass(type);
				div.show("slow");
			})();
		},
		init: function() {
			var that = this;
			this.node = Js("body").first().add("div", {"id": "widgetmessage"});
			
			var whenScroll = function() {
				var y = Js.ext.dimension.page.scrolls.y();
				that.node.css("top", y + "px");
			};
			var currentScroll = window.onscroll;
			window.onscroll = function() {
				if(Jrun.isfunction(currentScroll)) {
					currentScroll();	
				}
				whenScroll();	
			};
			whenScroll();
		}
	}
});
