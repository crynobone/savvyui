/**
 * @version 0.9.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * @alias Js.widget.tab
 * @constructor
 * @param {String} selector 
 * @param {Object} option
 * @return {Object}
 */
Js.widget.tab = Js.create({
	appName: "tab",
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
	initiate: function(selector, option) {
		if (!!Jrun.isset(selector)) {
			this.init(selector, option);
		}
	},
	setup: function(option) {
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	init: function(selector, option) {
		var that = this;
		
		// setting should be available
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.tab);
		
		this.node = Js.use(selector);
		this.node.addClass(this.setting.container);
		this.element = this.node.eq(0).attr("id");
		
		this.handler = Jrun.pickGrep(this.setting.handler, "click", /^(mouseover|click)$/i);
		
		// add tab toolbar on top
		this._addToolbar();
		
		this.activateTab("#" + Js.use("." + this.setting.cssHidden + ":first", this.node[0]).attr("id"));
		
		// tab is activated
		this.status = "on";
	},
	_addToolbar: function() {
		var that = this;
		
		// DOM insert tab toolbar container
		var div = Js.use("<div/>").attr({
			className: this.setting.toolbarContainer, 
			id: [this.element, "toolbar", "container"].join("-")
		}).prependTo(this.node[0]);
		this.toolbar = div;
		
		// DOM insert tab toolbar
		this.header = Js.use("<ul/>").attr({
			id: [this.element, "toolbar"].join("-"), 
			className: this.setting.toolbar
		}).appendTo(this.toolbar[0]);
		
		// find all possible tabs
		var child = Js.use(this.setting.identifier, this.node[0]);
		
		child.each(function(index, data) {
			// add the tab title
			that._addHeader(data);
			// hide the tab
			Js.use(data).setClass(that.setting.cssHidden);
		});
				
		var div2 = Js.use("<div/>").css("display", "block").appendTo(div[0]);
	},
	_addHeader: function(node) {
		var that = this;
		
		var node = Js.use(node);
		var title = node.attr("title");
		
		var closable = node.hasClass(this.setting.closable);
		var disabled = node.hasClass(this.setting.disabled);
		
		var li = Js.use("<li/>").appendTo(this.header[0]);
		var a = Js.use("<a/>").attr({
			href: "#" + node.attr("id"), 
			title: title
		}).appendTo(li[0]);
		
		Js.use("<em/>").appendTo(a[0]);
		a.text(title);
				
		if (!!closable) {
			Js.use("<span/>").css("paddingLeft", "10px").text("x").click(function(){
				var my = Js.use(this.parentNode).click(function(){
					return false;
				});
				
				var href = my.attr("href");
				that.activeHeader.removeClass();
				that.activeTab.setClass(that.setting.hidden);
				Js.use(href).remove();
				Js.use(this.parentNode.parentNode).remove();
				
				that.revert();
			}).appendTo(a[0]);
		}
		
		if (!!disabled) {
			a.setClass(this.setting.cssDisabled).bind(this.handler, function(){
				return false;
			});
		}
		else {
			a.bind(this.handler, function(){
				that.activateTab(Js.use(this).attr("href"));
			});
		}
	},
	enableTab: function(selector) {
		var that = this;
		
		var anchor = Js.use("a[href=" + selector + "]", this.header[0]);
		anchor.removeClass();
		anchor.unbind(this.handler);
		anchor.bind(this.handler, function(){
			that.activateTab(Js.use(this).attr("href"));
		});
				
		return false;
	},
	disableTab: function(selector) {
		var that = this;
		var that = this;
		
		var anchor = Js.use("a[href=" + selector + "]", this.header[0]);
		anchor.setClass(this.setting.cssDisabled);
		anchor.unbind(this.handler);
		anchor.bind(this.handler, function(){
			return false;
		});
		
		return false;
	},
	activateTab: function(selector) {
		var that = this;
		
		if (Jrun.isset(this.activeTab)) {
			this.activeHeader.removeClass(this.setting.cssCurrent);
			this.activeTab.setClass(this.setting.cssHidden);	
		}
		
		this.activeHeader = Js.use("a[href=" + selector + "]", this.header[0]);
		this.activeTab = Js.use(selector);
		
		this.activeHeader.addClass(this.setting.cssCurrent);
		this.activeTab.setClass(this.setting.cssActive);
		
		return false;
	},
	revert: function() {
		var active = Js.use("li > a", this.header[0]);
		
		if (active.length > 0) {
			this.activateTab(active.attr("href"));
		}
	},
	showTab: function() {
		if (this.status == "on") {
			this.toolbar.hide();
			Js.use("div." + this.setting.cssHidden, this.object).setClass(this.setting.cssActive);
		}
		this.status = "off";
	},
	hideTab: function() {
		if (this.status == "off") {
			this.toolbar.show();
			Js.use("div." + this.setting.cssActive, this.object).setClass(this.setting.cssHidden);
			this.activeTab.setClass(this.setting.cssActive);
		}
		this.status = "on";
	},
	toggle: function() {
		if (this.status == "on") {
			this.showTab();
		}
		else {
			this.hideTab();
		}
	},
	addTab: function(js) {
		var that = this;
		
		if (!!js.id && Jrun.typeOf(js.id) === "string") {
			var title = Jrun.pick(js.title, "Untitled");
			var id = js.id;
			var content = Jrun.pick(js.content, "");
			var closable = Jrun.pick(js.closable, false);
			var set = Jrun.pick(js.activate, false);
			
			var node = Js.use('<div/>').attr({
				'id': id,
				className: this.setting.cssHidden,
				title: title
			}).plainHtml(content).appendTo(this.node[0]);
			
			var li = Js.use('<li/>').appendTo(this.header[0]);
			var a = Js.use('<a/>').attr({
				href: "#" + id,
				title: title
			}).appendTo(li[0]);
			
			Js.use("<em/>").appendTo(a[0]);
			a.text(title).bind(this.handler, function(){
				that.activateTab(Js.use(this).attr("href"));
			});
			
			if (!!closable) {
				Js.use("<span/>").click(function(){
					var href = Js.use(this.parentNode).attr("href");
					that.activeHeader.removeClass();
					that.activeTab.setClass(that.setting.hidden).fadeOut("normal", function(){
						Js.use(this).remove();
					});
					Js.use(href).remove();
					Js.use(this.parentNode.parentNode).remove();
					
					that.revert();
				}).css("paddingLeft", "10px").text("x").appendTo(a[0]);
			}
			
			if (!!set) {
				this.activateTab("#" + id);
			}
		}
		return this;
	}
});