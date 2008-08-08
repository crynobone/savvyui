/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Ext.Ajax
 * Type: Extension
 * Last Updated: 12th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 */

// Import as Extension
SUI.Ext.include("Ajax", function(js) {
	this.object = null;
	this.debug = false;
	this.data = null;
	this.parameter = "";
	this.uri = "";
	this.type = "";
	this.reply = null;
	this.method = null;
	this.cache = true;
	this.timeout = 0;
	this.timeoutid = null;
	
	// create a XHR Request
	if(!!js && typeof(js) === "object") {
		this.Call(js);
	}
	
	// chain this
	return this;
}).prototype = {
	Initialize: function() {
		var xhr = false;
		
		if (window.XMLHttpRequest) {
			// Majority of modern browser support XMLHttpRequest()
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			// Enable support for IE browser, IE7 and above provide option to use XMLHttpRequest()
			var ms = ["MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			
			for (var i = 0; i < ms.length && !!ms[i]; i++) {
				try {
					xhr = new ActiveXObject(ms[i]);
					break;
				} catch(e){ }
			}
		}
		
		if (!xhr) {
			// Failed to attach any XHR object
			SUI.fn.logger("SUI.Ext.Ajax.Initialize() failed: browser does not support Ajax!");
		}
		
		this.object = xhr;
	},
	Call: function(js) {
		if (this.object == null) {
			// Initialize XHR object if undefined.
			this.Initialize();
		}
		
		// Check XHR method: GET/POST
		this.method = (!SUI.fn.isset(js.method) || js.method != "GET" ? "POST" : "GET");
		// Set caching option for the request
		this.cache = SUI.fn.pick(js.cache, this.cache);
		// Enable debugging for XHR request
		this.debug = SUI.fn.pick(js.debug, this.debug);
		// XHR uri request
		this.uri = (js.uri ? SUI.fn.trim(js.uri) : this.uri);
		// XHR parameters
		this.parameter = (js.parameters ? SUI.fn.trim(js.parameters) : this.parameter);
		// XHR data
		this.data = (!!js.data ? js.data : this.data);
		this.data = (!!this.data ? SUI.fn.serialize(this.data) : "");
		
		// Set timeout.
		this.timeout = SUI.fn.pick(js.timeout, this.timeout);
		this.timeout = (!!SUI.Test.isInteger(this.timeout) ? this.timeout : 0);
		
		// check whether XHR object is ready
		if (this.object.readyState == 4 || this.object.readyState == 0) {
			if (this.method == "POST") {
				// use method POST
				this.object.open("POST", this.uri, true);
				
				this.type = SUI.fn.trim(SUI.fn.pick(js.type, "application/x-www-form-urlencoded"));
				this.object.setRequestHeader("Content-Type", this.type);
				
				if(this.object.overrideMimeType) {
					this.object.setRequestHeader("Connection", "close");
				}
				
				this.__POST__();
				this.object.send(this.parameter);
			} else {
				// use method GET
				this.__GET__();
				this.object.open("GET", [this.uri, this.parameter].join(""), true);
				this.object.send("");
			}
			
			// set timeout count
			if(this.timeout > 0) {
				this.timeoutid = setTimeout(function() {
					that.Cancel();
				}, this.timeout);
			}
			
			var that = this;
			var object = this.object;
			// Run custom callback to function
			if (SUI.fn.isfunction(js.onComplete)) {
				try {
					this.object.onreadystatechange = function() {
						// clear timeout (if exist)
						if(this.readyState === 4 && that.__STATUS__()) {
							if(SUI.fn.isset(that.timeoutid)) {
								clearTimeout(that.timeoutid);
								that.timeoutid = null;
							}
							
						}
						js.onComplete.apply(that.object);
					};
				} catch(e) { 
					SUI.fn.logger(e); 
				}
			} else {
				// Run default callback to function
				this.object.onreadystatechange = function() {
					try {
						// if request is complete and page is available
						if (that.object.readyState === 4 && that.__STATUS__()) {
							// clear timeout (if exist)
							if(SUI.fn.isset(that.timeoutid)) {
								clearTimeout(that.timeoutid);
								that.timeoutid = null;
							}
							
							// get response text
							var reply = that.reply = SUI.fn.trim(that.object.responseText);
							
							// add to logs (if enable)
							if (that.debug === true) {
								SUI.fn.logger("Response from XHR: " + reply);
							}
							
							// reply shouldn't be empty
							if (reply !== "") {
								// eval the JSON string
								var data = eval("(" + reply + ")");
								
								// check for SUIXHR object
								if(!!data.SUIXHR) {
									that.__ALERT__(data);
									that.__GOTO__(data);
									that.__UPDATE__(data);
								}
								that.__DONE__();
							} else 
								that.Cancel(); // cancel the object
						}
					} catch(e) {
						// log if anything goes wrong
						SUI.fn.logger("onreadychange error: " +e);
					}
				};
			}
		}
	},
	// Cancel the currently running XHR Object/request
	Cancel: function() {
		this.object.abort();
		this.object = null;
		SUI.fn.logger("SUI.Ajax: Cancel XHR request"); 
	},
	__DONE__: function() {
		this.object = null;
	},
	__POST__: function() {
		var p = this.parameter;
		
		if (p.match(/^\?/)) {
			p = ["&", p.substring(1, p.length)].join("");
		}
		
		this.parameter = p;
		this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "") + this.data : "");
		
		if(this.cache === false) {
			var s = new Date;
			this.parameter += (this.parameter !== "" ? "&" : "?") + "suicache=" + s.getTime(); 
		}
	},
	__GET__: function() {
		var par = [];
		var param = "";
		var p = this.parameter;
		
		if (this.uri.match(/\?/)) {
			var u = this.uri.split(/\?/);
			
			if (u.length > 1) {
				this.uri = u[0];
				
				for (var i = 1; i < u.length; i++) {
					par.push(u[i]);
				}
				
				param = ["&", par.join("&")].join("");
			}
		}
		
		if (p.match(/^\?/) && p.length > 0) {
			p = "&" + p.substring(1, p.length);
		}
		
		p = [param, p].join("");
		
		if (p.length > 0 && p.match(/^(\&|\?)/)) {
			p = ["?", p.substring(1, p.length)].join("");
		}
		
		this.parameter = p;
		this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "?") + this.data : "");
		
		if(this.cache === false) {
			var s = new Date;
			this.parameter += (this.parameter !== "" ? "&" : "?") + "suicache=" + s.getTime(); 
		}
	},
	__STATUS__: function() {
		var r = this.object.status;
		
		try {
			var local = (!r && location.protocol == 'file:');
			var range = (r >= 200 && r < 300);
			var unmodified = (r == 304);
			var safari = (SUI.fn.behaviour.safari && typeof(r) == "undefined");
			return  (local || range || unmodified || safari);
		} catch(e) {
			SUI.fn.logger("Status failed: " + e);	
		}
		return false;
	},
	__ALERT__: function(data) {
		var a = SUI.fn.pick(data.alertpop, data.notice);
		
		if (SUI.fn.isset(a) && a !== "") {
			window.alert(a);
		}
	},
	__GOTO__: function(data) {
		var h = SUI.fn.pick(data.jumpto, data.href);
		
		if (SUI.fn.isset(h) && h !== "") {
			SUI.fn.href(h);
		}
	},
	__UPDATE__: function(data) {
		var p = SUI.fn.pick(data.result, data.text);
		var id = SUI.fn.pick(data.add2id, data.id);
		var fn = SUI.fn.pick(data.exec, data.callback);
		var args = SUI.fn.pick(data.args, null);
		
		if (!!p) {
			if (!!id && typeof(id) === "string") {
				SUI("#" + id).html(SUI.Parser.SuiML(p));
			} else if (SUI.fn.isfunction(fn)) {
				if(args !== null && args.length > 0) {
					fn.apply(data, args);
				} else {
					fn(p);
				}
			}
		}
	}
};

// Make it easier for people to code
SUI.namespace.include("Ajax", SUI.Ext.Ajax);

SUI.extend("load", (function(url, method, i) {
	var i = SUI.fn.pick(this.index, i, 0);
	var imethod = (!!SUI.fn.inArray(['post','get'], method.toLowerCase()) ? method.toUpperCase() : 'GET');
	
	if (SUI.fn.isset(i) && !!this.node[i]) {
		var node = this.node[i];
		
		var updateNode = function() {
			if (this.readyState == 4) {
				var text = this.responseText;
				node.innerHTML = SUI.Parser.SuiML(text);
			}
		};
		
		new SUI.Ext.Ajax({
			uri: url,
			method: imethod,
			cache: false,
			onComplete: updateNode
		});
	}
	return this;
}));
