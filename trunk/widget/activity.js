/**
 * @last-modified: 
 * @projectDescription Activity Overlay for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.activity = function(selector, option) 
{
	this.node = null;
	this.element = null;
	this.box = null;
	this.setting = Js.config.widget.activity;
	this.opacity = 0;
	this.status = 0;
	
	if(Jrun.isset(selector))
	{
		this.init(selector, option);
	}
};
Js.widget.activity.prototype = {
	init: function(selector, option) 
	{
		this.element = Jrun.pick(selector, this.element);
		this.setting = Js.append(Jrun.pick(option, {}), this.setting);
		
		this.node = jQuery(this.element).css({
			background: this.setting.css.backgroundColor
		}).fadeTo("slow", 0.01);
	},
	activate: function() 
	{
		if (this.status == 0) 
		{
			this.object.css({
				display: "block"
			}).fadeTo("normal", this.opacity);
			
			var t = Js.util.dimension.page.middle(this.boxWidth, this.boxHeight);
			
			if (Jrun.isset(this.box)) 
			{
				this.box.css({
					top: "130px",
					left: t[1] + "px"
				});
			}
			// we the time out for the procession to 20 seconds. Just in case the connection hangs
			setTimeout(function(){
				Js.widget.overlay.deactivate();
			}, 20000);
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
		if(this.status == 1) 
		{
			this.object.fadeTo("normal", 0, function() {
				jQuery(this).css({
					display: "none"
				});
			});
		}
		
		this.status--;
		this.status = (this.status < 0 ? 0 : this.status);
	}
};

Js.config.widget.activity = {
	box: {
		imagePath: "images/",
		width: 200,
		height: 20,
		zIndex: 5000
	},
	css: {
		backgroundColor: "#fff"
	}
};
