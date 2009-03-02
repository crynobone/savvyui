/* Create Active Hyperlink for Savvy.UI
 * version: 0.1.2
 */

Js.util.activeContent = Js.create({
	appName: "activeContent",
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	fnBeforeStart: null,
	fnSuccess: null,
	
	initiate: function( js ) {
		var that = this;
		var js = Jrun.pickType( js, {}, "object" );
		this.element = Jrun.pick( js.element, null );
		this.fnBeforeStart = Jrun.pick( js.beforeStart, this.fnBeforeStart );
		this.fbSuccess = Jrun.pick( js.success, this.fnSuccess );
		
		if ( Jrun.isset(this.element) ) {
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
		if( Jrun.isset(this.interval) ) {
			clearInterval( this.interval );
			this.interval == null;
		}
		
		this.element = null;
		return null;
	},
	
	_selector: function() {
		var that = this;
		
		Js.use( this.element ).bind( "click", function() {
			var href = Js.use( this ).attr( "href" );
			var hash = ( Jrun.isset(href) ? href : this.href );
			var ret;
			
			ret = ( hash.match(/^\#/) ? ["", hash.substr(1)] : hash.split(/\#/) ); 
			
			if ( Jrun.isfunction(that.fnBeforeStart) ) 
				that.fnBeforeStart();
			
			if ( Jrun.isset(ret[1]) ) {
				that.repeat = ( ret[1] === that.last );
				
				that.last = ret[1];
				that.init( ret[1].split(/\//) );
				
				if ( Jrun.isfunction(that.fnSuccess) ) 
					that.fnSuccess();
			}
		});
	},
	
	_check: function() {
		if ( location.hash != this.last && location.hash !== "#" ) {
			this.last = location.hash;
			
			if ( Jrun.isfunction(this.fnBeforeStart) ) 
				this.fnBeforeStart();
			
			this.init( location.hash.substr(1).split(/\//) );
			
			if ( Jrun.isfunction(this.fnSuccess) ) 
				this.fnSuccess();
		}
	}
});
