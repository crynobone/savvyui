/* Allow a customizable form submission via button complete with XHR Request
 * version: 0.0.2
 */

Js.util.buttonSubmit = Js.create({
	appName: "buttonSubmit",
	id: null,
	url: null,
	button: null,
	setting: null,
	handler: "click",
	formValidate: null,
	
	initiate: function( jo ) {
		this.id = Jrun.pick( jo.id, null );
		this.url = Jrun.pick( jo.url, null );
		this.button = Jrun.pick( jo.button, null );
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( jo.option );
		
		return this;
	},
	
	setup: function( opt ) {
		var opt = Jrun.pickType( opt, {}, "object" );
		this.setting = Js.append( opt, this.setting );
		
		return this;
	},
	
	_prepSetting: function() {
		this.formValidate = Js.nue( this.setting );
		this.formValidate.success = this.setting.formSuccess;
		this.formValidate.onError = this.setting.formError;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.util[this.appName] );
		this._prepSetting();
		
		var method = Jrun.pickGrep( this.setting.method, /^(get|post)$/i );
		
		// bind onClick event delegation to the button
		Js.use( this.button ).bind( this.handler, function() {
			// we need to validate the form
			var f = new Js.ext.validate( that.id, that.formValidate );
			var dt = f.cacheResult;
			
			if( !!dt ) {
			   jQuery.ajax({
					type: method,
					url: that.url,
					data: dt,
					beforeSend: function() {
						if ( Jrun.isfunction(that.setting.beforeSend) ) 
							that.setting.beforeSend.apply( that );
					},
					success: function( reply ) {
						var runDefault = true;
						
						if ( Jrun.isfunction(that.setting.sendSuccess) ) 
							runDefault = that.setting.sendSuccess.apply( that, [reply] );
						
						if ( runDefault !== false ) 
							Js.parse.xhr.init(reply);
					},
					onError: function() {
						if( Jrun.isfunction(that.setting.onSendError) ) 
							that.setting.onSendError.apply( that );
					}
				});
			}
			
			return false;
		});
	}
});
