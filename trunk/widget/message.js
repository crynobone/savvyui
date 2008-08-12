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

Js.widget.include("message", {
	node: null,
	add: function(spec) {
		if(Js.code.isnull(this.node)) {
			this.init();
		}
		
		var that = this;
		var text = Js.code.pick(spec.text, "");
		var timeout = Js.code.pick(spec.timeout, 5000);
		var type = Js.code.pick(spec.type, "note");
		var closable = Js.code.pick(spec.closable, true);
		
		timeout = (Js.test.isInteger(timeout) ? timeout : 5000);
		
		(function() {
			var div = that.node.add("div", {"class": "sui-messagebox"}).css("margin", "2px 0px").hide();
			
			if(!!closable) {
				var span = div.add("span", {"class": "sui-messagebox-close"}).text("x");
			}
			
			var p = div.add("p").text(text);
			var t = setTimeout(function() {
				div.remove(span.fetch());
				div.remove(p.fetch());
				div.hide("slow");
			}, timeout);
			
			if(!!closable) {
				span.clicks(function() {
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
		this.node = Js("body").first().add("div", {"id": "sui-message"}).show();
	}
});
