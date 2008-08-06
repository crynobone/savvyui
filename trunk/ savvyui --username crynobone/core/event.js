/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Event
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("Event", function(handler, js) {
	this.node = window;
	this.type = null;
	this.fn = null;
	
	if(handler == "on") {
		return this.On(js);
	} else if(handler == "off") {
		return this.Off(js);
	}
	
	return this;
}).prototype = {
	On: function(js) {
		var that = this;
		var p = true;
		var r;
		
		this.node = SUI.fn.pick(js.object, this.node);
		this.type = SUI.fn.pick(js.on, this.type, "load");
		this.fn = SUI.fn.pick(js.callback, this.fn);
		
		if (this.node.addEventListener) {
			try { 
				r = this.node.addEventListener(this.type, this.fn, false);
				return r;
			} catch(e) {
				try {
					this.node.attachEvent("on" + this.type, this.fn);
				} catch(e) {
					p = false;
				}
			}
		} else if (this.node.attachEvent) {
			try { 
				this.node.attachEvent("on" + this.type, this.fn);
			} catch(e) { 
				p = false; 
			}
			
			return true;
		} else {
			p = false;
		}
		
		if (!pass) {
			var fn = SUI.fn.pick(this.object["on" + this.type], null);
			SUI.fn.on(this.node, this.type, function() {
				if(SUI.fn.isset(fn) && SUI.fn.isfunction(fn)) {
					fn();
				}
				that.fn();
			});
		}
	},
	Off: function (js) {
		var that = this;
		var r = false;
		this.node = SUI.fn.pick(js.object, this.node);
		this.type = SUI.fn.pick(js.on, this.type, "load");
		this.fn = SUI.fn.pick(js.callback, this.fn);
		
		if (this.node.detachEvent) {
			try { 
				r = this.node.detachEvent("on" + this.type, this.fn);
			} catch(e) {
				try { 
					r = this.node.removeEventListener(this.type, this.fn, false);
				} catch(e) { 
					r = "Unable to load window.attachEvent: " + e;
				}
			}
		} else { 
			try { 
				r = this.node.removeEventListener(this.type, this.fn, false);
			} catch(e) {
				r = "Unable to load window.addEventListener: " + e;
			}
		}
		return r;
	}
};

/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.onDOMReady
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, SUI.Event
 */

SUI.namespace.include("onDOMReady", {
	_FN_: [],
	_NODE_: [],
	script: null,
	timer: null,
	done: null,
	Initialize: function(node, fn) {
		var that = SUI.onDOMReady;
		
		return (function(fn, node) {
			if (!!that.done) {
				if(!!node && node !== document) {
					SUI.fn.callback(node, fn);
				} else { 
					fn();
				}
				
				return;
			}
			
			if (/Konqueror/i.test(navigator.userAgent)) {
				new SUI.Event("on", {
					on: "load",
					callback: function() {
						that.__CALLBACK__();
					}
				});
			} else if (document.addEventListener) {
				try { 
					document.addEventListener("DOMContentLoaded", that.__CALLBACK__, false); 
				} catch(e) { 
					new SUI.Event("on", {
						on: "load",
						callback: function() {
							that.__CALLBACK__();	
						}
					});
				}
			}
			
			if (/WebKit/i.test(navigator.userAgent)) { 
				var timer = setInterval(function() {
					if (/loaded|complete/.test(document.readyState)) {
						that.__CALLBACK__();
						clearInterval(that.timer);
						that.timer = null;
					}
				}, 10);
			}
			
			if (!!SUI.fn.behaviour.ie) {
				try {
					document.write("<script id=__ie_onload defer src=//0><\/scr"+"ipt>");
					that.script = document.getElementById("__ie_onload");
					that.script.onreadystatechange = function() {
						if (this.readyState == "complete") 
							that.__CALLBACK__(); // call the onload handler
					};
				} catch(e) { 
					SUI.fn.logger(e);
				}
			} else {
				new SUI.Event("on", {
					on: "load",
					callback: (function() {
						that.__CALLBACK__();
					})
				});
			}
			
			that._FN_.push(fn);
			that._NODE_.push(node);
		})(fn, node);
	},
	__CALLBACK__: function() {
		if(!SUI.onDOMReady.done) {
			SUI.onDOMReady.done = true;
			
			if (!!SUI.onDOMReady.timer) {
				clearInterval(that.timer);
				SUI.onDOMReady.timer = null;
			}
			
			for (var i = 0; i < SUI.onDOMReady._FN_.length; i++) {
				var fn = SUI.onDOMReady._FN_[i];
				var node = SUI.onDOMReady._NODE_[i];
				
				if (SUI.fn.isfunction(fn)) {
					if(!!node && node !== document) {
						SUI.fn.callback(node, fn);
					} else { 
						fn();
					}
				}
			}
			
			SUI.onDOMReady._FN_ = new Array;
			SUI.onDOMReady._NODE_ = new Array;
			
			if(!!SUI.onDOMReady.script) {
				SUI.onDOMReady.script.onreadystatechange = '';
			}
		}
	}
});
