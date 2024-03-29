/**
 * Savvy.UI JavaScript Library v1.2.0-draft
 * Version: 1.2.0-a3
 * Author: Mior Muhammad Zaki crynobone@gmail.com 
 * 
 * Copyright (c) 2009 Mior Muhammad Zaki Mior Khairuddin
 * Licensed under the MIT
 *
 * http://savvyui.googlecode.com
 * Revision: r338 
 */

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
	var num = Js.helper.pickType( num, 1, 'number' );
	var type_of = Js.helper.typeOf( data, 'object' );
	
	if ( Js.helper.inArray( type_of, ['object', 'array']) ) {
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
	var define = Js.helper.pickType( define, null, 'array' );
	
	// invert append option
	var invert = Js.helper.pickType( invert, false, 'boolean' );
	
	if ( !Js.helper.typeOf( data, 'object' ) )
		data = {};
	
	var result = data;
	
	// loop value's method
	for ( var method in alt ) {
		// if data doesn't have the method add it
		var add = Js.helper.isnull( define ) || Js.helper.inArray( method, define );
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
		var value = Js.helper.pick( value, '' );
		
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
		var value = Js.helper.pick( value, '' );
		
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
 * namespace: Js.helper
 */
Js.helper = Js.fn = {
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
			browse.ie = browse[ win.XMLHttpRequest ? 'ie7' : 'ie6' ] = !!win.ActiveXObject;
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
		var length = value.length;
		
		// if array only have one value
		if ( length === 1 )
			return value[0];
		
		var result = ( data.indexOf('-') == 0 ? value[0].charAt(0).toUpperCase() + value[0].substr(1) : value[0] );
		
		for ( var index = 1; index < length; index++ ) {
			result = [
				result, 
				value[index].charAt(0).toUpperCase(), 
				value[index].substr(1)
			].join('');
		}
		
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
			Js.debug.error( 'Js.helper.href: failed to load page ' + uri );
	},
	
	// Encode HTML entities from any given string
	htmlEncode: function( text ) {
		return new String( text )
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\+/g, '&#43;');
	},
	
	// Decode HTML entities from any given string
	htmlDecode: function( text ) {
		return new String( text )
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&#43;/g, '+');
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
			expect = Js.helper.pickType( expect, [], 'array' ),
			result = false;
		
		if ( data.length === length ) {
			result = true;
			
			jQuery.each( data, function( index, val ) {
				if ( expect[index] !== true && Js.helper.typeOf( val ) !== expect[index] ) 
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
            
            if ( Js.helper.isset( result ) ) {
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
            
            if ( Js.helper.isset( result ) ) {
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
		
		if ( this.typeOf( regex ) == 'string' ) 
			regex = new RegExp( regex );
		
		for ( ; index < ( length - 1 ); index++ ) {
			result = data[index];
            
            if ( Js.helper.isset( result ) ) {
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
		var replace = Js.helper.pickType( replace, '', 'string' );
		
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
			that = function( text ) {
				var text = text.toString();
				return [
					text.substr( 0, 1 ).toUpperCase(),
					text.substr( 1 )
				].join('');
			};
		
		jQuery.each( value, function( index, val ) {
			result.push( that( val ) );
		});
		
		return result.join(' ');
	},
	
	// Convert a object (mainly use for arguments) to array & require on .length to check the length to object to convert
	toArray: function( data, offset ) {
		var offset = (function(o) {
			var o = Js.helper.pickType( o, 0, 'number' );
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
			if ( Js.helper.isnull( data ) ) 
				return 'undefined';
			else {
				var value = Object.prototype.toString.call( data ).match(/(\w+)\]/)[1];
				return ( value == 'HTMLDocument' ? 'element' : value.toLowerCase() );
			}
		})( data );
		
		return ( Js.helper.isset( type ) ? (result === type.toLowerCase()) : result );
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
				if ( !Js.helper.inArray( value, result ) ) 
					result.push( value );
			} 
			else {
				if ( index == 0 || value !== Js.helper.trim( data[i - 1] ) ) 
					result.push( value );
			}
		});
		
		return result;
	},
	
	prep: function( data ) {
		return ( data.match( /^(#|\.)?(.*)$/gi ) ? RegExp.$2 : data );
	}
};

Js.data = {};
Js.ext = {};
Js.util = {};
Js.widget = {};

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

/* Adapter for Savvy.UI and jQuery Framework
 * version: 0.0.3
 * @extends jQuery
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

jQuery.fn.extend({
	setClass: function( value ) {
		return this.each( function() {
			this.className = value;
		} );
	},
	
	htmlText: function( text ) {
		if ( text == undefined ) 
			return ( this[0] ? this[0].innerHTML : null );
		else {
			this.each( function() {
				this.innerHTML = text;
			} );
			
			return this;
		}
	}
});

// Bind Js.use with jQuery Object
Js.$ = window.jQuery;

Js.config = {
	ext: {
		validate: {
			errorNode: 'span.form-error-message',
			beforeStart: null,
			success: null,
			onError: null,
			auto: true
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
			method: 'POST',
			beforeStart: null,
			beforeSend: null,
			formSuccess: null,
			sendSuccess: null,
			onError: null,
			onSendError: null
		},
		
		buttonSubmit: {
			method: 'POST',
			beforeStart: null,
			beforeSend: null,
			formSuccess: null,
			sendSuccess: null,
			onError: null,
			onSendError: null
		},
		
		editable: {
			identifier: 'Other',
			prefix: '',
			beforeStart: null,
			onBeforeUpdate: null,
			onUpdate: null,
			overlay: true
		}
	},
	
	widget: {
		activity: {
			imagePath: 'images/',
			boxWidth: 200,
			boxHeight: 20,
			identifier: '.widget-activity',
			opacity: 0.3,
			background: '#fff',
			zIndex: 5000
		},
		
		datePicker: {
			daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			dateFormat: /^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/,
			onUpdate: null,
			navigation: true,
			fieldType: 'hidden',
			beforeStart: null
		},
		
		dropmenu: {
			speed: 250,
			zIndex: 100,
			css: 'widget-dropmenu'
		},
		
		iconizer: {
			fileType: 'png',
			folder: 'icons/'
		},
		
		message: {
			identifier: '#overlay-message',
			cssSuccess: 'message-success',
			cssNote: 'message-note',
			cssError: 'message-error',
			seconds: 5
		},
		
		notice: {
			cssSuccess: 'notice-success',
			cssNote: 'notice-note',
			cssError: 'notice-error',
			seconds: 5,
			beforeStart: null,
			onClose: null
		},
		
		panel: {
			title: 'Untitled',
			width: null,
			height: null,
			content: '',
			onClose: null,
			closable: true,
			header: true,
			overlay: true,
			clickOver: false,
			onClickOver: null 
		},
		
		tab: {
			handler: 'click',
			identifier: '.tab',
			closable: 'closable',
			disabled: 'disabled',
			toolbar: 'tab-toolbar',
			toolbarContainer: 'tab-toolbar-container',
			container: 'tab-container',
			cssHidden: 'tab-hidden',
			cssActive: 'tab-active',
			cssCurrent: 'current',
			cssDisabled: 'disabled',
			fx: true,
			header: ''
		}
	}
};

Js.setup = {
	ext: {
		validate: function( data ) {
			Js.config.ext.validate = Js.append( data, Js.config.ext.validate, ['lang'], true );
			
			if ( Js.helper.isset( data.lang ) ) 
				Js.language.ext.validate = Js.append( data.lang, Js.language.ext.validate );
		}
	},
	
	test: function( data ) {
		Js.config.test = Js.append( data, Js.config.test );
	},
	
	util: {
		buttonSubmit: function( data ) {
			Js.config.util.buttonSubmit = Js.append( data, Js.config.util.buttonSubmit );
		},
		
		formSubmit: function( data ) {
			Js.config.util.formSubmit = Js.append( data, Js.config.util.formSubmit );
		},
		editable: function( data ) {
			Js.config.util.editable = Js.append( data, Js.config.util.editable, ['lang'], true );
			
			if ( Js.helper.isset( data.lang ) ) 
				Js.language.util.editable = Js.append( data.lang, Js.language.util.editable );
		}
	},
	
	widget: {
		activity: function( data ) {
			Js.config.widget.activity = Js.append( data, Js.config.widget.activity );
		},
		
		datePicker: function( data ) {
			Js.config.widget.datePicker = Js.append( data, Js.config.widget.datePicker, ['lang'], true );
			
			if ( Js.helper.isset( data.lang ) ) 
				Js.language.widget.datePicker = Js.append( data.lang, Js.language.widget.datePicker );
		},
		
		dropmenu: function( data ) {
			Js.config.widget.dropmenu = Js.append( data, Js.config.widget.dropmenu );
		},
		
		iconizer: function( data ) {
			Js.config.widget.iconizer = Js.append( data, Js.config.widget.iconizer );
		},
		
		notice: function( data ) {
			Js.config.widget.notice = Js.append( data, Js.config.widget.notice, ['lang'], true );
			
			if ( Js.helper.isset( data.lang ) ) 
				Js.language.widget.notice = Js.append( data.lang, Js.language.widget.notice );
		},
		
		panel: function( data ) {
			Js.config.widget.panel = Js.append( data, Js.config.widget.panel );
		},
		
		tab: function( data ) {
			Js.config.widget.tab = Js.append( data, Js.config.widget.tab );
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
		to: function( text ) {
			return encodeURIComponent( Js.helper.htmlEncode( new String( text ) ) );
		},
		
		from: function( text ) {
			return Js.helper.htmlDecode( decodeURIComponent( new String( text ) ) );
		}
	},
	
	xhr: {
		init: function( json ) {
			var that = Js.parse.xhr;
			var data = eval( '(' + json + ')' );
			
			Js.debug.log( 'XHR: ' + json );
			
			if ( Js.helper.typeOf( data ) == 'object' ) {
				if ( !!data.SUIXHR ) {
					that.notice( data );
					that.href( data );
					that.update( data );
					
					return true;
				}
				else 
					return false;
			}
		},
		
		notice: function( data ) {
			var value = Js.helper.pickType( data.notice, 'string' );
			
			if ( Js.helper.isset(value) && value !== '' ) {
				window.alert( value );
				
				try {
					console.log( value );
				} catch(e) { }
			}
		},
		href: function( data ) {
			var href = Js.helper.pickGrep( data.href, /^https?:\/\//g );
			var xhref = Js.helper.pickGrep( data.xhref, /^https?:\/\//g );
			
			if ( Js.helper.isset( xhref ) && xhref !== '' ) 
				Js.helper.href( xhref, '_blank' );
			
			else if ( Js.helper.isset( href ) && href !== '' ) 
				Js.helper.href( href );
		},
		
		update: function( data ) {
			var args = Js.helper.pick( data.text );
			var identity = Js.helper.pickType( data.id, 'string' );
			var element = Js.helper.pickType( data.selector, 'string' );
			var callback = Js.helper.pickType( data.callback, 'string' );
			
			if ( Js.helper.typeOf( args ) == 'string' ) {
				if ( !!element ) 
					Js.$( element ).html( args );
				else if ( !!identity ) 
					Js.$( '#' + identity ).html( args );
			}
			else if ( Js.helper.isset( callback ) ) {
				// eval the function without making a callback
				var fn = eval( callback );
				
				// execute the function
				if ( Js.helper.isfunction( fn ) ) 
					fn( args );
			}
		}
	}
};

/* Input test script for Savvy.UI
 * version: 1.0.3
 */

Js.test = {
	isString: function( value ) {
		return ( typeof( value ) == 'string' && isNaN( value ) );
	},
	
	isNumber: function( value ) {
		return !isNaN( value );
	},
	
	isLength: function( data, value ) {
		var result = false;
		
		if ( data.match(/^(max|min|exact)\-(\d*)$/i) ) {
			var type = RegExp.$1;
			var length = Js.helper.toNumber( RegExp.$2 );
			
			switch ( type ) {
				case 'max':
					result = value <= length;
					break;
				case 'min':
					result = value >= length;
					break;
				case 'exact':
					result = value == length;
					break;
				default:
					result = false;
			}
		}
		
		return result;
	},
	
	isEmail: function( value ) {
		return ( value.match( Js.config.test.email ) );
	},
	
	isURL: function( value ) {
		return ( value.match( Js.config.test.url ) );
	},
	
	isIpAddress: function( value ) {
		return ( value.match( Js.config.test.ip ) );
	},
	
	isPostcode: function( value ) {
		return ( value.match( Js.config.test.postcode ) );
	}
};
/* Form Validation extension for Savvy.UI
 * version: 0.9.7
 */

Js.ext.validate = Js.create({
	appName: 'validate',
	node: null,
	first: null,
	setting: null,
	language: null,
	data: '',
	test: {
		match: [],
		compareDate: []
	},
	result: null,
	
	initiate: function( node, option ) {
		return ( Js.helper.isset( node ) ? this.init( node, option ) : this );
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting, ['lang'], true );
		
		if( Js.helper.isset( option.lang ) ) 
			this.language = Js.append( option.lang, this.setting );
			
		return this;
	},
	
	_prepare: function() {
		this.setting.errorNode.match( /^(span|div|p|em|label|strong|b|i)\.(.*)$/i );
		this.setting.error = {
			node: RegExp.$1,
			cssMessage: RegExp.$2
		};
	},
	
	init: function( node, option ) {
		// ensure that refer to this
		var that = this;
		
		// node should refer to only one object
		this.node = Js.$( node ).eq( 0 );
		
		// setup configuration
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.ext[this.appName] );
		this.language = Js.append( this.language, Js.language.ext[this.appName] );
		
		this._prepare();
		
		if ( Js.helper.isset( this.setting.auto ) && this.setting.auto === true ) 
			this.run();
		
		return this;
	},
	
	run: function() {
		var that = this;
		var setting = this.setting;
		var fn_before_start = Js.helper.pick( setting.beforeStart, null );
		var fn_success = Js.helper.pick( setting.success, null );
		var fn_on_error = Js.helper.pick( setting.onError, null );
		var continue_run = true;
		
		// start over
		this.data = '';
		this.first = null;
		
		if ( Js.helper.isfunction( fn_before_start ) ) {
			// execute the function and free up the memory
			continue_run = fn_before_start.apply( this );
			fn_before_start = null;
		}
		
		if ( continue_run === false ) 
			return false;
		
		if ( this.node.length >= 1 ) {
			// based on the form, select on input type
			Js.$( ':input', this.node ).each( function( index, value ) {
				that._validate( value );
			} );
		}
		
		if ( Js.helper.isset( this.first ) ) {
			// there an error, set focus to first invalid field
			try {
				this.first.focus();
			} 
			catch (e) {
				Js.debug.log( 'Js.ext.form: Cannot trigger onFirstFormError ' + e );
			}
			
			if ( Js.helper.isfunction( fn_on_error ) ) 
				fn_on_error.apply( this );
			
			// stop form processing
			this.result = false;
			
			return false;
		}
		else {
			// return all field data in querystring format
			if ( Js.helper.isfunction( fn_success ) ) 
				fn_success.apply( this );
			
			this.result = this.data;
			return this.data;
		}
	},
	
	_error: function( node, text ) {		
		var that = this;
		this.first = ( Js.helper.isnull( this.first ) ? node : this.first );
		this._addError( node, text );
	},
	
	_data: function( node ) {
		var data = '';
		
		// dump name and value to opt in querystring format ( &name=value )
		if ( node.is(':checkbox, :radio') ) {
			if ( node.is(':checked') ) 
				data += '&' + node.attr( 'name' ) + '=' + Js.parse.html.to( node.val() );
		} 
		
		else 
			data += '&' + node.attr( 'name' ) + '=' + Js.parse.html.to( node.val() );
		
		return data;
	},
	
	_removeError: function( node ) {
		var error_span = this.setting.errorNode;
		var error_node = node.siblings( error_span );
		
		if ( error_node.length > 0 ) 
			error_node.remove();
	},
	
	_addError: function( node, message ) {
		var that = this;
		var error_node = node.siblings( this.setting.errorNode ).eq(0);
		
		if ( error_node.length < 1 ) 
				Js.$( '<' + this.setting.error.node + '/>' )
					.addClass( this.setting.error.cssMessage )
					.text( message )
					.insertAfter( node[0] );
		
		else 
			error_node.eq(0).append( '<br />' + message );
		
		node.bind( 'change', function() {
			var obj = Js.$( this );
			if ( obj.val() !== '' ) {
				that._removeError( obj );
				that.first = null;
			}
		});
	},
	
	_validate: function( field ) {
		var that = this;
		var lang = this.language;
		var node = Js.$( field );
		var value = node.val();
		
		if ( node.attr('name') != '' ) {
			// remove previously loaded error message
			that._removeError( node );
			
			// turn the className into array so we can do some testing
			var klasses = ( !!node.attr('class') ? node.attr('class') : '' );
			var klass = klasses.split(/\s/);
			var error = '';
			
			// if the element is required
			if ( !!Js.helper.inArray( 'required', klass ) && Js.helper.trim( value ) == '' ) {
				error = lang.required;
			}
			
			// this set of validate only triggered when this.value isn't empty
			if ( Js.helper.trim( value ) != '' ) {
				
				if ( !!Js.helper.inArray( 'string', klass ) && !Js.test.isString( value ) ) 
					error = lang.string;
				else if ( !!Js.helper.inArrayGrep( /^(integer|number)$/, klass ) && !Js.test.isNumber( value ) ) 
					error = lang.number;
				else if ( !!Js.helper.inArray( 'email', klass ) && !Js.test.isEmail( value ) ) 
					error = lang.email;
				
				var indexof_length = Js.helper.indexOfGrep( /^(max|min|exact)\-(\d*)$/i, klass );
					
				if ( indexof_length > -1 ) {
					var types = RegExp.$1;
					var values = RegExp.$2;
					
					if ( !Js.test.isLength( klass[indexof_length], value.length ) ) {
						switch ( types ) {
							case 'min' :
								types = lang.min;
								break;
							case 'max' :
								types = lang.max;
								break;
							case 'exact' :
								types = lang.exact;
								break;
						}
						
						var note = lang.length;
						note = note.replace( /{type}/, types );
						note = note.replace( /{value}/, values );
						
						this._error( node, note );
					}
				}
			}
			
			var indexof_custom = Js.helper.indexOfGrep( /^(custom)\-(\w*)$/g, klass );
			
			if ( indexof_custom > -1 ) {
				var custom_keyword = Js.helper.camelize( klass[indexof_custom] );
				var validate = this.setting[custom_keyword];
				
				if ( Js.helper.isset( validate ) ) {
					var required = Js.helper.pickType( validate.required, false, 'boolean' );
					
					if ( required === true && Js.helper.trim( value ) === '' ) 
						error = Js.helper.pickType( validate.error, error, 'string' );
					
					if ( Js.helper.trim( value ) !== '' ) {
						if ( Js.helper.isfunction( validate.callback ) && !validate.callback( value ) ) 
							error = Js.helper.pickType( validate.error, error, 'string' );
						
						else if ( validate.regex && !value.match( validate.regex ) ) 
							error = Js.helper.pickType( validate.error, error, 'string' );
					}
				}
			}
			
			Js.debug.log( error );
			
			if ( error != '' ) 
				that._error( node, error );
			
			this.data += this._data( node );
		}
	}
});
/* Create Active Hyperlink for Savvy.UI
 * version: 0.1.2
 */

Js.util.activeContent = Js.create({
	appName: 'activeContent',
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	beforeStart: null,
	success: null,
	
	initiate: function( obj ) {
		var that = this,
			obj = Js.helper.pickType( obj, {}, 'object' );
		
		this.element = Js.helper.pick( obj.element, null );
		this.beforeStart = Js.helper.pick( obj.beforeStart, this.beforeStart );
		this.success = Js.helper.pick( obj.success, this.success );
		
		if ( Js.helper.isset( this.element ) ) {
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
		if( Js.helper.isset( this.interval ) ) {
			clearInterval( this.interval );
			this.interval == null;
		}
		
		this.element = null;
		return null;
	},
	
	_selector: function() {
		var that = this;
		
		Js.$( this.element ).bind( 'click', function() {
			var href = Js.$( this ).attr( 'href' );
			var hash = ( Js.helper.isset( href ) ? href : this.href );
			var result;
			
			result = ( hash.match(/^\#/) ? ['', hash.substr( 1 )] : hash.split(/\#/) ); 
			
			if ( Js.helper.isfunction( that.beforeStart ) ) 
				that.beforeStart();
			
			if ( Js.helper.isset(result[1]) ) {
				that.repeat = ( result[1] === that.last );
				
				that.last = result[1];
				that.init( result[1].split(/\//) );
				
				if ( Js.helper.isfunction( that.success ) ) 
					that.success();
			}
			
			return false;
		});
	},
	
	_check: function() {
		if ( location.hash != this.last && location.hash !== '#' ) {
			this.last = location.hash;
			
			if ( Js.helper.isfunction( this.beforeStart ) ) 
				this.beforeStart();
			
			this.init( location.hash.substr( 1 ).split( /\// ) );
			
			if ( Js.helper.isfunction( this.success ) ) 
				this.success();
		}
	}
});

/* Allow a customizable form submission via button complete with XHR Request
 * version: 0.0.2
 */

Js.util.buttonSubmit = Js.create({
	appName: 'buttonSubmit',
	id: null,
	url: null,
	button: null,
	setting: null,
	handler: 'click',
	formValidate: null,
	
	initiate: function( obj ) {
		this.id = Js.helper.pick( obj.id, null );
		this.url = Js.helper.pick( obj.url, null );
		this.button = Js.helper.pick( obj.button, null );
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( obj.option );
		
		return this;
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	_prepare: function() {
		this.formValidate = Js.nue( this.setting );
		this.formValidate.success = this.setting.formSuccess;
		this.formValidate.onError = this.setting.formError;
	},
	
	init: function( obj ) {
		var that = this;
		
		this.setup( obj );
		this.setting = Js.append( this.setting, Js.config.util[this.appName] );
		this._prepare();
		
		var method = Js.helper.pickGrep( this.setting.method, /^(get|post)$/i );
		
		// bind onClick event delegation to the button
		Js.$( this.button ).bind( this.handler, function() {
			// we need to validate the form
			var form = new Js.ext.validate( that.id, that.formValidate );
			var result = form.result;
			
			if ( !!result ) {
			   Js.$.ajax({
					type: method,
					url: that.url,
					data: result,
					beforeSend: function() {
						if ( Js.helper.isfunction( that.setting.beforeSend ) ) 
							that.setting.beforeSend.apply( that );
					},
					success: function( reply ) {
						var run_default = true;
						
						if ( Js.helper.isfunction( that.setting.sendSuccess ) ) 
							run_default = that.setting.sendSuccess.apply( that, [reply] );
						
						if ( run_default !== false ) 
							Js.parse.xhr.init( reply );
					},
					onError: function() {
						if( Js.helper.isfunction( that.setting.onSendError ) ) 
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
				var doc = document.body;
				var result = 0;
				var offset = window.pageXOffset;
				var element = document.documentElement;
				
				if ( typeof( offset ) == 'number' ) 
					result = offset;
				
				else if ( doc && doc.scrollLeft ) 
					result = doc.scrollLeft;
				
				else if ( element && element.scrollLeft ) 
					result = element.scrollLeft;
				
				return result;
			},
			
			y: function() {
				var doc = document.body;
				var result = 0;
				var offset = window.pageYOffset;
				var element = document.documentElement;
				
				if ( typeof( offset ) == 'number' ) 
					result = offset;
				
				else if ( doc && doc.scrollTop ) 
					result = doc.scrollTop;
				
				else if ( element && element.scrollTop ) 
					result = element.scrollTop;
				
				return result;
			},
			
			both: function() {
				var that = Js.util.dimension.page.scrolls;
				return [
					that.x(), 
					that.y()
				];
			}
		},
		
		middle: function( weight, height ) {
			var doc = document.body,
				offset = [ Js.$( window ).width(), Js.$( window ).height() ],
				locate = Js.util.dimension.page.scrolls.both();
			
			var result = [
				Math.round( ( ( offset[0] - weight ) / 2 ) + locate[0] ),
				Math.round( ( ( offset[1] - height ) / 2 ) + locate[1] )
			];
			
			result[0] = ( result[0] < 0 ? 0 : result[0] );
			result[1] = ( result[1] < 0 ? 0 : result[1] );
				
			return result.reverse();
		}
	},
	
	node: {
		scrolls: {},
		size: {},
		
		offset: function( node ) {
			var result = [0, 0, 0, 0];
			var loop = false;
			
			if ( Jrun.isset( node ) ) {
				if ( node.offsetParent ) {
					loop = true;
					result[0] = node.offsetWidth;
					result[1] = node.offsetHeight;
					
					while ( node.offsetParent ) {
						result[2] += node.offsetTop;
						result[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				}
				else {
					if ( loop == false ) {
						result[0] = Js.helper.pick( node.scrollWidth, 0 );
						result[1] = Js.helper.pick( node.scrollHeight, 0 );
						result[2] = Js.helper.pick( node.offsetTop, 0 );
						result[3] = Js.helper.pick( node.offsetLeft, 0 );
					}
				}
				
				return result;
			}
			else 
				Js.debug.log('Js.util.dimension.node.offset: failed because node does not exist');
		}
	}
};
/* Allow a customizable form submission via submit button complete with XHR Request
 * version: 0.0.2
 */

Js.util.formSubmit = Js.util.buttonSubmit.extend({
	appName: 'formSubmit',
	handler: 'submit',
	
	initiate: function( obj ) {
		if ( Js.helper.parameter( arguments, 1, ['object'] ) ) {
			this.id = Js.helper.pick( obj.id, null );
			this.url = Js.helper.pick( obj.url, null );	
		} 
		else if ( Js.helper.parameter( arguments, 2, [true, "string"] ) ) {
			this.id = Js.helper.pick( arguments[0], null );
			this.url = Js.helper.pick( arguments[1], null );
		}
		
		this.button = this.id;
		
		// if id, url and button have been defined, straight away call this.init()
		if ( !!this.id && !!this.url && this.button ) 
			this.init( obj.option );
		
		return this;
	}
});

/* Checkbox Ticker for Savvy.UI
 * version: 0.1.2
 */

Js.util.ticker = Js.create({
	element: null,
	node: null,
	
	initiate: function( element ) {
		return ( Js.helper.isset( element ) ? this.init( element ) : this );
	},
	
	init: function( element ) {
		this.element = Js.helper.pick( element, null );
		
		if ( Js.helper.isset( this.element ) ) 
			this.node = Js.$( this.element );
		
		return this;
	},
	
	tick: function() {
		// set checked to true
		this.node.each( function() {
			this.checked = true;
		} );
	},
	
	untick: function() {
		// set checked to false
		this.node.each( function() { 
			this.checked = false;
		} );
	},
	
	invert: function() {
		// reverse checkbox selection
		this.node.each( function() {
			this.checked = !this.checked;
		} );
	}
});
/* Editable Dropdown for Savvy.UI
 * version: 0.0.3
 */

Js.util.editable = Js.create({
	appName: 'editable',
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
		return ( !!Js.helper.isset( element ) ? this.init( element, option ) : this );
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting, ['lang'], true );
		
		if ( Js.helper.isset( option.lang ) ) 
			this.language = Js.append( option.lang, this.language );
		
		return this;
	},
	
	init: function( element, option ) {
		var that = this;
		
		this.element = Js.helper.pick( this.element, element );
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.util.editable );
		this.language = Js.append( this.language, Js.language.util.editable );
		this.node = Js.$( this.element );
		
		this.node.bind( 'change', function() {
			var node = Js.$( this );
			
			if ( node.val() == that.setting.identifier ) 
				that.getModalBox( this );
		});
		
		this.node.each( function() {
			if ( Js.$(this).val() == that.setting.identifier ) 
				this.options[0].selected = true;
		} );
		
		return this;
	},
	onModalBoxClose: function( field ) {
		var result = [];
		
		Js.$( field ).children( 'option' ).each(function( index, value ) {
			result.push( Js.$( value ).val() );
		});
		
		this.cacheData = result;
		var updated = false;
		var run_default = true;
		var val = this.input.val();
		this.value = val;
		
		if ( Js.helper.isfunction( this.setting.onBeforeUpdate ) ) 
			run_default = this.setting.onBeforeUpdate.apply( this, [field] );
		
		if ( run_default !== false && ( Js.helper.isset( val ) && Js.helper.trim( val ) != '' && !Js.helper.inArray( val, result ) ) ) {
			Js.$( '<option selected="selected" value="' + val + '">' + val + '</option>' ).appendTo( field );
			updated = true;
		} 
		else 
			field.options[0].selected = true;
		
		if ( Js.helper.isfunction( this.setting.onUpdate ) ) 
			this.setting.onUpdate.apply( this, [field, updated] );
	},
	getModalBox: function( field ) {
		var that = this;
		
		if ( Js.helper.isfunction( this.setting.beforeStart ) ) 
			this.setting.beforeStart.apply( this );
		
		this.box = new Js.widget.dialog({
			element: 'editable_edit_box_' + Js.helper.prep( this.element ),
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
					type: 'submit'
				}
			],
			language: {
				closeText: 'Cancel'
			},
			overlay: this.setting.overlay,
			clickOver: true,
			onClickOver: function() {
				that.input.val('');
			}
		});
		
		var div = Js.$( '<div/>' )
			.setClass( 'panel' )
			.appendTo( this.box.content[0] );
		
		var p = Js.$( '<label/>' )
			.htmlText( '' + this.language.message )
			.appendTo( div[0] );
			
		this.input = Js.$( '<input type="text"/>')
			.attr( 'name', 'util_editable_' + Js.helper.prep( this.element ) )
			.val( this.setting.prefix )
			.appendTo( div[0] );
		
		var box = this.box;
		
		box.closeButton.htmlText('Cancel').bind( 'click', function() {
			that.input.val('');
			box.closePanel();
		})
	}
});

/* Includer for Savvy.UI
 * version: 0.0.5
 */

Js.util.includer = { 
	script: function( uri ) {
		return Js.$( '<script/>' ).attr({
			'type': 'text/javascript',
			'src': uri
		}).appendTo( 'head' );
	},
	
	style: function( uri, media ) {
		var media = Js.helper.pickGrep( media, "all", /^(all|print|screen|handheld)$/i );
		
		return Js.$( "<link/>" ).attr({
			'type': 'text/css',
			'href': uri,
			'media': media
		}).appendTo( 'head' );
	}
};
/* Smart Input Field for Savvy.UI
 * version: 0.0.2
 */

Js.util.smartInput = Js.create({
	node: null,
	element: null,
	
	initiate: function( element ) {
		var that = this;
			
		this.element = null;
		this.node = null;
		
		if ( Js.helper.isset( element ) ) 
			this.init( element );
		
		return this;
	},
	
	init: function( element ) {
		var that = this;
		this.element = Js.helper.pick( element, this.element );
		this.node = Js.$( this.element );
		
		this.activate();
		
		return this;
	},
	
	activate: function() {	
		this.node
			.bind( 'blur', function() {
				var node = Js.$( this );
				
				if ( Js.helper.trim( node.val() ) === '' ) 
					node.val( node.attr( 'title' ).toString() );
				
			})
			.bind( 'focus', function() {
				var node = Js.$( this );
				
				if ( node.attr( 'title' ) == node.val() ) 
					node.val('');
			})
			.val( this.node.attr( 'title' ).toString() );
	},
	
	deactivate: function() {
		this.node
			.unbind( 'blur', function() {
				var node = Js.$( this );
				
				if ( Js.helper.trim( node.val() ) === '' ) 
					node.val( node.attr( 'title' ).toString() );
				
			}).unbind( 'focus', function() {
				var node = Js.$( this );
				
				if ( node.attr( 'title' ) == node.val() ) 
					node.val('');
				
			});
	}
});
/* Activity Overlay for Savvy.UI
 * version: 0.0.2
 */

Js.widget.activity = Js.create({
	appName: 'activity',
	node: null,
	element: null,
	box: null,
	setting: null,
	language: null,
	count: 0,
	
	initiate: function( element, option ) {
		return ( Js.helper.isset( element ) ? this.init( element, option ) : this );
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) ) {
			this.setting = Js.append( option, this.setting, ['lang'], true);
			
			if ( Js.helper.isset( option.lang ) ) 
				this.language = Js.append( option.lang, this.language );
		}
		
		return this;
	},
	
	init: function( element, option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.config.widget[this.appName] );
		
		this.element = Js.helper.pick( element, this.element );
		this.node = Js.$( this.element );
		
		if ( this.node.size() == 0 ) {
			try {
				this.node = Js.$('<div/>')
					.attr( 'id', Js.helper.prep( this.element ) )
					.appendTo('body');
			}
			catch(e) {
				Js.debug.error( 'Js.widget.activity: fail to create elementById ' + this.element );
			}
		}
		
		var css = {
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: 'none'
		};
		
		this.node
			.css( css )
			.setClass( Js.helper.prep( this.setting.identifier)  )
			.css( 'opacity', 0.01 );
		
		return this;
	},
	
	activate: function( callback ) {
		var option = this.setting;
		
		if ( this.count == 0 ) {
			this.node.css( 'display', 'block' ).fadeTo( 'normal', option.opacity );
			
			var middle = Js.util.dimension.page.middle( option.boxWidth, option.boxHeight );
			
			if ( Js.helper.isset( this.box ) ) {
				this.box.css({
					top: middle[0] + 'px',
					left: middle[1] + 'px'
				});
			}
		}
		
		this.count++;
		
		if ( Js.helper.isfunction( callback ) ) 
			callback();
	},
	
	loadImage: function() {
		var option = this.setting;
		var css = {
			position: 'absolute',
			width: option.boxWidth + 'px',
			height: option.boxHeight + 'px',
			zIndex: (option.zIndex + 1)
		};
		
		this.box = Js.$( '<img/>' )
			.attr( 'src', option.imagePath )
			.css( css )
			.appendTo( this.node[0] );
		
		return this;
	},
	
	deactivate: function( callback ) {
		if ( this.count > 0 ) {
			this.node.fadeTo( 'normal', 0, 
				function() {
					Js.$( this ).css(	'display', 'none' );
					if ( Js.helper.isfunction( callback ) ) 
						callback();
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
	appName: 'datePicker',
	field: null,
	value: '',
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
	
	initiate: function( obj ) {
		return ( Js.helper.typeOf( obj ) === 'object' ? this.init( obj ) : this );
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting, ['lang'], true );
		
		if ( Js.helper.isset( option.lang ) ) 
			this.language = Js.append( option.lang, this.language );
	},
	
	init: function( obj ) {
		var that = this;
		
		this.setup( obj.option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.element = Js.helper.prep( Js.helper.pick( obj.element, this.element ) );
		this.renderTo = Js.helper.pick( obj.renderTo, this.renderTo );
		
		if ( !this.renderTo || ( typeof( this.renderTo ) !== 'string' && !this.renderTo.nodeType ) ) {
			this.renderTo = Js.$('<div/>').appendTo('body');
		}
		else if ( typeof( this.renderTo ) === 'string' || this.renderTo.nodeType ) {
			this.renderTo = Js.$( this.renderTo ).eq(0) ;
		}
		
		obj.range = Js.helper.pickType( obj.range, this.range, [null, null], 'array' );
		this.field = Js.helper.pickType( obj.field, this.field, 'calendar-value', 'string' );
		this.type = Js.helper.pickGrep( obj.type, this.type, 'single', /^(single|multiple)$/g );
		
		// check if minimum date have been set
		if ( !!obj.minDate && this.setting.dateFormat.test( obj.minDate ) ) 
			this.minDate = Js.helper.pick( obj.minDate, null );
		
		// check if maximum date have been set
		if ( !!obj.maxDate && this.setting.dateFormat.test( obj.maxDate ) ) 
			this.maxDate = Js.helper.pick( obj.maxDate, null );
		
		if ( !!obj.value && obj.value.match( this.setting.dateFormat ) ) {
			obj.year = RegExp.$1;
			obj.month = RegExp.$2;
			obj.day = RegExp.$3;
			
			this.value = obj.value;
		} 
		else if ( !!obj.value && obj.value === 'today' ) {
			// get today date
			var tmp_date = new Date();
			obj.month = tmp_date.getMonth();
			obj.year = tmp_date.getFullYear();
			obj.day = tmp_date.getDate();
			
			this.value = [obj.year, obj.month, obj.day].join('-');
		}
		
		this.month = ( ( !obj.month || isNaN( obj.month) || obj.month > 12 || obj.month < 0 ) ? this.dateObject.getMonth() : Math.abs( obj.month - 1 ) );
		this.year = ( ( !obj.year || isNaN( obj.year) || obj.year < 1000) ? this.dateObject.getFullYear() : obj.year );
		this.day = Js.helper.pick( obj.day, this.day );
		
		this.date = [this.year, ( this.month + 1 ), Js.helper.pick( this.day, 1 )].join('-');
		this.navigation = Js.helper.pick( obj.navigate, true );
		
		var get_range = function( data ) {
			var result = null;
			var year = that.dateObject.getFullYear();
			
			if ( !data || data.toLowerCase() == 'now' ) 
				result = year; 
			else if ( data.match(/^(\+|\-)?(\d{1,4})$/) ) {
				var plus = RegExp.$1;
				var value = RegExp.$2;
				
				if ( plus == '+' ) 
					result = ( year + Js.helper.toNumber( value ) );
				else if ( plus == '-' ) 
					result = ( year - Js.helper.toNumber( value ) );
				else 
					result = value;
			}
			
			return result;
		};
		
		if ( this.navigation == true ) {
			obj.range[0] = get_range( obj.range[0] );
			obj.range[1] = get_range( obj.range[1] );
			
			if ( obj.range[0] < obj.range[1] ) {
				var result = obj.range[0];
				obj.range[0] = obj.range[1];
				obj.range[1] = result;
				delete result;
			}
			
			this.range = [this.maxYear( obj.range[0] ), this.minYear( obj.range[1] )];
		}
		
		if ( Js.helper.isfunction( this.setting.beforeStart ) ) 
			this.setting.beforeStart.apply( this );
		
		this.renderTo.text('');
		this.status = 'load';
		
		this.box = new Js.widget.dialog({
			element: [this.element, 'calendar'].join('-'),
			renderTo: this.renderTo[0],
			title: '',
			width: 350,
			language: {
				closeText: 'Cancel'
			},
			overlay: true
		});
		
		var content = Js.$( '<div/>' ).appendTo( this.box.content[0] );
		
		this.option = Js.$( '<div/>' ).addClass( 'calendar-option' ).appendTo( content[0] );
		this.content = Js.$( '<div/>' ).addClass( 'calendar-content' ).appendTo( content[0] );
		
		this.callback();
		
		return this;
	},
	
	minYear: function( year ) {
		var result = year;
		
		if ( this.minDate ) {
			var min_date = this.minDate.split('-');
			var new_year = Js.helper.toNumber( min_date[0] );
			
			if ( new_year > result ) 
				result = new_year;
		}
		
		return result;
	},
	
	maxYear: function( year ) {
		var result = year;
		
		if ( this.maxDate ) {
			var max_date = this.maxDate.split('-');
			var new_year = Js.helper.toNumber( max_date[0] );
			
			if ( new_year < result ) 
				result = new_year;
		}
		
		return result;
	},
	
	prevMonth: function() {
		this.day = null;
		this.dateObject = new Date( this.year, (this.month - 1) );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() )
			this.callback();
			
		else {
			this.dateObject = new Date( this.year, (this.month + 1) );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	prevYear: function() {
		this.day = null;
		this.dateObject = new Date( (this.year - 1), this.month );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() )
			this.callback();
		else {
			this.dateObject = new Date( (this.year + 1), this.month );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	nextMonth: function() {
		this.day = null;
		this.dateObject = new Date( this.year, (this.month + 1) );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() )
			this.callback();
		else {
			this.dateObject = new Date( this.year, (this.month - 1) );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	nextYear: function() {
		this.day = null;
		this.dateObject = new Date( (this.year + 1), this.month );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() ) 
			this.callback();
		else {
			this.dateObject = new Date( (this.year - 1), this.month );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	customMonth: function( data ) {
		this.day = null;
		this.dateObject = new Date( this.year, data );
		var result = [
			this.dateObject.getMonth(),
			this.dateObject.getFullYear()
		];
		this.date = [result[1], (result[0] + 1), this.dayOfMonth( result[0], result[1] )].join('-');
		
		if ( this.validation() ) {
			this.year = result[1];
			this.month = result[0];
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, this.month );
			this.date = [this.year, (this.month + 1), '1'].join('-');
			this.callback();
		}
		
		return this;
	},
	
	customYear: function( data ) {
		this.day = null;
		this.dateObject = new Date( data, this.month );
		var result = [
			this.dateObject.getMonth(),
			this.dateObject.getFullYear()
		];
		this.date = [result[1], (result[0] + 1), this.dayOfMonth( result[0], result[1] )].join('-');
		
		if ( this.validation() ) {
			this.year = result[1];
			this.month = result[0];
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, this.month );
			this.date = [this.year, (this.month + 1), '1'].join('-');
			this.callback();
		}
		
		return this;
	},
	
	today: function() {
		this.dateObject = new Date();
		this.year = this.dateObject.getFullYear();
		this.month = this.dateObject.getMonth();
		this.day = this.dateObject.getDate();
		this.date = [this.year, (this.month + 1), this.day].join('-');
		
		this.callback();
	},
	
	validation: function() {
		var result = false;
		var min_date = Js.helper.isset( this.minDate );
		var max_date = Js.helper.isset( this.maxDate );
		
		if ( min_date && max_date && this.compare( min_date, this.date ) && this.compare( this.date, max_date ) ) 
			result = true;
		else if ( min_date && this.compare( min_date, this.date ) ) 
			result = true;
		else if ( max_date && this.compare( this.date, max_date ) ) 
			result = true;
		else if ( !min_date && !max_date ) 
			result = true;
		
		return result;
	},
	
	dayOfMonth: function( month, year ) {
		var month = Js.helper.pick( month, this.month );
		var year = Js.helper.pick( year, this.year );
		
		if ( month == 1 && ( year % 4 == 0 && year % 100 != 0 ) || year % 400 == 0 ) 
			var month_length = 29;
		
		return Js.helper.pickType( month_length, this.setting.daysInMonth[month], 'number' );
	},
	
	compare: function( first, second ) {
		var firsts = first.split('-');
		var seconds = second.split('-');
		
		var first_date = new Date( firsts[0], (Js.helper.toNumber(firsts[1]) - 1) );
		first_date.setDate( firsts[2] );
		
		var second_date = new Date( seconds[0], (Js.helper.toNumber(seconds[1]) - 1) );
		second_date.setDate( seconds[2] );
		
		return second_date >= first_date;
	},
	
	updateValue: function( year, month, day ) {
		var field = Js.$( '#' + this.element + '_' + year + month + day ).eq(0);
		var calendar = Js.$( '#' + this.element + '-' + this.field ).eq(0);
		
		var months = ( month < 10 ? '0' + month : month );
		var days = ( day < 10 ? '0' + day : day );
		
		if( this.type == 'single' ) {
			if ( !field.hasClass('calendar-day-selected') ) {
				if ( Js.helper.isset( this.lastDate ) && Js.$( '#' + this.element + '_' + this.lastDate ).size() > 0 ) 
					var lastdate = Js.$( '#' + this.element + '_' + this.lastDate ).setClass( 'calendar-day' );
				
				field.setClass( 'calendar-day-selected' );
				this.value = [year, months, days].join('-');
				
				calendar.val( this.value );
				this.lastDate = [year, month, day].join('');
			}
			else {
				field.setClass( 'calendar-day' );
				calendar.val('');
			}
		} 
		else if ( this.type == 'multiple' ) {
			var value = calendar.val();
			var values = value.split('|');
			
			if ( Js.helper.inArray([year, months, days].join('-'), values) ) {
				values.splice( values.indexOf([year, months, days].join('-')), 1 );
				value = values.join('|');
				
				field.setClass( 'calendar-day' );
				this.value = value;
				calendar.val( this.value );
			}
			else {
				field.setClass( 'calendar-day-selected' );
				values[values.length] = [year, months, days].join('-');
				this.value = values.join('|');
				calendar.val( this.value );
			}
		}
		
		if ( Js.helper.isfunction( this.setting.onUpdate ) ) 
			this.setting.onUpdate.apply(this);
		
		return this;
	},
	
	callback: function() {
		var that = this;
		
		this.content.html('');
		this.option.html('');
		
		this.box.title( this.language.months[this.month] + ' ' + this.year );
		var first_day = new Date( this.year, this.month, 1 );
		var start_day = first_day.getDay();
		var html = '';
		var monthLength = this.dayOfMonth();
		
		var table = Js.$( '<table cellpadding="0" cellspacing="0"></table>' )
			.addClass( 'calendar-body' )
			.appendTo( this.content[0] );
		
		var tbody = Js.$( '<tbody/>' ).appendTo( table[0] );
		
		var trheader = Js.$( '<tr/>' ).addClass( 'calendar-header' ).appendTo( tbody[0] );
		
		for ( var i = 0; i <= 6; i++ ) 
			Js.$( '<td/>' )
				.addClass( 'calendar-header-day' )
				.text( this.language.days[i] )
				.appendTo( trheader[0] );
		
		var day = 1;
		
		for ( var i = 0; i < 6; i++ ) {
			var weeks = Js.$( '<tr/>' ).addClass( 'calendar-week' ).appendTo( tbody[0] );
			
			for ( var j = 0; j <= 6; j++ ) {
				this.date = [this.year, (this.month + 1), day].join('-');
				var days = Js.$( '<td/>' )
					.addClass( 'calendar-' + (this.validation() ? 'day' : 'invalid') )
					.appendTo( weeks[0] );
				
				if ( day <= monthLength && ( i > 0 || j >= start_day ) ) {
					days.attr( 'id', this.element + '_' + this.year + (this.month + 1) + day );
					var tday;
					
					if ( this.validation() ) {
						days.bind( 'click', function(){
							var i = Js.$( this ).attr( 'id' ).split('_');
							var count = ( i.length - 1 );
							var ym = that.year + '' + that.month;
							tday = i[count].substr( (ym.length), i[count].length );
							that.updateValue( that.year, (that.month + 1), Js.helper.toNumber(tday) );
						});
					}
					
					if ( day == this.day ) {
						days.setClass( 'calendar-day-selected' );
						this.lastdate = this.year + '' + (this.month + 1) + '' + Js.helper.toNumber(this.day);
					}
					
					days.css( 'cursor', 'pointer' );
					
					days.text( day.toString() );
					day++;
				}
				else 
					days.htmlText('&nbsp;').setClass('calendar-invalid');
			}
			
			if (day > monthLength) 
				break;
		}
		
		if ( this.setting.navigation == true ) {
			Js.$( '<a/>' )
				.setClass( 'prev-month' )
				.text( this.language.prevMonth )
				.attr( 'href', '#' )
				.click( function () {
					that.prevMonth();
					return false;
				})
				.appendTo( this.content[0] );
			
			Js.$( '<a/>' )
				.setClass( 'next-month' )
				.text( this.language.nextMonth )
				.attr( 'href', '#' )
				.click( function () {
					that.nextMonth();
					return false;
				})
				.appendTo( this.content[0] );
			
			//Js.$( '<p/>' ).text( this.language.selectMonthYear ).appendTo( this.option[0] );
			
			var selmonth = Js.$( '<select name="month"></select>' ).bind( 'change', function() {
				that.customMonth( this.value );
			}).appendTo( this.option[0] );
			
			for ( var i = 0; i < 12; i++ ) {
				if ( this.month == i ) 
					Js.$( '<option value="' + i + '" selected="selected"></option>' )
						.text( this.language.months[i] )
						.appendTo( selmonth[0] );
				else 
					Js.$( '<option value="' + i + '"></option>' )
						.text( this.language.months[i] )
						.appendTo( selmonth[0] );
			}
			var selyear = Js.$( '<select name="year"></select>' ).text( ' ' ).bind( 'change', function() {
				that.customYear( this.value );
			}).appendTo( this.option[0] );
			
			for ( var i = this.range[0]; i >= this.range[1]; i-- ) {
				if ( this.year == i ) 
					Js.$( '<option value="' + i + '" selected="selected"></option>' )
						.text( i.toString() )
						.appendTo( selyear[0] );
				else 
					Js.$( '<option value="' + i + '"></option>' )
					.text( i.toString() )
					.appendTo( selyear[0] );
			}
			
			
			if ( this.status == 'initiated' ) 
				this.box.buttons.html('');
			
			this.box.addButton({
				type: 'submit',
				text: this.language.todayButton,
				callback: function(){
					that.today();
				}
			});
		}
		
		this.box.fixDimension();
		this.status = 'initiated';
		
		if ( Js.helper.isset(this.field) ) {
			var input = Js.$( '<input id="' + [this.element, this.field].join('-') + '" name="' + this.field + '" type="' + this.setting.fieldType + '" />' ).appendTo( this.content[0] );
			
			if ( Js.helper.isset(this.day) ) {
				var m = ( this.month + 1 );
				this.value = [this.year, (m < 10 ? '0' + m : m), this.day].join('-');
				input.val( this.value );
				this.lastDate = [this.year, (this.month + 1), Js.helper.toNumber(this.day)].join('');
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
	
	initiate: function( element, option ) {
		var that = this,
			prepare = function( element, option ) {
				that.element = element;
				that.init( option );
			};
		
		if ( Js.helper.isset( element ) ) 
			prepare( element, option );
			
		return this;
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) ) 
			this.setting = Js.append( option, this.setting );
			
		return this;
	},
	
	init: function( element, option ) {
		var that = this;
		
		this.element = Js.helper.pick( element, this.element );
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget.dropmenu );
		this.node = Js.$( this.element );
		
		if ( this.node.size() > 0 ) {
			
			Js.$( 'ul, li', this.node[0] ).hover( function() {
				that._show( this );
			}, function() {
				that._hide( this );
			});
			
			Js.$( 'li', this.node[0] ).hover( function() { 
				Js.$( this ).addClass( 'hover' ); 
				Js.$( '> a', this ).addClass( 'hover' ); 
			}, function() { 
				Js.$( this ).removeClass( 'hover' );
				Js.$( '> a', this ).removeClass( 'hover' ); 
			});
		}
		else 
			Js.debug.error( 'Js.widget.dropdown: No elements found' );
		
		return this;
	},
	
	_show: function( element ) {
		var child = this._getChild( element ),
			option = this.setting;
		
		if ( !child ) 
			return false;
		
		Js.$( child )
			.data( 'cancelHide', true )
			.css( 'zIndex', option.zIndex++ )
			.fadeIn( option.speed )
			.slideDown( option.speed );
		
		if ( element.nodeName.toLowerCase() == 'ul' ) {
			var li = this._getPosition( element );
			Js.$( li ).addClass( 'hover' );
			Js.$( '> a', li ).addClass( 'hover' );
		}
	},
	
	_hide: function( element ) {
		var that = this,
			child = this._getChild( element );
		
		if ( !child )
			return false;
			
		var node = Js.$( child )
			.data( 'cancelHide', false );
		
		setTimeout( function() {
			if( !node.data( 'cancelHide' ) ) 
				node.slideUp( that.setting.speed );
		}, 200);
	},
	
	_getChild: function( element ) {
		if ( element.nodeName.toLowerCase() == 'li' ) {
			var child = Js.$( '> ul', element );
			return child.size() > 0 ? child[0] : null ;
		}
		else 
			return element;
	},
	
	_getPosition: function( element ) {
		return ( element.nodeName.toLowerCase() == 'ul' ? Js.$( element ).parents( 'li' )[0] : element );
	}
});

/* Iconizer widget for Savvy.UI
 * version: 0.0.3
 */

Js.widget.iconizer = Js.create({
	appName: 'iconizer',
	setting: null,
	
	initiate: function( option ) {
		return ( Js.helper.isset( option ) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) )
			this.setting = Js.append( option, this.setting );
		
		return this;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		
		var option = this.setting;
		
		Js.$( '*[class*=icon]' ).each(function( index, element ) {
			var node = Js.$( element );
			
			var klasses = node.attr('className');
			var klass = klasses.split(/ /);
			
			for ( var i = 0; i < klass.length; i++ ) {
				if ( klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g) ) {
					var append = RegExp.$1 == '-append';
					var icon = RegExp.$3;
					var position = Js.helper.pickGrep( RegExp.$2, 'left', /^(left|right)$/i );
					var background = [
						option.folder,
						icon,
						'.',
						option.fileType
					].join('');
					
					if ( !!append ) {
						var obj = Js.$( '<span/>' ).css({
							'display': 'block',
							'cssFloat': position,
							'width': '16px',
							'height': '16px'
						}).prependTo( node[0] );
						
						if ( position == 'left' ) {
							obj.css({
								'background': 'url("' + background + '") no-repeat left',
								'marginRight': '3px'
							});
						}
						else {
							obj.css({
								'background': 'url("' + background + '") no-repeat right',
								'marginLeft': '3px'
							});
						}
					}
					else {
						var obj = node;
						
						if ( position == 'left' ) {
							obj.css({
								'background': 'url("' + background + '") no-repeat left center',
								'paddingLeft': '17px'
							});
						}
						else {
							obj.css({
								'background': 'url("' + bg + '") no-repeat right center',
								'paddingRight': '17px'
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
	appName: 'panel',
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
	status: 'normal',
	
	initiate: function( option ) {
		return ( Js.helper.isset( option ) ? this.init( option ) : this );
	},
	
	setup: function( option ) {
		if ( Js.helper.typeOf( option, 'object' ) ) {
			this.setting = Js.append( option, this.setting, ['lang'], true );
			
			if ( Js.helper.isset( option.lang ) ) 
				this.language = Js.append( option.lang, this.language );
		}
		
		return this;
	},
	
	_prepare: function() {
		this.renderTo = Js.helper.pick( this.setting.renderTo, 'body:eq(0)' );
		this.element = this.setting.element;
	},
	
	init: function( option ) {
		var that = this;

		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepare();
		
		// set renderTo element
		if ( typeof( this.renderTo ) === 'string' || this.renderTo.nodeType ) {
			this.renderTo = Js.$( this.renderTo );
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.$( 'body:eq(0)' );
		}
			
		this._addBorder();
		this._addContent();
		
		if ( Js.helper.isset( this.setting.button ) ) {
			var button_length = this.setting.button.length;
			
			for ( var i = 0; i < button_length; i++ ) 
				this.addButton( this.setting.button[i] );
		}
		
		return this;
	},
	
	_addBorder: function() {
		var that = this;
		
		var table = Js.$( '<table/>' )
			.attr( 'id', this.element + '_panel' )
			.setClass( 'widget-panel' )
			.appendTo( this.renderTo[0] );
		
		var tr = [];
		tr[0] = Js.$( '<tr/>' ).appendTo( table[0] );
		tr[1] = Js.$( '<tr/>' ).appendTo( table[0] );
		tr[2] = Js.$( '<tr/>' ).appendTo( table[0] );
		
		var dh = [];
		var dc = [];
		var df = [];
		
		dh[0] = Js.$( '<td/>' ).setClass( 'tl' ).appendTo( tr[0][0] ).css( 'opacity', 0.7 );
		dh[1] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[0][0] ).css( 'opacity', 0.7 );
		dh[2] = Js.$( '<td/>' ).setClass( 'tr' ).appendTo( tr[0][0] ).css( 'opacity', 0.7 );
		
		dc[0] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[1][0] ).css( 'opacity', 0.7 );
		dc[1] = Js.$( '<td/>' ).setClass( 'c' ).appendTo( tr[1][0] );
		dc[2] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[1][0] ).css( 'opacity', 0.7 );
		
		df[0] = Js.$( '<td/>' ).setClass( 'bl' ).appendTo( tr[2][0] ).css( 'opacity', 0.7 );
		df[1] = Js.$( '<td/>' ).setClass( 'b' ).appendTo( tr[2][0] ).css( 'opacity', 0.7 );
		df[2] = Js.$( '<td/>' ).setClass( 'br' ).appendTo( tr[2][0] ).css( 'opacity', 0.7 );
		
		
		this.node = table;
		this.main = dc[1];
	},
	_addContent: function() {
		var that = this,
			option = this.setting;
		
		// set panel width
		if ( Js.helper.isset( option.width ) ) 
			this.main.css( 'width', option.width + 'px' );
		
		// render header
		this.header = Js.$( '<h2/>' )
			.addClass( 'header' )
			.appendTo( this.main[0] );
		
		if ( !option.header ) 
			this.header.hide();
		
		// render content
		this.container = Js.$( '<div/>' )
			.addClass( 'content-container' )
			.appendTo( this.main[0] );
		
		// render footer
		this.footer = Js.$( '<div/>' )
			.addClass( 'footer' )
			.appendTo( this.main[0] );
		
		
		// set panel height
		if ( Js.helper.isset( option.height ) ) 
			this.container.css( 'height', option.height + 'px' );
		
		// render header title
		this.mainTitle = Js.$( '<span/>' )
			.addClass( 'title' )
			.text( option.title )
			.appendTo( this.header[0] );
		
		this.buttons = Js.$( '<span/>' )
			.addClass( 'button' )
			.appendTo( this.footer[0] );
		
		// render Close-Button 
		this.closeButton = Js.$( '<a/>' )
			.attr( 'href', '#' )
			.text( this.language.closeText )
			.setClass( 'buttons' )
			.appendTo( this.footer[0] );
		
		// Enable Close-Button option
		if ( !!option.closable ) 
			this.closeButton.addClass( 'close' ).click( function() { that.closePanel(); return false; });
		else 
			this.closeButton.addClass( 'button-disabled' );
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.$( '<div/>' )
			.attr( 'id', this.element )
			.setClass( 'content' )
			.appendTo( this.container[0] );
		
		try {
			this.content.html( option.content );
		} catch ( e ) {
			this.content.htmlText( option.content );
		}
		
		// set height and scrolling option for content CONTAINER
		if ( Js.helper.isset( option.height ) && !!option.scroll ) {
			this.content.css({
				'height': option.height + 'px',
				'overflow': 'auto'
			});
		}
		
		// make the panel visible
		this.node.show( 'slow' );
		
		return this;
	},
	
	closePanel: function() {
		var that = this,
			option = this.setting;
		
		// callback to close panel
		this.node.fadeOut( 'slow', function() {
			if ( Js.helper.isfunction( option.onClose ) ) 
				option.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	title: function( text ) {
		this.mainTitle.html('').text( text );
		return this;
	},
	
	addButton: function( obj ) {
		var that = this,
			callback = Js.helper.pickType( obj.callback, 'function' ),
			text = Js.helper.pickType( obj.text, this.language.defaultButton, 'string' ),
			type = Js.helper.pickGrep( obj.type, 'normal', /^(normal|submit|cancel)$/i );
		
		Js.$( '<a/>' )
			.attr( 'href', '#' )
			.click( function() {
				var run_default = false;
				
				if ( Js.helper.isfunction( callback ) ) 
					run_default = callback();
				
				if ( run_default === true ) 
					that.closePanel();
				
				return false;
			})
			.addClass( 'buttons' )
			.addClass( type )
			.text( text )
			.appendTo( this.buttons[0] );
	},
	
	_fixResize: function() {
		var option = this.setting;
		
		if ( Js.helper.isset( option.height) && !!option.scroll ) {
			this.content.css({
				'height': option.height + 'px', 
				'overflow': 'auto'
			});
		}
	}
});

/* Modal Dialog for Savvy.UI
 * version: 0.1.2
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	
	_prepare: function() {
		this.renderTo = Js.helper.pick( this.setting.renderTo, 'body:eq(0)' );
		this.element = this.setting.element;
	},
	
	init: function( option ) {
		var that = this;
		
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		this._prepare();
		
		var option = this.setting;
		
		// set renderTo element
		if ( typeof( this.renderTo ) === 'string' || this.renderTo.nodeType ) {
			this.renderTo = Js.$( this.renderTo );
		}
		else if ( !this.renderTo || !this.renderTo.nodeType ) {
			this.renderTo = Js.$('body').eq(0);
		}
		
		if ( !!option.overlay ) 
			this.overlay = new Js.widget.activity( '#overlay-panel' );
		
		
		this._addBorder();
		this._addContent();
		
		if ( Js.helper.isset( option.button ) ) {
			for ( var i = 0; i < option.button.length; i++ ) 
				this.addButton( option.button[i] );
		}
	
		
		if ( !!option.overlay ) 
			this.overlay.activate();
		
		this.fixDimension();
		
		if ( !!option.clickOver && !!option.overlay ) {
			this.overlay.node.one('click', function() {
				that.closePanel( option.onClickOver );
			});
		}
		
		return this;
	},
	
	closePanel: function( callback ) {
		var that = this,
			option = this.setting;
		
		if ( !!option.overlay ) 
			this.overlay.deactivate();
			
		if ( Js.helper.isfunction( callback ) )
			callback.apply( this );
		
		// callback to close panel
		this.node.fadeOut( 'slow', function() {
			if ( Js.helper.isfunction( that.setting.onClose ) ) 
				that.setting.onClose.apply( that );
			
			that.node.remove();
		});
		
		return this;
	},
	
	fixDimension: function() {
		var width = ( this.main.width() > Js.helper.pickType( this.setting.width, 0, 'number') ? this.main.width() : this.setting.width );
		
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
			'position': 'absolute', 
			'top': top + 'px', 
			'left': left + 'px',
			'zIndex': 6000
		});
	}
});

/* Notice/Error Message for Savvy.UI
 * version: 0.0.3
 */

Js.widget.notice = Js.widget.activity.extend({
	appName: 'notice',
	callback: null,
	node: null,
	setting: null,
	language: null,
	
	initiate: function( element, option ) {
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.node = this.$super.initiate( element, {
			boxWidth: 550,
			boxHeight: 0,
			opacity: 0.9
		});
		
		this.node.init();
		this.node.box = Js.$( '<div/>' )
			.css({
				'position': 'absolute',
				'width': '550px'
			})
			.appendTo( this.$super.node[0] );
	},
	closeNotice: function() {
		var that = this;
		
		if ( Js.helper.isfunction( this.callback ) ) {
			this.callback.apply( this );
			this.callback = null;
		}
		
		this.node.deactivate( function() {
			that.node.box.text('');
		});
	},
	show: function( obj, status ) {
		var status = Js.helper.pickGrep( status, 'note', /^(note|success|error)$/i ),
			that = this;
		
		var title = this.language[ Js.helper.camelize('title-' + status) ],
			text = '',
			sticky = false;
		
		this.node.box.text('');
		this.node.activate();
		
		if ( !Js.helper.typeOf( obj, 'object' ) ) 
			title = obj;
		else {
			title = Js.helper.pick( note.title, '' );
			text = Js.helper.pick( note.message, '' );
			sticky = Js.helper.pick( note.sticky, false );
		}
		
		this.node.box.setClass( this.setting['css' + Js.helper.toProperCase( status )] );
		
		Js.$( '<h3/>' )
			.text( title )
			.appendTo( this.node.box[0] );
		
		if ( text != '' ) 
			var p = Js.$( '<p/>' )
				.htmlText( text.toString() )
				.appendTo( this.node.box[0] );
		
		var span = Js.$( '<em/>' )
			.text( Js.language.widget.notice.timer )
			.appendTo( this.node.box[0] );
		
		this.node.node.one( 'click', function() {
			that.closeNotice();
		} );
		
		if ( sticky == false ) {
			setTimeout( function() {
				that.closeNotice();
			}, ( this.setting.seconds * 1000 ) );
		}
	},
	success: function( text, callback ) {
		this.callback = Js.helper.pick( callback, null );
		this.show( text, 'success' );
	},
	note: function( text, callback ) {
		this.callback = Js.helper.pick( callback, null );
		this.show( text, 'note' );
	},
	error: function( text, callback ) {
		this.callback = Js.helper.pick( text, null );
		this.show( text, 'error' );
	}
});
/* Tab Panel for Savvy.UI
 * version: 0.9.4
 */


Js.widget.tab = Js.create({
	appName: 'tab',
	height: null,
	toolbar: null,
	node: null,
	header: null,
	element: null,
	activeTab: null,
	activeHeader: null,
	handler: null,
	status: 'off',
	setting: null,
	tabs: null,
	current: '',
	
	initiate: function( element, option ) {
		var that = this;
		var prepare = function( element, option ) {
			that.node = Js.$( element );
			that.init( option );
		};
		
		if ( !!Js.helper.isset( element ) )
			prepare( element, option );
		
		return this;
	},
	
	setup: function( option ) {
		this.setting = Js.append( option, this.setting );
		return this;
	},
	
	init: function( option ) {
		var that = this;
		
		// setting should be available
		this.setup( option );
		this.setting = Js.append( this.setting, Js.config.widget.tab );
		this.handler = Js.helper.pickGrep( this.setting.handler, 'click', /^(mouseover|click)$/i );
		
		if ( this.node.size() > 0 ) {
			this.node.addClass( this.setting.container );
			this.element = this.node.eq( 0 ).attr( 'id' );
			
			// add tab toolbar on top
			this._addToolbar();
			// activate tab
			this.activateTab( '#' + Js.$( '.' + this.setting.cssHidden + ':first', this.node[0] ).attr( 'id' ) );
			
			this.status = 'on';
		}
		else 
			Js.debug.error( 'Js.widget.tab: No elements found' );
		
		return this;
	},
	
	_addToolbar: function() {
		var that = this,
			option = this.setting;
		
		if ( Js.helper.trim( option.header ) == '' ) {
			// DOM insert tab toolbar container
			var toolbar_container = Js.$( '<div/>' )
				.attr({
					className: option.toolbarContainer, 
					id: [ this.element, 'toolbar', 'container' ].join('-')
				})
				.prependTo( this.node[0] );
		}
		else {
			var toolbar_container = Js.$( option.header ).addClass( option.toolbarContainer  );
		}
		
		this.toolbar = toolbar_container;
		
		// DOM insert tab toolbar
		this.header = Js.$( '<ul/>' )
			.attr({
				id: [this.element, 'toolbar'].join('-'), 
				className: option.toolbar
			})
			.appendTo( this.toolbar[0] );
		
		// find all possible tabs
		var tab = Js.$( option.identifier, this.node[0] );
		
		tab.each(function( index, value ) {
			// add the tab title
			that._addHeader( value );
			// hide the tab
			Js.$( value ).setClass( option.cssHidden );
		});
		
		this.tabs = tab;
		this.tabs.css( 'display', 'none' );
		
		Js.$( '<div/>' ).css( 'display', 'block' ).appendTo( toolbar_container[0] );
	},
	
	_addHeader: function( element ) {
		var that = this,
			option = this.setting,
			node = Js.$( element );
		
		var title = node.attr( 'title' ),
			closable = node.hasClass( option.closable ),
			disable = node.hasClass( option.disabled );
		
		var li = Js.$( '<li/>' ).appendTo( this.header[0] );
		var a = Js.$( '<a/>' )
			.attr({
				href: '#' + node.attr('id'), 
				title: title
			})
			.appendTo( li[0] );
		
		Js.$( '<em/>' ).appendTo( a[0] );
		a.text( title );
		
		if ( !!closable ) {
			Js.$( '<span/>' )
				.css( 'paddingLeft', '10px' )
				.text('x')
				.click(function() {
					var my = Js.$( this.parentNode ).click(function(){
						return false;
					});
				
					var href = my.attr( 'href' );
					that.activeHeader.removeClass();
					that.activeTab.setClass( option.hidden );
					Js.$( href ).remove();
					Js.$( this.parentNode.parentNode ).remove();
				
					that.revert();
					
					return false;
				})
				.appendTo( a[0] );
		}
		
		if ( !!disable ) {
			a.setClass( option.cssDisabled )
				.bind( this.handler, function(){
					return false;
				});
		}
		else {
			a.bind( this.handler, function() {
				that.activateTab( Js.$( this ).attr('href') );
				
				return false;
			});
		}
	},
	
	enableTab: function( element ) {
		var that = this;
		
		Js.$( 'a[href=' + element + ']', this.header[0] )
			.removeClass()
			.unbind( this.handler )
			.bind( this.handler, function(){
				that.activateTab( Js.$(this).attr('href') );
				return false;
			});
				
		return false;
	},
	
	disableTab: function( element ) {
		var that = this;
		
		Js.$( 'a[href=' + element + ']', this.header[0] )
			.setClass( this.setting.cssDisabled )
			.unbind( this.handler )
			.bind( this.handler, function(){
				return false;
			});
		
		return false;
	},
	
	activateTab: function( element ) {
		var element = element,
			that = this,
			option = this.setting;
		
		var callback = function() {
			if ( Js.helper.isset( that.activeHeader ) )
				that.activeHeader.removeClass( option.cssCurrent );
			
			that.activeHeader = Js.$( 'a[href=' + element + ']', that.header[0] );
			that.activeTab = Js.$( element );
			
			that.activeHeader.addClass( option.cssCurrent );
			that.activeTab.setClass( option.cssActive );
			
			if ( !!option.fx ) 
				that.activeTab.slideDown( 'normal' );
			else 
				that.activeTab.show();
			
			that.current = element;
		};
		
		if( this.current !== element ) {
			if ( Js.helper.isset( this.activeTab ) ) {
				this.activeTab.setClass( option.cssHidden );
				
				if ( !!option.fx ) {
					this.activeTab.slideUp( 'normal', function(){
						callback();
					});
				}
				else {
					this.activeTab.hide();
					callback();
				}
			} 
			else 
				callback();
		}
		return false;
	},
	
	revert: function() {
		var anchors = Js.$( 'li > a', this.header[0] );
		
		if ( anchors.size() > 0 ) 
			this.activateTab( anchors.attr('href') );
	},
	
	showTab: function() {
		if ( this.status == 'off' ) {
			this.toolbar.show();
			this.tabs.setClass( this.setting.cssHidden );
			this.activeTab.setClass( this.setting.cssActive );
		}
		
		this.status = 'on';
	},
	hideTab: function() {
		if ( this.status == 'on' ) {
			this.toolbar.hide();
			this.tabs.setClass( this.setting.cssActive );
		}
		
		this.status = 'off';
	},
	toggle: function() {
		this.status == 'off' ? this.showTab() : this.hideTab() ;
	},
	
	addTab: function( obj ) {
		var that = this;
		
		if ( !!obj.id && !!Js.helper.typeOf( obj.id, 'string' ) ) {
			var title = Js.helper.pick( obj.title, 'Untitled' ),
				id = obj.id,
				text = Js.helper.pick( obj.content, '' ),
				closable = Js.helper.pick( obj.closable, false ),
				activate = Js.helper.pick( obj.activate, false );
			
			var node = Js.$( '<div/>' )
				.attr({
					id: id,
					className: this.setting.cssHidden,
					title: title
				})
				.css( 'display', 'none' )
				.htmlText( text )
				.appendTo( this.node[0] );
			
			this.tabs.add( node[0] );
			
			var li = Js.$( '<li/>' ).appendTo( this.header[0] );
			var a = Js.$( '<a/>' ).attr({
				href: '#' + id,
				title: title
			}).appendTo( li[0] );
			
			Js.$( '<em/>' ).appendTo( a[0] );
			
			a.text( title ).bind( this.handler, function(){
				that.activateTab( Js.$(this).attr('href') );
				
				return false;
			});
			
			if ( !!closable ) {
				Js.$( '<span/>' )
					.click(function() {
						var href = Js.$( this.parentNode ).attr( 'href' );
						that.activeHeader.removeClass();
						
						that.activeTab.setClass( that.setting.hidden )
							.fadeOut( 'normal', function(){
								Js.$( this ).remove();
							});
						
						Js.$( href ).remove();					
						Js.$( this.parentNode.parentNode ).remove();
						
						that.revert();
						
						return false;
					})
					.css( 'paddingLeft', '10px' )
					.text( 'x' )
					.appendTo( a[0] );
			}
			
			if ( !!activate ) 
				this.activateTab( '#' + id );
		}
		
		return this;
	}
});

