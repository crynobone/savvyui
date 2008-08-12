Js.tool.include("cookie", {
	get: function(name) {
		var a = name + "=";
		var i = 0;
		while(i < document.cookie.length) {
			var j = i + a.length;
			
			if(document.cookie.substring(i, j) == a) {
				return (function(j) {
					var sl = document.cookie.indexOf(";", j);
					
					if(sl == -1) {
						sl = document.cookie.length;
					}
					return unescape(document.cookie.substring(j, sl));
				})(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			
			if(i == 0) {
				break;
			}
		}
		return false;
	},
	set: function(name, val, expire, path, domain, secure) {
		document.cookie = name + "=" + escape(val) + (!!expire && SUI.fn.typeOf(expire) === "date" ? "; expires=" + expire.toGMTString() : "") + (!!path ? "; path=" + path : "") + (!!domain ? "; domain=" + domain : "") + (!!secure ? "; secure" : "");
	},
	remove: function(name, path, domain) {
		if(this.get(name)) {
			document.cookie = name + "=" + (!!path ? "; path=" + path : "") + (!!domain ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";	
		}
	}
});
