/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Classes
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base
 */
 
SUI.namespace.include("Classes", {
	Set: function(node, value) {
		if(this.__FN__(node, "Set")) {
			node.className = value;
			return node;
		} else {
			return false;
		}
	},
	Append: function(node, value) {
		if(this.__FN__(node, "Append")) {
			var klasName = node.className;
			try {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != "") {
				var klass = SUI.fn.trim(klasName).split(/\s/g);
				klass[klass.length] = SUI.fn.trim(value);
				klass = SUI.fn.unique(klass);
				value = klass.join(" ");
			} else {
				value = value;	
			}
			node.className = value;
			
			} catch(e) {
				console.log(e);	
			}
		}
	},
	Get: function(node) {
		if(this.__FN__(node, "Get")) {
			// get the className value
			return node.className;
		} else { 
			// HTML Element isn't defined
			return false;
		}
	},
	Has: function(node, value) {
		var klasName = node.className;
		var value = SUI.fn.trim(value);
		
		if(this.__FN__(node, "Has")) {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != "") {
				return SUI.fn.inArray(klasName.split(/\s/), value);
			} else { 
				return false;
			}
		} else {
			return false;
		}
	},
	Remove: function(node, value) {
		var klasName = node.className;
		
		if(this.__FN__(node, "Empty")) {
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != ""){
				var data = [];
				var klass = klasName.split(/\s/);
				
				for(var i = 0; i < klass.length && klass[i]; i++) {
					if(klass[i] !== "" && klass[i] != value) { 
						data[data.length] = klass[i];
					}
				}
				node.className = data.join(" ");
			}
			return node;
		} else { 
			return false;
		}
	},
	Empty: function(node) {
		if(this.__FN__(node, "Empty")) { 
			node.className = "";
		} else {
			return false;
		}
	},
	__FN__: function(node, from) {
		if(!node || !node.nodeType || node.nodeType !== 1) {
			SUI.fn.logger("SUI.Classes." + from + " failed: Object " + node + " is null");
			return false;
		} else {
			return true;
		}
	}
});
