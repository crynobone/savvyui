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
 ***************************************************
 * Require: Base, Core, Js.widget.Panel, Js.ext.Draggable, SUI.Ext.Resize
*/

Js.widget.include({
	name: "WinPanel", 
	object: function(js) {
		// Declare Object's properties
		this.panel = null;
		this.element = null;
		this.zindex = 100;
		this.allowDrag = false;
		this.autoFocus = true;
		this.status = "";
		this.node = null;
		this.object = null;
		this.initialize = false;
		this.onclose = null;
		
		// Declare constant
		Js.widget.WinPanel.nodes;
		Js.widget.WinPanel.zindex;
		
		// start __constructor()
		if (js && typeof(js) === "object") {
			this.init(js);
		}
		
		return this;
	},
	proto: {
		init: function(js) {
			var that = this;
			
			if (!this.initialize) {
				this.initialize = true;
				Js.widget.WinPanel.zindex = Js.code.pick(Js.widget.WinPanel.zindex, 101);
				
				var elem = this.element = js.element + "_win";
				Js.widget.WinPanel.nodes = Js.code.pick(Js.widget.WinPanel.nodes, []);
				Js.widget.WinPanel.nodes.push(elem);
				
				this.zindex = Js.code.pick(js.zindex, ++Js.widget.WinPanel.zindex);
				this.autoFocus = Js.code.pick(js.autoFocus, this.autoFocus);
				this.allowDrag = Js.code.pick(js.allowDrag, this.allowDrag);
				this.onclose = Js.code.pick(js.onClose, this.onclose);
				js.onclose = null;
				
				if(this.allowDrag) { 
					js.scrolling = true;
				}
				
				this.panel = new Js.widget.Panel(js);
				this.node = this.panel.node;
				this.object = this.panel.object;
				this.object.hide();
				
				if (!!this.autoFocus) {
					this.object.onclick(function() {
						var m = Js(this).first();
						m.css("alpha", 100);
						
						if (!m.getStyle("zIndex") || m.getStyle("zIndex") < Js.widget.WinPanel.zindex) {
							++Js.widget.WinPanel.zindex;
							m.css("zIndex", Js.widget.WinPanel.zindex);
						}
						
						for (var i = 0; i < Js.widget.WinPanel.nodes.length; i++) {
							if (Js.widget.WinPanel.nodes[i] != that.element) 
								Js("#" + Js.widget.WinPanel.nodes[i]).css("alpha", 60);
						}
					});
					
					for (var i = 0; i < Js.widget.WinPanel.nodes.length; i++) {
						if (Js.widget.WinPanel.nodes[i] != that.element) {
							Js("#" + Js.widget.WinPanel.nodes[i]).css("alpha", 60);
						}
					}
				} else {
					this.object.css("zIndex", this.zindex);
				}
				
				var doc = document.body;
				var hW = Js.code.toNumber(doc.offsetWidth);
				var hH = Js.code.toNumber(doc.offsetHeight);
				var oW = this.panel.width;
				var oH = this.panel.height;
				var sXY = Js.ext.dimension.page.scrolls.xy();
				var center = Js.ext.dimension.page.middle(oW, oH);
				var xS = center[1];
				var yS = center[0];
				xS = (xS < 0 ? 0 : xS);
				yS = (yS < 0 ? 0 : yS);
				
				if (!!this.allowDrag) {
					try {
						new Js.ext.Draggable({
							node: that.panel.header.fetch(),
							nodeRoot: that.panel.object.fetch()
						});
						
						that.panel.header.css("cursor", "move");
					} catch(e) {
						Js.debug.log("Js.widget.WinPanel.Initialize error at DRAG: " + e);
					}
				}
				
				this.object.show();
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
			++Js.widget.WinPanel.zindex;
			this.object.css("zIndex", Js.widget.WinPanel.zindex);
		},
		closePanel: function() {
			var fn = this.onclose;
			if (Js.code.isfunction(fn)) {
				fn();
			}
			
			this.object.parent().remove(this.object.fetch());
			
			try {
				this.object = null;
				this.element = null;
				var arrays = Js.widget.WinPanel.nodes;
				var deindex = Js.code.indexOf(arrays, this.element);
				arrays.splice(deindex, 1);
				Js.widget.WinPanel.nodes = arrays;
			} catch(e) { }
			return this;
		}
	}
});
