/**
 * @memberOf Js.util
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.util.dimension = {
	// Get scrolled value of a page
	page: {
		scrolls: {
			x: function()
			{
				var doc = document.body;
				var result = 0;
				var offset = window.pageXOffset;
				var el = document.documentElement;
				
				if (typeof(offset) == "number") 
				{
					result = offset;
				}
				else if (doc && doc.scrollLeft) 
				{
					result = doc.scrollLeft;
				}
				else if (el && el.scrollLeft) 
				{
					result = el.scrollLeft;
				}
				
				return result;
			},
			y: function()
			{
				var doc = document.body;
				var result = 0;
				var offset = window.pageYOffset;
				var el = document.documentElement;
				
				if (typeof(offset) == "number") 
				{
					result = offset;
				}
				else if (doc && doc.scrollTop) 
				{
					result = doc.scrollLeft;
				}
				else if (el && el.scrollTop) 
				{
					result = el.scrollLeft;
				}
				
				return result;
			},
			both: function(){
				return [
					Js.util.dimension.page.scrolls.x(), 
					Js.util.dimension.page.scrolls.y()
				];
			}
		},
		middle: function(width, height) 
		{
			var doc = document.body;
			var offset = [Jrun.toNumber(doc.offsetWidth), Jrun.toNumber(doc.offsetHeight)];
			var axis = Js.util.dimension.page.scrolls.both();
			var result = [];
					
			result[0] = Math.round(((offset[0] - width) / 2) + axis[0]);
			result[1] = Math.round((((screen.height - 200) - height) / 2) + axis[1]);
			result[0] = (result[0] < 0 ? 0 : result[0]);
			result[1] = (result[1] < 0 ? 0 : result[1]);	
			result.reverse();
				
			return result;
		}
	},
	node: {
		scrolls: {},
		size: {},
		offset: function(node) 
		{
			var result = [0, 0, 0, 0];
			var loop = false;
			
			if(Jrun.isset(node)) 
			{
				if(node.offsetParent) 
				{
					loop = true;
					rdata[0] = node.offsetWidth;
					rdata[1] = node.offsetHeight;
					
					while(node.offsetParent) 
					{
						result[2] += node.offsetTop;
						result[3] += node.offsetLeft;
						node = node.offsetParent;
					}
				} 
				else 
				{
					if(loop == false) 
					{
						result[0] = Jrun.pick(node.scrollWidth, 0);
						result[1] = Jrun.pick(node.scrollHeight, 0);
						result[2] = Jrun.pick(node.offsetTop, 0);
						result[3] = Jrun.pick(node.offsetLeft, 0);
					}
				}
				return result;
			} 
			else 
			{
				Js.debug.log("Js.util.dimension.node.offset: failed because node does not exist");
			}
		}
	}
};
