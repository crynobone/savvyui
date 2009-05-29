/* Panel for Savvy.UI
 * version: 0.2.2
 */

Js.widget.panel = Js.create({
	appName: 'panel',
	node: null,
	main: null,
	mainTitle: null,
	renderTo: null,
	element: null,
	setting: null,
	language: null,
	header: null,
	container: null,
	buttons: null,
	closeButton: null,
	minimizeButton: null,
	content: null,
	footer: null,
	status: 'normal',
	
	initiate: function( option ) {
		return ( Js.helper.isset( option ) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) ) {
			this.setting = Js.append( option, this.setting, ['lang'], true );
			
			if ( Js.helper.isset( option.lang ) ) 
				this.language = Js.append( option.lang, this.language );
		}
		
		return this;
	},
	
	_prepare: function() {
		this.renderTo = Js.helper.pick( this.setting.renderTo, 'body:eq(0)' );
		this.element = this.setting.element;
	},
	
	init: function( option ) {
		var that = this;

		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepare();
		
		// set renderTo element
		if ( typeof( this.renderTo ) === 'string' || this.renderTo.nodeType ) {
			this.renderTo = Js.$( this.renderTo );
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.$( 'body:eq(0)' );
		}
			
		this._addBorder();
		this._addContent();
		
		if ( Js.helper.isset( this.setting.button ) ) {
			var button_length = this.setting.button.length;
			
			for ( var i = 0; i < button_length; i++ ) 
				this.addButton( this.setting.button[i] );
		}
		
		return this;
	},
	
	_addBorder: function() {
		var that = this;
		
		var table = Js.$( '<table/>' )
			.attr( 'id', this.element + '_panel' )
			.setClass( 'widget-panel' )
			.appendTo( this.renderTo[0] );
		
		var tr = [];
		tr[0] = Js.$( '<tr/>' ).appendTo( table[0] );
		tr[1] = Js.$( '<tr/>' ).appendTo( table[0] );
		tr[2] = Js.$( '<tr/>' ).appendTo( table[0] );
		
		var dh = [];
		var dc = [];
		var df = [];
		
		dh[0] = Js.$( '<td/>' ).setClass( 'tl' ).appendTo( tr[0][0] ).css( 'opacity', 0.7 );
		dh[1] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[0][0] ).css( 'opacity', 0.7 );
		dh[2] = Js.$( '<td/>' ).setClass( 'tr' ).appendTo( tr[0][0] ).css( 'opacity', 0.7 );
		
		dc[0] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[1][0] ).css( 'opacity', 0.7 );
		dc[1] = Js.$( '<td/>' ).setClass( 'c' ).appendTo( tr[1][0] );
		dc[2] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[1][0] ).css( 'opacity', 0.7 );
		
		df[0] = Js.$( '<td/>' ).setClass( 'bl' ).appendTo( tr[2][0] ).css( 'opacity', 0.7 );
		df[1] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[2][0] ).css( 'opacity', 0.7 );
		df[2] = Js.$( '<td/>' ).setClass( 'br' ).appendTo( tr[2][0] ).css( 'opacity', 0.7 );
		
		
		this.node = table;
		this.main = dc[1];
	},
	_addContent: function() {
		var that = this,
			option = this.setting;
		
		// set panel width
		if ( Js.helper.isset( option.width ) ) 
			this.main.css( 'width', option.width + 'px' );
		
		// render header
		this.header = Js.$( '<h2/>' )
			.addClass( 'header' )
			.appendTo( this.main[0] );
		
		if ( !option.header ) 
			this.header.hide();
		
		// render content
		this.container = Js.$( '<div/>' )
			.addClass( 'content-container' )
			.appendTo( this.main[0] );
		
		// render footer
		this.footer = Js.$( '<div/>' )
			.addClass( 'footer' )
			.appendTo( this.main[0] );
		
		
		// set panel height
		if ( Js.helper.isset( option.height ) ) 
			this.container.css( 'height', option.height + 'px' );
		
		// render header title
		this.mainTitle = Js.$( '<span/>' )
			.addClass( 'title' )
			.text( option.title )
			.appendTo( this.header[0] );
		
		this.buttons = Js.$( '<span/>' )
			.addClass( 'button' )
			.appendTo( this.footer[0] );
		
		// render Close-Button 
		this.closeButton = Js.$( '<a/>' )
			.attr( 'href', '#' )
			.text( this.language.closeText )
			.setClass( 'buttons' )
			.appendTo( this.footer[0] );
		
		// Enable Close-Button option
		if ( !!option.closable ) 
			this.closeButton.addClass( 'close' ).click( function() { that.closePanel(); return false; });
		else 
			this.closeButton.addClass( 'button-disabled' );
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.$( '<div/>' )
			.attr( 'id', this.element )
			.setClass( 'content' )
			.appendTo( this.container[0] );
		
		try {
			this.content.html( option.content );
		} catch ( e ) {
			this.content.htmlText( option.content );
		}
		
		// set height and scrolling option for content CONTAINER
		if ( Js.helper.isset( option.height ) && !!option.scroll ) {
			this.content.css({
				'height': option.height + 'px',
				'overflow': 'auto'
			});
		}
		
		// make the panel visible
		this.node.show( 'slow' );
		
		return this;
	},
	
	closePanel: function() {
		var that = this,
			option = this.setting;
		
		// callback to close panel
		this.node.fadeOut( 'slow', function() {
			if ( Js.helper.isfunction( option.onClose ) ) 
				option.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	title: function( text ) {
		this.mainTitle.html('').text( text );
		return this;
	},
	
	addButton: function( obj ) {
		var that = this,
			callback = Js.helper.pickType( obj.callback, 'function' ),
			text = Js.helper.pickType( obj.text, this.language.defaultButton, 'string' ),
			type = Js.helper.pickGrep( obj.type, 'normal', /^(normal|submit|cancel)$/i );
		
		Js.$( '<a/>' )
			.attr( 'href', '#' )
			.click( function() {
				var run_default = false;
				
				if ( Js.helper.isfunction( callback ) ) 
					run_default = callback();
				
				if ( run_default === true ) 
					that.closePanel();
				
				return false;
			})
			.addClass( 'buttons' )
			.addClass( type )
			.text( text )
			.appendTo( this.buttons[0] );
	},
	
	_fixResize: function() {
		var option = this.setting;
		
		if ( Js.helper.isset( option.height) && !!option.scroll ) {
			this.content.css({
				'height': option.height + 'px', 
				'overflow': 'auto'
			});
		}
	}
});
