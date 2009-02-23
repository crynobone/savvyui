/**
 * @projectDescription Checkbox Ticker for Savvy.UI
 * @memberOf Js.util
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 */

/**
 * Initiate new Js.util.ticker
 * @alias Js.util.ticker
 * @constructor
 * @param {Object} node
 */
Js.util.ticker = Js.create({
	element: null,
	node: null,
	initiate: function(selector)
	{
		if (Jrun.isset(selector)) {
			this.init(selector);
		}
	},
	/**
	 * Initialize the HTML Element
	 * 
	 * @method
	 * @param {Object} node
	 * @return {Object}
	 */
	init: function(selector) 
	{
		this.element = Jrun.pick(selector, null);
		
		if (Jrun.isset(this.element)) {
			this.node = Js.use(this.element);
		}
		
		return this;
	},
	/**
	 * Tick all checkbox
	 * 
	 * @method
	 */
	check: function() 
	{
		// loop all object
		this.node.each(function(index, value) {
			// set checked to true
			value.checked = true;
		});
	},
	/**
	 * Untick all checkbox
	 * 
	 * @method
	 */
	uncheck: function() 
	{
		// loops all object
		this.node.each(function(index, value) { 
			// set checked to false
			value.checked = false;
		});
	},
	/**
	 * Invert checkbox selection
	 * 
	 * @method
	 */ 
	invert: function() 
	{
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