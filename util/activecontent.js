/**
 * @projectDescription Create Active Hyperlink for Savvy.UI
 * @memberOf Js.util
 * @version 0.1.2
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.util.activeContent = Js.create({
	appName: "activeContent",
	last: null,
	interval: null,
	repeat: false,
	init: null,
	element: null,
	option: null,
	fnBeforeStart: null,
	fnSuccess: null,
	initiate: function(js) {
		var js = Jrun.pickStrict(js, {}, "object");
		this.element = Jrun.pick(js.element, null);
		this.fnBeforeStart = Jrun.pick(js.beforeStart, this.fnBeforeStart);
		this.fbSuccess = Jrun.pick(js.success, this.fnSuccess);
		
		if(Jrun.isset(this.element)) {
			this._selector();
			this._check();
		} 
		else {
			var that = this;
			this.interval = window.setInterval(function() {
				that._check();
			}, 100);
		}
	},
	destroy: function() 
	{
		if(Jrun.isset(this.interval)) {
			clearInterval(this.interval);
			this.interval == null;
		}
		
		this.element = null;
		return null;
	},
	_selector: function() {
		var that = this;
		
		Js.use(this.element).bind("click", function() {
			var href = Js.use(this).attr("href");
			var anchors = (Jrun.isset(href) ? href : this.href);
			
			if (anchors.match(/^\#/)) {
				var ahref = ["", anchors.substr(1)];
			} 
			else { 
				var ahref = anchors.split(/\#/);
			}
			
			if(Jrun.isfunction(that.fnBeforeStart)) {
				that.fnBeforeStart();
			}
			
			if(Jrun.isset(ahref[1])) {
				that.repeat = (ahref[1] === that.last);
				
				that.last = ahref[1];
				var data = ahref[1].split(/\//);
				that.init(data);
				
				if(Jrun.isfunction(that.fnSuccess)) {
					that.fnSuccess();
				}
			}
		});
	},
	_check: function() {
		if (location.hash != this.last && location.hash !== "#") {
			this.last = location.hash;
			
			if (Jrun.isfunction(this.fnBeforeStart)) {
				this.fnBeforeStart();
			}
			
			var data = location.hash.substr(1).split(/\//);
			this.init(data);
			
			if (Jrun.isfunction(this.fnSuccess)) {
				this.fnSuccess();
			}
		}
	}
});
