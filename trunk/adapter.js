/**
 * @projectDescription Adapter for Savvy.UI and jQuery Framework
 * @version 0.0.1
 * @extends jQuery-1.2.6
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	/**
	 * revert and set new className to jQuery object
	 * <br>Equal to: $("div").removeClass().addClass(value);
	 * @param {Object} value
	 * @return {jQuery}
	 */
	setClass: function(value) 
	{
		return this.each(function() {
			this.className = value;
		});
	}
});

Js.use = jQuery.noConflict();
