/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Widget.Message
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

SUI.Widget.include("Message", {
	node: null,
	Add: function(spec) {
		if(SUI.fn.isnull(this.node)) {
			this.Initialize();
		}
		var that = this;
		var text = SUI.fn.pick(spec.text, "");
		var timeout = SUI.fn.pick(spec.timeout, 5000);
		var type = SUI.fn.pick(spec.type, "note");
		var closable = SUI.fn.pick(spec.closable, true);
		
		timeout = (SUI.Test.isInteger(timeout) ? timeout : 5000);
		
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
	Initialize: function() {
		this.node = SUI("body").first().add("div", {"id": "sui-message"}).show();
	}
});
