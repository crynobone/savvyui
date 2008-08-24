/*
 * Savvy.UI JavaScript Library Application
 * Name: Base
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI/Js
 */

Js.namespace.include({
	name: "base",
	object: function() {}, 
	proto: {
		__destruct: function() {
			// remove all properties and method for this object
			for (var method in this) {
				this[method] = null;
			}
				
			for (var method in this.prototype) {
				this.prototype[method] = null;
			}
			
			delete this;
			return null;
		}
	}
});

Js.base.create = function(js) {	
	var initialize = true;
	var prototype = new Js.base;
	initialize = false;
	
	function Class() {
		if(!initialize && !!this.construct) {
			this.construct.apply(this, Js.code.toArray(arguments));
		}
	};
	
	Class.prototype = prototype;
	Class.prototype.construct = Js.code.pick(js.__construct, null);
	Class.constructor = Class;
	Class.extend = function(js) {
		js.ext = this;
		return Js.base.create(js);
	};
	
	var ext = Js.code.pick(js.ext, null);
	
	if(Js.code.isset(ext)) {
		try {
			// try to copy parent object.
			(function(js) {
				var list = ["ext", "__construct", "__destruct", "_super", "prototype"];
				// start adding parent method and properties to this object
				for (var method in js.prototype) {
					if (js.prototype.hasOwnProperty(method) && (!Js.code.inArray(list, method) && !this[method])) {
						this[method] = js.prototype[method];
					}
				}
				for (var method in js) {
					if (js.hasOwnProperty(method) && (!Js.code.inArray(list, method) && !this[method])) {
						this[method] = js[method];
					}
				}
				// create a linkage to the parent object
				this._super = js.prototype;
			}).call(prototype, ext);
		} catch(e) {
			Js.debug.log(e);
		}
	}
	
	// add this object user defined properties and methods
	(function(js) {
		// the following object shouldn't be extended
		var mtd = ["ext", "__construct", "__destruct", "_super", "prototype"];
		
		// start adding method and properties to this object
		for (var method in js) {
			if (js.hasOwnProperty(method) && (!Js.code.inArray(mtd, method) && !this[method])) {
				this[method] = js[method];
			}
		};
	}).call(prototype, js);
	
	// avoid this.ext to be duplicated in this.prototype 
	delete ext;
	
	return Class;
};
