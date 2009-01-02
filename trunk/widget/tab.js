/**
 * @version 0.9.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.tab = Js.base.create({
	height: null,
	toolbar: null,
	node: null,
	header: null,
	element: null,
	activeTab: null,
	activeHeader: null,
	handler: null,
	statys: "off",
	setting: null,
	__construct: function(selector, option)
	{
		if(!!Jrun.isset(selector)) 
		{
			this.init(selector, option);
		}
	},
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	},
	init: function(selector, option)
	{
		var that = this;
		
		// setting should be available
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.tab);
		
		this.node = jQuery(selector);
		this.node.addClass(this.setting.container);
		this.element = this.node.eq(0).attr("id");
		
		this.handler = Jrun.pickGrep(this.setting.handler, "click", /^(mouseover|click)$/i);
		
		// add tab toolbar on top
		this._addToolbar();
		
		// set the first tab as active
		this.activeHeader = jQuery("a[href=#" + this.activeTab.attr("id") + "]", this.header);
		this.activeHeader.addClass(this.setting.currentHeader);
		this.activeTab.setClass(this.setting.cssActive);
		
		// tab is activated
		this.status = "on";
	},
	_addToolbar: function() 
	{
		var that = this;
		Js.debug.log("Js.widget.simpleTab: load Toolbar");
		
		// DOM insert tab toolbar container
		var div = jQuery("<div/>").attr({
			className: this.setting.toolbarContainer, 
			id: [this.element, "toolbar", "container"].join("-")
		}).prependTo(this.node);
		this.toolbar = div;
		
		// DOM insert tab toolbar
		this.header = jQuery("<ul/>").attr({
			id: [this.element, "toolbar"].join("-"), 
			className: this.setting.toolbar
		}).appendTo(this.toolbar);
		
		// find all possible tabs
		var child = jQuery(this.setting.identifier, this.node);
		
		child.each(function(index, data) {
			// add the tab title
			that._addHeader(data);
			// hide the tab
			jQuery(data).setClass(that.setting.cssHidden);
		});
		
		// first tab should be activated
		this.activeTab = child.eq(0);
		
		var div2 = jQuery("<div/>").css("display", "block").appendTo(div);
	},
	_addHeader: function(node) 
	{
		Js.debug.log("Js.widget.simpleTab: add header");
		var that = this;
		
		var node = jQuery(node);
		var title = node.attr("title");
		
		var closable = node.hasClass(this.setting.closable);
		var disabled = node.hasClass(this.setting.disabled);
		
		var li = jQuery("<li/>").appendTo(this.header);
		var a = jQuery("<a/>").attr({
			href: "#" + node.attr("id"), 
			title: title
		}).appendTo(li);
		
		jQuery("<em/>").appendTo(a);
		a.text(title);
				
		if(!!closable) 
		{
			jQuery("<span/>").css("paddingLeft", "10px").text("x").click(function() {
				var my = jQuery(this.parentNode).click(function() {
					return false;
				});
				
				var href = my.attr("href");
				that.activeHeader.removeClass();
				that.activeTab.setClass(that.setting.hidden);
				jQuery(href).remove();
				jQuery(this.parentNode.parentNode).remove();
				
				that.revert();
			}).appendTo(a);
		}
		
		if(!!disabled) 
		{
			a.setClass(this.setting.cssDisabled).bind(this.handler, function() {
				return false;
			});
		}
		else 
		{
			a.bind(this.handler, function() {
				that.activateTab(this);
				return false;
			});
		}
	},
	enableTab: function(selector)
	{
		var that = this;
		
		var anchor = jQuery("a[href=" + selector + "]", this.header);
		anchor.removeClass();
		anchor.unbind(this.handler);
		anchor.bind(this.handler, function(){
			that.activateTab(this);
			return false;
		});
				
		return false;
	},
	disableTab: function(selector)
	{
		var that = this;
		var that = this;
		
		var anchor = jQuery("a[href=" + selector + "]", this.header);
		anchor.setClass(this.setting.cssDisabled);
		anchor.unbind(this.handler);
		anchor.bind(this.handler, function(){
			return false;
		});
		
		return false;
	},
	activateTab: function(node) 
	{
		var that = this;
		this.activeHeader.removeClass(this.setting.cssCurrent);
		this.activeTab.setClass(this.setting.cssHidden);
		
		this.activeHeader = jQuery(node);
		var href = this.activeHeader.attr("href");
		this.activeTab = jQuery(href);
		
		this.activeHeader.addClass(this.setting.cssCurrent);
		this.activeTab.setClass(this.setting.cssActive);
		
		return false;
	},
	revert: function() 
	{
		var active = jQuery("li > a", this.header);
		
		if(active.length > 0) 
		{
			this.activateTab(active.eq(0));
		}
	},
	toggle: function() 
	{
		if(this.status == "on") 
		{
			this.toolbar.hide();
			jQuery("div." + this.setting.cssHidden, this.object).setClass(this.setting.cssActive);
			this.status = "off";
		} 
		else 
		{
			this.toolbar.show();
			jQuery("div." + this.setting.cssActive, this.object).setClass(this.setting.cssHidden);
			this.activeTab.setClass(this.setting.cssActive);
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
				className: this.setting.cssHidden
			}).html(content).appendTo(this.node);
			
			var li = jQuery('<li/>').appendTo(this.header);
			var a = jQuery('<a/>').attr({
				href: "#" + id, 
				title: title
			}).appendTo(li);
			
			jQuery("<em/>").appendTo(a);
			a.text(title).bind(this.handler, function() {
				that.activateTab(this);
				return false;
			});
			
			if (!!closable) 
			{
				jQuery("<span/>").click(function() {
					var href = jQuery(this.parentNode).attr("href");
					that.activeHeader.removeClass();
					that.activeTab.setClass(that.setting.hidden).fadeOut("normal", function() {
						jQuery(this).remove();
					});
					jQuery(href).remove();
					jQuery(this.parentNode.parentNode).remove();
					
					that.revert();
				}).css("paddingLeft", "10px").text("x").appendTo(a);
			}
			
			if(!!set) 
			{
				this.activateTab(node);
			}
		}
		return this;
	}
});
