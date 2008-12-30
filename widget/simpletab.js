/**
 * Tab widget for Savvy.UI
 * @version 0.9.1
 * @author Mior Muhammad Zaki
 * @extends Js.widget
 * @license MIT
 */

/**
 * Initialize Js.widget.simpleTab using it constructor:<br>
 * e.g: <b>new Js.widget.simpleTab</b>
 * @id Js.widget.simpleTab
 * @constructor
 * @param {Object} node
 * @param {Object} option
 * @return {Object}
 */
Js.widget.simpleTab = function(node, option) 
{
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.node = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	this.handler = null;
	this.status = "off";
	this.setting = Js.config.widget.simpleTab;
	
	// load the tab module if selector already provided in the arguments
	if(!!Jrun.isset(node)) 
	{
		this.init(node, option);
	}
	
	return this;
};
Js.widget.simpleTab.prototype = {
	init: function(node, option) 
	{
		var that = this;
		
		// setting should be available
		this.setting = Js.append(Jrun.pick(option, {}), this.setting);
		
		this.node = jQuery(node);
		this.node.addClass(this.setting.panel.container);
		this.element = this.node.eq(0).attr("id");
		
		this.handler = Jrun.pickGrep(this.setting.handler, "click", /^(mouseover|click)$/i);
		
		// add tab toolbar on top
		this.addToolbar();
		
		// set the first tab as active
		this.activeHeader = jQuery("a[href=#" + this.activeTab.attr("id") + "]", this.header);
		this.activeHeader.addClass(this.setting.panel.currentHeader);
		this.activeTab.setClass(this.setting.panel.active);
		
		// tab is activated
		this.status = "on";
	},
	addToolbar: function() 
	{
		var that = this;
		
		// find all possible tabs
		var child = jQuery(this.setting.identifier, this.node);
		
		child.each(function(index, data) {
			// add the tab title
			that.addHeader(data);
			// hide the tab
			jQuery(data).setClass(that.setting.panel.hidden);
		});
		
		// first tab should be activated
		this.activeTab = child.eq(0);
		
		// DOM insert tab toolbar container
		var div = jQuery("<div/>").attr({
			className: this.setting.panel.toolbarContainer, 
			id: [this.element, "toolbar", "container"].join("-")
		}).prependTo(this.node);
		this.toolbar = div;
		
		// DOM insert tab toolbar
		this.header = jQuery("<ul/>").attr({
			id: [this.element, "toolbar"].join("-"), 
			className: this.setting.panel.toolbar
		}).appendTo(this.toolbar);
		
		var div2 = jQuery("<div/>").css("display", "block").appendTo(div);
	},
	addHeader: function(node) 
	{
		var that = this;
		
		var node = jQuery(node);
		var title = node.attr("title");
		var closable = node.hasClass("tab-closable");
		
		var li = jQuery("<li/>").appendTo(this.header);
		var a = jQuery("<a/>").attr({
			href: "#" + node.attr("id"), 
			title: title
		}).appendTo(li);
		
		jQuery("<em/>").appendTo(a);
		
		a.text(title).bind(this.handler, function() {
			that.activate(this);
			return false;
		});
		
		if(!!closable) 
		{
			jQuery("<span/>").css("paddingLeft", "10px").text("x").click(function() {
				var my = jQuery(this.parentNode).click(function() {
					return false;
				});
				
				var href = my.attr("href");
				that.activeHeader.removeClass();
				that.activeTab.setClass(that.setting.panel.hidden);
				jQuery(href).remove();
				jQuery(this.parentNode.parentNode).remove();
				
				that.revert();
			}).appendTo(a);
		}
	},
	activate: function(node) 
	{
		var that = this;
		this.activeHeader.removeClass(this.setting.panel.currentHeader);
		this.activeTab.setClass(this.setting.panel.hidden);
		
		this.activeHeader = jQuery(obj);
		var href = this.activeHeader.attr("href");
		this.activeTab = jQuery(href);
		
		this.activeHeader.addClass(this.setting.panel.currentHeader);
		this.activeTab.setClass(this.setting.panel.active);
		
		return false;
	},
	revert: function() 
	{
		var active = jQuery("li > a", this.header);
		
		if(active.length > 0) 
		{
			this.activate(active.eq(0));
		}
	},
	toggle: function() 
	{
		if(this.status == "on") 
		{
			this.toolbar.hide();
			jQuery("div." + this.setting.panel.hidden, this.object).setClass(this.setting.panel.active);
			this.status = "off";
		} 
		else 
		{
			this.toolbar.show();
			jQuery("div." + this.setting.panel.active, this.object).setClass(this.setting.panel.hidden);
			this.activeTab.setClass(this.setting.panel.active);
			this.status = "on";	
		}
	},
	addTab: function(js) 
	{
		var that = this;
		
		if(!!js.id && Jrun.typeOf(js.id) === "string") 
		{
			var title = Jrun.pick(js.title, "Untitled");
			var id = js.id;
			var content = Jrun.pick(js.content, "");
			var closable = Jrun.pick(js.closable, false);
			var set = Jrun.pick(js.activate, false);
			
			var node = jQuery('<div/>').attr({
				id: id, 
				className: this.setting.panel.hidden
			}).html(content).appendTo(this.node);
			
			var li = jQuery('<li/>').appendTo(this.header);
			var a = jQuery('<a/>').attr({
				href: "#" + id, 
				title: title
			}).appendTo(li);
			
			jQuery("<em/>").appendTo(a);
			a.text(title).bind(this.handler, function() {
				that.activate(this);
				return false;
			});
			
			if (!!closable) 
			{
				jQuery("<span/>").click(function() {
					var href = jQuery(this.parentNode).attr("href");
					that.activeHeader.removeClass();
					that.activeTab.setClass(that.setting.panel.hidden).fadeOut("normal", function() {
						jQuery(this).remove();
					});
					jQuery(href).remove();
					jQuery(this.parentNode.parentNode).remove();
				}).css("paddingLeft", "10px").text("x").appendTo(a);
			}
			
			if(!!set) 
			{
				this.activate(node);
			}
		}
		return this;
	}
};

/**
 * Js.widget.simpleTab configuration
 * @id Js.config.widget.simpleTab
 */
Js.config.widget.simpleTab = {
	handler: "click",
	identifier: "simpletab",
	closable: "tab-closable",
	panel: {
		toolbar: "simpletab-toolbar",
		toolbarContainer: "simpletab-toolbar-container",
		container: "simple-container",
		hidden: "simpletab-hidden",
		active: "simpletab-active",
		currentHeader: "current"
	}
};