/* Adapter for Savvy.UI and jQuery Framework
 * version: 0.0.3
 * @extends jQuery
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	setClass: function( tx ) {
		return this.each( function() {
			this.className = v;
		});
	},
	htmlText: function( tx ) {
		if ( tx == undefined ) 
			return ( this[0] ? this[0].innerHTML : null );
		
		else {
			this.each(function() {
				this.innerHTML = tx;
			});
			return this;
		}
	}
});

// Bind Js.use with jQuery Object
Js.use = window.jQuery;
