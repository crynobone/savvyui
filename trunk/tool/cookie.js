Js.tool.include("cookie", {
	get: function(name) {
		var cookie = name + "=";
		var index = 0;
		while(index < document.cookie.length) {
			var cookies = index + cookie.length;
			
			if(document.cookie.substring(index, cookies) == cookie) {
				return (function(cookies) {
					var value = document.cookie.indexOf(";", cookies);
					
					if(value == -1) {
						value = document.cookie.length;
					}
					return unescape(document.cookie.substring(cookies, value));
				})(cookies);
			}
			index = document.cookie.indexOf(" ", index) + 1;
			
			if(index == 0) {
				break;
			}
		}
		return false;
	},
	set: function(name, value, expire, path, domain, secure) {
		document.cookie = name + "=" + escape(value) + (!!expire && SUI.fn.typeOf(expire) === "date" ? "; expires=" + expire.toGMTString() : "") + (!!path ? "; path=" + path : "") + (!!domain ? "; domain=" + domain : "") + (!!secure ? "; secure" : "");
	},
	remove: function(name, path, domain) {
		if(this.get(name)) {
			document.cookie = name + "=" + (!!path ? "; path=" + path : "") + (!!domain ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";	
		}
	}
});
