/* Form Validation extension for Savvy.UI
 * version: 0.9.7
 */

Js.ext.validate = Js.create({
	appName: 'validate',
	node: null,
	first: null,
	setting: null,
	language: null,
	data: '',
	test: {
		match: [],
		compareDate: []
	},
	result: null,
	
	initiate: function( node, option ) {
		return ( Js.helper.isset( node ) ? this.init( node, option ) : this );
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting, ['lang'], true );
		
		if( Js.helper.isset( option.lang ) ) 
			this.language = Js.append( option.lang, this.setting );
			
		return this;
	},
	
	_prepare: function() {
		this.setting.errorNode.match( /^(span|div|p|em|label|strong|b|i)\.(.*)$/i );
		this.setting.error = {
			node: RegExp.$1,
			cssMessage: RegExp.$2
		};
	},
	
	init: function( node, option ) {
		// ensure that refer to this
		var that = this;
		
		// node should refer to only one object
		this.node = Js.$( node ).eq( 0 );
		
		// setup configuration
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.ext[this.appName] );
		this.language = Js.append( this.language, Js.language.ext[this.appName] );
		
		this._prepare();
		
		if ( Js.helper.isset( this.setting.auto ) && this.setting.auto === true ) 
			this.run();
		
		return this;
	},
	
	run: function() {
		var that = this;
		var setting = this.setting;
		var fn_before_start = Js.helper.pick( setting.beforeStart, null );
		var fn_success = Js.helper.pick( setting.success, null );
		var fn_on_error = Js.helper.pick( setting.onError, null );
		var continue_run = true;
		
		// start over
		this.data = '';
		this.first = null;
		
		if ( Js.helper.isfunction( fn_before_start ) ) {
			// execute the function and free up the memory
			continue_run = fn_before_start.apply( this );
			fn_before_start = null;
		}
		
		if ( continue_run === false ) 
			return false;
		
		if ( this.node.length >= 1 ) {
			// based on the form, select on input type
			Js.$( ':input', this.node ).each( function( index, value ) {
				that._validate( value );
			} );
		}
		
		if ( Js.helper.isset( this.first ) ) {
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} 
			catch (e) {
				Js.debug.log( 'Js.ext.form: Cannot trigger onFirstFormError ' + e );
			}
			
			if ( Js.helper.isfunction( fn_on_error ) ) 
				fn_on_error.apply( this );
			
			// stop form processing
			this.result = false;
			
			return false;
		}
		else {
			// return all field data in querystring format
			if ( Js.helper.isfunction( fn_success ) ) 
				fn_success.apply( this );
			
			this.result = this.data;
			return this.data;
		}
	},
	
	_error: function( node, text ) {		
		var that = this;
		this.first = ( Js.helper.isnull( this.first ) ? node : this.first );
		this._addError( node, text );
	},
	
	_data: function( node ) {
		var data = '';
		
		// dump name and value to opt in querystring format ( &name=value )
		if ( node.is(':checkbox, :radio') ) {
			if ( node.is(':checked') ) 
				data += '&' + node.attr( 'name' ) + '=' + Js.parse.html.to( node.val() );
		} 
		
		else 
			data += '&' + node.attr( 'name' ) + '=' + Js.parse.html.to( node.val() );
		
		return data;
	},
	
	_removeError: function( node ) {
		var error_span = this.setting.errorNode;
		var error_node = node.siblings( error_span );
		
		if ( error_node.length > 0 ) 
			error_node.remove();
	},
	
	_addError: function( node, message ) {
		var that = this;
		var error_node = node.siblings( this.setting.errorNode ).eq(0);
		
		if ( error_node.length < 1 ) 
				Js.$( '<' + this.setting.error.node + '/>' )
					.addClass( this.setting.error.cssMessage )
					.text( message )
					.insertAfter( node[0] );
		
		else 
			error_node.eq(0).append( '<br />' + message );
		
		node.bind( 'change', function() {
			var obj = Js.$( this );
			if ( obj.val() !== '' ) {
				that._removeError( obj );
				that.first = null;
			}
		});
	},
	
	_validate: function( field ) {
		var that = this;
		var lang = this.language;
		var node = Js.$( field );
		var value = node.val();
		
		if ( node.attr('name') != '' ) {
			// remove previously loaded error message
			that._removeError( node );
			
			// turn the className into array so we can do some testing
			var klasses = ( !!node.attr('class') ? node.attr('class') : '' );
			var klass = klasses.split(/\s/);
			var error = '';
			
			// if the element is required
			if ( !!Js.helper.inArray( 'required', klass ) && Js.helper.trim( value ) == '' ) {
				error = lang.required;
			}
			
			// this set of validate only triggered when this.value isn't empty
			if ( Js.helper.trim( value ) != '' ) {
				
				if ( !!Js.helper.inArray( 'string', klass ) && !Js.test.isString( value ) ) 
					error = lang.string;
				else if ( !!Js.helper.inArrayGrep( /^(integer|number)$/, klass ) && !Js.test.isNumber( value ) ) 
					error = lang.number;
				else if ( !!Js.helper.inArray( 'email', klass ) && !Js.test.isEmail( value ) ) 
					error = lang.email;
				
				var indexof_length = Js.helper.indexOfGrep( /^(max|min|exact)\-(\d*)$/i, klass );
					
				if ( indexof_length > -1 ) {
					var types = RegExp.$1;
					var values = RegExp.$2;
					
					if ( !Js.test.isLength( klass[indexof_length], value.length ) ) {
						switch ( types ) {
							case 'min' :
								types = lang.min;
								break;
							case 'max' :
								types = lang.max;
								break;
							case 'exact' :
								types = lang.exact;
								break;
						}
						
						var note = lang.length;
						note = note.replace( /{type}/, types );
						note = note.replace( /{value}/, values );
						
						this._error( node, note );
					}
				}
			}
			
			var indexof_custom = Js.helper.indexOfGrep( /^(custom)\-(\w*)$/g, klass );
			
			if ( indexof_custom > -1 ) {
				var custom_keyword = Js.helper.camelize( klass[indexof_custom] );
				var validate = this.setting[custom_keyword];
				
				if ( Js.helper.isset( validate ) ) {
					var required = Js.helper.pickType( validate.required, false, 'boolean' );
					
					if ( required === true && Js.helper.trim( value ) === '' ) 
						error = Js.helper.pickType( validate.error, error, 'string' );
					
					if ( Js.helper.trim( value ) !== '' ) {
						if ( Js.helper.isfunction( validate.callback ) && !validate.callback( value ) ) 
							error = Js.helper.pickType( validate.error, error, 'string' );
						
						else if ( validate.regex && !value.match( validate.regex ) ) 
							error = Js.helper.pickType( validate.error, error, 'string' );
					}
				}
			}
			
			Js.debug.log( error );
			
			if ( error != '' ) 
				that._error( node, error );
			
			this.data += this._data( node );
		}
	}
});