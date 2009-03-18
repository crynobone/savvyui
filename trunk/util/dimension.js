/* Dimension detection for Savvy.UI
 * version: 0.6.2
 */

Js.util.dimension = {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function() {
				var d = document.body;
				var r = 0;
				var off = window.pageXOffset;
				var el = document.documentElement;
				
				if ( typeof(off) == "number" ) 
					r = off;
				
				else if ( d && d.scrollLeft ) 
					r = d.scrollLeft;
				
				else if ( el && el.scrollLeft ) 
					r = el.scrollLeft;
				
				return r;
			},
			
			y: function() {
				var d = document.body;
				var r = 0;
				var off = window.pageYOffset;
				var el = document.documentElement;
				
				if ( typeof(off) == "number" ) 
					r = off;
				
				else if ( d && d.scrollTop ) 
					r = d.scrollTop;
				
				else if ( el && el.scrollTop ) 
					r = el.scrollTop;
				
				return r;
			},
			
			both: function() {
				var that = Js.util.dimension.page.scrolls;
				return [
					that.x(), 
					that.y()
				];
			}
		},
		
		middle: function( w, h ) {
			var d = document.body;
			var off = [Js.use(window).width(), Js.use(window).height()];
			var a = Js.util.dimension.page.scrolls.both();
			var r = [];
					
			r[0] = Math.round( ((off[0] - w) / 2) + a[0] );
			r[1] = Math.round( ((off[1] - h) / 2) + a[1] ); 
			
			r[0] = ( r[0] < 0 ? 0 : r[0] );
			r[1] = ( r[1] < 0 ? 0 : r[1] );
				
			return r.reverse();
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
			else 
				Js.debug.log("Js.util.dimension.node.offset: failed because node does not exist");
		}
	}
};