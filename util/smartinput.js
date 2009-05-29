/* Smart Input Field for Savvy.UI
 * version: 0.0.2
 */

Js.util.smartInput = Js.create({
	node: null,
	element: null,
	
	initiate: function( elem ) {
		var that = this,
			on_blur = function() {
				var node = Js.$(this);
				if ( Js.on.trim( node.val() ) === '' ) 
					node.val( node.attr( 'title' ).toString() );
			},
			on_focus = function() {
				var node = Js.$(this);
				
				if ( node.attr( 'title' ) == node.val() )  
					node.val('');
			};
			
		this.element = null;
		this.node = null;
		this.init = function( elem ) {
			var that = that;
			that.element = Js.on.pick( elem, that.element );
			that.node = Js.$( that.element );
			that.activate( on_blur, on_focus );
		};
		
		if ( Js.on.isset( elem ) ) 
			this.init( elem );
		
		return this;
	},
	
	init: function( elem ) {
		var that = this;
		this.element = Js.on.pick( elem, this.elem );
		this.node = Js.$( this.element );
		
		var on_blur = function() {
			var node = Js.$(this);
			if ( Js.on.trim( node.val() ) === '' ) 
				node.val( node.attr( 'title' ).toString() );
		};
		var on_focus = function() {
			var node = Js.$(this);
			
			if ( node.attr( 'title' ) == node.val() )  
				node.val('');
		};
		
		this.activate( on_blur, on_focus );
		
		return this;
	},
	
	activate: function() {	
		this.node
			.bind( 'blur', on_blur )
			.bind( 'focus', on_focus )
			.val( this.node.attr( 'title' ).toString() );
	},
	
	deactivate: function() {
		this.node.unbind( "blur", function() {
			var node = Js.use( this );
			
			if ( Js.on.trim( node.val() ) === "" ) 
				node.val( node.attr("title").toString() );
			
		}).unbind( "focus", function() {
			var node = Js.use( this );
			
			if ( node.attr( "title" ) == node.val() ) 
				node.val("");
			
		});
	}
});