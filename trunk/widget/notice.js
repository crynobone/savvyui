/**
 * @version 0.0.3
 * @extends Js.widget
 * @author Mior Muhammad Zaki
 * @license MIT
 */

Js.widget.notice = {
	callback: null,
	node: null,
	href: "",
	setting: {},
	init: function()
	{
		this.setting = Js.append(this.setting, Js.config.widget.notice);
		
		this.node = new Js.widget.activity(this.setting.overlay);
		this.node.init();
		this.node.box = jQuery("<div/>").css({
			"position": "absolute",
			"width": "550px"
		}).appendTo(this.node);
		
		this.node.boxWidth = 550;
		this.node.boxHeight = 0;
		this.node.opacity = 0.9;
		
		return this;
	},
	closeNotice: function() 
	{
		if(Jrun.isfunction(this.callback)) 
		{
			this.callback();
		}
		
		Js.widget.notice.node.deactivate();
	},
	domAddNotice: function(note, status)
	{
		var status = Jrun.pickGrep(status, "note", /^(note|success|error)$/i);
		var that = this;
		
		Js.widget.notice.node.box.html("");
		Js.widget.notice.node.activate();
		
		var title = this.setting.title[status];
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
			this.href = Jrun.pick(note.href, "");
			var opt = Jrun.pick(note.sticky, false);
		}
		
		Js.widget.notice.node.box.setClass(this.setting.css[status]);
		jQuery("<h3/>").text(title).appendTo(Js.widget.notice.node.box);
		
		if(msg != "") 
		{
			var p = jQuery("<p/>").html("" + msg).appendTo(Js.widget.notice.node.box);
		}
		
		var span = jQuery("<em/>").text(this.setting.timer.text).appendTo(Js.widget.notice.node.box);
		
		setTimeout((function() {
			Js.widget.notice.node.click(function() {
				Js.widget.notice.closeNotice();
			});
		}), 1000);
		
		if(opt == false) {
			setTimeout(function() { 
				Js.widget.notice.closeNotice();
			}, (this.setting.timer.seconds * 1000));
		}
	},
	success: function(note, callback) 
	{
		this.callback = Jrun.pick(callback, null);
		this.domAddNotice(note, 'success');
	},
	note: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this.domAddNotice(note, 'note');
	},
	error: function(note, callback) {
		this.callback = Jrun.pick(callback, null);
		this.domAddNotice(note, 'error');
	}
};

Js.config.widget.notice = {
	overlay: "#overlay-notice",
	title: {
		success: "Congratulation",
		note: "Note",
		error: "Error has Occur"
	},
	css: {
		success: "message-success",
		note: "message-note",
		error: "message-error"
	},
	timer: {
		text: "This message will automatically close in 5 seconds",
		seconds: 5
	}
};