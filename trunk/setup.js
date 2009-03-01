/**
 * @projectDescription Global Configurator Function for Savvy.UI
 * @memberOf Js
 * @version 0.0.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.setup = {
	ext: {
		validate: function(option)
		{
			Js.config.ext.validate = Js.append(option, Js.config.ext.validate, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.ext.validate = Js.append(option.lang, Js.language.ext.validate);
			}
		}
	},
	test: function(option)
	{
		Js.config.test = Js.append(option, Js.config.test);
	},
	util: {
		buttonSubmit: function(option)
		{
			Js.config.util.buttonSubmit = Js.append(option, Js.config.util.buttonSubmit);
		},
		formSubmit: function(option)
		{
			Js.config.util.formSubmit = Js.append(option, Js.config.util.formSubmit);
		},
		editable: function(option)
		{
			Js.config.util.editable = Js.append(option, Js.config.util.editable, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.util.editable = Js.append(option.lang, Js.language.util.editable);
			}
		}
	},
	widget: {
		activity: function(option)
		{
			Js.config.widget.activity = Js.append(option, Js.config.widget.activity);
		},
		datePicker: function(option)
		{
			Js.config.widget.datePicker = Js.append(option, Js.config.widget.datePicker, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.widget.datePicker = Js.append(option.lang, Js.language.widget.datePicker);
			}
		},
		iconizer: function(option)
		{
			Js.config.widget.iconizer = Js.append(option, Js.config.widget.iconizer);
		},
		notice: function(option)
		{
			Js.config.widget.notice = Js.append(option, Js.config.widget.notice, ["lang"], true);
			if(Jrun.isset(option.lang)) {
				Js.language.widget.notice = Js.append(option.lang, Js.language.widget.notice);
			}
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