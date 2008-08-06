/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Widget.Calendar
 * Type: Widget
 * Version: 0.7 (alpha-release)
 * Last Updated: 20th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core
 * History:
 *	Calendar object based from The Strange Zen of JavaScript's How to build a simple calendar with JavaScript:
 *	<http://jszen.blogspot.com/2007/03/how-to-build-simple-calendar-with.html>
*/

SUI.Widget.include("Calendar", function(js) {
	this.days = ["S", "M", "T", "W", "T", "F", "S"];	
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	this.shortmonths = ["Jan", "Feb", "Mac", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	this.daysinmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	this.field = null;
	this.value = "";
	this.lastdate = null;
	this.fieldtype = "hidden";
	this.type = null;
	this.navigation = null;
	
	this.object	= null;
	this.element = null;
	this.renderTo = null;
	this.calnode = null;
	this.optnode = null;
	this.drag = null;
	this.range = null;
	this.onupdate = null;
	
	this.mindate = null;
	this.maxdate = null;
	
	this._DATE_ = new Date();
	this.date = "";
	this.day = null;
	this.month = null;
	this.year = null;
	
	if (js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		this.element = SUI.fn.prepare(js.object, js.element);
		var regexp = new RegExp(/^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
		this.renderTo = SUI.fn.pick(js.renderTo, this.renderTo);
		
		if (!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) {
			this.renderTo = SUI("body").first().add("div");
		} else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = SUI(this.renderTo).first();
		}
		
		js.range = SUI.fn.pick(js.range, this.range, [null, null]);
		this.field = SUI.fn.pick(js.field, this.field, "value");
		this.type = SUI.fn.pick(js.type, this.type, "single");
		
		if (!!js.mindate && regexp.test(js.mindate)) {
			this.mindate = SUI.fn.pick(js.mindate, null);
		}
		
		if (!!js.maxdate && regexp.test(js.maxdate)) {
			this.maxdate = SUI.fn.pick(js.maxdate, null);
		}
		
		if (!!js.value && regexp.test(js.value)) {
			var tdate = js.value.split("-");
			js.month = tdate[1];
			js.year = tdate[0];
			js.day = tdate[2];
		} else if (!!js.value && js.value === "today") {
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this._DATE_.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this._DATE_.getFullYear() : js.year);
		this.day = SUI.fn.pick(js.day, this.day);
		
		this.date = [this.year, (this.month + 1), SUI.fn.pick(this.day, 1)].join("-");
		this.onupdate = SUI.fn.pick(js.onUpdate, null);
		this.navigation = SUI.fn.pick(js.navigate, true);
		
		if (this.navigation == true) {
			if (!js.range[0] || js.range[0].toLowerCase() == "now") {
				js.range[0] = this._DATE_.getFullYear();
			} else if (SUI.Test.isInteger(js.range[0]) && (js.range[0] > 1000 && js.range[0] < 9999)) {
				js.range[0] = js.range[0];
			} else if (js.range[0].charAt(0) == "-") {
				js.range[0] = (this._DATE_.getFullYear() + SUI.fn.toNumber(js.range[0]));
			} else if (js.range[0].charAt(0) == "+") {
				js.range[0] = (this._DATE_.getFullYear() + SUI.fn.toNumber(js.range[0]));
			}
			
			if (!js.range[1] || js.range[1].toLowerCase() == "now") {
				js.range[1] = this._DATE_.getFullYear();
			} else if (SUI.Test.isInteger(js.range[1]) && (js.range[1] > 1000 && js.range[1] < 9999)) {
				js.range[1] = s_.range[1];
			} else if (js.range[1].charAt(0) == "-") {
				js.range[1] = (this._DATE_.getFullYear() + (SUI.fn.toNumber(js.range[1]) + 0));
			} else if (js.range[1].charAt(0) == "+") {
				js.range[1] = (this._DATE_.getFullYear() + SUI.fn.toNumber(js.range[1]));
			}
			
			if (js.range[0] < js.range[1]) {
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.__MAXYEAR__(js.range[0]), this.__MINYEAR__(js.range[1])];
		}
		
		this.drag = SUI.fn.pick(js.draggable, false);
		this.renderTo.html("");
		this.__CALLBACK__();
		
		return this;
	},
	__MINYEAR__: function(y) {
		var ret = y;
		if (this.mindate) {
			var md = this.mindate.split("-");
			var ny = SUI.fn.toNumber(md[0]);
			
			if(ny > ret) { 
				ret = ny;
			}
		}
		return ret;	
	},
	__MAXYEAR__: function(y) {
		var ret = y;
		if (this.maxdate) {
			var md = this.maxdate.split("-");
			var ny = SUI.fn.toNumber(md[0]);
			
			if(ny < ret) {
				ret = ny;
			}
		}
		return ret;
	},
	__PREVMONTH__: function() {
		this.day = null;
		this._DATE_ = new Date(this.year, (this.month - 1));
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()) {
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, (this.month + 1));
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	__PREVYEAR__: function() {
		this.day = null;
		this._DATE_ = new Date((this.year - 1), this.month);
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()) {
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date((this.year + 1), this.month);
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	__NEXTMONTH__: function() {
		this.day = null;
		this._DATE_ = new Date(this.year, (this.month + 1));
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()) {
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, (this.month - 1));
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	__NEXTYEAR__: function() {
		this.day = null;
		this._DATE_ = new Date((this.year + 1), this.month);
		this.month = this._DATE_.getMonth();
		this.year = this._DATE_.getFullYear();
		this.date = [this.year, (this.month + 1), this.__DOM__()].join("-");
		
		if (this.__VALIDATE__()){
			this.renderTo.html("Regenerating calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date((this.year - 1), this.month);
			this.month = this._DATE_.getMonth();
			this.year = this._DATE_.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	__CUSTOMMONTH__: function(data) {
		this.day = null;
		this._DATE_ = new Date(this.year, data);
		var tmpmonth = this._DATE_.getMonth();
		var tmpyear = this._DATE_.getFullYear();
		this.date = [tmpyear, (tmpmonth + 1), this.__DOM__(tmpmonth, tmpyear)].join("-");
		
		if (this.__VALIDATE__()) {
			this.year = tmpyear;
			this.month = tmpmonth;
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		}
		return this;
	},
	__CUSTOMYEAR__: function(data) {
		this.day = null;
		this._DATE_ = new Date(data, this.month);
		var tmpmonth = this._DATE_.getMonth();
		var tmpyear = this._DATE_.getFullYear();
		this.date = [tmpyear, (tmpmonth + 1), this.__DOM__(tmpmonth, tmpyear)].join("-");
		
		if (this.__VALIDATE__()) {
			this.year = tmpyear;
			this.month = tmpmonth;
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		} else {
			this._DATE_ = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("Regenerating Calendar...");
			this.__CALLBACK__();
		}
		return this;
	},
	__TODAY__: function() {
		this._DATE_ = new Date();
		this.year = this._DATE_.getFullYear();
		this.month = this._DATE_.getMonth();
		this.day = this._DATE_.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		this.renderTo.html("Regenerating Calendar...");
		this.__CALLBACK__();
	},
	__VALIDATE__: function() {
		var ret = false;
		var mi = SUI.fn.isset(this.mindate);
		var ma = SUI.fn.isset(this.maxdate);
		
		if (mi && ma && this.Compare(this.mindate, this.date) && this.Compare(this.date, this.maxdate)) {
			ret = true;
		} else if (mi && this.Compare(this.mindate, this.date)) {
			ret = true;
		} else if (ma && this.Compare(this.date, this.maxdate)) {
			ret = true;
		} else if (!mi && !ma) {
			ret = true;
		}
		
		return ret;
	},
	__DOM__: function(m, y) {
		var m = SUI.fn.pick(m, this.month);
		var y = SUI.fn.pick(y, this.year);
		
		if (m == 1 && (y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
			var monthLength = 29;
		}
		
		return SUI.fn.pick(monthLength, this.daysinmonth[m]);
	},
	Compare: function(f, s) {
		var fD = f.split("-");
		var sD = s.split("-");
		
		var fDO = new Date(fD[0], (SUI.fn.toNumber(fD[1]) - 1));
		fDO.setDate(fD[2]);
		
		var sDO = new Date(sD[0], (SUI.fn.toNumber(sD[1]) - 1));
		sDO.setDate(sD[2]);
		
		return (sDO >= fDO ? true : false);
	},
	__UPDATE__: function(Y, m, d) {
		var f = SUI("#" + this.element + "_" + Y + m + d).first();
		var calf = SUI("#" + this.element + "_" + this.field);
		var mi = (m < 10 ? "0" + m : m);
		var di = (d < 10 ? "0" + d : d);
		
		if (this.type == "single") {
			if (!f.hasClass("calendar-day-selected")) {
				if (SUI.fn.isset(this.lastdate) && SUI.fn.finds(this.element + "_" + this.lastdate)) {
					var lastdate = SUI("#" + this.element + "_" + this.lastdate).set("class", "calendar-day");
				}
				
				f.setClass("calendar-day-selected");
				this.value = Y + "-" + mi + "-" + di;
				
				calf.val(this.value);
				this.lastdate = Y + "" + m + "" + d;
			} else {
				f.setClass("calendar-day");
				calf.val("");
			}
		} else if (this.type == "multiple") {
			var v = calf.val();
			var vs = v.split("|");
			
			if (SUI.fn.inArray(vs, Y + "-" + mi + "-" + di)){
				vs.splice(vs.indexOf(Y + "-" + mi + "-" + di), 1);
				v = vs.join("|");
				
				f.setClass("calendar-day");
				this.value = v;
				calf.val(v);
			} else {
				f.setClass("calendar-day-selected");
				
				if(vs.length > 0 && vs[0] != "") {
					vs[vs.length] = (Y + "-" + mi + "-" + di);
				} else {
					vs[0] = Y + "-" + mi + "-" + di;
				}
				
				this.value = vs.join("|");
				calf.val(this.value);
			}
		}
		
		var fn = this.onupdate;
		if(fn != null && typeof(fn) == "function") {
			SUI.fn.callback(this, fn);
		}
		
		return this;
	},
	__CALLBACK__: function() {
		var cal = this.renderTo;
		var that = this;
		var first_day = new Date(this.year, this.month, 1);
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.__DOM__();
		cal.html("");
		
		var mtable = this.object = cal.add("table", {
			"id": [this.element, "calendar"].join("-"), 
			"class": "calendar-panel", 
			"cellSpacing": 0, 
			"cellPadding": 0
		}).css("display", "block");
		
		var table = mtable.add("tbody");
		
		var tr1 = table.add("tr");
		var tr2 = table.add("tr");
		var tr3 = table.add("tr");
		
		var th1 = tr1.add("td", {"class": "sui-panel-hl"}).html("&nbsp;");
		var th2 = tr1.add("td", {"class": "sui-panel-header"});
		var th3 = tr1.add("td", {"class": "sui-panel-hr"}).html("&nbsp;");
		
		var prevbtn = th2.add("span");
		var nextbtn = th2.add("span");
		var title = th2.add("span");
		
		var tc1 = tr2.add("td", {"class": "sui-panel-cl"}).html("&nbsp;");
		var tc2 = tr2.add("td", {"class": "sui-panel-container"}).html("&nbsp;");
		var tc3 = tr2.add("td", {"class": "sui-panel-cr"}).html("&nbsp;");
		
		this.calnode = tc2.add("div", {"class": "calendar-content"});
		var con = this.calnode.add("table", {
			"class": "calendar-body", 
			"cellPadding": 0, 
			"cellSpacing": 0
		}).add("tbody");
		
		var contrh = con.add("tr", {"class": "calendar-header"});
		
		for (var i = 0; i <= 6; i++) {
			contrh.add("td").setClass("calendar-header-day").text(this.days[i]);
		}
		
		var day = 1;
		
		for (var i = 0; i < 6; i++) {
			var weeks = con.add("tr", {"class": "calendar-week"});
			
			for (var j = 0; j <= 6; j++) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = weeks.add("td", {"class": "calendar-" + (this.__VALIDATE__() ? "day" : "invalid")});
				
				if (day <= monthLength && (i > 0 || j >= start_day)) {
					days.set("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if (this.__VALIDATE__()) {
						days.clicks(function() {
							var i = SUI(this).get("id").split("_");
							var ym = that.year + "" + that.month;
							tday = i[1].substring((ym.length), i[1].length);
							that.__UPDATE__(that.year, (that.month + 1), SUI.fn.toNumber(tday));  
						});
					}
					
					if (day == this.day) {
						days.setClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + SUI.fn.toNumber(this.day);
					} 
					
					days.css("cursor", "pointer");
					
					days.html(day.toString());
					day++;
				} else {
					days.html("&nbsp;").setClass("calendar-invalid");
				}
			}
			
			if (day > monthLength) {
				break;
			}
		}
		
		var tf1 = tr3.add("td", {"class": "sui-panel-fl"}).html("&nbsp;");
		var tf2 = tr3.add("td", {"class": "sui-panel-footer"}).html("&nbsp;");
		var tf3 = tr3.add("td", {"class": "sui-panel-fr"}).html("&nbsp;");
		
		if (this.navigation == true) {
			prevbtn.setClass("prev-month").html("&nbsp;").clicks(function() {
				that.__PREVMONTH__();															  
			});
			
			nextbtn.setClass("next-month").html("&nbsp;").clicks(function() {
				that.__NEXTMONTH__();
			});
			var divmon = this.optnode = tc2.add("div", {"class": "calendar-content-selector"});
			
			divmon.add("p").text("Select a specific combination of month and year");
			
			var selmonth = divmon.add("select", {"name": "month"}).changes(function() {
				that.__CUSTOMMONTH__(this.value);							
			});
			
			for (var i = 0; i < 12; i++) {
				if(this.month == i) {
					selmonth.add("option", {"value": i, "selected": "selected"}).text(this.months[i]);
				} else {
					selmonth.add("option", {"value": i}).text(this.months[i]);
				}
			}
			
			var selyear = divmon.text(" ").add("select", {"name": "year"}).changes(function() {
				that.__CUSTOMYEAR__(this.value);									
			});
			
			for(var i = this.range[0]; i >= this.range[1]; i--) {
				if(this.year == i) {
					selyear.add("option", {"value": i, "selected": "selected"}).text(i.toString());
				} else { 
					selyear.add("option", {"value": i}).text(i.toString());
				}
			}
			
			var ps = divmon.add("p").text("Select ");
			ps.add("input", {
				"type": "button", 
				"value": "Today", 
				"name": "today"
			}).clicks(function() {
				that.__TODAY__();													
			});
			
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
			SUI.Hash.Set(this.element, "toggle", 1);
			
			title.css("cursor", "pointer").clicks(function() {
				var i = SUI.Hash.Get(that.element, "toggle");
				
				if(i === 1) {
					that.calnode.css("display", "none");
					that.optnode.css("display", "block");
					
					SUI.Hash.Set(that.element, "toggle", 0);
				} else {
					that.optnode.css("display", "none");
					that.calnode.css("display", "block");
					
					SUI.Hash.Set(that.element, "toggle", 1);
				}
			});
		} else {
			title.setClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (SUI.fn.isset(this.field)) {
			var input = tf2.add("input", {
				"id": [this.element, this.field].join("-"),
				"name": this.field,
				"type": this.fieldtype
			});
			
			if (SUI.fn.isset(this.day)) {
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastdate = [this.year, (this.month + 1), SUI.fn.toNumber(this.day)].join("");
			}
		}
		return this;
	}
};

SUI.Util.include("Calendar", SUI.Widget.Calendar);
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Utils.DropMenu
 * Type: Utility/Plug-In
 * Version: 0.5 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
*/

SUI.Widget.include("DropMenu", function(sel) {
	this.object = null;
	this.node = null;
	this.lastnode = null;
	this.content = null;
	this.child = null;
	this.status = 0;
	
	if (!!sel && typeof(sel) === "string") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	Initialize: function(sel) {
		if (!!sel && SUI.fn.trim(sel) !== "") {
			var that = this;
			this.object = SUI(sel);
			var mList = SUI(sel + " ul > li > a");
			
			mList.each(function() {
				SUI(this).hovers(function() {
					that.node = this.parentNode;
					that.__SHOW__(sel, this.parentNode);
				}, function() {
					that.status = 0;
					setTimeout((function() { 
						that.__HIDE__(sel);
					}), 5);
				}).done();
			});
		}
		return this;
	},
	__SHOW__: function(sel, node) {
		var that = this;
		var sUL = SUI("> ul", node);
		if (sUL.count() > 0) {
			this.status = 1;
			var t = SUI.Dimension.Node.Offset(node);
			
			if (SUI.fn.finds([sel,"menucontainer"].join("_")) && SUI.fn.isset(this.child)) {
				if(SUI.fn.isset(this.lastnode)) {
					SUI(this.lastnode).insert(this.content);
					this.lastnode = null;
				}
				
				SUI.DOM.Remove(this.child.first().fetch());
				this.child = null;
			}
			
			this.child = SUI("body").insertion("div").css("visibility", "hidden").alpha(0);
			this.child.setup({
				"id": [sel, "menucontainer"].join("_"),
				"class": "menu"
			});
			
			this.content = sUL.first().fetch();
			
			var text = "<ul>" + this.content.innerHTML + "</ul>";
			
			if (this.child.html() != text) {
				this.child.insert(this.content);
				var h = this.child.fetch().offsetHeight;
				
				this.child.css({
					"left":t[3] + "px",
					"top":(t[1] + t[2] - 4) + "px",
					"height":"0px"
				}).fx({
					method:"fade",
					transaction:[0, 97],
					ease:1.3,
					step:40,
					shutter:40
				}).syncFx({
					method:"resizeHeight",
					transaction:[0, h],
					ease:0.9,
					step:100,
					shutter:20
				});
				
			}
			this.lastnode = node;
			
			this.child.hovers(function() {
				that.status = 1;
				that.node = node;
			}, function() {
				if(SUI.fn.finds([sel, "menucontainer"].join("_"))) {
					that.status = 0;
					setTimeout((function() {
						that.__HIDE__(sel);
					}), 5);
				}
			}).done();
		}
		sUL.done();
	},
	__HIDE__: function(sel) {
		if (this.status == 0) {
			if (SUI.fn.isset([sel, "menucontainer"].join("_")) && SUI.fn.isset(this.child)) {
				if (SUI.fn.isset(this.lastnode)) {
					SUI(this.lastnode).insert(this.content).done();
					this.lastnode = null;
				}
				
				SUI.DOM.Remove(this.child.first().fetch());
				this.child = null;
			}
		}
	}
};

SUI.Util.include("DropMenu", SUI.Widget.DropMenu);
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Widget.Message
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
*/

SUI.Widget.include("Message", {
	node: null,
	Add: function(spec) {
		if(SUI.fn.isnull(this.node)) {
			this.Initialize();
		}
		var that = this;
		var text = SUI.fn.pick(spec.text, "");
		var timeout = SUI.fn.pick(spec.timeout, 5000);
		var type = SUI.fn.pick(spec.type, "note");
		var closable = SUI.fn.pick(spec.closable, true);
		
		timeout = (SUI.Test.isInteger(timeout) ? timeout : 5000);
		
		(function() {
			var div = that.node.add("div", {"class": "sui-messagebox"}).css("margin", "2px 0px").hide();
			
			if(!!closable) {
				var span = div.add("span", {"class": "sui-messagebox-close"}).text("x");
			}
			
			var p = div.add("p").text(text);
			var t = setTimeout(function() {
				div.remove(span.fetch());
				div.remove(p.fetch());
				div.hide("slow");					
			}, timeout);
			
			if(!!closable) {
				span.clicks(function() {
					clearTimeout(t);
					t = null;
					div.remove(span.fetch());
					div.remove(p.fetch());
					div.hide("slow");
				});
			}
			div.appendClass(type);
			div.show("slow");
		})();
	},
	Initialize: function() {
		this.node = SUI("body").first().add("div", {"id": "sui-message"}).show();
	}
});
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Widget.Panel
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Resize
*/

SUI.Widget.include("Panel", function(js) {
	// Declare Object's properties
	this.object = null;
	this.node = null;
	this.header = null;
	this.content = null;
	this.footer = null;
	this.renderTo = null;
	this.element = "";
	this.title = "Untitled Panel";
	this.width = 300;
	this.height = 300;
	this.minWidth = 100;
	this.minHeight = 200;
	this.layout = "sui-panel";
	this.onclose = null;
	this.scrolling = true;
	this.allowClose = true;
	this.allowMinimize = false;
	this.allowResize = false;
	this.css = "";
	
	// Start __constructor()
	if (js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		// Set Object's properties value for usage
		this.width = SUI.fn.pick(js.width, this.width);
		this.height = SUI.fn.pick(js.height, this.height);
		this.layout = SUI.fn.pick(js.layout, this.layout);
		this.title = SUI.fn.pick(js.title, this.title);
		this.renderTo = SUI.fn.pick(js.renderTo, this.renderTo);
		this.allowClose = SUI.fn.pick(js.allowClose, this.allowClose);
		this.allowMinimize = SUI.fn.pick(js.allowMinimize, this.allowMinimize);
		this.allowResize = SUI.fn.pick(js.allowResize, this.allowResize);
		this.scrolling = SUI.fn.pick(js.scrolling, this.scrolling);
		this.css = SUI.fn.pick(js.css, this.css);
		this.onclose = SUI.fn.pick(js.onClose, null);
		
		// set renderTo DOM.Element
		if (!this.renderTo || !this.renderTo.nodeType) {
			this.renderTo = SUI("body").first();
		} else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) { 
			this.renderTo = SUI(this.renderTo).first();
		}
		// define TABLE id attribute
		var el = this.element = js.element;
		
		// render TABLE DOM.Element, hide the TABLE
		this.object = this.renderTo.add("table", {
			"id": el + "_win", 
			"cellSpacing": "0", 
			"cellPadding": "0",	
			"class": this.layout
		}).hide();
		
		this.renderTo.done();
		
		// set TABLE width
		if (SUI.fn.isset(this.width)) {
			this.object.css("width", this.width + "px");
		}
		
		// set TABLE height
		if (SUI.fn.isset(this.height)) {
			this.object.css("height", this.height + "px");
		}
		
		// render TBODY DOM.Element 
		var tbody = this.object.add("tbody");
		
		// render header TR DOM.Element
		var tr1 = tbody.add("tr");
		// render content TR DOM.Element
		var tr2 = tbody.add("tr");
		// render footer TR DOM.Element
		var tr3 = tbody.add("tr");
		
		tbody.done();
		
		// render header TD-left DOM.Element
		var th1 = tr1.add("td", {"class": this.layout + "-hl"}).html("&nbsp;").set("width", "7px");
		// render header TD-content DOM.Element
		var th2 = tr1.add("td", {"class": this.layout + "-header"}).css({
			"height": "22px", 
			"width": (this.width - 15) + "px"
		});
		// render header TD-right DOM.Element
		var th3 = tr1.add("td", {"class": this.layout + "-hr"}).html("&nbsp;").set("width", "8px");
		// render header container DOM.Element
		var ext = th2.add("div", {"class": this.layout + "-ext"}).css({
			"cssFloat": "right", 
			"overflow": "hidden", 
			"width": "28px", 
			"height": "20px", 
			"textAlign": "right"
		});
		// render header title DOM.Element
		var title = th2.add("div", {"class": this.layout + "-title"}).text(this.title).css({
			"overflow": "hidden", 
			"height": "20px"
		});
		// render Close-Button DOM.Element 
		var tclose = ext.add("span").html("&nbsp;").set("width", "14px").css("display", "none");
		// render Minimize-Button DOM.Element
		var tmin = ext.add("span").html("&nbsp;").set("width", "14px").css("display", "none");
		
		// Enable Minimize-Button option
		if (!!this.allowMinimize) {
			tmin.setClass(this.layout + "-min").css({
				"display": "block", 
				"cursor": "pointer"
			});
		} else {
			tmin.setClass(this.layout + "-disabled");
		}
		
		// Enable Close-Button option
		if (!!this.allowClose) {
			tclose.setClass(this.layout + "-close").css({
				"display": "block",
				"cursor": "pointer"
			}).clicks(function() {
				that.Close();
			});
		} else { 
			tclose.setClass(this.layout + "-disabled");
		}
		
		tmin.done();
		tclose.done();
		title.done();
		ext.done();
		
		// render content TD-left DOM.Element
		var tc1 = tr2.add("td", {"class": this.layout + "-cl"}).html("&nbsp;");
		// render content TD-content DOM.Element
		var tc2 = tr2.add("td", {"class": this.layout + "-container"}).css({
			"padding": "5px", 
			"width": (this.width - 15) + "px"
		}).html("");
		// render content TD-right DOM.Element
		var tc3 = tr2.add("td", {"class": this.layout + "-cr"}).html("&nbsp;");
		
		// render content CONTAINER DOM.Element
		// THIS IS WHERE YOUR CONTAIN SHOULD GO
		this.node = tc2.add("div", {
			"id": el, 
			"class": this.layout + "-content"
		}).css("cssText", this.css);
		
		// set height and scrolling option for content CONTAINER
		if(SUI.fn.isset(this.height) && !!this.scrolling) {
			this.node.css({
				"height": (this.height - (23 + 11)) + "px",
				"overflow": "auto"
			});
		}
		
		// render footer TD-left DOM.Element
		var tf1 = tr3.add("td", {"class": this.layout + "-fl"}).html("&nbsp;");
		// render footer TD-content DOM.Element
		var tf2 = tr3.add("td", {"class": this.layout + "-footer"}).html("&nbsp;").css("width", (this.width - 15) + "px");
		// render footer TD-right DOM.Element
		var tf3 = tr3.add("td", {"class": this.layout + "-fr"}).html("&nbsp;");
		
		// extends DOM.Elements as Object's properties
		this.header = th2;
		this.content = tc2;
		this.footer = tf2;
		
		tr1.done();
		tr2.done();
		tr3.done();
		
		// Enable Resizing option
		if (!!this.allowResize) {
			// enable right (vertical only) resizing
			new SUI.Ext.Resize({
				object: tf2.fetch(),
				objectRoot: that.object.fetch(),
				hmode: false
			});
			// enable bottom (horizontal only) resizing
			new SUI.Ext.Resize({
				object: tc3.fetch(),
				objectRoot: that.object.fetch(),
				vmode: false
			});
			// enable bottom-right resizing
			new SUI.Ext.Resize({
				object: tf3.fetch(),
				objectRoot: that.object.fetch()
			});
			// change button to look more like resize
			tc3.css("cursor", "e-resize");
			tf2.css("cursor", "n-resize");
			tf3.css("cursor", "se-resize");
			
			// onResize function help maintain TABLE child width and height size
			that.object.fetch().onResize = function(x, y) {
				that.width = that.width + x;
				that.height = that.height + y;
				SUI(that).css("width", that.width + "px");
				SUI(that).css("height", that.height + "px");
				that.header.css("width", (that.width - 15) + "px");
				that.content.css("width", (that.width - 15) + "px");
				that.footer.css("width", (that.width - 15) + "px");
				that.fixResize();
			};
		}
		// make the TABLE visible
		this.object.show().css("display", "block");
		
		return this;
	},
	Close: function() {
		// callback to close panel
		var fn = this.onclose;
		if (SUI.fn.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		this.object.done();
		return this;
	},
	fixResize: function() {
		if(SUI.fn.isset(this.height) && !!this.scrolling) {
			this.node.css({
				"height": (this.height - (23 + 11)) + "px", 
				"overflow": "auto"
			});
		}
		
		return this;
	}
};
/*
 * Savvy.UI JavaScript Library Application
 * Name: SUI.Widget.SimpleTab
 * Type: Widget
 * Version: 0.2 (alpha-release)
 * Last Updated: 16th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core
*/

SUI.Widget.include("SimpleTab", function(sel) {
	this.temp = null;
	this.height = null;
	this.toolbar = null;
	this.object = null;
	this.header = null;
	this.element = null;
	this.activeTab = null;
	this.activeHeader = null;
	
	// start __constructor()
	if(SUI.fn.typeOf(sel) === "object" || SUI.fn.typeOf(sel) === "string") {
		this.Initialize(sel);
	}
	
	return this;
}).prototype = {
	Initialize: function(sel) {
		var that = this;
		this.object = SUI(sel);
		this.object.setClass("simpletab-container");
		this.element = this.object.first().get("id");
		
		var child = this.object.has("div.x-simpletab-panel");
		var h = window.location.hash;
		
		if(h.match(/^#(.+)/)) {
			var hashtab = this.object.has(h);
			if(hashtab.count() > 0) {
				this.activeTab = hashtab;
			} else {
				this.activeTab = SUI(child.first().fetch());
			}
		} else {
			this.activeTab = SUI(child.first().fetch());
		}
		
		this.__TOOLBAR__(this.element);
		
		child.each(function() {
			that.__HEADER__(this);
			SUI(this).setClass("simpletab-hidden");			
		});
			
		this.activeHeader = SUI("a[href=#" + this.activeTab.get("id") + "]");
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
	},
	makeActive: function(hash) {
		
	},
	addTab: function(spec) {
		var that = this;
		if(!!spec.id && SUI.fn.typeOf(spec.id) === "string") {
			var title = SUI.fn.pick(spec.title, "Untitled");
			var id = spec.id;
			var content = SUI.fn.pick(spec.content, "");
			var closable = SUI.fn.pick(spec.closable, false);
			var set = SUI.fn.pick(spec.activate, false);
			
			var obj = this.object.add("div", {"id": id, "class": "simpletab-hidden"}).html(content);
			var li = this.header.add("li");
			var a = li.add("a", {
				"href": "#" + id,
				"title": title
			});
			a.add("em");
			a.text(title).clicks(function() {
				that.__ACTIVE__(this);
			});
			
			if (!!closable) {
				a.add("span").css("paddingLeft", "10px").text("x").clicks(function() { // clicks to mouseovers
					var href = SUI(this.parentNode).get("href");
					that.activeHeader.setClass("").done();
					that.activeTab.setClass("simpletab-hidden").done();
					that.object.remove(SUI(href).fetch());
					SUI.DOM.Remove(this.parentNode.parentNode);
					
					//that.__REVERT__();
				});
			}
			if(!!set) {
				this.__ACTIVE__(obj);
			}
		}
		return this;
	},
	__TOOLBAR__: function(el) {
		var div = SUI("body").first().add("div", {
			"class": "simpletab-toolbar-container",
			"id": this.element + "toolbar"
		});
		
		SUI.DOM.AddBefore(div.fetch(0), this.object.fetch());
		this.toolbar = div;
		
		this.header = this.toolbar.add("ul", {
			"id": [el, "toolbar"].join("-"),
			"class": "simpletab-toolbar"
		});
		var div2 = div.add("div").css("display", "block");
	},
	__ACTIVE__: function(obj) {
		var that = this;
		this.activeHeader.setClass("");
		this.activeTab.setClass("simpletab-hidden");
		
		this.activeHeader = SUI(obj);
		var href = this.activeHeader.get("href");
		this.activeTab = SUI(href);
		
		this.activeHeader.setClass("current");
		this.activeTab.setClass("simpletab-active");
		window.location.hash = href;
	},
	__REVERT__: function() {
		var activecon = this.header.has("li > a");
		if(activecon.count() > 0) {
			this.__ACTIVE__(activecon.first().fetch());
		}
	},
	__HEADER__: function(obj) {
		var that = this;
		var obj = SUI(obj);
		var title = obj.get("title");
		var closable = obj.hasClass("tab-closable");
		
		var li = this.header.insertion("li");
		
		var a = li.add("a", {
			"href": "#" + obj.get("id"),
			"title": title
		});
		
		a.add("em");
		a.text(title).clicks(function() {
			that.__ACTIVE__(this);
		});
		
		if (!!closable) {
			a.add("span").css("paddingLeft", "10px").text("x").clicks(function() {
				var my = SUI(this.parentNode).clicks(function() { return false; });
				
				var href = my.get("href");
				that.activeHeader.setClass("").done();
				that.activeTab.setClass("simpletab-hidden").done();
				that.object.remove(SUI(href).fetch());
				SUI.DOM.Remove(this.parentNode.parentNode);
				
				that.__REVERT__();
			});
		}
	}
};

// Backward Compatiblity
SUI.Util.include("SimpleTab", SUI.Widget.SimpleTab);
/*
 * Savvy.UI JavaScript Library Widget
 * Name: SUI.Widget.Toggler
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 3rd July 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright: (c) 2007-2008 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed: MIT License
 ***************************************************
 * Require: Base, Core, SUI.Ext.Animator
 */

SUI.Widget.include("Toggler", function(js) {
	this.button = null;
	this.container = null;
	this.content = null;
	
	this.buttonc = null;
	this.containerc = null;
	this.contentc = null;
	
	if(SUI.fn.isset(js) && typeof(js) == "object") {
		this.Initialize(js);
	}
		
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		
		var button = this.button = js.button;
		var container = this.container = js.container;
		var content = this.content = js.content;
		
		if(SUI.fn.isset(button) && SUI.fn.isset(container) && SUI.fn.isset(content)) {
			SUI(button).clicks(function() {
				var dwl = SUI(container).first();
				var stack = SUI(content).first();
				var button = SUI(this).first();
				
				if(!button.getHash("done") || button.getHash("done") == "no") {
					dwl.fx({
						method:"resizeHeight",
						type:"height",
						transaction:[0, stack.fetch().scrollHeight]
					});
					
					button.setHash("done", "yes");
				} else if(button.getHash("done") == "yes") {
					dwl.fx({
						method:"resizeHeight",
						type:"height",
						transaction:[stack.fetch().scrollHeight, 0]
					});
					
					button.setHash("done", "no");
				}
				
				return false;
			});
		}
	}
};

// Backward Compatibility
SUI.Util.include("Toggler", SUI.Widget.Toggler);
/*
 * Savvy.UI JavaScript Library Extension
 * Name: SUI.Widget.WinPanel
 * Type: Widget
 * Version: 0.1 (alpha-release)
 * Last Updated: 18th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * Require: Base, Core, SUI.Widget.Panel, SUI.Ext.Drag, SUI.Ext.Resize
*/

SUI.Widget.include("WinPanel", function(js) {
	// Declare Object's properties
	this.panel = null;
	this.element = null;
	this.zindex = 100;
	this.allowDrag = false;
	this.autoFocus = true;
	this.status = "";
	this.node = null;
	this.object = null;
	this.init = false;
	this.onclose = null;
	
	// Declare constant
	SUI.Widget.WinPanel.nodes;
	SUI.Widget.WinPanel.zindex;
	
	// start __constructor()
	if (js && typeof(js) === "object") {
		this.Initialize(js);
	}
	
	return this;
}).prototype = {
	Initialize: function(js) {
		var that = this;
		
		if (!this.init) {
			this.init = true;
			SUI.Widget.WinPanel.zindex = SUI.fn.pick(SUI.Widget.WinPanel.zindex, 101);
			
			var elem = this.element = js.element + "_win";
			SUI.Widget.WinPanel.nodes = SUI.fn.pick(SUI.Widget.WinPanel.nodes, []);
			SUI.Widget.WinPanel.nodes.push(elem);
			
			this.zindex = SUI.fn.pick(js.zindex, ++SUI.Widget.WinPanel.zindex);
			this.autoFocus = SUI.fn.pick(js.autoFocus, this.autoFocus);
			this.allowDrag = SUI.fn.pick(js.allowDrag, this.allowDrag);
			this.onclose = SUI.fn.pick(js.onClose, this.onclose);
			js.onclose = null;
			
			if(this.allowDrag) { 
				js.scrolling = true;
			}
			
			this.panel = new SUI.Widget.Panel(js);
			this.node = this.panel.node;
			this.object = this.panel.object;
			this.object.hide();
			
			if (!!this.autoFocus) {
				this.object.clicks(function() {
					var m = SUI(this).first();
					m.css("alpha", 100);
					
					if (!m.getStyle("zIndex") || m.getStyle("zIndex") < SUI.Widget.WinPanel.zindex) {
						++SUI.Widget.WinPanel.zindex;
						m.css("zIndex", SUI.Widget.WinPanel.zindex);
					}
					
					for (var i = 0; i < SUI.Widget.WinPanel.nodes.length; i++) {
						if (SUI.Widget.WinPanel.nodes[i] != that.element) 
							SUI("#" + SUI.Widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				});
				
				for (var i = 0; i < SUI.Widget.WinPanel.nodes.length; i++) {
					if (SUI.Widget.WinPanel.nodes[i] != that.element) {
						SUI("#" + SUI.Widget.WinPanel.nodes[i]).css("alpha", 60);
					}
				}
			} else {
				this.object.css("zIndex", this.zindex);
			}
			
			var doc = document.body;
			var hW = SUI.fn.toNumber(doc.offsetWidth);
			var hH = SUI.fn.toNumber(doc.offsetHeight);
			var oW = this.panel.width;
			var oH = this.panel.height;
			var sXY = SUI.Dimension.Page.Scroll.XY();
			var center = SUI.Dimension.Page.Center(oW, oH);
			var xS = center[1];
			var yS = center[0];
			xS = (xS < 0 ? 0 : xS);
			yS = (yS < 0 ? 0 : yS);
			
			if (!!this.allowDrag) {
				try {
					new SUI.Ext.Drag({
						node: that.panel.header.fetch(),
						nodeRoot: that.panel.object.fetch()
					});
					
					that.panel.header.css("cursor", "move");
				} catch(e) {
					SUI.fn.logger("SUI.Widget.WinPanel.Initialize error at DRAG: " + e);
				}
			}
			
			this.object.show();
			this.status = "Loaded";
			
			if(this.autoFocus == true) {
				this.makeActive();
			}
			
			this.object.css({"position": "absolute", "top": yS + "px", "left": xS + "px"});
		}
		return this;
	},
	makeActive: function() {
		++SUI.Widget.WinPanel.zindex;
		this.object.css("zIndex", SUI.Widget.WinPanel.zindex);
	},
	Close: function() {
		var fn = this.onclose;
		if (SUI.fn.isfunction(fn)) {
			fn();
		}
		
		this.object.parent().remove(this.object.fetch());
		
		try {
			this.object = null;
			this.element = null;
			var arrays = SUI.Widget.WinPanel.nodes;
			var deindex = SUI.fn.indexOf(arrays, this.element);
			arrays.splice(deindex, 1);
			SUI.Widget.WinPanel.nodes = arrays;
		} catch(e) { }
		return this;
	}
};

SUI.Ext.include("WinPanel", SUI.Widget.WinPanel);
