/* Modal Dialog for Savvy.UI
 * version: 0.1.2
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	allowOverlay: false,
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
		this.allowOverlay = Jrun.pickType( this.setting.overlay, this.allowOverlay, "boolean" );
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) {
			this.renderTo = Js.use(this.renderTo);
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		if ( this.allowOverlay == true ) {
			this.overlay = new Js.widget.activity("#overlay-panel");
		}
		
		this._loadBorder();
		this._loadContent();
		
		if ( Jrun.isset(this.setting.button) ) {
			for ( var i = 0; i < this.setting.button.length; i++ ) { 
				this.addButton( this.setting.button[i] );
			}
		}
	
		
		if ( this.allowOverlay == true ) {
			this.overlay.activate();
		}
		
		this.fixDimension();
		
		return this;
	},
	
	closePanel: function() {
		var that = this;
		
		if ( this.allowOverlay == true ) {
			this.overlay.deactivate();
		}
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction(that.setting.onClose) ) {
				that.setting.onClose.apply(that);
			}
			
			that.node.remove();
		});
		
		return this;
	},
	
	fixDimension: function() {
		var offset = [
			this.main.width(),
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
