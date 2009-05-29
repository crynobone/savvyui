/* Parser Engine for Savvy.UI
 * version: 1.0.3
 */

Js.parse = {
	html: {
		to: function( text ) {
			return encodeURIComponent( Js.on.htmlEncode( new String( text ) ) );
		},
		
		from: function( text ) {
			return Js.on.htmlDecode( decodeURIComponent( new String( text ) ) );
		}
	},
	
	xhr: {
		init: function( json ) {
			var that = Js.parse.xhr;
			var data = eval( '(' + json + ')' );
			
			Js.debug.log( 'XHR: ' + json );
			
			if ( Js.on.typeOf( data ) == 'object' ) {
				if ( !!data.SUIXHR ) {
					that.notice( data );
					that.href( data );
					that.update( data );
					
					return true;
				}
				else 
					return false;
			}
		},
		
		notice: function( data ) {
			var value = Js.on.pickType( data.notice, 'string' );
			
			if ( Js.on.isset(value) && value !== '' ) {
				window.alert( value );
				
				try {
					console.log( value );
				} catch(e) { }
			}
		},
		href: function( data ) {
			var href = Js.on.pickGrep( data.href, /^https?:\/\//g );
			var xhref = Js.on.pickGrep( data.xhref, /^https?:\/\//g );
			
			if ( Js.on.isset( xhref ) && xhref !== '' ) 
				Js.on.href( xhref, '_blank' );
			
			else if ( Js.on.isset( href ) && href !== '' ) 
				Js.on.href( href );
		},
		
		update: function( data ) {
			var args = Js.on.pick( data.text );
			var id = Js.on.pickType( data.id, 'string' );
			var el = Js.on.pickType( data.selector, 'string' );
			var fn = Js.on.pickType( data.callback, 'string' );
			
			if ( Js.on.typeOf( args ) == 'string' ) {
				if ( !!el ) 
					Js.$( el ).html( args );
				else if ( !!id ) 
					Js.$( '#' + id ).html( args );
			}
			else if ( Js.on.isset( fn ) ) {
				// eval the function without making a callback
				var fn = eval( fn );
				
				// execute the function
				if ( Js.on.isfunction( fn ) ) 
					fn( args );
			}
		}
	}
};
