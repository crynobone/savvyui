/*
 * Savvy.UI JavaScript Library Extension
 * Name: Panel
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
*/

Js.widget.panel = function(js) {
	// Declare Object properties
	this.object = null;
	
	this.header = null;
	this.container = null;
	this.content = null;
	this.footer = null;
	this.renderTo = null;
	this.element = "";
	this.title = "Untitled Panel";
	this.width = 300;
	this.height = 300;
	this.minWidth = 100;
	this.minHeight = 200;
	this.layout = "sui-panel";
	this.onclose = null;
	this.scrolling = true;
	this.allowClose = true;
	this.allowMinimize = false;
	this.allowResize = false;
	this.css = "";
	this.status = "normal";
	
	// Start __constructor()
	if (js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
};

Js.widget.panel.prototype = {
	init: function(js) {
		var that = this;
		// Set Object properties value for usage
		this.width = Jrun.pick(js.width, this.width);
		this.height = Jrun.pick(js.height, this.height);
		this.layout = Jrun.pick(js.layout, this.layout);
		this.title = Jrun.pick(js.title, this.title);
		this.renderTo = Jrun.pick(js.renderTo, this.renderTo);
		this.allowClose = Jrun.pick(js.allowClose, this.allowClose);
		this.allowMinimize = Jrun.pick(js.allowMinimize, this.allowMinimize);
		this.allowResize = Jrun.pick(js.allowResize, this.allowResize);
		this.scrolling = Jrun.pick(js.scrolling, this.scrolling);
		this.css = Jrun.pick(js.css, this.css);
		this.onclose = Jrun.pick(js.onClose, null);
		
		// set renderTo DOM.Element
		if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = jQuery(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = jQuery("body").eq(0);
		}
		// define panel id attribute
		var el = this.element = js.element;
		
		// render panel and hide it
		this.object = jQuery("<div/>").attr({
			id: el + "_win",
			className: this.layout
		}).appendTo(this.renderTo);
		
		// set panel width
		if (Jrun.isset(this.width)) {
			this.object.css("width", this.width + "px");
		}
		
		// set panel height
		if (Jrun.isset(this.height)) {
			this.object.css("height", this.height + "px");
		}
		
		// render header
		var header = this.header = jQuery("<div/>").appendTo(this.object);
		// render content
		var container = this.container = jQuery("<div/>").addClass(this.layout + "-container").html("").appendTo(this.object);
		// render footer
		var footer = this.footer = jQuery("<div/>").css({width: "100%", height: "15px"}).appendTo(this.object);
		
		// render header container for close and minimize button
		var ext = jQuery("<div/>").attr({className: this.layout + "-ext"}).css({
			"cssFloat": "right", 
			"overflow": "hidden", 
			"width": "28px", 
			"height": "20px", 
			"textAlign": "right"
		}).appendTo(header);
		
		// render header title
		var title = jQuery("<div/>").addClass(this.layout + "-title").text(this.title).css({
			"overflow": "hidden", 
			"height": "20px"
		}).appendTo(header);
		
		// render Close-Button 
		var tclose = jQuery("<span/>").html("x").attr("width", "14px").css("display", "none").appendTo(ext);
		
		// render Minimize-Button
		var tmin = jQuery("<span/>").html("_").attr("width", "14px").css("display", "none").appendTo(ext);
		
		
		// Enable Minimize-Button option
		if (!!this.allowMinimize) {
			tmin.addClass(this.layout + "-min").css({
				"display": "block", 
				"cursor": "pointer"
			}).click(function() {
				that.container.slideToggle();
				
				if(that.status == "normal") {
					that.object.data("offsetHeight", that.object.css("height"));
					that.object.animate({height: "20px"});
					that.status = "minimize";
				} else {
					that.object.animate({height: that.object.data("offsetHeight")});
					that.status = "normal";
				}
			});
		} else {
			tmin.addClass(this.layout + "-disabled");
		}
		
		// Enable Close-Button option
		if (!!this.allowClose) {
			tclose.addClass(this.layout + "-close").css({
				"display": "block",
				"cursor": "pointer"
			}).click(function() {
				that.closePanel();
			});
		} else { 
			tclose.addClass(this.layout + "-disabled");
		}
		
		
		// render content CONTAINER DOM.Element
		// THIS IS WHERE YOUR CONTAIN SHOULD GO
		this.content = jQuery("<div/>").attr({
			id: el, 
			className: this.layout + "-content"
		}).css("cssText", this.css).appendTo(this.container);
		
		// set height and scrolling option for content CONTAINER
		if(Jrun.isset(this.height) && !!this.scrolling) {
			this.content.css({
				"height": (this.height - (23 + 21)) + "px",
				"overflow": "auto"
			});
		}
		
		// Enable Resizing option
		if (!!this.allowResize) {
			// enable bottom resizing
			new Js.ext.resizable({
				object: footer[0],
				objectRoot: that.object[0] /*,vmode: false*/
			});
			footer.css("cursor", "se-resize");
			
			// onResize function help maintain child width and height size
			that.object[0].onResize = function(x, y) {
				that.width = that.width + x;
				that.height = that.height + y;
				jQuery(that).css("width", that.width + "px");
				jQuery(that).css("height", that.height + "px");
				that.header.css("width", "100%");
				that.content.css("width", (that.width - 15) + "px");
				that.footer.css("width", "100%");
				that.fixResize();
			};
		}
		// make the panel visible
		this.object.show("slow");
		
		return this;
	},
	closePanel: function() {
		var that = this;
		
		// callback to close panel
		this.object.fadeOut("slow", function() {
			var fn = that.onclose;
			if (Jrun.isfunction(fn)) {
				fn();
			}
			
			that.object.remove();
		});
		return this;
	},
	fixResize: function() {
		if(Jrun.isset(this.height) && !!this.scrolling) {
			this.content.css({
				"height": (this.height - (23 + 21)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
};
