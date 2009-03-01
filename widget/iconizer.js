/**
 * @projectDescription Iconizer widget for Savvy.UI
 * @version 0.0.3
 * @memberOf Js.widget
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

/**
 * @alias Js.widget.iconizer
 * @constructor
 * @param {Object} option
 */
Js.widget.iconizer = Js.create({
	appName: "iconizer",
	setting: null,
	initiate: function(option) {
		if (Jrun.isset(option)) {
			this.init(option);
		}
	},
	/**
	 * @method
	 * @param {Object} option
	 */
	setup: function(option) {
		var option = Jrun.pickStrict(option, {}, "object");
		this.setting = Js.append(option, this.setting);
	},
	/**
	 * @method
	 * @param {Object} option
	 */
	init: function(option) {
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget[this.appName]);
		
		Js.use("*[class*=icon]").each(function(index, value) {
			var node = Js.use(value);
			
			var klas = node.attr("className");
			var klass = klas.split(/ /);
			
			for (var i = 0; i < klass.length; i++) {
				if (klass[i].match(/^icon(\-append)?\-(left|right)\:(\w*)/g)) {
					var append = (RegExp.$1 == "-append" ? true : false);
					var icon = RegExp.$3;
					var pos = Jrun.pickGrep(RegExp.$2, "left", /^(left|right)$/i);
					var bg = that.setting.folder + icon + "." + that.setting.fileType;
					
					if (!!append) {
						var obj = Js.use("<span/>").css({
							"display": "block",
							"cssFloat": pos,
							"width": "16px",
							"height": "16px"
						}).prependTo(node[0]);
						
						if (pos == "left") {
							obj.css({
								"background": "url('" + bg + "') no-repeat left",
								"marginRight": "3px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right",
								"marginLeft": "3px"
							});
						}
					}
					else {
						var obj = node;
						if (pos == "left") {
							obj.css({
								"background": "url('" + bg + "') no-repeat left center",
								"paddingLeft": "17px"
							});
						}
						else {
							obj.css({
								"background": "url('" + bg + "') no-repeat right center",
								"paddingRight": "17px"
							});
						}
					}
				}
			}
		});
	}
});