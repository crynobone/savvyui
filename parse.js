/* Parser Engine for Savvy.UI
 * version: 1.0.3
 */

Js.parse = {
	html: {
		to: function( r ) {
			return encodeURIComponent( Jrun.htmlEncode( new String(r) ) );
		},
		
		from: function( r ) {
			return Jrun.htmlDecode( decodeURIComponent( new String(r) ) );
		}
	},
	
	xhr: {
		init: function( v ) {
			var that = Js.parse.xhr;
			var dt = eval( "(" + v + ")" );
			
			Js.debug.log( "XHR: " + v );
			
			if ( Jrun.typeOf(dt) == "object" ) {
				if ( !!dt.SUIXHR ) {
					that.notice( dt );
					that.href( dt );
					that.update( dt );
				}
			}
		},
		
		notice: function( dt ) {
			var v = Jrun.pickType( dt.notice, "string" );
			
			if ( Jrun.isset(v) && v !== "" ) {
				window.alert( v );
				
				try {
					console.log( v );
				} catch(e) { }
			}
		},
		href: function( dt ) {
			var h = Jrun.pickGrep( dt.href, /^https?:\/\//g );
			var x = Jrun.pickGrep( dt.xhref, /^https?:\/\//g );
			
			if ( Jrun.isset(x) && x !== "" ) 
				Jrun.href( x, "_blank" );
			
			else if ( Jrun.isset(h) && h !== "" ) 
				Jrun.href( h );
		},
		
		update: function( dt ) {
			var args = Jrun.pick( dt.text );
			var id = Jrun.pickType( dt.id, "string" );
			var el = Jrun.pickType( dt.selector, "string" );
			var fn = Jrun.pickType( dt.callback, "string" );
			
			if ( Jrun.typeOf( args ) == "string" ) {
				if ( !!el ) 
					Js.use( el ).html( args );
				else if ( !!id ) 
					Js.use("#" + id).html( args );
			}
			else if ( Jrun.isset( fn ) ) {
				// eval the function without making a callback
				var fn = eval( fn );
					
				// execute the function
				if ( Jrun.isfunction(fn) ) 
					fn( args );
			}
		}
	}
};
