/* Iconizer widget for Savvy.UI
 * version: 0.0.3
 */

Js.widget.iconizer = Js.create({
	appName: "iconizer",
	setting: null,
	
	initiate: function( opt ) {
		return ( Jrun.isset(opt) ? this.init( opt ) : this );
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf( opt, "object" ) )
			this.setting = Js.append( opt, this.setting );
		
		return this;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		Js.use( "*[class*=icon]" ).each(function( i, v ) {
			var node = Js.use( v );
			
			var klas = node.attr("className");
			var klass = klas.split(/ /);
			
			for ( var i = 0; i < klass.length; i++ ) {
				if ( klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g) ) {
					var append = RegExp.$1 == "-append";
					var icon = RegExp.$3;
					var pos = Jrun.pickGrep( RegExp.$2, "left", /^(left|right)$/i );
					var bg = that.setting.folder + icon + "." + that.setting.fileType;
					
					if ( !!append ) {
						var obj = Js.use( "<span/>" ).css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo( node[0] );
						
						if ( pos == "left" ) {
							obj.css({
								"background": "url('" + bg + "') no-repeat left",
								"marginRight": "3px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					}
					else {
						var obj = node;
						if ( pos == "left" ) {
							obj.css({
								"background": "url('" + bg + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right center",
								"paddingRight": "17px"
							});
						}
					}
				}
			}
		});
		
		return this;
	}
});