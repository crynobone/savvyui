/*
 * Savvy.UI JavaScript Library Application
 * Name: Js.util.ticker
 * Type: Utility/Plug-in
 * Version: 0.1 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
*/

// Import Plugin
Js.util.ticker = function(selector) {
		// Define Object's properties
	this.element = null;
	this.node = null;
	
	// start __constructor()
	if (!!selector && Jrun.trim(selector) !== "") {
		this.init(selector);
	}
	
	return this;
};
Js.util.ticker.prototype = {
	// Initialize the HTML Element
	init: function(selector) {
		this.element = Jrun.pick(selector, null);
		
		if (Jrun.isset(this.element)) { 
			this.node = jQuery(this.element);
		}
		
		return this;
	},
	// checked all checkbox
	check: function() {
		// loop all object
		this.node.each(function() {
			// set checked to true
			this.checked = true;
		});
	},
	// uncheck all checkbox
	unCheck: function() {
		// loops all object
		this.node.each(function() { 
			// set checked to false
			this.checked = false;
		});
	},
	// invert checkbox selection
	invert: function() {
		// loops all object
		this.node.each(function() {
			// reverse checkbox selection
			if (this.checked == true) {
				this.checked = false; // uncheck
			} else { 
				this.checked = true; // checked
			}
		});
	}
};
