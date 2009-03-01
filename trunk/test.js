/**
 * @projectDescription Input test script for Savvy.UI
 * @version 1.0.3
 * @memberOf Js
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.test = {
	isString: function(data) {
		return (typeof(data) == "string" && isNaN(data));
	},
	isNumber: function(data) {
		return !isNaN(data);
	},
	isLength: function(data, value) {
		var result = null;
		
		if (data.match(/^(exact|min|max)\-(\d*)$/i)) {
			var length = Jrun.toNumber(RegExp.$2);
			
			switch(RegExp.$1) {
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
		else {
			result = false;
		}
		
		return result;
	},
	isEmail: function(data) {
		return (data.match(Js.config.test.email));
	},
	isURL: function(data) {
		return (data.match(Js.config.test.url));
	},
	isIpAddress: function(data) {
		return (data.match(Js.config.test.ip));
	},
	isPostcode: function(data) {
		return (data.match(Js.config.test.postcode));
	}
};