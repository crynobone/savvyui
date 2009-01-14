/**
 * @version 0.0.2 
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.util.smartInput = Js.base.create({
	node: null,
	__construct: function(node) 
	{
		if (Jrun.isset(node)) {
			this.init(node);
		}
	},
	init: function(node)
	{
		var node = Jrun.pick(node, this.node);
		this.node = jQuery(node);
		
		this.activate();
	},
	activate: function() 
	{	
		this.node.bind("blur", function() {
			var node = jQuery(this);
			if (Jrun.trim(node.val()) === "") {
				node.val(node.attr("title").toString());
			}
		}).bind("focus", function() {
			var node = jQuery(this);
			if (node.attr("title") == node.val()) {
				node.val("");
			}
		}).val(this.node.attr("title").toString());
	},
	deactivate: function()
	{
		this.node.unbind("blur", function() {
			var node = jQuery(this);
			if (Jrun.trim(node.val()) === "") {
				node.val(node.attr("title").toString());
			}
		}).unbind("focus", function() {
			var node = jQuery(this);
			if (node.attr("title") == node.val()) {
				node.val("");
			}
		});
	}
});