/* Parser Engine for Savvy.UI
 * version: 1.0.3
 */

Js.parse = {
	html: {
		to: function( data ) {
			var data = new String( data );
			data = Jrun.htmlEncode( data );
			data = encodeURIComponent( data );
			
			return data;
		},
		
		from: function( data ) {
			var data = new String( data);
			data = decodeURIComponent( data );
			data = Jrun.htmlDecode( data );
			
			return data;
		}
	},
	
	xhr: {
		init: function( reply ) {
			var that = Js.parse.xhr;
			var data = eval( "(" + reply + ")" );
			
			Js.debug.log( "XHR: " + reply );
			
			if ( Jrun.typeOf(data) == "object" ) {
				if ( !!data.SUIXHR ) {
					that.notice( data );
					that.href( data );
					that.update( data );
				}
			}
		},
		
		notice: function( data ) {
			var note = Jrun.pickType( data.notice, "string" );
			
			if ( Jrun.isset(note) && note !== "" ) {
				window.alert( note );
				
				if ( !!console ) 
					console.log( note );
			}
		},
		href: function( data ) {
			var href = Jrun.pickGrep( data.href, /^https?:\/\//g );
			var xhref = Jrun.pickGrep( data.xhref, /^https?:\/\//g );
			
			if ( Jrun.isset(xhref) && xhref !== "" ) 
				Jrun.href( xhref, "_blank" );
			
			else if ( Jrun.isset(href) && href !== "" ) 
				Jrun.href( href );
		},
		
		update: function( data ) {
			var args = Jrun.pickType( data.text, "string" );
			var id = Jrun.pickType( data.id, "string" );
			var selector = Jrun.pickType( selector, "string" );
			var object = Jrun.pickType( data.callback, null, "string" );
			
			if ( !!args ) {
				if( !!selector ) 
					Js.use( selector ).html( args );
				else if ( !!id ) 
					Js.use( "#" + id ).html( args );
				else if ( Jrun.isset(object) ) {
					// eval the function without making a callback
					var callback = eval( object );
					
					// execute the function
					if( Jrun.isfunction(callback) ) 
						callback(args);
				}
			}
		}
	}
};