/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Dimension
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */

SUI.namespace.include("Dimension", {
	// Get scrolled value of a page
	Page: {
		Scroll: {
			X: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
				
				if(typeof(offset) == "number") {
					ret = offset;
				} else if(doc && doc.scrollLeft) {
					ret = doc.scrollLeft;
				} else if(el && el.scrollLeft) {
					ret = el.scrollLeft;	
				}
				return ret;
			},
			Y: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if(typeof(offset) == "number") {
					ret = offset;
				} else if(doc && doc.scrollTop) {
					ret = doc.scrollLeft;
				} else if(el && el.scrollTop) {
					ret = el.scrollLeft;
				}
				return ret;
			},
			XY: function() {
				var ret = [0, 0];
				ret[0] = SUI.Dimension.Page.Scroll.X();
				ret[1] = SUI.Dimension.Page.Scroll.Y();
				
				return ret;
			}
		},
		Size: {
			Width: function() {
				
			},
			Height: function() {
				
			}
		},
		Center: function(width, height) {
			var doc = document.body;
			var offset = [SUI.fn.toNumber(doc.offsetWidth), SUI.fn.toNumber(doc.offsetHeight)];
			var axis = SUI.Dimension.Page.Scroll.XY();
			var ret = [];
				
			ret[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
			ret[1] = Math.round((((screen.height - 200) - height) / 2) + axis[1]);
			ret[0] = (ret[0] < 0 ? 0 : ret[0]);
			ret[1] = (ret[1] < 0 ? 0 : ret[1]);	
			ret.reverse();
			
			return ret;
		}
	},
	Node: {
		Scroll: {},
		Size: {},
		Offset: function(node) {
			var ret = [0, 0, 0, 0];
			var loop = false;
			
			if(SUI.fn.isset(node)) {
				if(node.offsetParent) {
					loop = true;
					ret[0] = node.offsetWidth;
					ret[1] = node.offsetHeight;
					
					while(node.offsetParent) {
						ret[2] += node.offsetTop;
						ret[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				} else {
					if(loop == false) {
						ret[0] = SUI.fn.pick(node.scrollWidth, 0);
						ret[1] = SUI.fn.pick(node.scrollHeight, 0);
						ret[2] = SUI.fn.pick(node.offsetTop, 0);
						ret[3] = SUI.fn.pick(node.offsetLeft, 0);
					}
				}
				return ret;
			} else {
				SUI.fn.logger("SUI.Dimension.Node.Offset error : " + node + " does not exist");
				return ret;
			}
		}
	}
});
