/* Input test script for Savvy.UI
 * version: 1.0.3
 */

Js.test = {
	isString: function( v ) {
		return ( typeof(v) == "string" && isNaN(v) );
	},
	
	isNumber: function( v ) {
		return !isNaN( v );
	},
	
	isLength: function( dt, v ) {
		var r = false;
		
		if ( dt.match(/^(exact|min|max)\-(\d*)$/i) ) {
			var l = Jrun.toNumber(RegExp.$2);
			
			switch ( RegExp.$1 ) {
				case 'max':
					r = v <= l;
					break;
				case 'min':
					r = v >= l;
					break;
				case 'exact':
					r = v == l;
					break;
				default:
					r = false;
			}
		}
		
		return r;
	},
	
	isEmail: function( v ) {
		return ( v.match(Js.config.test.email) );
	},
	
	isURL: function( v ) {
		return ( v.match(Js.config.test.url) );
	},
	
	isIpAddress: function( v ) {
		return ( v.match(Js.config.test.ip) );
	},
	
	isPostcode: function( v ) {
		return ( v.match(Js.config.test.postcode) );
	}
};