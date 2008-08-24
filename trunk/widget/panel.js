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
 ***************************************************
 * Require: Base, Core, Js.ext.Resizable
*/

Js.widget.include({
	name: "Panel", 
	object: function(js) {
		// Declare Object's properties
		this.object = null;
		this.node = null;
		this.header = null;
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
		
		// Start __constructor()
		if (js && typeof(js) === "object") {
			this.init(js);
		}
		
		return this;
	},
	proto: {
		init: function(js) {
			var that = this;
			// Set Object's properties value for usage
			this.width = Js.code.pick(js.width, this.width);
			this.height = Js.code.pick(js.height, this.height);
			this.layout = Js.code.pick(js.layout, this.layout);
			this.title = Js.code.pick(js.title, this.title);
			this.renderTo = Js.code.pick(js.renderTo, this.renderTo);
			this.allowClose = Js.code.pick(js.allowClose, this.allowClose);
			this.allowMinimize = Js.code.pick(js.allowMinimize, this.allowMinimize);
			this.allowResize = Js.code.pick(js.allowResize, this.allowResize);
			this.scrolling = Js.code.pick(js.scrolling, this.scrolling);
			this.css = Js.code.pick(js.css, this.css);
			this.onclose = Js.code.pick(js.onClose, null);
			
			// set renderTo DOM.Element
			if (!this.renderTo || !this.renderTo.nodeType) {
				this.renderTo = Js("body").first();
			} else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
				this.renderTo = Js(this.renderTo).first();
			}
			// define TABLE id attribute
			var el = this.element = js.element;
			
			// render TABLE DOM.Element, hide the TABLE
			this.object = this.renderTo.add("table", {
				"id": el + "_win", 
				"cellSpacing": "0", 
				"cellPadding": "0",	
				"class": this.layout
			}).hide();
			
			this.renderTo.done();
			
			// set TABLE width
			if (Js.code.isset(this.width)) {
				this.object.css("width", this.width + "px");
			}
			
			// set TABLE height
			if (Js.code.isset(this.height)) {
				this.object.css("height", this.height + "px");
			}
			
			// render TBODY DOM.Element 
			var tbody = this.object.add("tbody");
			
			// render header TR DOM.Element
			var tr1 = tbody.add("tr");
			// render content TR DOM.Element
			var tr2 = tbody.add("tr");
			// render footer TR DOM.Element
			var tr3 = tbody.add("tr");
			
			tbody.done();
			
			// render header TD-left DOM.Element
			var th1 = tr1.add("td", {"class": this.layout + "-hl"}).html("&nbsp;").set("width", "7px");
			// render header TD-content DOM.Element
			var th2 = tr1.add("td", {"class": this.layout + "-header"}).css({
				"height": "22px", 
				"width": (this.width - 15) + "px"
			});
			// render header TD-right DOM.Element
			var th3 = tr1.add("td", {"class": this.layout + "-hr"}).html("&nbsp;").set("width", "8px");
			// render header container DOM.Element
			var ext = th2.add("div", {"class": this.layout + "-ext"}).css({
				"cssFloat": "right", 
				"overflow": "hidden", 
				"width": "28px", 
				"height": "20px", 
				"textAlign": "right"
			});
			// render header title DOM.Element
			var title = th2.add("div", {"class": this.layout + "-title"}).text(this.title).css({
				"overflow": "hidden", 
				"height": "20px"
			});
			// render Close-Button DOM.Element 
			var tclose = ext.add("span").html("&nbsp;").set("width", "14px").css("display", "none");
			// render Minimize-Button DOM.Element
			var tmin = ext.add("span").html("&nbsp;").set("width", "14px").css("display", "none");
			
			// Enable Minimize-Button option
			if (!!this.allowMinimize) {
				tmin.setClass(this.layout + "-min").css({
					"display": "block", 
					"cursor": "pointer"
				});
			} else {
				tmin.setClass(this.layout + "-disabled");
			}
			
			// Enable Close-Button option
			if (!!this.allowClose) {
				tclose.setClass(this.layout + "-close").css({
					"display": "block",
					"cursor": "pointer"
				}).onclick(function() {
					that.closePanel();
				});
			} else { 
				tclose.setClass(this.layout + "-disabled");
			}
			
			tmin.done();
			tclose.done();
			title.done();
			ext.done();
			
			// render content TD-left DOM.Element
			var tc1 = tr2.add("td", {"class": this.layout + "-cl"}).html("&nbsp;");
			// render content TD-content DOM.Element
			var tc2 = tr2.add("td", {"class": this.layout + "-container"}).css({
				"padding": "5px", 
				"width": (this.width - 15) + "px"
			}).html("");
			// render content TD-right DOM.Element
			var tc3 = tr2.add("td", {"class": this.layout + "-cr"}).html("&nbsp;");
			
			// render content CONTAINER DOM.Element
			// THIS IS WHERE YOUR CONTAIN SHOULD GO
			this.node = tc2.add("div", {
				"id": el, 
				"class": this.layout + "-content"
			}).css("cssText", this.css);
			
			// set height and scrolling option for content CONTAINER
			if(Js.code.isset(this.height) && !!this.scrolling) {
				this.node.css({
					"height": (this.height - (23 + 11)) + "px",
					"overflow": "auto"
				});
			}
			
			// render footer TD-left DOM.Element
			var tf1 = tr3.add("td", {"class": this.layout + "-fl"}).html("&nbsp;");
			// render footer TD-content DOM.Element
			var tf2 = tr3.add("td", {"class": this.layout + "-footer"}).html("&nbsp;").css("width", (this.width - 15) + "px");
			// render footer TD-right DOM.Element
			var tf3 = tr3.add("td", {"class": this.layout + "-fr"}).html("&nbsp;");
			
			// extends DOM.Elements as Object's properties
			this.header = th2;
			this.content = tc2;
			this.footer = tf2;
			
			tr1.done();
			tr2.done();
			tr3.done();
			
			// Enable Resizing option
			if (!!this.allowResize) {
				// enable right (vertical only) resizing
				new Js.ext.Resizable({
					object: tf2.fetch(),
					objectRoot: that.object.fetch(),
					hmode: false
				});
				// enable bottom (horizontal only) resizing
				new Js.ext.Resizable({
					object: tc3.fetch(),
					objectRoot: that.object.fetch(),
					vmode: false
				});
				// enable bottom-right resizing
				new Js.ext.Resizable({
					object: tf3.fetch(),
					objectRoot: that.object.fetch()
				});
				// change button to look more like resize
				tc3.css("cursor", "e-resize");
				tf2.css("cursor", "n-resize");
				tf3.css("cursor", "se-resize");
				
				// onResize function help maintain TABLE child width and height size
				that.object.fetch().onResize = function(x, y) {
					that.width = that.width + x;
					that.height = that.height + y;
					Js(that).css("width", that.width + "px");
					Js(that).css("height", that.height + "px");
					that.header.css("width", (that.width - 15) + "px");
					that.content.css("width", (that.width - 15) + "px");
					that.footer.css("width", (that.width - 15) + "px");
					that.fixResize();
				};
			}
			// make the TABLE visible
			this.object.show().css("display", "block");
			
			return this;
		},
		closePanel: function() {
			// callback to close panel
			var fn = this.onclose;
			if (Js.code.isfunction(fn)) {
				fn();
			}
			
			this.object.parent().remove(this.object.fetch());
			this.object.done();
			return this;
		},
		fixResize: function() {
			if(Js.code.isset(this.height) && !!this.scrolling) {
				this.node.css({
					"height": (this.height - (23 + 11)) + "px", 
					"overflow": "auto"
				});
			}
			
			return this;
		}
	}
});
