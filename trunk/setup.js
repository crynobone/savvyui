Js.setup = {
	ext: {
		validate: function( data ) {
			Js.config.ext.validate = Js.append( data, Js.config.ext.validate, ['lang'], true );
			
			if ( Js.on.isset( data.lang ) ) 
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
			
			if ( Js.on.isset( data.lang ) ) 
				Js.language.util.editable = Js.append( data.lang, Js.language.util.editable );
		}
	},
	
	widget: {
		activity: function( data ) {
			Js.config.widget.activity = Js.append( data, Js.config.widget.activity );
		},
		
		datePicker: function( data ) {
			Js.config.widget.datePicker = Js.append( data, Js.config.widget.datePicker, ['lang'], true );
			
			if ( Js.on.isset( data.lang ) ) 
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
			
			if ( Js.on.isset( data.lang ) ) 
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