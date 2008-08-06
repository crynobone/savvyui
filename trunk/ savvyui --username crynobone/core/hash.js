/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Hash
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
// Hashtable function to store variable for object without having any complication with IE based browser
SUI.Storage.include("Hash", {
	object: {},
	Set: function(node, data, value) {
		var name = this.__FN__(node);
		
		if (SUI.fn.isset(name)) {
			if (!SUI.fn.isset(this.object[name])) {
				this.object[name] = {};
			}
			
			this.object[name][data] = value;
		}
	},
	Get: function(node, data) {
		var name = this.__FN__(node);
		
		if (SUI.fn.isset(name)) {
			if (SUI.fn.isset(this.object[name]) && SUI.fn.isset(this.object[name][data])) {
				return this.object[name][data];
			} else {
				return false;
			}
		} else { 
			return false;
		}
	},
	Remove: function(node, data) {
		var name = this.__FN__(node);
		
		if (SUI.fn.isset(name)) {
			this.object[name][data] = null;
			
			if (SUI.fn.isset(this.object[name]) && SUI.fn.isset(this.object[name][data])) {
				this.object[name][data] = null;
			} else {
				return false;
			}
		} else { 
			return false;
		}
	},
	__FN__: function(node) {
		return (typeof(node) == "object" ? SUI.Attr.Get(node, "id") : node);
	}
});

SUI.namespace.include("Hash", SUI.Storage.Hash);
