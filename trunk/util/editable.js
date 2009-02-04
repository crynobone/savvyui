/**
 * @author crynobone
 */

Js.util.editable = Js.base.create({
	node: null,
	element: null,
	box: null,
	setting: null,
	value: null,
	input: null,
	lastSelected: null,
	__construct: function(element, option) {
		if(!!Jrun.isset(element)) {
			this.init(element, option);
		}
		return this;
	},
	setup: function(option) 
	{
		this.setting = Js.append(option, this.setting);
	},
	init: function(selector, option) {
		var that = this;
		
		this.element = Jrun.pick(this.element, selector);
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.util.editable);
		this.node = Js.use(this.element);
		
		this.node.change(function() {
			var node = Js.use(this);
			
			if (node.val() == that.setting.identifier) {
				that.getModalBox(this);
			}
		});
		
		this.node.each(function() {
			if(Js.use(this).val() == that.setting.identifier) {
				this.options[0].selected = true;
			}
		});
	},
	onModalBoxClose: function(field)
	{
		var opt = [];
		Js.use(field).children("option").each(function(index, value) {
			opt.push(Js.use(value).val());
		});
		var value = this.input.val();
		if(Jrun.isset(value) && Jrun.trim(value) != "" && !Jrun.inArray(value, opt)) {
			Js.use('<option selected="selected" value="' + value + '">' + value + '</option>').appendTo(field);
			this.value = value;
		} 
		else {
			field.options[0].selected = true;
		}
	},
	getModalBox: function(field)
	{
		var that = this;
		var content = Js.use("<div/>");
		
		
		this.box = new Js.widget.dialog({
			element: "editable_edit_box_" + Jrun.prep(this.element),
			title: this.setting.title,
			width: 300,
			height: 100,
			onClose: function() {
				that.onModalBoxClose(field);
			},
			overlay: true
		});
		
		var p = Js.use("<p/>").html("" + this.setting.message).appendTo(this.box.content[0]);
		this.input = Js.use('<input type="text" name="util_editable_' + Jrun.prep(this.element) + '" value="' + this.setting.prefix + '"/>').appendTo(this.box.content[0]);
		var submitBtn = jQuery('<input type="button"/>').val("Ok").setClass("submit-button").appendTo(this.box.content[0]);
		var cancelBtn = jQuery('<input type="button"/>').val("Cancel").setClass("cancel-button").appendTo(this.box.content[0]);
		var box = this.box;
		
		box.overlay.node.click(function() {
			that.input.val("");
			box.closePanel();
		});
		
		box.closeButton.click(function() {
			that.input.val("");
			box.closePanel();
		});
		
		submitBtn.click(function() {
			box.closePanel();
		});
		cancelBtn.click(function() {
			that.input.val("");
			box.closePanel();
		});
	}
});