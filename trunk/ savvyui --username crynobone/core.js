/*
 * Savvy.UI JavaScript Library Application
 * Name: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, Base
 */

Js.namespace.include("attr", {
	// Set Attribute value for an Element
	set: function(node, attr, value) {
		var attr = Js.fn.trim(attr.toLowerCase());
		
		if(Js.fn.verifyNode(node, "attr.set")) {
			if(attr == "class") { 
				// set className
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
	get: function(node, attr) {
		var attr = Js.fn.trim(attr.toLowerCase());
		var value = false;
		
		if(Js.fn.verifyNode(node, "attr.set")) {
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
	remove: function(node, attr) {
		var attr = Js.fn.trim(attr.toLowerCase());
		
		if(Js.fn.verifyNode(node, "attr.remove")) {
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
	setup: function(node, data) {
		// Get the HTML Element
		var node = node;
		
		// Get JSON attributes
		var data = Js.fn.pick(data, []);
		
		if(Js.fn.typeOf(data) !== "array") {
			data = [data];
		}
		
		// Using loops, but usually there just one.
		for(var i = 0; i < data.length; i++) {
			// loop the Object
			var object = data[i];
			
			for(var value in object) {
				// trim and ensure val's value is lowercased
				value = Js.fn.trim(value.toLowerCase());
				
				if(value != "class") {
					if(object.hasOwnProperty(value)) {
						Js.attr.set(node, value, object[value]);
					}
				} else {
					if(Js.fn.verifyNode(node, "attr.setup") {
						node.className = object[value];
					}
				}
			}
		};
	}
});
					
Js.namespace.include("className", {
	set: function(node, value) {
		if(Js.fn.verifyNode(node, "className.set")) {
			node.className = value;
			return node;
		} else {
			return false;
		}
	},
	append: function(node, value) {
		if(Js.fn.verifyNode(node, "className.append")) {
			var klasName = node.className;
			
			if(SUI.fn.isset(klasName) && SUI.fn.trim(klasName) != "") {
				var klass = SUI.fn.trim(klasName).split(/\s/g);
				klass[klass.length] = SUI.fn.trim(value);
				klass = SUI.fn.unique(klass);
				value = klass.join(" ");
			} else {
				value = value;	
			}
			node.className = value;
		}
	},
	get: function(node) {
		if(this.__FN__(node, "Get")) {
			// get the className value
			return node.className;
		} else { 
			// HTML Element isn't defined
			return false;
		}
	},
	has: function(node, value) {
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
	remove: function(node, value) {
		var klasName = node.className;
		
		if(Js.fn.verifyNode(node, "className.remove")) {
			if(Js.fn.isset(klasName) && Js.fn.trim(klasName) != ""){
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
	empty: function(node) {
		if(Js.fn.verifyNode(node, "className.empty")) { 
			node.className = "";
		} else {
			return false;
		}
	}
});