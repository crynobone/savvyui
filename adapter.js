/* Adapter for Savvy.UI and jQuery Framework
 * version: 0.0.3
 * @extends jQuery
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	setClass: function( value ) {
		return this.each( function() {
			this.className = value;
		} );
	},
	
	htmlText: function( text ) {
		if ( text == undefined ) 
			return ( this[0] ? this[0].innerHTML : null );
		else {
			this.each( function() {
				this.innerHTML = text;
			} );
			
			return this;
		}
	}
});

// Bind Js.use with jQuery Object
Js.$ = window.jQuery;
