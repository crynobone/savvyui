/**
 * @projectDescription Checkbox Ticker for Savvy.UI
 * @memberOf Js.util
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.util.ticker = Js.create({
	element: null,
	node: null,
	initiate: function(selector) {
		if (Jrun.isset(selector)) {
			this.init(selector);
		}
	},
	init: function(selector) {
		this.element = Jrun.pick(selector, null);
		
		if (Jrun.isset(this.element)) {
			this.node = Js.use(this.element);
		}
		
		return this;
	},
	tick: function() {
		// loop all object
		this.node.each(function(index, value) {
			// set checked to true
			value.checked = true;
		});
	},
	untick: function() {
		// loops all object
		this.node.each(function(index, value) { 
			// set checked to false
			value.checked = false;
		});
	},
	invert: function() {
		// loops all object
		this.node.each(function(index, value) {
			// reverse checkbox selection
			if (value.checked == true) {
				value.checked = false; // uncheck
			}
			else {
				value.checked = true; // checked
			}
		});
	}
});