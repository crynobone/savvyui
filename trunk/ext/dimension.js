/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Ext.Dimension
 * Type: Ext
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */

Js.ext.include({
	name: "dimension", 
	object: {
		// Get scrolled value of a page
		page: {
			scrolls: {
				x: function() {
					var doc = document.body;
					var rdata = 0;
					var offset = window.pageXOffset;
					var el = document.documentElement;
						
					if(typeof(offset) == "number") {
						rdata = offset;
					} else if(doc && doc.scrollLeft) {
						rdata = doc.scrollLeft;
					} else if(el && el.scrollLeft) {
						rdata = el.scrollLeft;	
					}
					return rdata;
				},
				y: function() {
					var doc = document.body;
					var rdata = 0;
					var offset = window.pageYOffset;
					var el = document.documentElement;
					
					if(typeof(offset) == "number") {
						rdata = offset;
					} else if(doc && doc.scrollTop) {
						rdata = doc.scrollLeft;
					} else if(el && el.scrollTop) {
						rdata = el.scrollLeft;
					}
					return rdata;
				},
				xy: function() {
					return [Js.ext.dimension.page.scrolls.x(), Js.ext.dimension.page.scrolls.y()];
				}
			},
			middle: function(width, height) {
				var doc = document.body;
				var offset = [Jrun.toNumber(doc.offsetWidth), Jrun.toNumber(doc.offsetHeight)];
				var axis = Js.ext.dimension.page.scrolls.xy();
				var rdata = [];
						
				rdata[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
				rdata[1] = Math.round((((screen.height - 200) - height) / 2) + axis[1]);
				rdata[0] = (rdata[0] < 0 ? 0 : rdata[0]);
				rdata[1] = (rdata[1] < 0 ? 0 : rdata[1]);	
				rdata.reverse();
					
				return rdata;
			}
		},
		node: {
			scrolls: {},
			size: {},
			offset: function(node) {
				var rdata = [0, 0, 0, 0];
				var loop = false;
				
				if(Jrun.isset(node)) {
					if(node.offsetParent) {
						loop = true;
						rdata[0] = node.offsetWidth;
						rdata[1] = node.offsetHeight;
						
						while(node.offsetParent) {
							rdata[2] += node.offsetTop;
							rdata[3] += node.offsetLeft;
							node = node.offsetParent;
						}
					} else {
						if(loop == false) {
							rdata[0] = Jrun.pick(node.scrollWidth, 0);
							rdata[1] = Jrun.pick(node.scrollHeight, 0);
							rdata[2] = Jrun.pick(node.offsetTop, 0);
							rdata[3] = Jrun.pick(node.offsetLeft, 0);
						}
					}
					return rdata;
				} else {
					Js.debug.log("Js.ext.dimension.node.offset error : " + node + " does not exist");
					return ret;
				}
			}
		}
	}
});
