/* Calendar/datePicker for Savvy.UI
 * version: 0.7.3
 */

Js.widget.datePicker = Js.create({
	appName: 'datePicker',
	field: null,
	value: '',
	lastDate: null,
	type: null,
	box: null,
	element: null,
	renderTo: null,
	content: null,
	setting: null,
	language: null,
	range: null,
	minDate: null,
	maxDate: null,
	status: null,
	dateObject: new Date,
	date: null,
	day: null,
	month: null,
	year: null,
	
	initiate: function( obj ) {
		return ( Js.helper.typeOf( obj ) === 'object' ? this.init( obj ) : this );
	},
	
	setup: function( option ) {
		var option = Js.helper.pickType( option, {}, 'object' );
		this.setting = Js.append( option, this.setting, ['lang'], true );
		
		if ( Js.helper.isset( option.lang ) ) 
			this.language = Js.append( option.lang, this.language );
	},
	
	init: function( obj ) {
		var that = this;
		
		this.setup( obj.option );
		this.setting = Js.append( this.setting, Js.config.widget[this.appName] );
		this.language = Js.append( this.language, Js.language.widget[this.appName] );
		
		this.element = Js.helper.prep( Js.helper.pick( obj.element, this.element ) );
		this.renderTo = Js.helper.pick( obj.renderTo, this.renderTo );
		
		if ( !this.renderTo || ( typeof( this.renderTo ) !== 'string' && !this.renderTo.nodeType ) ) {
			this.renderTo = Js.$('<div/>').appendTo('body');
		}
		else if ( typeof( this.renderTo ) === 'string' || this.renderTo.nodeType ) {
			this.renderTo = Js.$( this.renderTo ).eq(0) ;
		}
		
		obj.range = Js.helper.pickType( obj.range, this.range, [null, null], 'array' );
		this.field = Js.helper.pickType( obj.field, this.field, 'calendar-value', 'string' );
		this.type = Js.helper.pickGrep( obj.type, this.type, 'single', /^(single|multiple)$/g );
		
		// check if minimum date have been set
		if ( !!obj.minDate && this.setting.dateFormat.test( obj.minDate ) ) 
			this.minDate = Js.helper.pick( obj.minDate, null );
		
		// check if maximum date have been set
		if ( !!obj.maxDate && this.setting.dateFormat.test( obj.maxDate ) ) 
			this.maxDate = Js.helper.pick( obj.maxDate, null );
		
		if ( !!obj.value && obj.value.match( this.setting.dateFormat ) ) {
			obj.year = RegExp.$1;
			obj.month = RegExp.$2;
			obj.day = RegExp.$3;
			
			this.value = obj.value;
		} 
		else if ( !!obj.value && obj.value === 'today' ) {
			// get today date
			var tmp_date = new Date();
			obj.month = tmp_date.getMonth();
			obj.year = tmp_date.getFullYear();
			obj.day = tmp_date.getDate();
			
			this.value = [obj.year, obj.month, obj.day].join('-');
		}
		
		this.month = ( ( !obj.month || isNaN( obj.month) || obj.month > 12 || obj.month < 0 ) ? this.dateObject.getMonth() : Math.abs( obj.month - 1 ) );
		this.year = ( ( !obj.year || isNaN( obj.year) || obj.year < 1000) ? this.dateObject.getFullYear() : obj.year );
		this.day = Js.helper.pick( obj.day, this.day );
		
		this.date = [this.year, ( this.month + 1 ), Js.helper.pick( this.day, 1 )].join('-');
		this.navigation = Js.helper.pick( obj.navigate, true );
		
		var get_range = function( data ) {
			var result = null;
			var year = that.dateObject.getFullYear();
			
			if ( !data || data.toLowerCase() == 'now' ) 
				result = year; 
			else if ( data.match(/^(\+|\-)?(\d{1,4})$/) ) {
				var plus = RegExp.$1;
				var value = RegExp.$2;
				
				if ( plus == '+' ) 
					result = ( year + Js.helper.toNumber( value ) );
				else if ( plus == '-' ) 
					result = ( year - Js.helper.toNumber( value ) );
				else 
					result = value;
			}
			
			return result;
		};
		
		if ( this.navigation == true ) {
			obj.range[0] = get_range( obj.range[0] );
			obj.range[1] = get_range( obj.range[1] );
			
			if ( obj.range[0] < obj.range[1] ) {
				var result = obj.range[0];
				obj.range[0] = obj.range[1];
				obj.range[1] = result;
				delete result;
			}
			
			this.range = [this.maxYear( obj.range[0] ), this.minYear( obj.range[1] )];
		}
		
		if ( Js.helper.isfunction( this.setting.beforeStart ) ) 
			this.setting.beforeStart.apply( this );
		
		this.renderTo.text('');
		this.status = 'load';
		
		this.box = new Js.widget.dialog({
			element: [this.element, 'calendar'].join('-'),
			renderTo: this.renderTo[0],
			title: '',
			width: 350,
			language: {
				closeText: 'Cancel'
			},
			overlay: true
		});
		
		var content = Js.$( '<div/>' ).appendTo( this.box.content[0] );
		
		this.option = Js.$( '<div/>' ).addClass( 'calendar-option' ).appendTo( content[0] );
		this.content = Js.$( '<div/>' ).addClass( 'calendar-content' ).appendTo( content[0] );
		
		this.callback();
		
		return this;
	},
	
	minYear: function( year ) {
		var result = year;
		
		if ( this.minDate ) {
			var min_date = this.minDate.split('-');
			var new_year = Js.helper.toNumber( min_date[0] );
			
			if ( new_year > result ) 
				result = new_year;
		}
		
		return result;
	},
	
	maxYear: function( year ) {
		var result = year;
		
		if ( this.maxDate ) {
			var max_date = this.maxDate.split('-');
			var new_year = Js.helper.toNumber( max_date[0] );
			
			if ( new_year < result ) 
				result = new_year;
		}
		
		return result;
	},
	
	prevMonth: function() {
		this.day = null;
		this.dateObject = new Date( this.year, (this.month - 1) );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() )
			this.callback();
			
		else {
			this.dateObject = new Date( this.year, (this.month + 1) );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	prevYear: function() {
		this.day = null;
		this.dateObject = new Date( (this.year - 1), this.month );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() )
			this.callback();
		else {
			this.dateObject = new Date( (this.year + 1), this.month );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	nextMonth: function() {
		this.day = null;
		this.dateObject = new Date( this.year, (this.month + 1) );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() )
			this.callback();
		else {
			this.dateObject = new Date( this.year, (this.month - 1) );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	nextYear: function() {
		this.day = null;
		this.dateObject = new Date( (this.year + 1), this.month );
		this.month = this.dateObject.getMonth();
		this.year = this.dateObject.getFullYear();
		this.date = [this.year, (this.month + 1), this.dayOfMonth()].join('-');
		
		if ( this.validation() ) 
			this.callback();
		else {
			this.dateObject = new Date( (this.year - 1), this.month );
			this.month = this.dateObject.getMonth();
			this.year = this.dateObject.getFullYear();
			this.date = [this.year, (this.month + 1), '1'].join('-');
		}
		
		return this;
	},
	
	customMonth: function( data ) {
		this.day = null;
		this.dateObject = new Date( this.year, data );
		var result = [
			this.dateObject.getMonth(),
			this.dateObject.getFullYear()
		];
		this.date = [result[1], (result[0] + 1), this.dayOfMonth( result[0], result[1] )].join('-');
		
		if ( this.validation() ) {
			this.year = result[1];
			this.month = result[0];
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, this.month );
			this.date = [this.year, (this.month + 1), '1'].join('-');
			this.callback();
		}
		
		return this;
	},
	
	customYear: function( data ) {
		this.day = null;
		this.dateObject = new Date( data, this.month );
		var result = [
			this.dateObject.getMonth(),
			this.dateObject.getFullYear()
		];
		this.date = [result[1], (result[0] + 1), this.dayOfMonth( result[0], result[1] )].join('-');
		
		if ( this.validation() ) {
			this.year = result[1];
			this.month = result[0];
			this.callback();
		}
		else {
			this.dateObject = new Date( this.year, this.month );
			this.date = [this.year, (this.month + 1), '1'].join('-');
			this.callback();
		}
		
		return this;
	},
	
	today: function() {
		this.dateObject = new Date();
		this.year = this.dateObject.getFullYear();
		this.month = this.dateObject.getMonth();
		this.day = this.dateObject.getDate();
		this.date = [this.year, (this.month + 1), this.day].join('-');
		
		this.callback();
	},
	
	validation: function() {
		var result = false;
		var min_date = Js.helper.isset( this.minDate );
		var max_date = Js.helper.isset( this.maxDate );
		
		if ( min_date && max_date && this.compare( min_date, this.date ) && this.compare( this.date, max_date ) ) 
			result = true;
		else if ( min_date && this.compare( min_date, this.date ) ) 
			result = true;
		else if ( max_date && this.compare( this.date, max_date ) ) 
			result = true;
		else if ( !min_date && !max_date ) 
			result = true;
		
		return result;
	},
	
	dayOfMonth: function( month, year ) {
		var month = Js.helper.pick( month, this.month );
		var year = Js.helper.pick( year, this.year );
		
		if ( month == 1 && ( year % 4 == 0 && year % 100 != 0 ) || year % 400 == 0 ) 
			var month_length = 29;
		
		return Js.helper.pickType( month_length, this.setting.daysInMonth[month], 'number' );
	},
	
	compare: function( first, second ) {
		var firsts = first.split('-');
		var seconds = second.split('-');
		
		var first_date = new Date( firsts[0], (Js.helper.toNumber(firsts[1]) - 1) );
		first_date.setDate( firsts[2] );
		
		var second_date = new Date( seconds[0], (Js.helper.toNumber(seconds[1]) - 1) );
		second_date.setDate( seconds[2] );
		
		return second_date >= first_date;
	},
	
	updateValue: function( year, month, day ) {
		var field = Js.$( '#' + this.element + '_' + year + month + day ).eq(0);
		var calendar = Js.$( '#' + this.element + '-' + this.field ).eq(0);
		
		var months = ( month < 10 ? '0' + month : month );
		var days = ( day < 10 ? '0' + day : day );
		
		if( this.type == 'single' ) {
			if ( !field.hasClass('calendar-day-selected') ) {
				if ( Js.helper.isset( this.lastDate ) && Js.$( '#' + this.element + '_' + this.lastDate ).size() > 0 ) 
					var lastdate = Js.$( '#' + this.element + '_' + this.lastDate ).setClass( 'calendar-day' );
				
				field.setClass( 'calendar-day-selected' );
				this.value = [year, months, days].join('-');
				
				calendar.val( this.value );
				this.lastDate = [year, month, day].join('');
			}
			else {
				field.setClass( 'calendar-day' );
				calendar.val('');
			}
		} 
		else if ( this.type == 'multiple' ) {
			var value = calendar.val();
			var values = value.split('|');
			
			if ( Js.helper.inArray([year, months, days].join('-'), values) ) {
				values.splice( values.indexOf([year, months, days].join('-')), 1 );
				value = values.join('|');
				
				field.setClass( 'calendar-day' );
				this.value = value;
				calendar.val( this.value );
			}
			else {
				field.setClass( 'calendar-day-selected' );
				values[values.length] = [year, months, days].join('-');
				this.value = values.join('|');
				calendar.val( this.value );
			}
		}
		
		if ( Js.helper.isfunction( this.setting.onUpdate ) ) 
			this.setting.onUpdate.apply(this);
		
		return this;
	},
	
	callback: function() {
		var that = this;
		
		this.content.html('');
		this.option.html('');
		
		this.box.title( this.language.months[this.month] + ' ' + this.year );
		var first_day = new Date( this.year, this.month, 1 );
		var start_day = first_day.getDay();
		var html = '';
		var monthLength = this.dayOfMonth();
		
		var table = Js.$( '<table cellpadding="0" cellspacing="0"></table>' )
			.addClass( 'calendar-body' )
			.appendTo( this.content[0] );
		
		var tbody = Js.$( '<tbody/>' ).appendTo( table[0] );
		
		var trheader = Js.$( '<tr/>' ).addClass( 'calendar-header' ).appendTo( tbody[0] );
		
		for ( var i = 0; i <= 6; i++ ) 
			Js.$( '<td/>' )
				.addClass( 'calendar-header-day' )
				.text( this.language.days[i] )
				.appendTo( trheader[0] );
		
		var day = 1;
		
		for ( var i = 0; i < 6; i++ ) {
			var weeks = Js.$( '<tr/>' ).addClass( 'calendar-week' ).appendTo( tbody[0] );
			
			for ( var j = 0; j <= 6; j++ ) {
				this.date = [this.year, (this.month + 1), day].join('-');
				var days = Js.$( '<td/>' )
					.addClass( 'calendar-' + (this.validation() ? 'day' : 'invalid') )
					.appendTo( weeks[0] );
				
				if ( day <= monthLength && ( i > 0 || j >= start_day ) ) {
					days.attr( 'id', this.element + '_' + this.year + (this.month + 1) + day );
					var tday;
					
					if ( this.validation() ) {
						days.bind( 'click', function(){
							var i = Js.$( this ).attr( 'id' ).split('_');
							var count = ( i.length - 1 );
							var ym = that.year + '' + that.month;
							tday = i[count].substr( (ym.length), i[count].length );
							that.updateValue( that.year, (that.month + 1), Js.helper.toNumber(tday) );
						});
					}
					
					if ( day == this.day ) {
						days.setClass( 'calendar-day-selected' );
						this.lastdate = this.year + '' + (this.month + 1) + '' + Js.helper.toNumber(this.day);
					}
					
					days.css( 'cursor', 'pointer' );
					
					days.text( day.toString() );
					day++;
				}
				else 
					days.htmlText('&nbsp;').setClass('calendar-invalid');
			}
			
			if (day > monthLength) 
				break;
		}
		
		if ( this.setting.navigation == true ) {
			Js.$( '<a/>' )
				.setClass( 'prev-month' )
				.text( this.language.prevMonth )
				.attr( 'href', '#' )
				.click( function () {
					that.prevMonth();
					return false;
				})
				.appendTo( this.content[0] );
			
			Js.$( '<a/>' )
				.setClass( 'next-month' )
				.text( this.language.nextMonth )
				.attr( 'href', '#' )
				.click( function () {
					that.nextMonth();
					return false;
				})
				.appendTo( this.content[0] );
			
			//Js.$( '<p/>' ).text( this.language.selectMonthYear ).appendTo( this.option[0] );
			
			var selmonth = Js.$( '<select name="month"></select>' ).bind( 'change', function() {
				that.customMonth( this.value );
			}).appendTo( this.option[0] );
			
			for ( var i = 0; i < 12; i++ ) {
				if ( this.month == i ) 
					Js.$( '<option value="' + i + '" selected="selected"></option>' )
						.text( this.language.months[i] )
						.appendTo( selmonth[0] );
				else 
					Js.$( '<option value="' + i + '"></option>' )
						.text( this.language.months[i] )
						.appendTo( selmonth[0] );
			}
			var selyear = Js.$( '<select name="year"></select>' ).text( ' ' ).bind( 'change', function() {
				that.customYear( this.value );
			}).appendTo( this.option[0] );
			
			for ( var i = this.range[0]; i >= this.range[1]; i-- ) {
				if ( this.year == i ) 
					Js.$( '<option value="' + i + '" selected="selected"></option>' )
						.text( i.toString() )
						.appendTo( selyear[0] );
				else 
					Js.$( '<option value="' + i + '"></option>' )
					.text( i.toString() )
					.appendTo( selyear[0] );
			}
			
			
			if ( this.status == 'initiated' ) 
				this.box.buttons.html('');
			
			this.box.addButton({
				type: 'submit',
				text: this.language.todayButton,
				callback: function(){
					that.today();
				}
			});
		}
		
		this.box.fixDimension();
		this.status = 'initiated';
		
		if ( Js.helper.isset(this.field) ) {
			var input = Js.$( '<input id="' + [this.element, this.field].join('-') + '" name="' + this.field + '" type="' + this.setting.fieldType + '" />' ).appendTo( this.content[0] );
			
			if ( Js.helper.isset(this.day) ) {
				var m = ( this.month + 1 );
				this.value = [this.year, (m < 10 ? '0' + m : m), this.day].join('-');
				input.val( this.value );
				this.lastDate = [this.year, (this.month + 1), Js.helper.toNumber(this.day)].join('');
			}
		}
		
		return this;
	}
});
