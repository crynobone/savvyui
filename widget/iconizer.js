/**
 * @projectDescription Iconizer widget for Savvy.UI
 * @version 0.0.2
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.iconizer = function(option) 
{
	this.setting = Js.config.widget.iconizer;
	
	if(Jrun.isset(option))
	{
		this.init(option);
	}
	
	return this;
};
Js.widget.iconizer.prototype = {
	init: function(option) 
	{
		var that = this;
		
		this.setting = Js.append(Js.append(option, {}), this.setting);
		
		jQuery("*[class*=icon]").each(function(index, value) {
			var node = jQuery(value);
			
			var klas = object.attr("className");
			var klass = klas.split(/ /);
			
			for(var i = 0; i < klass.length; i++) 
			{
				if(klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g)) 
				{
					var append = (RegExp.$1 == "-append" ? true : false);
					var pos = Jrun.pickGrep(RegExp.$1, "left", /^(left|right)$/i);
					var icon = RegExp.$3;
					var bg = that.setting.folder + icon + "." + that.setting.filetype;
					
					if(!!append) 
					{
						var obj = jQuery("<span/>").css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo(object);
						
						if(pos == "left") 
						{
							obj.css({
								"background": "url('" + bg + "') no-repeat left",
								"marginRight": "3px"
							});
						} 
						else 
						{
							obj.css({
								"background": "url('" + bg + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					} 
					else 
					{
						if(pos == "left") 
						{
							object.css({
								"background": "url('" + bg + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						} 
						else 
						{
							object.css({
								"background": "url('" + bg + "') no-repeat right center",
								"paddingRight": "17px"
							});
						}
					}
				}
			}
		});
	}
};

Js.config.widget.iconizer = {
	filetype: "png",
	folder: "icons/"
};