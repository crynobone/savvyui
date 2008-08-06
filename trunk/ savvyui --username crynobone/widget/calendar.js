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
