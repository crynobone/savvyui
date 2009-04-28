/* Allow a customizable form submission via submit button complete with XHR Request
 * version: 0.0.2
 */

Js.util.formSubmit = Js.util.buttonSubmit.extend({
	appName: "formSubmit",
	handler: "submit",
	
	initiate: function( jo ) {
		if ( Jrun.parameter(arguments, 1, ["object"]) ) {
			this.id = Jrun.pick( jo.id, null );
			this.url = Jrun.pick( jo.url, null );	
		} 
		else if ( Jrun.parameter( arguments, 2, [true, "string"] ) ) {
			this.id = Jrun.pick( arguments[0], null );
			this.url = Jrun.pick( arguments[1], null );
		}
		
		this.button = this.id;
		
		// if id, url and button have been defined, straight away call this.init()
		if( !!this.id && !!this.url && this.button ) 
			this.init( jo.option );
		
		return this;
	}
});

