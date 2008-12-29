/**
 * 
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 * @extends Js.base
 */

Js.util.activeContent = Js.base.create({
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	beforeStart: null,
	success: null,
	__construct: function(js) {
		var js = Jrun.pickStrict(js, {}, "object");
		this.element = Jrun.pick(js.element, null);
		this.beforeStart = Jrun.pick(js.beforeStart, this.beforeStart);
		this.success = Jrun.pick(js.success, this.success);
		
		if(Jrun.isset(this.element)) {
			this.selector();
			this.check();
		} else {
			var that = this;
			this.interval = window.setInterval(function() {
				that.check();
			}, 100);
		}
	},
	__destruct: function() {
		if(Jrun.isset(this.interval)) {
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.element = null;
		this.__destruct();
		return null;
	},
	selector: function() {
		var that = this;
		
		jQuery(this.element).bind("click", function() {
			var href = jQuery(this).attr("href");
			var anchors = (Jrun.isset(href) ? href : this.href);
			
			if(anchors.match(/^\#/)) {
				var ahref = ["", anchors.substr(1)];
			} else { 
				var ahref = anchors.split(/\#/);
			}
			
			if(Jrun.isfunction(this.beforeStart)) {
				this.beforeStart();
			}
			
			if(Jrun.isset(ahref[1])) {
				that.repeat = (ahref[1] === that.last);
				
				that.last = ahref[1];
				var data = ahref[1].split(/\//);
				that.init(data);
				
				if(Jrun.isfunction(this.success)) {
					this.success();
				}
			}
		});
	},
	check: function() {
		if(location.hash != this.last && location.hash !== "#") {
			this.last = location.hash;
			
			if(Jrun.isfunction(this.beforeStart)) {
				this.beforeStart();
			}
			
			var data = location.hash.substr(1).split(/\//);
			this.init(data);
			
			if(Jrun.isfunction(this.success)) {
				this.success();
			}
		}
	}
});
