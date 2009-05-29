/* Parser Engine for Savvy.UI
 * version: 1.0.3
 */

Js.parse = {
	html: {
		to: function( text ) {
			return encodeURIComponent( Js.helper.htmlEncode( new String( text ) ) );
		},
		
		from: function( text ) {
			return Js.helper.htmlDecode( decodeURIComponent( new String( text ) ) );
		}
	},
	
	xhr: {
		init: function( json ) {
			var that = Js.parse.xhr;
			var data = eval( '(' + json + ')' );
			
			Js.debug.log( 'XHR: ' + json );
			
			if ( Js.helper.typeOf( data ) == 'object' ) {
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
			var value = Js.helper.pickType( data.notice, 'string' );
			
			if ( Js.helper.isset(value) && value !== '' ) {
				window.alert( value );
				
				try {
					console.log( value );
				} catch(e) { }
			}
		},
		href: function( data ) {
			var href = Js.helper.pickGrep( data.href, /^https?:\/\//g );
			var xhref = Js.helper.pickGrep( data.xhref, /^https?:\/\//g );
			
			if ( Js.helper.isset( xhref ) && xhref !== '' ) 
				Js.helper.href( xhref, '_blank' );
			
			else if ( Js.helper.isset( href ) && href !== '' ) 
				Js.helper.href( href );
		},
		
		update: function( data ) {
			var args = Js.helper.pick( data.text );
			var identity = Js.helper.pickType( data.id, 'string' );
			var element = Js.helper.pickType( data.selector, 'string' );
			var callback = Js.helper.pickType( data.callback, 'string' );
			
			if ( Js.helper.typeOf( args ) == 'string' ) {
				if ( !!element ) 
					Js.$( element ).html( args );
				else if ( !!identity ) 
					Js.$( '#' + identity ).html( args );
			}
			else if ( Js.helper.isset( callback ) ) {
				// eval the function without making a callback
				var fn = eval( callback );
				
				// execute the function
				if ( Js.helper.isfunction( fn ) ) 
					fn( args );
			}
		}
	}
};
