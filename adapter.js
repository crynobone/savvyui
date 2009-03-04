/* Adapter for Savvy.UI and jQuery Framework
 * version: 0.0.3
 * @extends jQuery
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	setClass: function(value) 
	{
		return this.each( function() {
			this.className = value;
		});
	},
	plainHtml: function( value ) {
		if ( value == undefined ) 
			return ( this[0] ? this[0].innerHTML : null );
		
		else if(this[0]) {
			try {
				this[0].innerHTML = value;
			} catch(e) {}
			
			return this;
		}
	},
	htmlText: function( value ) {
		return jQuery.fn.plainHtml( value );
	}
});

// Bind Js.use with jQuery Object
Js.use = window.jQuery;
