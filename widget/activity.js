/**
 * @projectDescription Activity Overlay for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * Configuration for Js.widget.activity
 */
Js.config.widget.activity = {
	imagePath: "images/",
	boxWidth: 200,
	boxHeight: 20,
	identifier: "widget-activity",
	opacity: 0.6,
	background: "#fff",
	zIndex: 5000
};

/**
 * Setup global configuration for Js.widget.activity
 * @alias Js.setup.widget.activity
 * @param {Object} option
 */
Js.setup.widget.activity = function(option)
{
	Js.config.widget.activity = Js.append(option, Js.config.widget.activity);
};

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
	this.setting = null;
	this.status = 0;
	
	if(Jrun.isset(selector))
	{
		this.init(selector, option);
	}
	
	return this;
};
Js.widget.activity.prototype = {
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	},	
	init: function(selector, option) 
	{
		this.element = Jrun.pick(selector, this.element);
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.activity);
		
		this.node = jQuery(this.element).css({
			background: this.setting.background,
			zIndex: this.setting.zIndex
		}).setClass(this.setting.identifier).fadeTo("fast", 0.01);
	},
	activate: function() 
	{
		if (this.status == 0) 
		{
			this.node.css({
				"display": "block"
			}).fadeTo("normal", this.setting.opacity);
			
			var t = Js.util.dimension.page.middle(this.setting.boxWidth, this.setting.boxHeight);
			
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
			src: this.setting.imagePath
		}).css({
			position: "absolute",
			width: this.setting.boxWidth + "px",
			height: this.setting.boxHeight + "px",
			zIndex: (this.setting.zIndex + 1)
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