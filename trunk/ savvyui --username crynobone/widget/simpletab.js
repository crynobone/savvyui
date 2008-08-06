/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Widget.SimpleTab
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core
*/

SUI.Widget.include("SimpleTab", function(sel) {
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.object = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	
	// start __constructor()
	if(SUI.fn.typeOf(sel) === "object" || SUI.fn.typeOf(sel) === "string") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	Initialize: function(sel) {
		var that = this;
		this.object = SUI(sel);
		this.object.setClass("simpletab-container");
		this.element = this.object.first().get("id");
		
		var child = this.object.has("div.x-simpletab-panel");
		var h = window.location.hash;
		
		if(h.match(/^#(.+)/)) {
			var hashtab = this.object.has(h);
			if(hashtab.count() > 0) {
				this.activeTab = hashtab;
			} else {
				this.activeTab = SUI(child.first().fetch());
			}
		} else {
			this.activeTab = SUI(child.first().fetch());
		}
		
		this.__TOOLBAR__(this.element);
		
		child.each(function() {
			that.__HEADER__(this);
			SUI(this).setClass("simpletab-hidden");			
		});
			
		this.activeHeader = SUI("a[href=#" + this.activeTab.get("id") + "]");
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
	},
	makeActive: function(hash) {
		
	},
	addTab: function(spec) {
		var that = this;
		if(!!spec.id && SUI.fn.typeOf(spec.id) === "string") {
			var title = SUI.fn.pick(spec.title, "Untitled");
			var id = spec.id;
			var content = SUI.fn.pick(spec.content, "");
			var closable = SUI.fn.pick(spec.closable, false);
			var set = SUI.fn.pick(spec.activate, false);
			
			var obj = this.object.add("div", {"id": id, "class": "simpletab-hidden"}).html(content);
			var li = this.header.add("li");
			var a = li.add("a", {
				"href": "#" + id,
				"title": title
			});
			a.add("em");
			a.text(title).clicks(function() {
				that.__ACTIVE__(this);
			});
			
			if (!!closable) {
				a.add("span").css("paddingLeft", "10px").text("x").clicks(function() { // clicks to mouseovers
					var href = SUI(this.parentNode).get("href");
					that.activeHeader.setClass("").done();
					that.activeTab.setClass("simpletab-hidden").done();
					that.object.remove(SUI(href).fetch());
					SUI.DOM.Remove(this.parentNode.parentNode);
					
					//that.__REVERT__();
				});
			}
			if(!!set) {
				this.__ACTIVE__(obj);
			}
		}
		return this;
	},
	__TOOLBAR__: function(el) {
		var div = SUI("body").first().add("div", {
			"class": "simpletab-toolbar-container",
			"id": this.element + "toolbar"
		});
		
		SUI.DOM.AddBefore(div.fetch(0), this.object.fetch());
		this.toolbar = div;
		
		this.header = this.toolbar.add("ul", {
			"id": [el, "toolbar"].join("-"),
			"class": "simpletab-toolbar"
		});
		var div2 = div.add("div").css("display", "block");
	},
	__ACTIVE__: function(obj) {
		var that = this;
		this.activeHeader.setClass("");
		this.activeTab.setClass("simpletab-hidden");
		
		this.activeHeader = SUI(obj);
		var href = this.activeHeader.get("href");
		this.activeTab = SUI(href);
		
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
		window.location.hash = href;
	},
	__REVERT__: function() {
		var activecon = this.header.has("li > a");
		if(activecon.count() > 0) {
			this.__ACTIVE__(activecon.first().fetch());
		}
	},
	__HEADER__: function(obj) {
		var that = this;
		var obj = SUI(obj);
		var title = obj.get("title");
		var closable = obj.hasClass("tab-closable");
		
		var li = this.header.insertion("li");
		
		var a = li.add("a", {
			"href": "#" + obj.get("id"),
			"title": title
		});
		
		a.add("em");
		a.text(title).clicks(function() {
			that.__ACTIVE__(this);
		});
		
		if (!!closable) {
			a.add("span").css("paddingLeft", "10px").text("x").clicks(function() {
				var my = SUI(this.parentNode).clicks(function() { return false; });
				
				var href = my.get("href");
				that.activeHeader.setClass("").done();
				that.activeTab.setClass("simpletab-hidden").done();
				that.object.remove(SUI(href).fetch());
				SUI.DOM.Remove(this.parentNode.parentNode);
				
				that.__REVERT__();
			});
		}
	}
};

// Backward Compatiblity
SUI.Util.include("SimpleTab", SUI.Widget.SimpleTab);
