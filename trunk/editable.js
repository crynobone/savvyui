Js.util.editable = Js.base.create({
	object: null,
	selector: null,
	value: "Other",
	defaults: "",
	message: "Please enter a new option value...",
	__construct: function() {
		return this;
	},
	init: function(selector) {
		var that = this;
		
		this.selector = Jrun.pick(this.selector, selector);
		this.object = jQuery(this.selector);
		
		var option = this.object.children("option").val();
		
		this.object.change(function() {
			var object = jQuery(this);
			
			if(object.val() == that.value) {
				var wprompt = window.prompt(that.getMessage(), that.defaults.toString());
				if(!!wprompt && !Jrun.inArray(option, wprompt)) {
					jQuery("<option value='" + wprompt + "' selected='selected'></option>").text(wprompt);
				} else {
					object.options[0].selected = true;
				}
			}
		});
	},
	getMessage: function() {
		return this.message;	
	}
});
