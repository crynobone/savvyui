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
	closeButton: null,
	minimizeButton: null,
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
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	_prepSetting: function()
	{
		this.renderTo = Jrun.pick(this.setting.renderTo, "body:eq(0)");
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
			this.renderTo = Js.use(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		this._load();
	},
	_load: function()
	{
		var that = this;
		
		// render panel and hide it
		this.node = Js.use("<div/>").attr({
			id: this.element + "_panel",
			className: "widget-panel"
		}).appendTo(this.renderTo[0]);
		
		// set panel width
		if (Jrun.isset(this.setting.width)) {
			this.node.css("width", this.setting.width + "px");
		}
		
		// render header
		this.header = Js.use("<div/>").addClass("panel-header").appendTo(this.node[0]);
		// render content
		this.container = Js.use("<div/>").addClass("panel-content-container").appendTo(this.node[0]);
		// render footer
		this.footer = Js.use("<div/>").css({
			width: "100%",
			height: "15px"
		}).appendTo(this.node[0]);
		
		
		// set panel height
		if (Jrun.isset(this.setting.height)) {
			this.container.css("height", this.setting.height + "px");
		}
		
		// render header container for close and minimize button
		var ext = Js.use("<div/>").attr({
			className: "panel-ext"
		}).css({
			"cssFloat": "right", 
			"overflow": "hidden", 
			"width": "28px", 
			"height": "20px", 
			"textAlign": "right"
		}).appendTo(this.header[0]);
		
		// render header title
		var title = Js.use("<div/>").addClass("panel-title").text(this.setting.title).css({
			"overflow": "hidden", 
			"height": "20px"
		}).appendTo(this.header[0]);
		
		// render Close-Button 
		var tclose = Js.use("<span/>").text("x").css({
			"width": "14px",
			"display": "none"
		}).appendTo(ext[0]);
		
		// render Minimize-Button
		var tmin = Js.use("<span/>").text("_").css({
			"width": "14px",
			"display": "none"
		}).appendTo(ext[0]);
		
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
		this.minimizeButton = tmin;
		
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
		this.closeButton = tclose;
		
		// THIS IS WHERE YOUR CONTENT SHOULD GO
		this.content = Js.use("<div/>").attr({
			id: this.element, 
			className: "panel-content"
		}).plainHtml(this.setting.content).appendTo(this.container[0]);
		
		// set height and scrolling option for content CONTAINER
		if (Jrun.isset(this.setting.height) && !!this.setting.scrolling) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px",
				"overflow": "auto"
			});
		}
		
		// make the panel visible
		this.node.show("slow");
		
		return this;
	},
	closePanel: function() 
	{
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
	_fixResize: function() 
	{
		if (Jrun.isset(this.setting.height) && !!this.setting.scrolling) {
			this.content.css({
				"height": (this.setting.height - (23 + 21)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
});
