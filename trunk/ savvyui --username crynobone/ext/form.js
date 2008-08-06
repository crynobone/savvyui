/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Form
 * Type: Extension
 * Version: 0.7 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.coms
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 */
 
SUI.Ext.include("Form", function() {
	this.first = null;
	this.object = null;
	
	return this;
}).prototype = {
	LiveValidate: function(node, custom) {
		var node = this.object = SUI.fn.pick(node, this.object);
		var el = SUI.Attr.Get(node, "id");
		var custom = SUI.fn.pick(custom, null);
		var post = "";
		var that = this;
		
		if(!!node) {
			var inputs = SUI("#" + el + " :input");
			
			inputs.blurs(function() {
				var errnode = SUI(this).siblings("span.form_error").first();
				if(errnode.count() == 1) {
					SUI.DOM.Remove(errnode.fetch());	
				}
				
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (SUI.fn.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
						
						if (SUI.fn.inArray(cl, "required") && SUI.fn.trim(this.value) === "") {
							err = "This field require an input!";
						}
						
						if (SUI.fn.inArray(cl, "string") && !SUI.Test.isString(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid alphanumeric!";
						} else if (SUI.fn.inArray(cl, "integer") && !SUI.Test.isInteger(this.value) && SUI.fn.trim(this.value) !== "") { 
							err = "This field require valid numbers!";
						} else if (SUI.fn.inArray(cl, "email") && !SUI.Test.isEmail(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid e-mail address!";
						}
						
						if(SUI.fn.inArray(cl, "custom") || SUI.fn.isset(custom)) {
							var id = SUI.Attr.Get(this, "id");
							if(SUI.fn.isset(custom[id])) {
								if(SUI.fn.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									
									if(!callback) { 
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								} else if(SUI.fn.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									
									if(!test) {
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								}
							}
						}
						
						if(err !== "") {
							that.__LIVERROR__(node, this, err);
						} else {
							SUI.Classes.Remove(this, "sui-form-error");
							
							var errnode = SUI(this).siblings("span.form_error").first();
							if(errnode.count() == 1) {
								SUI.DOM.Remove(errnode.fetch());	
							}
						}
						
						for (var i = 0; i < cl.length; i++) {
							if (cl[i].match(/(max|min|exact)\-(\d*)/)) {
								if (!SUI.Test.isLength(cl[i], this.value.length)) {
									var err = cl[i].split(/\-/);
									that.__LIVERROR__(node, this, "This field require " + err[0] + " of " + err[1] + " characters.", true);
								}
							}
						}
					}
				}
			});
		}
		
		if (SUI.fn.isset(this.first)) { 
			// stop form processing
			return false;
		} else {
			return true;
		}
	},
	__LIVERROR__: function(node, form, text, data) {
		// Mark first error occured!
		var form = SUI(form);
		var node = SUI(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "error"].join("_");
		var data = SUI.fn.pick(data, false);
		var that = this;
		
		if (!SUI.fn.finds(fid)) {
			form.appendClass("sui-form-error").parent().add("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.focus(function() {
				if(this.value != "") { 
					var obj = SUI(this).removeClass("sui-form-error");
					var errnode = obj.siblings("span.form_error").first();
					
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
				}
			});
		} else if (SUI.fn.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = form.siblings("span.form_error").first();
			var ohtml = errnode.html();
			
			if (ohtml.match(text) === false && SUI.fn.trim(ohtml) != "") {
				errnode.append(" " + text);
			}
			
			form.focus(function() {
				if (this.value != "") {
					var obj = SUI(this).removeClass("sui-form-error");
					var errnode = obj.siblings("span.form_error").first();
					
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
					
				}
			});
		}
	},
	Validate: function(node, custom) {
		var node = this.object = SUI.fn.pick(node, this.object);
		var el = SUI.Attr.Get(node, "id");
		var custom = SUI.fn.pick(custom, null);
		var post = "";
		this.first = null;
		var that = this;
		
		if(!!node) {
			var inputs = SUI("#" + el + " :input");
			
			inputs.each(function() {
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (SUI.fn.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
												
						if (SUI.fn.inArray(cl, "required") && SUI.fn.trim(this.value) === "") {
							err = "This field require an input!";
						}
						
						if (SUI.fn.inArray(cl, "string") && !SUI.Test.isString(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid alphanumeric!";
						} else if (SUI.fn.inArray(cl, "integer") && !SUI.Test.isInteger(this.value) && SUI.fn.trim(this.value) !== "") { 
							err = "This field require valid numbers!";
						} else if (SUI.fn.inArray(cl, "email") && !SUI.Test.isEmail(this.value) && SUI.fn.trim(this.value) !== "") {
							err = "This field require valid e-mail address!";
						}
						
						if(SUI.fn.inArray(cl, "custom") || SUI.fn.isset(custom)) {
							var id = SUI.Attr.Get(this, "id");
							if(SUI.fn.isset(custom[id])) {
								if(SUI.fn.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									
									if(!callback) {
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								} else if(SUI.fn.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									
									if(!test) {
										err = SUI.fn.pick(custom[id]['err'], err);
									}
								} else {
									err	= SUI.fn.pick(custom[id]['err'], err);
								}
							}
						}
						
						if(err !== "") {
							that.__ERROR__(node, this, err);
						} else {
							SUI.Classes.Remove(this, "sui-form-error");
							var errnode = SUI(this).siblings("span.form_error").first();
							
							if(errnode.count() == 1) {
								SUI.DOM.Remove(errnode.fetch());	
							}
						}
						
						for (var i = 0; i < cl.length; i++) {
							if (cl[i].match(/(max|min|exact)\-(\d*)/)) {
								if (!SUI.Test.isLength(cl[i], this.value.length)) {
									var err = cl[i].split(/\-/);
									that.__ERROR__(node, this, "This field require " + err[0] + " of " + err[1] + " characters.", true);
								}
							}
						}
						
						// dump name and value to opt in querystring format ( &name=value )
						if (this.type.toLowerCase().match(/^(checkbox|radio)$/)) {
							// only add checked checkbox input
							if (this.type == "checkbox" && this.checked == true) 
								post += "&" + this.name + "=" + SUI.Parser.HTML.to(this.value);
							// only add checked radiobox input
							else if (this.type == "radio" && this.checked == true) 
								post += "&" + this.name + "=" + SUI.Parser.HTML.to(this.value);
						} else 
							post += "&" + this.name + "=" + SUI.Parser.HTML.to(this.value);  // add all input (except radio/checkbox)
					}
				}
			});
		}
		
		if (SUI.fn.isset(this.first)) { 
			// there an error, set focus to first invalid field
			this.first.focus();
			// stop form processing
			return false;
		} else {
			return post; // return all field data in querystring formatting
		}
	},
	__ERROR__: function(node, form, text, data) {
		// Mark first error occured!
		this.first = (SUI.fn.isnull(this.first) ? node : this.first);
		
		var form = SUI(form);
		var node = SUI(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "_error"].join("");
		var data = SUI.fn.pick(data, false);
		var that = this;
		
		if (!SUI.fn.finds(fid)) {
			form.appendClass("sui-form-error").parent().add("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.changes(function() {
				if(this.value != "") { 
					var obj = SUI(this).removeClass("sui-form-error");
					
					var errnode = obj.siblings("span.form_error").first();
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
					that.first = null;
				}
			});
		} else if (SUI.fn.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = form.siblings("span.form_error").first();
			ohtml = form.html();
			
			if (ohtml.match(text) === false && SUI.fn.trim(ohtml) != "") {
				errnode.append(text);
			}
			
			form.changes(function() {
				if (this.value != "") {
					var obj = SUI(this).removeClass("sui-form-error");
					
					var errnode = obj.siblings("span.form_error").first();
					if(errnode.count() == 1) {
						SUI.DOM.Remove(errnode.fetch());
					}
					that.first = null;
				}
			});
		}
	},
	Post: function(js) {
		// form object
		var object = SUI.fn.pick(js.object, js.node);
		// choose to use object
		var node = SUI.fn.prepare(object, js.element, "object");
		// add custom field validation
		var custom = SUI.fn.pick(js.custom, null);
		// onsuccess function
		var ifn = SUI.fn.pick(js.onsuccess, js.onstart, null);
		// onfaild function
		var ffn = SUI.fn.pick(js.onfail, null);
		// validate selected form
		var post = this.Validate(node, custom);
		// parameters
		var parameter = SUI.fn.pick(js.parameters, js.params, "");
		
		if (post) {
			// callback to onsuccess function
			if (SUI.fn.isfunction(ifn)) {
				ifn();
			}
			
			parameter += (SUI.fn.trim(post) !== "" ? post : "");
			
			// send XHR request
			new SUI.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "POST"
			});
			
			return true;
		} else {
			// callback to onfail function
			if (SUI.fn.isfunction(ffn)) {
				ffn();
			}
			return false;
		}
	},
	Get: function(js) {
		// form object
		var object = SUI.fn.pick(js.object, js.node);
		// choose to use object
		var node = SUI.fn.prepare(object, js.element, "object");
		// add custom field validation
		var custom = SUI.fn.pick(js.custom, null);
		// onsuccess function
		var ifn = SUI.fn.pick(js.onsuccess, js.onstart, null);
		// onfaild function
		var ffn = SUI.fn.pick(js.onfail, null);
		// validate selected form
		var get = this.Validate(node, custom);
		// parameters
		var parameter = SUI.fn.pick(js.parameters, js.params, "");
		
		if (get) {
			// callback to onsuccess function
			if (SUI.fn.isfunction(ifn)) {
				ifn();
			}
			
			parameter += (SUI.fn.trim(get) !== "" ? post : "");
			
			// send XHR request
			new SUI.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "GET",
				cache: false
			});
			
			return true;
		} else {
			// callback to onfail function
			if (SUI.fn.isfunction(ffn)) {
				ffn();
			}
			return false;
		}
	}
};

SUI.namespace.include("Form", SUI.Ext.Form);
