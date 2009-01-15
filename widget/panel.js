/**
 * @version 0.2.1
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.panel = Js.base.create({
	node: null,
	renderTo: null,
	element: null,
	setting: null,
	header: null,
	container: null,
	content: null,
	footer: null,
	status: "normal",
	__construct: function(option)
	{
		if (Jrun.isset(option)) {
			this.init(option);
		}
	},
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	},
	_prepSetting: function()
	{
		this.renderTo = this.setting.renderTo;
		this.element = this.setting.element;	
	},	
	init: function(option)
	{
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.panel);
		this._prepSetting();
		
		// set renderTo element
		if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = jQuery(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = jQuery("body").eq(0);
		}
		
		this._load();
	},
	_load: function()
	{
		var that = this;
		
		// render panel and hide it
		this.node = jQuery("<div/>").attr({
			id: this.element + "_panel",
			className: "widget-panel"
		}).appendTo(this.renderTo);
		
		// set panel width
		if (Jrun.isset(this.setting.width)) {
			this.node.css("width", this.setting.width + "px");
		}
		
		// render header
		this.header = jQuery("<div/>").addClass("panel-header").appendTo(this.node);
		// render content
		this.container = jQuery("<div/>").addClass("panel-content-container").html("").appendTo(this.node);
		// render footer
		this.footer = jQuery("<div/>").css({
			width: "100%",
			height: "15px"
		}).appendTo(this.node);
		
		
		// set panel height
		if (Jrun.isset(this.setting.height)) {
			this.container.css("height", this.setting.height + "px");
		}
		
		// render header container for close and minimize button
		var ext = jQuery("<div/>").attr({
			className: "panel-ext"
		}).css({
			"cssFloat": "right", 
			"overflow": "hidden", 
			"width": "28px", 
			"height": "20px", 
			"textAlign": "right"
		}).appendTo(this.header);
		
		// render header title
		var title = jQuery("<div/>").addClass("panel-title").text(this.setting.title).css({
			"overflow": "hidden", 
			"height": "20px"
		}).appendTo(this.header);
		
		// render Close-Button 
		var tclose = jQuery("<span/>").html("x").css({
			"width": "14px",
			"display": "none"
		}).appendTo(ext);
		
		// render Minimize-Button
		var tmin = jQuery("<span/>").html("_").css({
			"width": "14px",
			"display": "none"
		}).appendTo(ext);
		
		// Enable Minimize-Button option
		if (!!this.setting.allowMinimize) {
			tmin.addClass("panel-min").css({
				"display": "block", 
				"cursor": "pointer"
			}).bind("click", function() {
				if (that.status == "normal") {
					
					that.container.slideUp("normal");
					that.status = "minimize";
				} 
				else {
					that.container.slideDown("normal");
					that.status = "normal";
				}
			});
		} else {
			tmin.addClass("panel-disabled");
		}
		
		// Enable Close-Button option
		if (!!this.setting.allowClose) {
			tclose.addClass("panel-close").css({
				"display": "block",
				"cursor": "pointer"
			}).click(function() {
				that.closePanel();
			});
		} else {
			tclose.addClass("panel-disabled");
		}
		
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = jQuery("<div/>").attr({
			id: this.element, 
			className: "panel-content"
		}).html(this.setting.content).appendTo(this.container);
		
		// set height and scrolling option for content CONTAINER
		if(Jrun.isset(this.setting.height) && !!this.setting.scrolling) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px",
				"overflow": "auto"
			});
		}
		
		// make the panel visible
		this.node.show("slow");
		
		return this;
	},
	closePanel: function() {
		var that = this;
		
		// callback to close panel
		this.node.fadeOut("slow", function() {
			if (Jrun.isfunction(that.setting.onClose)) {
				that.setting.onClose();
			}
			
			that.node.remove();
		});
		return this;
	},
	_fixResize: function() {
		if(Jrun.isset(this.setting.height) && !!this.setting.scrolling) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
});
