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
Js.ext.include("Draggable", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		var node = this.object = Js.code.pick(js.object, js.node);
		var that = this;
		node.root = Js.code.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) {
			that.start(e);
		};
		
		node.hmode = Js.code.pick(js.hmode, true);
		node.vmode = Js.code.pick(js.vmode, true);
		node.hswap = Js.code.pick(js.hswap, false);
		node.vswap = Js.code.pick(js.vswap, false);
		node.minX = Js.code.pick(js.minX, null);
		node.maxX = Js.code.pick(js.maxX, null);
		node.minY = Js.code.pick(js.minY, null);
		node.maxY = Js.code.pick(js.maxY, null);
		
		if (isNaN(Js.code.toNumber(Js.style.get(node.root, "left")))) {
			Js.style.set(node.root, "left", "0px");
		}
		if (isNaN(Js.code.toNumber(Js.style.get(node.root, "top")))) { 
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
		var y = Js.code.toNumber(Js.style.get(node.root, "top"));
		var x = Js.code.toNumber(Js.style.get(node.root, "left"));
		
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
		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = Js.code.toNumber(Js.style.get(node.root, "top"));
		var x = Js.code.toNumber(Js.style.get(node.root, "left"));
		var nx;
		var ny;
		
		ex = (node.minX != null ? Math.min(ex, node.mixMouseX) : ex);
		ex = (node.maxX != null ? Math.max(ex, node.maxMouseX) : ex);
		ey = (node.minY != null ? Math.min(ey, node.minMouseY) : ey);
		ey = (node.maxY != null ? Math.max(ey, node.maxMouseY) : ey);
		
		nx = x + ((ex - node.lastMouseX) * (node.hswap ? -1 : 1));
		ny = y + ((ey - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if (node.hmode) {
			Js.style.set(node.root, "left", nx + "px");
		} 
		if (node.vmode) {
			Js.style.set(node.root, "top", ny + "px");
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onDrag(nx, ny);
		
		return false;
	},
	stopDrag: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var data = node.root;
		data.onDragEnd(Js.code.toNumber(data.style.left), Js.code.toNumber(data.style.top), data);
		node = null;
	},
	fixE: function(e) {
		if(Js.code.isnull(e)) {
			e = window.event;
		}
		if(Js.code.isnull(e.layerX)) {
			e.layerX = e.offsetX;
		}
		if(Js.code.isnull(e.layerY)) {
			e.layerY = e.offsetY;
		}
		
		return e;
	}
};

// Shortern the Namespace
Js.namespace.include("Draggable", Js.ext.Draggable);

Js.extend('draggable', function(js) {
	var js = (!js ? {} : js);
	
	this.__PUSH__(function() {
		if (!Js.style.get(this, "position")) {
			var t = Js.ext.dimension.node.offset(this);
			Js.style.setup(this, {"position": "absolute", "top": t[2]+"px", "left": t[3]+"px"});
		}
		
		js.node = this;
		new Js.ext.Draggable(js);
	});
	return this;
});
