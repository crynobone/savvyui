/**
 * Adapter for Savvy.UI and jQuery Framework
 * @version 0.0.1
 * @extends jQuery-1.2.6
 * @author Mior Muhammad Zaki for Codenitive
 * @namespace jQuery
 */

jQuery.fn.extend({
	setClass: function(value) 
	{
		return this.each(function() {
			this.className = value;
		});
	}
});