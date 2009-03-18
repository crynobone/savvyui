/* Notice/Error Message for Savvy.UI
 * version: 0.0.3
 */

Js.widget.notice = Js.widget.activity.extend({
	appName: "notice",
	callback: null,
	node: null,
	setting: null,
	language: null,
	
	initiate: function( elem, opt ) {
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.node = this.$super.initiate( elem, {
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
		
		this.node.deactivate( function() {
			that.node.box.text("");
		});
	},
	_domAddNotice: function( v, s ) {
		var s = Jrun.pickGrep( s, "note", /^(note|success|error)$/i );
		var that = this;
		
		this.node.box.text("");
		this.node.activate();
		
		var title = this.language[Jrun.camelize("title-" + status)];
		var tx = "";
		var r = false;
		
		if ( Jrun.typeOf(v) != "object" ) 
			title = v;
		else {
			title = Jrun.pick( note.title, "" );
			tx = Jrun.pick( note.message, "" );
			r = Jrun.pick( note.sticky, false );
		}
		
		this.node.box.setClass( this.setting['css' + Jrun.toProperCase(s)] );
		
		Js.use( "<h3/>" )
			.text( title )
			.appendTo( this.node.box[0] );
		
		if ( tx != "" ) 
			var p = Js.use( "<p/>" ).htmlText( "" + tx ).appendTo( this.node.box[0] );
		
		
		var span = Js.use( "<em/>" )
			.text( Js.language.widget.notice.timer )
			.appendTo( this.node.box[0] );
		
		this.node.node.one( "click", function() {
			that.closeNotice();
		});
		
		if ( r == false ) {
			setTimeout( function() {
				that.closeNotice();
			}, (this.setting.seconds * 1000) );
		}
	},
	success: function( tx, fn ) {
		this.callback = Jrun.pick( fn, null );
		this._domAddNotice( tx, 'success' );
	},
	note: function( tx, fn ) {
		this.callback = Jrun.pick( fn, null );
		this._domAddNotice( tx, 'note' );
	},
	error: function( tx, fn ) {
		this.callback = Jrun.pick( fn, null );
		this._domAddNotice( tx, 'error' );
	}
});