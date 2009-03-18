/**
 * Savvy.UI JavaScript Library v1.2.0-draft
 * Version: 1.2.0-a1
 * Author: Mior Muhammad Zaki crynobone@gmail.com 
 * 
 * Copyright (c) 2009 Mior Muhammad Zaki Mior Khairuddin
 * Licensed under the MIT
 *
 * Revision: r320
 */

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
		var i = dt.length;
		
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
		var i = dt.length;
		
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
		var i = dt.length;
		for ( ; i-- && dt[i] !== v; );
		return i;
	},
	
	// Get the indexOf based on value in an array
	indexOfGrep: function( v, dt ) {
		var i = dt.length;
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
            
            if ( Jrun.isset(r) ) {
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
		var v = dt[(l - 1)];
		
		for ( ; i < (l - 1); i++ ) {
			var r = dt[i];
            
            if ( Jrun.isset(r) ) {
                if ( this.typeOf(r, v) ) {
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
		var v = dt[(l - 1)];
		
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
		if ( this.isset(dt) ) {
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
		return ( dt.match(/^(#|\.)?(.*)$/gi) ? RegExp.$2 : dt );
	}
};

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

/* Adapter for Savvy.UI and jQuery Framework
 * version: 0.0.3
 * @extends jQuery
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	setClass: function( v ) {
		return this.each( function() {
			this.className = v;
		});
	},
	htmlText: function( tx ) {
		if ( tx == undefined ) 
			return ( this[0] ? this[0].innerHTML : null );
		
		else {
			this.each(function() {
				this.innerHTML = tx;
			});
			return this;
		}
	}
});

// Bind Js.use with jQuery Object
Js.use = window.jQuery;

/**
 * @projectDescription Configuration Object for Savvy.UI
 * @memberOf Js
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.config = {
	ext: {
		validate: {
			errorNode: "span.form-error-message",
			beforeStart: null,
			success: null,
			onError: null,
			autoExecute: true
		}
	},
	
	test: {
		email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		url: /^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/,
		ip: /^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/,
		username: /^([a-zA-Z0-9_\.\-\+])$/,
		postcode: /^\d{5}$/
	},
	
	util: {
		formSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			formSuccess: null,
			sendSuccess: null,
			onError: null,
			onSendError: null
		},
		
		buttonSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			formSuccess: null,
			sendSuccess: null,
			onError: null,
			onSendError: null
		},
		
		editable: {
			identifier: "Other",
			prefix: "",
			beforeStart: null,
			onBeforeUpdate: null,
			onUpdate: null,
			overlay: true
		}
	},
	
	widget: {
		activity: {
			imagePath: "images/",
			boxWidth: 200,
			boxHeight: 20,
			identifier: ".widget-activity",
			opacity: 0.3,
			background: "#fff",
			zIndex: 5000
		},
		
		datePicker: {
			daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			dateFormat: /^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/,
			onUpdate: null,
			navigation: true,
			fieldType: "hidden",
			beforeStart: null
		},
		
		dropmenu: {
			speed: 250,
			zIndex: 100,
			css: 'widget-dropmenu'
		},
		
		iconizer: {
			fileType: "png",
			folder: "icons/"
		},
		
		message: {
			identifier: "#overlay-message",
			cssSuccess: "message-success",
			cssNote: "message-note",
			cssError: "message-error",
			seconds: 5
		},
		
		notice: {
			cssSuccess: "notice-success",
			cssNote: "notice-note",
			cssError: "notice-error",
			seconds: 5,
			beforeStart: null,
			onClose: null
		},
		
		panel: {
			title: "Untitled",
			width: null,
			height: null,
			content: "",
			onClose: null,
			closable: true,
			header: true,
			overlay: true,
			clickOver: false,
			onClickOver: null 
		},
		
		tab: {
			handler: "click",
			identifier: ".tab",
			closable: "closable",
			disabled: "disabled",
			toolbar: "tab-toolbar",
			toolbarContainer: "tab-toolbar-container",
			container: "tab-container",
			cssHidden: "tab-hidden",
			cssActive: "tab-active",
			cssCurrent: "current",
			cssDisabled: "disabled",
			fx: true,
			header: ""
		}
	}
};

/**
 * @projectDescription Global Configurator Function for Savvy.UI
 * @memberOf Js
 * @version 0.0.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.setup = {
	ext: {
		validate: function( dt ) {
			Js.config.ext.validate = Js.append( dt, Js.config.ext.validate, ["lang"], true );
			
			if ( Jrun.isset(dt.lang) ) 
				Js.language.ext.validate = Js.append( dt.lang, Js.language.ext.validate );
		}
	},
	
	test: function( dt ) {
		Js.config.test = Js.append( dt, Js.config.test );
	},
	
	util: {
		buttonSubmit: function( dt ) {
			Js.config.util.buttonSubmit = Js.append( dt, Js.config.util.buttonSubmit );
		},
		
		formSubmit: function( dt ) {
			Js.config.util.formSubmit = Js.append( dt, Js.config.util.formSubmit );
		},
		editable: function( dt ) {
			Js.config.util.editable = Js.append( dt, Js.config.util.editable, ["lang"], true );
			
			if ( Jrun.isset(dt.lang) ) 
				Js.language.util.editable = Js.append( dt.lang, Js.language.util.editable );
		}
	},
	
	widget: {
		activity: function( dt ) {
			Js.config.widget.activity = Js.append( dt, Js.config.widget.activity );
		},
		
		datePicker: function( dt ) {
			Js.config.widget.datePicker = Js.append( dt, Js.config.widget.datePicker, ["lang"], true );
			
			if ( Jrun.isset(dt.lang) ) 
				Js.language.widget.datePicker = Js.append( dt.lang, Js.language.widget.datePicker );
		},
		
		dropmenu: function( dt ) {
			Js.config.widget.dropmenu = Js.append( dt, Js.config.widget.dropmenu );
		},
		
		iconizer: function( dt ) {
			Js.config.widget.iconizer = Js.append( dt, Js.config.widget.iconizer );
		},
		
		notice: function( dt ) {
			Js.config.widget.notice = Js.append( dt, Js.config.widget.notice, ["lang"], true );
			
			if ( Jrun.isset(dt.lang) ) 
				Js.language.widget.notice = Js.append( dt.lang, Js.language.widget.notice );
		},
		
		panel: function( dt ) {
			Js.config.widget.panel = Js.append( dt, Js.config.widget.panel );
		},
		
		tab: function( dt ) {
			Js.config.widget.tab = Js.append( dt, Js.config.widget.tab );
		}
	}
};
/**
 * @projectDescription Language configuration for Savvy.UI (English)
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.language = {
	ext: {
		validate: {
			string: "Require alphanumeric character input",
			number: "Require numberic input",
			email: "Require valid e-mail address input",
			required: "This input field is required",
			length: "This input field require {type} {value} character.",
			exact: "exactly",
			min: "minimum",
			max: "maximum"
		}
	},
	
	util: {
		editable: {
			message: "Please enter a new option value...",
			title: "Editable Widget",
			submitButton: "Ok"
		}
	},
	
	widget: {
		datePicker: {
			selectMonthYear: "Jump to specific month and year",
			todayButton: "Select Today",
			prevMonth: "Previous Month",
			nextMonth: "Next Month",
			days: ["S", "M", "T", "W", "T", "F", "S"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			shortMonths: ["Jan", "Feb", "Mac", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
		},
		
		notice: {
			titleSuccess: "Congratulation",
			titleNote: "Note",
			titleError: "Error has Occur",
			timer: "This message will automatically close in 5 seconds"
		},
		
		panel: {
			closeText: "Close"
		}
	}
};

/* Parser Engine for Savvy.UI
 * version: 1.0.3
 */

Js.parse = {
	html: {
		to: function( r ) {
			return encodeURIComponent( Jrun.htmlEncode( new String(r) ) );
		},
		
		from: function( r ) {
			return Jrun.htmlDecode( decodeURIComponent( new String(r) ) );
		}
	},
	
	xhr: {
		init: function( v ) {
			var that = Js.parse.xhr;
			var dt = eval( "(" + v + ")" );
			
			Js.debug.log( "XHR: " + v );
			
			if ( Jrun.typeOf(dt) == "object" ) {
				if ( !!dt.SUIXHR ) {
					that.notice( dt );
					that.href( dt );
					that.update( dt );
				}
			}
		},
		
		notice: function( dt ) {
			var v = Jrun.pickType( dt.notice, "string" );
			
			if ( Jrun.isset(v) && v !== "" ) {
				window.alert( v );
				
				try {
					console.log( v );
				} catch(e) { }
			}
		},
		href: function( dt ) {
			var h = Jrun.pickGrep( dt.href, /^https?:\/\//g );
			var x = Jrun.pickGrep( dt.xhref, /^https?:\/\//g );
			
			if ( Jrun.isset(x) && x !== "" ) 
				Jrun.href( x, "_blank" );
			
			else if ( Jrun.isset(h) && h !== "" ) 
				Jrun.href( h );
		},
		
		update: function( dt ) {
			var args = Jrun.pick( dt.text );
			var id = Jrun.pickType( dt.id, "string" );
			var el = Jrun.pickType( dt.selector, "string" );
			var fn = Jrun.pickType( dt.callback, "string" );
			
			if ( Jrun.typeOf( args ) == "string" ) {
				if ( !!el ) 
					Js.use( el ).html( args );
				else if ( !!id ) 
					Js.use("#" + id).html( args );
			}
			else if ( Jrun.isset(object) ) {
				// eval the function without making a callback
				var fn = eval( fn );
					
				// execute the function
				if ( Jrun.isfunction(fn) ) 
					fn( args );
			}
		}
	}
};

/* Input test script for Savvy.UI
 * version: 1.0.3
 */

Js.test = {
	isString: function( v ) {
		return ( typeof(v) == "string" && isNaN(v) );
	},
	
	isNumber: function( v ) {
		return !isNaN( v );
	},
	
	isLength: function( dt, v ) {
		var r = false;
		
		if ( dt.match(/^(exact|min|max)\-(\d*)$/i) ) {
			var l = Jrun.toNumber(RegExp.$2);
			
			switch ( RegExp.$1 ) {
				case 'max':
					r = v <= l;
					break;
				case 'min':
					r = v >= l;
					break;
				case 'exact':
					r = v == l;
					break;
				default:
					r = false;
			}
		}
		
		return r;
	},
	
	isEmail: function( v ) {
		return ( v.match(Js.config.test.email) );
	},
	
	isURL: function( v ) {
		return ( v.match(Js.config.test.url) );
	},
	
	isIpAddress: function( v ) {
		return ( v.match(Js.config.test.ip) );
	},
	
	isPostcode: function( v ) {
		return ( v.match(Js.config.test.postcode) );
	}
};
/* Form Validation extension for Savvy.UI
 * version: 0.9.6
 */

Js.ext.validate = Js.create({
	appName: "validate",
	node: null,
	first: null,
	setting: null,
	language: null,
	data: "",
	cacheResult: null,
	
	initiate: function( node, option ) {
		return ( Jrun.isset(node) ? this.init( node, option) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.setting );
			
		return this;
	},
	
	_prepSetting: function() {
		this.setting.errorNode.match(/^(span|div|p|em|label|strong|b|i)\.(.*)$/i);
		this.setting.error = {
			node: RegExp.$1,
			cssMessage: RegExp.$2
		};
	},
	
	init: function( node, option ) {
		// ensure that refer to this
		var that = this;
		
		// node should refer to only one object
		this.node = Js.use( node ).eq(0);
		
		// setup configuration
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.ext[this.appName] );
		this.language = Js.append( this.language, Js.language.ext[this.appName] );
		
		this._prepSetting();
		
		if ( Jrun.isset(this.setting.autoExecute) && this.setting.autoExecute === true ) 
			this.result();
		
		return this;
	},
	
	result: function() {
		var that = this;
		
		var setting = this.setting;
		var fnBeforeStart = Jrun.pick( setting.beforeStart,null );
		var fnSuccess = Jrun.pick( setting.success, null );
		var fnOnError = Jrun.pick( setting.onError, null );
		this.data = "";
		var contRun = true;
		
		// set this.first to NULL
		this.first = null;
		
		if ( Jrun.isfunction(fnBeforeStart) ) {
			// execute the function and free up the memory
			contRun = fnBeforeStart.apply( this, [node] );
			fnBeforeStart = null;
		}
		
		if ( contRun === false ) 
			return false;
		
		if ( this.node.length >= 1 ) {
			// based on the form, select on input type
			Js.use(":input", this.node).each(function( i, v ) {
				that._validate( v );
			});
		}
		
		if ( Jrun.isset(this.first) ) {
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} 
			catch (e) {
				Js.debug.log( "Js.ext.form: Cannot trigger onFirstFormError " + e );
			}
			
			if ( Jrun.isfunction(fnOnError) ) 
				fnOnError.apply( this );

			
			// stop form processing
			this.cacheResult = false;
			return false;
		}
		else {
			// return all field data in querystring format
			if ( Jrun.isfunction(fnSuccess) ) 
				fnSuccess.apply( this );
			
			this.cacheResult = this.data;
			return this.data;
		}
	},
	
	_error: function( node, text ) {		
		var that = this;
		this.first = ( Jrun.isnull(this.first) ? node : this.first );
		this._messageAdd( node, text );
	},
	
	_invokeQueryString: function( node ) {
		var data = "";
		
		// dump name and value to opt in querystring format ( &name=value )
		if ( node.is(':checkbox, :radio') ) {
			if ( node.is(':checked') ) 
				data += "&" + node.attr( 'name' ) + "=" + Js.parse.html.to( node.val() );
		} 
		
		else 
			data += "&" + node.attr( 'name' ) + "=" + Js.parse.html.to( node.val() );
		
		return data;
	},
	
	_messageCleanUp: function( node ) {
		var errSpan = this.setting.errorNode;
		var errNode = node.siblings( errSpan );
		
		if ( errNode.length > 0 ) 
			errNode.remove();
	},
	
	_messageAdd: function( node, message ) {
		var that = this;
		var errorNode = node.siblings( this.setting.errorNode ).eq(0);
		
		if ( errorNode.length < 1 ) 
				Js.use( "<" + this.setting.error.node + "/>" )
					.addClass( this.setting.error.cssMessage )
					.text( message )
					.insertAfter( node[0] );
		
		else 
			errorNode.eq(0).append( '<br />' + message );
		
		node.bind( "change", function() {
			var jnode = Js.use( this );
			if ( jnode.val() != "" ) {
				that._messageCleanUp( jnode );
				that.first = null;
			}
		});
	},
	
	_validate: function( field ) {
		var that = this;
		var lang = this.language;
		var node = Js.use( field );
		var value = node.val();
		// Double confirm the element is either input, select or textarea
		
		if ( node.attr('name') != "" ) {
			// remove previously loaded error message
			that._messageCleanUp( node );
			
			// turn the className into array so we can do some testing
			var klasses = ( !!node.attr('class') ? node.attr('class') : "" );
			var klass = klasses.split(/\s/);
			var error = "";
			
			// if the element is required
			if ( !!Jrun.inArray("required", klass) ) {
				if ( Jrun.trim(value) === "" ) 
					error = lang.required;
				else {
					var indexLength = Jrun.indexOfGrep( /^(max|min|exact)\-(\d*)$/i, klass );
					
					if ( indexLength > -1 ) {
						var types = RegExp.$1;
						var values = RegExp.$2;
						
						if ( !Js.test.isLength(klass[indexLength], value.length) ) {
							if ( types == "min" ) 
								types = lang.max;
							
							else if ( types == "max" ) 
								types = lang.min;
							
							else if ( types == "exact" ) 
								types = lang.exact;
							
							var note = lang.length;
							note = note.replace(/{type}/, types);
							note = note.replace(/{value}/, values);
							
							this._error( node, note );
						}
					}
				}
			}
			
			var indexMatch = Jrun.indexOfGrep( /^match-(.*)$/i, klass );
			
			if ( indexMatch > -1 ) {
				var matched = fields.is( ":input[name='" + RegExp.$1 + "']" );
				
				if ( value != matched.val() && error == "" ) 
					error = lang.matched;
			}
			
			// this set of validate only triggered when this.value isn't empty
			if ( Jrun.trim(value) != "" ) {
				if ( !!Jrun.inArray("string", klass) && !Js.test.isString(value) ) 
					error = lang.string;
				
				else if ( !!Jrun.inArrayGrep(/^(integer|number)$/, klass) && !Js.test.isNumber(value) ) 
					error = lang.number;
				
				else if ( !!Jrun.inArray("email", klass) && !Js.test.isEmail(value) ) 
					error = lang.email;
			}
			
			var testIndex = Jrun.indexOfGrep( /^(custom)\-(\w*)$/g, klass );
			
			if ( testIndex > -1 ) {
				var tester = Jrun.camelize( klass[testIndex] );
				var validate = this.setting[tester];
				
				if ( Jrun.isset(validate) ) {
					var required = Jrun.pickType( validate.required, false, "boolean" );
					
					if ( required === true && Jrun.trim(value) === "" ) 
						error = Jrun.pickType( validate.error, error, "string" );
					
					if ( Jrun.trim(value) !== "" ) {
						if ( Jrun.isfunction(validate.callback) && !validate.callback(value) ) 
							error = Jrun.pickType( validate.error, error, "string" );
						
						else if ( validate.regex && !value.match(validate.regex) ) 
							error = Jrun.Jrun.pickType( validate.error, error, "string" );
					}
				}
			}
			
			if ( error !== "" ) 
				that._error( node, error );
			
			this.data += this._invokeQueryString( node );
		}
	}
});
/* Create Active Hyperlink for Savvy.UI
 * version: 0.1.2
 */

Js.util.activeContent = Js.create({
	appName: "activeContent",
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	fnBeforeStart: null,
	fnSuccess: null,
	
	initiate: function( jo ) {
		var that = this;
		var jo = Jrun.pickType( jo, {}, "object" );
		this.element = Jrun.pick( jo.element, null );
		this.fnBeforeStart = Jrun.pick( jo.beforeStart, this.fnBeforeStart );
		this.fbSuccess = Jrun.pick( jo.success, this.fnSuccess );
		
		if ( Jrun.isset(this.element) ) {
			this._selector();
			this._check();
		} 
		else {
			this.interval = window.setInterval( function() {
				that._check();
			}, 100 );
		}
	},
	
	destroy: function() {
		if( Jrun.isset(this.interval) ) {
			clearInterval( this.interval );
			this.interval == null;
		}
		
		this.element = null;
		return null;
	},
	
	_selector: function() {
		var that = this;
		
		Js.use( this.element ).bind( "click", function() {
			var href = Js.use( this ).attr( "href" );
			var hash = ( Jrun.isset(href) ? href : this.href );
			var r;
			
			r = ( hash.match(/^\#/) ? ["", hash.substr(1)] : hash.split(/\#/) ); 
			
			if ( Jrun.isfunction(that.fnBeforeStart) ) 
				that.fnBeforeStart();
			
			if ( Jrun.isset(r[1]) ) {
				that.repeat = ( r[1] === that.last );
				
				that.last = r[1];
				that.init( r[1].split(/\//) );
				
				if ( Jrun.isfunction(that.fnSuccess) ) 
					that.fnSuccess();
			}
		});
	},
	
	_check: function() {
		if ( location.hash != this.last && location.hash !== "#" ) {
			this.last = location.hash;
			
			if ( Jrun.isfunction(this.fnBeforeStart) ) 
				this.fnBeforeStart();
			
			this.init( location.hash.substr(1).split(/\//) );
			
			if ( Jrun.isfunction(this.fnSuccess) ) 
				this.fnSuccess();
		}
	}
});

/* Allow a customizable form submission via button complete with XHR Request
 * version: 0.0.2
 */

Js.util.buttonSubmit = Js.create({
	appName: "buttonSubmit",
	id: null,
	url: null,
	button: null,
	setting: null,
	handler: "click",
	formValidate: null,
	
	initiate: function( jo ) {
		this.id = Jrun.pick( jo.id, null );
		this.url = Jrun.pick( jo.url, null );
		this.button = Jrun.pick( jo.button, null );
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( jo.option );
		
		return this;
	},
	
	setup: function( opt ) {
		var opt = Jrun.pickType( opt, {}, "object" );
		this.setting = Js.append( opt, this.setting );
		
		return this;
	},
	
	_prepSetting: function() {
		this.formValidate = Js.nue( this.setting );
		this.formValidate.success = this.setting.formSuccess;
		this.formValidate.onError = this.setting.formError;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.util[this.appName] );
		this._prepSetting();
		
		var method = Jrun.pickGrep( this.setting.method, /^(get|post)$/i );
		
		// bind onClick event delegation to the button
		Js.use( this.button ).bind( this.handler, function() {
			// we need to validate the form
			var f = new Js.ext.validate( that.id, that.formValidate );
			var dt = f.cacheResult;
			
			if( !!dt ) {
			   jQuery.ajax({
					type: method,
					url: that.url,
					data: dt,
					beforeSend: function() {
						if ( Jrun.isfunction(that.setting.beforeSend) ) 
							that.setting.beforeSend.apply( that );
					},
					success: function( reply ) {
						var runDefault = true;
						
						if ( Jrun.isfunction(that.setting.sendSuccess) ) 
							runDefault = that.setting.sendSuccess.apply( that, [reply] );
						
						if ( runDefault !== false ) 
							Js.parse.xhr.init(reply);
					},
					onError: function() {
						if( Jrun.isfunction(that.setting.onSendError) ) 
							that.setting.onSendError.apply( that );
					}
				});
			}
			
			return false;
		});
	}
});

/* Dimension detection for Savvy.UI
 * version: 0.6.2
 */

Js.util.dimension = {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function() {
				var d = document.body;
				var r = 0;
				var off = window.pageXOffset;
				var el = document.documentElement;
				
				if ( typeof(off) == "number" ) 
					r = off;
				
				else if ( d && d.scrollLeft ) 
					r = d.scrollLeft;
				
				else if ( el && el.scrollLeft ) 
					r = el.scrollLeft;
				
				return r;
			},
			
			y: function() {
				var d = document.body;
				var r = 0;
				var off = window.pageYOffset;
				var el = document.documentElement;
				
				if ( typeof(off) == "number" ) 
					r = off;
				
				else if ( d && d.scrollTop ) 
					r = d.scrollTop;
				
				else if ( el && el.scrollTop ) 
					r = el.scrollTop;
				
				return r;
			},
			
			both: function() {
				var that = Js.util.dimension.page.scrolls;
				return [
					that.x(), 
					that.y()
				];
			}
		},
		
		middle: function( w, h ) {
			var d = document.body;
			var off = [Js.use(window).width(), Js.use(window).height()];
			var a = Js.util.dimension.page.scrolls.both();
			var r = [];
					
			r[0] = Math.round( ((off[0] - w) / 2) + a[0] );
			r[1] = Math.round( ((off[1] - h) / 2) + a[1] ); 
			
			r[0] = ( r[0] < 0 ? 0 : r[0] );
			r[1] = ( r[1] < 0 ? 0 : r[1] );
				
			return r.reverse();
		}
	},
	
	node: {
		scrolls: {},
		size: {},
		
		offset: function( node ){
			var ret = [0, 0, 0, 0];
			var loop = false;
			
			if ( Jrun.isset(node) ) {
				if ( node.offsetParent ) {
					loop = true;
					ret[0] = node.offsetWidth;
					ret[1] = node.offsetHeight;
					
					while ( node.offsetParent ) {
						ret[2] += node.offsetTop;
						ret[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				}
				else {
					if ( loop == false ) {
						ret[0] = Jrun.pick( node.scrollWidth, 0 );
						ret[1] = Jrun.pick( node.scrollHeight, 0 );
						ret[2] = Jrun.pick( node.offsetTop, 0 );
						ret[3] = Jrun.pick( node.offsetLeft, 0 );
					}
				}
				
				return ret;
			}
			else 
				Js.debug.log("Js.util.dimension.node.offset: failed because node does not exist");
		}
	}
};
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
		else if ( Jrun.parameter(arguments, 2, [true, "string"]) ) {
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


/* Checkbox Ticker for Savvy.UI
 * version: 0.1.2
 */

Js.util.ticker = Js.create({
	element: null,
	node: null,
	
	initiate: function( elem ) {
		return ( Jrun.isset(elem) ? this.init( selector ) : this );
	},
	
	init: function( elem ) {
		this.element = Jrun.pick( elem, null );
		
		if ( Jrun.isset(this.element) ) 
			this.node = Js.use( this.element );
		
		return this;
	},
	
	tick: function() {
		this.node.each(function( i, v ) {
			// set checked to true
			v.checked = true;
		});
	},
	
	untick: function() {
		this.node.each(function( i, v ) { 
			// set checked to false
			v.checked = false;
		});
	},
	
	invert: function() {
		this.node.each(function( i, v ) {
			// reverse checkbox selection
			v.checked = !v.checked;
		});
	}
});
/* Editable Dropdown for Savvy.UI
 * version: 0.0.3
 */

Js.util.editable = Js.create({
	appName: "editable",
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	value: null,
	input: null,
	cacheData: null,
	lastSelected: null,
	
	initiate: function( elem, opt ) {
		return ( !!Jrun.isset(elem) ? this.init( elem, opt ) : this );
	},
	
	setup: function( opt ) {
		var opt = Jrun.pickType( opt, {}, "object" );
		this.setting = Js.append( opt, this.setting, ["lang"], true );
		
		if ( Jrun.isset(opt.lang) ) 
			this.language = Js.append( opt.lang, this.language );
		
		return this;
	},
	
	init: function( elem, opt ) {
		var that = this;
		
		this.element = Jrun.pick( this.element, elem );
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.util.editable );
		this.language = Js.append( this.language, Js.language.util.editable );
		this.node = Js.use( this.element );
		
		this.node.bind( "change", function() {
			var node = Js.use( this );
			
			if ( node.val() == that.setting.identifier ) 
				that.getModalBox( this );
		});
		
		this.node.each(function() {
			if ( Js.use(this).val() == that.setting.identifier ) 
				this.options[0].selected = true;
		});
		
		return this;
	},
	onModalBoxClose: function( field ) {
		var ret = [];
		
		Js.use( field ).children( "option" ).each(function( i, v) {
			ret.push( Js.use( v ).val() );
		});
		
		this.cacheData = ret;
		var updated = false;
		var runDefault = true;
		var val = this.input.val();
		this.value = val;
		
		if ( Jrun.isfunction(this.setting.onBeforeUpdate) ) 
			runDefault = this.setting.onBeforeUpdate.apply( this, [field] );
		
		if ( runDefault !== false && (Jrun.isset(val) && Jrun.trim(val) != "" && !Jrun.inArray(val, ret)) ) {
			Js.use( '<option selected="selected" value="' + val + '">' + val + '</option>' ).appendTo( field );
			updated = true;
		} 
		else 
			field.options[0].selected = true;
		
		if ( Jrun.isfunction(this.setting.onUpdate) ) 
			this.setting.onUpdate.apply( this, [field, updated] );
	},
	getModalBox: function( field ) {
		var that = this;
		
		if ( Jrun.isfunction(this.setting.beforeStart) ) 
			this.setting.beforeStart.apply( this );
		
		this.box = new Js.widget.dialog({
			element: "editable_edit_box_" + Jrun.prep( this.element ),
			title: this.language.title,
			width: 300,
			height: 100,
			onClose: function() {
				that.onModalBoxClose( field );
			},
			button: [
				{
					text: this.language.submitButton,
					callback: function() {
						return true;
					},
					type: "submit"
				}
			],
			language: {
				closeText: "Cancel"
			},
			overlay: this.setting.overlay,
			clickOver: true,
			onClickOver: function() {
				that.input.val("");
			}
		});
		
		var div = Js.use( "<div/>" )
			.setClass( "data" )
			.appendTo( this.box.content[0] );
		
		var p = Js.use( "<label/>" )
			.htmlText( "" + this.language.message )
			.appendTo( div[0] );
			
		this.input = Js.use( '<input type="text"/>')
			.attr( "name", "util_editable_" + Jrun.prep( this.element ) )
			.val( this.setting.prefix )
			.appendTo( div[0] );
		
		
		var box = this.box;
		
		box.closeButton.htmlText("Cancel").bind( "click", function() {
			that.input.val("");
			box.closePanel();
		})
	}
});
/* Includer for Savvy.UI
 * version: 0.0.5
 */

Js.util.includer = { 
	script: function( s ) {
		return Js.use( "<script/>" ).attr({
			"type": "text/javascript",
			"src": s
		}).appendTo( "head" );
	},
	
	style: function( s, m ) {
		var m = Js.pickGrep( m, "all", /^(all|print|screen|handheld)$/i );
		return Js.use( "<link/>" ).attr({
			"type": "text/css",
			"href": s,
			"media": m
		}).appendTo( "head" );
	}
};
/* Smart Input Field for Savvy.UI
 * version: 0.0.2
 */

Js.util.smartInput = Js.create({
	node: null,
	element: null,
	
	initiate: function( elem ) {
		return ( Jrun.isset(elem) ? this.init( elem ) : this );
	},
	
	init: function( elem ) {
		this.element = Jrun.pick( elem, this.elem );
		this.node = Js.use( this.element );
		
		this.activate();
		
		return this;
	},
	
	activate: function() {	
		this.node.bind( "blur", function() {
			var node = Js.use( this );
			
			if ( Jrun.trim(node.val()) === "" ) 
				node.val( node.attr("title").toString() );
			
		}).bind( "focus", function() {
			var node = Js.use(this);
			
			if ( node.attr("title") == node.val() )  
				node.val("");
			
		}).val( this.node.attr("title").toString() );
	},
	
	deactivate: function() {
		this.node.unbind( "blur", function() {
			var node = Js.use( this );
			
			if ( Jrun.trim(node.val()) === "" ) 
				node.val( node.attr("title").toString() );
			
		}).unbind( "focus", function() {
			var node = Js.use( this );
			
			if ( node.attr("title") == node.val() ) 
				node.val("");
			
		});
	}
});
/* Activity Overlay for Savvy.UI
 * version: 0.0.2
 */

Js.widget.activity = Js.create({
	appName: "activity",
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	count: 0,
	
	initiate: function( elem, opt ) {
		return ( Jrun.isset(elem) ? this.init( elem, opt ) : this );
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf(opt, "object") ) {
			this.setting = Js.append(opt, this.setting, ["lang"], true);
			
			if ( Jrun.isset(opt.lang) ) 
				this.language = Js.append(opt.lang, this.language);
		}
		return this;
	},
	
	init: function( elem, opt ) {
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.config.widget[this.appName] );
		
		this.element = Jrun.pick( elem, this.element );
		this.node = Js.use( this.element );
		
		if ( this.node.size() == 0 ) {
			try {
				this.node = Js.use("<div/>").attr("id", Jrun.prep(this.element)).appendTo("body");
			}
			catch(e) {
				Js.debug.error("Js.widget.activity: fail to create elementById '" + this.element + "'");
			}
		}
		
		this.node.css({
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: "none"
		}).setClass( Jrun.prep(this.setting.identifier) ).css( "opacity", 0.01 );
		
		return this;
	},
	
	activate: function( fn ) {
		var opt = this.setting;
		
		if ( this.count == 0 ) {
			this.node.css( "display", "block" ).fadeTo( "normal", opt.opacity );
			var t = Js.util.dimension.page.middle( opt.boxWidth, opt.boxHeight );
			
			if ( Jrun.isset(this.box) ) {
				this.box.css({
					top: t[0] + "px",
					left: t[1] + "px"
				});
			}
		}
		
		this.count++;
		if ( Jrun.isfunction(fn) ) 
			fn();
	},
	
	loadImage: function() {
		var opt = this.setting;
		this.box = Js.use( "<img/>" )
			.attr( "src", opt.imagePath )
			.css({
				position: "absolute",
				width: opt.boxWidth + "px",
				height: opt.boxHeight + "px",
				zIndex: (opt.zIndex + 1)
			})
			.appendTo( this.node[0] );
		
		return this;
	},
	
	deactivate: function( fn ) {
		if ( this.count > 0 ) {
			this.node.fadeTo( "normal", 0, 
				function() {
					Js.use( this ).css(	"display", "none" );
					if ( Jrun.isfunction(fn) ) 
						fn();
				}
			);
		}
		
		this.count--;
		this.count = ( this.count < 0 ? 0 : this.count );
	}
});

/* Calendar/datePicker for Savvy.UI
 * version: 0.7.3
 */

Js.widget.datePicker = Js.create({
	appName: "datePicker",
	field: null,
	value: "",
	lastDate: null,
	type: null,
	box: null,
	element: null,
	renderTo: null,
	content: null,
	setting: null,
	language: null,
	range: null,
	minDate: null,
	maxDate: null,
	status: null,
	dateObject: new Date,
	date: null,
	day: null,
	month: null,
	year: null,
	
	initiate: function( js ) {
		return ( Jrun.typeOf(js) === "object" ? this.init( js ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType(option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if ( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.language );
	},
	
	init: function( js ) {
		var that = this;
		
		this.setup( js.option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.element = Jrun.prep( Jrun.pick( js.element, this.element ) );
		this.renderTo = Jrun.pick( js.renderTo, this.renderTo );
		
		if ( !this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType) ) {
			this.renderTo = Js.use("<div/>").appendTo("body");
		}
		else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = Js.use(this.renderTo).eq(0) ;
		}
		
		js.range = Jrun.pickType( js.range, this.range, [null, null], "array" );
		this.field = Jrun.pickType( js.field, this.field, "calendar-value", "string" );
		this.type = Jrun.pickGrep( js.type, this.type, "single", /^(single|multiple)$/g );
		
		// check if minimum date have been set
		if ( !!js.minDate && this.setting.dateFormat.test(js.minDate) ) 
			this.minDate = Jrun.pick( js.minDate, null );
		
		// check if maximum date have been set
		if ( !!js.maxDate && this.setting.dateFormat.test(js.maxDate) ) 
			this.maxDate = Jrun.pick( js.maxDate, null );
		
		if ( !!js.value && js.value.match( this.setting.dateFormat ) ) {
			js.month = RegExp.$2;
			js.year = RegExp.$1;
			js.day = RegExp.$3;
			
			this.value = js.value;
		} 
		else if ( !!js.value && js.value === "today" ) {
			// get today date
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
			
			this.value = [js.year, js.month, js.day].join("-");
		}
		
		
		
		this.month = ( (!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this.dateObject.getMonth() : Math.abs(js.month - 1) );
		this.year = ( (!js.year || isNaN(js.year) || js.year < 1000) ? this.dateObject.getFullYear() : js.year );
		this.day = Jrun.pick( js.day, this.day );
		
		this.date = [this.year, (this.month + 1), Jrun.pick(this.day, 1)].join("-");
		this.navigation = Jrun.pick( js.navigate, true );
		
		var _getRange = function( data ) {
			var ret = null;
			var year = that.dateObject.getFullYear();
			
			if ( !data || data.toLowerCase() == "now" ) 
				ret = year; 
			else if ( data.match(/^(\+|\-)?(\d{1,4})$/) ) {
				var plus = RegExp.$1;
				var value = RegExp.$2;
				
				if ( plus == "+" ) 
					ret = ( year + Jrun.toNumber(value) );
				else if ( plus == "-" ) 
					ret = ( year - Jrun.toNumber(value) );
				else 
					ret = value;
			}
			
			return ret;
		};
		
		if ( this.navigation == true ) {
			js.range[0] = _getRange(js.range[0]);
			js.range[1] = _getRange(js.range[1]);
			
			if ( js.range[0] < js.range[1] ) {
				var ret = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = ret;
				delete ret;
			}
			
			this.range = [this.maxYear(js.range[0]), this.minYear(js.range[1])];
		}
		
		if ( Jrun.isfunction(this.setting.beforeStart) ) 
			this.setting.beforeStart.apply( this );
		
		this.renderTo.text("");
		this.status = "load";
		
		this.box = new Js.widget.dialog({
			element: [this.element, "calendar"].join("-"),
			renderTo: this.renderTo[0],
			title: "",
			width: 350,
			language: {
				closeText: "Cancel"
			},
			overlay: true
		});
		
		var content = Js.use("<div/>").appendTo(this.box.content[0]);
		
		this.content = Js.use( "<div/>" ).addClass( "calendar-content" ).appendTo( content[0] );
		this.option = Js.use( "<div/>" ).addClass( "calendar-option" ).hide().appendTo( content[0] );
		
		this.callback();
		
		return this;
	},
	
	minYear: function(year) {
		var ret = year;
		
		if ( this.minDate ) {
			var minDate = this.minDate.split("-");
			var newYear = Jrun.toNumber( minDate[0] );
			
			if ( newYear > ret ) 
				ret = newYear;
		}
		
		return ret;
	},
	
	maxYear: function(year) {
		var ret = year;
		
		if ( this.maxDate ) {
			var maxDate = this.maxDate.split("-");
			var newYear = Jrun.toNumber( maxDate[0] );
			
			if ( newYear < ret ) 
				ret = newYear;
		}
		
		return ret;
	},
	
	prevMonth: function() {
		this.day = null;
		this.dateObject = new Date( this.year, (this.month - 1) );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if ( this.validation() ) {
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, (this.month + 1) );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	
	prevYear: function() {
		this.day = null;
		this.dateObject = new Date( (this.year - 1), this.month );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if ( this.validation() ) {
			this.callback();
		}
		else {
			this.dateObject = new Date( (this.year + 1), this.month );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	
	nextMonth: function() {
		this.day = null;
		this.dateObject = new Date( this.year, (this.month + 1) );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if ( this.validation() ) {
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, (this.month - 1) );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	
	nextYear: function() {
		this.day = null;
		this.dateObject = new Date( (this.year + 1), this.month );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if ( this.validation() ) {
			this.callback();
		}
		else {
			this.dateObject = new Date( (this.year - 1), this.month );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	
	customMonth: function( data ) {
		this.day = null;
		this.dateObject = new Date( this.year, data );
		var ret = [];
		ret[0] = this.dateObject.getMonth();
		ret[1] = this.dateObject.getFullYear();
		this.date = [ret[1], (ret[0] + 1), this.dayOfMonth( ret[0], ret[1] )].join("-");
		
		if ( this.validation() ) {
			this.year = ret[1];
			this.month = ret[0];
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, this.month );
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.callback();
		}
		
		return this;
	},
	
	customYear: function( data ) {
		this.day = null;
		this.dateObject = new Date( data, this.month );
		var ret = [];
		ret[0] = this.dateObject.getMonth();
		ret[1] = this.dateObject.getFullYear();
		this.date = [ret[1], (ret[0] + 1), this.dayOfMonth( ret[0], ret[1] )].join("-");
		
		if ( this.validation() ) {
			this.year = ret[1];
			this.month = ret[0];
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, this.month );
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.callback();
		}
		
		return this;
	},
	
	today: function() {
		this.dateObject = new Date();
		this.year = this.dateObject.getFullYear();
		this.month = this.dateObject.getMonth();
		this.day = this.dateObject.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		
		this.callback();
	},
	
	validation: function() {
		var ret = false;
		var minDate = Jrun.isset( this.minDate );
		var maxDate = Jrun.isset( this.maxDate );
		
		if ( minDate && maxDate && this.compare(minDate, this.date) && this.compare(this.date, maxDate) ) 
			ret = true;
		else if ( minDate && this.compare(minDate, this.date) ) 
			ret = true;
		else if ( maxDate && this.compare(this.date, maxDate) ) 
			ret = true;
		else if ( !minDate && !maxDate ) 
			ret = true;
		
		return ret;
	},
	
	dayOfMonth: function( month, year ) {
		var month = Jrun.pick( month, this.month );
		var year = Jrun.pick( year, this.year );
		
		if ( month == 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ) 
			var monthLength = 29;
		
		return Jrun.pickType( monthLength, this.setting.daysInMonth[month], "number" );
	},
	
	compare: function( first, second ) {
		var firsts = first.split("-");
		var seconds = second.split("-");
		
		var firstDate = new Date( firsts[0], (Jrun.toNumber(firsts[1]) - 1) );
		firstDate.setDate( firsts[2] );
		
		var secondDate = new Date( seconds[0], (Jrun.toNumber(seconds[1]) - 1) );
		secondDate.setDate( seconds[2] );
		
		return secondDate >= firstDate;
	},
	
	updateValue: function( year, month, day ) {
		var field = Js.use( "#" + this.element + "_" + year + month + day ).eq(0);
		var calendar = Js.use( "#" + this.element + "-" + this.field ).eq(0);
		
		var months = ( month < 10 ? "0" + month : month );
		var days = ( day < 10 ? "0" + day : day );
		
		if( this.type == "single" ) {
			if ( !field.hasClass("calendar-day-selected") ) {
				if ( Jrun.isset( this.lastDate ) && Js.use( "#" + this.element + "_" + this.lastDate ).size() > 0 ) 
					var lastdate = Js.use( "#" + this.element + "_" + this.lastDate ).setClass( "calendar-day" );
				
				field.setClass( "calendar-day-selected" );
				this.value = [year, months, days].join("-");
				
				calendar.val( this.value );
				this.lastDate = [year, month, day].join("");
			}
			else {
				field.setClass( "calendar-day" );
				calendar.val("");
			}
		} 
		else if ( this.type == "multiple" ) {
			var value = calendar.val();
			var values = value.split("|");
			
			if ( Jrun.inArray([year, months, days].join("-"), values) ) {
				values.splice( values.indexOf([year, months, days].join("-")), 1 );
				value = values.join("|");
				
				field.setClass( "calendar-day" );
				this.value = value;
				calendar.val( this.value );
			}
			else {
				field.setClass( "calendar-day-selected" );
				values[values.length] = [year, months, days].join("-");
				this.value = values.join("|");
				calendar.val( this.value );
			}
		}
		
		if ( Jrun.isfunction(this.setting.onUpdate) ) 
			this.setting.onUpdate.apply(this);
		
		return this;
	},
	
	callback: function() {
		var that = this;
		
		this.content.html("");
		this.option.html("");
		
		this.box.title( this.language.months[this.month] + " " + this.year );
		var first_day = new Date( this.year, this.month, 1 );
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.dayOfMonth();
		
		var table = Js.use( "<table cellpadding='0' cellspacing='0'></table>" )
			.addClass( "calendar-body" )
			.appendTo( this.content[0] );
		
		var tbody = Js.use( "<tbody/>" ).appendTo( table[0] );
		
		var trheader = Js.use( "<tr/>" ).addClass( "calendar-header" ).appendTo( tbody[0] );
		
		for ( var i = 0; i <= 6; i++ ) 
			Js.use( "<td/>" )
				.addClass( "calendar-header-day" )
				.text( this.language.days[i] )
				.appendTo( trheader[0] );
		
		var day = 1;
		
		for ( var i = 0; i < 6; i++ ) {
			var weeks = Js.use( "<tr/>" ).addClass( "calendar-week" ).appendTo( tbody[0] );
			
			for ( var j = 0; j <= 6; j++ ) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = Js.use( "<td/>" )
					.addClass( "calendar-" + (this.validation() ? "day" : "invalid") )
					.appendTo( weeks[0] );
				
				if ( day <= monthLength && (i > 0 || j >= start_day) ) {
					days.attr( "id", this.element + "_" + this.year + (this.month + 1) + day );
					var tday;
					
					if ( this.validation() ) {
						days.bind( "click", function(){
							var i = Js.use( this ).attr( "id" ).split("_");
							var count = ( i.length - 1 );
							var ym = that.year + "" + that.month;
							tday = i[count].substr( (ym.length), i[count].length );
							that.updateValue( that.year, (that.month + 1), Jrun.toNumber(tday) );
						});
					}
					
					if ( day == this.day ) {
						days.setClass( "calendar-day-selected" );
						this.lastdate = this.year + "" + (this.month + 1) + "" + Jrun.toNumber(this.day);
					}
					
					days.css( "cursor", "pointer" );
					
					days.text( day.toString() );
					day++;
				}
				else 
					days.htmlText("&nbsp;").setClass("calendar-invalid");
			}
			
			if (day > monthLength) 
				break;
		}
		
		if ( this.setting.navigation == true ) {
			Js.use( "<a/>" )
				.setClass( "prev-month" )
				.text( this.language.prevMonth )
				.attr( "href", "#" )
				.click( function () {
					that.prevMonth();
					return false;
				})
				.appendTo( this.content[0] );
			
			Js.use( "<a/>" )
				.setClass( "next-month" )
				.text( this.language.nextMonth )
				.attr( "href", "#" )
				.click( function () {
					that.nextMonth();
					return false;
				})
				.appendTo( this.content[0] );
			
			Js.use( "<p/>" ).text( this.language.selectMonthYear ).appendTo( this.option[0] );
			
			var selmonth = Js.use( "<select name='month'></select>" ).bind( "change", function() {
				that.customMonth( this.value );
			}).appendTo( this.option[0] );
			
			for ( var i = 0; i < 12; i++ ) {
				if ( this.month == i ) 
					Js.use( "<option value='" + i + "' selected='selected'></option>" )
						.text( this.language.months[i] )
						.appendTo( selmonth[0] );
				else 
					Js.use( "<option value='" + i + "'></option>" )
						.text( this.language.months[i] )
						.appendTo( selmonth[0] );
			}
			var selyear = Js.use( "<select name='year'></select>" ).text( " " ).bind( "change", function() {
				that.customYear( this.value );
			}).appendTo( this.option[0] );
			
			for ( var i = this.range[0]; i >= this.range[1]; i-- ) {
				if ( this.year == i ) 
					Js.use( "<option value='" + i + "' selected='selected'></option>" )
						.text( i.toString() )
						.appendTo( selyear[0] );
				else 
					Js.use( "<option value='" + i + "'></option>" )
					.text( i.toString() )
					.appendTo( selyear[0] );
			}
			
			var _toggleContent = function() {
				var i = that.box.node.data("toggle");
				
				if ( i === 1 ) {
					that.content.hide( "normal" );
					that.option.show( "normal" );
					that.box.node.data( "toggle", 0 );
				}
				else if ( i === 0 ) {
					that.option.hide( "normal" );
					that.content.show( "normal" );
					that.box.node.data( "toggle", 1 );
				}
			};
			
			if ( this.status == "initiated" ) 
				this.box.buttons.html("");
			
			this.box.addButton({
				type: "submit",
				text: this.language.todayButton,
				callback: function(){
					that.today();
				}
			});
			this.box.addButton({
				type: "submit",
				text: "Option",
				callback: function() {
					_toggleContent();
				}
			});
			this.box.node.data( "toggle", 0 );
			_toggleContent();
		}
		
		this.box.fixDimension();
		this.status = "initiated";
		
		if ( Jrun.isset(this.field) ) {
			var input = Js.use( "<input id='" + [this.element, this.field].join("-") + "' name='" + this.field + "' type='" + this.setting.fieldType + "' />" ).appendTo( this.content[0] );
			
			if ( Jrun.isset(this.day) ) {
				var m = ( this.month + 1 );
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val( this.value );
				this.lastDate = [this.year, (this.month + 1), Jrun.toNumber(this.day)].join("");
			}
		}
		
		return this;
	}
});

/* Dropdown Menu for Savvy.UI
 * version: 0.0.2
 */

Js.widget.dropmenu = Js.create({
	node: null,
	element: null,
	setting: null,
	
	initiate: function( elem, opt ) {
		var that = this;
		var prepare = function( elem, opt ) {
			that.element = elem;
			that.init( opt );
		};
		
		if ( Jrun.isset( elem ) ) 
			prepare( elem, opt );
			
		return this;
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf( opt, "object" ) ) 
			this.setting = Js.append( opt, this.setting );
			
		return this;
	},
	
	init: function( elem, opt ) {
		var that = this;
		
		this.element = Jrun.pick( elem, this.element );
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget.dropmenu );
		this.node = Js.use( this.element );
		
		if ( this.node.size() > 0 ) {
			
			Js.use( "ul, li", this.node[0] ).hover( function() {
				that._show( this );
			}, function(){
				that._hide( this );
			});
			
			Js.use( 'li', this.node[0] ).hover( function() { 
				Js.use( this ).addClass( 'hover' ); 
				Js.use( '> a', this ).addClass( 'hover' ); 
			}, function() { 
				Js.use( this ).removeClass( 'hover' );
				Js.use( '> a', this ).removeClass( 'hover' ); 
			});
		}
		else 
			Js.debug.error("Js.widget.dropdown: No elements found");
		
		return this;	
	},
	
	_show: function( el ) {
		var c = this._getChild( el );
		
		if ( !c ) 
			return false;
		
		Js.use( c )
			.data( 'cancelHide', true )
			.css( "zIndex", this.setting.zIndex++ )
			.fadeIn( this.setting.speed )
			.slideDown( this.setting.speed );
		
		if ( el.nodeName.toLowerCase() == "ul" ) {
			var li = this._getPosition( el );
			Js.use( li ).addClass( 'hover' );
			Js.use( '> a', li ).addClass( 'hover' );
		}
	},
	
	_hide: function( el ) {
		var that = this;
		
		var c = this._getChild( el );
		
		if ( !c )
			return false;
			
		var node = Js.use( c )
			.data( 'cancelHide', false );
		
		setTimeout( function() {
			if( !node.data( 'cancelHide' ) ) 
				node.slideUp( that.setting.speed );
		}, 200);
	},
	
	_getChild: function( el ) {
		if ( el.nodeName.toLowerCase() == "li" ) {
			var c = Js.use( "> ul", el );
			return c.size() > 0 ? c[0] : null ;
		}
		else 
			return el;
	},
	
	_getPosition: function( el ) {
		return ( el.nodeName.toLowerCase() == 'ul' ? Js.use( el ).parents( 'li' )[0] : el );
	}
});

/* Iconizer widget for Savvy.UI
 * version: 0.0.3
 */

Js.widget.iconizer = Js.create({
	appName: "iconizer",
	setting: null,
	
	initiate: function( opt ) {
		return ( Jrun.isset(opt) ? this.init( opt ) : this );
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf( opt, "object" ) )
			this.setting = Js.append( opt, this.setting );
		
		return this;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		Js.use( this.setting.identifier ).is( "*[class*=icon]" ).each(function( i, v ) {
			var node = Js.use( v );
			
			var klas = node.attr("className");
			var klass = klas.split(/ /);
			
			for ( var i = 0; i < klass.length; i++ ) {
				if ( klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g) ) {
					var append = RegExp.$1 == "-append";
					var icon = RegExp.$3;
					var pos = Jrun.pickGrep( RegExp.$2, "left", /^(left|right)$/i );
					var bg = that.setting.folder + icon + "." + that.setting.fileType;
					
					if ( !!append ) {
						var obj = Js.use( "<span/>" ).css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo( node[0] );
						
						if ( pos == "left" ) {
							obj.css({
								"background": "url('" + bg + "') no-repeat left",
								"marginRight": "3px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					}
					else {
						var obj = node;
						if ( pos == "left" ) {
							obj.css({
								"background": "url('" + bg + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right center",
								"paddingRight": "17px"
							});
						}
					}
				}
			}
		});
		
		return this;
	}
});
/* Panel for Savvy.UI
 * version: 0.2.2
 */

Js.widget.panel = Js.create({
	appName: "panel",
	node: null,
	main: null,
	mainTitle: null,
	renderTo: null,
	element: null,
	setting: null,
	language: null,
	header: null,
	container: null,
	buttons: null,
	closeButton: null,
	minimizeButton: null,
	content: null,
	footer: null,
	status: "normal",
	
	initiate: function( opt ) {
		return ( Jrun.isset( opt ) ? this.init( opt ) : this );
	},
	
	setup: function( opt ) {
		if ( Jrun.typeOf( opt, "object" ) ) {
			this.setting = Js.append( opt, this.setting, ["lang"], true );
			
			if ( Jrun.isset(opt.lang) ) 
				this.language = Js.append(opt.lang, this.language);
		}
		
		return this;
	},
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) {
			this.renderTo = Js.use(this.renderTo);
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.use("body:eq(0)");
		}
			
		this._loadBorder();
		this._loadContent();
		
		if ( Jrun.isset(this.setting.button) ) {
			var l = this.setting.button.length;
			
			for ( var i = 0; i < l; i++ ) 
				this.addButton( this.setting.button[i] );
		}
		
		return this;
	},
	
	_loadBorder: function() {
		var that = this;
		
		var table = Js.use( "<table/>" )
			.attr( "id", this.element + "_panel" )
			.setClass( "widget-panel" )
			.appendTo( this.renderTo[0] );
		
		var tr = [];
		tr[0] = Js.use( "<tr/>" ).appendTo( table[0] );
		tr[1] = Js.use( "<tr/>" ).appendTo( table[0] );
		tr[2] = Js.use( "<tr/>" ).appendTo( table[0] );
		
		var dh = [];
		var dc = [];
		var df = [];
		
		dh[0] = Js.use( "<td/>" ).setClass( "tl" ).appendTo( tr[0][0] ).css( "opacity", 0.7 );
		dh[1] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[0][0] ).css( "opacity", 0.7 );
		dh[2] = Js.use( "<td/>" ).setClass( "tr" ).appendTo( tr[0][0] ).css( "opacity", 0.7 );
		
		dc[0] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[1][0] ).css( "opacity", 0.7 );
		dc[1] = Js.use( "<td/>" ).setClass( "c" ).appendTo( tr[1][0] );
		dc[2] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[1][0] ).css( "opacity", 0.7 );
		
		df[0] = Js.use( "<td/>" ).setClass( "bl" ).appendTo( tr[2][0] ).css( "opacity", 0.7 );
		df[1] = Js.use( "<td/>" ).setClass( "b" ).appendTo( tr[2][0] ).css( "opacity", 0.7 );
		df[2] = Js.use( "<td/>" ).setClass( "br" ).appendTo( tr[2][0] ).css( "opacity", 0.7 );
		
		
		this.node = table;
		this.main = dc[1];
	},
	_loadContent: function() {
		var that = this,
			opt = this.setting;
		
		// set panel width
		if ( Jrun.isset(opt.width) ) 
			this.main.css( "width", opt.width + "px" );
		
		// render header
		this.header = Js.use( "<h2/>" )
			.addClass( "header" )
			.appendTo( this.main[0] );
		
		if ( !opt.header ) 
			this.header.hide();
		
		// render content
		this.container = Js.use( "<div/>" )
			.addClass( "content-container" )
			.appendTo( this.main[0] );
		
		// render footer
		this.footer = Js.use( "<div/>" )
			.addClass( "footer" )
			.appendTo( this.main[0] );
		
		
		// set panel height
		if ( Jrun.isset( opt.height ) ) 
			this.container.css( "height", opt.height + "px" );
		
		// render header title
		this.mainTitle = Js.use( "<span/>" )
			.addClass( "title" )
			.text( opt.title )
			.appendTo( this.header[0] );
		
		this.buttons = Js.use( "<span/>" )
			.addClass( "button" )
			.appendTo( this.footer[0] );
		
		// render Close-Button 
		this.closeButton = Js.use( "<a/>" )
			.attr( "href", "#" )
			.text( this.language.closeText )
			.setClass( "buttons" )
			.appendTo( this.footer[0] );
		
		// Enable Close-Button option
		if ( !!opt.closable ) 
			this.closeButton.addClass( "close" ).click( function() { that.closePanel(); return false; });
		else 
			this.closeButton.addClass( "button-disabled" );
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.use( "<div/>" )
			.attr( "id", this.element )
			.setClass( "content" )
			.appendTo( this.container[0] );
		
		try {
			this.content.html( opt.content );
		} catch(e) {
			this.content.htmlText( opt.content );
		}
		
		// set height and scrolling option for content CONTAINER
		if ( Jrun.isset( opt.height ) && !!opt.scroll ) {
			this.content.css({
				"height": opt.height + "px",
				"overflow": "auto"
			});
		}
		
		// make the panel visible
		this.node.show( "slow" );
		
		return this;
	},
	
	closePanel: function() {
		var that = this,
			opt = this.setting;
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction( opt.onClose ) ) 
				opt.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	title: function( tx ) {
		this.mainTitle.html("").text( tx );
		return this;
	},
	
	addButton: function( jo ) {
		var that = this;
		var fn = Jrun.pickType( jo.callback, "function" );
		var tx = Jrun.pickType( jo.text, this.language.defaultButton, "string" );
		var t = Jrun.pickGrep( jo.type, "normal", /^(normal|submit|cancel)$/i );
		
		Js.use( "<a/>" )
			.attr( "href", "#" )
			.click( function() {
				var runDefault = false;
				if ( Jrun.isfunction(fn) ) 
					runDefault = fn();
				
				if ( runDefault === true ) 
					that.closePanel();
				
				return false;
			})
			.addClass( "buttons" )
			.addClass( t )
			.text( tx )
			.appendTo( this.buttons[0] );
	},
	
	_fixResize: function() {
		var opt = this.setting;
		
		if ( Jrun.isset(opt.height) && !!opt.scroll ) {
			this.content.css({
				"height": opt.height + "px", 
				"overflow": "auto"
			});
		}
	}
});

/* Modal Dialog for Savvy.UI
 * version: 0.1.2
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
	},
	
	init: function( opt ) {
		var that = this;
		
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		var opt = this.setting;
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) {
			this.renderTo = Js.use(this.renderTo);
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		if ( !!opt.overlay ) 
			this.overlay = new Js.widget.activity("#overlay-panel");
		
		
		this._loadBorder();
		this._loadContent();
		
		if ( Jrun.isset( opt.button ) ) {
			for ( var i = 0; i < opt.button.length; i++ ) 
				this.addButton( opt.button[i] );
		}
	
		
		if ( !!opt.overlay ) 
			this.overlay.activate();
		
		this.fixDimension();
		
		if ( !!opt.clickOver && !!opt.overlay ) {
			this.overlay.node.one("click", function() {
				that.closePanel( opt.onClickOver );
			});
		}
		
		return this;
	},
	
	closePanel: function( fn ) {
		var that = this,
			opt = this.setting;
		
		if ( !!opt.overlay ) 
			this.overlay.deactivate();
			
		if ( Jrun.isfunction( fn ) )
			fn.apply( this );
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction(that.setting.onClose) ) 
				that.setting.onClose.apply(that);
			
			that.node.remove();
		});
		
		return this;
	},
	
	fixDimension: function() {
		var width = ( this.main.width() > Jrun.pickType(this.setting.width, 0, 'number') ? this.main.width() : this.setting.width );
		
		var offset = [
			width,
			this.main.height()
		];
		
		var center = Js.util.dimension.page.middle( offset[0], offset[1] );
		var left = center[1];
		var top = center[0];
		
		left = (left < 0 ? 0 : left);
		top = (top < 0 ? 0 : top);
		
		this.node.css({
			"position": "absolute", 
			"top": top + "px", 
			"left": left + "px",
			"zIndex": 6000
		});
	}
});

/* Notice/Error Message for Savvy.UI
 * version: 0.0.3
 */

Js.widget.notice = Js.widget.activity.extend({
	appName: "notice",
	callback: null,
	node: null,
	setting: null,
	language: null,
	
	initiate: function( elem, opt ) {
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.node = this.$super.initiate( elem, {
			boxWidth: 550,
			boxHeight: 0,
			opacity: 0.9
		});
		
		this.node.init();
		this.node.box = Js.use( "<div/>" )
			.css({
				"position": "absolute",
				"width": "550px"
			})
			.appendTo( this.$super.node[0] );
	},
	closeNotice: function() {
		var that = this;
		
		if ( Jrun.isfunction(this.callback) ) {
			this.callback.apply(this);
			this.callback = null;
		}
		
		this.node.deactivate( function() {
			that.node.box.text("");
		});
	},
	_domAddNotice: function( v, s ) {
		var s = Jrun.pickGrep( s, "note", /^(note|success|error)$/i );
		var that = this;
		
		this.node.box.text("");
		this.node.activate();
		
		var title = this.language[Jrun.camelize("title-" + status)];
		var tx = "";
		var r = false;
		
		if ( Jrun.typeOf(v) != "object" ) 
			title = v;
		else {
			title = Jrun.pick( note.title, "" );
			tx = Jrun.pick( note.message, "" );
			r = Jrun.pick( note.sticky, false );
		}
		
		this.node.box.setClass( this.setting['css' + Jrun.toProperCase(s)] );
		
		Js.use( "<h3/>" )
			.text( title )
			.appendTo( this.node.box[0] );
		
		if ( tx != "" ) 
			var p = Js.use( "<p/>" ).htmlText( "" + tx ).appendTo( this.node.box[0] );
		
		
		var span = Js.use( "<em/>" )
			.text( Js.language.widget.notice.timer )
			.appendTo( this.node.box[0] );
		
		this.node.node.one( "click", function() {
			that.closeNotice();
		});
		
		if ( r == false ) {
			setTimeout( function() {
				that.closeNotice();
			}, (this.setting.seconds * 1000) );
		}
	},
	success: function( tx, fn ) {
		this.callback = Jrun.pick( fn, null );
		this._domAddNotice( tx, 'success' );
	},
	note: function( tx, fn ) {
		this.callback = Jrun.pick( fn, null );
		this._domAddNotice( tx, 'note' );
	},
	error: function( tx, fn ) {
		this.callback = Jrun.pick( fn, null );
		this._domAddNotice( tx, 'error' );
	}
});
/* Tab Panel for Savvy.UI
 * version: 0.9.4
 */

Js.widget.tab = Js.create({
	appName: "tab",
	height: null,
	toolbar: null,
	node: null,
	header: null,
	element: null,
	activeTab: null,
	activeHeader: null,
	handler: null,
	status: "off",
	setting: null,
	tabs: null,
	current: "",
	
	initiate: function( elem, opt ) {
		var that = this;
		var prepare = function( elem, opt ) {
			that.node = Js.use( elem );
			that.init( opt );	
		};
		
		if ( !!Jrun.isset(elem) )
			prepare( elem, opt );
		
		return this;
	},
	
	setup: function( opt ) {
		this.setting = Js.append( opt, this.setting );
		return this;
	},
	
	init: function( opt ) {
		var that = this;
		
		// setting should be available
		this.setup( opt );
		this.setting = Js.append( this.setting, Js.config.widget.tab );
		this.handler = Jrun.pickGrep( this.setting.handler, "click", /^(mouseover|click)$/i );
		
		if (this.node.size() > 0) {
			this.node.addClass( this.setting.container );
			this.element = this.node.eq(0).attr( "id" );
			
			// add tab toolbar on top
			this._addToolbar();
			// activate tab
			this.activateTab( "#" + Js.use( "." + this.setting.cssHidden + ":first", this.node[0] ).attr( "id" ) );
			
			this.status = "on";
		}
		else 
			Js.debug.error( "Js.widget.tab: No elements found" );
		
		return this;
	},
	
	_addToolbar: function() {
		var that = this,
			opt = this.setting;
		
		if ( Jrun.trim(opt.header) == "" ) {
			// DOM insert tab toolbar container
			var dv = Js.use( "<div/>" )
				.attr({
					className: opt.toolbarContainer, 
					id: [this.element, "toolbar", "container"].join("-")
				})
				.prependTo( this.node[0] );
		}
		else {
			var dv = Js.use( opt.header ).addClass( opt.toolbarContainer  );
		}
		
		this.toolbar = dv;
		
		// DOM insert tab toolbar
		this.header = Js.use( "<ul/>" )
			.attr({
				id: [this.element, "toolbar"].join("-"), 
				className: opt.toolbar
			})
			.appendTo( this.toolbar[0] );
		
		// find all possible tabs
		var c = Js.use( opt.identifier, this.node[0] );
		
		c.each(function( i, v ) {
			// add the tab title
			that._addHeader( v );
			// hide the tab
			Js.use( v ).setClass( opt.cssHidden );
		});
		
		this.tabs = c;
		this.tabs.css( "display", "none" );
		
		Js.use( "<div/>" ).css( "display", "block" ).appendTo( dv[0] );
	},
	
	_addHeader: function( elem ) {
		var that = this,
			opt = this.setting,
			node = Js.use( elem );
		
		var title = node.attr( "title" ),
			c = node.hasClass( opt.closable ),
			d = node.hasClass( opt.disabled );
		
		var li = Js.use( "<li/>" ).appendTo( this.header[0] );
		var a = Js.use( "<a/>" )
			.attr({
				href: "#" + node.attr("id"), 
				title: title
			})
			.appendTo( li[0] );
		
		Js.use( "<em/>" ).appendTo( a[0] );
		a.text( title );
				
		if ( !!c ) {
			Js.use( "<span/>" )
				.css( "paddingLeft", "10px" )
				.text("x")
				.click(function() {
					var my = Js.use( this.parentNode ).click(function(){
						return false;
					});
				
					var h = my.attr( "href" );
					that.activeHeader.removeClass();
					that.activeTab.setClass( opt.hidden );
					Js.use( h ).remove();
					Js.use( this.parentNode.parentNode ).remove();
				
					that.revert();
					
					return false;
				})
				.appendTo( a[0] );
		}
		
		if ( !!d ) {
			a.setClass( opt.cssDisabled )
				.bind( this.handler, function(){
					return false;
				});
		}
		else {
			a.bind( this.handler, function() {
				that.activateTab( Js.use( this ).attr("href") );
				
				return false;
			});
		}
	},
	
	enableTab: function( el ) {
		var that = this;
		
		Js.use( "a[href=" + el + "]", this.header[0] )
			.removeClass()
			.unbind( this.handler )
			.bind( this.handler, function(){
				that.activateTab( Js.use(this).attr("href") );
				return false;
			});
				
		return false;
	},
	
	disableTab: function( el ) {
		var that = this;
		
		Js.use( "a[href=" + el + "]", this.header[0] )
			.setClass( this.setting.cssDisabled )
			.unbind( this.handler )
			.bind( this.handler, function(){
				return false;
			});
		
		return false;
	},
	
	activateTab: function( el ) {
		var el = el,
			that = this,
			opt = this.setting;
		
		var fn = function() {
			if ( Jrun.isset(that.activeHeader) )
				that.activeHeader.removeClass( opt.cssCurrent );
			
			that.activeHeader = Js.use( "a[href=" + el + "]", that.header[0] );
			that.activeTab = Js.use( el );
			
			that.activeHeader.addClass( opt.cssCurrent );
			that.activeTab.setClass( opt.cssActive );
			
			if ( !!opt.fx ) 
				that.activeTab.slideDown( "normal" );
			else 
				that.activeTab.show();
			
			that.current = el;
		};
		
		if( this.current !== el ) {
			if ( Jrun.isset(this.activeTab) ) {
				this.activeTab.setClass( opt.cssHidden );
				
				if ( !!opt.fx ) {
					this.activeTab.slideUp( "normal", function(){
						fn();
					});
				}
				else {
					this.activeTab.hide();
					fn();
				}
			} 
			else 
				fn();
		}
		return false;
	},
	
	revert: function() {
		var v = Js.use( "li > a", this.header[0] );
		
		if ( v.size() > 0 ) 
			this.activateTab( v.attr("href") );
	},
	showTab: function() {
		if ( this.status == "off" ) {
			this.toolbar.show();
			this.tabs.setClass( this.setting.cssHidden );
			this.activeTab.setClass( this.setting.cssActive );
		}
		
		this.status = "on";
	},
	hideTab: function() {
		if ( this.status == "on" ) {
			this.toolbar.hide();
			this.tabs.setClass( this.setting.cssActive );
		}
		
		this.status = "off";
	},
	toggle: function() {
		this.status == "off" ? this.showTab() : this.hideTab() ;
	},
	
	addTab: function( jo ) {
		var that = this;
		
		if ( !!jo.id && Jrun.typeOf(jo.id) === "string" ) {
			var title = Jrun.pick( jo.title, "Untitled" );
			var id = jo.id;
			var tx = Jrun.pick( jo.content, "" );
			var c = Jrun.pick( jo.closable, false );
			var set = Jrun.pick( jo.activate, false );
			
			var node = Js.use( '<div/>' )
				.attr({
					id: id,
					className: this.setting.cssHidden,
					title: title
				})
				.css( "display", "none" )
				.htmlText( tx )
				.appendTo( this.node[0] );
			
			this.tabs.add( node[0] );
			
			var li = Js.use( '<li/>' ).appendTo( this.header[0] );
			var a = Js.use( '<a/>' ).attr({
				href: "#" + id,
				title: title
			}).appendTo( li[0] );
			
			Js.use( "<em/>" ).appendTo( a[0] );
			
			a.text( title ).bind( this.handler, function(){
				that.activateTab( Js.use(this).attr("href") );
				
				return false;
			});
			
			if ( !!c ) {
				Js.use( "<span/>" )
					.click(function() {
						var h = Js.use( this.parentNode ).attr( "href" );
						that.activeHeader.removeClass();
						
						that.activeTab.setClass( that.setting.hidden )
							.fadeOut( "normal", function(){
								Js.use( this ).remove();
							});
						
						Js.use( h ).remove();					
						Js.use( this.parentNode.parentNode ).remove();
						
						that.revert();
						
						return false;
					})
					.css( "paddingLeft", "10px" )
					.text( "x" )
					.appendTo( a[0] );
			}
			
			if ( !!set ) 
				this.activateTab("#" + id);
		}
		
		return this;
	}
});

