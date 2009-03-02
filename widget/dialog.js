/**
 * @projectDescription Modal Dialog for Savvy.UI
 * @version 0.1.2
 * @memberOf Js.widget
 * @extends Js.widget.panel
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.dialog = Js.widget.panel.extend({
	overlay: null,
	allowOverlay: false,
	_prepSetting: function() {
		this.renderTo = Jrun.pick(this.setting.renderTo, "body:eq(0)");
		this.element = this.setting.element;
		this.allowOverlay = Jrun.pickStrict(this.setting.overlay, this.allowOverlay, "boolean");
	},
	init: function(option) {
		var that = this;
		
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget[this.appName]);
		this._prepSetting();
		
		// set renderTo element
		if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = Js.use(this.renderTo);
		} else if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = Js.use("body").eq(0);
		}
		
		if (this.allowOverlay == true) {
			this.overlay = new Js.widget.activity("#overlay-panel");	
		}
		
		this._load();
		if (this.allowOverlay == true) {
			this.overlay.activate();
		}
		this._dimension();
	},
	closePanel: function() {
		var that = this;
		if (this.allowOverlay == true) {
			this.overlay.deactivate();
		}
		
		// callback to close panel
		this.node.fadeOut("slow", function() {
			if (Jrun.isfunction(that.setting.onClose)) {
				that.setting.onClose.apply(that);
			}
			
			that.node.remove();
		});
		return this;
	},
	_dimension: function() {
		var offset = [
			this.node.width(),
			this.node.height()
		];
		var center = Js.util.dimension.page.middle(offset[0], offset[1]);
		var left = center[1];
		var top = center[0];
		left = (left < 0 ? 0 : left);
		top = (top < 0 ? 0 : top);
		
		this.node.css({
			"position": "absolute", 
			"top": top + "px", 
			"left": left + "px",
			"zIndex": 6000
		});
	}
});
