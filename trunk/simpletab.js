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
*/

Js.widget.simpleTab = function(sel, handler) {
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.object = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	this.handler = null;
	
	// start __constructor()
	if(Jrun.typeOf(sel) === "object" || Jrun.typeOf(sel) === "string") {
		this.init(sel, handler);
	}
	
	return this;
};

Js.widget.simpleTab.prototype = {
	init: function(sel, handler) {
		var that = this;
		this.object = jQuery(sel);
		this.object.addClass("simpletab-container");
		this.element = this.object.eq(0).attr("id");
		this.handler = Jrun.pick(handler, "click");
		
		this.handler = (this.handler.match(/^(click|mouseover)$/g) ? this.handler : 'click');
		
		var child = jQuery("div.simpletab-panel, div.simpletab", this.object);
		
		this.activeTab = child.eq(0);
		
		this.addToolbar(this.element);
		
		child.each(function() {
			that.addHeader(this);
			jQuery(this).removeClass().addClass("simpletab-hidden");	
		});
			
		this.activeHeader = jQuery("a[href=#" + this.activeTab.attr("id") + "]");
		this.activeHeader.addClass("current");
		this.activeTab.removeClass().addClass("simpletab-active")
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
			
			var obj = jQuery('<div/>').attr({id: id, className: "simpletab-hidden"}).html(content).appendTo(this.object);
			var li = jQuery('<li/>').appendTo(this.header);
			var a = jQuery('<a/>').attr({href: "#" + id, title: title}).appendTo(li);
			
			jQuery("<em/>").appendTo(a);
			a.text(title).bind(this.handler, function() {
				that.activate(this);
				return false;
			});
			
			if (!!closable) {
				jQuery("<span/>").css("paddingLeft", "10px").text("x").click(function() {
					var href = jQuery(this.parentNode).attr("href");
					that.activeHeader.removeClass();
					that.activeTab.removeClass().addClass("simpletab-hidden").fadeOut();
					jQuery(href).remove();
					jQuery(this.parentNode.parentNode).remove();
				}).appendTo(a);
			}
			
			if(!!set) {
				this.activate(obj);
			}
		}
		return this;
	},
	addToolbar: function(el) {
		var div = jQuery("<div/>").attr({className: "simpletab-toolbar-container", id: this.element + "toolbar"}).prependTo(this.object);
		this.toolbar = div;
		
		this.header = jQuery("<ul/>").attr({id: [el, "toolbar"].join("-"), className: "simpletab-toolbar"}).appendTo(this.toolbar);
		var div2 = jQuery("<div/>").css("display", "block").appendTo(div);
	},
	activate: function(obj) {
		var that = this;
		this.activeHeader.removeClass("current");
		this.activeTab.removeClass().addClass("simpletab-hidden");
		
		this.activeHeader = jQuery(obj);
		var href = this.activeHeader.attr("href");
		this.activeTab = jQuery(href);
		
		this.activeHeader.addClass("current");
		this.activeTab.removeClass().addClass("simpletab-active");
		
		return false;
	},
	revert: function() {
		var activecon = jQuery("li > a", this.header);
		if(activecon.length > 0) {
			this.activate(activecon.eq(0));
		}
	},
	addHeader: function(obj) {
		var that = this;
		var obj = jQuery(obj);
		var title = obj.attr("title");
		var closable = obj.hasClass("tab-closable");
		
		var li = jQuery("<li/>").appendTo(this.header);
		var a = jQuery("<a/>").attr({href: "#" + obj.attr("id"), title: title}).appendTo(li);
		jQuery("<em/>").appendTo(a);
		
		a.text(title).bind(this.handler, function() {
			that.activate(this);
			return false;
		});
		
		if(!!closable) {
			jQuery("<span/>").css("paddingLeft", "10px").text("x").click(function() {
				var my = jQuery(this.parentNode).click(function() {
					return false;
				});
				
				var href = my.attr("href");
				that.activeHeader.removeClass();
				that.activeTab.removeClass().addClass("simpletab-hidden");
				jQuery(href).remove();
				jQuery(this.parentNode.parentNode).remove();
				
				that.revert();
			}).appendTo(a);
		}
	}
};