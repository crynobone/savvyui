/**
 * @version 
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license
 */

Js.test = {
	/**
	 * Check whether passed argument is a string
	 * @param {String} data
	 * @return {String}
	 */
	isString: function(data) 
	{
		return (typeof(data) == "string" && isNaN(data));
	},
	/**
	 * Check whether passed argument is a number
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isNumber: function(data) 
	{
		return !isNaN(data);
	},
	/**
	 * Compare 'regexp' with provided 'value'
	 * @param {String} regexp
	 * @param {Object} value
	 * @return {Boolean}
	 */
	isLength: function(regexp, value) 
	{
		var data = regexp.split(/\-/);
		var length = Jrun.toNumber(data[1]);
		var result = null;
		
		if (data[0] === "max") 
		{
			result = (value <= length ? true : false);
		}
		else if (data[0] === "min") 
		{
			result = (value >= length ? true : false);
		} 
		else if (data[0] === "exact") 
		{
			result = (value == length ? true : false);
		} 
		else 
		{
			result = true;
		}
		
		return result;
	},
	/**
	 * Check if 'data' is an email address
	 * @param {String} data
	 * @return {Boolean}
	 */
	isEmail: function(data) 
	{
		return (data.match(Js.config.test.email));
	},
	/**
	 * Check if 'data' is a URL
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isURL: function(data) 
	{
		return (data.match(Js.config.test.url));
	},
	/**
	 * Check if 'data' is an IP Address
	 * @param {Object} data
	 * @return {Boolean}
	 */
	isIpAddress: function(data) 
	{
		return (data.match(Js.config.test.ip));
	}
};