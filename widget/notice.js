/* Notice/Error Message for Savvy.UI
 * version: 0.0.3
 */

Js.widget.notice = Js.widget.activity.extend({
	appName: "notice",
	callback: null,
	node: null,
	setting: null,
	language: null,
	
	initiate: function( selector, option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.node = this.$super.initiate( selector, {
			boxWidth: 550,
			boxHeight: 0,
			opacity: 0.9
		});
		
		this.node.init();
		this.node.box = Js.use( "<div/>" )
			.css({
				"position": "absolute",
				"width": "550px"
			})
			.appendTo( this.$super.node[0] );
	},
	closeNotice: function() {
		var that = this;
		
		if ( Jrun.isfunction(this.callback) ) {
			this.callback.apply(this);
			this.callback = null;
		}
		
		this.node.deactivate(function() {
			that.node.box.text("");
		});
	},
	_domAddNotice: function( note, status ) {
		var status = Jrun.pickGrep( status, "note", /^(note|success|error)$/i );
		var that = this;
		
		this.node.box.text("");
		this.node.activate();
		
		var title = this.language[Jrun.camelize("title-" + status)];
		var message = "";
		var ret = false;
		
		if ( Jrun.typeOf(note) != "object" ) 
			title = note;
		else {
			title = Jrun.pick( note.title, "" );
			message = Jrun.pick( note.message, "" );
			ret = Jrun.pick( note.sticky, false );
		}
		
		this.node.box.setClass( this.setting['css' + Jrun.toProperCase(status)] );
		
		Js.use( "<h3/>" )
			.text( title )
			.appendTo( this.node.box[0] );
		
		if ( message != "" ) 
			var p = Js.use( "<p/>" ).plainHtml( "" + message ).appendTo( this.node.box[0] );
		
		var span = Js.use( "<em/>" )
			.text( Js.language.widget.notice.timer )
			.appendTo( this.node.box[0] );
		
		this.node.node.one( "click", function() {
			that.closeNotice();
		});
		
		if ( ret == false ) {
			setTimeout( function() {
				that.closeNotice();
			}, (this.setting.seconds * 1000) );
		}
	},
	success: function( note, callback ) {
		this.callback = Jrun.pick( callback, null );
		this._domAddNotice( note, 'success' );
	},
	note: function( note, callback ) {
		this.callback = Jrun.pick( callback, null );
		this._domAddNotice( note, 'note' );
	},
	error: function( note, callback ) {
		this.callback = Jrun.pick( callback, null );
		this._domAddNotice( note, 'error' );
	}
});