/**
 * @version 0.0.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.setup = {
	ext: {
		form: function(option)
		{
			Js.config.ext.form = Js.append(option, Js.config.ext.form);
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
		}
	},
	widget: {
		activity: function(option)
		{
			Js.config.widget.activity = Js.append(option, Js.config.widget.activity);
		},
		calendar: function(option)
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
		tab: function(option)
		{
			Js.config.widget.tab = Js.append(option, Js.config.widget.tab);
		}
	}
};