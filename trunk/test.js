/* Input test script for Savvy.UI
 * version: 1.0.3
 */

Js.test = {
	isString: function( value ) {
		return ( typeof( value ) == 'string' && isNaN( value ) );
	},
	
	isNumber: function( value ) {
		return !isNaN( value );
	},
	
	isLength: function( data, value ) {
		var result = false;
		
		if ( data.match(/^(max|min|exact)\-(\d*)$/i) ) {
			var type = RegExp.$1;
			var length = Js.helper.toNumber( RegExp.$2 );
			
			switch ( type ) {
				case 'max':
					result = value <= length;
					break;
				case 'min':
					result = value >= length;
					break;
				case 'exact':
					result = value == length;
					break;
				default:
					result = false;
			}
		}
		
		return result;
	},
	
	isEmail: function( value ) {
		return ( value.match( Js.config.test.email ) );
	},
	
	isURL: function( value ) {
		return ( value.match( Js.config.test.url ) );
	},
	
	isIpAddress: function( value ) {
		return ( value.match( Js.config.test.ip ) );
	},
	
	isPostcode: function( value ) {
		return ( value.match( Js.config.test.postcode ) );
	}
};