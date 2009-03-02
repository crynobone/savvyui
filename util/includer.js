/**
 * @projectDescription Includer for Savvy.UI
 * @version 0.0.5
 * @memberOf Js.util
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.util.includer = { 
	script: function(src) {
		var script = Js.use("<script/>").attr({
			"type": "text/javascript",
			"src": src
		}).appendTo("head");
		
		return script;
	},
	style: function(src, media) {
		var media = Js.pickGrep(media, "all", /^(all|print|screen|handheld)$/i);
		var style = Js.use("<link/>").attr({
			"type": "text/css",
			"href": src,
			"media": media
		}).appendTo("head");
		
		return style;
	}
};