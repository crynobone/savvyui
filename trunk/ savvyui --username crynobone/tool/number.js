SUI.namespace.include("number", SUI.JsClass.create({
	ext: Number.prototype,
	__construct: function(s) {
		this._super = s;
		this.value = this._super;
		return this;
	},
	exec: function(m, arg) {
		var args = SUI.fn.toArray(arguments, 1);
		var s = this._super;
		s = new Number(s);
		s = s[m].apply(s, args);
		this._super = s;
		return this;
	}
}));