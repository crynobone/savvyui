/**
 * Savvy.UI JavaScript Library v1.2.0-draft
 * Version: 1.2.0-draft
 * Author: Mior Muhammad Zaki crynobone@gmail.com 
 * 
 * Copyright (c) 2009 Mior Muhammad Zaki Mior Khairuddin
 * Licensed under the MIT
 */

/* Map Savvy.UI Global Namespace Object
 * namespace: Js
 * Developed and tested with jQuery-1.2.6
 */
var Js = {
	adapter: "jQuery-1.2.6",
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
			Js.debug.error( "Jrun.href: failed to load page " + url );
	},
	
	// Encode HTML entities from any given string
	htmlEncode: function( value ) {
		return value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\+/g, "&#43;");
	},
	
	// Decode HTML entities from any given string
	htmlDecode: function( value ) {
		return value
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&#43;/g, "+");
	},
	
	// Check whether the value is in an array
	inArray: function( value, data ) {
		var i = 0, 
			len = data.length;
		
		for ( ; i < len && !!data[i]; i++ ) {
			if ( data[i] === value ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Check whether the value is in an array, check validity based on Regular Expression
	inArrayGrep: function( value, data ) {
		var i = 0,
			len = data.length;
		
		for ( ; i < data.length && !!data[i]; i++ ) {
			if ( data[i].match(value) ) {
				return true;
				break;
			}
		}
		
		return false;
	},
	
	// Get the indexOf based on value in an array
	'indexOf': function( value, data ) {
		var i = data.length;
		
		for ( ; i-- && data[i] !== value; );
		return i;
	},
	
	// Get the indexOf based on value in an array
	indexOfGrep: function( value, data ) {
		var i = data.length;
		
		for ( ; i-- && !data[i].match(value); );
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
		return this.typeOf ( data ) == "function";
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
		var data = jQuery.makeArray( arguments ),
			i = 0,
			len = data.length;
		
		for ( ; i < len; i++ ) {
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
		var data = jQuery.makeArray( arguments ),
			i = 0,
			len = data.length;
		var last = data[(len - 1)];
		
		for ( ; i < (len - 1); i++ ) {
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
		var data = jQuery.makeArray( arguments ),
			i = 0,
			len = data.length;
		var last = data[(len - 1)];
		
		if ( this.typeOf(last) == "string" ) 
			last = new RegExp(last);
		
		for ( ; i < (len - 1); i++ ) {
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
		var len = data.length,
			ret = new String;
		
		if ( len > 1 ) {
			jQuery.each(data, function( i, v ) {
				ret = [ret, ( i == 0 ? "" : ( i == (len - 1) ? last : between) ), v].join("");
			});
		} 
		else 
			ret = data[0];
		
		return ret;
	},
	
	rand: function( js ) {
		var data = arguments,
			len = 0,
			val = 0;
		
		if ( data.length === 2 ) {
			val = data[0];
			len = data[1];
		} 
		else if ( data.length === 1 ) 
			len = data[0];
		
		return ( Math.floor(Math.random() * len) + val );
	},
	
	// Trim right of a string.
	rtrim: function( data ) {
		return new String( data ).replace( /\s$/g, "" );
	},
	
	// Striptags work similiar to strip_tags() in PHP
	stripTags: function( data ) {
		return new String( data ).replace( /<([^>]+)>/g, "" );
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
		var val = data.split(/ /g), 
			ret = [],
			that = function(v) {
				var v = v.toString();
				return [
					v.substr( 0, 1 ).toUpperCase(),
					v.substr( 1 )
				];
			};
		
		jQuery.each(val, function(i, v) {
			ret.push( that(v).join("") );
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
		jQuery.each( data, function( i, v ) {
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
	
	prep: function( data ) {
		return ( data.match(/^(#|\.)?(.*)$/gi) ? RegExp.$2 : data );
	}
};

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
			success: null,
			onError: null
		},
		
		buttonSubmit: {
			method: "POST",
			beforeStart: null,
			beforeSend: null,
			success: null,
			onError: null
		},
		
		editable: {
			identifier: "Other",
			prefix: "",
			beforeStart: null,
			onBeforeUpdate: null,
			onUpdate: null
		}
	},
	
	widget: {
		activity: {
			imagePath: "images/",
			boxWidth: 200,
			boxHeight: 20,
			identifier: ".widget-activity",
			opacity: 0.6,
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
			closable: true
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
			cssDisabled: "disabled"
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
		validate: function( option ) {
			Js.config.ext.validate = Js.append( option, Js.config.ext.validate, ["lang"], true );
			
			if ( Jrun.isset(option.lang) ) 
				Js.language.ext.validate = Js.append( option.lang, Js.language.ext.validate );
		}
	},
	
	test: function( option ) {
		Js.config.test = Js.append( option, Js.config.test );
	},
	
	util: {
		buttonSubmit: function( option ) {
			Js.config.util.buttonSubmit = Js.append( option, Js.config.util.buttonSubmit );
		},
		
		formSubmit: function( option ) {
			Js.config.util.formSubmit = Js.append( option, Js.config.util.formSubmit );
		},
		editable: function( option ) {
			Js.config.util.editable = Js.append( option, Js.config.util.editable, ["lang"], true );
			
			if ( Jrun.isset(option.lang) ) 
				Js.language.util.editable = Js.append( option.lang, Js.language.util.editable );
		}
	},
	
	widget: {
		activity: function( option ) {
			Js.config.widget.activity = Js.append( option, Js.config.widget.activity );
		},
		
		datePicker: function( option ) {
			Js.config.widget.datePicker = Js.append( option, Js.config.widget.datePicker, ["lang"], true );
			
			if ( Jrun.isset(option.lang) ) 
				Js.language.widget.datePicker = Js.append( option.lang, Js.language.widget.datePicker );
		},
		
		dropmenu: function( option ) {
			Js.config.widget.dropmenu = Js.append( option, Js.config.widget.dropmenu );
		},
		
		iconizer: function( option ) {
			Js.config.widget.iconizer = Js.append( option, Js.config.widget.iconizer );
		},
		
		notice: function( option ) {
			Js.config.widget.notice = Js.append( option, Js.config.widget.notice, ["lang"], true );
			
			if ( Jrun.isset(option.lang) ) 
				Js.language.widget.notice = Js.append( option.lang, Js.language.widget.notice );
		},
		
		panel: function( option ) {
			Js.config.widget.panel = Js.append( option, Js.config.widget.panel );
		},
		
		tab: function( option ) {
			Js.config.widget.tab = Js.append( option, Js.config.widget.tab );
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
		to: function( data ) {
			var data = new String( data );
			data = Jrun.htmlEncode( data );
			data = encodeURIComponent( data );
			
			return data;
		},
		
		from: function( data ) {
			var data = new String( data);
			data = decodeURIComponent( data );
			data = Jrun.htmlDecode( data );
			
			return data;
		}
	},
	
	xhr: {
		init: function( reply ) {
			var that = Js.parse.xhr;
			var data = eval( "(" + reply + ")" );
			
			Js.debug.log( "XHR: " + reply );
			
			if ( Jrun.typeOf(data) == "object" ) {
				if ( !!data.SUIXHR ) {
					that.notice( data );
					that.href( data );
					that.update( data );
				}
			}
		},
		
		notice: function( data ) {
			var note = Jrun.pickType( data.notice, "string" );
			
			if ( Jrun.isset(note) && note !== "" ) {
				window.alert( note );
				
				if ( !!console ) 
					console.log( note );
			}
		},
		href: function( data ) {
			var href = Jrun.pickGrep( data.href, /^https?:\/\//g );
			var xhref = Jrun.pickGrep( data.xhref, /^https?:\/\//g );
			
			if ( Jrun.isset(xhref) && xhref !== "" ) 
				Jrun.href( xhref, "_blank" );
			
			else if ( Jrun.isset(href) && href !== "" ) 
				Jrun.href( href );
		},
		
		update: function( data ) {
			var args = Jrun.pickType( data.text, "string" );
			var id = Jrun.pickType( data.id, "string" );
			var selector = Jrun.pickType( selector, "string" );
			var object = Jrun.pickType( data.callback, null, "string" );
			
			if ( !!args ) {
				if( !!selector ) 
					Js.use( selector ).html( args );
				else if ( !!id ) 
					Js.use( "#" + id ).html( args );
				else if ( Jrun.isset(object) ) {
					// eval the function without making a callback
					var callback = eval( object );
					
					// execute the function
					if( Jrun.isfunction(callback) ) 
						callback(args);
				}
			}
		}
	}
};

/* Input test script for Savvy.UI
 * version: 1.0.3
 */

Js.test = {
	isString: function( data ) {
		return ( typeof(data) == "string" && isNaN(data) );
	},
	
	isNumber: function( data ) {
		return !isNaN( data );
	},
	
	isLength: function( data, value ) {
		var ret = false;
		
		if ( data.match(/^(exact|min|max)\-(\d*)$/i) ) {
			var length = Jrun.toNumber(RegExp.$2);
			
			switch ( RegExp.$1 ) {
				case 'max':
					ret = value <= length;
					break;
				case 'min':
					ret = value >= length;
					break;
				case 'exact':
					ret = value == length;
					break;
				default:
					ret = false;
			}
		}
		
		return ret;
	},
	
	isEmail: function( data ) {
		return ( data.match(Js.config.test.email) );
	},
	
	isURL: function( data ) {
		return ( data.match(Js.config.test.url) );
	},
	
	isIpAddress: function( data ) {
		return ( data.match(Js.config.test.ip) );
	},
	
	isPostcode: function( data ) {
		return ( data.match(Js.config.test.postcode) );
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
	
	initiate: function( js ) {
		var that = this;
		var js = Jrun.pickType( js, {}, "object" );
		this.element = Jrun.pick( js.element, null );
		this.fnBeforeStart = Jrun.pick( js.beforeStart, this.fnBeforeStart );
		this.fbSuccess = Jrun.pick( js.success, this.fnSuccess );
		
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
			var ret;
			
			ret = ( hash.match(/^\#/) ? ["", hash.substr(1)] : hash.split(/\#/) ); 
			
			if ( Jrun.isfunction(that.fnBeforeStart) ) 
				that.fnBeforeStart();
			
			if ( Jrun.isset(ret[1]) ) {
				that.repeat = ( ret[1] === that.last );
				
				that.last = ret[1];
				that.init( ret[1].split(/\//) );
				
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
	
	initiate: function( js ) {
		this.id = Jrun.pick( js.id, null );
		this.url = Jrun.pick( js.url, null );
		this.button = Jrun.pick( js.button, null );
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( js.option );
		
		return this;
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	_prepSetting: function() {
		this.formValidate = Js.nue( this.setting );
		this.formValidate.success = null;
		this.formValidate.onError = null;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.util[this.appName] );
		this._prepSetting();
		
		var method = Jrun.pickGrep( this.setting.method, /^(get|post)$/i );
		
		// bind onClick event delegation to the button
		Js.use( this.button ).bind( this.handler, function() {
			// we need to validate the form
			var form = new Js.ext.validate( that.id, that.formValidate );
			var params = form.cacheResult;
			
			if( !!params ) {
			   jQuery.ajax({
					type: method,
					url: that.url,
					data: params,
					beforeSend: function() {
						if ( Jrun.isfunction(that.setting.beforeSend) ) 
							that.setting.beforeSend.apply( that );
					},
					success: function( reply ) {
						var runDefault = true;
						
						if ( Jrun.isfunction(that.setting.success) ) 
							runDefault = that.setting.success.apply( that, [reply] );
						
						if ( runDefault !== false ) 
							Js.parse.xhr.init(reply);
					},
					onError: function() {
						if( Jrun.isfunction(that.setting.onError) ) 
							that.setting.onError.apply( that );
					}
				});
			}
			else {
				if( Jrun.isfunction(that.setting.onError) ) 
					that.setting.onError();
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
				var doc = document.body;
				var ret = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
				
				if ( typeof(offset) == "number" ) 
					ret = offset;
				
				else if ( doc && doc.scrollLeft ) 
					ret = doc.scrollLeft;
				
				else if ( el && el.scrollLeft ) 
					ret = el.scrollLeft;
				
				return ret;
			},
			
			y: function() {
				var doc = document.body;
				var ret = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if ( typeof(offset) == "number" ) 
					ret = offset;
				
				else if ( doc && doc.scrollTop ) 
					ret = doc.scrollLeft;
				
				else if ( el && el.scrollTop ) 
					ret = el.scrollLeft;
				
				return ret;
			},
			
			both: function() {
				var that = Js.util.dimension.page.scrolls;
				return [
					that.x(), 
					that.y()
				];
			}
		},
		
		middle: function( width, height ) {
			var doc = document.body;
			var offset = [Js.use(window).width(), Js.use(window).height()];
			var axis = Js.util.dimension.page.scrolls.both();
			var ret = [];
					
			ret[0] = Math.round( ((offset[0] - width) / 2) + axis[0] );
			ret[1] = Math.round( ((offset[1] - height) / 2) + axis[1] ); 
			
			ret[0] = ( ret[0] < 0 ? 0 : ret[0] );
			ret[1] = ( ret[1] < 0 ? 0 : ret[1] );
				
			return ret.reverse();
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
	
	initiate: function( js ) {
		if ( Jrun.parameter(arguments, 1, ["object"]) ) {
			this.id = Jrun.pick( js.id, null );
			this.url = Jrun.pick( js.url, null );	
		} 
		else if ( Jrun.parameter(arguments, 2, [true, "string"]) ) {
			this.id = Jrun.pick( arguments[0], null );
			this.url = Jrun.pick( arguments[1], null );
		}
		
		this.button = this.id;
		
		// if id, url and button have been defined, straight away call this.init()
		if( !!this.id && !!this.url && this.button ) 
			this.init( js.option );
		
		
		return this;
	}
});


/* Checkbox Ticker for Savvy.UI
 * version: 0.1.2
 */

Js.util.ticker = Js.create({
	element: null,
	node: null,
	
	initiate: function( selector ) {
		return ( Jrun.isset(selector) ? this.init( selector ) : this );
	},
	
	init: function( selector ) {
		this.element = Jrun.pick( selector, null );
		
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
	
	initiate: function( element, option ) {
		return ( !!Jrun.isset(element) ? this.init( element, option ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if ( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.language );
		
		return this;
	},
	
	init: function( selector, option ) {
		var that = this;
		
		this.element = Jrun.pick( this.element, selector );
		this.setup( option );
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
			overlay: true
		});
		
		var div = Js.use( "<div/>" )
			.setClass( "data" )
			.appendTo( this.box.content[0] );
		
		var p = Js.use( "<label/>" )
			.plainHtml( "" + this.language.message )
			.appendTo( div[0] );
			
		this.input = Js.use( '<input type="text"/>')
			.attr( "name", "util_editable_" + Jrun.prep( this.element ) )
			.val( this.setting.prefix )
			.appendTo( div[0] );
		
		
		var box = this.box;
		
		box.overlay.node.bind( "click", function() {
			that.input.val("");
			box.closePanel();
		});
		
		box.closeButton.bind( "click", function() {
			that.input.val("");
			box.closePanel();
		});
	}
});
/* Includer for Savvy.UI
 * version: 0.0.5
 */

Js.util.includer = { 
	script: function( src ) {
		var node = Js.use( "<script/>" ).attr({
			"type": "text/javascript",
			"src": src
		}).appendTo( "head" );
		
		return node;
	},
	
	style: function( src, media ) {
		var media = Js.pickGrep(media, "all", /^(all|print|screen|handheld)$/i);
		var node = Js.use( "<link/>" ).attr({
			"type": "text/css",
			"href": src,
			"media": media
		}).appendTo( "head" );
		
		return node;
	}
};
/* Smart Input Field for Savvy.UI
 * version: 0.0.2
 */

Js.util.smartInput = Js.create({
	node: null,
	
	initiate: function( node ) {
		return ( Jrun.isset(node) ? this.init( node ) : this );
	},
	
	init: function( node ) {
		var node = Jrun.pick( node, this.node );
		this.node = Js.use( node );
		
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
	status: 0,
	
	initiate: function( selector, option ) {
		return ( Jrun.isset(selector) ? this.init( selector, option ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if ( Jrun.isset(option.lang) ) 
			this.language = Js.append( option.lang, this.language );
		
		return this;
	},
	
	init: function( selector, option ) {
		this.element = Jrun.pick( selector, this.element );
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		this.node = Js.use( this.element );
		
		if ( this.node.length == 0 ) 
			this.node = Js.use( "<div/>" ).attr( "id", Jrun.prep(this.element) ).appendTo( "body" );
		
		this.node.css({
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: "none"
		}).setClass( Jrun.prep(this.setting.identifier) ).css( "opacity", 0.01 );
		
		return this;
	},
	
	activate: function( callback ) {
		if ( this.status == 0 ) {
			this.node.css( "display", "block" ).fadeTo( "normal", this.setting.opacity );
			
			var t = Js.util.dimension.page.middle( this.setting.boxWidth, this.setting.boxHeight );
			
			if ( Jrun.isset(this.box) ) {
				this.box.css({
					top: t[0] + "px",
					left: t[1] + "px"
				});
			}
		}
		
		this.status++;
		
		if ( Jrun.isfunction(callback) ) 
			callback();
	},
	loadImage: function() {
		this.box = Js.use( "<img/>" )
			.attr( "src", this.setting.imagePath )
			.css({
				position: "absolute",
				width: this.setting.boxWidth + "px",
				height: this.setting.boxHeight + "px",
				zIndex: (this.setting.zIndex + 1)
			})
			.appendTo( this.node[0] );
	},
	
	deactivate: function( callback ) {
		if ( this.status > 0 ) {
			this.node.fadeTo( "normal", 0, function(){
				Js.use( this ).css(	"display", "none" );
				
				if ( Jrun.isfunction(callback) ) 
					callback();
			});
		}
		
		this.status--;
		this.status = ( this.status < 0 ? 0 : this.status );
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
					days.plainHtml("&nbsp;").setClass("calendar-invalid");
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
 * version: 0.0.1
 */

Js.widget.dropmenu = Js.create({
	node: null,
	setting: null,
	
	initiate: function( selector, option ) {
		return ( Jrun.isset( selector ) ? this.init( selector ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
	},
	
	init: function( selector, option ) {
		var that = this;
		
		this.node = Js.use( selector ).addClass( this.setting.css );
		this.setup( option );
		
		Js.use( "ul, li", this.node[0] ).hover( function(){
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
		
		return this;	
	},
	
	_show: function( field ) {
		var child = this._getChild( field );
		
		if ( !child ) 
			return false;
		
		var node = Js.use( child )
			.data( 'cancelHide', true )
			.css( "zIndex", this.setting.zIndex++ )
			.fadeIn( this.setting.speed )
			.slideDown( this.setting.speed );
		
		if ( field.nodeName.toLowerCase() == "ul" ) {
			var li = this._getPosition( field );
			Js.use( li ).addClass( 'hover' );
			Js.use( '> a', li ).addClass( 'hover' );
		}
	},
	
	_hide: function( field ) {
		var that = this;
		
		var child = this._getChild( field );
		
		if ( !child )
			return false;
			
		var node = Js.use( child )
			.data( 'cancelHide', false );
		
		setTimeout( function() {
			if( !node.data( 'cancelHide' ) ) {
				node.slideUp( that.setting.speed );
			}
		}, 200);
	},
	
	_getChild: function( field ) {
		if ( field.nodeName.toLowerCase() == "li" ) {
			var child = Js.use( "> ul", field );
			return child.size() > 0 ? child[0] : null ;
		}
		else 
			return field;
	},
	
	_getPosition: function( field ) {
		return ( field.nodeName.toLowerCase() == 'ul' ? Js.use( field ).parents( 'li' )[0] : field );
	}
});

/* Iconizer widget for Savvy.UI
 * version: 0.0.3
 */

Js.widget.iconizer = Js.create({
	appName: "iconizer",
	setting: null,
	
	initiate: function( option ) {
		return ( Jrun.isset(option) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
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
	
	initiate: function( option ) {
		return ( Jrun.isset(option) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting, ["lang"], true );
		
		if ( Jrun.isset(option.lang) ) 
			this.language = Js.append(option.lang, this.language);
		
		return this;
	},
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
	},	
	
	init: function(option) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) {
			this.renderTo = Js.use(this.renderTo);
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.use("body").eq(0);
		}
			
		this._loadBorder();
		this._loadContent();
		
		if ( Jrun.isset(this.setting.button) ) {
			for ( var i = 0; i < this.setting.button.length; i++ ) 
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
		var that = this;
		
		// set panel width
		if ( Jrun.isset(this.setting.width) ) 
			this.main.css( "width", this.setting.width + "px" );
		
		// render header
		this.header = Js.use( "<h2/>" )
			.addClass( "header" )
			.appendTo( this.main[0] );
		
		// render content
		this.container = Js.use( "<div/>" )
			.addClass( "content-container" )
			.appendTo( this.main[0] );
		
		// render footer
		this.footer = Js.use( "<div/>" )
			.addClass( "footer" )
			.appendTo( this.main[0] );
		
		
		// set panel height
		if ( Jrun.isset(this.setting.height) ) 
			this.container.css( "height", this.setting.height + "px" );
		
		// render header title
		this.mainTitle = Js.use( "<span/>" )
			.addClass( "title" )
			.text( this.setting.title )
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
		if ( !!this.setting.closable ) 
			this.closeButton.addClass( "close" ).click( function() { that.closePanel(); return false; });
		else 
			this.closeButton.addClass( "button-disabled" );
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.use( "<div/>" )
			.attr( "id", this.element )
			.setClass( "content" )
			.appendTo( this.container[0] );
		
		try {
			this.content.html( this.setting.content );
		} catch(e) {
			this.content.plainHtml( this.setting.content );
		}
		
		// set height and scrolling option for content CONTAINER
		if ( Jrun.isset(this.setting.height) && !!this.setting.scroll ) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px",
				"overflow": "auto"
			});
		}
		
		// make the panel visible
		this.node.show( "slow" );
		
		return this;
	},
	
	closePanel: function() {
		var that = this;
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction(that.setting.onClose) ) 
				that.setting.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	title: function( text ) {
		this.mainTitle.html("").text( text );
	},
	
	addButton: function( js ) {
		var that = this;
		var callback = Jrun.pickType( js.callback, "function" );
		var text = Jrun.pickType( js.text, this.language.defaultButton, "string" );
		var type = Jrun.pickGrep( js.type, "normal", /^(normal|submit|cancel)$/i );
		
		Js.use( "<a/>" )
			.attr( "href", "#" )
			.click( function() {
				var runDefault = false;
				if ( Jrun.isfunction(callback) ) 
					runDefault = callback();
				
				if ( runDefault === true ) 
					that.closePanel();
				
				return false;
			})
			.addClass( "buttons" )
			.addClass( type )
			.text( text )
			.appendTo( this.buttons[0] );
	},
	
	_fixResize: function() {
		if ( Jrun.isset(this.setting.height) && !!this.setting.scroll ) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
});

/* Modal Dialog for Savvy.UI
 * version: 0.1.2
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	allowOverlay: false,
	
	_prepSetting: function() {
		this.renderTo = Jrun.pick( this.setting.renderTo, "body:eq(0)" );
		this.element = this.setting.element;
		this.allowOverlay = Jrun.pickType( this.setting.overlay, this.allowOverlay, "boolean" );
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepSetting();
		
		// set renderTo element
		if ( typeof(this.renderTo) === "string" || this.renderTo.nodeType ) {
			this.renderTo = Js.use(this.renderTo);
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		if ( this.allowOverlay == true ) 
			this.overlay = new Js.widget.activity("#overlay-panel");
		
		
		this._loadBorder();
		this._loadContent();
		
		if ( Jrun.isset(this.setting.button) ) {
			for ( var i = 0; i < this.setting.button.length; i++ ) 
				this.addButton( this.setting.button[i] );
		}
	
		
		if ( this.allowOverlay == true ) 
			this.overlay.activate();
		
		this.fixDimension();
		
		return this;
	},
	
	closePanel: function() {
		var that = this;
		
		if ( this.allowOverlay == true ) 
			this.overlay.deactivate();
		
		// callback to close panel
		this.node.fadeOut( "slow", function() {
			if ( Jrun.isfunction(that.setting.onClose) ) 
				that.setting.onClose.apply(that);
			
			that.node.remove();
		});
		
		return this;
	},
	
	fixDimension: function() {
		var offset = [
			this.main.width(),
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
	
	initiate: function( selector, option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.node = this.$super.initiate( selector, {
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
	_domAddNotice: function( note, status ) {
		var status = Jrun.pickGrep( status, "note", /^(note|success|error)$/i );
		var that = this;
		
		this.node.box.text("");
		this.node.activate();
		
		var title = this.language[Jrun.camelize("title-" + status)];
		var message = "";
		var ret = false;
		
		if ( Jrun.typeOf(note) != "object" ) 
			title = note;
		else {
			title = Jrun.pick( note.title, "" );
			message = Jrun.pick( note.message, "" );
			ret = Jrun.pick( note.sticky, false );
		}
		
		this.node.box.setClass( this.setting['css' + Jrun.toProperCase(status)] );
		
		Js.use( "<h3/>" )
			.text( title )
			.appendTo( this.node.box[0] );
		
		if ( message != "" ) 
			var p = Js.use( "<p/>" ).plainHtml( "" + message ).appendTo( this.node.box[0] );
		
		
		var span = Js.use( "<em/>" )
			.text( Js.language.widget.notice.timer )
			.appendTo( this.node.box[0] );
		
		this.node.node.one( "click", function() {
			that.closeNotice();
		});
		
		if ( ret == false ) {
			setTimeout( function() {
				that.closeNotice();
			}, (this.setting.seconds * 1000) );
		}
	},
	success: function( note, callback ) {
		this.callback = Jrun.pick( callback, null );
		this._domAddNotice( note, 'success' );
	},
	note: function( note, callback ) {
		this.callback = Jrun.pick( callback, null );
		this._domAddNotice( note, 'note' );
	},
	error: function( note, callback ) {
		this.callback = Jrun.pick( callback, null );
		this._domAddNotice( note, 'error' );
	}
});
/* Tab Panel for Savvy.UI
 * version: 0.9.3
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
	statys: "off",
	setting: null,
	tabs: null,
	
	initiate: function( selector, option ) {
		return ( !!Jrun.isset(selector) ? this.init(selector, option) : this );
	},
	
	setup: function( option ) {
		var option = Jrun.pickType( option, {}, "object" );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	init: function( selector, option ) {
		var that = this;
		
		// setting should be available
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget.tab );
		
		this.node = Js.use( selector );
		this.node.addClass( this.setting.container );
		this.element = this.node.eq(0).attr( "id" );
		
		this.handler = Jrun.pickGrep( this.setting.handler, "click", /^(mouseover|click)$/i );
		
		// add tab toolbar on top
		this._addToolbar();
		
		this.activateTab( "#" + Js.use("." + this.setting.cssHidden + ":first", this.node[0]).attr("id") );
		
		// tab is activated
		this.status = "on";
		
		return this;
	},
	
	_addToolbar: function() {
		var that = this;
		
		// DOM insert tab toolbar container
		var div = Js.use( "<div/>" )
			.attr({
				className: this.setting.toolbarContainer, 
				id: [this.element, "toolbar", "container"].join("-")
			})
			.prependTo( this.node[0] );
		
		this.toolbar = div;
		
		// DOM insert tab toolbar
		this.header = Js.use( "<ul/>" )
			.attr({
				id: [this.element, "toolbar"].join("-"), 
				className: this.setting.toolbar
			})
			.appendTo( this.toolbar[0] );
		
		// find all possible tabs
		var child = Js.use( this.setting.identifier, this.node[0] );
		
		child.each(function( i, v ) {
			// add the tab title
			that._addHeader( v );
			// hide the tab
			Js.use( v ).setClass( that.setting.cssHidden );
		});
		
		this.tabs = child;
		
		var div2 = Js.use( "<div/>" ).css( "display", "block" ).appendTo( div[0] );
	},
	
	_addHeader: function( node ) {
		var that = this;
		
		var node = Js.use( node );
		var title = node.attr( "title" );
		
		var closable = node.hasClass( this.setting.closable );
		var disabled = node.hasClass( this.setting.disabled );
		
		var li = Js.use( "<li/>" ).appendTo( this.header[0] );
		var a = Js.use( "<a/>" )
			.attr({
				href: "#" + node.attr("id"), 
				title: title
			})
			.appendTo( li[0] );
		
		Js.use( "<em/>" ).appendTo( a[0] );
		a.text( title );
				
		if ( !!closable ) {
			Js.use( "<span/>" )
				.css( "paddingLeft", "10px" )
				.text("x")
				.click(function(){
					var my = Js.use( this.parentNode ).click(function(){
						return false;
					});
				
					var href = my.attr( "href" );
					that.activeHeader.removeClass();
					that.activeTab.setClass( that.setting.hidden );
					Js.use( href ).remove();
					Js.use( this.parentNode.parentNode ).remove();
				
					that.revert();
					
					return false;
				})
				.appendTo( a[0] );
		}
		
		if ( !!disabled ) {
			a.setClass( this.setting.cssDisabled )
				.bind( this.handler, function(){
					return false;
				});
		}
		else {
			a.bind( this.handler, function(){
				that.activateTab( Js.use(this).attr("href") );
				
				return false;
			});
		}
	},
	
	enableTab: function( selector ) {
		var that = this;
		
		Js.use( "a[href=" + selector + "]", this.header[0] )
			.removeClass()
			.unbind( this.handler )
			.bind( this.handler, function(){
				that.activateTab( Js.use(this).attr("href") );
				return false;
			});
				
		return false;
	},
	
	disableTab: function( selector ) {
		var that = this;
		
		Js.use( "a[href=" + selector + "]", this.header[0] )
			.setClass( this.setting.cssDisabled )
			.unbind( this.handler )
			.bind( this.handler, function(){
				return false;
			});
		
		return false;
	},
	
	activateTab: function( selector ) {
		var that = this;
		
		if ( Jrun.isset(this.activeTab) ) {
			this.activeHeader.removeClass( this.setting.cssCurrent );
			this.activeTab.setClass( this.setting.cssHidden );
		}
		
		this.activeHeader = Js.use( "a[href=" + selector + "]", this.header[0] );
		this.activeTab = Js.use( selector );
		
		this.activeHeader.addClass( this.setting.cssCurrent );
		this.activeTab.setClass( this.setting.cssActive );
		
		return false;
	},
	
	revert: function() {
		var active = Js.use( "li > a", this.header[0] );
		
		if ( active.length > 0 ) 
			this.activateTab( active.attr("href") );
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
	
	addTab: function( js ) {
		var that = this;
		
		if ( !!js.id && Jrun.typeOf(js.id) === "string" ) {
			var title = Jrun.pick( js.title, "Untitled" );
			var id = js.id;
			var content = Jrun.pick( js.content, "" );
			var closable = Jrun.pick( js.closable, false );
			var set = Jrun.pick( js.activate, false );
			
			var node = Js.use( '<div/>' ).attr({
				id: id,
				className: this.setting.cssHidden,
				title: title
			}).plainHtml( content ).appendTo( this.node[0] );
			
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
			
			if ( !!closable ) {
				Js.use( "<span/>" )
					.click(function(){
						var href = Js.use( this.parentNode ).attr( "href" );
						that.activeHeader.removeClass();
						
						that.activeTab.setClass( that.setting.hidden )
							.fadeOut( "normal", function(){
								Js.use( this ).remove();
							});
						
						Js.use( href ).remove();					
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
