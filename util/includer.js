/* Includer for Savvy.UI
 * version: 0.0.5
 */

Js.util.includer = { 
	script: function( s ) {
		return Js.use( "<script/>" ).attr({
			"type": "text/javascript",
			"src": s
		}).appendTo( "head" );
	},
	
	style: function( s, m ) {
		var m = Js.pickGrep( m, "all", /^(all|print|screen|handheld)$/i );
		return Js.use( "<link/>" ).attr({
			"type": "text/css",
			"href": s,
			"media": m
		}).appendTo( "head" );
	}
};