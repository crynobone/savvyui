/**
 * Checkbox Ticker for Savvy.UI
 * @extends Js.util
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.util.ticker = function(node) {
	// Define Object's properties
	this.element = null;
	this.node = null;
	
	// start __constructor()
	if (!!node && Jrun.trim(node) !== "") {
		this.init(node);
	}
	
	return this;
};
Js.util.ticker.prototype = {
	/**
	 * Initialize the HTML Element
	 * @param {Object} node
	 * @return {Object}
	 */
	init: function(node) {
		this.element = Jrun.pick(node, null);
		
		if (Jrun.isset(this.element)) { 
			this.node = jQuery(this.element);
		}
		
		return this;
	},
	/**
	 * checked all checkbox
	 * @return {void}
	 */
	check: function() {
		// loop all object
		this.node.each(function(index, value) {
			// set checked to true
			value.checked = true;
		});
	},
	/**
	 * uncheck all checkbox
	 * @return {void}
	 */
	uncheck: function() {
		// loops all object
		this.node.each(function(index, value) { 
			// set checked to false
			value.checked = false;
		});
	},
	/**
	 * invert checkbox selection
	 * @return {void}
	 */ 
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
};
