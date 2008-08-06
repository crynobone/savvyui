SUI.namespace.include("array", SUI.JsClass.create({
	ext: Array.prototype,
	__construct: function(s) {
		this._super = s;
		this.value = this._super;
		return this;
	},
	exec: function(m, arg) {
		var args = SUI.fn.toArray(arguments, 1);
		var s = this._super;
		s = new Array(s);
		s = s[m].apply(s, args);
		this._super = s;
		return this;
	},
	append: function(value) {
		var len = this._super.length;
		this._super[len] = value;
	}
}));
