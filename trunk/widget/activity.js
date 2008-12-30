/**
 * @projectDescription Activity Overlay for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * @constructor
 * @param {String, Object} selector
 * @param {Object} option
 */
Js.widget.activity = function(selector, option) 
{
	this.node = null;
	this.element = null;
	this.box = null;
	this.setting = Js.config.widget.activity;
	this.status = 0;
	
	if(Jrun.isset(selector))
	{
		this.init(selector, option);
	}
	
	return this;
};
Js.widget.activity.prototype = {
	init: function(selector, option) 
	{
		this.element = Jrun.pick(selector, this.element);
		this.setting = Js.append(Jrun.pick(option, {}), this.setting);
		
		this.node = jQuery(this.element).css({
			background: this.setting.css.backgroundColor,
			zIndex: this.setting.css.zIndex
		}).setClass(this.setting.identifier).fadeTo("fast", 0.01);
	},
	activate: function() 
	{
		if (this.status == 0) 
		{
			this.node.css({
				"display": "block"
			}).fadeTo("normal", this.setting.opacity);
			
			var t = Js.util.dimension.page.middle(this.setting.box.width, this.setting.box.height);
			
			if (Jrun.isset(this.box)) 
			{
				this.box.css({
					top: "130px",
					left: t[1] + "px"
				});
			}
		}
		
		this.status++;
	},
	loadImage: function() 
	{
		this.box = jQuery("<img/>").attr({
			src: this.setting.box.imagePath
		}).css({
			position: "absolute",
			width: this.setting.box.width + "px",
			height: this.setting.box.height + "px",
			zIndex: this.setting.box.zIndex
		}).appendTo(this.node);
	},
	deactivate: function() 
	{
		if(this.status > 0) 
		{
			this.node.fadeTo("normal", 0, function() {
				jQuery(this).css({
					"display": "none"
				});
			});
		}
		
		this.status--;
		this.status = (this.status < 0 ? 0 : this.status);
	}
};

/**
 * Configuration for Js.widget.activity
 */
Js.config.widget.activity = {
	box: {
		imagePath: "images/",
		width: 200,
		height: 20,
		zIndex: 5001
	},
	identifier: "widget-activity",
	opacity: 0.6,
	css: {
		backgroundColor: "#fff",
		zIndex: 5000
	}
};
