/* Notice/Error Message for Savvy.UI
 * version: 0.0.3
 */

Js.widget.notice = Js.widget.activity.extend({
	appName: 'notice',
	callback: null,
	node: null,
	setting: null,
	language: null,
	
	initiate: function( element, option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.node = this.$super.initiate( element, {
			boxWidth: 550,
			boxHeight: 0,
			opacity: 0.9
		});
		
		this.node.init();
		this.node.box = Js.$( '<div/>' )
			.css({
				'position': 'absolute',
				'width': '550px'
			})
			.appendTo( this.$super.node[0] );
	},
	closeNotice: function() {
		var that = this;
		
		if ( Js.helper.isfunction( this.callback ) ) {
			this.callback.apply( this );
			this.callback = null;
		}
		
		this.node.deactivate( function() {
			that.node.box.text('');
		});
	},
	show: function( obj, status ) {
		var status = Js.helper.pickGrep( status, 'note', /^(note|success|error)$/i ),
			that = this;
		
		var title = this.language[ Js.helper.camelize('title-' + status) ],
			text = '',
			sticky = false;
		
		this.node.box.text('');
		this.node.activate();
		
		if ( !Js.helper.typeOf( obj, 'object' ) ) 
			title = obj;
		else {
			title = Js.helper.pick( note.title, '' );
			text = Js.helper.pick( note.message, '' );
			sticky = Js.helper.pick( note.sticky, false );
		}
		
		this.node.box.setClass( this.setting['css' + Js.helper.toProperCase( status )] );
		
		Js.$( '<h3/>' )
			.text( title )
			.appendTo( this.node.box[0] );
		
		if ( text != '' ) 
			var p = Js.$( '<p/>' )
				.htmlText( text.toString() )
				.appendTo( this.node.box[0] );
		
		var span = Js.$( '<em/>' )
			.text( Js.language.widget.notice.timer )
			.appendTo( this.node.box[0] );
		
		this.node.node.one( 'click', function() {
			that.closeNotice();
		} );
		
		if ( sticky == false ) {
			setTimeout( function() {
				that.closeNotice();
			}, ( this.setting.seconds * 1000 ) );
		}
	},
	success: function( text, callback ) {
		this.callback = Js.helper.pick( callback, null );
		this.show( text, 'success' );
	},
	note: function( text, callback ) {
		this.callback = Js.helper.pick( callback, null );
		this.show( text, 'note' );
	},
	error: function( text, callback ) {
		this.callback = Js.helper.pick( text, null );
		this.show( text, 'error' );
	}
});