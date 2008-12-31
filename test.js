/**
 * @projectDescription Test value for Savvy.UI
 * @version 1.0.3
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.test = {
	/**
	 * Check if data is a string
	 * 
	 * @param {String} [data] data should be a string
	 * @return {Boolean}
	 */
	isString: function(data) 
	{
		return (typeof(data) == "string" && isNaN(data));
	},
	/**
	 * Check if data is a number
	 * 
	 * @param {Number} [data] data should be a number
	 * @return {Boolean}
	 */
	isNumber: function(data) 
	{
		return !isNaN(data);
	},
	/**
	 * Compare 'regexp' with provided 'value'
	 * 
	 * @param {String} regexp
	 * @param {Object} value
	 * @return {Boolean}
	 */
	isLength: function(data, value) 
	{
		var result = null;
		
		if(data.match(/^(exact|min|max)\-(\d*)$/i)) 
		{
			var length = Jrun.toNumber(RegExp.$2);
			
			switch(RegExp.$1) 
			{
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
		else 
		{
			result = false;
		}
		
		return result;
	},
	/**
	 * Check if data is an email address
	 * @param {String} data
	 * @return {Boolean}
	 */
	isEmail: function(data) 
	{
		return (data.match(Js.config.test.email));
	},
	/**
	 * Check if data is a URL
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isURL: function(data) 
	{
		return (data.match(Js.config.test.url));
	},
	/**
	 * Check if data is an IP Address
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isIpAddress: function(data) 
	{
		return (data.match(Js.config.test.ip));
	}
};