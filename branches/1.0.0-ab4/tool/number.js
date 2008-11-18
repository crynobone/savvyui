Js.namespace.include({
	name: "number", 
	object: Js.base.create({
		ext: Number.prototype,
		value: null,
		__construct: function(value) {
			this._super = value;
			this.value = this._super;
			return this;
		},
		exec: function(data, args) {
			var args = Jrun.toArray(arguments, 1);
			var value = this._super;
			value = new Number(value);
			value = value[data].apply(value, args);
			this.value = this._super = value;
			return this;
		}
	})
});