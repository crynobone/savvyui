/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Ext.Form
 * Version: 0.7 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.coms
 * Licensed under the MIT License
 ***************************************************
 * Require: Savvy.Core/SUI
 */
 
SUI.Ext.include("Form");

SUI.Ext.Form = function() {
	this.first = null;
	this.object = null; 
};

SUI.Ext.Form.prototype = {
	LiveValidate: function(node, custom) {
		var node = this.object = SUI.fn.pick(node, this.object);
		var el = SUI.Attr.Get(node, "id");
		var custom = SUI.fn.pick(custom, null);
		var post = "";
		this.first = null;
		var that = this;
		
		if(!!node) {
			var inputs = SUI("#" + el + " :input");
			
			inputs.blurs(function() {
				if (this.tagName.toUpperCase().match(/^(INPUT|SELECT|TEXTAREA)$/)) {
					if (this.name != "") {
						this.className = (SUI.fn.isset(this.className) ? this.className : "");
						var cl = this.className.split(/\s/);
						var err = "";
						
						
						if (SUI.fn.inArray(cl, "required") && SUI.fn.trim(this.value) === "") 
							err = "This field require an input!";
						
						if (SUI.fn.inArray(cl, "string") && !SUI.Test.isString(this.value)) 
							err = "This field require valid alphanumeric!";
						else if (SUI.fn.inArray(cl, "integer") && !SUI.Test.isInteger(this.value)) 
							err = "This field require valid numbers!";
						else if (SUI.fn.inArray(cl, "email") && !SUI.Test.isEmail(this.value))
							err = "This field require valid e-mail address!";
						
						if(SUI.fn.inArray(cl, "custom") || SUI.fn.isset(custom)) {
							var id = SUI.Attr.Get(this, "id");
							if(SUI.fn.isset(custom[id])) {
								if(SUI.fn.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									if(!callback) 
										err = SUI.fn.pick(custom[id]['err'], err);
								} else if(SUI.fn.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									if(!test)
										err = SUI.fn.pick(custom[id]['err'], err);
								}
							}
						}
						
						if(err !== "")
							that.__LIVERROR__(node, this, err);
						else
							SUI.Classes.Remove(this, "sui-form-error");
						
						
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
			// there an error, set focus to first invalid field
			this.first.focus();
			// stop form processing
			return false;
		} else 
			return true; // return all field data in querystring formatting
	},
	__LIVERROR__: function(node, form, text, data) {
		// Mark first error occured!
		this.first = (SUI.fn.isnull(this.first) ? node : this.first);
		
		var form = SUI(form);
		var node = SUI(node);
		var el = form.get("name");
		var fid = [node.get("id"), el, "_error"].join("");
		var data = SUI.fn.pick(data, false);
		var that = this;
		
		if (!SUI.fn.finds(fid)) {
			var errnode = form.appendClass("sui-form-error").parent().insertion("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.focus(function() {
				var fobject = SUI(this);
				if (this.value != "") { 
					fobject.removeClass("sui-form-error");
					if (errnode.fetch()) { 
						SUI.DOM.Remove(errnode.fetch());
						errnode.done();
					}
					that.first = null;
				}
			});
		} else if (SUI.fn.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = SUI("#" + fid);
			ohtml = form.html();
			if (ohtml.match(text) === false && SUI.fn.trim(ohtml) != "") 
				errnode.append(text);
			
			form.focus(function() {
				if (this.value != "") {
					SUI(this).removeClass("sui-form-error");
					if (errnode.fetch()) { 
						SUI.DOM.Remove(errnode.fetch());
						errnode.done();
					}
					that.first = null;
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
						
						
						if (SUI.fn.inArray(cl, "required") && SUI.fn.trim(this.value) === "") 
							err = "This field require an input!";
						
						if (SUI.fn.inArray(cl, "string") && !SUI.Test.isString(this.value)) 
							err = "This field require valid alphanumeric!";
						else if (SUI.fn.inArray(cl, "integer") && !SUI.Test.isInteger(this.value)) 
							err = "This field require valid numbers!";
						else if (SUI.fn.inArray(cl, "email") && !SUI.Test.isEmail(this.value))
							err = "This field require valid e-mail address!";
						
						if(SUI.fn.inArray(cl, "custom") || SUI.fn.isset(custom)) {
							var id = SUI.Attr.Get(this, "id");
							if(SUI.fn.isset(custom[id])) {
								if(SUI.fn.isfunction(custom[id]['callback'])) {
									var callback = custom[id]['callback'](this.value);
									if(!callback) 
										err = SUI.fn.pick(custom[id]['err'], err);
								} else if(SUI.fn.isset(custom[id]['test'])) {
									var test = this.value.match(custom[id]['test']);
									if(!test)
										err = SUI.fn.pick(custom[id]['err'], err);
								}
							}
						}
						
						if(err !== "")
							that.__ERROR__(node, this, err);
						else
							SUI.Classes.Remove(this, "sui-form-error");
						
						
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
								post += "&" + this.name + "=" + this.value;
							// only add checked radiobox input
							else if (this.type == "radio" && this.checked == true) 
								post += "&" + this.name + "=" + this.value;
						} else 
							post += "&" + this.name + "=" + this.value;  // add all input (except radio/checkbox)
					}
				}
			});
		}
		
		if (SUI.fn.isset(this.first)) { 
			// there an error, set focus to first invalid field
			this.first.focus();
			// stop form processing
			return false;
		} else 
			return post; // return all field data in querystring formatting
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
			var errnode = form.appendClass("sui-form-error").parent().insertion("span", {"id": fid, "class": "form_error"}).html(text);
			
			form.changes(function() {
				var fobject = SUI(this);
				if (this.value != "") { 
					fobject.removeClass("sui-form-error");
					if (errnode.fetch()) {
						SUI.DOM.Remove(errnode.fetch());
						errnode.done();
					}
					that.first = null;
				}
			});
		} else if (SUI.fn.finds(fid) && data) {
			form.appendClass("sui-form-error");
			var errnode = SUI("#" + fid);
			ohtml = form.html();
			if (ohtml.match(text) === false && SUI.fn.trim(ohtml) != "") 
				errnode.append(text);
			
			form.changes(function() {
				if (this.value != "") {
					SUI(this).removeClass("sui-form-error");
					if (errnode.fetch()) {
						SUI.DOM.Remove(errnode.fetch());
						errnode.done();
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
			if (SUI.fn.isfunction(ifn)) 
				ifn();
			
			parameter = (SUI.fn.trim(parameter) !== "" ? [parameter, post].join("&") : parameter);
			
			// send XHR request
			new SUI.Ajax({
				parameters: parameter,
				uri: js.uri,
				method: "POST"
			});
			return true;
		} else {
			// callback to onfail function
			if (SUI.fn.isfunction(ffn)) 
				ffn();
			return false;
		}
	}
};

SUI.ns.include("SUI.Form");
SUI.Form = SUI.Ext.Form;