/*
 * Create a new Class with some simple Object-Oriented capability
 * Based from Simple JavaScript Inheritance by John Resig http://ejohn.org/blog/simple-javascript-inheritance/
 * version: 0.4.1 
 */

Js.create = function( obj ) {
	var obj = Js.helper.pickType( obj, {}, "object" );
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
	
	var initd = true;
	
	// add prototyping based on Js.base
	var proto = new base;
	initd = false;
	
	// Class is a dummy constructor allowing user to automatically call __construct or parent::__construct 
	function Class() {
		// initiate the __construct function if construct available
		if ( !initd && !!this.initiate ) 
			this.initiate.apply( this, Js.helper.toArray( arguments ) );
	};
	
	Class.prototype = proto;
	Class.prototype.initiate = Js.helper.pick( obj.initiate, obj.__construct, null );
	Class.constructor = Class;
	
	Class.prototype.$inject = function( fn ) {
		if ( Js.helper.isfunction( fn ) ) 
			return fn.apply( this, Js.helper.toArray( arguments, 1 ) );
	};
	
	Class.prototype.$const = (function( object ) {
		var $const = { };
		
		if ( Js.helper.typeOf( object.Const ) == "object" ) {
			var $const = Js.nue( object.Const );
			delete object.Const;
		}
		
		return (function( fn ) {
			if ( Js.helper.typeOf( fn ) == "string" ) {
				if ( Js.helper.isfunction( $const[fn] ) ) 
					return $const[fn].apply( this, Js.helper.toArray( arguments, 1 ) );
				else 
					return $const[fn];
			}
		});
	})( obj );
	
	// create inheritance capability using .extend
	Class.extend = function( obj ) {
		obj.Extend = this;	
		return Js.create( obj );
	};
	
	// if this function is being called from .extend, prepare parent method inheritant
	var Extend = Js.helper.pick( obj.Extend, null );
	
	// assign object with method provided in js
	(function( proto ) {
		// restrict object from looping certain method
		var not = ["Extend", "__construct", "__destruct", "$super", "prototype"];
		
		// add method to this object
		for ( var method in proto ) {
			if ( proto.hasOwnProperty( method ) && (!Js.helper.inArray( method, not ) && !this[method] ) ) 
				this[method] = proto[method];
		};
		
	}).call( proto, obj );
	
	// object called from .extend, inherit parent method if object does not have it's own method
	if ( !!Js.helper.isset( Extend ) ) {
		try {
			(function( proto ) {
				// restrict object from looping certain method
				var not = ["Extend", "__construct", "__destruct", "$super", "prototype"];
				
				for ( var method in proto.prototype ) {
					if ( proto.prototype.hasOwnProperty( method ) && (!Js.helper.inArray( method, not ) && !this[method] ) ) 
						this[method] = proto.prototype[method];
				}
				
				for ( var method in proto ) {
					if ( proto.hasOwnProperty( method ) && !Js.helper.inArray( method, not ) ) {
						if ( !this[method] )
							this[method] = proto[method];	
					}
				}
				
				// create a linkage to the parent object
				this.$super = proto.prototype;
				
			}).call( proto, Extend );
		
		} catch(e) {
			// incase something goes wrong
			Js.debug.error( 'Js.create: failed ' + e );
		}
		
		Class.prototype.$parent = function( fn ) {
			return this.$super[fn].apply( this, Js.helper.toArray( arguments, 1 ) );
		};
	}
	
	// avoid Extend to be duplicated in this.prototype 
	delete Extend;
	delete obj;
	
	return Class;
};
