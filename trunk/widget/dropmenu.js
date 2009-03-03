/* Dropdown Menu for Savvy.UI
 * version: 0.0.1
 */

Js.widget.dropmenu = Js.create({
	node: null,
	setting: null,
	
	initiate: function( selector, option ) {
		return ( Jrun.isset( selector ) ? this.init( selector ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
	},
	
	init: function( selector, option ) {
		var that = this;
		
		this.node = Js.use( selector ).addClass( this.setting.css );
		this.setup( option );
		
		Js.use( "ul, li", this.node[0] ).hover( function(){
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
		
		return this;	
	},
	
	_show: function( field ) {
		var child = this._getChild( field );
		
		if ( !child ) 
			return false;
		
		var node = Js.use( child )
			.data( 'cancelHide', true )
			.css( "zIndex", this.setting.zIndex++ )
			.fadeIn( this.setting.speed )
			.slideDown( this.setting.speed );
		
		if ( field.nodeName.toLowerCase() == "ul" ) {
			var li = this._getPosition( field );
			Js.use( li ).addClass( 'hover' );
			Js.use( '> a', li ).addClass( 'hover' );
		}
	},
	
	_hide: function( field ) {
		var that = this;
		
		var child = this._getChild( field );
		
		if ( !child )
			return false;
			
		var node = Js.use( child )
			.data( 'cancelHide', false );
		
		setTimeout( function() {
			if( !node.data( 'cancelHide' ) ) {
				node.slideUp( that.setting.speed );
			}
		}, 200);
	},
	
	_getChild: function( field ) {
		if ( field.nodeName.toLowerCase() == "li" ) {
			var child = Js.use( "> ul", field );
			return child.size() > 0 ? child[0] : null ;
		}
		else 
			return field;
	},
	
	_getPosition: function( field ) {
		return ( field.nodeName.toLowerCase() == 'ul' ? Js.use( field ).parents( 'li' )[0] : field );
	}
});
