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
SUI.Tool.include("Debugger", function() {
	SUI.fn.debug = true;
	var div = SUI.Query.create("div#sui-debugger");
	SUI.DOM.Add(div);
		
	var object = SUI.Query.create("ul");
	SUI.DOM.Add(div, object);
	SUI.CSS.Hide(object);
	SUI.fn.logobject = object;
	SUI.fn.logger = function(text) {
		var text = SUI.fn.trim(text);
		SUI.fn.logs.push(text);
		
		try {
			console.log(text);	
		} catch(e) { 
			// do nothing
		}
		var li = SUI.Query.create("li", SUI.fn.logobject);
		SUI.DOM.AddText(li, text);
		SUI.DOM.Add(object, li);
		
		if(!!SUI.Widget.Message) {
			SUI.Widget.Message.Add({text: text, type: "error"});	
		}
	};
});SUI.namespace.include("number", SUI.JsClass.create({
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
}));SUI.namespace.include("string", SUI.JsClass.create({
	ext: String.prototype,
	value: null,
	__construct: function(s) {
		var that = this;
		this.value = this._super = s;
		return this;
	},
	exec: function(m, args) {
		var args = SUI.fn.toArray(arguments, 1);
		var s = this._super;
		s = new String(s);
		s = s[m].call(s, args);
		this.value = this._super = s;
		return this;
	},
	trim: function() {
		this.value = this._super = SUI.fn.trim(this._super);
		return this;
	},
	htmlEntities: function() {
		this.value = this._super = SUI.fn.htmlEntities(this._super);
		return this;
	},
	stripTags: function () {
		this.value = this._super = SUI.fn.stripTags(this._super);
		return this;
	}
}));

/*
['charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search', 'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase', 'valueOf']
*/