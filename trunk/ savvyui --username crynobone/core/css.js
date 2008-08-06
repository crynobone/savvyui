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
 * Require: Base
 * Optional: SUI.Ext.Animator
 */
 
SUI.namespace.include("CSS", {
	Set: function(node, data, value) {
		var data = SUI.fn.trim(data);
		var val = SUI.fn.trim(value);
		
		if (this.__FN__(node, "Set")) {
			try {
				node.style[data] = value; 
				return node;
			} catch(e) { 
				SUI.fn.logger("SUI.CSS.Set failed: " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	Setup: function(node, js) {
		var node = node;
		var data = SUI.fn.pick(js, []);
		
		if(SUI.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			
			for (var value in obj) {
				value = SUI.fn.trim(value);
				
				if (obj.hasOwnProperty(value)) {
					SUI.CSS.Set(node, value, obj[value]);
				}
			}
		};
		return node;
	},
	Get: function(node, data) {
		var data = SUI.fn.trim(data);
		
		if (this.__FN__(node, "Get")) {
			try {
				return node.style[data];
			} catch(e) {
				SUI.fn.logger("SUI.CSS.Get failed: " + node + " " + data + " " + e);
				return false;
			}
		} else {
			return false;
		}
	},
	Alpha: function(node, value) {
		var value = (value > 100 ? 100 : (value < 0 ? 0 : value));
		
		if (SUI.fn.isset(node)) {
			try {
				if (value == 0 && this.Get(node, "visibility") != "hidden") {
					this.Hide(node);
				} else if (value > 0 && this.Get(node, "visibility") == "hidden") {
					this.Show(node);
				}
				
				if (SUI.fn.behaviour.ie == true) {
					if (!node.currentStyle || !node.currentStyle.hasLayout) {
						this.Set(node, "zoom", 1);
					}
					
					this.Set(node, "filter", "alpha(opacity=" + value + ")");
				} else {
					this.Set(node, "opacity", (value / 100));
					this.Set(node, "MozOpacity", (value / 100));
				}
			} catch(e) { 
				SUI.logger("SUI.CSS.Alpha() failed: " + e); 
			}
		} else return false
	},
	Png: function(node, uri, js) {
		var node = node;
		var uri = uri;
		var gecko = SUI.fn.pick(js.gecko, "");
		var ie = SUI.fn.pick(js.ie, "scale");
		
		ie = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + uri + "',sizingMethod='" + ie + "')";
		gecko = "url('" + uri + "') " + gecko;
		
		if (window.ActiveXObject && (SUI.fn.behaviour.ie && !SUI.fn.behaviour.ie7)) {
			this.Set(node, "filter", ie);
		} else {
			this.Set(node, "background", gecko);
		}
		
		return node;
	},
	Show: function(node, fx) {
		var ani = true;
		
		if (this.__FN__(node, "Show")) {
			try {
				ani = this.__FX__(node, fx, "show");
				
				if(!ani) {
					this.Set(node, "visibility", "visible");
				}
				return node;
			} catch(e) {
				SUI.fn.logger("SUI.CSS.Show failed: " + e);
				return false;
			}
		} else return false;
	},
	Hide: function(node, fx) {
		var ani = true;
		
		if (this.__FN__(node, "Hide")) {
			try {
				ani = this.__FX__(node, fx, "hide");
				
				if (!ani) {
					this.Set(node, "visibility", "hidden");
				}
				return node;
			} catch(e) {
				SUI.fn.logger("SUI.CSS.Hide failed: " + e);
				return false;
			}
		} else return false;
	},
	__FX__: function(node, fx, value) {
		var fx = (SUI.fn.isset(fx) && fx.match(/(fast|slow)/g) ? fx : false);
		var id = SUI.Attr.Get(node, "id");
		var data = [20, 0.8, 80];
		var value = (value.match(/^(show|hide)$/) ? value : 'show');
		var fade = (value == "show" ? [0, 100] : [100, 0]);
		
		if (SUI.Ext.require("Animator") && !!fx) {
			if (fx == "slow") {
				data[0] = 60;
				data[1] = 1.5;
				data[2] = 40;
			} else if (!fx) {
				return false;
			}
			var anim = new SUI.Ext.Animator;
			anim.Initialize(node).Fx({
				method: "fade",
				transaction: fade,
				shutter: data[0],
				ease: data[1],
				step: data[2]
			});
				
			return true;
			
		} else { 
			return false;
		}
	},
	__FN__: function(node, from) {
		if (!node || !node.nodeType || node.nodeType !== 1) {
			SUI.fn.logger("SUI.CSS." + from + " failed: Object " + node + " is null");
			return false;
		} else { 
			return true;
		}
	}
});
