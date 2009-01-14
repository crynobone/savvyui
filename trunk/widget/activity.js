/**
 * @projectDescription Activity Overlay for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * Initiate Activity layer to prevent user from interfering with running process.
 * 
 * @constructor
 * @alias Js.widget.activity
 * @param {String, Object} [selector] Any selector format supported by jQuery CSS Selector Engine
 * @param {Object} [option] Provide local setting as based on available option in Js.config.widget.activity
 * @return {Object} return this object
 */
Js.widget.activity = Js.base.create({
	node: null,
	element: null,
	box: null,
	setting: null,
	status: 0,
	__construct: function(selector, option)
	{
		if (Jrun.isset(selector)) {
			this.init(selector, option);
		}
		
		return this;
	},
	/**
	 * Setup local setting for this object
	 * 
	 * @methodvar errorNode = field.siblings(this.setting.error.node + "." + this.setting.error.cssMessage).eq(0);
			
	 * @param {Object} option
	 */
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	},
	/**
	 * Initiate internal call, assign DOM element as activity layer and this option
	 * 
	 * @see Js.widget.activity
	 * @method
	 * @param {String, Object} [selector] Any selector format supported by jQuery CSS Selector Engine
	 * @param {Object} [option] Provide local setting as based on available option in Js.config.widget.activity
	 */
	init: function(selector, option) 
	{
		this.element = Jrun.pick(selector, this.element);
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.activity);
		
		this.node = jQuery(this.element);
		if (this.node.length == 0) {
			jQuery("<div/>").attr("id", Jrun.prep(this.element)).appendTo("body");
		}
		
		this.node.css({
			background: this.setting.background,
			zIndex: this.setting.zIndex,
			display: "none"
		}).setClass(Jrun.prep(this.setting.identifier)).css("opacity", 0.01);
	},
	/**
	 * Activate activity layer
	 * 
	 * @method
	 */
	activate: function(callback) 
	{
		if (this.status == 0) {
			this.node.css({
				"display": "block"
			}).fadeTo("normal", this.setting.opacity);
			
			var t = Js.util.dimension.page.middle(this.setting.boxWidth, this.setting.boxHeight);
			
			if (Jrun.isset(this.box)) {
				this.box.css({
					top: "130px",
					left: t[1] + "px"
				});
			}
		}
		
		this.status++;
		
		if (Jrun.isfunction(callback)) {
			callback();
		}
	},
	/**
	 * Load activity indicator image
	 * 
	 * @method
	 */
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
	/**
	 * Deactivate activity layer
	 * 
	 * @method
	 */
	deactivate: function(callback) 
	{
		if (this.status > 0) {
			this.node.fadeTo("normal", 0, function(){
				jQuery(this).css({
					"display": "none"
				});
				if (Jrun.isfunction(callback)) {
					callback();
				}
			});
		}
		
		this.status--;
		this.status = (this.status < 0 ? 0 : this.status);
	}
});