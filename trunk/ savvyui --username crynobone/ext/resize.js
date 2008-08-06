/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Resize
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
 
SUI.Ext.include("Resize", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
});

SUI.Ext.Resize.prototype = {
	Initialize: function(js) {
		var that = this;
		var node = this.object = SUI.fn.pick(js.object, js.node);
		node.root = SUI.fn.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) { 
			that.__START__(e);
		};
		
		node.hmode = SUI.fn.pick(js.hmode, true);
		node.vmode = SUI.fn.pick(js.vmode, true);
		node.hswap = SUI.fn.pick(js.hswap, false);
		node.vswap = SUI.fn.pick(js.vswap, false);
		node.minX = SUI.fn.pick(js.minX, null);
		node.minY = SUI.fn.pick(js.minY, null);
		node.maxX = SUI.fn.pick(js.maxX, null);
		node.maxY = SUI.fn.pick(js.maxY, null);
		
		node.root.onResizeStart = new Function();
		node.root.onResizeEnd = new Function();
		node.root.onResize	= new Function();
	},
	clearResize: function() {
		this.object = null;
	},
	__START__: function(e) {
		var that = this;
		var node = this.object;
		var e = this.__FIXE__(e);
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "height"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "width"));
		
		node.root.onResizeStart(x, y);
		node.lastMouseX = e.clientX;
		node.lastMouseY = e.clientY;
		
		node.minMouseX = (node.minX != null ? (e.clientX - x + node.minX) : null);
		node.maxMouseX = (node.maxX != null ? (node.minMouseX + node.maxX - node.minX) : null);
		node.minMouseY = (node.minY != null ? (e.clientY - y + node.minY) : null);
		node.maxMouseY = (node.maxY != null ? (node.minMouseY + node.maxY - node.minY) : null);
		
		document.onmousemove = function(e) {
			that.__ON__(e);
		};
		document.onmouseup = function(e) {
			that.__END__(e);
		};
		
		return false;
	},
	__ON__: function(e) {
		var e = this.__FIXE__(e);
		var node = this.object;
		var ey = e.clientY;
		var ex = e.clientX;
		var y = SUI.fn.toNumber(SUI.CSS.Get(node.root, "height"));
		var x = SUI.fn.toNumber(SUI.CSS.Get(node.root, "width"));
		var ow = x;
		var oh = y;
		var nx;
		var ny;
		
		ex = (node.minX != null ? Math.max(ex, node.minMouseX) : ex);
		ex = (node.maxX != null ? Math.min(ex, node.maxMouseX) : ex);
		ey = (node.minY != null ? Math.max(ey, node.minMouseY) : ey);
		ey = (node.maxY != null ? Math.min(ey, node.maxMouseY) : ey);
		
		nx = x + ((ex - node.lastMouseX) * (node.hswap ? -1 : 1));
		ny = y + ((ey - node.lastMouseY) * (node.vswap ? -1 : 1));
		
		if (node.hmode) {
			SUI.CSS.Set(node.root, "width", (ow + (nx - x)) + "px");
		} else {
			nx = x = 0;
		}
		
		if(node.vmode) {
			SUI.CSS.Set(node.root, "height", (oh + (ny - y)) + "px");
		} else {
			ny = y = 0;
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onResize(Math.round(nx - x), Math.round(ny - y));
		
		return false;
	},
	__END__: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var r = node.root;
		r.onResizeEnd(SUI.fn.toNumber(r.style.width), SUI.fn.toNumber(r.style.height), r);
		node = null;
	},
	__FIXE__: function(e) {
		if (SUI.fn.isnull(e)) { 
			e = window.event;
		}
		if (SUI.fn.isnull(e.layerX)) {
			e.layerX = e.offsetX;
		}
		if (SUI.fn.isnull(e.layerY)) { 
			e.layerY = e.offsetY;
		}
		return e;
	},
	childResize: function(js){
		var parNode = js.object;
		var chiNode = js.child;
		
		SUI.fn.each(chiNode, function() {
			try { 
				SUI.CSS.Set(this, "width", (SUI.fn.toNumber(SUI.CSS.Get(this, "width")) + js.width)+"px");
			} catch(e) { /* on failed continue */ }
			
			SUI.CSS.Set(this, "height", (SUI.fn.toNumber(SUI.CSS.Get(this, "height")) + js.height)+"px");
		});
	}
};

SUI.namespace.include("Resize", SUI.Ext.Resize);

SUI.extend('makeResizable', (function(js, i) {
	var i = SUI.fn.pick(this.index, i);
	var js = (!js ? {} : js);
		
	this.__PUSH__(function() {
		if(!SUI.CSS.Get(this, "width")) {
			var t = SUI.Dimension.Node.Offset(this);
			SUI.CSS.Setup(this, {"width": t[0]+"px", "height": t[1]+"px", "cursor": "move"});
		}
		js.node = this;
		new SUI.Ext.Resize(js);
	}, i);
	return this;
}));
