/* Allow a customizable form submission via submit button complete with XHR Request
 * version: 0.0.2
 */

Js.util.formSubmit = Js.util.buttonSubmit.extend({
	appName: 'formSubmit',
	handler: 'submit',
	
	initiate: function( obj ) {
		if ( Js.on.parameter( arguments, 1, ['object'] ) ) {
			this.id = Js.on.pick( obj.id, null );
			this.url = Js.on.pick( obj.url, null );	
		} 
		else if ( Js.on.parameter( arguments, 2, [true, "string"] ) ) {
			this.id = Js.on.pick( arguments[0], null );
			this.url = Js.on.pick( arguments[1], null );
		}
		
		this.button = this.id;
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( obj.option );
		
		return this;
	}
});
