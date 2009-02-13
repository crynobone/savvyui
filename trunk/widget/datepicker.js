/**
 * @version 0.7.3 
 * @author Mior Muhammad Zaki crynobone@gmail.com
 * @license MIT
 */

Js.widget.datePicker = Js.base.create({
	field: null,
	value: "",
	lastDate: null,
	type: null,
	node: null,
	element: null,
	renderTo: null,
	content: null,
	option: null,
	setting: null,
	language: null,
	range: null,
	minDate: null,
	maxDate: null,
	dateObject: new Date,
	date: null,
	day: null,
	month: null,
	year: null,
	__construct: function(js)
	{
		if (Jrun.typeOf(js) === "object") {
			this.init(js);
		}
	},
	/**
	 * Setup local configuration for this object
	 * 
	 * @method
	 * @param {Object} [option] Contains local configuration for this object
	 */
	setup: function(option)
	{
		this.setting = Js.append(option, this.setting, ["lang"], true);
		if(Jrun.isset(option.lang)) {
			this.language = Js.append(option.lang, this.language);
		}
	},
	/**
	 * Initiate internal call, prepare all configuration before loading the calendar
	 * 
	 * @method
	 * @see Js.widget.calendar
	 * @param {Object} [js] Contains local configuration for this object
	 */
	init: function(js) 
	{
		var that = this;
		
		this.setup(js.option);
		this.setting = Js.append(this.setting, Js.config.widget.datePicker);
		this.language = Js.append(this.language, Js.language.widget.datePicker);
		
		this.element = Jrun.prep(Jrun.pick(js.element, this.element));
		this.renderTo = Jrun.pick(js.renderTo, this.renderTo);
		
		if(!this.renderTo || (typeof(this.renderTo) !== "string" && !this.renderTo.nodeType)) {
			this.renderTo = Js.use("<div/>").appendTo("body");
		} 
		else if (typeof(this.renderTo) === "string" || this.renderTo.nodeType) {
			this.renderTo = Js.use(this.renderTo).eq(0);
		}
		
		js.range = Jrun.pickStrict(js.range, this.range, [null, null], "array");
		this.field = Jrun.pickStrict(js.field, this.field, "calendar-value", "string");
		this.type = Jrun.pickGrep(js.type, this.type, "single", /^(single|multiple)$/g);
		
		// check if minimum date have been set
		if (!!js.minDate && this.setting.dateFormat.test(js.minDate)) {
			this.minDate = Jrun.pick(js.minDate, null);
		}
		
		// check if maximum date have been set
		if (!!js.maxDate && this.setting.dateFormat.test(js.maxDate)) {
			this.maxDate = Jrun.pick(js.maxDate, null);
		}
		
		if (!!js.value && this.setting.dateFormat.test(js.value)) {
			var todayDate = js.value.match(this.setting.dateFormat);
			js.month = RegExp.$2;
			js.year = RegExp.$1;
			js.day = RegExp.$3;
		} 
		else if (!!js.value && js.value === "today") {
			// get today date
			var tmpdate = new Date();
			js.month = tmpdate.getMonth();
			js.year = tmpdate.getFullYear();
			js.day = tmpdate.getDate();
		}
		
		this.month = ((!js.month || isNaN(js.month) || js.month > 12 || js.month < 0) ? this.dateObject.getMonth() : Math.abs(js.month - 1));
		this.year = ((!js.year || isNaN(js.year) || js.year < 1000) ? this.dateObject.getFullYear() : js.year);
		this.day = Jrun.pickStrict(js.day, this.day, "number");
		
		this.date = [this.year, (this.month + 1), Jrun.pick(this.day, 1)].join("-");
		this.navigation = Jrun.pick(js.navigate, true);
		
		var _getRange = function(data) 
		{
			var result = null;
			var year = that.dateObject.getFullYear();
			
			if (!data || data.toLowerCase() == "now") {
				result = year; 
			}
			else if (data.match(/^(\+|\-)?(\d{1,4})$/)) {
				var plus = RegExp.$1;
				var value = RegExp.$2;
				
				if (plus == "+") {
					result = (year + Jrun.toNumber(value));
				}
				else if (plus == "-") {
					result = (year - Jrun.toNumber(value));
				}
				else {
					result = value;
				}
			}
			
			return result;
		};
		
		if (this.navigation == true) {
			js.range[0] = _getRange(js.range[0]);
			js.range[1] = _getRange(js.range[1]);
			
			if (js.range[0] < js.range[1]) {
				var tmp = js.range[0];
				js.range[0] = js.range[1];
				js.range[1] = tmp;
				delete tmp;
			}
			
			this.range = [this.maxYear(js.range[0]), this.minYear(js.range[1])];
		}
		
		if (Jrun.isfunction(this.setting.beforeStart)) {
			this.setting.beforeStart();
		}
		
		this.renderTo.text("");
		this.callback();
		
		return this;
	},
	minYear: function(year) 
	{
		var data = year;
		
		if (this.minDate) {
			var minDate = this.minDate.split("-");
			var newYear = Jrun.toNumber(minDate[0]);
			
			if (newYear > data) {
				data = newYear;
			}
		}
		
		return data;	
	},
	maxYear: function(year) 
	{
		var data = year;
		
		if (this.maxDate) {
			var maxDate = this.maxDate.split("-");
			var newYear = Jrun.toNumber(maxDate[0]);
			
			if (newYear < data) {
				data = newYear;
			}
		}
		
		return data;
	},
	prevMonth: function() 
	{
		this.day = null;
		this.dateObject = new Date(this.year, (this.month - 1));
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, (this.month + 1));
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	prevYear: function() 
	{
		this.day = null;
		this.dateObject = new Date((this.year - 1), this.month);
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date((this.year + 1), this.month);
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextMonth: function() 
	{
		this.day = null;
		this.dateObject = new Date(this.year, (this.month + 1));
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, (this.month - 1));
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	nextYear: function() 
	{
		this.day = null;
		this.dateObject = new Date((this.year + 1), this.month);
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join("-");
		
		if (this.validation()) {
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date((this.year - 1), this.month);
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), "1"].join("-");
		}
		
		return this;
	},
	customMonth: function(data) 
	{
		this.day = null;
		this.dateObject = new Date(this.year, data);
		var tempMonth = this.dateObject.getMonth();
		var tempYear = this.dateObject.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if (this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.text("");
			this.callback();
		}
		
		return this;
	},
	customYear: function(data) 
	{
		this.day = null;
		this.dateObject = new Date(data, this.month);
		var tempMonth = this.dateObject.getMonth();
		var tempYear = this.dateObject.getFullYear();
		this.date = [tempYear, (tempMonth + 1), this.dayOfMonth(tempMonth, tempYear)].join("-");
		
		if (this.validation()) {
			this.year = tempYear;
			this.month = tempMonth;
			this.renderTo.text("");
			this.callback();
		}
		else {
			this.dateObject = new Date(this.year, this.month);
			this.date = [this.year, (this.month + 1), "1"].join("-");
			this.renderTo.text("");
			this.callback();
		}
		
		return this;
	},
	today: function() 
	{
		this.dateObject = new Date();
		this.year = this.dateObject.getFullYear();
		this.month = this.dateObject.getMonth();
		this.day = this.dateObject.getDate();
		this.date = [this.year, (this.month + 1), this.day].join("-");
		
		this.renderTo.html("");
		this.callback();
	},
	validation: function() 
	{
		var data = false;
		var minDate = Jrun.isset(this.minDate);
		var maxDate = Jrun.isset(this.maxDate);
		
		if (minDate && maxDate && this.compare(minDate, this.date) && this.compare(this.date, maxDate)) {
			data = true;
		} 
		else if (minDate && this.compare(minDate, this.date)) {
			data = true;
		} 
		else if (maxDate && this.compare(this.date, maxDate)) {
			data = true;
		} 
		else if (!minDate && !maxDate) {
			data = true;
		}
		
		return data;
	},
	dayOfMonth: function(month, year) 
	{
		var month = Jrun.pick(month, this.month);
		var year = Jrun.pick(year, this.year);
		
		if (month == 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
			var monthLength = 29;
		}
		
		return Jrun.pickStrict(monthLength, this.setting.daysInMonth[month], "number");
	},
	compare: function(first, second) 
	{
		var firsts = first.split("-");
		var seconds = second.split("-");
		
		var firstDate = new Date(firsts[0], (Jrun.toNumber(firsts[1]) - 1));
		firstDate.setDate(firsts[2]);
		
		var secondDate = new Date(seconds[0], (Jrun.toNumber(seconds[1]) - 1));
		secondDate.setDate(seconds[2]);
		
		return (secondDate >= firstDate ? true : false);
	},
	updateValue: function(year, month, day) 
	{
		var field = Js.use("#" + this.element + "_" + year + month + day).eq(0);
		var calendar = Js.use("#" + this.element + "-" + this.field).eq(0);
		
		var months = (month < 10 ? "0" + month : month);
		var days = (day < 10 ? "0" + day : day);
		
		if(this.type == "single") {
			if (!field.hasClass("calendar-day-selected")) {
				if (Jrun.isset(this.lastDate) && Js.use("#" + this.element + "_" + this.lastDate).length > 0) {
					var lastdate = Js.use("#" + this.element + "_" + this.lastDate).setClass("calendar-day");
				}
				
				field.setClass("calendar-day-selected");
				this.value = [year, months, days].join("-");
				
				calendar.val(this.value);
				this.lastDate = [year, month, day].join("");
			}
			else {
				field.setClass("calendar-day");
				calendar.val("");
			}
		} 
		else if (this.type == "multiple") {
			var value = calendar.val();
			var values = value.split("|");
			
			if (Jrun.inArray([year, months, days].join("-"), values)) {
				values.splice(values.indexOf([year, months, days].join("-")), 1);
				value = values.join("|");
				
				field.setClass("calendar-day");
				this.value = value;
				calendar.val(this.value);
			}
			else {
				field.setClass("calendar-day-selected");
				values[values.length] = [year, months, days].join("-");
				this.value = values.join("|");
				calendar.val(this.value);
			}
		}
		
		if (Jrun.isfunction(this.setting.onUpdate)) {
			this.setting.onUpdate.call(this);
		}
		
		return this;
	},
	callback: function() 
	{
		var cal = this.renderTo;
		var that = this;
		var first_day = new Date(this.year, this.month, 1);
		var start_day = first_day.getDay();
		var html = "";
		var monthLength = this.dayOfMonth();
		cal.text("");
		
		this.node = Js.use("<div/>").attr({
			"id": [this.element, "calendar"].join("-"), 
			"class": "calendar-panel"
		}).css({
			"display": "block"
		}).appendTo(cal[0]);
		
		var wrapper = this.node;
		
		var header = Js.use("<div/>").appendTo(wrapper[0]).setClass("calendar-title");
		var content = Js.use("<div/>").appendTo(wrapper[0]);
		var footer = Js.use("<div/>").appendTo(wrapper[0]);
		
		var prevbtn = Js.use("<span/>").appendTo(header[0]);
		var nextbtn = Js.use("<span/>").appendTo(header[0]);
		var title = Js.use("<span/>").appendTo(header[0]);
		
		this.content = Js.use("<div/>").addClass("calendar-content").hide().appendTo(content[0]);
		this.option = Js.use("<div/>").addClass("calendar-option").hide().appendTo(content[0]);
		
		var table = Js.use("<table cellpadding='0' cellspacing='0'></table>").addClass("calendar-body").appendTo(this.content[0]);
		var tbody = Js.use("<tbody/>").appendTo(table[0]);
		
		var trheader = Js.use("<tr/>").addClass("calendar-header").appendTo(tbody[0]);
		
		for (var i = 0; i <= 6; i++) {
			Js.use("<td/>").addClass("calendar-header-day").text(this.language.days[i]).appendTo(trheader[0]);
		}
		
		var day = 1;
		
		for (var i = 0; i < 6; i++) {
			var weeks = Js.use("<tr/>").addClass("calendar-week").appendTo(tbody[0]);
			
			for (var j = 0; j <= 6; j++) {
				this.date = [this.year, (this.month + 1), day].join("-");
				var days = Js.use("<td/>").addClass("calendar-" + (this.validation() ? "day" : "invalid")).appendTo(weeks[0]);
				
				if (day <= monthLength && (i > 0 || j >= start_day)) {
					days.attr("id", this.element + "_" + this.year + (this.month + 1) + day);
					var tday;
					
					if (this.validation()) {
						days.bind("click", function(){
						
							var i = Js.use(this).attr("id").split("_");
							var count = (i.length - 1);
							var ym = that.year + "" + that.month;
							tday = i[count].substr((ym.length), i[count].length);
							that.updateValue(that.year, (that.month + 1), Jrun.toNumber(tday));
						});
					}
					
					if (day == this.day) {
						days.setClass("calendar-day-selected");
						this.lastdate = this.year + "" + (this.month + 1) + "" + Jrun.toNumber(this.day);
					}
					
					days.css("cursor", "pointer");
					
					days.text(day.toString());
					day++;
				}
				else {
					days.plainHtml("&nbsp;").setClass("calendar-invalid");
				}
			}
			
			if (day > monthLength) {
				break;
			}
		}
		
		
		if (this.setting.navigation == true) {
			prevbtn.plainHtml("&laquo;").bind("click", function(){
				that.prevMonth();
			}).setClass("prev-month");
			
			nextbtn.plainHtml("&raquo;").bind("click", function(){
				that.nextMonth();
			}).setClass("next-month");
			
			Js.use("<p/>").text(this.language.selectMonthYear).appendTo(this.option[0]);
			
			var selmonth = Js.use("<select name='month'></select>").bind("change", function(){
				that.customMonth(this.value);
			}).appendTo(this.option[0]);
			
			for (var i = 0; i < 12; i++) {
				if (this.month == i) {
					Js.use("<option value='" + i + "' selected='selected'></option>").text(this.language.months[i]).appendTo(selmonth[0]);
				}
				else {
					Js.use("<option value='" + i + "'></option>").text(this.language.months[i]).appendTo(selmonth[0]);
				}
			}
			
			var selyear = Js.use("<select name='year'></select>").text(" ").bind("change", function() {
				that.customYear(this.value);
			}).appendTo(this.option[0]);
			
			for (var i = this.range[0]; i >= this.range[1]; i--) {
				if (this.year == i) {
					Js.use("<option value='" + i + "' selected='selected'></option>").text(i.toString()).appendTo(selyear[0]);
				}
				else {
					Js.use("<option value='" + i + "'></option>").text(i.toString()).appendTo(selyear);
				}
			}
			
			Js.use("<input type='button' name='today' />").val(this.language.todayButton).bind("click", function(){
				that.today();
			}).addClass("select-today").appendTo(this.option[0]);
			
			title.setClass("this-month").text(this.language.months[this.month] + "&nbsp;" + this.year);
			this.node.data("toggle", 0);
			
			var _toggleContent = function()
			{
				var i = that.node.data("toggle");
				
				if (i === 1) {
					that.content.slideUp("normal");
					that.option.slideDown("normal");
					that.node.data("toggle", 0);
				}
				else {
					that.option.slideUp("normal");
					that.content.slideDown("normal");
					that.node.data("toggle", 1);
				}
			};
			
			title.css("cursor", "pointer").bind("click", _toggleContent);
			_toggleContent();
		}
		else {
			title.setClass("this-month").text(this.language.months[this.month] + "&nbsp;" + this.year);
		}
		
		if (Jrun.isset(this.field)) {
			var input = Js.use("<input id='" + [this.element, this.field].join("-") + "' name='" + this.field + "' type='" + this.setting.fieldType + "' />").appendTo(this.content[0]);
			
			if (Jrun.isset(this.day)) {
				var m = (this.month + 1);
				this.value = [this.year, (m < 10 ? "0" + m : m), this.day].join("-");
				input.val(this.value);
				this.lastDate = [this.year, (this.month + 1), Jrun.toNumber(this.day)].join("");
			}
		}
		
		return this;
	}
});

