/* Smart Input Field for Savvy.UI
 * version: 0.0.2
 */

Js.util.smartInput = Js.create({
	node: null,
	element: null,
	
	initiate: function( elem ) {
		return ( Jrun.isset(elem) ? this.init( elem ) : this );
	},
	
	init: function( elem ) {
		this.element = Jrun.pick( elem, this.elem );
		this.node = Js.use( this.element );
		
		this.activate();
		
		return this;
	},
	
	activate: function() {	
		this.node.bind( "blur", function() {
			var node = Js.use( this );
			
			if ( Jrun.trim( node.val() ) === "" ) 
				node.val( node.attr("title").toString() );
			
		}).bind( "focus", function() {
			var node = Js.use(this);
			
			if ( node.attr( "title" ) == node.val() )  
				node.val("");
			
		}).val( this.node.attr("title").toString() );
	},
	
	deactivate: function() {
		this.node.unbind( "blur", function() {
			var node = Js.use( this );
			
			if ( Jrun.trim( node.val() ) === "" ) 
				node.val( node.attr("title").toString() );
			
		}).unbind( "focus", function() {
			var node = Js.use( this );
			
			if ( node.attr( "title" ) == node.val() ) 
				node.val("");
			
		});
	}
});