/* Map Savvy.UI Global Namespace Object
 * namespace: Js
 */
var Js = {
	adapter: "jQuery-1.3.2",
	version: "1.2.0-draft",
	use: null,
	debug: {},
	data: {},
	ext: {},
	util: {},
	parse: {},
	test: {},
	widget: {},
	config: {
		ext: {},
		util: {},
		widget: {}
	},
	setup: {
		ext: {},
		util: {},
		widget: {}
	},
	language: {
		ext: {},
		util: {},
		widget: {}
	}
};

Js.toString = function() {
	return ["Savvy.UI", "version", Js.version, "using", Js.adapter].join(" ");	
};

Js.nue = function( data, depth ) {
	var depth = Jrun.pickType( depth, 1, "number" );
	var type = Jrun.typeOf( data );
	
	if ( Jrun.inArray(type, ["object", "array"]) ) {
		var ret = ( type == "object" ? {} : [] );
		--depth;
		
		for ( var method in data ) {
			if ( data.hasOwnProperty(method) ) 
				ret[method] = ( depth > 0 ? Js.nue(ret[method], depth) : data[method] );
		}
		
		return ret;
	}
	else 
		return data;
};

Js.append = function( data, base, filter, invert ) {
	var filter = Jrun.pickType( filter, null, "array" );
	var invert = Jrun.pickType( invert, false, "boolean" );
	
	if ( Jrun.typeOf( data ) !== "object" )
		data = {};
	
	var ret = data;
	
	// loop value's method
	for ( var method in base ) {
		// if data doesn't have the method add it
		var valid = ( Jrun.isnull(filter) || Jrun.inArray(method, filter) );
		var unique = ( !data.hasOwnProperty(method) && base.hasOwnProperty(method) );
		var valid = ( !!invert ? !valid : valid );
		 
		if ( !!unique && !!valid )
			ret[method] = base[method];
	}
	
	return ret;
};

// Debugging engine for Savvy.UI
Js.debug = {
	// Set to true to display error message in the output
	enable: false,
	
	// Set to true to display all log for dev purpose
	dev: false,
	
	// error/log stack
	data: {
		// contain all errors
		error: [],
		// cocntain all logs
		log: []
	},
	
	// Log a message/note
	log: function( text ) {
		// push log to stack
		this.data.log.push( text );
		
		if ( !!this.dev ) {
			try {
				console.log(text);
			}
			catch(e) {
				alert(text);
			}
		}
	},
	
	// Log an error
	error: function( text ) {
		// push error to stack
		this.data.error.push( text );
		
		// if Js.debug.enable is true, display the error
		if ( !!this.enable ) {
			try {
				// good browser come with console
				console.log(text);
			} 
			catch(e) {
				// browser doesn't support console so alert
				alert(text);
			}
		}
	}
};

/* Misc function for Savvy.UI
 * namespace: Jrun
 */
var Jrun = {
	behaviour: function() {
		// Return Object containing Boolean value of each browser object.
		return function() {
			var win = window;
			var doc = document;
			// make sure ie6 or ie7 is either false or true only.
			var items = { 
				ie: false,
				ie6: false,
				ie7: false,
				khtml: false,
				gecko: false,
				opera: false
			};
			// detect IE
			items.ie = items[win.XMLHttpRequest ? "ie7" : "ie6"] = ( win.ActiveXObject ? true : false );
			// detect KHTML
			items.khtml = ( (doc.childNodes && !doc.all && !navigator.taintEnabled) ? true : false );
			// detect Gecko
			items.gecko = ( doc.getBoxObjectFor != null ? true : false );
			// detect Opera
			items.opera = ( items.opera ? true : false );
			// return the object
			return items;
		}();
	}(),
	
	// Camelize string input
	camelize: function( data ) {
		var val = data.split(/\-/);
		
		// if array only have one value
		if ( val.length === 1 )
			return val[0];
		
		var ret = ( data.indexOf('-') == 0 ? val[0].charAt(0).toUpperCase() + val[0].substr(1) : val[0] );
		
		jQuery.each(val, function( i, v ) {
			if ( i > 0 )
				ret = ret + v.charAt(0).toUpperCase() + v.substr(1);
		});
		
		return ret;
	},
	
	// Open a URL using JavaScript
	href: function( url, target ) {
		if ( this.trim(url) !== "" ) {
			if ( this.isnull(target) ) 
				window.location.href = url;
			else 
				window.open( url, target );
		} 
		else 
			Js.debug.error("Jrun.href: failed to load page " + url);
	},
	
	// Encode HTML entities from any given string
	htmlEncode: function(value) {
		return value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\+/g, "&#43;");
	},
	
	// Decode HTML entities from any given string
	htmlDecode: function(value) {
		return value
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#43;/g, "+");
	},
	
	// Check whether the value is in an array
	inArray: function( value, data ) {
		for ( var i = 0; i < data.length && !!data[i]; i++ ) {
			if ( data[i] === value ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Check whether the value is in an array, check validity based on Regular Expression
	inArrayGrep: function( value, data ) {
		for ( var i = 0; i < data.length && !!data[i]; i++ ) {
			if ( data[i].match(value) ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Get the indexOf based on value in an array
	'indexOf': function( value, data ) {
		for ( var i = data.length; i-- && data[i] !== value; );
		return i;
	},
	// Get the indexOf based on value in an array
	indexOfGrep: function( value, data ) {
		for ( var i = data.length; i-- && !data[i].match(value); );
		return i;
	},
	
	// Check if data is not defined
	isnull: function( data ) {
		return ( typeof(data) == "undefined" || data == null );
	},
	
	// Check if data is defined
	isset: function( data ) {
		return !this.isnull( data );
	},
	
	/* Check whether the passed value is a function
	 * Deprecated: Replace with jQuery.isFunction
	 */
	isfunction: function( data ) {
		return jQuery.isFunction( data );
	},
	
	// Trim left of a string
	ltrim: function( value ) {
		return new String( value ).replace( /^\s+/g, "" );
	},
	
	parameter: function( data, length, type ) {
		var data = jQuery.makeArray( data );
		var type = Jrun.pickType( type, [], "array" );
		
		if ( data.length === length ) {
			var ret = true;
			
			jQuery.each(data, function( i, v ) {
				if ( type[i] !== true && Jrun.typeOf(v) !== type[i] ) 
					ret = false;
			});
			
			return ret;
		}
		else 
			return false;
	},
	
	// Pick the first arguments that is defined
	pick: function( js ) {
		var data = jQuery.makeArray( arguments );
		
		for ( var i = 0; i < data.length; i++ ) {
			var ret = data[i];
            
            if ( Jrun.isset(ret) ) {
                return ret;
				break;
            }
		};
		
		return null;
	},
	
	// Pick the first arguments that is defined and typeof match the last arguments
	pickType: function( js ) {
		var data = jQuery.makeArray( arguments );
		var length = data.length;
		var last = data[(length - 1)];
		
		for ( var i = 0; i < (length - 1); i++ ) {
			var ret = data[i];
            
            if ( Jrun.isset(ret) ) {
                if ( this.typeOf(ret) == last ) {
                    return ret;
					break;
                }
            }
		};
		
		return null;
	},
	
	// Pick the first arguments that is defined and match Regular Expression passed in the last arguments
	pickGrep: function( js ) {
		var data = jQuery.makeArray( arguments );
		var length = data.length;
		var last = data[(length - 1)];
		
		if ( this.typeOf(last) == "string" ) 
			last = new RegExp(last);
		
		for ( var i = 0; i < (length - 1); i++ ) {
			var ret = data[i];
            
            if ( Jrun.isset(ret) ) {
                if ( !!ret.match(last) ) {
                    return ret;
					break;
                }
            }
		};
		
		return null;
	},
	
	prettyList: function( data, between, last ) {
		var length = data.length;
		var ret = new String;
		
		if ( length > 1 ) {
			jQuery.each(data, function( i, v ) {
				ret = [ret, ( i == 0 ? "" : ( i == (length - 1) ? last : between) ), v].join("");
			});
		} 
		else 
			ret = data[0];
		
		return ret;
	},
	
	rand: function( js ) {
		var data = arguments;
		var length = 0;
		var offset = 0;
		
		if ( data.length === 2 ) {
			offset = data[0];
			length = data[1];
		} 
		else if ( data.length === 1 ) 
			length = data[0];
		
		return ( Math.floor(Math.random() * length) + offset );
	},
	
	// Trim right of a string.
	rtrim: function( value ) {
		return new String( value ).replace( /\s$/g, "" );
	},
	
	// Striptags work similiar to strip_tags() in PHP
	stripTags: function( value ) {
		return new String( value ).replace( /<([^>]+)>/g, "" );
	},
	
	// Parse input string value as Number using parseInt
	toNumber: function( data ) {
		// return possible integer value of a string, if not a string then return self
		return ( typeof(data) == "string" ? parseInt( data, 10 ) : data );
	},
	
	// Parse input string value as Float using parseFloat
	toFloat: function( data ) {
		return ( typeof(data) == "string" ? parseFloat( data, 10 ) : data );
	},
	
	toProperCase: function( data ) {
		var val = data.split(/ /g);
		var ret = [];
		
		jQuery.each(val, function(i, v) {
			var v = v.toString();
			var first = v.substr( 0, 1 ).toUpperCase();
			var other = v.substr(1);
			
			ret.push( [first, other].join("") );
		});
		
		return ret.join(" ");
	},
	
	// Convert a object (mainly use for arguments) to array & require on .length to check the length to object to convert
	toArray: function( data, offset ) {
		var offset = ( this.isnull(offset) || offset < 1 ? 0 : offset );
		var len = {
			offset: 0,
			data: 0
		};
		var ret = [];
		
		// return empty array
		if ( this.isset(data) ) {
			// ensure the offset
			len.offset = ( data.length - offset );
			len.data = data.length;
			
			// loop and prepare r to be return
			while ( len.offset > 0 ) {
				--len.offset;
				--len.data;
				ret[len.offset] = data[len.data];
			}
		}
		
		return ret;
	},
	
	// Trim both left and right of a string.
	trim: function( data ) {
		return jQuery.trim( data ); 
	},
	
	// Return the typeof passed argument, extending JavaScript default typeof
	typeOf: function( data ) {
		if ( Jrun.isnull(data) ) 
			return "undefined";
		else {
			var val = Object.prototype.toString.call(data).match(/(\w+)\]/)[1];
			return ( val == "HTMLDocument" ? "element" : val.toLowerCase() );
		}
	},
	
	// return only unique value of an array
	unique: function( data, repeat ) {
		// when option equal true it only reject value which is repeating
		var repeat = this.pick( repeat, false );
		var ret = [];
		
		// loop the array
		jQuery.each(data, function( i, v ) {
			if ( !repeat ) {
				// add only if unique
				if ( !Jrun.inArray(v, ret) ) 
					ret.push(v);
			} 
			else {
				if ( i == 0 ) 
					ret.push(v);
				else if ( v !== Jrun.trim(data[i - 1]) ) 
					ret.push(v);
			}
		});
		
		return ret;
	},
	
	prep: function(data) {
		return ( data.match(/^(#|\.)?(.*)$/gi) ? RegExp.$2 : data );
	}
};

/*
 * Create a new Class with some simple Object-Oriented capability
 * Based from Simple JavaScript Inheritance by John Resig http://ejohn.org/blog/simple-javascript-inheritance/ 
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
		var $const = {};
		
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
