/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Utils.DropMenu
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

Js.widget.include("DropMenu", function(sel) {
	this.object = null;
	this.node = null;
	this.lastnode = null;
	this.content = null;
	this.child = null;
	this.status = 0;
	
	if (!!sel && typeof(sel) === "string") {
		this.init(sel);
	}
	
	return this;
}).prototype = {
	init: function(sel) {
		if (!!sel && Js.code.trim(sel) !== "") {
			var that = this;
			this.object = Js(sel);
			var mList = Js(sel + " ul > li > a");
			
			mList.each(function() {
				Js(this).hovers(function() {
					that.node = this.parentNode;
					that.show(sel, this.parentNode);
				}, function() {
					that.status = 0;
					setTimeout((function() { 
						that.hide(sel);
					}), 5);
				}).done();
			});
		}
		return this;
	},
	show: function(sel, node) {
		var that = this;
		var sUL = Js("> ul", node);
		
		if(sUL.count() > 0) {
			this.status = 1;
			var t = Js.ext.dimension.node.offset(node);
			
			if(Js.code.finds([sel,"menucontainer"].join("_")) && Js.code.isset(this.child)) {
				if(Js.code.isset(this.lastnode)) {
					Js(this.lastnode).insert(this.content);
					this.lastnode = null;
				}
				
				Js.dom.remove(this.child.first().fetch());
				this.child = null;
			}
			
			this.child = Js("body").add("div").css("visibility", "hidden").alpha(0);
			this.child.setup({
				"id": [sel, "menucontainer"].join("_"),
				"class": "menu"
			});
			
			this.content = sUL.first().fetch();
			
			var text = "<ul>" + this.content.innerHTML + "</ul>";
			
			if (this.child.html() != text) {
				this.child.insert(this.content);
				var h = this.child.fetch().offsetHeight;
				
				this.child.css({
					"left": t[3] + "px",
					"top": (t[1] + t[2] - 4) + "px",
					"height": "0px"
				}).fx({
					method: "fade",
					transaction: [0, 97],
					ease: 1.3,
					step: 40,
					shutter: 40
				}).syncFx({
					method: "resizeHeight",
					transaction: [0, h],
					ease: 0.9,
					step: 100,
					shutter: 20
				});
				
			}
			this.lastnode = node;
			
			this.child.hovers(function() {
				that.status = 1;
				that.node = node;
			}, function() {
				if(Js.code.finds([sel, "menucontainer"].join("_"))) {
					that.status = 0;
					setTimeout((function() {
						that.hide(sel);
					}), 5);
				}
			}).done();
		}
		sUL.done();
	},
	hide: function(sel) {
		if(this.status == 0) {
			if(Js.code.isset([sel, "menucontainer"].join("_")) && Js.code.isset(this.child)) {
				if(Js.code.isset(this.lastnode)) {
					Js(this.lastnode).insert(this.content).done();
					this.lastnode = null;
				}
				
				Js.dom.remove(this.child.first().fetch());
				this.child = null;
			}
		}
	}
};

Js.util.include("DropMenu", Js.widget.DropMenu);
