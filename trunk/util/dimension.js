/* Dimension detection for Savvy.UI
 * version: 0.6.2
 */

Js.util.dimension = {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function() {
				var doc = document.body;
				var result = 0;
				var offset = window.pageXOffset;
				var elem = document.documentElement;
				
				if ( typeof( offset ) == 'number' ) 
					result = offset;
				
				else if ( doc && doc.scrollLeft ) 
					result = doc.scrollLeft;
				
				else if ( elem && elem.scrollLeft ) 
					result = elem.scrollLeft;
				
				return result;
			},
			
			y: function() {
				var doc = document.body;
				var result = 0;
				var offset = window.pageYOffset;
				var elem = document.documentElement;
				
				if ( typeof( offset ) == 'number' ) 
					result = offset;
				
				else if ( doc && doc.scrollTop ) 
					result = doc.scrollTop;
				
				else if ( elem && elem.scrollTop ) 
					result = elem.scrollTop;
				
				return result;
			},
			
			both: function() {
				var that = Js.util.dimension.page.scrolls;
				return [
					that.x(), 
					that.y()
				];
			}
		},
		
		middle: function( weight, height ) {
			var doc = document.body,
				offset = [ Js.$( window ).width(), Js.$( window ).height() ],
				locate = Js.util.dimension.page.scrolls.both();
			
			var result = [
				Math.round( ( ( offset[0] - weight ) / 2 ) + locate[0] ),
				Math.round( ( ( offset[1] - height ) / 2 ) + locate[1] )
			];
			
			result[0] = ( result[0] < 0 ? 0 : result[0] );
			result[1] = ( result[1] < 0 ? 0 : result[1] );
				
			return result.reverse();
		}
	},
	
	node: {
		scrolls: {},
		size: {},
		
		offset: function( node ) {
			var result = [0, 0, 0, 0];
			var loop = false;
			
			if ( Jrun.isset( node ) ) {
				if ( node.offsetParent ) {
					loop = true;
					result[0] = node.offsetWidth;
					result[1] = node.offsetHeight;
					
					while ( node.offsetParent ) {
						result[2] += node.offsetTop;
						result[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				}
				else {
					if ( loop == false ) {
						result[0] = Js.on.pick( node.scrollWidth, 0 );
						result[1] = Js.on.pick( node.scrollHeight, 0 );
						result[2] = Js.on.pick( node.offsetTop, 0 );
						result[3] = Js.on.pick( node.offsetLeft, 0 );
					}
				}
				
				return result;
			}
			else 
				Js.debug.log('Js.util.dimension.node.offset: failed because node does not exist');
		}
	}
};