/* Dimension detection for Savvy.UI
 * version: 0.6.2
 */

Js.util.dimension = {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
				
				if ( typeof(offset) == "number" ) {
					ret = offset;
				} 
				else if ( doc && doc.scrollLeft ) {
					ret = doc.scrollLeft;
				} 
				else if ( el && el.scrollLeft ) {
					ret = el.scrollLeft;
				}
				return ret;
			},
			
			y: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if ( typeof(offset) == "number" ) {
					ret = offset;
				}
				else if ( doc && doc.scrollTop ) { 
					ret = doc.scrollLeft;
				}
				else if ( el && el.scrollTop ) {
					ret = el.scrollLeft;
				}
				
				return ret;
			},
			
			both: function() {
				var that = Js.util.dimension.page.scrolls;
				return [
					that.x(), 
					that.y()
				];
			}
		},
		
		middle: function( width, height ) {
			var doc = document.body;
			var offset = [Js.use(window).width(), Js.use(window).height()];
			var axis = Js.util.dimension.page.scrolls.both();
			var ret = [];
					
			ret[0] = Math.round( ((offset[0] - width) / 2) + axis[0] );
			ret[1] = Math.round( ((offset[1] - height) / 2) + axis[1] ); 
			
			ret[0] = ( ret[0] < 0 ? 0 : ret[0] );
			ret[1] = ( ret[1] < 0 ? 0 : ret[1] );
				
			return ret.reverse();
		}
	},
	
	node: {
		scrolls: {},
		size: {},
		
		offset: function( node ){
			var ret = [0, 0, 0, 0];
			var loop = false;
			
			if ( Jrun.isset(node) ) {
				if ( node.offsetParent ) {
					loop = true;
					ret[0] = node.offsetWidth;
					ret[1] = node.offsetHeight;
					
					while ( node.offsetParent ) {
						ret[2] += node.offsetTop;
						ret[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				}
				else {
					if ( loop == false ) {
						ret[0] = Jrun.pick( node.scrollWidth, 0 );
						ret[1] = Jrun.pick( node.scrollHeight, 0 );
						ret[2] = Jrun.pick( node.offsetTop, 0 );
						ret[3] = Jrun.pick( node.offsetLeft, 0 );
					}
				}
				
				return ret;
			}
			else {
				Js.debug.log("Js.util.dimension.node.offset: failed because node does not exist");
			}
		}
	}
};