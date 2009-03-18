/*
 * Create a new Class with some simple Object-Oriented capability
 * Based from Simple JavaScript Inheritance by John Resig http://ejohn.org/blog/simple-javascript-inheritance/
 * version: 0.4.1 
 */

Js.create = function( jo ) {
	var jo = Jrun.pickType( jo, {}, "object" );
	var base = function() {};
	
	base.prototype.destroy = function() {
		// remove all properties and method for this object
		for ( var m in this ) 
			this[m] = null;
				
		for ( var m in this.prototype ) 
			this.prototype[m] = null;
			
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
			this.initiate.apply( this, Jrun.toArray(arguments) );
	};
	
	Class.prototype = proto;
	Class.prototype.initiate = Jrun.pick( jo.initiate, jo.__construct, null );
	Class.constructor = Class;
	
	Class.prototype.$inject = function( fn ) {
		if ( Jrun.isfunction(fn) ) 
			return fn.apply( this, Jrun.toArray(arguments, 1) );
	};
	
	Class.prototype.$const = (function( jo ) {
		var $const = { };
		
		if ( Jrun.typeOf(jo.Const) == "object" ) {
			var $const = Js.nue( jo.Const );
			delete jo.Const;
		}
		
		return (function( fn ) {
			if ( Jrun.typeOf(fn) == "string" ) {
				if ( Jrun.isfunction($const[fn]) ) 
					return $const[fn].apply( this, Jrun.toArray(arguments, 1) );
				else 
					return $const[fn];
			}
		});
	})( jo );
	
	// create inheritance capability using .extend
	Class.extend = function( jo ) {
		jo.Extend = this;	
		return Js.create( jo );
	};
	
	// if this function is being called from .extend, prepare parent method inheritant
	var Extend = Jrun.pick( jo.Extend, null );
	
	// assign object with method provided in js
	(function( proto ) {
		// restrict object from looping certain method
		var not = ["Extend", "__construct", "__destruct", "$super", "prototype"];
		
		// add method to this object
		for ( var m in proto ) {
			if ( proto.hasOwnProperty(m) && (!Jrun.inArray(m, not) && !this[m]) ) 
				this[m] = proto[m];
		};
		
	}).call( proto, jo );
	
	// object called from .extend, inherit parent method if object does not have it's own method
	if( !!Jrun.isset(Extend) ) {
		try {
			(function( proto ) {
				// restrict object from looping certain method
				var not = ["Extend", "__construct", "__destruct", "$super", "prototype"];
				
				for ( var m in proto.prototype ) {
					if ( proto.prototype.hasOwnProperty(m) && (!Jrun.inArray(m, not) && !this[m]) ) 
						this[m] = proto.prototype[m];
				}
				
				for ( var m in proto ) {
					if ( proto.hasOwnProperty(m) && !Jrun.inArray(m, not) ) {
						if ( !this[m] )
							this[m] = proto[m];
						
					}
				}
				
				
				
				// create a linkage to the parent object
				this.$super = proto.prototype;
				
			}).call( proto, Extend );
		
		} catch(e) {
			// incase something goes wrong
			Js.debug.error( "Js.create: failed " + e );
		}
		
		Class.prototype.$parent = function( fn ) {
			return this.$super[fn].apply( this, Jrun.toArray(arguments, 1) );
		};
	}
	
	// avoid Extend to be duplicated in this.prototype 
	delete Extend;
	delete jo;
	
	return Class;
};
