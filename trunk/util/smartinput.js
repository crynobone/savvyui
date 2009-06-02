/* Smart Input Field for Savvy.UI
 * version: 0.0.2
 */

Js.util.smartInput = Js.create({
	node: null,
	element: null,
	
	initiate: function( element ) {
		var that = this;
			
		this.element = null;
		this.node = null;
		
		if ( Js.helper.isset( element ) ) 
			this.init( element );
		
		return this;
	},
	
	init: function( element ) {
		var that = this;
		this.element = Js.helper.pick( element, this.element );
		this.node = Js.$( this.element );
		
		this.activate();
		
		return this;
	},
	
	activate: function() {	
		this.node
			.bind( 'blur', function() {
				var node = Js.$( this );
				
				if ( Js.helper.trim( node.val() ) === '' ) 
					node.val( node.attr( 'title' ).toString() );
				
			})
			.bind( 'focus', function() {
				var node = Js.$( this );
				
				if ( node.attr( 'title' ) == node.val() ) 
					node.val('');
			})
			.val( this.node.attr( 'title' ).toString() );
	},
	
	deactivate: function() {
		this.node
			.unbind( 'blur', function() {
				var node = Js.$( this );
				
				if ( Js.helper.trim( node.val() ) === '' ) 
					node.val( node.attr( 'title' ).toString() );
				
			}).unbind( 'focus', function() {
				var node = Js.$( this );
				
				if ( node.attr( 'title' ) == node.val() ) 
					node.val('');
				
			});
	}
});