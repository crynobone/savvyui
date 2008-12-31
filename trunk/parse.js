/**
 * @version 1.0.2
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.parse = {
	html: {
		to: function(data) 
		{
			var data = new String(data);
			data = Jrun.htmlEncode(data);
			data = encodeURIComponent(data);
			
			return data;
		},
		from: function(data) 
		{
			var data = new String(value);
			data = decodeURIComponent(data);
			data = Jrun.htmlDecode(data);
			
			return data;
		}
	},
	/**
	 * @deprecated
	 * @param {String} data
	 * @return {String}
	 */
	bbml: function(data) 
	{
		return new String(data)
			.replace(/\[lt\]/g, "<")
			.replace(/\[gt\]/g, ">")
			.replace(/\[n\]/g, "&")
			.replace(/\&quot\;/g, "\"")
			.replace(/\&rsquo\;/g, "\'")
			.replace(/\[br\]/g, "\n")
			.replace(/\[break\]/g, "<br />");
	},
	xhr: {
		init: function(reply) 
		{
			var data = eval("(" + reply + ")");
			
			Js.debug.log("XHR: " + data);
			
			if (!!data.SUIXHR) 
			{
				Js.parse.xhr.notice(data);
				Js.parse.xhr.href(data);
				Js.parse.xhr.update(data);
			}
		},
		notice: function(data) 
		{
			var note = Jrun.pickStrict(data.notice, "string");
			
			if (Jrun.isset(note) && note !== "") 
			{
				window.alert(note);
				
				if (!!console) 
				{
					console.log(note);
				}
			}
		},
		href: function(data) 
		{
			var href = Jrun.pickGrep(data.href, /^https?:\/\//g);
			var xhref = Jrun.pickGrep(data.xhref, /^https?:\/\//g);
			
			if (Jrun.isset(xhref) && xhref !== "") 
			{
				Jrun.href(xhref, "_blank");
			} 
			else if (Jrun.isset(href) && href !== "") 
			{
				Jrun.href(href);
			}
		},
		update: function(data) 
		{
			var args = Jrun.pickStrict(data.text, "string");
			var id = Jrun.pickStrict(data.id, "string");
			var selector = Jrun.pickStrict(selector, "string");
			var object = Jrun.pickStrict(data.exec, data.callback, null);
			
			if (!!args) 
			{
				if(!!selector) 
				{
					jQuery(selector).html(args);
				} 
				else if (!!id) 
				{
					jQuery("#" + id).html(args);
				} 
				else if (Jrun.isset(object)) 
				{
					// eval the function without making a callback
					var callback = eval(object);
					// execute the function
					callback(args);
				}
			}
		}
	}
};