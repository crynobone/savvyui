/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Drag
 * Type: Extension
 * Version: 0.5 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, SUI.CSS
 * Optional: Core
 */
 
// Import as Extension
Js.ext.include({
	name: "Draggable", 
	object: function(js) {
		this.object = null;
		
		if(!!js && typeof(js) === "object") {
			this.init(js);
		}
		
		return this;
	},
	proto: {
		init: function(js) {
			var node = this.object = Jrun.pick(js.object, js.node);
			var that = this;
			node.root = Jrun.pick(js.objectRoot, js.nodeRoot, node);
			
			node.onmousedown = function(e) {
				that.start(e);
			};
			
			node.hmode = Jrun.pick(js.hmode, true);
			node.vmode = Jrun.pick(js.vmode, true);
			node.hswap = Jrun.pick(js.hswap, false);
			node.vswap = Jrun.pick(js.vswap, false);
			node.minX = Jrun.pick(js.minX, null);
			node.maxX = Jrun.pick(js.maxX, null);
			node.minY = Jrun.pick(js.minY, null);
			node.maxY = Jrun.pick(js.maxY, null);
			
			if (isNaN(Jrun.toNumber(Js.style.get(node.root, "left")))) {
				Js.style.set(node.root, "left", "0px");
			}
			if (isNaN(Jrun.toNumber(Js.style.get(node.root, "top")))) { 
				Js.style.set(node.root, "top", "0px");
			}
			node.root.onDragStart = new Function();
			node.root.onDragEnd = new Function();
			node.root.onDrag = new Function();
		},
		clearDrag: function() {
			this.object = null;
		},
		start: function(e) {
			var that = this;
			var node = this.object;
			var e = this.fixE(e);
			var y = Jrun.toNumber(Js.style.get(node.root, "top"));
			var x = Jrun.toNumber(Js.style.get(node.root, "left"));
			
			node.root.onDragStart(x, y);
			node.lastMouseX = e.clientX;
			node.lastMouseY = e.clientY;
			
			if (node.minX != null) {
				node.minMouseX = e.clientX - x + node.minX;
			}
			if (node.maxX != null) {
				node.maxMouseX = node.minMouseX + node.maxX - node.minX;
			}
			if (node.minY != null) { 
				node.minMouseY = e.clientY - y + node.minY;
			}
			if (node.maxY != null) {
				node.maxMouseY = node.minMouseY + node.maxY - node.minY;
			}
			
			document.onmousemove = function(e) { 
				that.startDrag(e);
			};
			document.onmouseup = function(e){ 
				that.stopDrag(e);
			};
			
			return false;
		},
		startDrag: function(e) {
			var e = this.fixE(e);
			var node = this.object;
			var eY	= e.clientY;
			var eX	= e.clientX;
			var y = Jrun.toNumber(Js.style.get(node.root, "top"));
			var x = Jrun.toNumber(Js.style.get(node.root, "left"));
			var newX;
			var newY;
			
			eX = (node.minX != null ? Math.min(eX, node.mixMouseX) : eX);
			eX = (node.maxX != null ? Math.max(eX, node.maxMouseX) : eX);
			eY = (node.minY != null ? Math.min(eY, node.minMouseY) : eY);
			eY = (node.maxY != null ? Math.max(eY, node.maxMouseY) : eY);
			
			newX = x + ((eX - node.lastMouseX) * (node.hswap ? -1 : 1));
			newY = y + ((eY - node.lastMouseY) * (node.vswap ? -1 : 1));
			
			if (node.hmode) {
				Js.style.set(node.root, "left", newX + "px");
			} 
			if (node.vmode) {
				Js.style.set(node.root, "top", newY + "px");
			}
			
			node.lastMouseX = eX;
			node.lastMouseY = eY;
			node.root.onDrag(newX, newY);
			
			return false;
		},
		stopDrag: function() {
			var node = this.object;
			document.onmousemove = null;
			document.onmouseup = null;
			var data = node.root;
			data.onDragEnd(Jrun.toNumber(data.style.left), Jrun.toNumber(data.style.top), data);
			node = null;
		},
		fixE: function(e) {
			if(Jrun.isnull(e)) {
				e = window.event;
			}
			if(Jrun.isnull(e.layerX)) {
				e.layerX = e.offsetX;
			}
			if(Jrun.isnull(e.layerY)) {
				e.layerY = e.offsetY;
			}
			
			return e;
		}
	}
});

// Shortern the Namespace
Js.namespace.include({
	name: "Draggable", 
	object: Js.ext.Draggable
});

Js.extend("draggable", function(js) {
	var js = (!js ? {} : js);
	
	this.pushStack(function() {
		if (!Js.style.get(this, "position")) {
			var t = Js.ext.dimension.node.offset(this);
			Js.style.setup(this, {
				"position": "absolute", 
				"top": t[2]+"px", 
				"left": t[3]+"px"
			});
		}
		
		js.node = this;
		new Js.Draggable(js);
	});
	return this;
});
