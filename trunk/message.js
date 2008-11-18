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
*/

Js.widget.message = {
	node: null,
	add: function(spec) {
		if(Jrun.isnull(this.node)) {
			this.init();
		}
		
		var that = this;
		var text = Jrun.pick(spec.text, "");
		var timeout = Jrun.pick(spec.timeout, 8000);
		var type = Jrun.pick(spec.type, "note");
		var closable = Jrun.pick(spec.closable, true);
		
		timeout = (Js.test.isInteger(timeout) ? timeout : 8000);
		
		(function() {
			var div = jQuery("<div/>").attr({className: "widgetmessage-box"}).css("margin", "2px 0px").appendTo(that.node).hide();
			
			if(!!closable) {
				var span = jQuery("<span/>").attr({className: "widgetmessage-close"}).text("x").appendTo(div);
			}
			
			var p = jQuery("<p/>").html(text).appendTo(div);
			
			var t = setTimeout(function() {
				div.hide("normal", function() {
					span.remove();
					p.remove();						
				});
			}, timeout);
			
			if(!!closable) {
				span.click(function() {
					clearTimeout(t);
					t = null;
					
					div.hide("normal", function() {
						span.remove();
						p.remove();					  
					});
				});
			}
			div.addClass(type);
			div.show("slow");
		})();
	},
	init: function() {
		var that = this;
		this.node = jQuery("<div/>").attr({id: "widgetmessage"}).appendTo("body");
		
		var whenScroll = function() {
			var y = Js.util.dimension.page.scrolls.y();
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
};
