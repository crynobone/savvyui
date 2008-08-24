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

// include Js.ext.Ajax
Js.ext.include({
	name: "Ajax", 
	object: function(js) {
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
		this.timeoutId = null;
		
		// create a XHR Request
		if(!!js && typeof(js) === "object") {
			this.init(js);
		}
		
		// chain this
		return this;
	}, 
	proto: {
		declare: function() {
			var xhr = false;
			
			if(window.XMLHttpRequest) {
				// Majority of modern browser support XMLHttpRequest()
				xhr = new XMLHttpRequest();
			} else if(window.ActiveXObject) {
				// Enable support for IE browser, IE7 and above provide option to use XMLHttpRequest()
				var ie = ["MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
				
				for(var num = 0; num < ie.length && !!ie[num]; num++) {
					try {
						xhr = new ActiveXObject(ie[num]);
						break;
					} catch(e){ 
						// The browser doesn't support this Object, try another one.
					}
				}
			}
			
			if(!xhr) {
				// Failed to attach any XHR object
				Js.debug.log("Js.ext.Ajax.init() failed: browser does not support Ajax!");
			}
			
			this.object = xhr;
		},
		init: function(js) {
			if(this.object == null) {
				// Initialize XHR object if undefined.
				this.declare();
			}
			
			// Check XHR method: GET/POST
			this.method = (!Js.code.isset(js.method) || js.method != "GET" ? "POST" : "GET");
			// Set caching option for the request
			this.cache = Js.code.pick(js.cache, this.cache);
			// Enable debugging for XHR request
			this.debug = Js.code.pick(js.debug, this.debug);
			// XHR uri request
			this.uri = (js.uri ? Js.code.trim(js.uri) : this.uri);
			// XHR parameters
			this.parameter = (js.parameters ? Js.code.trim(js.parameters) : this.parameter);
			
			// XHR data
			this.data = (!!js.data ? js.data : this.data);
			this.data = (!!this.data ? Js.code.serialize(this.data) : "");
			
			// Set timeout.
			this.timeout = Js.code.pick(js.timeout, this.timeout);
			this.timeout = (!!Js.test.isInteger(this.timeout) ? this.timeout : 0);
			
			// check whether XHR object is ready
			if(this.object.readyState == 4 || this.object.readyState == 0) {
				if(this.method == "POST") {
					// use method POST
					this.object.open("POST", this.uri, true);
					
					this.type = Js.code.trim(Js.code.pick(js.type, "application/x-www-form-urlencoded"));
					this.object.setRequestHeader("Content-Type", this.type);
					
					if(this.object.overrideMimeType) {
						this.object.setRequestHeader("Connection", "close");
					}
					
					this.methodPost();
					this.object.send(this.parameter);
				} else {
					// use method GET
					this.methodGet();
					this.object.open("GET", [this.uri, this.parameter].join(""), true);
					this.object.send("");
				}
				
				// set timeout count
				if(this.timeout > 0) {
					this.timeoutId = setTimeout(function() {
						that.requestCancel();
					}, this.timeout);
				}
				
				var that = this;
				var object = this.object;
				// Run custom callback to function
				if(Js.code.isfunction(js.onComplete)) {
					try {
						this.object.onreadystatechange = function() {
							// clear timeout (if exist)
							if(this.readyState === 4 && that.requestStatus()) {
								if(Js.code.isset(that.timeoutid)) {
									clearTimeout(that.timeoutid);
									that.timeoutid = null;
								}
								
							}
							js.onComplete.apply(that.object);
						};
					} catch(e) { 
						Js.debug.log(e); 
					}
				} else {
					// Run default callback to function
					this.object.onreadystatechange = function() {
						try {
							// if request is complete and page is available
							if(that.object.readyState === 4 && that.requestStatus()) {
								// clear timeout (if exist)
								if(Js.code.isset(that.timeoutid)) {
									clearTimeout(that.timeoutid);
									that.timeoutid = null;
								}
								
								// get response text
								var reply = that.reply = Js.code.trim(that.object.responseText);
								
								// add to logs (if enable)
								if(that.debug === true) {
									Js.debug.log("Response from XHR: " + reply);
								}
								
								// reply shouldn't be empty
								if(reply !== "") {
									// eval the JSON string
									var data = eval("(" + reply + ")");
									
									// check for SUIXHR object
									if(!!data.SUIXHR) {
										that.responseNotice(data);
										that.responseHref(data);
										that.responseUpdate(data);
									}
									that.requestDone();
								} else {
									that.requestCancel(); // cancel the object
								}
							}
						} catch(e) {
							// log if anything goes wrong
							Js.debug.log("onreadychange error: " +e);
						}
					};
				}
			}
		},
		// Cancel the currently running XHR Object/request
		requestCancel: function() {
			this.object.abort();
			this.object = null;
			
			Js.debug.log("Js.ext.Ajax: Cancel XHR request"); 
		},
		requestDone: function() {
			this.object = null;
		},
		methodPost: function() {
			var p = this.parameter;
			
			if(p.match(/^\?/)) {
				p = ["&", p.substr(1)].join("");
			}
			
			this.parameter = p;
			this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "") + this.data : "");
			
			if(this.cache === false) {
				var s = new Date;
				this.parameter += (this.parameter !== "" ? "&" : "?") + "jscache=" + s.getTime(); 
			}
		},
		methodGet: function() {
			var par = [];
			var param = "";
			var p = this.parameter;
			
			if(this.uri.match(/\?/)) {
				var u = this.uri.split(/\?/);
				
				if (u.length > 1) {
					this.uri = u[0];
					
					for (var i = 1; i < u.length; i++) {
						par[par.length] = u[i];
					}
					
					param = ["&", par.join("&")].join("");
				}
			}
			
			if(p.match(/^\?/) && p.length > 0) {
				p = "&" + p.substr(1);
			}
			
			p = [param, p].join("");
			
			if(p.length > 0 && p.match(/^(\&|\?)/)) {
				p = ["?", p.substr(1)].join("");
			}
			
			this.parameter = p;
			this.parameter += (this.data !== "" ? (this.parameter !== "" ? "&" : "?") + this.data : "");
			
			if(this.cache === false) {
				var s = new Date;
				this.parameter += (this.parameter !== "" ? "&" : "?") + "jscache=" + s.getTime(); 
			}
		},
		requestStatus: function() {
			var r = this.object.status;
			
			try {
				var local = (!r && location.protocol == 'file:');
				var range = (r >= 200 && r < 300);
				var unmodified = (r == 304);
				var safari = (Js.code.behaviour.safari && typeof(r) == "undefined");
				return  (local || range || unmodified || safari);
			} catch(e) {
				Js.debug.log("Status failed: " + e);	
			}
			return false;
		},
		responseNotice: function(data) {
			var note = Js.code.pick(data.notice);
			
			if(Js.code.isset(note) && note !== "") {
				window.alert(note);
			}
		},
		responseHref: function(data) {
			var href = Js.code.pick(data.href);
			
			if(Js.code.isset(href) && href !== "") {
				Js.code.href(href);
			}
		},
		responseUpdate: function(data) {
			var args = Js.code.pick(data.text);
			var id = Js.code.pick(data.id);
			var object = Js.code.pick(data.exec, data.callback);
			
			if(!!args) {
				if(!!id && typeof(id) === "string") {
					Js.query.id(id).innerHTML = Js.parse.bbml(args);
				} else if(Js.code.isfunction(object)) {
					object(args);
				}
			}
		}
	}
});

// It make it easier with Js.Ajax
Js.namespace.include({
	name: "Ajax", 
	object: Js.ext.Ajax
});

Js.extend("load", function(url, method) {
	var key = Js.code.pick(this.index, 0);
	var method = ((!!method && !!method.toLowerCase().match(/^(get|post)$/)) ? method.toUpperCase() : 'GET');
	
	if(Js.code.isset(key) && !!this.node[key]) {
		var node = this.node[key];
		
		var update = function() {
			if(this.readyState == 4) {
				var text = this.responseText;
				node.innerHTML = Js.parse.bbml(text);
			}
		};
		
		new Js.Ajax({
			uri: url,
			method: method,
			cache: false,
			onComplete: update
		});
	}
	return this;
});
