/* Message Widget for Savvy.UI
 * version: 0.0.6
 */

Js.widget.message = Js.create({
	appName: "message",
	node: null,
	setting: null,
	
	initiate: function( opt ) {
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		if ( Jrun.isnull(this.node) ) 
			this.init();
		
		return this;
	},
	
	setup: function( opt ) {
		var opt = Jrun.pickType( opt, {}, "object" );
		this.setting = Js.append( opt, this.setting );
		
		return this;
	},
	
	add: function( jo ) {
		var that = this;
		
		if ( Jrun.isnull(this.node) ) 
			this.init();
		
		var tx = Jrun.pick( js.text, "" );
		var type = Jrun.pickGrep( js.type, "note", /^(note|error|success)$/ );
		var c = Jrun.pickType( js.closable, true, "boolean" );
		
		(function() {
			var div = Js.use( "<div/>" )
				.attr({
					className: "widgetmessage-box"
				})
				.css( "margin", "2px 0px" )
				.appendTo(that.node[0]).hide();
			
			if ( !!c ) {
				var span = Js.use( "<span/>" )
					.attr({
						className: "widgetmessage-close"
					})
					.text("x")
					.appendTo( div[0] );
			}
			
			var p = Js.use( "<p/>" ).htmlText( tx ).appendTo( div[0] );
			
			var t = setTimeout(function() {
				div.hide( "normal", function() {
					span.remove();
					p.remove();
				});
			}, (this.setting.seconds * 1000) );
			
			if ( !!c ) {
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
		
		var fn = function() {
			that.node.css("top", Js.util.dimension.page.scrolls.y() + "px");
		};
		
		jQuery(window).bind( "scroll", fn );
		fn();
	}
});
