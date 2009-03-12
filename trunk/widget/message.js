/* Message Widget for Savvy.UI
 * version: 0.0.6
 */

Js.widget.message = Js.create({
	appName: "message",
	node: null,
	setting: null,
	
	initiate: function( option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		if ( Jrun.isnull(this.node) ) 
			this.init();
		
		return this;
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	add: function( js ) {
		var that = this;
		
		if ( Jrun.isnull(this.node) ) 
			this.init();
		
		var text = Jrun.pick( js.text, "" );
		var type = Jrun.pickGrep( js.type, "note", /^(note|error|success)$/ );
		var closable = Jrun.pickType( js.closable, true, "boolean" );
		
		(function() {
			var div = Js.use( "<div/>" )
				.attr({
					className: "widgetmessage-box"
				})
				.css( "margin", "2px 0px" )
				.appendTo(that.node[0]).hide();
			
			if ( !!closable ) {
				var span = Js.use( "<span/>" )
					.attr({
						className: "widgetmessage-close"
					})
					.text("x")
					.appendTo( div[0] );
			}
			
			var p = Js.use( "<p/>" ).htmlText( text ).appendTo( div[0] );
			
			var t = setTimeout(function() {
				div.hide( "normal", function() {
					span.remove();
					p.remove();
				});
			}, (this.setting.seconds * 1000) );
			
			if ( !!closable ) {
				span.bind( "click", function(){
					clearTimeout(t);
					t = null;
					
					div.hide( "normal", function(){
						span.remove();
						p.remove();
					});
				});
			}
			
			div.setClass( type ).show( "slow" );
		})();
	},
	init: function() {
		var that = this;
		
		this.node = Js.use( "#" + this.setting.identifier );
		
		if ( this.node.length < 1 ) {
			this.node = Js.use( "<div/>" )
				.attr( "id", this.setting.identifier )
				.appendTo( "body" );
		}
		
		var scrollMe = function() {
			that.node.css("top", Js.util.dimension.page.scrolls.y() + "px");
		};
		
		jQuery(window).bind( "scroll", function() {
			scrollMe();
		});
		scrollMe();
	}
});
