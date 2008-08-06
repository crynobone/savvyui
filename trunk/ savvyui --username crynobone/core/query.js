/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Dimension
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI, SUI.Attr, SUI.Classes, SUI.CSS, SUI.DOM
 */
 
SUI.namespace.include("Query", {
	is: function(node, is) {
		var is = SUI.fn.trim(is);
		var r = null;
		var status = null;
		var value = false;
		var prev = node.previousSibling;
		var next = node.nextSibling;
		
		if (is.match(/^(enabled|disabled|checked|selected)$/)) {
			status = is;
			is = "input";
			
			if (status === "enabled") {
				value = true;
				status = "disabled";
			}
		}
		
		switch (is) {
			case 'visible':
				return ((SUI.CSS.Get(node, "display") === "none" || SUI.CSS.Get(node, "visibility") === "hidden") || (node.tagName.toLowerCase() === "input" && SUI.Attr.Get(node, "type") === "hidden") ? false : true);
				break;
			case 'hidden':
				return (SUI.CSS.Get(node, "display") === "none" || SUI.CSS.Get(node, "visibility") === "hidden" ? true : false);
				break;
			case 'first-child':
				return (function(prev) {
					if (!!prev) {
						return (!prev || !!SUI.DOM.isFirst(prev) ? true : false);
					} else {
						return true;
					}
				})(prev);
				break;
			case 'last-child':
				return (function(next) {
					if (!!next) { 
						return (!next || !!SUI.DOM.isLast(next) ? true : false);
					} else {
						return true;
					}
				})(next);
				break;
			case 'only-child':
				return (function(node) {
					if (!!node) { 
						return SUI.DOM.isOnlyChild(node);
					} else {
						return true;
					}
				})(node);
				break;
			case 'input':
				return (function(node, r, status, value) {
					r = node.tagName.toLowerCase().match(/^(input|select|textarea)$/);
					if (!!status) {
						r = (SUI.Attr.Get(node, status) !== false ? true : false);
						
						if(!!value) { 
							r = (r ? false : true);
						}
					}
					return r;			 
				})(node, r, status, value);
				break;
			default:
				return (function(node, is) {
					if (is.match(/^(text|password|radio|checkbox|submit|image|reset|button|file|hidden)$/)) {
						return (node.tagName.toLowerCase() === "input" && SUI.Attr.Get(node, "type") === is ? true : false);
					} else { 
						return false;
					}
				})(node, is);
		};
	},
	hasClass: function(node, klasName) {
		return (SUI.Classes.Has(node, klasName) ? true : false);
	},
	hasAttr: function(node, attrs) {
		var at = SUI.Attr.Get(node, attrs[0]);
		
		if(at) {
			switch (attrs[1]) {
				case '=': // Equality
					return (at === attrs[2]);
					break;
				case '~': // Match one of space seperated
					return (at.match(new RegExp('\\b' + attrs[2] + '\\b')));
					break;
				case '|': // Match start with value followed by optional hyphen
					return (at.match(new RegExp('^' + attrs[2] + '-?')));
					break;
				case '^': // Match starts with value
					return (at.indexOf(attrs[2]) === 0);
					break;
				case '$': // Match ends with value - fails with "Warning" in Opera 7
					return (at.lastIndexOf(attrs[2]) === at.length - attrs[2].length);
					break;
				case '*': // Match ends with value
					return (at.indexOf(attrs[2]) > -1);
					break;
				default : // Just test for existence of attribute
					return at;
			}
		} else 
			return false;
	},
	tagParentOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			var t = (tags === "*" && document.all ? document.all : document.getElementsByTagName(tags));
			
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				for(var ii = 0; ii < t.length && t[ii]; ii++) {
					var node = t[ii];
					
					if(node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr) && node === parNode[i].parentNode) {
						context[context.length] = node;
					}
				}
			}
		}
		return context;
	},
	tagNextOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var pn = parNode[i].parentNode;
				
				if(!!pn && pn.nodeType == 1) {
					var t = (tags === "*" && pn.all ? pn.all : pn.getElementsByTagName(tags));
				
					for(var ii = 0; ii < t.length && t[ii]; ii++) {
						var node = t[ii];
						var tnode = SUI.DOM.prev(node);
						
						if(tnode === parNode[i] && node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr)) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	tagSiblingOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var pn = parNode[i].parentNode;
				
				if(!!pn && pn.nodeType == 1) {
					var t = (tags === "*" && pn.all ? pn.all : pn.getElementsByTagName(tags));
				
					for(var ii = 0; ii < t.length && t[ii]; ii++) {
						var node = t[ii];
						
						if(node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr) && node.parentNode === pn) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	tagChildOf: function(tags, parNode, klasName, is, attr) {
		var context = [];
		
		if(parNode.length > 0) {
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var pn = parNode[i];
				
				if(!!pn && pn.nodeType == 1) {
					var t = (tags === "*" && pn.all ? pn.all : pn.getElementsByTagName(tags));
				
					for(var ii = 0; ii < t.length && t[ii]; ii++) {
						var node = t[ii];
						
						if(node.nodeType === 1 && !!SUI.Query.__VALIDATE__(node, klasName, is, attr) && node.parentNode === pn) {
							context[context.length] = node;
						}
					}
				}
			}
		}
		return context;
	},
	__VALIDATE__: function(node, klasName, is, attr) {
		var valid = false;
		var klasName = SUI.fn.pick(klasName, "");
		var is = SUI.fn.pick(is, null);
		var attr = SUI.fn.pick(attr, []);
		
		valid = (klasName === "" || !!SUI.Query.hasClass(node, klasName) ? true : false);
		valid = ((attr.length === 0 || (attr.length === 3 && !!SUI.Query.hasAttr(node, attr))) && !!valid ? true : false); 
		valid = ((!is || (!!is && !!SUI.Query.is(node, is))) && !!valid ? true : false);
		
		return valid;
	},
	create: function(tags, attr) {
		var node = null;
		var tags = SUI.fn.trim(tags);
		
		if(/\#/.test(tags)) {
			var tag = tags.split(/\#/);
			var el = SUI.fn.trim(tag[0]);
			var id = SUI.fn.trim(tag[1]);
			node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', el) : document.createElement(el);
			SUI.Attr.Set(node, "id", id);
		} else {
			node = document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml', tags) : document.createElement(tags);
		}
		
		if (SUI.fn.isset(attr)) { 
			SUI.Attr.Setup(node, attr);
		}
		
		return node;
	},
	tags: function(tags, parNode, klasName, is, attr, type) {
		var context = [];
		var klasName = SUI.fn.trim(SUI.fn.pick(klasName, ""));
		var is = SUI.fn.pick(is, null);
		var attr = SUI.fn.pick(attr, []);
		var tags = SUI.fn.pick(tags, "*");
		
		if(SUI.fn.isset(type) && type > 0) {
			if(type === 4) {
				context = SUI.Query.tagParentOf(tags, parNode, klasName, is, attr);
			} else if (type === 2) {
				context = SUI.Query.tagNextOf(tags, parNode, klasName, is, attr);
			} else if (type === 3) {
				context = SUI.Query.tagSiblingOf(tags, parNode, klasName, is, attr);
			} else if (type === 1) {
				context = SUI.Query.tagChildOf(tags, parNode, klasName, is, attr);
			}
		} else {
			if(!parNode || parNode.length === 0 || !parNode.length) {
				parNode = [document];
			}
			
			for(var i = 0; i < parNode.length && parNode[i]; i++) {
				var t = (tags === "*" && parNode[i].all ? parNode[i].all : parNode[i].getElementsByTagName(tags));
				
				for(var ii = 0; ii < t.length && t[ii]; ii++) {
					var node = t[ii];
					
					if(node.nodeType === 1 && SUI.Query.__VALIDATE__(node, klasName, is, attr)) {
						context[context.length] = node;
					}
				}
			}
		}
		return (context.length > 0 ? context : false);
	},
	id: function(id, parNode, tags, is) {
		var tags = SUI.fn.trim(SUI.fn.pick(tags, "*")).toUpperCase();
		var el = document.getElementById(id);
		var is = (!!is ? this.is(el, is) : true);
			
		if (el && (tags == "*" || tags == el.tagName.toUpperCase()) && !!is) {
			return el;
		} else { 
			return false;
		}
	},
	selector: function(elem, parNode) {
		var context = [];
		
		var init = function(elem, parNode) {
			var context = [];
			
			if (!!parNode && !parNode.length) {
				context = [parNode];
			} else if (!!parNode && parNode.length > 0) { 
				context = parNode;
			}
			
			var type = 0;
			var elm = elem.split(/\s/);
			
			for (var i = 0; i < elm.length; i++){
				if(context.length === 0 && i > 0) {
					context = false;
					break;
				}
				
				var el = SUI.fn.trim(elm[i]);
				
				if (el !== "") {
					var tags = "";
					var id = "";
					var klasName = "";
					var attr = [];
					var is = null;
					
					if (el === ">") {
						type = 1;
					} else if (el === "+") { 
						type = 2;
					} else if (el === "~") {
						type = 3;
					} else if (el === "<") {
						type = 4;
					} else {
						if (el.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)){
							tags = RegExp.$1;
							attr[0] = RegExp.$2;
							attr[1] = RegExp.$3;
							attr[2] = RegExp.$4;
						} else {
							if (el.indexOf(":") > -1) {
								var pr = el.split(":");
								el = pr[0];
								is = pr[1];
							}
							
							if (el.indexOf(".") > -1) {
								var pr = el.split(".");
								tags = pr[0];
								klasName = pr[1];
							} else if (el.indexOf("#") > -1) {
								var pr = el.split("#");
								tags = pr[0];
								id = pr[1];
							} else {
								tags = el;
							}
							
							tags = (tags == "" ? "*" : tags);
						}
						
						if (!!id && id !== "") {
							context = [SUI.Query.id(id, context, tags, is)];
						} else {
							context = SUI.Query.tags(tags, context, klasName, is, attr, type);
						}
						
						if (!context) {
							context = [];
							break;
						} else {
							context = SUI.fn.unique(context);
						}
						
						type = 0;
					}
				}
			}
			return context;
		};
		
		var el = SUI.fn.trim(elem).split(/,/);
		el = SUI.fn.unique(el);
		
		for (var m = 0; m < el.length && !!el[m]; m++) {
			var elm = SUI.fn.trim(el[m]);
			
			if (elm !== "") {
				var node = init(elm, parNode);
				
				if (!!node && node.length > 0) {
					for (var i = 0; i < node.length; i++) {
						if (node[i].nodeType === 1) {
							context[context.length] = node[i];
						}
					}
				}
			}
		}
		return (context.length > 0 ? context : false);
	}
});
