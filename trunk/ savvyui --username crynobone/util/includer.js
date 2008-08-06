SUI.Util.include("Includer", {
	Script: function(src) {
		var head = SUI.Query.tags("head")[0];
		var script = SUI.Query.create("script", {
			"type": "text/javascript",
			"src": src
		});
		SUI.DOM.Add(head, script);
	},
	Style: function(src, media) {
		var head = SUI.Query.tags("head")[0];
		var style = SUI.Query.create("link", {
			"type": "text/css",
			"href": src,
			"media": media
		});
		SUI.DOM.Add(head, style);
	}
});