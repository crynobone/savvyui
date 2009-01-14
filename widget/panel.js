/**
 * @version 0.2.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.config.widget.panel = {
	title: "Untitled",
	width: 300,
	height: 300,
	minWidth: 100,
	minHeight: 200,
	layout: "sui-panel",
	onClose: null,
	allowClose: true,
	allowMinimize: false,
	allowResize: false	
};

Js.widget.panel = Js.base.create({
	node: null,
	renderTo: null,
	element: null,
	setting: null,
	__construct: function()
	{
		
	},
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	}
});
