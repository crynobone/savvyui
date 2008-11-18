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
 */

Js.ext.resizable = function(js) {
	this.object = null;
	
	if(!!js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
};

Js.ext.resizable.prototype = {
	init: function(js) {
		var that = this;
		var node = this.object = Jrun.pick(js.object, js.node);
		node.root = Jrun.pick(js.objectRoot, js.nodeRoot, node);
		
		node.onmousedown = function(e) { 
			that.start(e);
		};
		
		node.hmode = Jrun.pick(js.hmode, true);
		node.vmode = Jrun.pick(js.vmode, true);
		node.hswap = Jrun.pick(js.hswap, false);
		node.vswap = Jrun.pick(js.vswap, false);
		node.minX = Jrun.pick(js.minX, null);
		node.minY = Jrun.pick(js.minY, null);
		node.maxX = Jrun.pick(js.maxX, null);
		node.maxY = Jrun.pick(js.maxY, null);
		
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
		var height = Jrun.toNumber(jQuery(node.root).css("height"));
		var width = Jrun.toNumber(jQuery(node.root).css("width"));
		
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
		var height = Jrun.toNumber(jQuery(node.root).css("height"));
		var width = Jrun.toNumber(jQuery(node.root).css("width"));
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
			jQuery(node.root).css("width", (nodeWidth + (newWidth - width)) + "px");
		} else {
			newWidth = width = 0;
		}
		
		if(node.vmode) {
			jQuery(node.root).css("height", (nodeHeight + (newHeight - height)) + "px");
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
		data.onResizeEnd(Jrun.toNumber(data.style.width), Jrun.toNumber(data.style.height), data);
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
	},
	childResize: function(js){
		var parend = js.object;
		var child = js.child;
		
		Jrun.each(child, function() {
			try { 
				jQuery(this).css("width", (Jrun.toNumber(Js.style.get(this, "width")) + js.width)+"px");
			} catch(e) { 
				/* on failed continue */ 
			}
			
			jQuery(this).css("height", (Jrun.toNumber(Js.style.get(this, "height")) + js.height)+"px");
		});
	}
};