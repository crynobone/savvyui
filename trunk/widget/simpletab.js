/*
 * Savvy.UI JavaScript Library Application
 * Name: SimpleTab
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

Js.widget.include({
	name: "SimpleTab", 
	object: function(js) {
		this.temp = null;
		this.height = null;
		this.toolbar = null;
		this.object = null;
		this.header = null;
		this.element = null;
		this.activeTab = null;
		this.activeHeader = null;
		
		// start __constructor()
		if(Jrun.typeOf(js) === "object" || Jrun.typeOf(js) === "string") {
			this.init(js);
		}
		
		return this;
	}, 
	proto: {
		init: function(sel) {
			var that = this;
			this.object = Js(sel);
			this.object.setClass("simpletab-container");
			this.element = this.object.first().get("id");
			
			var child = this.object.has("div.x-simpletab, div.x-simpletab-panel");
			var h = window.location.hash;
			
			if(h.match(/^#(.+)/)) {
				var hashtab = this.object.has(h);
				if(hashtab.count() > 0) {
					this.activeTab = hashtab;
				} else {
					this.activeTab = Js(child.first().fetch());
				}
			} else {
				this.activeTab = Js(child.first().fetch());
			}
			
			this.addToolbar(this.element);
			
			child.each(function() {
				that.addHeader(this);
				Js(this).setClass("simpletab-hidden");			
			});
				
			this.activeHeader = Js("a[href=#" + this.activeTab.get("id") + "]");
			this.activeHeader.setClass("current");
			this.activeTab.setClass("simpletab-active");
		},
		makeActive: function(hash) {
			
		},
		addTab: function(spec) {
			var that = this;
			if(!!spec.id && Jrun.typeOf(spec.id) === "string") {
				var title = Jrun.pick(spec.title, "Untitled");
				var id = spec.id;
				var content = Jrun.pick(spec.content, "");
				var closable = Jrun.pick(spec.closable, false);
				var set = Jrun.pick(spec.activate, false);
				
				var obj = this.object.add("div", {"id": id, "class": "simpletab-hidden"}).html(content);
				var li = this.header.add("li");
				var a = li.add("a", {
					"href": "#" + id,
					"title": title
				});
				a.add("em");
				a.text(title).onclick(function() {
					that.activate(this);
				});
				
				if (!!closable) {
					a.add("span").css("paddingLeft", "10px").text("x").onclick(function() { // clicks to mouseovers
						var href = Js(this.parentNode).get("href");
						that.activeHeader.setClass("").done();
						that.activeTab.setClass("simpletab-hidden").done();
						that.object.remove(Js(href).fetch());
						Js.dom.remove(this.parentNode.parentNode);
						
					});
				}
				if(!!set) {
					this.activate(obj);
				}
			}
			return this;
		},
		addToolbar: function(el) {
			div = Js("body").first().add("div", {
				"class": "simpletab-toolbar-container",
				"id": this.element + "toolbar"
			});
			
			Js.dom.addBefore(div.fetch(), this.object.fetch());
			this.toolbar = div;
			
			this.header = this.toolbar.add("ul", {
				"id": [el, "toolbar"].join("-"),
				"class": "simpletab-toolbar"
			});
			var div2 = div.add("div").css("display", "block");
		},
		activate: function(obj) {
			var that = this;
			this.activeHeader.setClass("");
			this.activeTab.setClass("simpletab-hidden");
			
			this.activeHeader = Js(obj);
			var href = this.activeHeader.get("href");
			this.activeTab = Js(href);
			
			this.activeHeader.setClass("current");
			this.activeTab.setClass("simpletab-active");
			window.location.hash = href;
		},
		revert: function() {
			var activecon = this.header.has("li > a");
			if(activecon.count() > 0) {
				this.activate(activecon.first().fetch());
			}
		},
		addHeader: function(obj) {
			var that = this;
			var obj = Js(obj);
			var title = obj.get("title");
			var closable = obj.hasClass("tab-closable");
			
			var li = this.header.insertion("li");
			
			var a = li.add("a", {
				"href": "#" + obj.get("id"),
				"title": title
			});
			
			a.add("em");
			a.text(title).onclick(function() {
				that.activate(this);
			});
			
			if(!!closable) {
				a.add("span").css("paddingLeft", "10px").text("x").onclick(function() {
					var my = Js(this.parentNode).onclick(function() { 
						return false; 
					});
					
					var href = my.get("href");
					that.activeHeader.setClass("").done();
					that.activeTab.setClass("simpletab-hidden").done();
					that.object.remove(Js(href).fetch());
					Js.dom.remove(this.parentNode.parentNode);
					
					that.revert();
				});
			}
		}
	}
});

// Backward Compatiblity
Js.util.include({
	name: "SimpleTab", 
	object: Js.widget.SimpleTab
});
