/* Input test script for Savvy.UI
 * version: 1.0.3
 */

Js.test = {
	isString: function( data ) {
		return ( typeof(data) == "string" && isNaN(data) );
	},
	
	isNumber: function( data ) {
		return !isNaN( data );
	},
	
	isLength: function( data, value ) {
		var ret = false;
		
		if ( data.match(/^(exact|min|max)\-(\d*)$/i) ) {
			var length = Jrun.toNumber(RegExp.$2);
			
			switch ( RegExp.$1 ) {
				case 'max':
					ret = value <= length;
					break;
				case 'min':
					ret = value >= length;
					break;
				case 'exact':
					ret = value == length;
					break;
				default:
					ret = false;
			}
		}
		
		return ret;
	},
	
	isEmail: function( data ) {
		return ( data.match(Js.config.test.email) );
	},
	
	isURL: function( data ) {
		return ( data.match(Js.config.test.url) );
	},
	
	isIpAddress: function( data ) {
		return ( data.match(Js.config.test.ip) );
	},
	
	isPostcode: function( data ) {
		return ( data.match(Js.config.test.postcode) );
	}
};