/**
 * @version 0.1.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.dialog = Js.widget.panel.extend({
	init: function(option)
	{
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.panel);
		this._prepSetting();
		
		// set renderTo element
		if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = Js.use(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		this._load();
		this._dimension();
	},
	_dimension: function()
	{
		var offset = [
			this.node.width(),
			this.node.height()
		];
		var center = Js.util.dimension.page.middle(offset[0], offset[1]);
		var left = center[1];
		var top = center[0];
		left = (left < 0 ? 0 : left);
		top = (top < 0 ? 0 : top);
		
		this.node.css({
			"position": "absolute", 
			"top": top + "px", 
			"left": left + "px"
		});
	}
});