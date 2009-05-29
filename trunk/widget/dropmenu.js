/* Dropdown Menu for Savvy.UI
 * version: 0.0.2
 */

Js.widget.dropmenu = Js.create({
	node: null,
	element: null,
	setting: null,
	
	initiate: function( element, option ) {
		var that = this,
			prepare = function( element, option ) {
				that.element = element;
				that.init( option );
			};
		
		if ( Js.helper.isset( element ) ) 
			prepare( element, option );
			
		return this;
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) ) 
			this.setting = Js.append( option, this.setting );
			
		return this;
	},
	
	init: function( element, option ) {
		var that = this;
		
		this.element = Js.helper.pick( element, this.element );
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget.dropmenu );
		this.node = Js.$( this.element );
		
		if ( this.node.size() > 0 ) {
			
			Js.$( 'ul, li', this.node[0] ).hover( function() {
				that._show( this );
			}, function() {
				that._hide( this );
			});
			
			Js.$( 'li', this.node[0] ).hover( function() { 
				Js.$( this ).addClass( 'hover' ); 
				Js.$( '> a', this ).addClass( 'hover' ); 
			}, function() { 
				Js.$( this ).removeClass( 'hover' );
				Js.$( '> a', this ).removeClass( 'hover' ); 
			});
		}
		else 
			Js.debug.error( 'Js.widget.dropdown: No elements found' );
		
		return this;
	},
	
	_show: function( element ) {
		var child = this._getChild( element ),
			option = this.setting;
		
		if ( !child ) 
			return false;
		
		Js.$( child )
			.data( 'cancelHide', true )
			.css( 'zIndex', option.zIndex++ )
			.fadeIn( option.speed )
			.slideDown( option.speed );
		
		if ( element.nodeName.toLowerCase() == 'ul' ) {
			var li = this._getPosition( element );
			Js.$( li ).addClass( 'hover' );
			Js.$( '> a', li ).addClass( 'hover' );
		}
	},
	
	_hide: function( element ) {
		var that = this,
			child = this._getChild( element );
		
		if ( !child )
			return false;
			
		var node = Js.$( child )
			.data( 'cancelHide', false );
		
		setTimeout( function() {
			if( !node.data( 'cancelHide' ) ) 
				node.slideUp( that.setting.speed );
		}, 200);
	},
	
	_getChild: function( element ) {
		if ( element.nodeName.toLowerCase() == 'li' ) {
			var child = Js.$( '> ul', element );
			return child.size() > 0 ? child[0] : null ;
		}
		else 
			return element;
	},
	
	_getPosition: function( element ) {
		return ( element.nodeName.toLowerCase() == 'ul' ? Js.$( element ).parents( 'li' )[0] : element );
	}
});
