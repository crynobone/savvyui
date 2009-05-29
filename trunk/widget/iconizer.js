/* Iconizer widget for Savvy.UI
 * version: 0.0.3
 */

Js.widget.iconizer = Js.create({
	appName: 'iconizer',
	setting: null,
	
	initiate: function( option ) {
		return ( Js.helper.isset( option ) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) )
			this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		var option = this.setting;
		
		Js.$( '*[class*=icon]' ).each(function( index, element ) {
			var node = Js.$( element );
			
			var klasses = node.attr('className');
			var klass = klasses.split(/ /);
			
			for ( var i = 0; i < klass.length; i++ ) {
				if ( klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g) ) {
					var append = RegExp.$1 == '-append';
					var icon = RegExp.$3;
					var position = Js.helper.pickGrep( RegExp.$2, 'left', /^(left|right)$/i );
					var background = [
						option.folder,
						icon,
						'.',
						option.fileType
					].join('');
					
					if ( !!append ) {
						var obj = Js.$( '<span/>' ).css({
							'display': 'block',
							'cssFloat': position,
							'width': '16px',
							'height': '16px'
						}).prependTo( node[0] );
						
						if ( position == 'left' ) {
							obj.css({
								'background': 'url("' + background + '") no-repeat left',
								'marginRight': '3px'
							});
						}
						else {
							obj.css({
								'background': 'url("' + background + '") no-repeat right',
								'marginLeft': '3px'
							});
						}
					}
					else {
						var obj = node;
						
						if ( position == 'left' ) {
							obj.css({
								'background': 'url("' + background + '") no-repeat left center',
								'paddingLeft': '17px'
							});
						}
						else {
							obj.css({
								'background': 'url("' + bg + '") no-repeat right center',
								'paddingRight': '17px'
							});
						}
					}
				}
			}
		});
		
		return this;
	}
});