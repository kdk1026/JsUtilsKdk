/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2021.07.31
 * @version 1.0
 * @description moment.js 필수
 * @link https://momentjs.com/
 * 
 * @description npm 기반(node.js 기반?)의 유틸을 일반 웹 기반에서 사용하기 위해 참고
 * @link https://github.com/kdk1026/node_utils/blob/main/libs/date.js
 */

const FORMAT = {
    YYYYMMDD : 'YYYYMMDD',
    YYYYMMDDHHMMSS : 'YYYYMMDDHHmmss'
};

/**
 * 현재 날짜 및 시간 반환
 */
const Today = {
    /**
     * 현재 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     * @returns 
     */
    getTodayString : function() {
        return moment().format(FORMAT.YYYYMMDD);
    },
    /**
     * 현재 날짜를 해당 포맷의 String 타입로 반환
     * @param {string} dateFromat 
     * @returns 
     */
    getTodayStringFormat : function(dateFromat) {
        return moment().format(dateFromat);
    },
    /**
     * 현재 시간을 HHmmss 형식의 String 타입으로 반환
     * @returns 
     */
    getCurrentTime : function() {
        return moment().format('HHmmss');
    },
    /**
     * 현재 연도 반환
     * @returns 
     */
    getYear : function() {
        return moment().format('YYYY');
    },
    /**
     * 현재 월 반환
     * @returns 
     */
    getMonthValue : function() {
        return moment().format('M');
    },
    /**
     * 현재 일 반환
     * @returns 
     */
    getDayOfMonth : function() {
        return moment().format('D');
    },
    /**
     * 현재 시간 반환
     * @returns 
     */
    getHour : function() {
        return moment().format('HH');
    },
    /**
     * 현재 분 반환
     * @returns 
     */
    getMinute : function() {
        return moment().format('mm');
    }
};

/**
 * String 타입 형식의 포맷 변환
 */
const StringFormat = {
    /**
     * yyyyMMdd 형식의 String 타입을 해당 포맷의 String 타입으로 반환
     * @param {string} strDate 
     * @param {string} dateFormat 
     * @returns 
     */
    getStringDate : function(strDate, dateFormat) {
        return moment(strDate, ["YYYYMMDD"], true).format(dateFormat);
    },
    /**
     * yyyyMMddHHmmss 형식의 String 타입을 해당 포맷의 String 타입으로 반환
     * @param {string} strDate 
     * @param {string} dateFormat 
     * @returns 
     */
    getStringDateTime : function(strDate, dateFormat) {
        return moment(strDate, ["YYYYMMDDHHmmss"], true).format(dateFormat);
    }
};

/**
 * 타입 변환
 */
const Convert = {
    /**
     * yyyyMMdd(HHmmss) 형식의 String 타입을 Date 타입으로 반환
     * @param {string} strDate 
     * @returns 
     */
    getStringToDate : function(strDate) {
        if (strDate.length === 14) {
            return moment(strDate, ["YYYYMMDDHHmmss"], true).toDate();
        } else {
            return moment(strDate, ["YYYYMMDD"], true).toDate();
        }
    },
    /**
     * Date 타입 객체를 yyyyMMdd 형식의 String 타입으로 반환
     * @param {Date} date 
     * @returns 
     */
    getDateToString : function(date) {
        return moment(date).format('YYYYMMDD');
    },
    /**
     * Date 타입 객체를 해당 포맷의 String 타입으로 반환
     * @param {Date} date 
     * @param {string} dateFormat 
     * @returns 
     */
    getDateToStringFormat : function(date, dateFormat) {
        return moment(date).format(dateFormat);
    }
};

/**
 * 이전/이후 날짜 반환
 */
const CalcDate = {
    /**
     * 현재 날짜의 이전/이후 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {number} days 
     * @returns 
     */
    plusMinusDay : function(days) {
        return moment().add(days, 'days').format(FORMAT.YYYYMMDD);
    },
    /**
     * yyyyMMdd 형식의 String 타입 날짜의 이전/이후 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {string} strDate 
     * @param {number} days 
     * @returns 
     */
    plusMinusDayString : function(strDate, days) {
        return moment(strDate, ["YYYYMMDD"], true).add(days, 'days').format(FORMAT.YYYYMMDD);
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {number} months 
     * @returns 
     */
    plusMinusMonth : function(months) {
        return moment().add(months, 'months').format(FORMAT.YYYYMMDD);
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 해당 포맷 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {number} months 
     * @param {string} dateForamt 
     * @returns 
     */
    plusMinusMonthFormat : function(months, dateForamt) {
        return moment().add(months, 'months').format(dateForamt);
    },
    /**
     * yyyyMMdd 형식의 String 타입 날짜의 이전/이후 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     *    - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {string} strDate 
     * @param {number} months 
     * @returns 
     */
    plusMinusMonthString : function(strDate, months) {
        return moment(strDate, ["YYYYMMDD"], true).add(months, 'months').format(FORMAT.YYYYMMDD);
    },
    /**
     * 해당 포맷 형식의 String 타입 날짜의 이전/이후 날짜를 해당 포맷 형식의 String 타입으로 반환
     *    - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {string} strDate 
     * @param {number} months 
     * @param {string} dateForamt 
     * @returns 
     */
    plusMinusMonthStringFormat : function(strDate, months, dateForamt) {
        return moment(strDate, [dateForamt], true).add(months, 'months').format(dateForamt);
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {number} years 
     * @returns 
     */
    plusMinusYear : function(years) {
        return moment().add(years, 'years').format(FORMAT.YYYYMMDD);
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 해당 포맷 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환
     * @param {number} years 
     * @param {string} dateForamt 
     * @returns 
     */
    plusMinusYearFormat : function(years, dateForamt) {
        return moment().add(years, 'years').format(dateForamt);
    },
    /**
     * yyyyMMdd 형식의 String 타입 날짜의 이전/이후 날짜를 yyyyMMdd 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {string} strDate 
     * @param {number} years 
     * @returns 
     */
    plusMinusYearString : function(strDate, years) {
        return moment(strDate, ["YYYYMMDD"], true).add(years, 'years').format(FORMAT.YYYYMMDD);
    },
    /**
     * 해당 포맷 형식의 String 타입 날짜의 이전/이후 날짜를 해당 포맷 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {string} strDate 
     * @param {number} years 
     * @param {string} dateForamt 
     * @returns 
     */
    plusMinusYearStringFormat : function(strDate, years, dateForamt) {
        return moment(strDate, [dateForamt], true).add(years, 'years').format(dateForamt);
    }
};

/**
 * 이전/이후 시간각반환
 */
const CalcTime = {
    /**
     * 현재 날짜의 이전/이후 날짜를 yyyyMMddHHmmss 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {number} hours 
     * @returns 
     */
    plusMinusHour : function(hours) {
        return moment().add(hours, 'hours').format(FORMAT.YYYYMMDDHHMMSS);
    },
    /**
     * yyyyMMddHHmmss 형식의 String 타입 날짜의 이전/이후 날짜를 yyyyMMddHHmmss 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {string} strDate 
     * @param {number} hours 
     * @returns 
     */
    plusMinusHourString : function(strDate, hours) {
        return moment(strDate, ["YYYYMMDDHHmmss"], true).add(hours, 'hours').format(FORMAT.YYYYMMDDHHMMSS);
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 yyyyMMddHHmmss 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {number} minutes 
     * @returns 
     */
    plusMinusMinute : function(minutes) {
        return moment().add(minutes, 'minutes').format(FORMAT.YYYYMMDDHHMMSS);
    },
    /**
     * yyyyMMddHHmmss 형식의 String 타입 날짜의 이전/이후 날짜를 yyyyMMddHHmmss 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {string} strDate 
     * @param {number} hours 
     * @returns 
     */
    plusMinusMinuteString : function(strDate, minutes) {
        return moment(strDate, ["YYYYMMDDHHmmss"], true).add(minutes, 'minutes').format(FORMAT.YYYYMMDDHHMMSS);
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 yyyyMMddHHmmss 형식의 String 타입으로 반환
     *   - 인자 값이 음수 인 경우, 이전 날짜 반환
     *   - 인자 값이 양수 인 경우, 이후 날짜 반환 
     * @param {number} seconds 
     * @returns 
     */
    plusMinusSecond : function(seconds) {
        return moment().add(seconds, 'seconds').format(FORMAT.YYYYMMDDHHMMSS);
    }
};

/**
 * 기간 간격 구하기
 */
const GetDateInterval = {
    /**
     * 현재 날짜와 년 간격 구하기
     *   - 0:같다, 양수:크다, 음수:작다
     * @param {string} strFixDate (YYYYMMDD)
     * @returns 
     */
    intervalYears : function(strFixDate) {
        let fixDate = moment(strFixDate, ["YYYYMMDD"], true).toDate();
        let targetDate = moment().toDate();
        let result = moment.duration(fixDate - targetDate).asYears();
        return Object.is(Math.round(result), -0) ? 0 : Math.round(result);
    },
    /**
     * 현재 날짜와 월 간격 구하기
     *   - 0:같다, 양수:크다, 음수:작다
     * @param {string} strFixDate 
     * @returns 
     */
    intervalMonths : function(strFixDate) {
        let fixDate = moment(strFixDate, ["YYYYMMDD"], true).toDate();
        let targetDate = moment().toDate();
        let result = moment.duration(fixDate - targetDate).asMonths();
        return Object.is(Math.ceil(result), -0) ? 0 : Math.ceil(result);
    },
    /**
     * 현재 날짜와 일자 간격 구하기
     *   - 0:같다, 양수:크다, 음수:작다
     * @param {string} strFixDate 
     * @returns 
     */
    intervalDays : function(strFixDate) {
        let fixDate = moment(strFixDate, ["YYYYMMDD"], true).toDate();
        let targetDate = moment().toDate();
        let result = moment.duration(fixDate - targetDate).asDays();
        return Object.is(Math.ceil(result), -0) ? 0 : Math.ceil(result);
    }
};

/**
 * 시간 간격 구하기
 */
const GetTimeInterval = {
    /**
     * 현재 날짜와 시간 간격 구하기
     *   - 0:같다, 양수:크다, 음수:작다
     * @param {string} strFixDate 
     * @returns 
     */
    intervalHours : function(strFixDate) {
        let fixDate = moment(strFixDate, ["YYYYMMDDHHmmss"], true).toDate();
        let targetDate = moment().toDate();
        let result = moment.duration(fixDate - targetDate).asHours();
        return Object.is(Math.ceil(result), -0) ? 0 : Math.ceil(result);
    },
    /**
     * 현재 날짜와 분 간격 구하기
     *   - 0:같다, 양수:크다, 음수:작다
     * @param {string} strFixDate 
     * @returns 
     */
    intervalMinutes : function(strFixDate) {
        let fixDate = moment(strFixDate, ["YYYYMMDDHHmmss"], true).toDate();
        let targetDate = moment().toDate();
        let result = moment.duration(fixDate - targetDate).asMinutes();
        return Object.is(Math.ceil(result), -0) ? 0 : Math.ceil(result);
    },
    /**
     * 현재 날짜와 초 간격 구하기
     *   - 0:같다, 양수:크다, 음수:작다
     * @param {string} strFixDate 
     * @returns 
     */
    intervalSeconds : function(strFixDate) {
        let fixDate = moment(strFixDate, ["YYYYMMDDHHmmss"], true).toDate();
        let targetDate = moment().toDate();
        let result = moment.duration(fixDate - targetDate).asSeconds();
        return Object.is(Math.ceil(result), -0) ? 0 : Math.ceil(result);
    }
};

/**
 * 요일 구하기
 */
const GetDayOfWeek = {
    /**
     * 현재 날짜의 요일 구하기
     * @returns 
     */
    getDayOfWeek : function() {
        return moment().day();
    },
    /**
     * yyyyMMdd 형식의 String 타입 날짜의 요일 구하기
     * @param {string} strDate 
     * @returns 
     */
    getDayOfWeekString : function(strDate) {
        return moment(strDate, ["YYYYMMDD"], true).day();
    },
    /**
     * 현재 날짜의 1일의 요일 반환
     * @returns 
     */
    getFirstDayOfWeek : function() {
        return moment().date(1).day();
    },
    /**
     * yyyyMMdd 형식의 String 타입에 해당하는 1일의 요일 반환
     * @param {string} strDate 
     * @returns 
     */
    getFirstDayOfWeekString : function(strDate) {
        return moment(strDate, ["YYYYMMDD"], true).date(1).day();
    },
    /**
     * 현재 날짜의 로케일 요일 구하기
     *   - Locale 목록 : https://momentjs.com/ > `Multiple Locale Support`
     * @param {string} locale 
     * @returns 
     */
    getDayOfWeekLocale : function(locale) {
        return moment().locale(locale).format('dd');
    },
    /**
     * yyyyMMdd 형식의 String 타입 날짜의 한글 요일 구하기
     * @param {string} strDate 
     * @param {string} locale 
     * @returns 
     */
    getDayOfWeekLocaleString : function(strDate, locale) {
        return moment(strDate, ["YYYYMMDD"], true).locale(locale).format('dd');
    }
};

/**
 * 마지막 일자 반환
 */
const GetDayOfMonth = {
    /**
     * 현재 날짜의 마지막 일자를 반환
     * @returns 
     */
    getLastDayOfMonth : function() {
        return moment().daysInMonth();
    },
    /**
     * 현재 날짜의 마지막 일자를 yyyyMMdd 형식으로 반환
     */
    getLastDayOfMonthString: function() {
        return moment().endOf('month').format('YYYYMMDD');
    },
    /**
     * yyyyMMdd 형식의 String 타입에 해당하는 월의 마지막 일자를 반환
     * - Java 와 다르게 인자가 달라도 함수명은 구분해야 함
     * @param {string} strDate 
     * @returns 
     */
    getLastDayOfMonthForDate : function(strDate) {
        return moment(strDate, ["YYYYMMDD"], true).daysInMonth();
    },
    /**
     * yyyyMMdd 형식의 String 타입에 해당하는 월의 마지막 일자를 yyyyMMdd 형식으로 반환
     * - Java 와 다르게 인자가 달라도 함수명은 구분해야 함
     * @param {string} strDate 
     * @returns 
     */
    getLastDayOfMonthStringForDate: function(strDate) {
        const daysInMonth = moment(strDate, ["YYYYMMDD"], true).daysInMonth();
        const lastDay = moment(strDate, ["YYYYMMDD"], true).date(daysInMonth);
        return lastDay.format('YYYYMMDD');
    }
};

/**
 * Unix Timestamp
 */
const UnixTimestamp = {
    /**
     * milliseconds
     * @returns 
     */
    currentMillis : function() {
        return moment().valueOf();
    },
    /**
     * milliseconds to Date
     * @param {long} mills 
     * @returns 
     */
    millsToDate : function(mills) {
        return moment(mills).toDate();
    },
    /**
     * current Unix Timestamp
     *   - https://www.epochconverter.com/
     * @returns 
     */
    getUnixTimestamp : function() {
        return moment().unix();
    },
    /**
     * timestamp to Date
     * @param {long} timestamp 
     * @returns 
     */
    timestampToDate : function(timestamp) {
        return moment(timestamp * 1000).toDate();
    }
};

/**
 * Check
 */
const Check = {
    /**
     * 해당 날짜가 월의 마지막에 속하는지 체크
     * @param {string} strDate 
     * @returns 
     */
    isLastWeekOfMonth : function(strDate) {
        const date = moment(strDate, ["YYYYMMDD"], true);
        const lastDayOfMonth = date.clone().endOf('month');
        const startOfLastWeek = lastDayOfMonth.clone().startOf('week');
        return date.isSameOrAfter(startOfLastWeek);
    },
    /**
     * 해당 날짜가 월의 첫째주에 속하는지 체크
     * @param {string} strDate 
     * @returns 
     */
    isFistWeekOfMonth : function(strDate) {
        const date = moment(strDate, ["YYYYMMDD"], true);
        const firstDayOfMonth = date.clone().startOf('month');
        const endOfFirstWeek = firstDayOfMonth.clone().endOf('week');
        return date.isSameOrBefore(endOfFirstWeek);
    }
};

/**
 * 날짜 설정
 * - 이후 다음 함수를 사용하여 String 타입으로 변환
 * - Convert.getDateToString(date), Convert.getDateToStringFormat(date, dateFormat)
 */
const SetDate = {
    /**
     * 연, 월, 일로 Date 객체 구하기
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @returns 
     */
    getDateByYearMonthDay : function(year, month, day) {
        const momentObj = moment().year(year).month(month).date(day);
        return momentObj.toDate();
    },
    /**
     * 연, 월, 일, 시로 Date 객체 구하기
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @param {number} hour 
     * @returns 
     */
    getDateByYearMonthDayHour : function(year, month, day, hour) {
        const momentObj = moment().year(year).month(month).date(day).hour(hour);
        return momentObj.toDate();
    },
    /**
     * 연, 월, 일, 시, 분으로 Date 객체 구하기
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @param {number} hour 
     * @param {number} minute 
     * @returns 
     */
    getDateByYearMonthDayHourMinute : function(year, month, day, hour, minute) {
        const momentObj = moment().year(year).month(month).date(day).hour(hour).minute(minute);
        return momentObj.toDate();
    },
    /**
     * 연, 월, 일, 시, 분, 초로 Date 객체 구하기
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     * @param {number} hour 
     * @param {number} minute 
     * @param {number} second 
     * @returns 
     */
    getDateByYearMonthDayHourMinuteSecond : function(year, month, day, hour, minute, second) {
        const momentObj = moment().year(year).month(month).date(day).hour(hour).minute(minute).second(second);
        return momentObj.toDate();
    }
};