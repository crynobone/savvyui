Js.ext.form = function() {
	this.first = null;
	this.object = null;
	return this;
};
Js.ext.form.prototype = {
	validate: function(node, custom) {
		this.object = jQuery(node);
		
		var formId = this.object.attr("id");
		var custom = custom || null;
		var post = "";
		
		this.first = null;
		var that = this;
		
		if(!!this.object) {
			jQuery(":input", this.object).each(function() {
				var errorNode = jQuery(this).siblings("span.extform-errormessage").eq(0);
				if(errorNode.length == 1) {
					errorNode.remove();
				}
				
				if(this.tagName.toLowerCase().match(/^(input|select|textarea)$/g)) {
					if(this.name != "") {
						this.className = (!!this.className ? this.className : "");
						var klass = this.className.split(/\s/);
						var error = "";
						
						if(jQuery.inArray("required", klass) != -1 && jQuery.trim(this.value) === "") {
							error = "This field require an input!";
						}
						
						if(jQuery.inArray("string", klass) != -1 && !Js.test.isString(this.value) && jQuery.trim(this.value) !== "") {
							error = "This field require valid alphanumeric!";
						} else if((jQuery.inArray("integer", klass) != -1 || jQuery.inArray("number", klass) != -1) && !Js.test.isInteger(this.value) && jQuery.trim(this.value) !== "") { 
							error = "This field require valid numbers!";
						} else if(jQuery.inArray("email", klass) != -1 && !Js.test.isEmail(this.value) && jQuery.trim(this.value) !== "") {
							error = "This field require valid e-mail address!";
						}
						
						if(Jrun.isset(custom)) {
							var validate = custom[jQuery(this).attr("id")];
							
							if(Jrun.isset(validate)) {
								if(jQuery.isFunction(validate.callback) && !validate.callback(this.value)) {
									error = validate.error || error;
								} else if(validate.test && !this.value.match(validate.test)) {
									error = validate.error || error;
								}
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
						
						if(error !== "") {
							that.errorInit(this, error);
						} else {
							jQuery(this).removeClass("extform-error");
							var errorObject = jQuery(this).siblings("span.extform-errormessage").eq(0);
							if(errorObject.length == 1) {
								errorObject.remove();
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
		
		var field = jQuery(field);
		var form = jQuery(this.object);
		var fieldName = field.attr("name");
		var fieldErrorId = [form.attr("id"), fieldName, "error"].join("-");
		var data = data || false;
		var that = this;
		
		if(jQuery("#" + fieldErrorId).length == 0) {
			field.addClass("jsextform-error");
			jQuery('<span/>').attr({id: fieldErrorId, className: "extform-errormessage"}).html(text).appendTo(field.parent());
			
			field.change(function() {
				if(jQuery(this).val() != "") { 
					var node = jQuery(this).removeClass("extform-error");
					
					var errorNode = node.siblings("span.extform-errormessage").eq(0);
					if(errorNode.length == 1) {
						errorNode.remove();
					}
					that.first = null;
				}
			});
		} else if(jQuery("#" + fieldErrorId).length == 1 && !!data) {
			field.addClass("extform-error");
			var errorNode = field.siblings("span.extform-errormessage").eq(0);
			var html = errorNode.html();
			
			if(html.match(text) === false && jQuery.trim(html) != "") {
				errorNode.append(text);
			}
			
			field.change(function() {
				if(jQuery(this).val() != "") {
					var node = jQuery(this).removeClass("extform-error");
					
					var errorNode = node.siblings("span.extform-errormessage").eq(0);
					
					if(errorNode.length == 1) {
						errorNode.remove();
					}
					
					that.first = null;
				}
			});
		}
	}
};
