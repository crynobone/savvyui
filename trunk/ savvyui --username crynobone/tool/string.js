Js.namespace.include("string", Js.base.create({
	ext: String.prototype,
	value: null,
	__construct: function(s) {
		var that = this;
		this.value = this._super = s;
		return this;
	},
	exec: function(m, args) {
		var args = Js.code.toArray(arguments, 1);
		var s = this._super;
		s = new String(s);
		s = s[m].call(s, args);
		this.value = this._super = s;
		return this;
	},
	trim: function() {
		this.value = this._super = Js.code.trim(this._super);
		return this;
	},
	htmlEntities: function() {
		this.value = this._super = Js.code.htmlEntities(this._super);
		return this;
	},
	stripTags: function () {
		this.value = this._super = Js.code.stripTags(this._super);
		return this;
	}
}));

/*
['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']
*/