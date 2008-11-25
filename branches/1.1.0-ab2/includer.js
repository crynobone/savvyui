Js.util.includer = {
	script: function(src) {
		jQuery("<script/>").attr({
			"type": "text/javascript",
			"src": src
		}).appendTo("head");
	},
	style: function(src, media) {
		var style = jQuery("<link/>").attr({
			"type": "text/css",
			"href": src,
			"media": media
		}).appendTo("head");
	}
};