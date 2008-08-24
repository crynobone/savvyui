Js.namespace.include({
	name: "string", 
	object: Js.base.create({
		ext: String.prototype,
		value: null,
		__construct: function(value) {
			this.value = this._super = value;
			return this;
		},
		exec: function(data, args) {
			var args = Js.code.toArray(arguments, 1);
			var value = this._super;
			value = new String(value);
			value = value[data].call(value, args);
			this.value = this._super = value;
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
	})
})
