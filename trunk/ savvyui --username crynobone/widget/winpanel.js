/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Widget.WinPanel
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Widget.Panel, SUI.Ext.Drag, SUI.Ext.Resize
*/

SUI.Widget.include("WinPanel", function(js) {
	// Declare Object's properties
	this.panel = null;
	this.element = null;
	this.zindex = 100;
	this.allowDrag = false;
	this.autoFocus = true;
	this.status = "";
	this.node = null;
	this.object = null;
	this.init = false;
	this.onclose = null;
	
	// Declare constant
	SUI.Widget.WinPanel.nodes;
	SUI.Widget.WinPanel.zindex;
	
	// start __constructor()
	if (js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		
		if (!this.init) {
			this.init = true;
			SUI.Widget.WinPanel.zindex = SUI.fn.pick(SUI.Widget.WinPanel.zindex, 101);
			
			var elem = this.element = js.element + "_win";
			SUI.Widget.WinPanel.nodes = SUI.fn.pick(SUI.Widget.WinPanel.nodes, []);
			SUI.Widget.WinPanel.nodes.push(elem);
			
			this.zindex = SUI.fn.pick(js.zindex, ++SUI.Widget.WinPanel.zindex);
			this.autoFocus = SUI.fn.pick(js.autoFocus, this.autoFocus);
			this.allowDrag = SUI.fn.pick(js.allowDrag, this.allowDrag);
			this.onclose = SUI.fn.pick(js.onClose, this.onclose);
			js.onclose = null;
			
			if(this.allowDrag) { 
				js.scrolling = true;
			}
			
			this.panel = new SUI.Widget.Panel(js);
			this.node = this.panel.node;
			this.object = this.panel.object;
			this.object.hide();
			
			if (!!this.autoFocus) {
				this.object.clicks(function() {
					var m = SUI(this).first();
					m.css("alpha", 100);
					
					if (!m.getStyle("zIndex") || m.getStyle("zIndex") < SUI.Widget.WinPanel.zindex) {
						++SUI.Widget.WinPanel.zindex;
						m.css("zIndex", SUI.Widget.WinPanel.zindex);
					}
					
					for (var i = 0; i < SUI.Widget.WinPanel.nodes.length; i++) {
						if (SUI.Widget.WinPanel.nodes[i] != that.element) 
							SUI("#" + SUI.Widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				});
				
				for (var i = 0; i < SUI.Widget.WinPanel.nodes.length; i++) {
					if (SUI.Widget.WinPanel.nodes[i] != that.element) {
						SUI("#" + SUI.Widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				}
			} else {
				this.object.css("zIndex", this.zindex);
			}
			
			var doc = document.body;
			var hW = SUI.fn.toNumber(doc.offsetWidth);
			var hH = SUI.fn.toNumber(doc.offsetHeight);
			var oW = this.panel.width;
			var oH = this.panel.height;
			var sXY = SUI.Dimension.Page.Scroll.XY();
			var center = SUI.Dimension.Page.Center(oW, oH);
			var xS = center[1];
			var yS = center[0];
			xS = (xS < 0 ? 0 : xS);
			yS = (yS < 0 ? 0 : yS);
			
			if (!!this.allowDrag) {
				try {
					new SUI.Ext.Drag({
						node: that.panel.header.fetch(),
						nodeRoot: that.panel.object.fetch()
					});
					
					that.panel.header.css("cursor", "move");
				} catch(e) {
					SUI.fn.logger("SUI.Widget.WinPanel.Initialize error at DRAG: " + e);
				}
			}
			
			this.object.show();
			this.status = "Loaded";
			
			if(this.autoFocus == true) {
				this.makeActive();
			}
			
			this.object.css({"position": "absolute", "top": yS + "px", "left": xS + "px"});
		}
		return this;
	},
	makeActive: function() {
		++SUI.Widget.WinPanel.zindex;
		this.object.css("zIndex", SUI.Widget.WinPanel.zindex);
	},
	Close: function() {
		var fn = this.onclose;
		if (SUI.fn.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		
		try {
			this.object = null;
			this.element = null;
			var arrays = SUI.Widget.WinPanel.nodes;
			var deindex = SUI.fn.indexOf(arrays, this.element);
			arrays.splice(deindex, 1);
			SUI.Widget.WinPanel.nodes = arrays;
		} catch(e) { }
		return this;
	}
};

SUI.Ext.include("WinPanel", SUI.Widget.WinPanel);
