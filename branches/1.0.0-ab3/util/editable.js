Js.util.include({
	name: "Editable",
	object: Js.base.create({
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
			this.object = Js(this.selector);
			
			var option = this.object.has("option").val();
			
			this.object.onchange(function() {
				var object = Js(this);
				
				if(object.val() == that.value) {
					var wprompt = window.prompt(that.getMessage(), that.defaults.toString());
					if(!!wprompt && !Jrun.inArray(option, wprompt)) {
						object.add("option", {"value": wprompt, "selected": "selected"}).text(wprompt);
					} else {
						object.fetch().options[0].selected = true;
					}
				}
			});
		},
		getMessage: function() {
			return this.message;	
		}
	})
});
