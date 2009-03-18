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