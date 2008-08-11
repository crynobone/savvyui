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

Js.ext.include("Resizable", function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
}).prototype = {
	init: function(js) {
		var that = this;
		var node = this.object = Js.code.pick(js.object, js.node);
		node.root = Js.code.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) { 
			that.start(e);
		};
		
		node.hmode = Js.code.pick(js.hmode, true);
		node.vmode = Js.code.pick(js.vmode, true);
		node.hswap = Js.code.pick(js.hswap, false);
		node.vswap = Js.code.pick(js.vswap, false);
		node.minX = Js.code.pick(js.minX, null);
		node.minY = Js.code.pick(js.minY, null);
		node.maxX = Js.code.pick(js.maxX, null);
		node.maxY = Js.code.pick(js.maxY, null);
		
		node.root.onResizeStart = new Function();
		node.root.onResizeEnd = new Function();
		node.root.onResize	= new Function();
	},
	clearResize: function() {
		this.object = null;
	},
	start: function(e) {
		var that = this;
		var node = this.object;
		var e = this.fixE(e);
		var y = Js.code.toNumber(Js.style.get(node.root, "height"));
		var x = Js.code.toNumber(Js.style.get(node.root, "width"));
		
		node.root.onResizeStart(x, y);
		node.lastMouseX = e.clientX;
		node.lastMouseY = e.clientY;
		
		node.minMouseX = (node.minX != null ? (e.clientX - x + node.minX) : null);
		node.maxMouseX = (node.maxX != null ? (node.minMouseX + node.maxX - node.minX) : null);
		node.minMouseY = (node.minY != null ? (e.clientY - y + node.minY) : null);
		node.maxMouseY = (node.maxY != null ? (node.minMouseY + node.maxY - node.minY) : null);
		
		document.onmousemove = function(e) {
			that.startResize(e);
		};
		document.onmouseup = function(e) {
			that.stopResize(e);
		};
		
		return false;
	},
	startResize: function(e) {
		var e = this.fixE(e);
		var node = this.object;
		var ey = e.clientY;
		var ex = e.clientX;
		var y = Js.code.toNumber(Js.style.get(node.root, "height"));
		var x = Js.code.toNumber(Js.style.get(node.root, "width"));
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
			Js.style.set(node.root, "width", (ow + (nx - x)) + "px");
		} else {
			nx = x = 0;
		}
		
		if(node.vmode) {
			Js.style.set(node.root, "height", (oh + (ny - y)) + "px");
		} else {
			ny = y = 0;
		}
		
		node.lastMouseX = ex;
		node.lastMouseY = ey;
		node.root.onResize(Math.round(nx - x), Math.round(ny - y));
		
		return false;
	},
	stopResize: function() {
		var node = this.object;
		document.onmousemove = null;
		document.onmouseup = null;
		var r = node.root;
		r.onResizeEnd(Js.code.toNumber(r.style.width), Js.code.toNumber(r.style.height), r);
		node = null;
	},
	fixE: function(e) {
		if (Js.code.isnull(e)) { 
			e = window.event;
		}
		if (Js.code.isnull(e.layerX)) {
			e.layerX = e.offsetX;
		}
		if (Js.code.isnull(e.layerY)) { 
			e.layerY = e.offsetY;
		}
		return e;
	},
	childResize: function(js){
		var parNode = js.object;
		var chiNode = js.child;
		
		Js.code.each(chiNode, function() {
			try { 
				Js.style.set(this, "width", (Js.code.toNumber(Js.style.get(this, "width")) + js.width)+"px");
			} catch(e) { /* on failed continue */ }
			
			Js.style.set(this, "height", (Js.code.toNumber(Js.style.get(this, "height")) + js.height)+"px");
		});
	}
};

SUI.namespace.include("Resize", SUI.Ext.Resizable);

Js.extend('resizable', (function(js, i) {
	var i = Js.code.pick(this.index, i);
	var js = (!js ? {} : js);
		
	this.__PUSH__(function() {
		if(!Js.style.get(this, "width")) {
			var t = Js.ext.dimension.node.offset(this);
			Js.style.setup(this, {"width": t[0]+"px", "height": t[1]+"px", "cursor": "move"});
		}
		js.node = this;
		new Js.ext.Resizable(js);
	}, i);
	return this;
}));
