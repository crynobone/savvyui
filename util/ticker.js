/* Checkbox Ticker for Savvy.UI
 * version: 0.1.2
 */

Js.util.ticker = Js.create({
	element: null,
	node: null,
	
	initiate: function( selector ) {
		return ( Jrun.isset(selector) ? this.init( selector ) : this );
	},
	
	init: function( selector ) {
		this.element = Jrun.pick( selector, null );
		
		if ( Jrun.isset(this.element) ) { 
			this.node = Js.use( this.element );
		}
		
		return this;
	},
	
	tick: function() {
		this.node.each(function( i, v ) {
			// set checked to true
			v.checked = true;
		});
	},
	
	untick: function() {
		this.node.each(function( i, v ) { 
			// set checked to false
			v.checked = false;
		});
	},
	
	invert: function() {
		this.node.each(function( i, v ) {
			// reverse checkbox selection
			v.checked = !v.checked;
		});
	}
});