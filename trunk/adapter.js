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
	},
	plainHtml: function(value) {
		if (value == undefined) {
			return (this[0] ? this[0].innerHTML : null);
		}
		else if(this[0]) {
			try {
				this[0].innerHTML = value;
			} catch(e) {}
			return this;
		}
	} 
});
Js.use = window.jQuery;
