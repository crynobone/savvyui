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

SUI.Widget.include("DropMenu", function(sel) {
	this.object = null;
	this.node = null;
	this.lastnode = null;
	this.content = null;
	this.child = null;
	this.status = 0;
	
	if (!!sel && typeof(sel) === "string") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	Initialize: function(sel) {
		if (!!sel && SUI.fn.trim(sel) !== "") {
			var that = this;
			this.object = SUI(sel);
			var mList = SUI(sel + " ul > li > a");
			
			mList.each(function() {
				SUI(this).hovers(function() {
					that.node = this.parentNode;
					that.__SHOW__(sel, this.parentNode);
				}, function() {
					that.status = 0;
					setTimeout((function() { 
						that.__HIDE__(sel);
					}), 5);
				}).done();
			});
		}
		return this;
	},
	__SHOW__: function(sel, node) {
		var that = this;
		var sUL = SUI("> ul", node);
		if (sUL.count() > 0) {
			this.status = 1;
			var t = SUI.Dimension.Node.Offset(node);
			
			if (SUI.fn.finds([sel,"menucontainer"].join("_")) && SUI.fn.isset(this.child)) {
				if(SUI.fn.isset(this.lastnode)) {
					SUI(this.lastnode).insert(this.content);
					this.lastnode = null;
				}
				
				SUI.DOM.Remove(this.child.first().fetch());
				this.child = null;
			}
			
			this.child = SUI("body").insertion("div").css("visibility", "hidden").alpha(0);
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
					"left":t[3] + "px",
					"top":(t[1] + t[2] - 4) + "px",
					"height":"0px"
				}).fx({
					method:"fade",
					transaction:[0, 97],
					ease:1.3,
					step:40,
					shutter:40
				}).syncFx({
					method:"resizeHeight",
					transaction:[0, h],
					ease:0.9,
					step:100,
					shutter:20
				});
				
			}
			this.lastnode = node;
			
			this.child.hovers(function() {
				that.status = 1;
				that.node = node;
			}, function() {
				if(SUI.fn.finds([sel, "menucontainer"].join("_"))) {
					that.status = 0;
					setTimeout((function() {
						that.__HIDE__(sel);
					}), 5);
				}
			}).done();
		}
		sUL.done();
	},
	__HIDE__: function(sel) {
		if (this.status == 0) {
			if (SUI.fn.isset([sel, "menucontainer"].join("_")) && SUI.fn.isset(this.child)) {
				if (SUI.fn.isset(this.lastnode)) {
					SUI(this.lastnode).insert(this.content).done();
					this.lastnode = null;
				}
				
				SUI.DOM.Remove(this.child.first().fetch());
				this.child = null;
			}
		}
	}
};

SUI.Util.include("DropMenu", SUI.Widget.DropMenu);
