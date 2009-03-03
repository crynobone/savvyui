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
	status: 0,
	
	initiate: function( selector, option ) {
		return ( Jrun.isset(selector) ? this.init( selector, option ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if ( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.language );
		
		return this;
	},
	
	init: function( selector, option ) {
		this.element = Jrun.pick( selector, this.element );
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		this.node = Js.use( this.element );
		
		if ( this.node.length == 0 ) 
			this.node = Js.use( "<div/>" ).attr( "id", Jrun.prep(this.element) ).appendTo( "body" );
		
		this.node.css({
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: "none"
		}).setClass( Jrun.prep(this.setting.identifier) ).css( "opacity", 0.01 );
		
		return this;
	},
	
	activate: function( callback ) {
		if ( this.status == 0 ) {
			this.node.css( "display", "block" ).fadeTo( "normal", this.setting.opacity );
			
			var t = Js.util.dimension.page.middle( this.setting.boxWidth, this.setting.boxHeight );
			
			if ( Jrun.isset(this.box) ) {
				this.box.css({
					top: t[0] + "px",
					left: t[1] + "px"
				});
			}
		}
		
		this.status++;
		
		if ( Jrun.isfunction(callback) ) 
			callback();
	},
	loadImage: function() {
		this.box = Js.use( "<img/>" )
			.attr( "src", this.setting.imagePath )
			.css({
				position: "absolute",
				width: this.setting.boxWidth + "px",
				height: this.setting.boxHeight + "px",
				zIndex: (this.setting.zIndex + 1)
			})
			.appendTo( this.node[0] );
	},
	
	deactivate: function( callback ) {
		if ( this.status > 0 ) {
			this.node.fadeTo( "normal", 0, function(){
				Js.use( this ).css(	"display", "none" );
				
				if ( Jrun.isfunction(callback) ) 
					callback();
			});
		}
		
		this.status--;
		this.status = ( this.status < 0 ? 0 : this.status );
	}
});
