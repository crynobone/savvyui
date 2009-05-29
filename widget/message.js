/* Message Widget for Savvy.UI
 * version: 0.0.6
 */

Js.widget.message = Js.create({
	appName: 'message',
	node: null,
	setting: null,
	
	initiate: function( option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		if ( Js.helper.isnull( this.node ) ) 
			this.init();
		
		return this;
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	add: function( obj ) {
		var that = this,
			text = Js.helper.pick( obj.text, '' ),
			type = Js.helper.pickGrep( obj.type, 'note', /^(note|error|success)$/ ),
			closable = Js.helper.pickType( obj.closable, true, 'boolean' );
		
		if ( Js.helper.isnull( this.node ) ) 
			this.init();
		
		(function() {
			var div = Js.$( '<div/>' )
				.attr({
					className: 'widgetmessage-box'
				})
				.css( 'margin', '2px 0px' )
				.appendTo( that.node[0] )
				.hide();
			
			if ( !!closable ) {
				var span = Js.$( '<span/>' )
					.attr({
						className: 'widgetmessage-close'
					})
					.text('x')
					.appendTo( div[0] );
			}
			
			var p = Js.$( '<p/>' ).htmlText( text ).appendTo( div[0] );
			
			var timeout_id = setTimeout(function() {
				div.hide( 'normal', function() {
					span.remove();
					p.remove();
				});
			}, ( this.setting.seconds * 1000 ) );
			
			if ( !!closable ) {
				span.bind( 'click', function(){
					clearTimeout( timeout_id );
					timeout_id = null;
					
					div.hide( 'normal', function(){
						span.remove();
						p.remove();
					});
				});
			}
			
			div.setClass( type ).show( 'slow' );
		})();
	},
	init: function() {
		var that = this;
		
		this.node = Js.$( '#' + this.setting.identifier );
		
		if ( this.node.length < 1 ) {
			this.node = Js.$( '<div/>' )
				.attr( 'id', this.setting.identifier )
				.appendTo( 'body' );
		}
		
		var callback = function() {
			that.node.css( 'top', Js.util.dimension.page.scrolls.y() + 'px' );
		};
		
		Js.$( window ).bind( 'scroll', callback );
		callback();
	}
});
