/* Savvy.UI Global Namespace Object
 * namespace: Js
 * Developed and tested with jQuery-1.3.2
 */

var Js = window.Js = function ( obj ) {
	return ( this === window ? new Js.create( obj ) : this );
};

Js.adapter = 'jQuery-1.3.2';
Js.version = '1.2.0-a3';
Js.toString = function() {
	return [
		'Savvy.UI', 
		'version', 
		Js.version, 
		'using', 
		Js.adapter
	].join(' ');	
};

Js.nue = function( data, num ) {
	var num = Js.on.pickType( num, 1, 'number' );
	var type_of = Js.on.typeOf( data, 'object' );
	
	if ( Js.on.inArray( type_of, ['object', 'array']) ) {
		var result = ( type_of == 'object' ? {} : [] );
		--num;
		
		for ( var method in data ) {
			if ( data.hasOwnProperty( method ) ) 
				result[method] = ( num > 0 ? Js.nue( data[method], num ) : data[method] );
		}
		
		return result;
	}
	else 
		return data;
};

Js.append = function( data, alt, define, invert ) {
	// provide list of method (in array) to be append
	var define = Js.on.pickType( define, null, 'array' );
	
	// invert append option
	var invert = Js.on.pickType( invert, false, 'boolean' );
	
	if ( !Js.on.typeOf( data, 'object' ) )
		data = {};
	
	var result = data;
	
	// loop value's method
	for ( var method in alt ) {
		// if data doesn't have the method add it
		var add = Js.on.isnull( define ) || Js.on.inArray( method, define );
		var both = !data.hasOwnProperty( method ) && alt.hasOwnProperty( method );
		var add = ( !!invert ? !add : add );
		 
		if ( !!both && !!add )
			result[method] = alt[method];
	}
	
	return result;
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
	value: {
		error: [],
		log: []
	},
	
	// Log a message/note
	log: function( text, value ) {
		var value = Js.on.pick( value, '' );
		
		// push log to stack
		this.data.log.push( text );
		this.value.log.push( value );
		
		if ( !!this.dev ) {
			try {
				if ( value === '' )
					console.log( text );
				else 
					console.log( text, value );
			}
			catch(e) {
				alert( text + value );
			}
		}
	},
	
	// Log an error
	error: function( text, value ) {
		var value = Js.on.pick( value, '' );
		
		// push log to stack
		this.data.error.push( text );
		this.value.error.push( value );
		
		if ( !!this.enable || !!this.dev ) {
			try {
				if ( value === '' )
					console.log( text );
				else 
					console.log( text, value );
			}
			catch(e) {
				alert( text + value );
			}
		}
	}
};

/* Misc function for Savvy.UI
 * namespace: Js.on
 */
Js.on = {
	behaviour: function() {
		// Return Object containing Boolean value of each browser object.
		return function() {
			var win = window,
				doc = document;
			
			// make sure ie6 or ie7 is either false or true only.
			var browse = { 
				ie: false,
				ie6: false,
				ie7: false,
				khtml: false,
				gecko: false,
				opera: false
			};
			// detect IE
			browse.ie = browse[ win.XMLHttpRequest ? "ie7" : "ie6" ] = !!win.ActiveXObject;
			// detect KHTML
			browse.khtml = ( doc.childNodes && !doc.all && !navigator.taintEnabled );
			// detect Gecko
			browse.gecko = doc.getBoxObjectFor != null;
			// detect Opera
			browse.opera = !!win.opera;
			
			// return the object
			return browse;
		}();
	}(),
	
	// Camelize string input
	camelize: function( data ) {
		var value = data.split( /\-/ );
		
		// if array only have one value
		if ( value.length === 1 )
			return value[0];
		
		var result = ( data.indexOf('-') == 0 ? value[0].charAt(0).toUpperCase() + value[0].substr(1) : value[0] );
		
		jQuery.each( value, function( index, val ) {
			if ( index > 0 )
				result = [
					result, 
					val.charAt(0).toUpperCase(), 
					val.substr(1)
				].join('');
		} );
		
		return result;
	},
	
	filter: function( data, value ) {
		var result = [];
		
		jQuery.each( data, function( index, val ) {
			if ( value.match( val ) ) 
				result.push( val );
		} );
		
		return result;
	},
	
	// Open a URL using JavaScript
	href: function( uri, target ) {
		if ( this.trim( uri ) !== '' ) {
			if ( this.isnull( target ) ) 
				window.location.href = uri;
			else 
				window.open( uri, target );
		} 
		else 
			Js.debug.error( 'Js.on.href: failed to load page ' + uri );
	},
	
	// Encode HTML entities from any given string
	htmlEncode: function( text ) {
		return new String( text )
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\+/g, "&#43;");
	},
	
	// Decode HTML entities from any given string
	htmlDecode: function( text ) {
		return new String( text )
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#43;/g, "+");
	},
	
	// Check whether the value is in an array
	inArray: function( value, data ) {
		var index = 0;
		
		for ( ; index < data.length && !!data[index]; index++ ) {
			if ( data[index] === value ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Check whether the value is in an array, check validity based on Regular Expression
	inArrayGrep: function( value, data ) {
		var index = 0;
		
		for ( ; index < data.length && !!data[index]; index++ ) {
			if ( data[index].match( value ) ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Get the indexOf based on value in an array
	'indexOf': function( value, data ) {
		var index = data.length;
		
		for ( ; index-- && data[index] !== value; );
		return index;
	},
	
	// Get the indexOf based on value in an array
	indexOfGrep: function( value, data ) {
		var index = data.length;
		
		for ( ; index-- && !data[index].match( value ); );
		return index;
	},
	
	// Check if data is not defined
	isnull: function( value ) {
		return ( typeof( value ) == 'undefined' || value == null );
	},
	
	// Check if data is defined
	isset: function( value ) {
		return !this.isnull( value );
	},
	
	// Check whether the passed value is a function
	isfunction: function( value ) {
		return this.typeOf( value, 'function' );
	},
	
	// Trim left of a string
	ltrim: function( value ) {
		return new String( value ).replace( /^\s+/g, '' );
	},
	
	parameter: function( data, length, expect ) {
		var data = jQuery.makeArray( data ),
			expect = Js.on.pickType( expect, [], 'array' ),
			result = false;
		
		if ( data.length === length ) {
			result = true;
			
			jQuery.each( data, function( index, val ) {
				if ( expect[index] !== true && Js.on.typeOf( val ) !== expect[index] ) 
					result = false;
			});
		}
			
		return result;
	},
	
	// Pick the first arguments that is defined
	pick: function() {
		var data = jQuery.makeArray( arguments ),
			index = 0,
			result = null;
		var length = data.length;
		
		for ( ; index < length; index++ ) {
			result = data[index];
            
            if ( Js.on.isset( result ) ) {
                return result;
				break;
            }
		};
		
		return null;
	},
	
	// Pick the first arguments that is defined and typeof match the last arguments
	pickType: function() {
		var data = jQuery.makeArray( arguments ),
			index = 0,
			result = null;
		var length = data.length;
		var type = data[( length - 1 )];
		
		for ( ; index < ( length - 1 ); index++ ) {
			var result = data[index];
            
            if ( Js.on.isset( result ) ) {
                if ( this.typeOf( result, type ) ) {
                    return result;
					break;
                }
            }
		};
		
		return null;
	},
	
	// Pick the first arguments that is defined and match Regular Expression passed in the last arguments
	pickGrep: function() {
		var data = jQuery.makeArray( arguments ),
			index = 0,
			result = null;
		var length = data.length;
		var regex = data[ ( length - 1 ) ];
		
		if ( this.typeOf( regex ) == "string" ) 
			regex = new RegExp( regex );
		
		for ( ; index < ( length - 1 ); index++ ) {
			result = data[index];
            
            if ( Js.on.isset( result ) ) {
                if ( !!result.match( regex ) ) {
                    return result;
					break;
                }
            }
		};
		
		return null;
	},
	
	prettyList: function( data, between, last ) {
		var len = data.length,
			result = new String;
		
		if ( len > 1 ) {
			jQuery.each( data, function( index, val ) {
				result = [
					result, 
					( index == 0 ? '' : ( index == ( len - 1 ) ? last : between ) ), 
					val
				].join('');
			});
		} 
		else 
			result = data[0];
		
		return result;
	},
	
	replace: function( search, replace, data ) {
		var data = new String( data );
		var replace = Js.on.pickType( replace, '', 'string' );
		
		return data.split( search ).join( replace );
	},
	
	// Trim right of a string.
	rtrim: function( value ) {
		return new String( value ).replace( /\s$/g, '' );
	},
	
	// Striptags work similiar to strip_tags() in PHP
	stripTags: function( value ) {
		return new String( value ).replace( /<([^>]+)>/g, '' );
	},
	
	// Parse input string value as Number using parseInt
	toNumber: function( value ) {
		var value = this.replace( ',', '', value );
		
		// return possible integer value of a string, if not a string then return self
		return ( typeof( value ) == 'string' ? parseInt( value, 10 ) : value );
	},
	
	// Parse input string value as Float using parseFloat
	toFloat: function( value ) {
		var value = this.replace( ',', '', value );
		
		return ( typeof( value ) == 'string' ? parseFloat( value, 10 ) : value );
	},
	
	toProperCase: function( data ) {
		var value = data.split(/ /g), 
			result = [],
			that = function(o) {
				var o = o.toString();
				return [
					o.substr( 0, 1 ).toUpperCase(),
					o.substr( 1 )
				].join('');
			};
		
		jQuery.each( value, function( index, val ) {
			result.push( that( val ) );
		});
		
		return r.join(' ');
	},
	
	// Convert a object (mainly use for arguments) to array & require on .length to check the length to object to convert
	toArray: function( data, offset ) {
		var offset = (function(o) {
			var o = Js.on.pickType( o, 0, 'number' );
			return o < 1 ? 0 : o;
		})( offset );
		
		var len = {
			offset: 0,
			data: 0
		};
		var result = [];
		
		// return empty array
		if ( this.isset( data ) ) {
			// ensure the offset
			len.offset = ( data.length - offset );
			len.data = data.length;
			
			// loop and prepare r to be return
			while ( len.offset > 0 ) {
				--len.offset;
				--len.data;
				
				result[len.offset] = data[len.data];
			}
		}
		
		return result;
	},
	
	// Trim both left and right of a string.
	trim: function( text ) {
		return jQuery.trim( text ); 
	},
	
	// Return the typeof passed argument, extending JavaScript default typeof
	typeOf: function( data, type ) {
		var result = (function( data ) {
			if ( Js.on.isnull( data ) ) 
				return 'undefined';
			else {
				var value = Object.prototype.toString.call( data ).match(/(\w+)\]/)[1];
				return ( value == 'HTMLDocument' ? 'element' : value.toLowerCase() );
			}
		})( data );
		
		return ( Js.on.isset( type ) ? (result === type.toLowerCase()) : result );
	},
	
	// return only unique value of an array
	unique: function( data, repeat ) {
		// when option equal true it only reject value which is repeating
		var repeat = this.pickType( repeat, false, 'boolean' );
		var result = [];
		
		// loop the array
		jQuery.each( data, function( index, value ) {
			if ( !repeat ) {
				// add only if unique
				if ( !Js.on.inArray( value, result ) ) 
					result.push( value );
			} 
			else {
				if ( index == 0 || value !== Js.on.trim( data[i - 1] ) ) 
					result.push( value );
			}
		});
		
		return result;
	},
	
	prep: function( data ) {
		return ( data.match( /^(#|\.)?(.*)$/gi ) ? RegExp.$2 : data );
	}
};

Js.ext = {};
Js.util = {};
Js.widget = {};
