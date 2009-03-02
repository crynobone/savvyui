/* Includer for Savvy.UI
 * version: 0.0.5
 */

Js.util.includer = { 
	script: function( src ) {
		var node = Js.use( "<script/>" ).attr({
			"type": "text/javascript",
			"src": src
		}).appendTo( "head" );
		
		return node;
	},
	
	style: function( src, media ) {
		var media = Js.pickGrep(media, "all", /^(all|print|screen|handheld)$/i);
		var node = Js.use( "<link/>" ).attr({
			"type": "text/css",
			"href": src,
			"media": media
		}).appendTo( "head" );
		
		return node;
	}
};