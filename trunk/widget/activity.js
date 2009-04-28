/* Activity Overlay for Savvy.UI
 * version: 0.0.2
 */

Js.widget.activity = Js.create({
	appName: "activity",
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	count: 0,
	
	initiate: function( elem, opt ) {
		return ( Jrun.isset( elem ) ? this.init( elem, opt ) : this );
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf(opt, "object") ) {
			this.setting = Js.append(opt, this.setting, ["lang"], true);
			
			if ( Jrun.isset(opt.lang) ) 
				this.language = Js.append(opt.lang, this.language);
		}
		return this;
	},
	
	init: function( elem, opt ) {
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.config.widget[this.appName] );
		
		this.element = Jrun.pick( elem, this.element );
		this.node = Js.use( this.element );
		
		if ( this.node.size() == 0 ) {
			try {
				this.node = Js.use("<div/>").attr("id", Jrun.prep(this.element)).appendTo("body");
			}
			catch(e) {
				Js.debug.error("Js.widget.activity: fail to create elementById '" + this.element + "'");
			}
		}
		
		this.node.css({
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: "none"
		}).setClass( Jrun.prep(this.setting.identifier) ).css( "opacity", 0.01 );
		
		return this;
	},
	
	activate: function( fn ) {
		var opt = this.setting;
		
		if ( this.count == 0 ) {
			this.node.css( "display", "block" ).fadeTo( "normal", opt.opacity );
			var t = Js.util.dimension.page.middle( opt.boxWidth, opt.boxHeight );
			
			if ( Jrun.isset(this.box) ) {
				this.box.css({
					top: t[0] + "px",
					left: t[1] + "px"
				});
			}
		}
		
		this.count++;
		if ( Jrun.isfunction( fn ) ) 
			fn();
	},
	
	loadImage: function() {
		var opt = this.setting;
		this.box = Js.use( "<img/>" )
			.attr( "src", opt.imagePath )
			.css({
				position: "absolute",
				width: opt.boxWidth + "px",
				height: opt.boxHeight + "px",
				zIndex: (opt.zIndex + 1)
			})
			.appendTo( this.node[0] );
		
		return this;
	},
	
	deactivate: function( fn ) {
		if ( this.count > 0 ) {
			this.node.fadeTo( "normal", 0, 
				function() {
					Js.use( this ).css(	"display", "none" );
					if ( Jrun.isfunction( fn ) ) 
						fn();
				}
			);
		}
		
		this.count--;
		this.count = ( this.count < 0 ? 0 : this.count );
	}
});
