/* Tab Panel for Savvy.UI
 * version: 0.9.4
 */

Js.widget.tab = Js.create({
	appName: "tab",
	height: null,
	toolbar: null,
	node: null,
	header: null,
	element: null,
	activeTab: null,
	activeHeader: null,
	handler: null,
	status: "off",
	setting: null,
	tabs: null,
	current: "",
	
	initiate: function( elem, opt ) {
		var that = this;
		var prepare = function( elem, opt ) {
			that.node = Js.use( elem );
			that.init( opt );	
		};
		
		if ( !!Jrun.isset(elem) )
			prepare( elem, opt );
		
		return this;
	},
	
	setup: function( opt ) {
		this.setting = Js.append( opt, this.setting );
		return this;
	},
	
	init: function( opt ) {
		var that = this;
		
		// setting should be available
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget.tab );
		this.handler = Jrun.pickGrep( this.setting.handler, "click", /^(mouseover|click)$/i );
		
		if (this.node.size() > 0) {
			this.node.addClass( this.setting.container );
			this.element = this.node.eq(0).attr( "id" );
			
			// add tab toolbar on top
			this._addToolbar();
			// activate tab
			this.activateTab("#" + Js.use("." + this.setting.cssHidden + ":first", this.node[0]).attr("id"));
			
			this.status = "on";
		}
		else 
			Js.debug.error("Js.widget.tab: No elements found");
		
		return this;
	},
	
	_addToolbar: function() {
		var that = this,
			opt = this.setting;
		
		if ( Jrun.trim(opt.header) == "" ) {
			// DOM insert tab toolbar container
			var dv = Js.use( "<div/>" )
				.attr({
					className: opt.toolbarContainer, 
					id: [this.element, "toolbar", "container"].join("-")
				})
				.prependTo( this.node[0] );
		}
		else {
			var dv = Js.use( opt.header ).addClass( opt.toolbarContainer  );
		}
		this.toolbar = dv;
		
		// DOM insert tab toolbar
		this.header = Js.use( "<ul/>" )
			.attr({
				id: [this.element, "toolbar"].join("-"), 
				className: opt.toolbar
			})
			.appendTo( this.toolbar[0] );
		
		// find all possible tabs
		var c = Js.use( opt.identifier, this.node[0] );
		
		c.each(function( i, v ) {
			// add the tab title
			that._addHeader( v );
			// hide the tab
			Js.use( v ).setClass( opt.cssHidden );
		});
		
		this.tabs = c;
		this.tabs.css( "display", "none" );
		
		Js.use( "<div/>" ).css( "display", "block" ).appendTo( dv[0] );
	},
	
	_addHeader: function( elem ) {
		var that = this,
			opt = this.setting,
			node = Js.use( elem );
		
		var title = node.attr( "title" ),
			c = node.hasClass( opt.closable ),
			d = node.hasClass( opt.disabled );
		
		var li = Js.use( "<li/>" ).appendTo( this.header[0] );
		var a = Js.use( "<a/>" )
			.attr({
				href: "#" + node.attr("id"), 
				title: title
			})
			.appendTo( li[0] );
		
		Js.use( "<em/>" ).appendTo( a[0] );
		a.text( title );
				
		if ( !!c ) {
			Js.use( "<span/>" )
				.css( "paddingLeft", "10px" )
				.text("x")
				.click(function() {
					var my = Js.use( this.parentNode ).click(function(){
						return false;
					});
				
					var h = my.attr( "href" );
					that.activeHeader.removeClass();
					that.activeTab.setClass( opt.hidden );
					Js.use( h ).remove();
					Js.use( this.parentNode.parentNode ).remove();
				
					that.revert();
					
					return false;
				})
				.appendTo( a[0] );
		}
		
		if ( !!d ) {
			a.setClass( opt.cssDisabled )
				.bind( this.handler, function(){
					return false;
				});
		}
		else {
			a.bind( this.handler, function() {
				that.activateTab( Js.use( this ).attr("href") );
				
				return false;
			});
		}
	},
	
	enableTab: function( el ) {
		var that = this;
		
		Js.use( "a[href=" + el + "]", this.header[0] )
			.removeClass()
			.unbind( this.handler )
			.bind( this.handler, function(){
				that.activateTab( Js.use(this).attr("href") );
				return false;
			});
				
		return false;
	},
	
	disableTab: function( el ) {
		var that = this;
		
		Js.use( "a[href=" + el + "]", this.header[0] )
			.setClass( this.setting.cssDisabled )
			.unbind( this.handler )
			.bind( this.handler, function(){
				return false;
			});
		
		return false;
	},
	
	activateTab: function( el ) {
		var el = el,
			that = this,
			opt = this.setting;
		
		var fn = function() {
			if ( Jrun.isset(that.activeHeader) )
				that.activeHeader.removeClass( opt.cssCurrent );
			
			that.activeHeader = Js.use( "a[href=" + el + "]", that.header[0] );
			that.activeTab = Js.use( el );
			
			that.activeHeader.addClass( opt.cssCurrent );
			that.activeTab.setClass( opt.cssActive );
			
			if ( !!opt.fx ) 
				that.activeTab.slideDown( "normal" );
			else 
				that.activeTab.show();
			
			that.current = el;
		};
		
		if( this.current !== el ) {
			if ( Jrun.isset(this.activeTab) ) {
				this.activeTab.setClass( opt.cssHidden );
				
				if ( !!opt.fx ) {
					this.activeTab.slideUp( "normal", function(){
						fn();
					});
				}
				else {
					this.activeTab.hide();
					fn();
				}
			} 
			else 
				fn();
		}
		return false;
	},
	
	revert: function() {
		var v = Js.use( "li > a", this.header[0] );
		
		if ( v.size() > 0 ) 
			this.activateTab( v.attr("href") );
	},
	showTab: function() {
		if ( this.status == "off" ) {
			this.toolbar.show();
			this.tabs.setClass( this.setting.cssHidden );
			this.activeTab.setClass( this.setting.cssActive );
		}
		
		this.status = "on";
	},
	hideTab: function() {
		if ( this.status == "on" ) {
			this.toolbar.hide();
			this.tabs.setClass( this.setting.cssActive );
		}
		
		this.status = "off";
	},
	toggle: function() {
		this.status == "off" ? this.showTab() : this.hideTab() ;
	},
	
	addTab: function( jo ) {
		var that = this;
		
		if ( !!jo.id && Jrun.typeOf(jo.id) === "string" ) {
			var title = Jrun.pick( jo.title, "Untitled" );
			var id = js.id;
			var tx = Jrun.pick( jo.content, "" );
			var c = Jrun.pick( jo.closable, false );
			var set = Jrun.pick( jo.activate, false );
			
			var node = Js.use( '<div/>' )
				.attr({
					id: id,
					className: this.setting.cssHidden,
					title: title
				})
				.css( "display", "none" )
				.htmlText( tx )
				.appendTo( this.node[0] );
			
			this.tabs.add( node[0] );
			
			var li = Js.use( '<li/>' ).appendTo( this.header[0] );
			var a = Js.use( '<a/>' ).attr({
				href: "#" + id,
				title: title
			}).appendTo( li[0] );
			
			Js.use( "<em/>" ).appendTo( a[0] );
			
			a.text( title ).bind( this.handler, function(){
				that.activateTab( Js.use(this).attr("href") );
				
				return false;
			});
			
			if ( !!c ) {
				Js.use( "<span/>" )
					.click(function() {
						var h = Js.use( this.parentNode ).attr( "href" );
						that.activeHeader.removeClass();
						
						that.activeTab.setClass( that.setting.hidden )
							.fadeOut( "normal", function(){
								Js.use( this ).remove();
							});
						
						Js.use( h ).remove();					
						Js.use( this.parentNode.parentNode ).remove();
						
						that.revert();
						
						return false;
					})
					.css( "paddingLeft", "10px" )
					.text( "x" )
					.appendTo( a[0] );
			}
			
			if ( !!set ) 
				this.activateTab("#" + id);
		}
		
		return this;
	}
});
