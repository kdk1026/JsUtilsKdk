var DateTimeUtils = {};

DateTimeUtils.Etc = {
	// 10 이하에 0을 붙여서 반환
	addZero(i) {
		if (i<10) {
			i = "0" + i;
		}
		return i;
	},
	// 해당 날짜를 yyyy-MM-dd 형식으로 반환
	dateToString(date) {
		var year = date.getFullYear(),
			month = (date.getMonth() + 1),
			day = date.getDate();	
		
			month = this.addZero(month);
			day = this.addZero(day);
			
		return [year, month, day].join('-'); 
	},
	// 해당 시간을 HH:mm:ss 형식으로 반환
	timeToString(date) {
		var hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();
		
		hour = this.addZero(hour);
		minute = this.addZero(minute);
		second = this.addZero(second);
		
		return [hour, minute, second].join(':'); 
	},
	// 해당 문자열을 Date 형식으로 반환
	stringToDate(str) {
		var date = new Date();
		str = str.replace(/-|\s|:/gi, '');
		
		if ( !/^[\d]+$/.test(str) ) {
			return false;
		}
		
		date.setFullYear(str.substr(0, 4));
		date.setMonth(str.substr(4, 2) - 1);
		date.setDate(str.substr(6, 2));
		
		if (str.length == 14) {
			date.setHours(str.substr(8, 2));
			date.setMinutes(str.substr(10, 2));
			date.setSeconds(str.substr(12, 2));
		}
		return date;
	},
	// 해당 날짜를 yyyy-MM-dd HH:mm:ss 형식으로 반환
	toFullString(date) {
		var year = date.getFullYear(),
			month = (date.getMonth() + 1),
			day = date.getDate(),
			hour = date.getHours(),
			minute = date.getMinutes(),
			second = date.getSeconds();
	
		month = this.addZero(month);
		day = this.addZero(day);
		hour = this.addZero(hour);
		minute = this.addZero(minute);
		second = this.addZero(second);
		
		var ret1 = [year, month, day].join('-'),
			ret2 = [hour, minute, second].join(':');
		
		return [ret1, ret2].join(' ');			
	}
}

DateTimeUtils.Today = {
	// 현재 날짜 반환
	getTodayDate: function() {
		return new Date(); 
	},
	// 현재 날짜를 yyyy-MM-dd 형식으로 반환
	getTodayString: function() {
		var date = new Date(); 
		return DateTimeUtils.Etc.dateToString(date);
	},
	getTodayYYYYMM: function() {
		var str = this.getTodayString();
		var array = str.split('-');
		return [array[0], array[1]].join('-'); 
	},
	getTodayYYYY: function() {
		var str = this.getTodayString();
		var array = str.split('-');
		return array[0]; 
	},
	// 현재 시간을 HH:mm:ss 형식으로 반환
	getCurrentTime:  function() {
		var date = new Date(); 
		return DateTimeUtils.Etc.timeToString(date);
	}
}

DateTimeUtils.CalcDate = {
	/*
	 * 현재 날짜의 이전/이후 날짜를 반환
	 *  - 인자 값이 음수 = 이전 날짜, 양수 = 이후 날짜 반환
	 */	
	plusMinusDay: function(days) {
		var date = DateTimeUtils.Today.getTodayDate();
		var newDate = new Date();
		
		newDate.setDate(date.getDate() + days);
		return newDate;
	},
	// 현재 날짜의 이전/이후 날짜를 yyyy-MM-dd 형식의 String 타입으로 반환
	plusMinusDayToString: function(days) {
		var date = this.plusMinusDay(days);
		return DateTimeUtils.Etc.dateToString(date);
	},
	plusMinusDayIn: function(str, days) {
		var date = DateTimeUtils.Etc.stringToDate(str);
		var newDate = new Date();
		
		newDate.setDate(date.getDate() + days);
		return newDate
	},
	plusMinusDayInToString: function(str, days) {
		var date = this.plusMinusDay(str, days);
		return DateTimeUtils.Etc.dateToString(date);
	},
	
	/*
	 * 현재 날짜의 이전/이후 날짜를 반환
	 *  - 인자 값이 음수 = 이전 날짜, 양수 = 이후 날짜 반환
	 */	
	plusMinusMonth: function(months) {
		var date = DateTimeUtils.Today.getTodayDate();
		var newDate = new Date();
		
		newDate.setMonth(date.getMonth() + months);
		return newDate;
	},
	// 현재 날짜의 이전/이후 날짜를 yyyy-MM-dd 형식의 String 타입으로 반환
	plusMinusMonthToString: function(months) {
		var date = this.plusMinusMonth(months);
		return DateTimeUtils.Etc.dateToString(date);
	},
	plusMinusMonthIn: function(str, months) {
		var date = DateTimeUtils.Etc.stringToDate(str);
		var newDate = new Date();
		
		newDate.setMonth(date.getMonth() + months);
		return newDate;
	},
	plusMinusMonthInToString: function(str, days) {
		var date = this.plusMinusMonth(str, days);
		return DateTimeUtils.Etc.dateToString(date);
	},
	
	/*
	 * 현재 날짜의 이전/이후 날짜를 반환
	 *  - 인자 값이 음수 = 이전 날짜, 양수 = 이후 날짜 반환
	 */	
	plusMinusYear: function(years) {
		var date = DateTimeUtils.Today.getTodayDate();
		var newDate = new Date();
		
		newDate.setFullYear(date.getFullYear() + years);
		return newDate;
	},
	// 현재 날짜의 이전/이후 날짜를 yyyy-MM-dd 형식의 String 타입으로 반환
	plusMinusYearToString: function(years) {
		var date = this.plusMinusYear(years);
		return DateTimeUtils.Etc.dateToString(date);
	},
	plusMinusYearIn: function(str, years) {
		var date = DateTimeUtils.Etc.stringToDate(str);
		var newDate = new Date();
		
		newDate.setFullYear(date.getFullYear() + years);
		return newDate;
	},
	plusMinusYearInToString: function(str, days) {
		var date = this.plusMinusYear(str, days);
		return DateTimeUtils.Etc.dateToString(date);
	}
}

DateTimeUtils.CalcTime = {
	/*
	 * 현재 날짜의 이전/이후 시각을 반환
	 *  - 인자 값이 음수 = 이전 시간, 양수 = 이후 시간 반환
	 */	
	plusMinusHour: function(hours) {
		var date = DateTimeUtils.Today.getTodayDate();
		var newDate = new Date();
		
		newDate.setHours(date.getHours() + hours);
		return newDate;
	},
	// 현재 날짜의 이전/이후 시각을 yyyy-MM-dd HH:mm:ss 형식의 String 타입으로 반환
	plusMinusHourToString: function(years) {
		var date = this.plusMinusHour(years);
		return DateTimeUtils.Etc.toFullString(date);
	},
	plusMinusHourIn: function(str, hours) {
		var date = DateTimeUtils.Etc.stringToDate(str);
		var newDate = new Date();
		
		newDate.setHours(date.getHours() + hours);
		return newDate;
	},
	plusMinusHourInToString: function(str, hours) {
		var date = this.plusMinusHourIn(str, hours);
		return DateTimeUtils.Etc.toFullString(date);
	},
	
	/*
	 * 현재 날짜의 이전/이후 시각을 반환
	 *  - 인자 값이 음수 = 이전 시간, 양수 = 이후 시간 반환
	 */	
	plusMinusMinute: function(minutes) {
		var date = DateTimeUtils.Today.getTodayDate();
		var newDate = new Date();
		
		newDate.setMinutes(date.getMinutes() + minutes);
		return newDate;
	},
	// 현재 날짜의 이전/이후 시각을 yyyy-MM-dd HH:mm:ss 형식의 String 타입으로 반환
	plusMinusMinuteToString: function(minutes) {
		var date = this.plusMinusMinute(minutes);
		return DateTimeUtils.Etc.toFullString(date);
	},
	plusMinusMinuteIn: function(str, minutes) {
		var date = DateTimeUtils.Etc.stringToDate(str);
		var newDate = new Date();
		
		newDate.setMinutes(date.getMinutes() + minutes);
		return newDate;
	},
	plusMinusMinuteInToString: function(str, minutes) {
		var date = this.plusMinusMinuteIn(str, minutes);
		return DateTimeUtils.Etc.toFullString(date);
	},
	
	/*
	 * 현재 날짜의 이전/이후 시각을 반환
	 *  - 인자 값이 음수 = 이전 시간, 양수 = 이후 시간 반환
	 */
	plusMinusSecond: function(seconds) {
		var date = DateTimeUtils.Today.getTodayDate();
		var newDate = new Date();
		
		newDate.setSeconds(date.getSeconds() + seconds);
		return newDate;
	},
	// 현재 날짜의 이전/이후 시각을 yyyy-MM-dd HH:mm:ss 형식의 String 타입으로 반환
	plusMinusSecondToString: function(seconds) {
		var date = this.plusMinusSecond(seconds);
		return DateTimeUtils.Etc.toFullString(date);
	}
}

DateTimeUtils.GetDayOfWeek = {
	// 한글 요일 구하기
	getKorDayOfWeek: function(date) {
		var week = new Array('일', '월', '화', '수', '목', '금', '토');
		return week[date.getDay()];
	}
}

DateTimeUtils.GetDayOfMonth = {
	// 마지막 일자를 반환
	getLastDayOfMonth: function(date) {
		var newDate = new Date(date.getYear(), date.getMonth()+1, 0);
		return newDate.getDate();
	}	
}