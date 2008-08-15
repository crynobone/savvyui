Js.namespace.include("number", Js.base.create({
	ext: Number.prototype,
	value: null,
	__construct: function(value) {
		this._super = value;
		this.value = this._super;
		return this;
	},
	exec: function(data, args) {
		var args = Js.code.toArray(arguments, 1);
		var value = this._super;
		value = new Number(value);
		value = value[data].apply(value, args);
		this.value = this._super = value;
		return this;
	}
}));