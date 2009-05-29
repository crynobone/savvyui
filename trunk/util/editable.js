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
