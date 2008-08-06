/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.DOM
 * Type: Core
 * Last Updated: 25th July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: SUI
 */
 
SUI.namespace.include("DOM", {
	Add: function(parent, child) {
		if (!SUI.fn.isset(child)) {
			var child = parent;
			var parent = document.body;
		}
		
		try {
			parent.appendChild(child);
			return parent;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.Add failed: " + e);
			return false;
		}
	},
	AddText: function(parent, text) {
		if (SUI.fn.isset(parent)) {
			return this.Add(parent, document.createTextNode(text));
		} else {
			SUI.fn.logger("SUI.DOM.AddText failed: " + e);
			return false;
		}
	},
	AddBefore: function(args) {
		var args = SUI.fn.toArray(arguments);
		var parent = null;
		var child = null;
		var reference = null;
		
		if (args.length == 3 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1]) && SUI.fn.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = args[2];
		} else if (args.length == 2 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1])) {
			parent = args[1].parentNode;
			child = args[0];
			reference = args[1];
		} else {
			SUI.fn.logger("SUI.DOM.AddBefore failed: Reference Object is null");
			return false;
		}
		
		try {
			parent.insertBefore(child, reference);
			return true;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.AddBefore failed: " + parent + " " + child + " " + reference + e);
			return false;
		}
	},
	AddAfter: function(args) {
		var args = arguments;
		var parent = null;
		var child = null;
		var reference = null;
		
		if(args.length == 3 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1]) && SUI.fn.isset(args[2])) {
			parent = args[0];
			child = args[1];
			reference = this.next(args[2]);
		} else {
			parent = this.parent(args[1]);
			child = args[0];
			reference = this.next(args[1]);
		}
		
		try {
			if (SUI.fn.isset(reference)) {
				return this.AddBefore(parent, child, reference);
			} else {
				return this.Add(parent, child);
			}
		} catch(e) {
			SUI.fn.logger("SUI.DOM.AddAfter failed: " + e);
			return false;
		}
	},
	Remove : function(params) {
		var args = arguments;
		var parNode = null;
		var chiNode = null;
		
		if (args.length === 2 && SUI.fn.isset(args[0]) && SUI.fn.isset(args[1])){
			parNode = args[0];
			chiNode = args[1];
		} else if (args.length == 1 && SUI.fn.isset(args[0])){
			parNode = args[0].parentNode;
			chiNode = args[0];
		}
		
		try {
			parNode.removeChild(chiNode);
			return parNode;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.Remove failed: " + e);
			return false;
		}
	},
	Empty: function(node) {
		while(node.firstChild) {
			this.Remove(node);
		}
		
		return node;
	},
	Change: function(args) {
		var args = arguments;
		var parNode = null;
		var chiNode = null;
		var refNode = null;
		
		if (args.length == 3 && !!args[0] && !!args[1] && !!args[2]) {
			parNode = args[0];
			chiNode = args[1];
			refNode = args[2];
		} else if (args.length == 2 && !!args[0] && !!args[1]) {
			parNode = args[1].parentNode;
			chiNode = args[0];
			refNode = args[1];
		}
		
		try {
			parNode.replaceChild(chiNode, refNode);
			return true;
		} catch(e) {
			SUI.fn.logger("SUI.DOM.Change failed: " + e);
			return false;
		}
	},
	Clone: function(node, bool) {
		return node.cloneNode(bool);
	},
	prev: function(node) {
		do {
		   node = node.previousSibling;
		} while(node && node.nodeType != 1);
		
		return node;
	},
	next: function(node) {
		do {
			node = node.nextSibling;
		} while(node && node.nodeType != 1);
		
		return node;
	},
	first: function(node) {
		node = node.firstChild;
		return (node && node.nodeType != 1 ? this.next(node) : node);
	},
	last: function(node) {
		node = node.lastChild;
		return (node && node.nodeType != 1 ? this.prev(node) : node);
	},
	isFirst: function(node) {
		var n = this.next(this.parent(node).firstChild);
		return n === node;
	},
	isLast: function(node) {
		var n = this.prev(this.parent(node).lastChild);
		return n === node;
	},
	isParentOf: function(node, parNode) {
		return this.parent(node) === parNode;
	},
	isOnlyChild: function(node) {
		var f = this.first(node);
		var l = this.last(node);
		
		return f === l;
	},
	isElement: function(node) {
		return (!!node && node.nodeType == 1 ? true : false);
	},
	parent: function(node) {
		return node.parentNode;
	}
});
