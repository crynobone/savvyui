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
		if( !!Jrun.isset(element) ) 
			this.init( element, option );
		
		return this;
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
		
		var content = Js.use( "<div/>" );
		
		this.box = new Js.widget.dialog({
			element: "editable_edit_box_" + Jrun.prep( this.element ),
			title: this.language.title,
			width: 300,
			height: 100,
			onClose: function() {
				that.onModalBoxClose( field );
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
		
		var buttonDiv = Js.use( "<div/>" )
			.setClass( "button" )
			.appendTo( this.box.content[0] );
		var submitBtn = Js.use( '<input type="button"/>' )
			.val( "Ok" )
			.setClass( "submit-button" )
			.appendTo( buttonDiv[0] );
		var cancelBtn = Js.use( '<input type="button"/>' )
			.val( "Cancel" )
			.setClass( "cancel-button" )
			.appendTo( buttonDiv[0] );
		
		var box = this.box;
		
		box.overlay.node.bind( "click", function() {
			that.input.val("");
			box.closePanel();
		});
		
		box.closeButton.bind( "click", function() {
			that.input.val("");
			box.closePanel();
		});
		
		submitBtn.bind( "click", function() {
			box.closePanel();
		});
		
		cancelBtn.bind( "click", function() {
			that.input.val("");
			box.closePanel();
		});
	}
});