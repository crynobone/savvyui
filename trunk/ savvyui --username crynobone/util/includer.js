Js.util.include("includer", {
	script: function(src) {
		var head = Js.query.tags("head")[0];
		var script = Js.query.create("script", {
			"type": "text/javascript",
			"src": src
		});
		Js.dom.add(head, script);
	},
	style: function(src, media) {
		var head = Js.query.tags("head")[0];
		var style = Js.query.create("link", {
			"type": "text/css",
			"href": src,
			"media": media
		});
		Js.dom.add(head, style);
	}
});