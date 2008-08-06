/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Test
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("Test", {
	isString: function(value) {
		return (typeof(value) == "string" && isNaN(value));
	},
	isInteger: function(value) {
		return !isNaN(value);
	},
	isNumber: function(value) {
		return this.isInteger(value);
	},
	isEmail: function(value) {
		return (value.match(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/));
	},
	isLength: function(data, value) {
		var ar = data.split(/\-/);
		var len = SUI.fn.toNumber(ar[1]);
		var r = null;
		
		if (ar[0] === "max") {
			r = (value <= len ? true : false);
		} else if (ar[0] === "min") {
			r = (value >= len ? true : false);
		} else if (ar[0] === "exact") {
			r = (value == len ? true : false);
		} else { 
			r = true;
		}
		
		return r;
	},
	isURL: function(value) {
		return (value.match(/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/));
	},
	isIpAddress: function(value) {
		return (value.match(/^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/));
	}
});
