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

Js.ext.include({
	name: "Resizable", 
	object: function(js) {
		this.object = null;
		
		if(!!js && typeof(js) === "object") {
			this.init(js);
		}
		
		return this;
	}, 
	proto: {
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
			var height = Js.code.toNumber(Js.style.get(node.root, "height"));
			var width = Js.code.toNumber(Js.style.get(node.root, "width"));
			
			node.root.onResizeStart(width, height);
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
			var eHeight = e.clientY;
			var eWidth = e.clientX;
			var height = Js.code.toNumber(Js.style.get(node.root, "height"));
			var width = Js.code.toNumber(Js.style.get(node.root, "width"));
			var nodeWidth = width;
			var nodeHeight = height;
			var newWidth;
			var newHeight;
			
			eWidth = (node.minX != null ? Math.max(eWidth, node.minMouseX) : eWidth);
			eWidth = (node.maxX != null ? Math.min(eWidth, node.maxMouseX) : eWidth);
			eHeight = (node.minY != null ? Math.max(eHeight, node.minMouseY) : eHeight);
			eHeight = (node.maxY != null ? Math.min(eHeight, node.maxMouseY) : eHeight);
			
			newWidth = width + ((eWidth - node.lastMouseX) * (node.hswap ? -1 : 1));
			newHeight = height + ((eHeight - node.lastMouseY) * (node.vswap ? -1 : 1));
			
			if(node.hmode) {
				Js.style.set(node.root, "width", (nodeWidth + (newWidth - width)) + "px");
			} else {
				newWidth = width = 0;
			}
			
			if(node.vmode) {
				Js.style.set(node.root, "height", (nodeHeight + (newHeight - height)) + "px");
			} else {
				newHeight = height = 0;
			}
			
			node.lastMouseX = eWidth;
			node.lastMouseY = eHeight;
			node.root.onResize(Math.round(newWidth - width), Math.round(newHeight - height));
			
			return false;
		},
		stopResize: function() {
			var node = this.object;
			document.onmousemove = null;
			document.onmouseup = null;
			var data = node.root;
			data.onResizeEnd(Js.code.toNumber(data.style.width), Js.code.toNumber(data.style.height), data);
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
		},
		childResize: function(js){
			var parend = js.object;
			var child = js.child;
			
			Js.code.each(child, function() {
				try { 
					Js.style.set(this, "width", (Js.code.toNumber(Js.style.get(this, "width")) + js.width)+"px");
				} catch(e) { 
					/* on failed continue */ 
				}
				
				Js.style.set(this, "height", (Js.code.toNumber(Js.style.get(this, "height")) + js.height)+"px");
			});
		}
	}
});

Js.namespace.include({
	name: "Resizable", 
	object: Js.ext.Resizable
});

Js.extend('resizable', function(js) {
	var key = Js.code.pick(this.index, null);
	var js = (!js ? {} : js);
		
	this.pushStack(function() {
		if(!Js.style.get(this, "width")) {
			var t = Js.ext.dimension.node.offset(this);
			Js.style.setup(this, {
				"width": t[0]+"px", 
				"height": t[1]+"px", 
				"cursor": "move"
			});
		}
		js.node = this;
		new Js.Resizable(js);
	});
	return this;
});
