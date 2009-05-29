/* Activity Overlay for Savvy.UI
 * version: 0.0.2
 */

Js.widget.activity = Js.create({
	appName: 'activity',
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	count: 0,
	
	initiate: function( element, option ) {
		return ( Js.helper.isset( element ) ? this.init( element, option ) : this );
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) ) {
			this.setting = Js.append( option, this.setting, ['lang'], true);
			
			if ( Js.helper.isset( option.lang ) ) 
				this.language = Js.append( option.lang, this.language );
		}
		
		return this;
	},
	
	init: function( element, option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.config.widget[this.appName] );
		
		this.element = Js.helper.pick( element, this.element );
		this.node = Js.$( this.element );
		
		if ( this.node.size() == 0 ) {
			try {
				this.node = Js.$('<div/>')
					.attr( 'id', Js.helper.prep( this.element ) )
					.appendTo('body');
			}
			catch(e) {
				Js.debug.error( 'Js.widget.activity: fail to create elementById ' + this.element );
			}
		}
		
		var css = {
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: 'none'
		};
		
		this.node
			.css( css )
			.setClass( Js.helper.prep( this.setting.identifier)  )
			.css( 'opacity', 0.01 );
		
		return this;
	},
	
	activate: function( callback ) {
		var option = this.setting;
		
		if ( this.count == 0 ) {
			this.node.css( 'display', 'block' ).fadeTo( 'normal', option.opacity );
			
			var middle = Js.util.dimension.page.middle( option.boxWidth, option.boxHeight );
			
			if ( Js.helper.isset( this.box ) ) {
				this.box.css({
					top: middle[0] + 'px',
					left: middle[1] + 'px'
				});
			}
		}
		
		this.count++;
		
		if ( Js.helper.isfunction( callback ) ) 
			callback();
	},
	
	loadImage: function() {
		var option = this.setting;
		var css = {
			position: 'absolute',
			width: option.boxWidth + 'px',
			height: option.boxHeight + 'px',
			zIndex: (option.zIndex + 1)
		};
		
		this.box = Js.$( '<img/>' )
			.attr( 'src', option.imagePath )
			.css( css )
			.appendTo( this.node[0] );
		
		return this;
	},
	
	deactivate: function( callback ) {
		if ( this.count > 0 ) {
			this.node.fadeTo( 'normal', 0, 
				function() {
					Js.$( this ).css(	'display', 'none' );
					if ( Js.helper.isfunction( callback ) ) 
						callback();
				}
			);
		}
		
		this.count--;
		this.count = ( this.count < 0 ? 0 : this.count );
	}
});
