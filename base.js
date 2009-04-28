/* Map Savvy.UI Global Namespace Object
 * namespace: Js
 * Developed and tested with jQuery-1.3.2
 */
var Js = {
	adapter: "jQuery-1.3.2",
	version: "1.2.0-a2",
	use: null,
	debug: {},
	data: {
		ext: {},
		util: {},
		widget: {}
	},
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

Js.nue = function( dt, d ) {
	var d = Jrun.pickType( d, 1, "number" );
	var t = Jrun.typeOf( dt, "object" );
	
	if ( Jrun.inArray(t, ["object", "array"]) ) {
		var r = ( t == "object" ? {} : [] );
		--d;
		
		for ( var m in dt ) {
			if ( dt.hasOwnProperty(m) ) 
				r[m] = ( d > 0 ? Js.nue( dt[m], d ) : dt[m] );
		}
		
		return r;
	}
	else 
		return dt;
};

Js.append = function( dt, alt, f, i ) {
	// provide list of method (in array) to be append
	var f = Jrun.pickType( f, null, "array" );
	// invert append option
	var i = Jrun.pickType( i, false, "boolean" );
	
	if ( !Jrun.typeOf( dt, "object" ) )
		dt = {};
	
	var r = dt;
	
	// loop value's method
	for ( var m in alt ) {
		// if data doesn't have the method add it
		var v = ( Jrun.isnull(f) || Jrun.inArray(m, f) );
		var u = ( !dt.hasOwnProperty(m) && alt.hasOwnProperty(m) );
		var v = ( !!i ? !v : v );
		 
		if ( !!u && !!v )
			r[m] = alt[m];
	}
	
	return r;
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
	log: function( tx, v ) {
		var v = Jrun.pick( v, "" );
		
		// push log to stack
		this.data.log.push( tx );
		this.value.log.push( v );
		
		if ( !!this.dev ) {
			try {
				if ( v === "")
					console.log( tx );
				else 
					console.log( tx, v );
			}
			catch(e) {
				alert( tx + v );
			}
		}
	},
	
	// Log an error
	error: function( tx, v ) {
		var v = Jrun.pick( v, "" );
		
		// push log to stack
		this.data.error.push( tx );
		this.value.error.push( v );
		
		if ( !!this.enable || !!this.dev ) {
			try {
				if ( v === "")
					console.log( tx );
				else 
					console.log( tx, v );
			}
			catch(e) {
				alert( tx + v );
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
			var w = window,
				d = document;
			// make sure ie6 or ie7 is either false or true only.
			var i = { 
				ie: false,
				ie6: false,
				ie7: false,
				khtml: false,
				gecko: false,
				opera: false
			};
			// detect IE
			i.ie = i[w.XMLHttpRequest ? "ie7" : "ie6"] = !!w.ActiveXObject;
			// detect KHTML
			i.khtml = (d.childNodes && !d.all && !navigator.taintEnabled);
			// detect Gecko
			i.gecko = d.getBoxObjectFor != null;
			// detect Opera
			i.opera = !!w.opera;
			
			// return the object
			return i;
		}();
	}(),
	
	// Camelize string input
	camelize: function( dt ) {
		var v = dt.split(/\-/);
		
		// if array only have one value
		if ( v.length === 1 )
			return v[0];
		
		var r = ( dt.indexOf('-') == 0 ? v[0].charAt(0).toUpperCase() + v[0].substr(1) : v[0] );
		
		jQuery.each(v, function( i, val ) {
			if ( i > 0 )
				r = r + val.charAt(0).toUpperCase() + val.substr(1);
		});
		
		return r;
	},
	
	filter: function( dt, val ) {
		var r = [];
		
		jQuery.each(dt, function( i, v ) {
			if ( v.match(val) ) 
				r.push(v);
		});
		
		return r;
	},
	
	// Open a URL using JavaScript
	href: function( u, t ) {
		if ( this.trim( u ) !== "" ) {
			if ( this.isnull(t) ) 
				window.location.href = u;
			else 
				window.open( u, t );
		} 
		else 
			Js.debug.error( "Jrun.href: failed to load page " + u );
	},
	
	// Encode HTML entities from any given string
	htmlEncode: function( v ) {
		return v
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\+/g, "&#43;");
	},
	
	// Decode HTML entities from any given string
	htmlDecode: function( v ) {
		return v
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#43;/g, "+");
	},
	
	// Check whether the value is in an array
	inArray: function( v, dt ) {
		var i = (dt.length - 1);
		
		for ( ; i > -1 && !!dt[i]; i-- ) {
			if ( dt[i] === v ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Check whether the value is in an array, check validity based on Regular Expression
	inArrayGrep: function( v, dt ) {
		var i = (dt.length - 1);
		
		for ( ; i > -1 && !!dt[i]; i-- ) {
			if ( dt[i].match(v) ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Get the indexOf based on value in an array
	'indexOf': function( v, dt ) {
		var i = (dt.length - 1);
		
		for ( ; i-- && dt[i] !== v; );
		return i;
	},
	
	// Get the indexOf based on value in an array
	indexOfGrep: function( v, dt ) {
		var i = (dt.length - 1);
		
		for ( ; i-- && !dt[i].match(v); );
		return i;
	},
	
	// Check if data is not defined
	isnull: function( v ) {
		return ( typeof(v) == "undefined" || v == null );
	},
	
	// Check if data is defined
	isset: function( v ) {
		return !this.isnull( v );
	},
	
	// Check whether the passed value is a function
	isfunction: function( v ) {
		return this.typeOf( v, "function" );
	},
	
	// Trim left of a string
	ltrim: function( v ) {
		return new String( v ).replace( /^\s+/g, "" );
	},
	
	parameter: function( dt, l, t ) {
		var dt = jQuery.makeArray( dt );
		var t = Jrun.pickType( t, [], "array" );
		var r = false;
		
		if ( dt.length === l ) {
			r = true;
			
			jQuery.each(dt, function( i, v ) {
				if ( t[i] !== true && Jrun.typeOf(v) !== t[i] ) 
					r = false;
			});
		}
			
		return r;
	},
	
	// Pick the first arguments that is defined
	pick: function() {
		var dt = jQuery.makeArray( arguments ),
			i = 0;
		var l = dt.length;
		
		for ( ; i < l; i++ ) {
			var r = dt[i];
            
            if ( Jrun.isset( r ) ) {
                return r;
				break;
            }
		};
		
		return null;
	},
	
	// Pick the first arguments that is defined and typeof match the last arguments
	pickType: function() {
		var dt = jQuery.makeArray( arguments ),
			i = 0;
		var l = dt.length;
		var v = dt[( l - 1 )];
		
		for ( ; i < ( l - 1 ); i++ ) {
			var r = dt[i];
            
            if ( Jrun.isset( r ) ) {
                if ( this.typeOf( r, v ) ) {
                    return r;
					break;
                }
            }
		};
		
		return null;
	},
	
	// Pick the first arguments that is defined and match Regular Expression passed in the last arguments
	pickGrep: function() {
		var dt = jQuery.makeArray( arguments ),
			i = 0;
		var l = dt.length;
		var v = dt[ ( l - 1 ) ];
		
		if ( this.typeOf(v) == "string" ) 
			v = new RegExp(v);
		
		for ( ; i < (l - 1); i++ ) {
			var r = dt[i];
            
            if ( Jrun.isset(r) ) {
                if ( !!r.match(v) ) {
                    return r;
					break;
                }
            }
		};
		
		return null;
	},
	
	prettyList: function( dt, b, d ) {
		var l = dt.length,
			r = new String;
		
		if ( l > 1 ) {
			jQuery.each(dt, function( i, v ) {
				r = [r, ( i == 0 ? "" : ( i == (l - 1) ? d : b) ), v].join("");
			});
		} 
		else 
			r = dt[0];
		
		return r;
	},
	
	replace: function( s, v, dt ) {
		var dt = new String( dt );
		var v = Jrun.pickType( v, "", "string" );
		
		return dt.split(s).join(v);
	},
	
	// Trim right of a string.
	rtrim: function( v ) {
		return new String( v ).replace( /\s$/g, "" );
	},
	
	// Striptags work similiar to strip_tags() in PHP
	stripTags: function( v ) {
		return new String( v ).replace( /<([^>]+)>/g, "" );
	},
	
	// Parse input string value as Number using parseInt
	toNumber: function( v ) {
		var v = this.replace( ",", "", v );
		
		// return possible integer value of a string, if not a string then return self
		return ( typeof(v) == "string" ? parseInt( v, 10 ) : v );
	},
	
	// Parse input string value as Float using parseFloat
	toFloat: function( v ) {
		var v = this.replace( ",", "", v );
		
		return ( typeof(v) == "string" ? parseFloat( v, 10 ) : v );
	},
	
	toProperCase: function( dt ) {
		var val = dt.split(/ /g), 
			r = [],
			that = function(v) {
				var v = v.toString();
				return [
					v.substr( 0, 1 ).toUpperCase(),
					v.substr( 1 )
				];
			};
		
		jQuery.each(val, function( i, v ) {
			r.push( that(v).join("") );
		});
		
		return r.join(" ");
	},
	
	// Convert a object (mainly use for arguments) to array & require on .length to check the length to object to convert
	toArray: function( dt, off ) {
		var off = Jrun.pickType( off, 0, "number");
		off = ( off < 1 ? 0 : off );
		var l = {
			off: 0,
			dt: 0
		};
		var r = [];
		
		// return empty array
		if ( this.isset( dt ) ) {
			// ensure the offset
			l.off = ( dt.length - off );
			l.dt = dt.length;
			
			// loop and prepare r to be return
			while ( l.off > 0 ) {
				--l.off;
				--l.dt;
				
				r[l.off] = dt[l.dt];
			}
		}
		
		return r;
	},
	
	// Trim both left and right of a string.
	trim: function( v ) {
		return jQuery.trim( v ); 
	},
	
	// Return the typeof passed argument, extending JavaScript default typeof
	typeOf: function( dt, t ) {
		var r = (function( dt ) {
			if ( Jrun.isnull(dt) ) 
				return "undefined";
			else {
				var v = Object.prototype.toString.call(dt).match(/(\w+)\]/)[1];
				return ( v == "HTMLDocument" ? "element" : v.toLowerCase() );
			}
		})( dt );
		
		return (Jrun.isset(t) ? (r === t.toLowerCase()) : r );
	},
	
	// return only unique value of an array
	unique: function( dt, rt ) {
		// when option equal true it only reject value which is repeating
		var rt = this.pickType( rt, false, "boolean" );
		var r = [];
		
		// loop the array
		jQuery.each( dt, function( i, v ) {
			if ( !rt ) {
				// add only if unique
				if ( !Jrun.inArray(v, r) ) 
					r.push(v);
			} 
			else {
				if ( i == 0 ) 
					r.push(v);
				else if ( v !== Jrun.trim( dt[i - 1] ) ) 
					r.push(v);
			}
		});
		
		return r;
	},
	
	prep: function( dt ) {
		return ( dt.match( /^(#|\.)?(.*)$/gi ) ? RegExp.$2 : dt );
	}
};
