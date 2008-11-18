/*
 * Savvy.UI JavaScript Library Extension
 * Name: Calendar
 * Type: Widget
 * Version: 0.7 (alpha-release)
 * Last Updated: 20th June 2008
 * Author: Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) for Codenitive http://codenitive.com
 ***************************************************
 * Copyright (c) 2007 Mior Muhammad Zaki Mior Khairuddin (Cryno Bone) http://savvyui.com
 * Licensed under the MIT License
 ***************************************************
 * History:
 *	Calendar object based from The Strange Zen of JavaScript's How to build a simple calendar with JavaScript:
 *	<http://jszen.blogspot.com/2007/03/how-to-build-simple-calendar-with.html>
*/

Js.widget.calendar = function(js) {
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
	this.node = {
		content: null,
		option: null
	};
	
	this.drag = null;
	this.range = null;
	this.onupdate = null;
	
	this.mindate = null;
	this.maxdate = null;
	
	this.Dates = new Date();
	this.date = "";
	this.day = null;
	this.month = null;
	this.year = null;
	
	if (js && typeof(js) === "object") {
		this.init(js);
	}
	
	return this;
};

Js.widget.calendar.prototype = {
	init: function(js) {
		this.element = Jrun.prepare(js.object, js.element);
		var regexp = new RegExp(/^(\d{2}|\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})$/);
		this.renderTo = Jrun.pick(js.renderTo, this.renderTo);
		
		if(!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) {
			this.renderTo = jQuery("<div/>").appendTo("body");
		} else if(typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = jQuery(this.renderTo).eq(0);
		}
		
		js.range = Jrun.pick(js.range, this.range, [null, null]);
		this.field = Jrun.pick(js.field, this.field, "value");
		this.type = Jrun.pick(js.type, this.type, "single");
		
		if(!!js.mindate && regexp.test(js.mindate)) {
			this.mindate = Jrun.pick(js.mindate, null);
		}
		
		if(!!js.maxdate && regexp.test(js.maxdate)) {
			this.maxdate = Jrun.pick(js.maxdate, null);
		}
		
		if(!!js.value && regexp.test(js.value)) {
			var tdate = js.value.split("-");
			js.month = tdate[1];
			js.year = tdate[0];
			js.day = tdate[2];
		} else if(!!js.value && js.value === "today") {
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this.Dates.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this.Dates.getFullYear() : js.year);
		this.day = Jrun.pick(js.day, this.day);
		
		this.date = [this.year, (this.month + 1), Jrun.pick(this.day, 1)].join("-");
		this.onupdate = Jrun.pick(js.onUpdate, null);
		this.navigation = Jrun.pick(js.navigate, true);
		
		if(this.navigation == true) {
			if(!js.range[0] || js.range[0].toLowerCase() == "now") {
				js.range[0] = this.Dates.getFullYear();
			} else if(Js.test.isInteger(js.range[0]) && (js.range[0] > 1000 && js.range[0] < 9999)) {
				js.range[0] = js.range[0];
			} else if(js.range[0].charAt(0) == "-") {
				js.range[0] = (this.Dates.getFullYear() + Jrun.toNumber(js.range[0]));
			} else if(js.range[0].charAt(0) == "+") {
				js.range[0] = (this.Dates.getFullYear() + Jrun.toNumber(js.range[0]));
			}
			
			if(!js.range[1] || js.range[1].toLowerCase() == "now") {
				js.range[1] = this.Dates.getFullYear();
			} else if(Js.test.isInteger(js.range[1]) && (js.range[1] > 1000 && js.range[1] < 9999)) {
				js.range[1] = s_.range[1];
			} else if(js.range[1].charAt(0) == "-") {
				js.range[1] = (this.Dates.getFullYear() + (Jrun.toNumber(js.range[1]) + 0));
			} else if(js.range[1].charAt(0) == "+") {
				js.range[1] = (this.Dates.getFullYear() + Jrun.toNumber(js.range[1]));
			}
			
			if(js.range[0] < js.range[1]) {
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.maxYear(js.range[0]), this.minYear(js.range[1])];
		}
		
		this.drag = Jrun.pick(js.draggable, false);
		this.renderTo.html("");
		this.callback();
		
		return this;
	},
	minYear: function(year) {
		var data = year;
		if(this.mindate) {
			var minDate = this.mindate.split("-");
			var newYear = Jrun.toNumber(minDate[0]);
			
			if(newYear > data) { 
				data = newYear;
			}
		}
		return data;	
	},
	maxYear: function(year) {
		var data = year;
		if(this.maxdate) {
			var maxDate = this.maxdate.split("-");
			var newYear = Jrun.toNumber(maxDate[0]);
			
			if(newYear < data) {
				data = newYear;
			}
		}
		return data;
	},
	prevMonth: function() {
		this.day = null;
		this.Dates = new Date(this.year, (this.month - 1));
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) {
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, (this.month + 1));
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	prevYear: function() {
		this.day = null;
		this.Dates = new Date((this.year - 1), this.month);
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) {
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date((this.year + 1), this.month);
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextMonth: function() {
		this.day = null;
		this.Dates = new Date(this.year, (this.month + 1));
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()) {
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, (this.month - 1));
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	nextYear: function() {
		this.day = null;
		this.Dates = new Date((this.year + 1), this.month);
		this.month = this.Dates.getMonth();
		this.year = this.Dates.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if(this.validation()){
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date((this.year - 1), this.month);
			this.month = this.Dates.getMonth();
			this.year = this.Dates.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		return this;
	},
	customMonth: function(data) {
		this.day = null;
		this.Dates = new Date(this.year, data);
		var tempMonth = this.Dates.getMonth();
		var tempYear = this.Dates.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if(this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("");
			this.callback();
		}
		return this;
	},
	customYear: function(data) {
		this.day = null;
		this.Dates = new Date(data, this.month);
		var tempMonth = this.Dates.getMonth();
		var tempYear = this.Dates.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if(this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.html("");
			this.callback();
		} else {
			this.Dates = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.html("");
			this.callback();
		}
		return this;
	},
	today: function() {
		this.Dates = new Date();
		this.year = this.Dates.getFullYear();
		this.month = this.Dates.getMonth();
		this.day = this.Dates.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		this.renderTo.html("");
		this.callback();
	},
	validation: function() {
		var data = false;
		var minDate = Jrun.isset(this.mindate);
		var maxDate = Jrun.isset(this.maxdate);
		
		if(minDate && maxDate && this.compare(this.mindate, this.date) && this.compare(this.date, this.maxdate)) {
			data = true;
		} else if(minDate && this.compare(this.mindate, this.date)) {
			data = true;
		} else if(maxDate && this.compare(this.date, this.maxdate)) {
			data = true;
		} else if(!minDate && !maxDate) {
			data = true;
		}
		
		return data;
	},
	dayOfMonth: function(month, year) {
		var month = Jrun.pick(month, this.month);
		var year = Jrun.pick(year, this.year);
		
		if(month == 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			var monthLength = 29;
		}
		
		return Jrun.pick(monthLength, this.daysinmonth[month]);
	},
	compare: function(first, second) {
		var firsts = first.split("-");
		var seconds = second.split("-");
		
		var firstDate = new Date(firsts[0], (Jrun.toNumber(firsts[1]) - 1));
		firstDate.setDate(firsts[2]);
		
		var secondDate = new Date(seconds[0], (Jrun.toNumber(seconds[1]) - 1));
		secondDate.setDate(seconds[2]);
		
		return (secondDate >= firstDate ? true : false);
	},
	updateValue: function(year, month, day) {
		var field = jQuery("#" + this.element + "_" + year + month + day).eq(0);
		var calendar = jQuery("#" + this.element + "-" + this.field).eq(0);
		
		var months = (month < 10 ? "0" + month : month);
		var days = (day < 10 ? "0" + day : day);
		
		if(this.type == "single") {
			if(!field.hasClass("calendar-day-selected")) {
				if (Jrun.isset(this.lastdate) && Jrun.finds(this.element + "_" + this.lastdate)) {
					var lastdate = jQuery("#" + this.element + "_" + this.lastdate).removeClass().addClass("calendar-day");
				}
				
				field.removeClass().addClass("calendar-day-selected");
				this.value = [year, months, days].join("-");
				
				calendar.val(this.value);
				this.lastdate = [year, month, day].join("");
			} else {
				field.removeClass().addClass("calendar-day");
				calendar.val("");
			}
		} else if (this.type == "multiple") {
			var value = calendar.val();
			var values = value.split("|");
			
			if(Jrun.inArray(values, [year, months, days].join("-"))){
				values.splice(values.indexOf([year, months, days].join("-")), 1);
				value = values.join("|");
				
				field.removeClass().addClass("calendar-day");
				this.value = value;
				calendar.val(this.value);
			} else {
				field.removeClass().addClass("calendar-day-selected");
				values[values.length] = [year, months, days].join("-");
				this.value = values.join("|");
				calendar.val(this.value);
			}
		}
		
		var fn = this.onupdate;
		if(fn != null && typeof(fn) == "function") {
			Jrun.callback(this, fn);
		}
		
		return this;
	},
	callback: function() {
		var cal = this.renderTo;
		var that = this;
		var first_day = new Date(this.year, this.month, 1);
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.dayOfMonth();
		cal.html("");
		
		var wrapper = this.object = jQuery("<div/>").attr({
			"id": [this.element, "calendar"].join("-"), 
			"class": "calendar-panel"
		}).css("display", "block").appendTo(cal);
		
		var header = jQuery("<div/>").appendTo(wrapper);
		var content = jQuery("<div/>").appendTo(wrapper);
		var footer = jQuery("<div/>").appendTo(wrapper);
		
		var prevbtn = jQuery("<span/>").appendTo(header);
		var nextbtn = jQuery("<span/>").appendTo(header);
		var title = jQuery("<span/>").appendTo(header);
		
		this.node.content = jQuery("<div/>").addClass("calendar-content").appendTo(content);
		this.node.option = jQuery("<div/>").addClass("calendar-option").appendTo(content);
		
		var table = jQuery("<table cellpadding='0' cellspacing='0'></table>").addClass("calendar-body").appendTo(this.node.content);
		var tbody = jQuery("<tbody/>").appendTo(table);
		
		var trheader = jQuery("<tr/>").addClass("calendar-header").appendTo(tbody);
		
		for(var i = 0; i <= 6; i++) {
			jQuery("<td/>").addClass("calendar-header-day").text(this.days[i]).appendTo(trheader);
		}
		
		var day = 1;
		
		for(var i = 0; i < 6; i++) {
			var weeks = jQuery("<tr/>").addClass("calendar-week").appendTo(tbody);
			
			for(var j = 0; j <= 6; j++) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = jQuery("<td/>").addClass("calendar-" + (this.validation() ? "day" : "invalid")).appendTo(weeks);
				
				if(day <= monthLength && (i > 0 || j >= start_day)) {
					days.attr("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if(this.validation()) {
						days.click(function() {
							
							var i = jQuery(this).attr("id").split("_");
							var count = (i.length - 1);
							var ym = that.year + "" + that.month;
							tday = i[count].substr((ym.length), i[count].length);
							that.updateValue(that.year, (that.month + 1), Jrun.toNumber(tday));  
						});
					}
					
					if(day == this.day) {
						days.removeClass().addClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + Jrun.toNumber(this.day);
					} 
					
					days.css("cursor", "pointer");
					
					days.html(day.toString());
					day++;
				} else {
					days.html("&nbsp;").removeClass().addClass("calendar-invalid");
				}
			}
			
			if(day > monthLength) {
				break;
			}
		}
		
		
		if(this.navigation == true) {
			prevbtn.html("&laquo;").click(function() {
				that.prevMonth();					  
			}).removeClass().addClass("prev-month");
			
			nextbtn.html("&raquo;").click(function() {
				that.nextMonth();
			}).removeClass().addClass("next-month");
			
			jQuery("<p/>").text("Select a specific combination of month and year").appendTo(this.node.option);
			
			var selmonth = jQuery("<select name='month'></select>").change(function() {
				that.customMonth(this.value);
			}).appendTo(this.node.option);
			
			for(var i = 0; i < 12; i++) {
				if(this.month == i) {
					jQuery("<option value='" + i + "' selected='selected'></option>").text(this.months[i]).appendTo(selmonth);
				} else {
					jQuery("<option value='" + i + "'></option>").text(this.months[i]).appendTo(selmonth);
				}
			}
			
			var selyear = jQuery("<select name='year'></select>").text(" ").change(function() {
				that.customYear(this.value);
			}).appendTo(this.node.option);
			
			for(var i = this.range[0]; i >= this.range[1]; i--) {
				if(this.year == i) {
					jQuery("<option value='" + i + "' selected='selected'></option>").text(i.toString()).appendTo(selyear);
				} else { 
					jQuery("<option value='" + i + "'></option>").text(i.toString()).appendTo(selyear);
				}
			}
			
			//var ps = jQuery("<p/>").text("Select ").appendTo();
			jQuery("<input type='button' value='Today' name='today' />").click(function() {
				that.today();													
			}).addClass("select-today").appendTo(this.node.option);
			
			title.removeClass().addClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
			this.object.data("toggle", 1);
			//Js.hash.set(this.element, "toggle", 1);
			
			title.css("cursor", "pointer").click(function() {
				var i = that.object.data("toggle");
				
				if(i === 1) {
					that.node.content.hide("normal");
					that.node.option.show("normal");
					that.object.data("toggle", 0);
				} else {
					that.node.option.hide("normal");
					that.node.content.show("normal");
					that.object.data("toggle", 1);
				}
			});
		} else {
			title.removeClass().addClass("this-month").html(this.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (Jrun.isset(this.field)) {
			var input = jQuery("<input id='" + [this.element, this.field].join("-") + "' name='" + this.field + "' type='" + this.fieldtype + "' />").appendTo(this.node.content);
			
			if (Jrun.isset(this.day)) {
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastdate = [this.year, (this.month + 1), Jrun.toNumber(this.day)].join("");
			}
		}
		return this;
	}
};