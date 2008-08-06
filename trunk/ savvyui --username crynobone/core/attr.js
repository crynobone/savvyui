/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Attr
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base
 */
 
SUI.namespace.include("Attr", {
	// Set Attribute value for an Element
	Set: function(node, attr, value) {
		var attr = SUI.fn.trim(attr.toLowerCase());
		
		if(this.__FN__(node, "Set")) {
			if(attr == "class") { 
				// set class (using SUI.Classes Namespace)
				node.className = value;
			} else if(attr == "colspan") {
				// set colspan without creating a conflict in IE
				node.colSpan = value;
			} else if(attr == "rowspan") {
				// set rowspan without creating a conflict in IE
				node.rowSpan = value;
			} else {
				// others just one the native function
				node.setAttribute(attr, value);
			}
			// return the HTML Element
			return node;
		} else { 
			return false;
		}
	},
	// Get Attribute value from an Element
	Get: function(node, attr) {
		var attr = SUI.fn.trim(attr.toLowerCase());
		var value = false;
		
		if(this.__FN__(node, "Get")) {
			if(attr == "class" && node.className) {
				// get className
				value = node.className; 
			} else if(attr == "colspan") {
				// get colspan without creating a conflict in IE
				value = node.colSpan;
			} else if(attr == "rowspan") {
				// get rowspan without creating a conflict in IE
				value = node.rowSpan;
			} else {
				// others just one the native function
				value = node.getAttribute(attr);
			}
		}
		// return the value
		return value;
	},
	// Remove Attribute value from an Element
	Remove: function(node, attr) {
		var attr = SUI.fn.trim(attr.toLowerCase());
		
		if(this.__FN__(node, "Remove")) {
			if(attr == "class" && node.className) {
				// remove className
				node.className = "";
			} else if(attr == "colspan") {
				// remove colspan without creating a conflict in IE
				node.colSpan = "";
			} else if(attr == "rowspan") {
				// remove rowspan without creating a conflict in IE
				node.rowSpan = "";
			} else {
				// others just one the native function
				node.removeAttribute(attr);
			}
			
			// return the HTML Element
			return node;
		} else {
			return false;
		}
	},
	// Set multiple Attribute value for an Element
	Setup: function(node, data) {
		// Get the HTML Element
		var node = node;
		// Get JSON attributes
		var data = SUI.fn.pick(data, []);
		
		if(SUI.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		// Using loops, but usually there just one.
		for(var i = 0; i < data.length; i++) {
			// loop the Object
			var object = data[i];
			
			for(var value in object) {
				// trim and ensure val's value is lowercased
				value = SUI.fn.trim(value.toLowerCase());
				
				if(value != "class") {
					if(object.hasOwnProperty(value)) {
						SUI.Attr.Set(node, value, object[value]);
					}
				} else {
					SUI.Classes.Set(node, object[value]);
				}
			}
		};
	},
	// Check whether HTML element is valid
	__FN__: function(node, from) {
		if(!node || !node.nodeType || node.nodeType !== 1) {
			SUI.fn.logger("SUI.Attr." + from + " failed: Object " + node + " is null");
			return false;
		} else { 
			return true;
		}
	}
});
