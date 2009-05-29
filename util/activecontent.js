/* Create Active Hyperlink for Savvy.UI
 * version: 0.1.2
 */

Js.util.activeContent = Js.create({
	appName: 'activeContent',
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	beforeStart: null,
	success: null,
	
	initiate: function( obj ) {
		var that = this,
			obj = Js.helper.pickType( obj, {}, 'object' );
		
		this.element = Js.helper.pick( obj.element, null );
		this.beforeStart = Js.helper.pick( obj.beforeStart, this.beforeStart );
		this.success = Js.helper.pick( obj.success, this.success );
		
		if ( Js.helper.isset( this.element ) ) {
			this._selector();
			this._check();
		} 
		else {
			this.interval = window.setInterval( function() {
				that._check();
			}, 100 );
		}
	},
	
	destroy: function() {
		if( Js.helper.isset( this.interval ) ) {
			clearInterval( this.interval );
			this.interval == null;
		}
		
		this.element = null;
		return null;
	},
	
	_selector: function() {
		var that = this;
		
		Js.$( this.element ).bind( 'click', function() {
			var href = Js.use( this ).attr( 'href' );
			var hash = ( Js.helper.isset( href ) ? href : this.href );
			var result;
			
			result = ( hash.match(/^\#/) ? ['', hash.substr( 1 )] : hash.split(/\#/) ); 
			
			if ( Js.helper.isfunction( that.beforeStart ) ) 
				that.beforeStart();
			
			if ( Js.helper.isset(result[1]) ) {
				that.repeat = ( result[1] === that.last );
				
				that.last = result[1];
				that.init( result[1].split(/\//) );
				
				if ( Js.helper.isfunction( that.success ) ) 
					that.success();
			}
		});
	},
	
	_check: function() {
		if ( location.hash != this.last && location.hash !== '#' ) {
			this.last = location.hash;
			
			if ( Js.helper.isfunction( this.beforeStart ) ) 
				this.beforeStart();
			
			this.init( location.hash.substr( 1 ).split( /\// ) );
			
			if ( Js.helper.isfunction( this.success ) ) 
				this.success();
		}
	}
});
