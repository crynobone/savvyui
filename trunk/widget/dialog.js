/* Modal Dialog for Savvy.UI
 * version: 0.1.2
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	
	_prepare: function() {
		this.renderTo = Js.helper.pick( this.setting.renderTo, 'body:eq(0)' );
		this.element = this.setting.element;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepare();
		
		var option = this.setting;
		
		// set renderTo element
		if ( typeof( this.renderTo ) === 'string' || this.renderTo.nodeType ) {
			this.renderTo = Js.$( this.renderTo );
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.$('body').eq(0);
		}
		
		if ( !!option.overlay ) 
			this.overlay = new Js.widget.activity( '#overlay-panel' );
		
		
		this._loadBorder();
		this._loadContent();
		
		if ( Js.helper.isset( option.button ) ) {
			for ( var i = 0; i < option.button.length; i++ ) 
				this.addButton( option.button[i] );
		}
	
		
		if ( !!option.overlay ) 
			this.overlay.activate();
		
		this.fixDimension();
		
		if ( !!option.clickOver && !!option.overlay ) {
			this.overlay.node.one('click', function() {
				that.closePanel( option.onClickOver );
			});
		}
		
		return this;
	},
	
	closePanel: function( callback ) {
		var that = this,
			option = this.setting;
		
		if ( !!option.overlay ) 
			this.overlay.deactivate();
			
		if ( Js.helper.isfunction( callback ) )
			callback.apply( this );
		
		// callback to close panel
		this.node.fadeOut( 'slow', function() {
			if ( Js.helper.isfunction( that.setting.onClose ) ) 
				that.setting.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	fixDimension: function() {
		var width = ( this.main.width() > Js.helper.pickType( this.setting.width, 0, 'number') ? this.main.width() : this.setting.width );
		
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
			'position': 'absolute', 
			'top': top + 'px', 
			'left': left + 'px',
			'zIndex': 6000
		});
	}
});
