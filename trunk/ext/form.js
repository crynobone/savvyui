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
 
Js.ext.include({
	name: "Form", 
	object: function() {
		this.first = null;
		this.object = null;
		
		return this;
	},
	proto: {
		liveValidate: function(node, custom) {
			this.object = Jrun.pick(node, this.object);
			
			var formId = Js.attr.get(this.object, "id");
			var custom = Jrun.pick(custom, null);
			var post = "";
			var that = this;
			
			if(!!this.object) {
				var field = Js("#" + formId + " :input");
				
				field.onblur(function() {
					var errorNode = Js(this).siblings("span.extform-errormessage").first();
					if(errorNode.count() == 1) {
						Js.dom.remove(errorNode.fetch());
					}
					
					if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/)) {
						if(this.name != "") {
							this.className = (Jrun.isset(this.className) ? this.className : "");
							var klass = this.className.split(/\s/);
							var error = "";
							
							if(Jrun.inArray(klass, "required") && Jrun.trim(this.value) === "") {
								error = "This field require an input!";
							}
							
							if(Jrun.inArray(klass, "string") && !Js.test.isString(this.value) && Jrun.trim(this.value) !== "") {
								error = "This field require valid alphanumeric!";
							} else if((Jrun.inArray(klass, "integer") || Jrun.inArray(klass, "number")) && !Js.test.isInteger(this.value) && Jrun.trim(this.value) !== "") { 
								error = "This field require valid numbers!";
							} else if(Jrun.inArray(klass, "email") && !Js.test.isEmail(this.value) && Jrun.trim(this.value) !== "") {
								error = "This field require valid e-mail address!";
							}
							
							if(Jrun.isset(custom)) {
								var validate = custom[Js.attr.get(this, "id")];
								
								if(Jrun.isset(validate)) {
									if(Jrun.isfunction(validate.callback) && !validate.callback(this.value)) { 
										error = Jrun.pick(validate.error, error);
									} else if(Jrun.isset(validate.test) && !this.value.match(validate.test)) {
										error = Jrun.pick(validate.error, error);
									}
								}
							}
							
							if(error !== "") {
								that.liveErrorInit(this, error);
							} else {
								Js.className.remove(this, "extform-error");
								
								var errorNode = Js(this).siblings("span.extform-errormessage").first();
								if(errorNode.count() == 1) {
									Js.dom.remove(errorNode.fetch());	
								}
							}
							
							for(var i = 0; i < klass.length; i++) {
								if(klass[i].match(/(max|min|exact)\-(\d*)/)) {
									if(!Js.test.isLength(klass[i], this.value.length)) {
										var error = klass[i].split(/\-/);
										that.liveErrorInit(this, "This field require " + error[0] + " of " + error[1] + " characters.", true);
									}
								}
							}
						}
					}
				});
			}
			
			if(Jrun.isset(this.first)) { 
				// stop form processing
				return false;
			} else {
				return true;
			}
		},
		liveErrorInit: function(field, text, data) {
			this.first = (Jrun.isnull(this.first) ? field : this.first);
			// Mark first error occured!
			var form = Js(this.object);
			var field = Js(field);
			var fieldId = field.get("name");
			var fieldErrorId = [form.get("id"), fieldId, "error"].join("-");
			var data = Jrun.pick(data, false);
			var that = this;
			
			if (!Jrun.finds(fieldErrorId)) {
				field.appendClass("extform-error").parent().add("span", {"id": fieldErrorId, "class": "extform-errormessage"}).html(text);
				
				field.onfocus(function() {
					if(this.value != "") { 
						var node = Js(this).removeClass("extform-error");
						var errorNode = node.siblings("span.extform-errormessage").first();
						
						if(errorNode.count() == 1) {
							Js.dom.remove(errorNode.fetch());
						}
					}
				});
			} else if (Jrun.finds(fieldErrorId) && !!data) {
				field.appendClass("extform-error");
				var errorNode = field.siblings("span.extform-errormessage").first();
				var html = errorNode.html();
				
				if (html.match(text) === false && Jrun.trim(html) != "") {
					errorNode.append(" " + text);
				}
				
				field.onfocus(function() {
					if (this.value != "") {
						var node = Js(this).removeClass("extform-error");
						var errorNode = node.siblings("span.extform-errormessage").first();
						
						if(errorNode.count() == 1) {
							Js.dom.remove(errorNode.fetch());
						}
						
					}
				});
			}
		},
		validate: function(node, custom) {
			this.object = Jrun.pick(node, this.object);
			
			var formId = Js.attr.get(this.object, "id");
			var custom = Jrun.pick(custom, null);
			var post = "";
			
			this.first = null;
			var that = this;
			
			if(!!this.object) {
				var field = Js("#" + formId + " :input");
				field.each(function() {
					var errorNode = Js(this).siblings("span.extform-errormessage").first();
					if(errorNode.count() == 1) {
						Js.dom.remove(errorNode.fetch());
					}
					
					if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/g)) {
						if(this.name != "") {
							this.className = (Jrun.isset(this.className) ? this.className : "");
							var klass = this.className.split(/\s/);
							var error = "";
													
							if(Jrun.inArray(klass, "required") && Jrun.trim(this.value) === "") {
								error = "This field require an input!";
							}
							
							if(Jrun.inArray(klass, "string") && !Js.test.isString(this.value) && Jrun.trim(this.value) !== "") {
								error = "This field require valid alphanumeric!";
							} else if((Jrun.inArray(klass, "integer") || Jrun.inArray(klass, "number")) && !Js.test.isInteger(this.value) && Jrun.trim(this.value) !== "") { 
								error = "This field require valid numbers!";
							} else if(Jrun.inArray(klass, "email") && !Js.test.isEmail(this.value) && Jrun.trim(this.value) !== "") {
								error = "This field require valid e-mail address!";
							}
							
							if(Jrun.isset(custom)) {
								var validate = custom[Js.attr.get(this, "id")];
								
								if(Jrun.isset(validate)) {
									if(Jrun.isfunction(validate.callback) && !validate.callback(this.value)) {
										error = Jrun.pick(validate.error, error);
									} else if(Jrun.isset(validate.test) && !this.value.match(validate.test)) {
										error = Jrun.pick(validate.error, error);
									} else {
										error = Jrun.pick(validate.error, error);
									}
								}
							}
							
							if(error !== "") {
								that.errorInit(this, error);
							} else {
								Js.className.remove(this, "extform-error");
								var errorObject = Js(this).siblings("span.extform-errormessage").first();
								
								if(errorObject.count() == 1) {
									Js.dom.remove(errorObject.fetch());	
								}
							}
							
							for(var i = 0; i < klass.length; i++) {
								if(klass[i].match(/(max|min|exact)\-(\d*)/)) {
									if(!Js.test.isLength(klass[i], this.value.length)) {
										var error = klass[i].split(/\-/);
										that.errorInit(this, "This field require " + error[0] + " of " + error[1] + " characters.", true);
									}
								}
							}
							
							// dump name and value to opt in querystring format ( &name=value )
							if(this.type.toLowerCase().match(/^(checkbox|radio)$/)) {
								if(this.type == "checkbox" && this.checked == true) {
									// only add checked checkbox input
									post += "&" + this.name + "=" + Js.parse.html.to(this.value);
								} else if (this.type == "radio" && this.checked == true) {
									// only add checked radiobox input
									post += "&" + this.name + "=" + Js.parse.html.to(this.value);
								}
							} else { 
								// add all input (except radio/checkbox)
								post += "&" + this.name + "=" + Js.parse.html.to(this.value);
							}
						}
					}
				});
			}
			alert(this.first);
			if(Jrun.isset(this.first)) { 
				// there an error, set focus to first invalid field
				this.first.focus();
				// stop form processing
				return false;
			} else {
				return post; // return all field data in querystring formatting
			}
		},
		errorInit: function(field, text, data) {
			// Mark first error occured!
			this.first = (Jrun.isnull(this.first) ? field : this.first);
			
			var field = Js(field);
			var form = Js(this.object);
			var fieldName = field.get("name");
			var fieldErrorId = [form.get("id"), fieldName, "error"].join("-");
			var data = Jrun.pick(data, false);
			var that = this;
			
			if(!Jrun.finds(fieldErrorId)) {
				field.appendClass("jsextform-error").parent().add("span", {"id": fieldErrorId, "class": "extform-errormessage"}).html(text);
				
				field.onchange(function() {
					if(this.value != "") { 
						var node = Js(this).removeClass("extform-error");
						
						var errorNode = node.siblings("span.extform-errormessage").first();
						if(errorNode.count() == 1) {
							Js.dom.remove(errorNode.fetch());
						}
						that.first = null;
					}
				});
			} else if(Jrun.finds(fieldErrorId) && !!data) {
				field.appendClass("extform-error");
				var errorNode = field.siblings("span.extform-errormessage").first();
				var html = errorNode.html();
				
				if(html.match(text) === false && Jrun.trim(html) != "") {
					errorNode.append(text);
				}
				
				field.onchange(function() {
					if(this.value != "") {
						var node = Js(this).removeClass("extform-error");
						
						var errorNode = node.siblings("span.extform-errormessage").first();
						
						if(errorNode.count() == 1) {
							Js.dom.remove(errorNode.fetch());
						}
						
						that.first = null;
					}
				});
			}
		},
		post: function(js) {
			// form object
			var object = Jrun.pick(js.object, js.node);
			// choose to use object
			var node = Jrun.prepare(object, js.element, "object");
			// add custom field validation
			var custom = Jrun.pick(js.custom, null);
			// onsuccess function
			var onInit = Jrun.pick(js.onSuccess, js.onStart, null);
			// onfaild function
			var onFail = Jrun.pick(js.onFail, null);
			// validate selected form
			var post = this.validate(node, custom);
			// parameters
			var parameter = Jrun.pick(js.parameters, js.params, "");
			
			if(post) {
				// callback to onsuccess function
				if(Jrun.isfunction(onInit)) {
					onInit();
				}
				
				parameter += (Jrun.trim(post) !== "" ? post : "");
				
				// send XHR request
				new Js.ext.Ajax({
					parameters: parameter,
					uri: js.uri,
					method: "POST"
				});
				
				return true;
			} else {
				// callback to onfail function
				if(Jrun.isfunction(onFail)) {
					onFail();
				}
				return false;
			}
		},
		get: function(js) {
			// form object
			var object = Jrun.pick(js.object, js.node);
			// choose to use object
			var node = Jrun.prepare(object, js.element, "object");
			// add custom field validation
			var custom = Jrun.pick(js.custom, null);
			// onsuccess function
			var onInit = Jrun.pick(js.onSuccess, js.onStart, null);
			// onfaild function
			var onFail = Jrun.pick(js.onFail, null);
			// validate selected form
			var get = this.validate(node, custom);
			// parameters
			var parameter = Jrun.pick(js.parameters, js.params, "");
			
			if(get) {
				// callback to onsuccess function
				if(Jrun.isfunction(onInit)) {
					onInit();
				}
				
				parameter += (Jrun.trim(get) !== "" ? post : "");
				
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
				if(Jrun.isfunction(onFail)) {
					onFail();
				}
				return false;
			}
		}
	}
});

Js.namespace.include({
	name: "Form",
	object: Js.ext.Form
});

Js.ext.include({
	name: "formErrorMessage", 
	object: {
		required: "",
		email: "",
		string: "",
		number: ""
	}
});
