/*
 * Savvy.UI JavaScript Library Extension
 * Name: WinPanel
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
*/

Js.widget.dialog = function(js) {
	// Declare Object's properties
	this.panel = null;
	this.element = null;
	this.zindex = 100;
	this.allowDrag = false;
	this.autoFocus = true;
	this.status = "";
	this.content = null;
	this.object = null;
	this.initialize = false;
	this.onclose = null;
	
	// Declare constant
	Js.widget.dialog.nodes;
	Js.widget.dialog.zindex;
	
	// start __constructor()
	if (js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
};

Js.widget.dialog.prototype = {
	init: function(js) {
		var that = this;
		
		if (!this.initialize) {
			this.initialize = true;
			Js.widget.dialog.zindex = Jrun.pick(Js.widget.dialog.zindex, 101);
			
			var elem = this.element = js.element + "_win";
			
			
			this.zindex = Jrun.pick(js.zindex, ++Js.widget.dialog.zindex);
			this.autoFocus = Jrun.pick(js.autoFocus, this.autoFocus);
			this.allowDrag = Jrun.pick(js.allowDrag, this.allowDrag);
			this.onclose = Jrun.pick(js.onClose, this.onclose);
			js.onclose = null;
			
			if(this.allowDrag) { 
				js.scrolling = true;
			}
			
			this.panel = new Js.widget.panel(js);
			this.content = this.panel.content;
			this.object = this.panel.object;
			this.object.hide();
			
			Js.widget.dialog.nodes = Jrun.pick(Js.widget.dialog.nodes, []);
			Js.widget.dialog.nodes.push(this.object);
			
			if (!!this.autoFocus) {
				this.object.click(function() {
					var m = jQuery(this).eq(0);
					m.fadeTo("normal", 1);
					
					if (!m.css("zIndex") || m.css("zIndex") < Js.widget.dialog.zindex) {
						++Js.widget.dialog.zindex;
						m.css("zIndex", Js.widget.dialog.zindex);
					}
					
					for (var i = 0; i < Js.widget.dialog.nodes.length; i++) {
						if (Js.widget.dialog.nodes[i] != that.object) 
							Js.widget.dialog.nodes[i].fadeTo("normal", 0.4);
					}
				});
				
				for (var i = 0; i < Js.widget.dialog.nodes.length; i++) {
					if (Js.widget.dialog.nodes[i] != that.object) {
						Js.widget.dialog.nodes[i].fadeTo("normal", 0.4);
					}
				}
			} else {
				this.object.css("zIndex", this.zindex);
			}
			
			var doc = document.body;
			var hW = Jrun.toNumber(doc.offsetWidth);
			var hH = Jrun.toNumber(doc.offsetHeight);
			var oW = this.panel.width;
			var oH = this.panel.height;
			var sXY = Js.util.dimension.page.scrolls.both();
			var center = Js.util.dimension.page.middle(oW, oH);
			var xS = center[1];
			var yS = center[0];
			xS = (xS < 0 ? 0 : xS);
			yS = (yS < 0 ? 0 : yS);
			
			if (!!this.allowDrag) {
				try {
					new Js.ext.draggable({
						node: that.panel.header[0],
						nodeRoot: that.panel.object[0]
					});
					
					that.panel.header.css("cursor", "move");
				} catch(e) {
					Js.debug.log("Js.widget.dialog.init error at DRAG: " + e);
				}
			}
			
			this.object.show("normal");
			this.status = "Loaded";
			
			if(this.autoFocus == true) {
				this.makeActive();
			}
			
			this.object.css({
				"position": "absolute", 
				"top": yS + "px", 
				"left": xS + "px"
			});
		}
		return this;
	},
	makeActive: function() {
		++Js.widget.dialog.zindex;
		this.object.css("zIndex", Js.widget.dialog.zindex);
	},
	closePanel: function() {
		var that = this;
		
		this.object.fadeOut("normal", function() {
			var fn = that.onclose;
			if (Jrun.isfunction(fn)) {
				fn();
			}
			
			that.object.remove();
		});
		
		try {
			this.object = null;
			this.element = null;
			var arrays = Js.widget.dialog.nodes;
			var deindex = Jrun.indexOf(arrays, this.object);
			arrays.splice(deindex, 1);
			Js.widget.dialog.nodes = arrays;
		} catch(e) { }
		return this;
	}
};
