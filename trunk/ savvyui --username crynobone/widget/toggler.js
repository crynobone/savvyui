/*
 * Savvy.UI JavaScript Library Widget
 * Name: SUI.Widget.Toggler
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 3rd July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
 */

SUI.Widget.include("Toggler", function(js) {
	this.button = null;
	this.container = null;
	this.content = null;
	
	this.buttonc = null;
	this.containerc = null;
	this.contentc = null;
	
	if(SUI.fn.isset(js) && typeof(js) == "object") {
		this.Initialize(js);
	}
		
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		
		var button = this.button = js.button;
		var container = this.container = js.container;
		var content = this.content = js.content;
		
		if(SUI.fn.isset(button) && SUI.fn.isset(container) && SUI.fn.isset(content)) {
			SUI(button).clicks(function() {
				var dwl = SUI(container).first();
				var stack = SUI(content).first();
				var button = SUI(this).first();
				
				if(!button.getHash("done") || button.getHash("done") == "no") {
					dwl.fx({
						method:"resizeHeight",
						type:"height",
						transaction:[0, stack.fetch().scrollHeight]
					});
					
					button.setHash("done", "yes");
				} else if(button.getHash("done") == "yes") {
					dwl.fx({
						method:"resizeHeight",
						type:"height",
						transaction:[stack.fetch().scrollHeight, 0]
					});
					
					button.setHash("done", "no");
				}
				
				return false;
			});
		}
	}
};

// Backward Compatibility
SUI.Util.include("Toggler", SUI.Widget.Toggler);
