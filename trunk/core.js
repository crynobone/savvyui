Js.parse = { 
	html: {
		to: function(value) {
			var value = new String(value);
			value = Jrun.htmlEntities(value);
			value = encodeURIComponent(value);
			
			return value;
		},
		from: function(value) {
			var value = new String(value);
			value = decodeURIComponent(value);
			value = Jrun.htmlEntityDecode(value);
			
			return value;
		}
	},
	// Convert back bbml string to normal string
	bbml: function(value) {
		return new String(value).replace(/\[lt\]/g, "<").replace(/\[gt\]/g, ">").replace(/\[n\]/g, "&").replace(/\&quot\;/g, "\"").replace(/\&rsquo\;/g, "\'").replace(/\[br\]/g, "\n").replace(/\[break\]/g, "<br />");
	},
	response: {
		init: function(reply) {
			var data = eval("(" + reply + ")");
			if(!!data.SUIXHR) {
				Js.parse.response.notice(data);
				Js.parse.response.href(data);
				Js.parse.response.update(data);
			}
		},
		status: function() {
			var r = this.object.status;
			
			try {
				var local = (!r && location.protocol == 'file:');
				var range = (r >= 200 && r < 300);
				var unmodified = (r == 304);
				var safari = (jQuery.browser.safari && typeof(r) == "undefined");
				return  (local || range || unmodified || safari);
			} catch(e) { }
			return false;
		},
		notice: function(data) {
			var note = Jrun.pick(data.notice);
			
			if(Jrun.isset(note) && note !== "") {
				window.alert(note);
			}
		},
		href: function(data) {
			var href = Jrun.pick(data.href);
			
			if(Jrun.isset(href) && href !== "") {
				Jrun.href(href);
			}
		},
		update: function(data) {
			var args = Jrun.pick(data.text);
			var id = Jrun.pick(data.id);
			var object = Jrun.pick(data.exec, data.callback);
			
			if(!!args) {
				if(!!id && typeof(id) === "string") {
					jQuery("#" + id).html(Js.parse.bbml(args));
				} else if(jQuery.isFunction(object)) {
					object(args);
				}
			}
		}	
	}
};

Js.test = {
	isString: function(value) {
		return (typeof(value) == "string" && isNaN(value));
	},
	isInteger: function(value) {
		return !isNaN(value);
	},
	isNumber: function(value) {
		return this.isInteger(value);
	},
	isEmail: function(value) {
		return (value.match(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/));
	},
	isLength: function(datas, value) {
		var data = datas.split(/\-/);
		var length = Jrun.toNumber(data[1]);
		var rdata = null;
		
		if(data[0] === "max") {
			rdata = (value <= length ? true : false);
		} else if(data[0] === "min") {
			rdata = (value >= length ? true : false);
		} else if(data[0] === "exact") {
			rdata = (value == length ? true : false);
		} else { 
			rdata = true;
		}
		
		return rdata;
	},
	isURL: function(value) {
		return (value.match(/^https?:\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/));
	},
	isIpAddress: function(value) {
		return (value.match(/^\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]$/));
	}
};