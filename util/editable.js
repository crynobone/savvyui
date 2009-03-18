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