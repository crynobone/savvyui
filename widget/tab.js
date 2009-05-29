/* Tab Panel for Savvy.UI
 * version: 0.9.4
 */


Js.widget.tab = Js.create({
	appName: 'tab',
	height: null,
	toolbar: null,
	node: null,
	header: null,
	element: null,
	activeTab: null,
	activeHeader: null,
	handler: null,
	status: 'off',
	setting: null,
	tabs: null,
	current: '',
	
	initiate: function( element, option ) {
		var that = this;
		var prepare = function( element, option ) {
			that.node = Js.$( element );
			that.init( option );
		};
		
		if ( !!Js.helper.isset( element ) )
			prepare( element, option );
		
		return this;
	},
	
	setup: function( option ) {
		this.setting = Js.append( option, this.setting );
		return this;
	},
	
	init: function( option ) {
		var that = this;
		
		// setting should be available
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget.tab );
		this.handler = Js.helper.pickGrep( this.setting.handler, 'click', /^(mouseover|click)$/i );
		
		if ( this.node.size() > 0 ) {
			this.node.addClass( this.setting.container );
			this.element = this.node.eq( 0 ).attr( 'id' );
			
			// add tab toolbar on top
			this._addToolbar();
			// activate tab
			this.activateTab( '#' + Js.$( '.' + this.setting.cssHidden + ':first', this.node[0] ).attr( 'id' ) );
			
			this.status = 'on';
		}
		else 
			Js.debug.error( 'Js.widget.tab: No elements found' );
		
		return this;
	},
	
	_addToolbar: function() {
		var that = this,
			option = this.setting;
		
		if ( Js.helper.trim( option.header ) == '' ) {
			// DOM insert tab toolbar container
			var toolbar_container = Js.$( '<div/>' )
				.attr({
					className: option.toolbarContainer, 
					id: [ this.element, 'toolbar', 'container' ].join('-')
				})
				.prependTo( this.node[0] );
		}
		else {
			var toolbar_container = Js.$( option.header ).addClass( option.toolbarContainer  );
		}
		
		this.toolbar = toolbar_container;
		
		// DOM insert tab toolbar
		this.header = Js.$( '<ul/>' )
			.attr({
				id: [this.element, 'toolbar'].join('-'), 
				className: option.toolbar
			})
			.appendTo( this.toolbar[0] );
		
		// find all possible tabs
		var tab = Js.$( option.identifier, this.node[0] );
		
		tab.each(function( index, value ) {
			// add the tab title
			that._addHeader( value );
			// hide the tab
			Js.$( value ).setClass( option.cssHidden );
		});
		
		this.tabs = tab;
		this.tabs.css( 'display', 'none' );
		
		Js.$( '<div/>' ).css( 'display', 'block' ).appendTo( toolbar_container[0] );
	},
	
	_addHeader: function( element ) {
		var that = this,
			option = this.setting,
			node = Js.$( element );
		
		var title = node.attr( 'title' ),
			closable = node.hasClass( option.closable ),
			disable = node.hasClass( option.disabled );
		
		var li = Js.$( '<li/>' ).appendTo( this.header[0] );
		var a = Js.$( '<a/>' )
			.attr({
				href: '#' + node.attr('id'), 
				title: title
			})
			.appendTo( li[0] );
		
		Js.$( '<em/>' ).appendTo( a[0] );
		a.text( title );
		
		if ( !!closable ) {
			Js.$( '<span/>' )
				.css( 'paddingLeft', '10px' )
				.text('x')
				.click(function() {
					var my = Js.$( this.parentNode ).click(function(){
						return false;
					});
				
					var href = my.attr( 'href' );
					that.activeHeader.removeClass();
					that.activeTab.setClass( option.hidden );
					Js.$( href ).remove();
					Js.$( this.parentNode.parentNode ).remove();
				
					that.revert();
					
					return false;
				})
				.appendTo( a[0] );
		}
		
		if ( !!disable ) {
			a.setClass( option.cssDisabled )
				.bind( this.handler, function(){
					return false;
				});
		}
		else {
			a.bind( this.handler, function() {
				that.activateTab( Js.$( this ).attr('href') );
				
				return false;
			});
		}
	},
	
	enableTab: function( element ) {
		var that = this;
		
		Js.$( 'a[href=' + element + ']', this.header[0] )
			.removeClass()
			.unbind( this.handler )
			.bind( this.handler, function(){
				that.activateTab( Js.$(this).attr('href') );
				return false;
			});
				
		return false;
	},
	
	disableTab: function( element ) {
		var that = this;
		
		Js.$( 'a[href=' + element + ']', this.header[0] )
			.setClass( this.setting.cssDisabled )
			.unbind( this.handler )
			.bind( this.handler, function(){
				return false;
			});
		
		return false;
	},
	
	activateTab: function( element ) {
		var element = element,
			that = this,
			option = this.setting;
		
		var callback = function() {
			if ( Js.helper.isset( that.activeHeader ) )
				that.activeHeader.removeClass( option.cssCurrent );
			
			that.activeHeader = Js.$( 'a[href=' + element + ']', that.header[0] );
			that.activeTab = Js.$( element );
			
			that.activeHeader.addClass( option.cssCurrent );
			that.activeTab.setClass( option.cssActive );
			
			if ( !!option.fx ) 
				that.activeTab.slideDown( 'normal' );
			else 
				that.activeTab.show();
			
			that.current = element;
		};
		
		if( this.current !== element ) {
			if ( Js.helper.isset( this.activeTab ) ) {
				this.activeTab.setClass( option.cssHidden );
				
				if ( !!option.fx ) {
					this.activeTab.slideUp( 'normal', function(){
						callback();
					});
				}
				else {
					this.activeTab.hide();
					callback();
				}
			} 
			else 
				callback();
		}
		return false;
	},
	
	revert: function() {
		var anchors = Js.$( 'li > a', this.header[0] );
		
		if ( anchors.size() > 0 ) 
			this.activateTab( anchors.attr('href') );
	},
	
	showTab: function() {
		if ( this.status == 'off' ) {
			this.toolbar.show();
			this.tabs.setClass( this.setting.cssHidden );
			this.activeTab.setClass( this.setting.cssActive );
		}
		
		this.status = 'on';
	},
	hideTab: function() {
		if ( this.status == 'on' ) {
			this.toolbar.hide();
			this.tabs.setClass( this.setting.cssActive );
		}
		
		this.status = 'off';
	},
	toggle: function() {
		this.status == 'off' ? this.showTab() : this.hideTab() ;
	},
	
	addTab: function( obj ) {
		var that = this;
		
		if ( !!obj.id && !!Js.helper.typeOf( obj.id, 'string' ) ) {
			var title = Js.helper.pick( obj.title, 'Untitled' ),
				id = obj.id,
				text = Js.helper.pick( obj.content, '' ),
				closable = Js.helper.pick( obj.closable, false ),
				activate = Js.helper.pick( obj.activate, false );
			
			var node = Js.$( '<div/>' )
				.attr({
					id: id,
					className: this.setting.cssHidden,
					title: title
				})
				.css( 'display', 'none' )
				.htmlText( text )
				.appendTo( this.node[0] );
			
			this.tabs.add( node[0] );
			
			var li = Js.$( '<li/>' ).appendTo( this.header[0] );
			var a = Js.$( '<a/>' ).attr({
				href: '#' + id,
				title: title
			}).appendTo( li[0] );
			
			Js.$( '<em/>' ).appendTo( a[0] );
			
			a.text( title ).bind( this.handler, function(){
				that.activateTab( Js.$(this).attr('href') );
				
				return false;
			});
			
			if ( !!closable ) {
				Js.$( '<span/>' )
					.click(function() {
						var href = Js.$( this.parentNode ).attr( 'href' );
						that.activeHeader.removeClass();
						
						that.activeTab.setClass( that.setting.hidden )
							.fadeOut( 'normal', function(){
								Js.$( this ).remove();
							});
						
						Js.$( href ).remove();					
						Js.$( this.parentNode.parentNode ).remove();
						
						that.revert();
						
						return false;
					})
					.css( 'paddingLeft', '10px' )
					.text( 'x' )
					.appendTo( a[0] );
			}
			
			if ( !!activate ) 
				this.activateTab( '#' + id );
		}
		
		return this;
	}
});
