/* Checkbox Ticker for Savvy.UI
 * version: 0.1.2
 */

Js.util.ticker = Js.create({
	element: null,
	node: null,
	
	initiate: function( element ) {
		return ( Js.helper.isset( element ) ? this.init( element ) : this );
	},
	
	init: function( element ) {
		this.element = Js.helper.pick( element, null );
		
		if ( Js.helper.isset( this.element ) ) 
			this.node = Js.$( this.element );
		
		return this;
	},
	
	tick: function() {
		// set checked to true
		this.node.each( function() {
			this.checked = true;
		} );
	},
	
	untick: function() {
		// set checked to false
		this.node.each( function() { 
			this.checked = false;
		} );
	},
	
	invert: function() {
		// reverse checkbox selection
		this.node.each( function() {
			this.checked = !this.checked;
		} );
	}
});