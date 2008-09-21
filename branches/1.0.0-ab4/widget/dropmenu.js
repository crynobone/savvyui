/*
 * Savvy.UI JavaScript Library Application
 * Name: DropMenu
 * Type: Utility/Plug-In
 * Version: 0.5 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
*/

Js.widget.include({
	name: "DropMenu",
	object: function(selector) {
		this.object = null;
		this.node = null;
		this.lastnode = null;
		this.content = null;
		this.child = null;
		this.status = 0;
		
		if (!!selector && typeof(selector) === "string") {
			this.init(selector);
		}
		
		return this;
	},
	proto: {
		init: function(selector) {
			if (!!selector && Jrun.trim(selector) !== "") {
				var that = this;
				this.object = Js(selector);
				var mUL = Js(selector + " > ul");
				var mLI = Js("li", mUL.fetch()); 
				
				mUL.appendClass("widgetdropmenu-container");
				mLI.onhover(function() {
					Js(this).appendClass("widgetdropmenu-hover");
				}, function() {
					Js(this).removeClass("widgetdropmenu-hover");
				});
			}
			return this;
		}
	}
});