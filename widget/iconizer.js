/**
 * Iconizer widget for Savvy.UI
 * @version 0.0.2
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.iconizer = function(option) {
	this.setting = Js.config.widget.iconizer;
	this.option = Jrun.pickStrict(option, {}, "object");
	
	return this;
};
Js.widget.iconizer.prototype = {
	init: function() {
		var that = this;
		
		this.setting = Js.append(this.option, this.setting);
		
		jQuery("*[class*=icon]").each(function(index, value) {
			var node = jQuery(value);
			
			var klas = object.attr("className");
			var klass = klas.split(/ /);
			for(var i = 0; i < klass.length; i++) {
				if(klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g)) {
					var append = (RegExp.$1 == "-append" ? true : false);
					var pos = (!!Jrun.inArray(RegExp.$2, ["left", "right"]) ? "left" : RegExp.$2);
					var icon = RegExp.$3;
					
					if(!!append) {
						var obj = jQuery("<span/>").css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo(object);
						if(pos == "left") {
							obj.css({
								"background": "url('" + that.setting.folder + icon + "." + that.setting.filetype + "') no-repeat left",
								"marginRight": "3px"
							});
						} else {
							obj.css({
								"background": "url('" + that.setting.folder + icon + "." + that.setting.filetype + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					} else {
						if(pos == "left") {
							object.css({
								"background": "url('" + that.setting.folder + icon + "." + that.setting.filetype + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						} else {
							object.css({
								"background": "url('" + that.setting.folder + icon + "." + that.setting.filetype + "') no-repeat right center",
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