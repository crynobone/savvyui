/**
 * @projectDescription Message Widget for Savvy.UI
 * @memberOf Js.widget
 * @version 0.0.6
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * Global Js.widget.message<br>
 * Enable user to display message on top of the display with customize CSS
 * 
 * @alias Js.widget.message
 */

Js.widget.message = Js.base.create({
	node: null,
	setting: null,
	__construct: function(option)
	{
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.message);
		
		if(Jrun.isnull(this.node))
		{
			this.init();
		}
	},
	add: function(js)
	{
		var that = this;
		
		if(Jrun.isnull(this.node)) 
		{
			this.init();
		}
		
		var text = Jrun.pick(js.text, "");
		var type = Jrun.pickGrep(js.type, "note", /^(note|error|success)$/);
		var closable = Jrun.pickStrict(js.closable, true, "boolean");
		
		(function() {
			var div = jQuery("<div/>").attr({
				className: "widgetmessage-box"
			}).css("margin", "2px 0px").appendTo(that.node).hide();
			
			if(!!closable) 
			{
				var span = jQuery("<span/>").attr({
					className: "widgetmessage-close"
				}).text("x").appendTo(div);
			}
			
			var p = jQuery("<p/>").html(text).appendTo(div);
			
			var t = setTimeout(function() {
				div.hide("normal", function() {
					span.remove();
					p.remove();						
				});
			}, (this.setting.seconds * 1000));
			
			if(!!closable) {
				span.bind("click", function() {
					clearTimeout(t);
					t = null;
					
					div.hide("normal", function() {
						span.remove();
						p.remove();					  
					});
				});
			}
			div.setClass(type);
			div.show("slow");
		})();
	},
	init: function()
	{
		var that = this;
		
		this.node = jQuery("#" + this.setting.identifier);
		if(this.node.length < 1)
		{
			this.node = jQuery("<div/>").attr({
				id: this.setting.identifier
			}).appendTo("body");
		}
		
		var _whenScroll = function() 
		{
			var y = Js.util.dimension.page.scrolls.y();
			that.node.css("top", y + "px");
		};
		
		var _currentScroll = window.onscroll;
		window.onscroll = function() {
			if(Jrun.isfunction(_currentScroll)) {
				_currentScroll();
			}
			_whenScroll();	
		};
		_whenScroll();
	},
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting);
	}
});