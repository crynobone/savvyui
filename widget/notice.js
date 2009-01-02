/**
 * @version 0.0.3
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.notice = Js.widget.activity.extend({
	callback: null,
	node: null,
	setting: null,
	__construct: function(selector, option)
	{
		this.setup(option);
		this.setting = Js.append(this.setting, Js.config.widget.notice);
		this.node = this._super.construct(selector, {
			boxWidth: 550,
			boxHeight: 0,
			opacity: 0.9
		});
		this.node.init();
		this.node.box = jQuery("<div/>").css({
			"position": "absolute",
			"width": "550px"
		}).appendTo(this._super.node);
	},
	closeNotice: function() 
	{
		var that = this;
		if(Jrun.isfunction(this.callback)) 
		{
			this.callback();
			this.callback = null;
		}
		this.node.deactivate(function() {
			that.node.box.html("");
		});
	},
	_domAddNotice: function(note, status)
	{
		var status = Jrun.pickGrep(status, "note", /^(note|success|error)$/i);
		var that = this;
		
		this.node.box.html("");
		this.node.activate();
		
		var title = Js.lang.widget.notice.title[status];
		var message = "";
		var opt = false;
		
		if(Jrun.typeOf(note) != "object") 
		{
			title = note;
		} 
		else 
		{
			title = Jrun.pick(note.title, "");
			message = Jrun.pick(note.message, "");
			var opt = Jrun.pick(note.sticky, false);
		}
		
		this.node.box.setClass(this.setting['css' + Jrun.toProperCase(status)]);
		jQuery("<h3/>").text(title).appendTo(this.node.box);
		
		if(message != "") 
		{
			var p = jQuery("<p/>").html("" + message).appendTo(this.node.box);
		}
		
		var span = jQuery("<em/>").text(Js.lang.widget.notice.timer).appendTo(this.node.box);
		
		this.node.node.one("click", function() {
			that.closeNotice();
		});
		
		if(opt == false) {
			setTimeout(function() { 
				that.closeNotice();
			}, (this.setting.seconds * 1000));
		}
	},
	success: function(note, callback) 
	{
		this.callback = Jrun.pick(callback, null);
		this._domAddNotice(note, 'success');
	},
	note: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this._domAddNotice(note, 'note');
	},
	error: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this._domAddNotice(note, 'error');
	}
});