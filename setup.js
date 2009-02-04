/**
 * @version 0.0.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.setup = {
	ext: {
		validate: function(option)
		{
			Js.config.ext.validate = Js.append(option, Js.config.ext.validate);
		}
	},
	test: function(option)
	{
		Js.config.test = Js.append(option, Js.config.test);
	},
	util: {
		buttonSubmit: function(option)
		{
			Js.config.widget.buttonSubmit = Js.append(option, Js.config.widget.buttonSubmit);
		},
		formSubmit: function(option)
		{
			Js.config.widget.formSubmit = Js.append(option, Js.config.widget.formSubmit);
		},
		editable: function(option)
		{
			Js.config.widget.editable = Js.append(option, Js.config.widget.editable);
		}
	},
	widget: {
		activity: function(option)
		{
			Js.config.widget.activity = Js.append(option, Js.config.widget.activity);
		},
		datePicker: function(option)
		{
			Js.config.widget.calendar = Js.append(option, Js.config.widget.calendar);
		},
		iconizer: function(option)
		{
			Js.config.widget.iconizer = Js.append(option, Js.config.widget.iconizer);
		},
		notice: function(option)
		{
			Js.config.widget.notice = Js.append(option, Js.config.widget.notice);
		},
		panel: function(option)
		{
			Js.config.widget.panel = Js.append(option, Js.config.widget.panel);
		},
		tab: function(option)
		{
			Js.config.widget.tab = Js.append(option, Js.config.widget.tab);
		}
	}
};