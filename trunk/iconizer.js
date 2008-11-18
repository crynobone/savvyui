Js.widget.iconizer = function() {
	this.folder = "icons/";
	this.ext = "png";
	
	return this;
};
Js.widget.iconizer.prototype = {
	init: function() {
		var that = this;
		
		jQuery("*[class*=icon]").each(function() {
			var object = jQuery(this);
			
			var klas = object.attr("className");
			var klass = klas.split(/ /);
			for(var i = 0; i < klass.length; i++) {
				if(klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g)) {
					var append = (RegExp.$1 == "-append" ? true : false);
					var pos = (jQuery.inArray(RegExp.$2, ["left", "right"]) < 0 ? "left" : RegExp.$2);
					var icon = RegExp.$3;
					
					if(!!append) {
						var obj = jQuery("<span></span>").css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo(object);
						if(pos == "left") {
							obj.css({
								"background": "url('" + that.folder + icon + "." + that.ext + "') no-repeat left",
								"marginRight": "3px"
							});
						} else {
							obj.css({
								"background": "url('" + that.folder + icon + "." + that.ext + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					} else {
						if(pos == "left") {
							object.css({
								"background": "url('" + that.folder + icon + "." + that.ext + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						} else {
							object.css({
								"background": "url('" + that.folder + icon + "." + that.ext + "') no-repeat right center",
								"paddingRight": "17px"
							});
						}
					}
				}
			}
		});
	}
};