/* Dropdown Menu for Savvy.UI
 * version: 0.0.2
 */

Js.widget.dropmenu = Js.create({
	node: null,
	element: null,
	setting: null,
	
	initiate: function( elem, opt ) {
		var that = this;
		var prepare = function( elem, opt ) {
			that.element = elem;
			that.init( opt );
		};
		
		if ( Jrun.isset( elem ) ) 
			prepare( elem, opt );
			
		return this;
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf( opt, "object" ) ) 
			this.setting = Js.append( opt, this.setting );
			
		return this;
	},
	
	init: function( elem, opt ) {
		var that = this;
		
		this.element = Jrun.pick( elem, this.element );
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget.dropmenu );
		this.node = Js.use( this.element );
		
		if ( this.node.size() > 0 ) {
			
			Js.use( "ul, li", this.node[0] ).hover( function() {
				that._show( this );
			}, function(){
				that._hide( this );
			});
			
			Js.use( 'li', this.node[0] ).hover( function() { 
				Js.use( this ).addClass( 'hover' ); 
				Js.use( '> a', this ).addClass( 'hover' ); 
			}, function() { 
				Js.use( this ).removeClass( 'hover' );
				Js.use( '> a', this ).removeClass( 'hover' ); 
			});
		}
		else 
			Js.debug.error("Js.widget.dropdown: No elements found");
		
		return this;	
	},
	
	_show: function( el ) {
		var c = this._getChild( el );
		
		if ( !c ) 
			return false;
		
		Js.use( c )
			.data( 'cancelHide', true )
			.css( "zIndex", this.setting.zIndex++ )
			.fadeIn( this.setting.speed )
			.slideDown( this.setting.speed );
		
		if ( el.nodeName.toLowerCase() == "ul" ) {
			var li = this._getPosition( el );
			Js.use( li ).addClass( 'hover' );
			Js.use( '> a', li ).addClass( 'hover' );
		}
	},
	
	_hide: function( el ) {
		var that = this;
		
		var c = this._getChild( el );
		
		if ( !c )
			return false;
			
		var node = Js.use( c )
			.data( 'cancelHide', false );
		
		setTimeout( function() {
			if( !node.data( 'cancelHide' ) ) 
				node.slideUp( that.setting.speed );
		}, 200);
	},
	
	_getChild: function( el ) {
		if ( el.nodeName.toLowerCase() == "li" ) {
			var c = Js.use( "> ul", el );
			return c.size() > 0 ? c[0] : null ;
		}
		else 
			return el;
	},
	
	_getPosition: function( el ) {
		return ( el.nodeName.toLowerCase() == 'ul' ? Js.use( el ).parents( 'li' )[0] : el );
	}
});
