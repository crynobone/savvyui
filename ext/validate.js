/* Form Validation extension for Savvy.UI
 * version: 0.9.6
 */

Js.ext.validate = Js.create({
	appName: "validate",
	node: null,
	first: null,
	setting: null,
	language: null,
	data: "",
	cacheResult: null,
	
	initiate: function( node, option ) {
		return ( Jrun.isset(node) ? this.init( node, option) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.setting );
			
		return this;
	},
	
	_prepSetting: function() {
		this.setting.errorNode.match(/^(span|div|p|em|label|strong|b|i)\.(.*)$/i);
		this.setting.error = {
			node: RegExp.$1,
			cssMessage: RegExp.$2
		};
	},
	
	init: function( node, option ) {
		// ensure that refer to this
		var that = this;
		
		// node should refer to only one object
		this.node = Js.use( node ).eq(0);
		
		// setup configuration
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.ext[this.appName] );
		this.language = Js.append( this.language, Js.language.ext[this.appName] );
		
		this._prepSetting();
		
		if ( Jrun.isset(this.setting.autoExecute) && this.setting.autoExecute === true ) 
			this.result();
		
		return this;
	},
	
	result: function() {
		var that = this;
		
		var setting = this.setting;
		var fnBeforeStart = Jrun.pick( setting.beforeStart,null );
		var fnSuccess = Jrun.pick( setting.success, null );
		var fnOnError = Jrun.pick( setting.onError, null );
		this.data = "";
		var contRun = true;
		
		// set this.first to NULL
		this.first = null;
		
		if ( Jrun.isfunction(fnBeforeStart) ) {
			// execute the function and free up the memory
			contRun = fnBeforeStart.apply( this, [node] );
			fnBeforeStart = null;
		}
		
		if ( contRun === false ) 
			return false;
		
		if ( this.node.length >= 1 ) {
			// based on the form, select on input type
			Js.use(":input", this.node).each(function( i, v ) {
				that._validate( v );
			});
		}
		
		if ( Jrun.isset(this.first) ) {
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} 
			catch (e) {
				Js.debug.log( "Js.ext.form: Cannot trigger onFirstFormError " + e );
			}
			
			if ( Jrun.isfunction(fnOnError) ) 
				fnOnError.apply( this );

			
			// stop form processing
			this.cacheResult = false;
			return false;
		}
		else {
			// return all field data in querystring format
			if ( Jrun.isfunction(fnSuccess) ) 
				fnSuccess.apply( this );
			
			this.cacheResult = this.data;
			return this.data;
		}
	},
	
	_error: function( node, text ) {		
		var that = this;
		this.first = ( Jrun.isnull(this.first) ? node : this.first );
		this._messageAdd( node, text );
	},
	
	_invokeQueryString: function( node ) {
		var data = "";
		
		// dump name and value to opt in querystring format ( &name=value )
		if ( node.is(':checkbox, :radio') ) {
			if ( node.is(':checked') ) 
				data += "&" + node.attr( 'name' ) + "=" + Js.parse.html.to( node.val() );
		} 
		
		else 
			data += "&" + node.attr( 'name' ) + "=" + Js.parse.html.to( node.val() );
		
		return data;
	},
	
	_messageCleanUp: function( node ) {
		var errSpan = this.setting.errorNode;
		var errNode = node.siblings( errSpan );
		
		if ( errNode.length > 0 ) 
			errNode.remove();
	},
	
	_messageAdd: function( node, message ) {
		var that = this;
		var errorNode = node.siblings( this.setting.errorNode ).eq(0);
		
		if ( errorNode.length < 1 ) 
				Js.use( "<" + this.setting.error.node + "/>" )
					.addClass( this.setting.error.cssMessage )
					.text( message )
					.insertAfter( node[0] );
		
		else 
			errorNode.eq(0).append( '<br />' + message );
		
		node.bind( "change", function() {
			var jnode = Js.use( this );
			if ( jnode.val() != "" ) {
				that._messageCleanUp( jnode );
				that.first = null;
			}
		});
	},
	
	_validate: function( field ) {
		var that = this;
		var lang = this.language;
		var node = Js.use( field );
		var value = node.val();
		// Double confirm the element is either input, select or textarea
		
		if ( node.attr('name') != "" ) {
			// remove previously loaded error message
			that._messageCleanUp( node );
			
			// turn the className into array so we can do some testing
			var klasses = ( !!node.attr('class') ? node.attr('class') : "" );
			var klass = klasses.split(/\s/);
			var error = "";
			
			// if the element is required
			if ( !!Jrun.inArray("required", klass) ) {
				if ( Jrun.trim(value) === "" ) 
					error = lang.required;
				else {
					var indexLength = Jrun.indexOfGrep( /^(max|min|exact)\-(\d*)$/i, klass );
					
					if ( indexLength > -1 ) {
						var types = RegExp.$1;
						var values = RegExp.$2;
						
						if ( !Js.test.isLength(klass[indexLength], value.length) ) {
							if ( types == "min" ) 
								types = lang.max;
							
							else if ( types == "max" ) 
								types = lang.min;
							
							else if ( types == "exact" ) 
								types = lang.exact;
							
							var note = lang.length;
							note = note.replace(/{type}/, types);
							note = note.replace(/{value}/, values);
							
							this._error( node, note );
						}
					}
				}
			}
			
			var indexMatch = Jrun.indexOfGrep( /^match-(.*)$/i, klass );
			
			if ( indexMatch > -1 ) {
				var matched = fields.is( ":input[name='" + RegExp.$1 + "']" );
				
				if ( value != matched.val() && error == "" ) 
					error = lang.matched;
			}
			
			// this set of validate only triggered when this.value isn't empty
			if ( Jrun.trim(value) != "" ) {
				if ( !!Jrun.inArray("string", klass) && !Js.test.isString(value) ) 
					error = lang.string;
				
				else if ( !!Jrun.inArrayGrep(/^(integer|number)$/, klass) && !Js.test.isNumber(value) ) 
					error = lang.number;
				
				else if ( !!Jrun.inArray("email", klass) && !Js.test.isEmail(value) ) 
					error = lang.email;
			}
			
			var testIndex = Jrun.indexOfGrep( /^(custom)\-(\w*)$/g, klass );
			
			if ( testIndex > -1 ) {
				var tester = Jrun.camelize( klass[testIndex] );
				var validate = this.setting[tester];
				
				if ( Jrun.isset(validate) ) {
					var required = Jrun.pickType( validate.required, false, "boolean" );
					
					if ( required === true && Jrun.trim(value) === "" ) 
						error = Jrun.pickType( validate.error, error, "string" );
					
					if ( Jrun.trim(value) !== "" ) {
						if ( Jrun.isfunction(validate.callback) && !validate.callback(value) ) 
							error = Jrun.pickType( validate.error, error, "string" );
						
						else if ( validate.regex && !value.match(validate.regex) ) 
							error = Jrun.Jrun.pickType( validate.error, error, "string" );
					}
				}
			}
			
			if ( error !== "" ) 
				that._error( node, error );
			
			this.data += this._invokeQueryString( node );
		}
	}
});