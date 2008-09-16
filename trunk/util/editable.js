Js.util.include({
	name: "Editable",
	object: Js.base.create({
		object: null,
		selector: null,
		value: null,
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
					var winprompt = window.prompt(that.message.toString(), that.defaults.toString());
					if(!!winprompt && Jrun.inArray(option, winprompt)) {
						object.add("option", {"value": winprompt, "selected": "selected"}).text(winprompt);
					} else {
						object.fetch().options[0].selected = true;
					}
				}
			});
		}
	});
});