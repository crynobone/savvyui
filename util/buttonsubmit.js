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
	
	initiate: function( js ) {
		this.id = Jrun.pick( js.id, null );
		this.url = Jrun.pick( js.url, null );
		this.button = Jrun.pick( js.button, null );
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( js.option );
		
		return this;
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	_prepSetting: function() {
		this.formValidate = Js.nue( this.setting );
		this.formValidate.success = null;
		this.formValidate.onError = null;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.util[this.appName] );
		this._prepSetting();
		
		var method = Jrun.pickGrep( this.setting.method, /^(get|post)$/i );
		
		// bind onClick event delegation to the button
		Js.use( this.button ).bind( this.handler, function() {
			// we need to validate the form
			var form = new Js.ext.validate( that.id, that.formValidate );
			var params = form.cacheResult;
			
			if( !!params ) {
			   jQuery.ajax({
					type: method,
					url: that.url,
					data: params,
					beforeSend: function() {
						if ( Jrun.isfunction(that.setting.beforeSend) ) 
							that.setting.beforeSend.apply( that );
					},
					success: function( reply ) {
						var runDefault = true;
						
						if ( Jrun.isfunction(that.setting.success) ) 
							runDefault = that.setting.success.apply( that, [reply] );
						
						if ( runDefault !== false ) 
							Js.parse.xhr.init(reply);
					},
					onError: function() {
						if( Jrun.isfunction(that.setting.onError) ) 
							that.setting.onError.apply( that );
					}
				});
			}
			else {
				if( Jrun.isfunction(that.setting.onError) ) 
					that.setting.onError();
			}
			
			return false;
		});
	}
});
