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

Js.util.include({
	name: "activeContent", 
	object: Js.base.create({
		last: null,
		interval: null,
		repeat: false,
		init: null,
		element: null,
		option: null,
		__construct: function(selector) {
			this.element = Jrun.pick(selector, null);
			
			if(Jrun.isset(this.element)) {
				this.selector();
				this.check();
			} else {
				var that = this;
				this.interval = window.setInterval(function() {
					that.check();
				}, 100);
			}
		},
		destruct: function() {
			if(Jrun.isset(this.interval)) {
				clearInterval(this.interval);
				this.interval == null;
			}
			
			this.element = null;
			this.__destruct();
			return null;
		},
		selector: function() {
			var that = this;
			
			Js(this.element).onclick(function() {
				var href = Js(this).get("href");
				var anchors = (Jrun.isset(href) ? href : this.href);
				
				if(anchors.match(/^\#/)) {
					var ahref = ["", anchors.substr(1)];
				} else { 
					var ahref = anchors.split(/\#/);
				}
				
				if(Jrun.isset(ahref[1])) {
					that.repeat = (ahref[1] === that.last);
					
					that.last = ahref[1];
					var data = ahref[1].split(/\//);
					that.init(data);
				}
			});
		},
		check: function() {
			if(location.hash != this.last && location.hash !== "#") {
				this.last = location.hash;
				
				var data = location.hash.substr(1).split(/\//);
				this.init(data);
			}
		}
	})
});
