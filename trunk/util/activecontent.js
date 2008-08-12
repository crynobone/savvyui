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

Js.util.include("ActiveContent", Js.base.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	sel: null,
	option: null,
	__construct: function(sel) {
		this.sel = Js.code.pick(sel, null);
		
		if(Js.code.isset(this.sel)) {
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
		if(Js.code.isset(this.interval)) {
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.sel = null;
		this.__destruct();
		return null;
	},
	selector: function() {
		var that = this;
		
		Js(this.sel).clicks(function() {
			var h = Js(this).get("href");
			var an = (Js.code.isset(h) ? h : this.href);
			
			if(an.match(/^\#/)) {
				var a = ["", an.substring(1, an.length)];
			} else { 
				var a = an.split(/\#/);
			}
			
			if(Js.code.isset(a[1])) {
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
