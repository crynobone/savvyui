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
SUI.Ext.include("Drag", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
});

SUI.Ext.Drag.prototype = {
	Initialize: function(js) {
		var node = this.object = SUI.fn.pick(js.object, js.node);
		var that = this;
		node.root = SUI.fn.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) {
			that.__START__(e);
		};
		
		node.hmode = SUI.fn.pick(js.hmode, true);
		node.vmode = SUI.fn.pick(js.vmode, true);
		node.hswap = SUI.fn.pick(js.hswap, false);
		node.vswap = SUI.fn.pick(js.vswap, false);
		node.minX = SUI.fn.pick(js.minX, null);
		node.maxX = SUI.fn.pick(js.maxX, null);
		node.minY = SUI.fn.pick(js.minY, null);
		node.maxY = SUI.fn.pick(js.maxY, null);
		
		if (isNaN(SUI.fn.toNumber(SUI.CSS.Get(node.root, "left")))) {
			SUI.CSS.Set(node.root, "left", "0px");
		}
		if (isNaN(SUI.fn.toNumber(SUI.CSS.Get(node.root, "top")))) { 
			SUI.CSS.Set(node.root, "top", "0px");
		}
		node.root.onDragStart = new Function();
		node.root.onDragEnd = new Function();
		node.root.onDrag = new Function();
	},
	clearDrag: function() {
		this.object = null;
	},
	__START__: function(e) {
		var that = this;
		var node = this.object;
		var e = this.__FIXE__(e);
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "top"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "left"));
		
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
			that.__ON__(e);
		};
		document.onmouseup = function(e){ 
			that.__END__(e);
		};
		
		return false;
	},
	__ON__: function(e) {
		var e = this.__FIXE__(e);
		var node = this.object;
		var ey	= e.clientY;
		var ex	= e.clientX;
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "top"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "left"));
		var nx;
		var ny;
		
		ex = (node.minX != null ? Math.min(ex, node.mixMouseX) : ex);
		ex = (node.maxX != null ? Math.max(ex, node.maxMouseX) : ex);
		ey = (node.minY != null ? Math.min(ey, node.minMouseY) : ey);
		ey = (node.maxY != null ? Math.max(ey, node.maxMouseY) : ey);
		
		nx = x + ((ex - node.lastMouseX) * (node.hswap ? -1 : 1));
		ny = y + ((ey - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if (node.hmode) {
			SUI.CSS.Set(node.root, "left", nx + "px");
		} 
		if (node.vmode) {
			SUI.CSS.Set(node.root, "top", ny + "px");
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onDrag(nx, ny);
		
		return false;
	},
	__END__: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var r = node.root;
		r.onDragEnd(SUI.fn.toNumber(r.style.left), SUI.fn.toNumber(r.style.top), r);
		node = null;
	},
	__FIXE__: function(e) {
		if (SUI.fn.isnull(e)) 
			e = window.event;
		if (SUI.fn.isnull(e.layerX)) 
			e.layerX = e.offsetX;
		if (SUI.fn.isnull(e.layerY)) 
			e.layerY = e.offsetY;
		
		return e;
	}
};

// Shortern the Namespace
SUI.namespace.include("Drag", SUI.Ext.Drag);

SUI.extend('makeDraggable', (function(js, i) {
	var i = SUI.fn.pick(this.index, i);
	var js = (!js ? {} : js);
	
	this.__PUSH__(function() {
		if (!SUI.CSS.Get(this, "position")) {
			var t = SUI.Dimension.Node.Offset(this);
			SUI.CSS.Setup(this, {"position": "absolute", "top": t[2]+"px", "left": t[3]+"px"});
		}
		
		js.node = this;
		new SUI.Ext.Drag(js);
	}, i);
	return this;
}));
