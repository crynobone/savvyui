/*
 * Create a new Class with some simple Object-Oriented capability
 * Based from Simple JavaScript Inheritance by John Resig http://ejohn.org/blog/simple-javascript-inheritance/
 * version: 0.4.1 
 */

Js.create = function( js ) {
	var base = function() {};
	base.prototype.destroy = function() {
		// remove all properties and method for this object
		for ( var method in this ) 
			this[method] = null;
				
		for ( var method in this.prototype ) 
			this.prototype[method] = null;
			
		// delete this (which doesn't actually totally delete it
		delete this;
		
		return null;
	};
	
	var initialized = true;
	
	// add prototyping based on Js.base
	var prototype = new base;
	initialized = false;
	
	// Class is a dummy constructor allowing user to automatically call __construct or parent::__construct 
	function Class() {
		// initiate the __construct function if construct available
		if ( !initialized && !!this.initiate ) 
			this.initiate.apply( this, Jrun.toArray(arguments) );
	};
	
	Class.prototype = prototype;
	Class.prototype.initiate = Jrun.pick( js.initiate, js.__construct, null );
	Class.constructor = Class;
	
	Class.prototype.$inject = function( method, args ) {
		if ( Jrun.isfunction(method) ) 
			return method.apply( this, Jrun.toArray(arguments, 1) );
	};
	
	Class.prototype.$const = (function( js ) {
		var $const = { };
		
		if ( Jrun.typeOf(js.Const) == "object" ) {
			var $const = Js.nue( js.Const );
			delete js.Const;
		}
		
		return (function( method, args ) {
			if ( Jrun.typeOf(method) == "string" ) {
				if ( Jrun.isfunction($const[method]) ) 
					return $const[method].apply( this, Jrun.toArray(arguments, 1) );
				else 
					return $const[method];
			}
		});
	})( js );
	
	// create inheritance capability using .extend
	Class.extend = function( js ) {
		js.Extend = this;	
		return Js.create( js );
	};
	
	// if this function is being called from .extend, prepare parent method inheritant
	var Extend = Jrun.pick( js.Extend, null );
	
	// assign object with method provided in js
	(function( js ) {
		// restrict object from looping certain method
		var not = ["Extend", "__construct", "__destruct", "$super", "prototype"];
		
		// add method to this object
		for ( var method in js ) {
			if ( js.hasOwnProperty(method) && (!Jrun.inArray(method, not) && !this[method]) ) 
				this[method] = js[method];
		};
		
	}).call( prototype, js );
	
	// object called from .extend, inherit parent method if object does not have it's own method
	if( !!Jrun.isset(Extend) ) {
		try {
			(function( ext ) {
				// restrict object from looping certain method
				var not = ["Extend", "__construct", "__destruct", "$super", "prototype"];
				
				for ( var method in ext ) {
					if ( ext.hasOwnProperty(method) && (!Jrun.inArray(method, not) && !this[method]) ) 
						this[method] = ext[method];
				}
				
				for ( var method in ext.prototype ) {
					if ( ext.prototype.hasOwnProperty(method) && (!Jrun.inArray(method, not) && !this[method]) ) 
						this[method] = ext.prototype[method];
				}
				
				// create a linkage to the parent object
				this.$super = ext.prototype;
			}).call( prototype, Extend );
		
		} catch(e) {
			// incase something goes wrong
			Js.debug.error( "Js.create: failed " + e );
		}
		
		Class.prototype.$parent = function( method, args ) {
			return this.$super[method].apply( this, Jrun.toArray(arguments, 1) );
		};
	}
	
	// avoid Extend to be duplicated in this.prototype 
	delete Extend;
	delete js;
	
	return Class;
};
