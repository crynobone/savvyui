/* Allow a customizable form submission via button complete with XHR Request
 * version: 0.0.2
 */

Js.util.buttonSubmit = Js.create({
	appName: 'buttonSubmit',
	id: null,
	url: null,
	button: null,
	setting: null,
	handler: 'click',
	formValidate: null,
	
	initiate: function( obj ) {
		this.id = Js.helper.pick( obj.id, null );
		this.url = Js.helper.pick( obj.url, null );
		this.button = Js.helper.pick( obj.button, null );
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( obj.option );
		
		return this;
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	_prepare: function() {
		this.formValidate = Js.nue( this.setting );
		this.formValidate.success = this.setting.formSuccess;
		this.formValidate.onError = this.setting.formError;
	},
	
	init: function( obj ) {
		var that = this;
		
		this.setup( obj );
		this.setting = Js.append( this.setting, Js.config.util[this.appName] );
		this._prepare();
		
		var method = Js.helper.pickGrep( this.setting.method, /^(get|post)$/i );
		
		// bind onClick event delegation to the button
		Js.$( this.button ).bind( this.handler, function() {
			// we need to validate the form
			var form = new Js.ext.validate( that.id, that.formValidate );
			var result = form.result;
			
			if ( !!result ) {
			   Js.$.ajax({
					type: method,
					url: that.url,
					data: result,
					beforeSend: function() {
						if ( Js.helper.isfunction( that.setting.beforeSend ) ) 
							that.setting.beforeSend.apply( that );
					},
					success: function( reply ) {
						var run_default = true;
						
						if ( Js.helper.isfunction( that.setting.sendSuccess ) ) 
							run_default = that.setting.sendSuccess.apply( that, [reply] );
						
						if ( run_default !== false ) 
							Js.parse.xhr.init( reply );
					},
					onError: function() {
						if( Js.helper.isfunction( that.setting.onSendError ) ) 
							that.setting.onSendError.apply( that );
					}
				});
			}
			
			return false;
		});
	}
});
