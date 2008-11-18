/*
 * Savvy.UI JavaScript Library Widget
 * Name: Toggler
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 3rd July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 */

Js.widget.toggler = function(js) {
	this.button = null;
	this.container = null;
	this.content = null;
	
	this.buttonc = null;
	this.containerc = null;
	this.contentc = null;
	
	if(Jrun.isset(js) && typeof(js) == "object") {
		this.init(js);
	}
		
	return this;
};
Js.widget.toggler.prototype = {
	init: function(js) {
		var that = this;
		
		var button = this.button = js.button;
		var container = this.container = js.container;
		var content = this.content = js.content;
		
		if(Jrun.isset(button) && Jrun.isset(container) && Jrun.isset(content)) {
			jQuery(button).click(function() {
				var dwl = jQuery(container).eq(0);
				var stack = jQuery(content).eq(0);
				var button = jQuery(this).eq(0);
				
				if(!button.data("done") || button.data("done") == "no") {
					dwl.slideDown();
					
					button.data("done", "yes");
				} else if(button.data("done") == "yes") {
					dwl.slideUp();
					
					button.data("done", "no");
				}
				return false;
			});
		}
	}
};