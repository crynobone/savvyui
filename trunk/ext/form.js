/*
 * Savvy.UI JavaScript Library Extension
 * Name: Form
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
 
Js.ext.include("Form", function() {
	this.first = null;
	this.object = null;
	
	return this;
}).prototype = {
	liveValidate: function(node, custom) {
		var node = this.object = Js.code.pick(node, this.object);
		var el = Js.attr.get(node, "id");
		var custom = Js.code.pick(custom, null);
		var post = "";
		var that = this;
		
		if(!!node) {
			var inputs = Js("#" + el + " :input");
			
			inputs.blurs(function() {
				var errnode = Js(this).siblings("span.form_error").first();
				if(errnode.count() == 1) {
					Js.dom.remove(errnode.fetch());	
				}
				
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (Js.code.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
						
						if (Js.code.inArray(cl, "required") && Js.code.trim(this.value) === "") {
							err = "This field require an input!";
						}
						
						if (Js.code.inArray(cl, "string") && !Js.test.isString(this.value) && Js.code.trim(this.value) !== "") {
							err = "This field require valid alphanumeric!";
						} else if (Js.code.inArray(cl, "integer") && !Js.test.isInteger(this.value) && Js.code.trim(this.value) !== "") { 
							err = "This field require valid numbers!";
						} else if (Js.code.inArray(cl, "email") && !Js.test.isEmail(this.value) && Js.code.trim(this.value) !== "") {
							err = "This field require valid e-mail address!";
						}
						
						if(Js.code.inArray(cl, "custom") || Js.code.isset(custom)) {
							var id = Js.attr.get(this, "id");
							if(Js.code.isset(custom[id])) {
								if(Js.code.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									
									if(!callback) { 
										err = Js.code.pick(custom[id]['err'], err);
									}
								} else if(Js.code.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									
									if(!test) {
										err = Js.code.pick(custom[id]['err'], err);
									}
								}
							}
						}
						
						if(err !== "") {
							that.__LIVERROR__(node, this, err);
						} else {
							Js.class.remove(this, "sui-form-error");
							
							var errnode = Js(this).siblings("span.form_error").first();
							if(errnode.count() == 1) {
								Js.dom.remove(errnode.fetch());	
							}
						}
						
						for (var i = 0; i < cl.length; i++) {
							if (cl[i].match(/(max|min|exact)\-(\d*)/)) {
								if (!Js.test.isLength(cl[i], this.value.length)) {
									var err = cl[i].split(/\-/);
									that.liveError(node, this, "This field require " + err[0] + " of " + err[1] + " characters.", true);
								}
							}
						}
					}
				}
			});
		}
		
		if (Js.code.isset(this.first)) { 
			// stop form processing
			return false;
		} else {
			return true;
		}
	},
	liveError: function(node, form, text, data) {
		// Mark first error occured!
		var form = Js(form);
		var node = Js(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "error"].join("_");
		var data = Js.code.pick(data, false);
		var that = this;
		
		if (!Js.code.finds(fid)) {
			form.appendClass("sui-form-error").parent().add("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.focus(function() {
				if(this.value != "") { 
					var obj = Js(this).removeClass("sui-form-error");
					var errnode = obj.siblings("span.form_error").first();
					
					if(errnode.count() == 1) {
						Js.dom.remove(errnode.fetch());
					}
				}
			});
		} else if (Js.code.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = form.siblings("span.form_error").first();
			var ohtml = errnode.html();
			
			if (ohtml.match(text) === false && Js.code.trim(ohtml) != "") {
				errnode.append(" " + text);
			}
			
			form.focus(function() {
				if (this.value != "") {
					var obj = Js(this).removeClass("sui-form-error");
					var errnode = obj.siblings("span.form_error").first();
					
					if(errnode.count() == 1) {
						Js.dom.remove(errnode.fetch());
					}
					
				}
			});
		}
	},
	validate: function(node, custom) {
		var node = this.object = Js.code.pick(node, this.object);
		var el = Js.attr.get(node, "id");
		var custom = Js.code.pick(custom, null);
		var post = "";
		this.first = null;
		var that = this;
		
		if(!!node) {
			var inputs = Js("#" + el + " :input");
			
			inputs.each(function() {
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (Js.code.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
												
						if (Js.code.inArray(cl, "required") && Js.code.trim(this.value) === "") {
							err = "This field require an input!";
						}
						
						if (Js.code.inArray(cl, "string") && !Js.test.isString(this.value) && Js.code.trim(this.value) !== "") {
							err = "This field require valid alphanumeric!";
						} else if (Js.code.inArray(cl, "integer") && !Js.test.isInteger(this.value) && Js.code.trim(this.value) !== "") { 
							err = "This field require valid numbers!";
						} else if (Js.code.inArray(cl, "email") && !Js.test.isEmail(this.value) && Js.code.trim(this.value) !== "") {
							err = "This field require valid e-mail address!";
						}
						
						if(Js.code.inArray(cl, "custom") || Js.code.isset(custom)) {
							var id = Js.attr.get(this, "id");
							if(Js.code.isset(custom[id])) {
								if(Js.code.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									
									if(!callback) {
										err = Js.code.pick(custom[id]['err'], err);
									}
								} else if(Js.code.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									
									if(!test) {
										err = Js.code.pick(custom[id]['err'], err);
									}
								} else {
									err	= Js.code.pick(custom[id]['err'], err);
								}
							}
						}
						
						if(err !== "") {
							that.__ERROR__(node, this, err);
						} else {
							Js.class.remove(this, "sui-form-error");
							var errnode = Js(this).siblings("span.form_error").first();
							
							if(errnode.count() == 1) {
								Js.dom.remove(errnode.fetch());	
							}
						}
						
						for (var i = 0; i < cl.length; i++) {
							if (cl[i].match(/(max|min|exact)\-(\d*)/)) {
								if (!Js.test.isLength(cl[i], this.value.length)) {
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
		
		if (Js.code.isset(this.first)) { 
			// there an error, set focus to first invalid field
			this.first.focus();
			// stop form processing
			return false;
		} else {
			return post; // return all field data in querystring formatting
		}
	},
	error: function(node, form, text, data) {
		// Mark first error occured!
		this.first = (Js.code.isnull(this.first) ? node : this.first);
		
		var form = Js(form);
		var node = Js(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "_error"].join("");
		var data = Js.code.pick(data, false);
		var that = this;
		
		if (!Js.code.finds(fid)) {
			form.appendClass("sui-form-error").parent().add("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.changes(function() {
				if(this.value != "") { 
					var obj = Js(this).removeClass("sui-form-error");
					
					var errnode = obj.siblings("span.form_error").first();
					if(errnode.count() == 1) {
						Js.dom.remove(errnode.fetch());
					}
					that.first = null;
				}
			});
		} else if (Js.code.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = form.siblings("span.form_error").first();
			ohtml = form.html();
			
			if (ohtml.match(text) === false && Js.code.trim(ohtml) != "") {
				errnode.append(text);
			}
			
			form.changes(function() {
				if (this.value != "") {
					var obj = Js(this).removeClass("sui-form-error");
					
					var errnode = obj.siblings("span.form_error").first();
					if(errnode.count() == 1) {
						Js.dom.remove(errnode.fetch());
					}
					that.first = null;
				}
			});
		}
	},
	post: function(js) {
		// form object
		var object = Js.code.pick(js.object, js.node);
		// choose to use object
		var node = Js.code.prepare(object, js.element, "object");
		// add custom field validation
		var custom = Js.code.pick(js.custom, null);
		// onsuccess function
		var ifn = Js.code.pick(js.onsuccess, js.onstart, null);
		// onfaild function
		var ffn = Js.code.pick(js.onfail, null);
		// validate selected form
		var post = this.Validate(node, custom);
		// parameters
		var parameter = Js.code.pick(js.parameters, js.params, "");
		
		if (post) {
			// callback to onsuccess function
			if (Js.code.isfunction(ifn)) {
				ifn();
			}
			
			parameter += (Js.code.trim(post) !== "" ? post : "");
			
			// send XHR request
			new Js.ext.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "POST"
			});
			
			return true;
		} else {
			// callback to onfail function
			if (Js.code.isfunction(ffn)) {
				ffn();
			}
			return false;
		}
	},
	get: function(js) {
		// form object
		var object = Js.code.pick(js.object, js.node);
		// choose to use object
		var node = Js.code.prepare(object, js.element, "object");
		// add custom field validation
		var custom = Js.code.pick(js.custom, null);
		// onsuccess function
		var ifn = Js.code.pick(js.onsuccess, js.onstart, null);
		// onfaild function
		var ffn = Js.code.pick(js.onfail, null);
		// validate selected form
		var get = this.Validate(node, custom);
		// parameters
		var parameter = Js.code.pick(js.parameters, js.params, "");
		
		if (get) {
			// callback to onsuccess function
			if (Js.code.isfunction(ifn)) {
				ifn();
			}
			
			parameter += (Js.code.trim(get) !== "" ? post : "");
			
			// send XHR request
			new Js.ext.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "GET",
				cache: false
			});
			
			return true;
		} else {
			// callback to onfail function
			if (Js.code.isfunction(ffn)) {
				ffn();
			}
			return false;
		}
	}
};

Js.namespace.include("Form", Js.ext.Form);
