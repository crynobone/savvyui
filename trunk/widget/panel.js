/* Panel for Savvy.UI
 * version: 0.2.2
 */

Js.widget.panel = Js.create({
	appName: "panel",
	node: null,
	main: null,
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
	status: "normal",
	
	initiate: function( option ) {
		return ( Jrun.isset(option) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.language );
		
		return this;
	},
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
	},	
	
	init: function(option) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) 
			this.renderTo = Js.use( this.renderTo );
		else if ( !this.renderTo || !this.renderTo.nodeType ) 
			this.renderTo = Js.use( "body" ).eq(0);
		
		this._loadBorder();
		this._loadContent();
		
		if (Jrun.isset(this.setting.button)) {
			for (var i = 0; i < this.setting.button.length; i++) 
				this.addButton(this.setting.button[i]);
		}
		
		return this;
	},
	
	_loadBorder: function() {
		var that = this;
		
		var table = Js.use( "<table/>" )
			.attr( "id", this.element + "_panel" )
			.setClass( "widget-panel" )
			.appendTo( this.renderTo[0] );
		
		var tr = [];
		tr[0] = Js.use( "<tr/>" ).appendTo( table[0] );
		tr[1] = Js.use( "<tr/>" ).appendTo( table[0] );
		tr[2] = Js.use( "<tr/>" ).appendTo( table[0] );
		
		var dh = [];
		var dc = [];
		var df = [];
		
		dh[0] = Js.use( "<td/>" ).setClass( "tl" ).appendTo( tr[0][0] ).css( "opacity", 0.7 );
		dh[1] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[0][0] ).css( "opacity", 0.7 );
		dh[2] = Js.use( "<td/>" ).setClass( "tr" ).appendTo( tr[0][0] ).css( "opacity", 0.7 );
		
		dc[0] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[1][0] ).css( "opacity", 0.7 );
		dc[1] = Js.use( "<td/>" ).setClass( "c" ).appendTo( tr[1][0] );
		dc[2] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[1][0] ).css( "opacity", 0.7 );
		
		df[0] = Js.use( "<td/>" ).setClass( "bl" ).appendTo( tr[2][0] ).css( "opacity", 0.7 );
		df[1] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[2][0] ).css( "opacity", 0.7 );
		df[2] = Js.use( "<td/>" ).setClass( "br" ).appendTo( tr[2][0] ).css( "opacity", 0.7 );
		
		
		this.node = table;
		this.main = dc[1];
	},
	_loadContent: function() {
		var that = this;
		
		// set panel width
		if ( Jrun.isset(this.setting.width) ) 
			this.main.css( "width", this.setting.width + "px" );
		
		// render header
		this.header = Js.use( "<h2/>" )
			.addClass( "header" )
			.appendTo( this.main[0] );
		
		// render content
		this.container = Js.use( "<div/>" )
			.addClass( "content-container" )
			.appendTo( this.main[0] );
		
		// render footer
		this.footer = Js.use( "<div/>" )
			.addClass( "footer" )
			.appendTo( this.main[0] );
		
		
		// set panel height
		if ( Jrun.isset(this.setting.height) ) 
			this.container.css( "height", this.setting.height + "px" );
		
		// render header title
		var title = Js.use( "<span/>" )
			.addClass( "title" )
			.text( this.setting.title )
			.appendTo( this.header[0] );
		
		this.buttons = Js.use( "<span/>" )
			.addClass( "button" )
			.appendTo( this.footer[0] );
		
		// render Close-Button 
		this.closeButton = Js.use( "<a/>" )
			.attr( "href", "#" )
			.text( this.language.closeText )
			.setClass( "buttons" )
			.appendTo( this.footer[0] );
		
		// Enable Close-Button option
		if ( !!this.setting.closable ) 
			this.closeButton.addClass( "close" ).click( function() { that.closePanel(); });
		else 
			this.closeButton.addClass( "button-disabled" );
		
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.use( "<div/>" ).attr( "id", this.element ).setClass( "content" ).appendTo( this.container[0] );
		
		try {
			this.content.html( this.setting.content );
		} catch(e) {
			this.content.plainHtml( this.setting.content );
		}
		
		// set height and scrolling option for content CONTAINER
		if ( Jrun.isset(this.setting.height) && !!this.setting.scroll ) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px",
				"overflow": "auto"
			});
		}
		
		// make the panel visible
		this.node.show( "slow" );
		
		return this;
	},
	
	closePanel: function() {
		var that = this;
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction(that.setting.onClose) ) 
				that.setting.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	addButton: function( js ) {
		var that = this;
		var callback = Jrun.pickType(js.callback, "function");
		var text = Jrun.pickType(js.text, this.language.defaultButton, "string");
		var type = Jrun.pickGrep(js.type, "normal", /^(normal|submit|cancel)$/i);
		
		Js.use( "<a/>" )
			.attr( "href", "#" )
			.click( function() {
				var runDefault = false;
				if ( Jrun.isfunction(callback) ) 
					runDefault = callback();
				
				if ( runDefault === true )
					that.closePanel();
			})
			.addClass( "buttons" )
			.addClass( type )
			.text( text )
			.appendTo( this.buttons[0] );
	},
	
	_fixResize: function() {
		if ( Jrun.isset(this.setting.height) && !!this.setting.scroll ) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
});
