/* Includer for Savvy.UI
 * version: 0.0.5
 */

Js.util.includer = { 
	script: function( uri ) {
		return Js.$( '<script/>' ).attr({
			'type': 'text/javascript',
			'src': uri
		}).appendTo( 'head' );
	},
	
	style: function( uri, media ) {
		var media = Js.on.pickGrep( media, "all", /^(all|print|screen|handheld)$/i );
		
		return Js.$( "<link/>" ).attr({
			'type': 'text/css',
			'href': uri,
			'media': media
		}).appendTo( 'head' );
	}
};