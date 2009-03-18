/* Modal Dialog for Savvy.UI
 * version: 0.1.2
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		var opt = this.setting;
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) {
			this.renderTo = Js.use(this.renderTo);
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		if ( !!opt.overlay ) 
			this.overlay = new Js.widget.activity("#overlay-panel");
		
		
		this._loadBorder();
		this._loadContent();
		
		if ( Jrun.isset( opt.button ) ) {
			for ( var i = 0; i < opt.button.length; i++ ) 
				this.addButton( opt.button[i] );
		}
	
		
		if ( !!opt.overlay ) 
			this.overlay.activate();
		
		this.fixDimension();
		
		if ( !!opt.clickOver && !!opt.overlay ) {
			this.overlay.node.one("click", function() {
				that.closePanel( opt.onClickOver );
			});
		}
		
		return this;
	},
	
	closePanel: function( fn ) {
		var that = this,
			opt = this.setting;
		
		if ( !!opt.overlay ) 
			this.overlay.deactivate();
			
		if ( Jrun.isfunction( fn ) )
			fn.apply( this );
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction(that.setting.onClose) ) 
				that.setting.onClose.apply(that);
			
			that.node.remove();
		});
		
		return this;
	},
	
	fixDimension: function() {
		var width = ( this.main.width() > Jrun.pickType(this.setting.width, 0, 'number') ? this.main.width() : this.setting.width );
		
		var offset = [
			width,
			this.main.height()
		];
		
		var center = Js.util.dimension.page.middle( offset[0], offset[1] );
		var left = center[1];
		var top = center[0];
		
		left = (left < 0 ? 0 : left);
		top = (top < 0 ? 0 : top);
		
		this.node.css({
			"position": "absolute", 
			"top": top + "px", 
			"left": left + "px",
			"zIndex": 6000
		});
	}
});
