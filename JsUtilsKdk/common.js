/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.12.02
 * @version 6.2
 * @description 특정 프로젝트가 아닌, 범용적으로 사용하기 위한 함수 모음
 * @description 버전업 기준 : 수정 / 함수 추가 -> 프로젝트 적용 여부
 * @description 파일명을 common-util.js 로 변경해서 사용
 *
 * @property {object} CommonJS
 * @property {object} CommonJS.Text - 2021.07.10 추가 (CommonJS 에서 addZero 분리하고, 추가)
 * @property {object} CommonJS.Object - 2021.07.13 추가 (CommonJS 에서 mergeObject, objectToQueryString 분리하고, 추가)
 * @property {object} CommonJS.Valid
 * @property {object} CommonJS.DateTime
 * @property {object} CommonJS.Format
 * @property {object} CommonJS.FormatValid - 2021.07.10 추가 (CommonJS.Valid 에서 분리함)
 * @property {object} CommonJS.JSON
 * @property {object} CommonJS.File
 * @property {object} CommonJS.FileValid - 2021.07.10 추가 (CommonJS.File 에서 분리함)
 * @property {object} CommonJS.Cookie
 * @property {object} CommonJS.Byte
 * @property {object} CommonJS.Escape
 * @property {object} CommonJS.BrowserInfo
 * @property {object} CommonJS.Input - 2021.06.21 추가
 * @property {object} CommonJS.FormatValue - 2024.11.21 추가
 * @property {object} CommonJS.SearchEngine - 2021.07.10 추가
 * @property {object} CommonJS.SnsShare - 2021.07.10 추가
 * @property {object} CommonJS.Mobile - 2021.07.10 추가
 * @property {object} CommonJS.Map - 2021.07.11 추가
 * @property {object} CommonJS.Editor - 2021.07.11 추가 (설명 위주로만 정리)
 * @property {object} CommonJS.Http - 2021.07.12 추가
 * @property {object} CommonJS.Code - 2021.07.13 추가
 * @property {object} CommonJS.SocialLogin - 2021.07.14 추가
 * @property {object} CommonJS.Addr - 2021.07.14 추가
 * @property {object} CommonJS.Discount - 2021.07.16 추가
 * @property {object} CommonJS.Print - 2021.07.21 추가 (CommonJS 에서 printTheArea 분리하고, 추가)
 * @property {object} CommonJS.Scroll - 2022.02.10 추가
 * @property {object} CommonJS.Masking - 2022.08.12 추가
 * @property {object} CommonJS.Time - 2022.08.23 추가
 * @property {object} CommonJS.Url - 2025.02.19 추가
 * @property {object} CommonJS.Base64 - 2025.05.31 추가
 */
const CommonJS = {
    /**
     * 팝업창 띄우기
     * @param {string} url
     * @param {(undefined|null|blank|string)} name
     * @param {(undefined|null|number)} width
     * @param {(undefined|null|number)} height
     * @example
     * CommonJS.openPopup('http://www.naver.com', 'pop', 500, 500);
     */
    openPopup: function (url, name, width, height) {
        const popupHeight = (CommonJS.Valid.isUndefined(height)) ? screen.height : Number(height);
        const popupWidth = (CommonJS.Valid.isUndefined(width)) ? screen.width : Number(width);
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);
        let option = '';
        option += 'height=' + popupHeight + ', width=' + popupWidth + ', left=' + left + ', top=' + top;
        option += 'menubar=no, status=no';
        option += 'resizable=no, scrollbars=no, toolbar=no'; // IE only | IE, Firefox, Opera only | IE, Firefox only

        window.open(url, name, option);
    },
    /**
     * F12 버튼 막기 및 우클릭 막기 (추가 : 드래그 방지, 선택 방지)
     *  - keyCode 는 deprecated 되었으므로 code 활용
     *    > https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
     * @example
     * CommonJS.blockSourceView();
     */
    blockSourceView: function () {
        // F12 버튼 막기
        document.onkeydown = function (e) {
            if (e.code === 'F12') {
                e.preventDefault();
            }
        };

        // 우클릭 방지
        document.oncontextmenu = function () {
            return false;
        };

        // 드래그 방지
        document.ondragstart = new Function('return false');

        // 선택 방지
        document.onselectstart = new Function('return false');
    },
    /**
     * 현재 위치정보 출력
     *
     * @description SSL인 경우에만 가져올 수 있다. 로컬은 예외인 듯
     *
     * @example
     * CommonJS.getLocation(fnLocationSuc, fnLocationErr);
     *
     * function fnLocationSuc(position) {
     *      console.log(position.coords);
     *      console.log(position.coords.latitude);  // 위도
     *      console.log(position.coords.longitude); // 경도
     * }
     *
     * function fnLocationErr(error) {
     *      console.log(error);
     * }
     */
    getLocation: function (onSuccess, onError) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            console.log('이 브라우저에서는 Geolocation이 지원되지 않습니다.');
        }
    },
    /**
     * 스크립트 후킹
     *   - beforeFuncNm 에서 return false;를 반환 하면 funcNm 를 실행 하지 않음
     * @param {string} beforeFuncNm - 특정 함수가 실행 되기전 실행할 함수
     * @param {string} funcNm - 실행할 특정 함수
     * @param {undefined|?} parent - 함수의 위치
     *
     * @description 개발 당시에는 몰라도 분석할 때는 헷갈릴 듯...
     * @example
     * CommonJS.scriptHook(fnValid, fnSubmit);
     */
    scriptHook: function (beforeFuncNm, funcNm, parent) {
        if (typeof parent == 'undefined') parent = window;
        for (let i in parent) {
            if (parent[i] === funcNm) {
                parent[i] = function () {
                    const Return = beforeFuncNm();
                    if (Return === false) return;
                    return funcNm.apply(this, arguments);
                }
            }
        }
    },
    /**
     * 인자로 받은 Array를 병합한 Array 반환
     * @param {Array} arr
     * @param  {...any} sources
     * @returns
     * @example
     * CommonJS.mergeArray(arr1, arr2, arr3);
     */
    mergeArray: function (arr, ...sources) {
        return arr.concat(...sources);
    },
    /**
     * Class 구분
     * @param {any} any
     * @returns
     * @example
     * console.log( CommonJS.getClassType([]) );//"Array"
     * console.log( CommonJS.getClassType({}) );//"Object"
     * console.log( CommonJS.getClassType(1) );//"Number"
     * console.log( CommonJS.getClassType(new Date()) );//"Date"
     *
     * @link https://owenjeon.github.io/2016/08/12/array-object/
     */
    getClassType: function(any) {
        return Object.prototype.toString.call(any).slice(8, -1);
    },
    /**
     * 이미지를 base64 인코딩된 data URI로 반환
     * @param {Element} img
     * @returns
     * @example
     * CommonJS.getImageToDataUrl( document.querySelector('#img') );
     */
    getImageToDataUrl: function(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/jpeg');
    },
    /**
     * 파이어폭스&사파리 앞으로, 뒤로 버튼에 대한 캐시 삭제
     * @example
     * CommonJS.reloadFirefoxSafari();
     */
    reloadFirefoxSafari: function() {
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        }
    }
};

CommonJS.Text = {
    /**
     * 10 이하의 숫자에 0을 붙여서 반환
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Text.addZero(3);
     */
    addZero: function (num) {
        if (num < 10) {
            num = '0' + num;
        }
        return num;
    },
    /**
     * 문자열이 Blank / Undefined 이면 defaultStr 반환
     * @param {string} string
     * @param {string} defaultStr
     * @returns
     * @example
     * CommonJS.Text.defaultString('', '치환');
     */
    defaultString: function (string, defaultStr) {
        if (CommonJS.Valid.isBlank(string) || CommonJS.Valid.isUndefined(string)) {
            return defaultStr;
        } else {
            return string;
        }
    },
    /**
     * 모던한 방법으로 클립보드 복사하기
     * @param {undefined|Element} textElement
     * @param {undefined|string} string
     * @example
     * 클릭 이벤트 시에만 동작 (onload 시에는 불가)
     *
     * CommonJS.Text.copyToClipBoard( document.querySelector(셀렉터) );
     * CommonJS.Text.copyToClipBoard( null, '복사할 내용' );
     */
    copyToClipBoard: function (textElement, string) {
        const currentURL = window.location.href;
        if ( !currentURL.startsWith('https://') && !currentURL.includes('localhost') && !currentURL.includes('127.0.0.1') ) {
            alert('URL은 localhost, 127.0.0.1 또는 HTTPS여야 합니다.');
            return;
        }

        let textToCopy = '';

        if (textElement != null) {
            textToCopy = textElement.value || textElement.textContent;
        } else {
            textToCopy = string;
        }

        if (textToCopy) {
            window.navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log('클립보드에 복사 되었습니다.');
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        } else {
            console.warn('복사할 텍스트가 없습니다.');
        }
    },
    /**
     * 난수 생성
     * @param {number} num
     * @returns
     * @example
     * CommonJS.Text.generateRandomCode(12);
     */
    generateRandomCode: function(num) {
        let str = '';
        for (let i=0; i < num; i++) {
            str += Math.floor(Math.random() * 10);
        }
        return str;
    },
    /**
     * 좌측 문자열 채우기
     * padStart() 를 브라우저 버전 때문에 지원 안하는 경우
     * @param {string} str
     * @param {number} padLen
     * @param {string} padStr
     * @returns
     * @example
     * CommonJS.Text.lpad('1', 5, '0');
     */
    lpad(str, padLen, padStr) {
        if ( padStr.length > padLen ) {
            return str;
        }
        str += '';
        padStr += '';
        while(str.length < padLen) {
            str = padStr + str;
        }
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
    },
    /**
     * 우측 문자열 채우기
     * padEnd() 를 브라우저 버전 때문에 지원 안하는 경우
     * @param {string} str
     * @param {number} padLen
     * @param {string} padStr
     * @returns
     * @example
     * CommonJS.Text.rpad('1', 5, '0');
     */
    rpad(str, padLen, padStr) {
        if ( padStr.length > padLen ) {
            return str;
        }
        str += '';
        padStr += '';
        while(str.length < padLen) {
            str += padStr;
        }
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
    },
};

CommonJS.Object = {
    /**
     * 인자로 받은 Object를 병합한 Object 반환
     * @param  {...any} sources
     * @returns
     * @example
     * CommonJS.Object.mergeObject(obj1, obj2, obj3);
     */
    mergeObject: function (...sources) {
        const newObj = {};
        return Object.assign(newObj, ...sources);
    },
    /**
     * Object를 전송 가능한 Data로 만듬
     *   - jQuery serialize()와 동일하나 Form은 지원하지 않음
     *   - Form serialize는 아래 링크 참고
     * @param {Object} obj
     * @example
     * CommonJS.Object.makeFormBody(obj);
     *
     * @link https://code.google.com/archive/p/form-serialize/downloads
     * @link https://gist.github.com/icetee/d650eb8195e1329903ac38818e5befa5
     */
    makeFormBody: function (obj) {
        const query = Object.keys(obj)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
            .join('&');
        return query;
    },
    /**
     * Object를 QueryString 으로 반환
     * @param {Object} obj
     * @returns
     * @example
     * CommonJS.Object.objectToQueryString(obj);
     */
    objectToQueryString: function (obj) {
        return '?' + CommonJS.Object.makeFormBody(obj);
    }
};

CommonJS.Valid = {
    /**
     * null 체크
     * - ( !val ) 으로 체크 가능
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isNull(val);
     */
    isNull: function (val) {
        return typeof val == 'undefined' || val === null || val === '';
    },
    /**
     * 공백, 빈 문자열 체크
     *  - 다음 형태로 대체 가능 (권장)
     *   [JavaScript] if ( !셀렉터.value.trim() ) { ... }
     *   [jQuery] if ( !셀렉터.val().trim() ) { ... }
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isBlank(val);
     */
    isBlank: function (val) {
        return (val && val.replace(/ /gi, '') === '');
    },
    /**
     * undefined 체크 ('undefined' 포함)
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isUndefined(val);
     */
    isUndefined: function (val) {
        return (typeof val === 'undefined' || val === null || val === '');
    },
    /**
     * 숫자 체크
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isNumber(val);
     */
    isNumber: function (val) {
        if (val === null || typeof val === 'undefined') {
            return false;
        }

        if (typeof val === 'number') {
            return !isNaN(val) && isFinite(val);
        } else if (typeof val === 'string') {
            return /^\d+$/.test(val);
        } else {
            return false;
        }
    },
    /**
     * 영문 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.Valid.isEnglish(val);
     */
    isEnglish: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[a-zA-Z]+$/.test(val);
    },
    /**
     * 영문, 공백 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.Valid.isEngBlank(val);
     */
    isEngBlank: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[a-zA-Z\s]+$/.test(val);
    },
    /**
     * 영문, 숫자 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.Valid.isEngNum(val);
     */
    isEngNum: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[a-zA-Z0-9]+$/.test(val);
    },
    /**
     * 한글 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.Valid.isHangul(val);
     */
    isHangul: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[가-힣]+$/.test(val);
    },
    /**
     * 한글, 공백 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.Valid.isHanBlank(val);
     */
    isHanBlank: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[가-힣\s]+$/.test(val);
    },
    /**
     * 한글, 영문 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.Valid.isHanEng(val);
     */
    isHanEng: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[가-힣a-zA-Z]+$/.test(val);
    },
    /**
     * 특수문자 체크
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isSpecial(val);
     */
    isSpecial: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /\W+$/.test(val);
    },
    /**
     * 공백 체크
     * @param {string} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.checkSpace(val);
     */
    checkSpace: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /\s/.test(val);
    },
    /**
     * 한글이 전혀 포함되어 있지 않은지 체크
     * @param {string} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isNotHangul(val);
     */
    isNotHangul: function (val) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        return /^[^가-힣]+$/.test(val);
    },
    /**
     * 문자열 길이 최소/최대 길이 준수 여부
     * @param {*} val 
     * @param {*} minLen 
     * @param {*} maxLen 
     * @returns 
     */
    isLengthOver: function (val, minLen, maxLen) {
        if ( typeof val !== 'string' || !val?.trim() ) {
            console.error('val is empty or null.');
            return false;
        }
    
        if ( typeof minLen !== 'number' || typeof maxLen !== 'number' ) {
            console.error('minLen or maxLen is not a number.');
            return false;
        }
    
        if ( minLen < 0 || maxLen < 0 || minLen > maxLen ) {
            console.error('minLen or maxLen is invalid.');
        }
    
        const valLen = val.length;
        return (valLen < minLen || valLen > maxLen);
    },
    /**
     * Object가 비어있는지 체크
     * @param {Object} param
     * @returns
     * @example
     * CommonJS.Valid.isEmptyObject(val);
     */
    isEmptyObject: function (param) {
        return Object.keys(param).length === 0 && param.constructor === Object;
    },
    /**
     * Array가 비어있는지 체크
     * @param {Array} param
     * @returns
     * @example
     * CommonJS.Valid.isEmptyArray(val);
     */
    isEmptyArray: function (param) {
        return Object.keys(param).length === 0 && param.constructor === Array;
    }
};

/**
 * ********************************************************************
 * CommonJS.DateTime.함수 대신 Moment.js 적극 권장
 *
 * @link https://momentjs.com/
 * @link https://github.com/kdk1026/vite-util/blob/master/src/utils/date.js
 * ********************************************************************
 */
CommonJS.DateTime = {
    /**
     * 날짜를 yyyy-MM-dd 형식으로 반환
     * @param {Date} date
     * @returns {string}
     * @example
     * CommonJS.DateTime.dateToString(date);
     */
    dateToString: function (date) {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1);
        let day = date.getDate();

        month = CommonJS.Text.addZero(month);
        day = CommonJS.Text.addZero(day);

        return [year, month, day].join('-');
    },
    /**
     * 시간을 HH:mm:ss 형식으로 반환
     * @param {Date} date
     * @returns {string}
     * @example
     * CommonJS.DateTime.timeToString(date);
     */
    timeToString: function (date) {
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        hour = CommonJS.Text.addZero(hour);
        minute = CommonJS.Text.addZero(minute);
        second = CommonJS.Text.addZero(second);

        return [hour, minute, second].join(':');
    },
    /**
     * 날짜 형식의 문자열을 Date 객체로 반환
     * @param {string} val
     * @returns {Date}
     * @example
     * CommonJS.DateTime.stringToDate(val);
     */
    stringToDate: function (val) {
        const date = new Date();
        val = val.replace(/-|\s|:/gi, '');

        if (!/^\d+$/.test(val)) {
            return false;
        }

        date.setFullYear(+val.substring(0, 4));
        date.setMonth(+val.substring(4, 6) - 1);
        date.setDate(+val.substring(6, 8));

        if (val.length == 14) {
            date.setHours(+val.substring(8, 10));
            date.setMinutes(+val.substring(10, 12));
            date.setSeconds(+val.substring(12, 14));
        }

        return date;
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 반환
     *  - day가 음수 = 이전 날짜
     *  - day가 양수 = 이후 날짜
     * @param {number} day
     * @returns {Date}
     * @example
     * CommonJS.DateTime.plusMinusDay(day);
     */
    plusMinusDay: function (day) {
        const date = new Date();
        const newDate = new Date();

        newDate.setDate(date.getDate() + day);
        return newDate;
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 반환
     *  - month가 음수 = 이전 날짜
     *  - month가 양수 = 이후 날짜
     * @param {number} month
     * @returns {Date}
     * @example
     * CommonJS.DateTime.plusMinusMonth(month);
     */
    plusMinusMonth: function (month) {
        const date = new Date();
        const newDate = new Date();

        newDate.setMonth(date.getMonth() + month);
        return newDate;
    },
    /**
     * 현재 날짜의 이전/이후 날짜를 반환
     *  - year가 음수 = 이전 날짜
     *  - year가 양수 = 이후 날짜
     * @param {number} year
     * @returns {Date}
     * @example
     * CommonJS.DateTime.plusMinusYear(year);
     */
    plusMinusYear: function (year) {
        const date = new Date();
        const newDate = new Date();

        newDate.setFullYear(date.getFullYear() + year);
        return newDate;
    },
    /**
     * 현재 시간의 이전/이후 시간을 반환
     *  - hours가 음수 = 이전 시간
     *  - hours가 양수 = 이후 시간
     * @param {number} hours
     * @returns {Date}
     * @example
     * CommonJS.DateTime.plusMinusHour(hours);
     */
    plusMinusHour: function (hours) {
        const date = new Date();
        const newDate = new Date();

        newDate.setHours(date.getHours() + hours);
        return newDate;
    },
    /**
     * 현재 시간의 이전/이후 시간을 반환
     *  - minutes가 음수 = 이전 시간
     *  - minutes가 양수 = 이후 시간
     * @param {number} minutes
     * @returns {Date}
     * @example
     * CommonJS.DateTime.plusMinusMinute(minutes);
     */
    plusMinusMinute: function (minutes) {
        const date = new Date();
        const newDate = new Date();

        newDate.setMinutes(date.getMinutes() + minutes);
        return newDate;
    },
    /**
     * 현재 시간의 이전/이후 시간을 반환
     *  - seconds가 음수 = 이전 시간
     *  - seconds가 양수 = 이후 시간
     * @param {number} seconds
     * @returns {Date}
     * @example
     * CommonJS.DateTime.plusMinusSecond(seconds);
     */
    plusMinusSecond: function (seconds) {
        const date = new Date();
        const newDate = new Date();

        newDate.setSeconds(date.getSeconds() + seconds);
        return newDate;
    },
    /**
     * 한글 요일 구하기
     * @param {Date} date
     * @returns {string}
     * @example
     * CommonJS.DateTime.getKorDayOfWeek(date);
     */
    getKorDayOfWeek: function (date) {
        const week = new Array('일', '월', '화', '수', '목', '금', '토');
        return week[date.getDay()];
    },
    /**
     * 현재 월의 마지막 일자를 반환
     * @param {Date} date
     * @example
     * CommonJS.DateTime.getLastDayOfMonth(date);
     */
    getLastDayOfMonth: function (date) {
        return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
    }
};

CommonJS.Format = {
    /**
     * 숫자 금액 형식 변환 (세자리 콤마)
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Format.formatNumber(num);
     */
    formatNumber: function (num) {
        if ( typeof value !== 'string' || !num?.trim() ) {
            console.warn('Invalid input value');
            return null;
        }
    
        return Number(num.replace(/,/g, '')).toLocaleString();
    },
    /**
     * 전화번호, 휴대폰 번호 형식 변환
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Format.addHyphenPhoneNumber(num);
     */
    addHyphenPhoneNumber: function (num) {
        const cleanNum = String(num).replace(/-/g, '');

        const phoneRegex = /^(?:(02)|(01\d)|(\d{3}))(\d+)(\d{4})$/;

        return cleanNum.replace(phoneRegex, (match, p1, p2, p3, p4, p5) => {
            let areaCode = '';
            if (p1) { // 02
                areaCode = p1;
            } else if (p2) { // 01x
                areaCode = p2;
            } else { // 3자리 지역번호 또는 휴대폰 앞 3자리
                areaCode = p3;
            }
    
            return `${areaCode}-${p4}-${p5}`;
        });
    },
    /**
     * 날짜 형식 변환
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Format.addHyphenDate(num);
     */
    addHyphenDate: function (num) {
        return (num + '').replace(/(\d{4})(0[1-9]|1[012])(0[1-9]|1\d|2\d|3[01])/, '$1-$2-$3');
    },
    /**
     * 특수 문자 제거
     * @param {string}} val
     * @returns {string}
     * @example
     * CommonJS.Format.removeSpecial(val);
     */
    removeSpecial: function (val) {
        const regExp = /[^\w\sㄱ-ㅎ가-힣]/g;
        return val.replace(regExp, '');
    }
};

CommonJS.FormatValid = {
    /**
     * 날짜 형식 체크 (YYYYMMDD, YYYY-MM-DD)
     * @param {string} val1
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isDate(val);
     */
    isDate: function (val) {
        const regExp = /^\d{4}-?(0[1-9]|1[012])-?(0[1-9]|[12]\d|3[01])$/;
        if ( !regExp.test(val) ) {
            return false;
        }
    
        const dateStr = val.replace(/-/g, '');
        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10);
        const day = parseInt(dateStr.substring(6, 8), 10);
    
        const date = new Date(year, month - 1, day);
    
        return date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;
    },
    /**
     * 시간 형식 체크 (HH24MI, HH24:MI, HH24MISS, HH24:MI:SS)
     * @param {string} val1
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isTime(val);
     */
    isTime: function (val) {
        const regExp = /^(0\d|1\d|2[0-3]):?([0-5]\d)(:?([0-5]\d))?$/;
        return regExp.test(val);
    },
    /**
     * 이메일 형식 체크
     * @param {string} val1
     * @param {(undefined|null|string)} val2
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isEmail(val1);
     * CommonJS.FormatValid.isEmail(val1, val2);
     */
    isEmail: function (val1, val2) {    
        let val = val1;
        if (val2) {
            val = val1 + '@' + val2;
        }
        const regExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regExp.test(val);
    },
    /**
     * 전화번호 형식 체크
     * @param {string} val1
     * @param {(undefined|null|string)} val2
     * @param {(undefined|null|string)} val3
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isPhoneNumber(val1);
     * CommonJS.FormatValid.isPhoneNumber(val1, val2, val3);
     */
    isPhoneNumber: function (val1, val2, val3) {    
        let val = val1;
        if ( val2 && val3 ) {
            val = val1 + '-' + val2 + '-' + val3;
        }
        /*
            02-서울
            031-경기, 032-인천, 033-강원
            041-충남, 042-대전, 043-충복, 044-세종
            051-부산, 052-울산, 053-대구, 054-경북, 055-경남
            061-전남, 062-광주, 063-전북, 064-제주
            070-인터넷 전화
            0502~0507-가상 전화번호
        */
        const regExp = /^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70|50[2-7])|01[016-9])-?(\d{3,4})-?(\d{4})$/;
        return regExp.test(val);
    },
    /**
     * 휴대폰 번호 형식 체크
     * @param {string} val1
     * @param {(undefined|null|string)} val2
     * @param {(undefined|null|string)} val3
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isCellPhoneNumber(val1);
     * CommonJS.FormatValid.isCellPhoneNumber(val1, val2, val3);
     */
    isCellPhoneNumber: function (val1, val2, val3) {    
        let val = val1;
        if ( val2 && val3 ) {
            val = val1 + '-' + val2 + '-' + val3;
        }
        const regExp = /^(01[016789])-?(\d{3, 4})-?(\d{4})+$/;
        return regExp.test(val);
    },
    /**
     * 사업자등록번호 형식 체크 (대한민국 3-2-5 또는 10자리 숫자 형식)
     * @param {string} val1
     * @param {(undefined|null|string)} val2
     * @param {(undefined|null|string)} val3
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isBusinessRegNumber(val1);
     * CommonJS.FormatValid.isBusinessRegNumber(val1, val2, val3);
     */
    isBusinessRegNumber: function (val1, val2, val3) {
        let val = val1;
        if ( val2 && val3 ) {
            val = val1 + '-' + val2 + '-' + val3;
        }
    
        const regExp = /^\d{3}-?\d{2}-?\d{5}$/;
        return regExp.test(val);
    },
    /**
     * 아이디 형식 체크 (첫 글자 영문, 7자 이상 30자 이내)
     * @param {string} val
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isId(val);
     */
    isId: function (val) {    
        const regExp = /^[a-zA-Z][a-zA-Z0-9]{6,29}$/;
        return regExp.test(val);
    },
    /**
     * 비밀번호 형식 체크
     * - 첫 글자 영문
     * - 첫 글자 이후 영문, 숫자, 특수문자 조합
     * - 영문/숫자/특수문자 중 2가지 조합 시, 10자리 이상
     * - 영문/숫자/특수문자 중 3가지 조합 시, 8자리 이상
     * @param {string} val 
     * @returns 
     * @example
     * CommonJS.FormatValid.isPassword(val);
     */
    isPassword: function (val) {
        // 1. 첫 글자 영문 확인 및 허용 문자 검증
        const allowedCharsRegExp = /^[a-zA-Z][a-zA-Z0-9\W]*$/;
        if ( !allowedCharsRegExp.test(val) ) {
            return false;
        }
    
        // 2. 조합 개수 확인
        const hasLetter = /[a-zA-Z]/.test(val);      // 영문 포함 여부
        const hasDigit = /\d/.test(val);             // 숫자 포함 여부
    
        // 특수문자 확인: 영문, 숫자, 언더스코어(`_`), 공백을 제외한 문자가 있는지 확인
        const hasSpecialChar = /[^a-zA-Z0-9\s]/.test(val);
    
        let combinationCount = 0;
        if (hasLetter) combinationCount++;
        if (hasDigit) combinationCount++;
        if (hasSpecialChar) combinationCount++;
    
        // 3. 길이 조건 최종 확인
        if (combinationCount === 2) {
            return val.length >= 10;
        } else if (combinationCount >= 3) {
            return val.length >= 8;
        } else {
            // 조합이 2가지 미만인 경우 (0 또는 1가지)
            return false;
        }
    },
    /**
     * URL 형식 체크
     * @param {string} val
     * @returns
     * @example
     * CommonJS.FormatValid.isUrl(val);
     */
    isUrl: function (val) {
        const regExp = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)(:\d+)?(\/\S*)?$/;
        return regExp.test(val);
    },
    /**
     * 안전한 URL인지 체크 (상대 경로, https://, http:// 만 허용)
     *  - 상대 경로는 '/'로 시작하는 경우
     * @param {*} val 
     * @example
     * CommonJS.FormatValid.isSafeUrl(val);
     */
    isSafeUrl: function (val) {
        const regExp = /^(?:\/|https?:\/\/(?:[\w-]+\.)+[\w-]+(?::\d+)?)\S*$/;
        return regExp.test(val);
    }
};

CommonJS.JSON = {
    /**
     * JSON String을 Object로 변환
     * @param {string} jsonStr
     * @returns {Object}
     * @example
     * CommonJS.JSON.jsonToObject(jsonStr);
     */
    jsonToObject: function (jsonStr) {
        if ( typeof jsonStr !== 'string' || !jsonStr?.trim() ) {
            console.error("유효하지 않은 JSON 문자열:", jsonStr);  
            return null;
        }

        try {
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("JSON 파싱 실패:", error);  
        }
    },
    /**
     * Object를 JSON String으로 변환
     * @param {Object} obj
     * @returns {string}
     * @example
     * CommonJS.JSON.objectToJsonString(obj);
     */
    objectToJsonString: function (obj) {
        if ( !obj || typeof obj !== 'object' ) {
            console.error("유효하지 않은 객체:", obj);  
            return null;
        }

        try {
            return JSON.stringify(obj);
        } catch (error) {
            console.error("JSON 문자열 변환 실패:", error);  
        }
    },
    /**
     * Object를 Tree 구조의 JSON String으로 변환
     * @param {Object} obj
     * @returns {string}
     * @example
     * CommonJS.JSON.objectToJsonStringPretty(obj);
     */
    objectToJsonStringPretty: function (obj) {
        if ( !obj || typeof obj !== 'object' ) {
            console.error("유효하지 않은 객체:", obj);  
            return null;
        }

        try {
            return JSON.stringify(obj, null, 2);
        } catch (error) {
            console.error("JSON 문자열 변환 실패:", error);  
        }
    }
};

CommonJS.File = {
    /**
     * 파일 정보 가져오기
     * @param {Element} fileElement
     * @returns {Object}
     * @example
     * [JavaScript]
     * // 파일 로드 전
     * var fileObj;
     * document.getElementById('file').addEventListener('change', function() {
     *      fileObj = CommonJS.File.getFileInfo(this);
     * });
     *
     * // 파일 로드 후
     * var fileObj = CommonJS.File.getFileInfo( document.getElementById('file') );
     *
     * [jQuery]
     * // 파일 로드 전
     * var fileObj;
     * $('#file').on('change', function() {
     *      fileObj = CommonJS.File.getFileInfo(this);
     * });
     *
     * // 파일 로드 후
     * var fileObj = CommonJS.File.getFileInfo( $('#file')[0] );
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/File
     */
    getFileInfo: function (fileElement) {
        let fileObj;
        if (window.File) {
            // IE 10 이상
            fileObj = fileElement.files[0];
        } else {
            // IE 9 이하
            const fso = new ActiveXObject("Scripting.FileSystemObject")
            const fsoFile = fso.getFile(fileElement.value);

            fileObj = {};
            fileObj.name = fsoFile.name;
            fileObj.type = fsoFile.type;
            fileObj.size = fsoFile.size;
        }
        return fileObj;
    },
    /**
     * 파일 확장자 가져오기
     * @param {Object}
     * @returns {string}
     * @example
     * CommonJS.File.getFileExt(fileObj);
     */
    getFileExt: function (fileObj) {
        const fileName = fileObj.name;
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    },
    /**
     * 파일 용량 단위 구하기
     * @param {number} size - 바이트
     * @returns {string}
     * @example
     * CommonJS.File.readableFileSize(size);
     */
    readableFileSize: function (size) {
        if (size == 0) return '0';
        const arrDataUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Number(Math.floor(Math.log(size) / Math.log(1024)));
        return Math.round(size / Math.pow(1024, i)) + ' ' + arrDataUnits[i];
    },
    /**
     * 이미지 미리보기
     * @param {Element} fileElement
     * @param {Element} imgElement
     * @example
     * [JavaScript]
     * CommonJS.File.previewImage(document.getElementById('file'), document.getElementById('img'));
     *
     * [jQuery]
     * CommonJS.File.previewImage($('#file')[0], $('#img')[0]);
     */
    previewImage: function (fileElement, imgElement) {
        if (window.addEventListener) {
            fileElement.addEventListener('change', fnSrc);
        } else {
            fileElement.attachEvent('onchange', fnSrc);
        }

        function fnSrc(e) {
            if (window.FileReader) {
                // IE 10 이상
                const reader = new FileReader();
                reader.onload = function (e) {
                    imgElement.src = e.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            } else {
                // IE 9 이하
                fileElement.select();
                imgElement.setAttribute("src", document.selection.createRange().text);
            }
        }
    },
    /**
     * 동영상 미리보기
     * @param {Element} fileElement
     * @param {Element} videoElement
     * @example
     * <video id="myVideo" width="300" height="300" autoplay controls></video>
     *
     * [JavaScript]
     * CommonJS.File.previewVideo(document.querySelector('#file'), document.querySelector('#myVideo'));
     *
     * [jQuery]
     * CommonJS.File.previewVideo($('#file')[0], $('#myVideo')[0]);
     *
     * <참고 - 버튼 클릭 이벤트 시, 일시 정지>
     *      document.querySelector('#myVideo').pause();
     */
    previewVideo: function (fileElement, videoElement) {
        fileElement.addEventListener('change', function (e) {
            const fileUrl = window.URL.createObjectURL(e.target.files[0]);
            videoElement.setAttribute('src', fileUrl);
        });
    },
    /**
     * 음악 미리듣기
     * @param {Element} fileElement
     * @param {Element} audioElement
     * @example
     * <audio id="myAudio" autoplay controls></audio>
     *
     * [JavaScript]
     * CommonJS.File.previewVideo(document.querySelector('#file'), document.querySelector('#myAudio'));
     *
     * [jQuery]
     * CommonJS.File.previewVideo($('#file')[0], $('#myAudio')[0]);
     *
     * <참고 - 버튼 클릭 이벤트 시, 일시 정지>
     *      document.querySelector('#myAudio').pause();
     */
    preListenAudio: function (fileElement, audioElement) {
        fileElement.addEventListener('change', function (e) {
            const fileUrl = window.URL.createObjectURL(e.target.files[0]);
            audioElement.setAttribute('src', fileUrl);
        });
    },
    /**
     * 파일 다운로드
     * @param {Element} Element
     * @param {undefined|string} fileName
     * @returns
     * @example
     * [JavaScript]
     * CommonJS.File.downloadFile( document.querySelector(셀렉터) );
     * CommonJS.File.downloadFile( document.querySelector(셀렉터), 파일명 );
     *
     * [jQuery]
     * CommonJS.File.downloadFile( $(셀렉터) );
     * CommonJS.File.downloadFile( $(셀렉터), 파일명 );
     */
    downloadFile: function (element, fileName) {
        const a = document.createElement("a");
        let downFileNm = fileName;
    
        // 헬퍼 함수: 요소의 태그 이름을 가져옵니다.
        const getTagName = (el) => {
            return el.prop ? el.prop('tagName') : el.nodeName;
        };
    
        // 헬퍼 함수: 속성 값을 가져옵니다. (jQuery 또는 바닐라 JS)
        const getAttr = (el, attrName) => {
            return el.attr ? el.attr(attrName) : el.getAttribute(attrName);
        };
    
        // 헬퍼 함수: 요소의 값을 가져옵니다. (jQuery 또는 바닐라 JS)
        const getValue = (el) => {
            return el.val ? el.val() : el.value;
        };
    
        // 헬퍼 함수: 요소의 HTML을 가져옵니다. (jQuery 또는 바닐라 JS)
        const getHtml = (el) => {
            return el.html ? el.html() : el.innerHTML;
        };
    
        // 헬퍼 함수: 파일 다운로드를 실행합니다.
        const executeDownload = (url, downloadName) => {
            a.href = url;
            a.download = downloadName;
            a.target = '_blank'; // 새 탭에서 다운로드
            a.click();
            a.remove();
        };
    
        const tagName = getTagName(element);
    
        const mediaTags = ['VIDEO', 'AUDIO', 'IMG'];
        const textBasedTags = ['TEXTAREA', 'INPUT', 'DIV'];
    
        if (mediaTags.includes(tagName)) {
            const src = getAttr(element, 'src');
    
            if (!src) {
                console.error('Download error: Media element has no src attribute.');
                return false;
            }
    
            if (downFileNm === undefined) {
                const lastDotIndex = src.lastIndexOf(".");
                const lastSlashIndex = src.lastIndexOf("/");
    
                if (lastDotIndex > -1 && lastSlashIndex > -1 && lastDotIndex > lastSlashIndex) {
                    const fileExt = src.substring(lastDotIndex + 1);
                    const tempFileName = src.substring(lastSlashIndex + 1, lastDotIndex);
                    downFileNm = `${tempFileName}.${fileExt}`;
                } else {
                    downFileNm = 'download'; // 확장자나 파일 이름 유추가 어려운 경우 기본값
                }
            }
            executeDownload(src, downFileNm);
        } else if (textBasedTags.includes(tagName)) {
            let content = '';
            let mimeType = '';
    
            if (tagName === 'INPUT') {
                const inputType = getAttr(element, 'type');
                if (inputType !== 'text') {
                    alert('파일 다운로드는\n(video, audio, img, textarea, input[type="text"], div)\n만 가능합니다.');
                    return false;
                }
                content = getValue(element);
                mimeType = 'text/plain';
                downFileNm = downFileNm === undefined ? 'output.txt' : downFileNm;
            } else if (tagName === 'TEXTAREA') {
                content = getValue(element);
                mimeType = 'text/plain';
                downFileNm = downFileNm === undefined ? 'output.txt' : downFileNm;
            } else if (tagName === 'DIV') {
                content = getHtml(element);
                mimeType = 'text/html';
                downFileNm = downFileNm === undefined ? 'output.html' : downFileNm;
            }
    
            if (content) {
                const blob = new Blob([content], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                executeDownload(url, downFileNm);
                window.URL.revokeObjectURL(url); // 메모리 해제
            } else {
                console.warn('Download error: No content to download from the element.');
            }
    
        } else {
            alert('파일 다운로드는\n(video, audio, img, textarea, input[type="text"], div)\n만 가능합니다.');
            return false;
        }
    },
    /**
     * 엑셀 파일 다운로드
     *   - 파일이 손상되지만 무시하면 열림
     *   - exportExcelBySheetJS 적극 권장
     * @param {string} fileName
     * @param {string} sheetName
     * @param {string} sheetHtml
     * @example
     * [JavaScript]
     * CommonJS.File.exportExcel( '엑셀파일명.xls', '시트', document.querySelector('#tb1').outerHTML );
     *
     * [jQuery]
     * CommonJS.File.exportExcel( '엑셀파일명.xls', '시트', $('#tb1').clone().wrapAll('<div/>').parent().html() );
     */
    exportExcel: function (fileName, sheetName, sheetHtml) {
        // 파일 체크
        const fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
        if ('xls' !== fileExt) {
            alert('xls 파일만 가능합니다.');
            return false;
        }

        const dataType = 'data:application/vnd.ms-excel';
        let html = '';
        html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
        html += '<head>';
        html += '<meta http-equiv="content-type" content="' + dataType + '; charset=UTF-8">';
        html += '<xml>';
        html += '<x:ExcelWorkbook>';
        html += '<x:ExcelWorksheets>';
        html += '<x:ExcelWorksheet>';
        html += '<x:Name>' + sheetName + '</x:Name>';
        html += '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>';
        html += '</x:ExcelWorksheet>';
        html += '</x:ExcelWorksheets>';
        html += '</xml>';
        html += '</head>';
        html += '<body>';
        html += sheetHtml;
        html += '</html>';

        const ua = window.navigator.userAgent;
        const blob = new Blob([html], {
            type: "application/csv;charset=utf-8;"
        });

        if ((ua.includes("MSIE ") || /Trident.*rv:11\.0/.test(navigator.userAgent)) && window.navigator.msSaveBlob) {
            // ie이고 msSaveBlob 기능을 지원하는 경우
            navigator.msSaveBlob(blob, fileName);
        } else {
            // ie가 아닌 경우 (바로 다운이 되지 않기 때문에 클릭 버튼을 만들어 클릭을 임의로 수행하도록 처리)
            const anchor = window.document.createElement('a');
            anchor.href = window.URL.createObjectURL(blob);
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();

            // 클릭(다운) 후 요소 제거
            document.body.removeChild(anchor);
        }
    },
    /**
     * 엑셀 파일 다운로드
     * @param {string} fileName
     * @param {string} sheetName
     * @param {Element} sheetElement
     * @returns
     * @example
     * [JavaScript]
     * CommonJS.File.exportExcelBySheetJS( '엑셀파일명.xlsx', '시트', document.querySelector('#tb1') );
     *
     * [jQuery]
     * CommonJS.File.exportExcelBySheetJS( '엑셀파일명.xlsx', '시트', $('#tb1') );
     *
     * @link https://mesonia.tistory.com/m/110
     * @link https://sheetjs.com/demo/table.html
     * @link https://github.com/SheetJS/sheetjs/tree/master/dist
     *
     * @description
     * xlsx.full.min.js 만 있으면 됨
     */
    exportExcelBySheetJS: function (fileName, sheetName, sheetElement) {
        // jQuery Element 지원 안함
        if (sheetElement.length != undefined) {
            const id = sheetElement.attr('id');
            sheetElement = document.querySelector('#' + id);
        }

        // 파일 체크
        const arrAllowExt = ['xls', 'xlsx', 'ods'];
        const fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

        if (!arrAllowExt.includes(fileExt)) {
            alert('xls, xlsx, ods 만 가능합니다.');
            return false;
        }

        const wb = XLSX.utils.table_to_book(sheetElement, {
            sheet: sheetName
        });
        const fn = undefined;

        XLSX.writeFile(wb, fn || fileName);
    },
    /**
     * PDF 파일 다운로드
     * @param {string} fileName
     * @param {Element} pdfElement
     * @returns
     * @example
     * [JavaScript]
     * CommonJS.File.exportPdf( '테스트.pdf', document.querySelector('#pdfDiv') );
     *
     * [jQuery]
     * CommonJS.File.exportPdf( '테스트.pdf', $('#pdfDiv')[0] );
     *
     * @link https://chichi-story.tistory.com/10
     * @link https://html2canvas.hertzen.com/
     * @link https://parall.ax/products/jspdf
     *
     * @description
     * html2canvas.min.js, jspdf.min.js
     */
    exportPdf: function (fileName, pdfElement) {
        // 파일 체크
        const fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

        if (fileExt != 'pdf') {
            alert('pdf만 가능합니다.');
            return false;
        }

        html2canvas(pdfElement).then(function (canvas) { //저장 영역 div id
            // 캔버스를 이미지로 변환
            const imgData = canvas.toDataURL('image/png');

            const imgWidth = 190; // 이미지 가로 길이(mm) / A4 기준 210mm
            const pageHeight = imgWidth * 1.414; // 출력 페이지 세로 길이 계산 A4 기준
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            const margin = 10; // 출력 페이지 여백설정
            const doc = new jsPDF('p', 'mm');
            let position = 0;

            // 첫 페이지 출력
            doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // 한 페이지 이상일 경우 루프 돌면서 출력
            while (heightLeft >= 20) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // 파일 저장
            doc.save(fileName);
        });
    }
};

CommonJS.FileValid = {
    /**
     * 지원 파일 체크 (문서, 이미지)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowFile(fileObj);
     */
    isAllowFile: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        
        const allowedExtensions = [
            'jpg', 'jpeg', 'png', 'gif', 'bmp',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',   
            'hwp', 'txt', 'zip'
        ];

        return allowedExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (문서)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowDoc(fileObj);
     */
    isAllowDoc: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp', 'txt'];
        return documentExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (이미지)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowImg(fileObj);
     */
    isAllowImg: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        return imageExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (오디오)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowAudio(fileObj);
     */
    isAllowAudio: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        const audioExtensions = ['mp3', 'wav'];
        return audioExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (비비디오)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowVideo(fileObj);
     */
    isAllowVideo: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];
        return videoExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (압축 파일)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowArchive(fileObj);
     */
    isAllowArchive: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        const archiveExtensions = ['zip', 'rar', '7z'];
        return archiveExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (실행 파일)
     *  - 결과가 true면 업로드 불가, false면 업로드 가능
     * @param {Object} fileObj
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.ifRunableFile(fileObj);
     */
    ifRunableFile: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj).toLowerCase();
        const runnableExtensions = [
            "bat", "bin", "cmd", "com", "cpl", "dll", "exe", "gadget", "inf1",
            "ins", "isu", "jse", "lnk", "msc", "msi", "msp", "mst", "paf",
            "pif", "ps1", "reg", "rgs", "scr", "sct", "sh", "shb", "shs",
            "u3p", "vb", "vbe", "vbs", "vbscript", "ws", "wsf", "wsh"
        ];
        return runnableExtensions.includes(ext);
    },
    /**
     * 지원 파일 체크 (커스텀)
     * @param {Object} fileObj
     * @param {Array} arrAllowExt
     * @returns
     * @example
     * CommonJS.FileValid.isAllowCustom(fileObj, arrAllowExt);
     */
    isAllowCustom: function (fileObj, arrAllowExt) {
        if ( Array.isArray(arrAllowExt) ) {
            const ext = CommonJS.File.getFileExt(fileObj);
            return arrAllowExt.includes(ext);
        } else {
            console.log('두 번째 인자가 Array가 아님');
            return false;
        }
    },
    /**
     * 파일 용량 체크
     * @param {Object} fileObj
     * @param {number} maxSize - byte 단위 (예: 1MB = 1024 x 1024 x 1)
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isFileMaxSize(fileObj, maxSize);
     */
    isFileMaxSize: function (fileObj, maxSize) {
        return (Number(fileObj.size) > Number(maxSize));
    },
    /**
     * 지원 파일 체크 (동영상 웹 표준)
     * @param {Object} fileObj
     * @returns
     *
     * @link https://kutar37.tistory.com/entry/HTML5-video-audio-%ED%83%9C%EA%B7%B8
     */
    isVideoStandard: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        const arrAllowExt = ['mp4', 'webm', 'ogg'];
        return arrAllowExt.includes(ext);
    },
    /**
     * 지원 파일 체크 (동영상 웹 추천)
     * @param {Object} fileObj
     * @returns
     */
    isVideoRecomend: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        return ext === 'mp4'
    },
    /**
     * 지원 파일 체크 (오디오 웹 추천)
     * @param {Object} fileObj
     * @returns
     */
    isAudioRecomend: function (fileObj) {
        const ext = CommonJS.File.getFileExt(fileObj);
        return ext === 'mp3'
    }
};

CommonJS.Cookie = {
    /**
     * 쿠키 생성
     * @param {string} name
     * @param {*} value
     * @param {number} expireSec
     * @param {(undefined|string)} domain
     * @example
     * CommonJS.Cookie.setCookie(name, value, expireSec);
     * CommonJS.Cookie.setCookie(name, value, expireSec, domain);
     */
    setCookie: function (name, value, expireSec, domain) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + Number(expireSec));

        if (domain) {
            let cookieStr = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + date.toGMTString() + ';';
            cookieStr += 'domain=' + encodeURIComponent(domain);
            document.cookie = cookieStr;
        } else {
            document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + date.toGMTString() + ';';
        }
    },
    /**
     * 쿠키 값 얻기
     * @param {string} name
     * @returns {*}
     * @example
     * CommonJS.Cookie.getCookie(name);
     */
    getCookie: function (name) {
        const regex = new RegExp('(^|;)\\s*' + name + '=([^;]*)');
        const match = regex.exec(document.cookie);

        return match ? decodeURIComponent(match[2]) : null;
    },
    /**
     * 쿠키 삭제
     * @param {string} name
     * @param {(undefined|string)} domain
     * @example
     * CommonJS.Cookie.deleteCookie(name);
     * CommonJS.Cookie.deleteCookie(name, domain);
     */
    deleteCookie: function (name, domain) {
        const date = new Date();
        date.setDate(date.getDate() - 1);

        if (domain) {
            document.cookie = name + '=' + '; path=/; expires=' + date.toGMTString() + '; domain=' + encodeURIComponent(domain);
        } else {
            document.cookie = name + '=' + '; path=/; expires=' + date.toGMTString() + ';';
        }
    }
};

CommonJS.Byte = {
    /**
     * Byte 길이 구하기 (UTF8)
     * @param {*} val
     * @returns {number}
     * @example
     * CommonJS.Byte.getByteLengthUtf8(val);
     */
    getByteLengthUtf8: function (val) {
        let char = '';
        let nCnt = 0;

        for (let i = 0; i < val.length; i++) {
            char = val.charCodeAt(i);
            if (char > 127) {
                nCnt += 3;
            } else {
                nCnt++;
            }
        }
        return nCnt;
    },
    /**
     * Byte 길이 구하기 (EUC_KR)
     * @param {*} val
     * @returns {number}
     * @example
     * CommonJS.Byte.getByteLengthEucKr(val);
     */
    getByteLengthEucKr: function (val) {
        let char = '';
        let nCnt = 0;

        for (let i = 0; i < val.length; i++) {
            char = val.charCodeAt(i);
            if (char > 127) {
                nCnt += 2;
            } else {
                nCnt++;
            }
        }
        return nCnt;
    },
    /**
     * input text/textarea의 Byte를 체크하여 nowByteEle에 표시
     * @param {Element - this} obj
     * @param {Element} nowByteEle
     * @param {boolean} isEucKr
     * @example
     * <input type="text" id="temp" />
     * <span id="nowByte">0</span>/100bytes
     *
     * [JavaScript]
     * document.querySelector('#temp').addEventListener('keyup', function() {
     *      CommonJS.Byte.checkByte( this, document.querySelector('#nowByte'), false );
     * });
     *
     * [jQuery]
     * $('#temp').keyup(function() {
     *      CommonJS.Byte.checkByte( $(this), $('#nowByte'), false );
     * });
     */
    checkByte: function(obj, nowByteEle, isEucKr) {
		let textVal;
		if ( obj.length === undefined ) {
			textVal = obj.value;
		} else {
			textVal = obj.val();
		}

        const textLen = textVal.length;

        let totalByte = 0;
        for (let i=0; i < textLen; i++) {
            const eachChar = textVal.charCodeAt(i);

            if ( eachChar > 127 ) {
                if (isEucKr) {
                    totalByte += 2;
                } else {
                    totalByte += 3;
                }
            } else {
                totalByte += 1;
            }
        }

		if ( nowByteEle.length === undefined ) {
			nowByteEle.innerText = totalByte;
		} else {
			nowByteEle.text( totalByte );
		}
    },
    /**
     * input text/textarea의 Byte를 체크하여 maxByte 초과 체크
     * @param {Element - this} obj
     * @param {(undefined|number)} maxByte
     * @param {boolean} isEucKr
     * @returns
     * @example
     * <!-- 심플한 방식 : data-code="abcd" -->
     * <input type="text" id="temp" data-max-byte="20" />
     *
     * [JavaScript]
     * document.querySelector('#temp').addEventListener('keyup', function() {
     *      CommonJS.Byte.isOverMaxByte( this, undefined, false );
     * });
     *
     * [jQuery]
     * $('#temp').keyup(function() {
     *      CommonJS.Byte.isOverMaxByte( $(this), undefined, false );
     * });
     */
    isOverMaxByte: function(obj, maxByte, isEucKr) {
        let textVal;
        let innerMaxByte = maxByte;

		if ( obj.length === undefined ) {
			textVal = obj.value;

			if ( innerMaxByte === undefined ) {
				innerMaxByte = obj.dataset.maxByte;
			}
		} else {
			textVal = obj.val();

			if ( innerMaxByte === undefined ) {
				innerMaxByte = obj.data('maxByte');
			}
		}

        const textLen = textVal.length;

        let totalByte = 0;
        for (let i=0; i < textLen; i++) {
            const eachChar = textVal.charCodeAt(i);

            if ( eachChar > 127 ) {
                if (isEucKr) {
                    totalByte += 2;
                } else {
                    totalByte += 3;
                }
            } else {
                totalByte += 1;
            }
        }

        return (totalByte > innerMaxByte);
    },
    /**
     * input text/textarea의 Byte를 체크하여 nowByteEle에 표시
     * input text/textarea의 Byte를 체크하여 maxByte 초과하면 자르기
     * @param {Element - this} obj 
     * @param {number} maxByte 
     * @param {Element} nowByteEle 
     * @param {boolean} isEucKr 
     * @example
     * <input type="text" id="temp" />
     * <span id="nowByte">0</span>/100bytes
     *
     * [JavaScript]
     * document.querySelector('#temp').addEventListener('keyup', function() {
     *      CommonJS.Byte.checkByteOverLimit( this, 1000, document.querySelector('#nowByte'), false );
     * });
     *
     * [jQuery]
     * $('#temp').keyup(function() {
     *      CommonJS.Byte.checkByteOverLimit( $(this), 1000, $('#nowByte'), false );
     * });
     */
    checkByteOverLimit: function(obj, maxByte, nowByteEle, isEucKr) {
		let textVal;
		if ( obj.length === undefined ) {
			textVal = obj.value;
		} else {
			textVal = obj.val();
		}

        const textLen = textVal.length;

        let totalByte = 0;
        let rleng = 0;

        for (let i=0; i < textLen; i++) {
            const eachChar = textVal.charCodeAt(i);

            if ( eachChar > 127 ) {
                if (isEucKr) {
                    totalByte += 2;
                } else {
                    totalByte += 3;
                }
            } else {
                totalByte += 1;
            }

            if ( totalByte <= maxByte ) {
                rleng = i + 1;
            }
        }

        if ( totalByte > maxByte ) {
            // obj의 값을 rleng 길이만큼 잘라서 업데이트
            if ( obj.length === undefined ) {
                obj.value = textVal.substr(0, rleng);
            } else {
                obj.val( textVal.substr(0, rleng) );
            }

            const updatedTextVal = (obj.length === undefined) ? obj.value : obj.val();
            totalByte = 0;
            for (let i = 0; i < updatedTextVal.length; i++) {
                const eachChar = updatedTextVal.charCodeAt(i);
                if (eachChar > 127) {
                    totalByte += isEucKr ? 2 : 3;
                } else {
                    totalByte += 1;
                }
            }
        }
        
        if ( nowByteEle.length === undefined ) {
            nowByteEle.innerText = totalByte;
        } else {
            nowByteEle.text( totalByte );
        }
    }
};

CommonJS.Escape = {
    /**
     * HTML Escape 처리
     * @param {*} val
     * @returns {string}
     * @example
     * CommonJS.Escape.escapeHtml(val);
     */
    escapeHtml: function (val) {
        if (typeof val !== 'string') {
            return '';
        }

        const replacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };

        return val.replace(/[&<>"'/]/g, (char) => replacements[char]);
    },
    /**
     * HTML Unescape 처리
     * @param {*} val
     * @returns {string}
     * @example
     * CommonJS.Escape.unescapeHtml(val);
     */
    unescapeHtml: function (val) {
        if (typeof val !== 'string') {
            return '';
        }

        const replacements = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#x27;': "'",
            '&#39;': "'",
            '&#x2F;': '/'
        };

        return val.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#39;|&#x2F;/g, (entity) => replacements[entity]);
    }
};

CommonJS.BrowserInfo = {
    /**
     * 브라우저 종류 및 버전 체크
     * @returns {Object}
     * @example
     * CommonJS.BrowserInfo.checkTypeVersion();
     */
    checkTypeVersion: function () {
        const agent = navigator.userAgent.toLowerCase();

        let browser = {
            name: null,
            version: null
        };

        // 브라우저 감지 및 버전 추출을 위한 헬퍼 함수
        const getBrowserInfo = (regex, name) => {
            const match = regex.exec(agent);
            if (match?.[1]) {   // match가 null이 아니고, match[1]이 존재하면
                browser.name = name;
                browser.version = match[1].replace(';', ''); // 버전 문자열에서 ';' 제거
                return true; // 매치 성공 시 true 반환
            }
            return false; // 매치 실패 시 false 반환
        };

        // 1. IE 체크 (MSIE 또는 Trident)
        // IE 10 이하 (msie), IE 11 (rv:xxx), Edge Legacy (edge)
        if (getBrowserInfo(/msie (\S+)/, "IE") || getBrowserInfo(/rv:(\S+).*trident/, "IE")) {
            // IE11의 경우 rv: 뒤에 버전이 오고 trident가 함께 나타납니다.
            // IE10 이하의 경우 msie 뒤에 버전이 옵니다.
            // 이미 getBrowserInfo에서 version을 설정했으므로 추가 작업 불필요.
        }
        // 2. Chromium 기반 브라우저 및 기타 브라우저 체크
        // 순서 중요: 좁은 범위부터 넓은 범위로 체크해야 정확합니다.
        // (예: Whale, Edge, Opera는 Chrome 기반이므로 먼저 체크)
        else if (getBrowserInfo(/whale\/(\S+)/, 'Whale')) {
            // 네이버 웨일 브라우저
        } else if (getBrowserInfo(/edg\/(\S+)/, 'Edge')) {
            // Chromium 기반 마이크로소프트 엣지
        } else if (getBrowserInfo(/opr\/(\S+)/, 'Opera')) {
            // Opera (Chromium 기반)
        } else if (getBrowserInfo(/chrome\/(\S+)/, 'Chrome')) {
            // 구글 크롬 (가장 마지막에 체크)
        } else if (getBrowserInfo(/firefox\/(\S+)/, 'Firefox')) {
            // 모질라 파이어폭스
        } else if (getBrowserInfo(/safari\/(\S+)/, 'Safari')) {
            // 사파리
            // Safari는 Chrome UA에 포함될 수 있으므로, Chrome 뒤에 위치
            // Safari 버전을 정확히 파악하려면 추가 로직 필요 (예: 'Version/X.Y Safari/Z')
            // 여기서는 간단히 safari/(\S+) 패턴만 사용합니다.
        } else {
            // 알려지지 않은 브라우저
            console.log("Unknown browser user agent:", agent);
        }

        return browser;
    },
    /**
     * 모바일 브라우저 여부 체크
     * @returns {boolean}
     * @example
     * CommonJS.BrowserInfo.isMobile();
     */
    isMobile: function () {
        if (navigator.userAgentData) {
            return navigator.userAgentData.mobile;
        }

        // userAgentData를 사용할 수 없는 경우 user agent 문자열을 분석합니다.
        const userAgent = navigator.userAgent;

        // 복잡도를 줄인 정규식 (정확도 저하 가능성 있음)
        return /(mobile|android|iphone|ipod|ipad|windows phone)/i.test(userAgent);
    },
    /**
     * 모바일 브라우저 여부 체크 (브라우저 모바일 모드도 모바일로 인식)
     * @returns {boolean}
     * @example
     * CommonJS.BrowserInfo.isUserAgentMobile();
     */
    isUserAgentMobile: function () {
        const userAgent = navigator.userAgent || window.opera;
    
        return (
            /android/i.test(userAgent) ||
            (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
            /blackberry|bb10|playbook/i.test(userAgent) ||
            /windows phone/i.test(userAgent) ||
            /webos|touchpad|hpwos/i.test(userAgent)
        );
    },
    /**
     * Android, iOS 여부 체크
     * @returns {boolean}
     * @example
     * CommonJS.BrowserInfo.isMobileOs();
     */
    isMobileOs: function () {
        const userAgent = navigator.userAgent;

        const androidRegex = /Android/i;
        const androidMatch = androidRegex.exec(userAgent);

        const iOSRegex = /iPhone|iPad|iPod/i;
        const iOSMatch = iOSRegex.exec(userAgent);

        return {
            Android: !!androidMatch,
            iOS: !!iOSMatch
        };
    },
    /**
     * UserAgent 에서 특정 문자열 유무 체크
     * @param {string} chkStr
     * @returns
     * @example
     * CommonJS.BrowserInfo.isCheckUserAgent('KAKAOTALK');
     *
     * @example
     * 주로 모바일 협업 시, 애플리케이션 접속 판별로 사용
     * - 커스터마이징 하지 않는 이상 모바일 웹, WebView 의 UserAgent는 동일
     */
    isCheckUserAgent: function(chkStr) {
        if ( typeof chkStr !== 'string' || !chkStr?.trim() ) {
            console.error('chkStr은 문자열이어야 하며, 빈 문자열이 아니어야 합니다.');
            return false;
        }

        const agent = navigator.userAgent;
		return agent.indexOf(chkStr) > -1;
    },
    /**
     * 응답 헤더 에서 특정 키와 그에 해당하는 문자열 유무 체크
     *   - 주의: 키는 모두 소문자로 체크해야 한다. (브라우저 네트워크탭에서 응답 헤더 복붙해서 소문자로 변경)
     * @param {string} key
     * @param {string} chkStr
     * @returns
     * @example
     * CommonJS.BrowserInfo.isCheckResponseHeader('vary', 'Origin');
     *
     * @example
     * 애플리케이션 접속 판별로도 사용되고, 요청 헤더에 추가되어 요청이 들어와서 꺼내야 하는 경우 등 사용
     */
    isCheckResponseHeader: function(key, chkStr) {
		const req = new XMLHttpRequest();
		req.open('GET', document.location, false);
		req.send(null);

		const allResponseHeaders = req.getAllResponseHeaders().split("\r\n");
		const headers = allResponseHeaders.reduce(function (acc, current){
			const parts = current.split(': ');
			acc[parts[0]] = parts[1];
			return acc;
		}, {});

        return (headers[key] === chkStr);
    },
    /**
     * 브라우저 언어 확인
     */
    getLanguage: function() {
        return navigator.language || navigator.userLanguage;
    },
    /**
     * 공인 IP 가져오기
     * @returns
     */
    getPublicIp: function() {
        const retJson = CommonJS.Http.commonAjax(false, 'get', 'https://api.ipify.org?format=json', null, {}, null);
        return retJson.ip;
    }
};

/**
 * ********************************************************************
 * JavaScript인 경우, IE 9 이하 고려 안함
 *   - IE 9 이하 대응 참고 : CommonJS.File.previewImage
 * ********************************************************************
 */
CommonJS.Input = {
    /**
     * 숫자만 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyNum( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyNum( $(셀렉터) );
     */
    onlyNum: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^\d]/gi, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^\d]/gi, ''));
                });
            }
        }
    },
    /**
     * 숫자만 입력 + 세 자리마다 콤마 자동 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyFormatNum( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyFormatNum( $(셀렉터) );
     */
    onlyFormatNum: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = fnTemp(e);
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val( fnTemp(e) );
                });
            }
        }

        function fnTemp(e) {
            let val = e.target.value.replace(/,/g, '').replace(/[^\d]/gi, '');
            const regExp = /(^[+-]?\d+)(\d{3})/;

            while (regExp.test(val)) {
                val = val.replace(regExp, '$1' + ',' + '$2');
            }

            return val;
        }
    },
    /**
     * 영문만 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyEng( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyEng( $(셀렉터) );
     */
    onlyEng: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^a-zA-Z]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^a-zA-Z]/g, ''));
                });
            }
        }
    },
    /**
     * 영문 + '_' 만 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyEngUnder( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyEngUnder( $(셀렉터) );
     */
    onlyEngUnder: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^a-zA-Z_]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^a-zA-Z_]/g, ''));
                });
            }
        }
    },
    /**
     * 영문 + 숫자만 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyEngNum( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyEngNum( $(셀렉터) );
     */
    onlyEngNum: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                });
            }
        }
    },
    /**
     * 영문 + SPACE 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyEngBlank( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyEngBlank( $(셀렉터) );
     */
    onlyEngBlank: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
                });
            }
        }
    },
    /**
     * 영문 + 숫자 + SPACE 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyEngNumBlank( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyEngNumBlank( $(셀렉터) );
     */
    onlyEngNumBlank: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''));
                });
            }
        }
    },
    /**
     * 한글만 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyHangul( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyHangul( $(셀렉터) );
     */
    onlyHangul: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/gi, ''));
                });
            }
        }
    },
    /**
     * 한글 + SPACE 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyHangulBlank( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyHangulBlank( $(셀렉터) );
     */
    onlyHangulBlank: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/gi, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/gi, ''));
                });
            }
        }
    },
    /**
     * 한글 + 영문 + 숫자 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyHanEngNum( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyHanEngNum( $(셀렉터) );
     */
    onlyHanEngNum: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/g, ''));
                });
            }
        }
    },
    /**
     * 한글 + 영문 + 숫자 + SPACE 입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.onlyHanEngNumBlank( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.onlyHanEngNumBlank( $(셀렉터) );
     */
    onlyHanEngNumBlank: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/g, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/g, ''));
                });
            }
        }
    },
    /**
     * 한글 입력 막기
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.blockingHangul( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.blockingHangul( $(셀렉터) );
     */
    blockingHangul: function (inputElement) {
        if (inputElement !== null) {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keyup', function (e) {
                    this.value = e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '');
                });
            } else {
                inputElement.keyup(function(e) {
                    $(this).val(e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/gi, ''));
                });
            }
        }
    },
    /**
     * 엔터키 이벤트 발생 시, 해당 엘리먼트 포커스로 이동
     * @param {Element} inputElement
     * @param {Element} focusElement
     * @example
     * [JavaScript]
     * CommonJS.Input.enterEventFocus( document.querySelector(셀렉터), document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.enterEventFocus( $(셀렉터), $(셀렉터) );
     */
    enterEventFocus: function (inputElement, focusElement) {
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keypress', function (e) {
                fnTemp(e);
            });
        } else {
            $(document).on('keypress', inputElement, function (e) {
                fnTemp(e);
            });
        }

        function fnTemp(e) {
            if (e.keyCode == 13) {
                focusElement.focus();
            }
        }
    },
    /**
     * 엔터키 이벤트 발생 시, 함수 실행
     * @param {Element} inputElement
     * @param {Function} callback
     * @example
     * [JavaScript]
     * CommonJS.Input.enterEventCallback( document.querySelector(셀렉터), 함수명 );
     *
     * [jQuery]
     * CommonJS.Input.onlyEngUnder( $(셀렉터), 함수명 );
     */
    enterEventCallback: function (inputElement, callback) {
        if (typeof callback === 'function') {
            if (inputElement.length === undefined) {
                inputElement.addEventListener('keypress', function (e) {
                    fnTemp(e);
                });
            } else {
                $(document).on('keypress', inputElement, function (e) {
                    fnTemp(e);
                });
            }
        }

        function fnTemp(e) {
            if (e.keyCode == 13) {
                callback();
            }
        }
    },
    /**
     * 휴대폰 번호 하이픈(-) 자동입력
     * @param {Element} inputElement 
     * @example
     * [JavaScript]
     * CommonJS.Input.formatCellPhoneNumber( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.formatCellPhoneNumber( $(셀렉터) );
     */
    formatCellPhoneNumber: function (inputElement) {
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                const formattedPhoneNumber = CommonJS.FormatValue.formatCellPhoneNumber(e.target.value);
                e.target.value = formattedPhoneNumber;
            });
        } else {
            inputElement.keyup(function(e) {
                const formattedPhoneNumber = CommonJS.FormatValue.formatCellPhoneNumber(e.target.value);
                $(e.target).val(formattedPhoneNumber);
            });
        }
    },
    /**
     * 전화번호 하이픈(-) 자동입력
     * @param {Element} inputElement 
     * @example
     * [JavaScript]
     * CommonJS.Input.formatPhoneNumber( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Input.formatPhoneNumber( $(셀렉터) );
     */
    formatPhoneNumber: function (inputElement) {
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                const formattedPhoneNumber = CommonJS.FormatValue.formatPhoneNumber(e.target.value);
                e.target.value = formattedPhoneNumber;
            });
        } else {
            inputElement.keyup(function(e) {
                const formattedPhoneNumber = CommonJS.FormatValue.formatPhoneNumber(e.target.value);
                $(e.target).val(formattedPhoneNumber);
            });
        }
    }
};

CommonJS.FormatValue = {
    /**
     * 휴대폰 번호 하이픈(-) 자동입력
     * @param {number} value
     * @example
     * [JavaScript]
     * const inputElement = document.querySelector(셀렉터);
     * inputElement.addEventListener('keyup', function(e) {
     *      const formattedPhoneNumber = CommonJS.FormatValue.formatCellPhoneNumber(e.target.value);
     *      e.target.value = formattedPhoneNumber;
     * });
     *
     * [jQuery]
     * const inputElement = $(셀렉터);
     * inputElement.keyup(function(e) {
     *      const formattedPhoneNumber = CommonJS.FormatValue.formatCellPhoneNumber(e.target.value);
     *      $(e.target).val(formattedPhoneNumber);
     * });
     */
    formatCellPhoneNumber: function (value) {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 8) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
    },
    /**
     * 전화번호 하이픈(-) 자동입력
     * @param {number} value 
     * @returns 
     * @example
     * [JavaScript]
     * const inputElement = document.querySelector(셀렉터);
     * inputElement.addEventListener('keyup', function(e) {
     *      const formattedPhoneNumber = CommonJS.FormatValue.formatPhoneNumber(e.target.value);
     *      e.target.value = formattedPhoneNumber;
     * });
     *
     * [jQuery]
     * const inputElement = $(셀렉터);
     * inputElement.keyup(function(e) {
     *      const formattedPhoneNumber = CommonJS.FormatValue.formatPhoneNumber(e.target.value);
     *      $(e.target).val(formattedPhoneNumber);
     * });
     */
    formatPhoneNumber: function (value) {
        if (!value) {
            return value;
        }

        const patterns = [
            {
                regex: /^(\d{2})(\d{3,4})(\d{4})$/,
                replacer: (match, p1, p2, p3) => `${p1}-${p2}-${p3}`,
                minLen: 9,
                maxLen: 10
            },
            {
                regex: /^(\d{2})(\d{3,6})$/,
                replacer: (match, p1, p2) => `${p1}-${p2}`,
                minLen: 3,
                maxLen: 8
            },
            {
                regex: /^(050[2-7])(\d{3,4})(\d{4})$/,
                replacer: (match, p1, p2, p3) => `${p1}-${p2}-${p3}`,
                minLen: 11,
                maxLen: 11
            },
            {
                regex: /^(050[2-7])(\d{3,7})$/,
                replacer: (match, p1, p2) => `${p1}-${p2}`,
                minLen: 5,
                maxLen: 11
            },
            {
                regex: /^(070)(\d{3,4})(\d{4})$/,
                replacer: (match, p1, p2, p3) => `${p1}-${p2}-${p3}`,
                minLen: 10,
                maxLen: 11
            },
            {
                regex: /^(070)(\d{3,7})$/,
                replacer: (match, p1, p2) => `${p1}-${p2}`,
                minLen: 4,
                maxLen: 10
            },
            {
                regex: /^(\d{3})(\d{3,4})(\d{4})$/,
                replacer: (match, p1, p2, p3) => `${p1}-${p2}-${p3}`,
                minLen: 10,
                maxLen: 11
            },
            {
                regex: /^(\d{3})(\d{3,7})$/,
                replacer: (match, p1, p2) => `${p1}-${p2}`,
                minLen: 4,
                maxLen: 9
            }
        ];

        for (const pattern of patterns) {
            if (phoneNumberLength >= pattern.minLen && phoneNumberLength <= pattern.maxLen) {
                const match = phoneNumber.match(pattern.regex);
                if (match) {
                    return pattern.replacer(...match);
                }
            }
        }

        return phoneNumber;
    }
};

/**
 * ********************************************************************
 * 현 시점에는 사용안할 듯 하지만... 사용하던 시절도 있어서 축가함
 * ********************************************************************
 */
CommonJS.SearchEngine = {
    /**
     * searchGoogle, searchNaver, searchDaum 에서 사용할 form 생성
     * @param {string} searchKeyword
     * @returns
     */
    makeNewForm: function (searchKeyword) {
        const newForm = document.createElement('form');
        newForm.name = 'form';
        newForm.method = 'get';
        newForm.action = '';
        newForm.target = '_blank';

        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', 'temp');
        input.setAttribute('value', searchKeyword);

        newForm.appendChild(input);

        return newForm;
    },
    /**
     * 구글 검색
     * @param {string} searchKeyword
     * @example
     * CommonJS.SearchEngine.searchGoogle('나무위키');
     */
    searchGoogle: function (searchKeyword) {
        const newForm = this.makeNewForm(searchKeyword);
        newForm.action = 'https://www.google.com/search';

        const field = newForm.querySelector('input[name="temp"]');
        field.setAttribute('name', 'q');

        document.body.appendChild(newForm);
        newForm.submit();
        document.body.removeChild(newForm);
    },
    /**
     * 네이버 검색
     * @param {string} searchKeyword
     * @example
     * CommonJS.SearchEngine.searchNaver('나무위키');
     */
    searchNaver: function (searchKeyword) {
        const newForm = this.makeNewForm(searchKeyword);
        newForm.action = 'https://search.naver.com/search.naver';

        const field = newForm.querySelector('input[name="temp"]');
        field.setAttribute('name', 'query');

        document.body.appendChild(newForm);
        newForm.submit();
        document.body.removeChild(newForm);
    },
    /**
     * 다음 검색
     * @param {string} searchKeyword
     * @example
     * CommonJS.SearchEngine.searchDaum('나무위키');
     */
    searchDaum: function (searchKeyword) {
        const newForm = this.makeNewForm(searchKeyword);
        newForm.action = 'https://search.daum.net/search';

        const field = newForm.querySelector('input[name="temp"]');
        field.setAttribute('name', 'q');

        document.body.appendChild(newForm);
        newForm.submit();
        document.body.removeChild(newForm);
    }
};

/**
 * ********************************************************************
 * XXX : SNS를 안해서 테스트 안해봄... shareKakao 만 프로젝트에서 해봄
 * ********************************************************************
 */
CommonJS.SnsShare = {
    /**
     * Facebook 공유
     * @param {string} url
     * @example
     * CommonJS.SnsShare.shareFacebook(url);
     */
    shareFacebook: function (url) {
        window.open(
            'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
        );
    },
    /**
     * Twitter 공유
     * @param {string} url
     * @example
     * CommonJS.SnsShare.shareTwitter(url);
     */
    shareTwitter: function (url) {
        window.open(
            'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url)
        );
    },
    /**
     * Kakao 텍스트 공유
     * @param {string} webUrl
     * @param {string} mobileWebUrl
     * @param {string} title - 공유 미리보기 제목
     * @param {string} imageUrl - 공유 미리보기 썸네일
     * @param {string} btnTitle
     * @example
     * CommonJS.SnsShare.shareKakaoText(text, webUrl, mobileWebUrl);
     *
     * @link https://developers.kakao.com/docs/latest/ko/getting-started/sdk-js
     * @link https://developers.kakao.com/docs/latest/ko/message/js-link
     */
    shareKakaoText: function (text, webUrl, mobileWebUrl) {
        Kakao.Link.sendDefault({
            objectType: 'text',
            text: text,
            link: {
                mobileWebUrl: mobileWebUrl,
                webUrl: webUrl,
            },
        });
    },
    /**
     * Kakao Story 공유
     * @param {string} url
     * @param {string} title
     * @example
     * CommonJS.SnsShare.shareKakaoStory(url, title);
     */
    shareKakaoStory: function (url, title) {
        Kakao.Story.share({
            url: url,
            text: title
        });
    },
    /**
     * 네이버 블로그 공유
     * @param {string} url
     * @param {string} title
     * @example
     * CommonJS.SnsShare.shareNaver(url, title);
     */
    shareNaver: function (url, title) {
        const encodedUrl = encodeURI(url);
        const encodedTitle = encodeURIComponent(title);
        const shareURL = "https://share.naver.com/web/shareView?url=" + encodedUrl + "&title=" + encodedTitle;
        document.location = shareURL;
    }
};

/**
 * ********************************************************************
 * JavaScript 에서 WebView 에 값 전달 - 프로젝트별로 JS 파일 생성하여 진행
 *      <Android>
 *          window.[WebViewBridge].[WebViewMethod](인자);
 *      </Android>
 *      <iOS>
 *          webkit.messageHandlers.[WebViewBridge].postMessage(인자);
 *      </iOS>
 *
 * WebView 에서 JavaScript 에 값 전달
 *   - JavaScript 에 특이사항은 없음 / 항상 보내는 입장에서만 특이사항이 발생
 *
 * 프로젝트에 따라 정석인 JavascriptBridge 대신 다른 방식으로 값 전달할 수 있음 (JS with WebView)
 *   - 모바일 개발자가 원하는 방식대로 맞혀주고, 테스트 해서 전달만 잘되면 된다... 제시한 방식이 편하다는데 어찌할 것인가...
 *
 *   예1) location.href="스키마://CallBackValue?" + obj;
 *   예2) alert('스키마://prepaid?value=' + vParamStr);
 * ********************************************************************
 * ※ iOS는 구글링만 한 결과
 *   (맥북이 없고.. 있어도 마우스 사용법도 다르고... xcode도 어느정도 익혀야 할테고... ObjectiveC/Swift도 모르고...)
 */
CommonJS.Mobile = {
    /**
     * SMS 문자 보내기
     *   - 연락처, 문자 내용 설정된 상태로 문자 보내기 화면으로 이동 시킴
     * @param {string|number} telNo
     * @param {string} content
     * @example
     * CommonJS.Mobile.sendSMS('010-9924-3732', '테스트');
     * CommonJS.Mobile.sendSMS(null, '테스트');
     */
    sendSMS: function (telNo, content) {
        if (CommonJS.BrowserInfo.isMobile()) {
            const mobileOs = CommonJS.BrowserInfo.isMobileOs().iOS ? 'ios' : 'android';

            if (CommonJS.FormatValid.isCellPhoneNumber(telNo)) {
                location.href = 'sms:' + telNo + (mobileOs == 'ios' ? '&' : '?') + 'body=' + encodeURIComponent(content);
            } else {
                location.href = 'sms:' + (mobileOs == 'ios' ? '&' : '?') + 'body=' + encodeURIComponent(content);
            }
        } else {
            console.log('모바일 플랫폼에서만 사용 가능합니다.');
        }
    },
    /**
     * 전화 걸기
     *   - 연락처 설정된 상태로 전화 걸기 화면으로 이동 시킴
     * @param {string|number} telNo
     * @example
     * CommonJS.Mobile.makeAcall('010-9924-3732');
     */
    makeAcall: function (telNo) {
        if (CommonJS.BrowserInfo.isMobile()) {
            if (CommonJS.FormatValid.isCellPhoneNumber(telNo)) {
                location.href = 'tel:' + telNo;
            }
        } else {
            console.log('모바일 플랫폼에서만 사용 가능합니다.');
        }
    },
    /**
     * 카메라 실행 (이미지)
     *   - (일반적인) accept, capture 속성이 없는 경우
     *          : 카메라, 캠코더, 파일
     *   - accept 속성만 있는 경우
     *          accept="image/*" : 작업 선택 - 카메라, 내 파일, 파일
     * @param {Element} fileElement
     * @param {Element} imgElement
     * @example
     * [JavaScript]
     * CommonJS.Mobile.runCamera( document.querySelector('#file'), document.querySelector('#img') );
     *
     * [jQuery]
     * CommonJS.Mobile.runCamera( $('#file')[0], $('#img')[0] );
     */
    runCamera: function (fileElement, imgElement) {
        fileElement.setAttribute('accept', 'image/*');
        fileElement.setAttribute('capture', 'camera');

        fileElement.addEventListener('change', function (e) {
            if (CommonJS.BrowserInfo.isMobile()) {
                const fileUrl = window.URL.createObjectURL(e.target.files[0]);

                imgElement.setAttribute("src", fileUrl);
                this.removeAttribute('capture');
            } else {
                // 카메라 실행이 목적이므로 실행 가능하더라도 실행 시키지 않음
                console.log('모바일 플랫폼에서만 사용 가능합니다.');
            }
        });
    },
    /**
     * 카메라 실행 (동영상)
     *   - (일반적인) accept, capture 속성이 없는 경우
     *          : 카메라, 캠코더, 파일
     *   - accept 속성만 있는 경우
     *          accept="video/*" : 작업 선택 - 카메라 캠코더, 내 파일, 파일
     * @param {Element} fileElement
     * @param {Element} imgElement
     * @example
     * [JavaScript]
     * CommonJS.Mobile.runCamera( document.querySelector('#file'), document.querySelector('#img') );
     *
     * [jQuery]
     * CommonJS.Mobile.runCamera( $('#file')[0], $('#img')[0] );
     */
    runCamcorder: function (fileElement, imgElement) {
        fileElement.setAttribute('accept', 'video/*');
        fileElement.setAttribute('capture', 'camcorder');

        fileElement.addEventListener('change', function (e) {
            if (CommonJS.BrowserInfo.isMobile()) {
                const fileUrl = window.URL.createObjectURL(e.target.files[0]);

                imgElement.setAttribute("src", fileUrl);
                this.removeAttribute('camcorder');
            } else {
                // 카메라 실행이 목적이므로 실행 가능하더라도 실행 시키지 않음
                console.log('모바일 플랫폼에서만 사용 가능합니다.');
            }
        });
    },
    /**
     * 음성 녹음 실행
     *   - (일반적인) accept, capture 속성이 없는 경우
     *          : 카메라, 캠코더, 파일
     *   - accept 속성만 있는 경우
     *          accept="audio/*" : 작업 선택 - 음성 녹음, 내 파일, 파일
     * @param {Element} fileElement
     * @param {Element} audioElement
     * @example
     * [JavaScript]
     * CommonJS.Mobile.runCamera( document.querySelector('#file'), document.querySelector('#audio') );
     *
     * [jQuery]
     * CommonJS.Mobile.runCamera( $('#file')[0], $('#audio')[0] );
     */
    runMicroPhone: function (fileElement, audioElement) {
        fileElement.setAttribute('accept', '    audio/*');
        fileElement.setAttribute('capture', 'microphone');

        fileElement.addEventListener('change', function (e) {
            if (CommonJS.BrowserInfo.isMobile()) {
                const fileUrl = window.URL.createObjectURL(e.target.files[0]);

                audioElement.setAttribute("src", fileUrl);
                this.removeAttribute('capture');

            } else {
                // 음성 녹음 실행이 목적이므로 실행 가능하더라도 실행 시키지 않음
                console.log('모바일 플랫폼에서만 사용 가능합니다.');
            }
        });
    },
    /**
     * 안드로이드 앱링크 or 딥링크 URL 생성
     * @param {string} host
     * @param {string} scheme
     * @param {string} packageName
     * @param {undefined|string} screen
     * @returns
     * @example
     * CommonJS.Mobile.makeAndroidAppLinkUrl('instagram.com', 'https', 'com.instagram.android');
     *
     * INTENT 방식 (Intent URI)
     *  
     * 이 링크가 작동하려면 다음 설정이 필수입니다.
     * AndroidManifest.xml
     *  <intent-filter>
     *      <action android:name="android.intent.action.VIEW" />
     *      <category android:name="android.intent.category.DEFAULT" />
     *      <category android:name="android.intent.category.BROWSABLE" />
     *
     *      <data android:host="호스트" android:scheme="스키마" />
     *  </intent-filter>
     */
    makeAndroidAppLinkUrl: function (host, scheme, packageName, screen) {
        if ( !host || !scheme || !packageName ) {
            console.error('host, scheme, packageName are required.');
            return '';
        }

        if ( !screen ) {
            return 'intent://' + host + '/#Intent;package=' + packageName + ';scheme=' + scheme + ';end';
        } else {
            return 'intent://' + host + '/#Intent;package=' + packageName + ';scheme=' + scheme + ';S.screen=' + screen + ';end';
        }
    },
    /**
     * IOS 앱링크 or 딥링크 URL 생성
     * 
     * URL 스킴 방식
     * 
     * 이 링크가 작동하려면 다음 설정이 필수입니다.
     * 1. Xcode 프로젝트에서 'Info' 탭을 엽니다.
     * 2. 'URL Types' 섹션으로 스크롤하여 새 항목을 추가합니다 ( '+' 버튼 클릭).
     * 3. 'Identifier' 필드에 고유한 식별자를 입력합니다 (예: 'com.yourcompany.yourapp').
     * 4. 'URL Schemes' 필드에 사용할 스키마를 입력합니다 (예: 'your-app-scheme').
     * 여기에 입력된 스키마가 makeURLSchemeIOSAppLinkUrl 함수의 'scheme' 매개변수와 일치해야 합니다.
     * @param {string} host 
     * @param {string} scheme 
     * @param {undefined|string} screen
     * @returns
     * @example
     * CommonJS.Mobile.makeURLSchemeIOSAppLinkUrl('instagram.com', 'https');
     */
    makeURLSchemeIOSAppLinkUrl: function (host, scheme, screen) {
        if ( !host || !scheme ) {
            console.error('host, scheme are required.');
            return '';
        }

        if ( !screen ) {
            return scheme + '://' + host;
        } else {
            return scheme + '://' + host + '?screen=' + screen;
        }
    },
    /**
     * 앱링크 or 딥링크 실행
     * @param {string} androidUrl
     * @param {string} iosUrl
     * @param {string} iosAppStoreUrl
     * @example
     * [Android]
     * CommonJS.Mobile.runAppLinkUrl('intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end', '', '');
     *
     * [iOS]
     * CommonJS.Mobile.runAppLinkUrl('', 'instagram://media', 'https://itunes.apple.com/kr/app/instagram/id389801252?mt=8');
     *
     * @link https://gomest.tistory.com/7
     */
    runAppLinkUrl: function (androidUrl, iosUrl, iosAppStoreUrl) {
        if ( !androidUrl || !iosUrl || !iosAppStoreUrl ) {
            console.error('androidUrl, iosUrl, iosAppStoreUrl are required.');
            return;
        }

        if (CommonJS.BrowserInfo.isMobile()) {
            if (CommonJS.BrowserInfo.isMobileOs().iOS) {
                // 1초 이후 반응이 없으면 앱스토어로 이동
                setTimeout(function () {
                    window.open(iosAppStoreUrl);
                }, 1000);

                location.href = iosUrl;
            } else {
                // 안드로이드는 설치되어 있지 않으면 자동으로 마켓으로 이동
                location.href = androidUrl;
            }
        } else {
            console.log('모바일 플랫폼에서만 사용 가능합니다.');
        }
    }
};

/**
 * ********************************************************************
 * GoogleMap - Geocoding 유료
 *   > https://cloud.google.com/maps-platform/pricing?hl=ko
 *
 *   > 기본 지도 : 위도, 경도에 따라 지도는 바뀌지만 경고 팝업 뜸 (콘솔 로그는 주저리 주저리 하는데, 결국 결제하라는 소리)
 *   > 무료 버전에서 Geocoding은 아예 동작하지 않음
 * ********************************************************************
 */
CommonJS.Map = {
    /**
     * 해당 주소로 카카오 지도 표시
     * @param {Element} mapElement
     * @param {string} addr
     * @example
     * CommonJS.Map.searchKakaoMap( document.querySelector('#map'), '경기도 성남시 삼평동 대왕판교로645번길 16' );
     *
     * @link https://apis.map.kakao.com/web/sample/addr2coord/
     */
    searchKakaoMap: function (mapElement, addr) {
        const container = mapElement;
        const options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };

        // 지도를 생성합니다
        const map = new kakao.maps.Map(container, options);

        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(addr, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });
                marker.setMap(map);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
            }
        });
    },
    /**
     * 해당 주소로 네이버 지도 표시
     * @param {string} mapElementId
     * @param {string} addr
     * @example
     * CommonJS.Map.searchNaverMap('map', '제주특별자치도 제주시 첨단로 242');
     *
     * @link https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html
     * @link https://navermaps.github.io/maps.js.ncp/docs/tutorial-Geocoder-Geocoding.html
     * @link https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-geocoder-geocoding.example.html
     * @link https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Marker.html
     */
    searchNaverMap: function (mapElementId, addr) {
        const mapOptions = {
            center: new naver.maps.LatLng(37.3595704, 127.105399),
            zoom: 15
        };

        const map = new naver.maps.Map(mapElementId, mapOptions);

        // Geocoder를 활용한 주소와 좌표 검색 API 호출하기
        naver.maps.Service.geocode({
            query: addr
        }, function (status, response) {
            if (status === naver.maps.Service.Status.ERROR) {
                return alert('Something wrong!');
            }

            // 성공 시의 response 처리
            const item = response.v2.addresses[0],
                point = new naver.maps.Point(item.x, item.y);

            map.setCenter(point);

            // 원하는 위치에 마커 올리기
            // eslint-disable-next-line
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(item.y, item.x),
                map: map
            });
        });
    }
};

CommonJS.Editor = {
    /**
     * CK Editor
     * @link https://ckeditor.com/ckeditor-5/online-builder/
     *
     * @example
     * [부분 유료]
     * 'Commercial feature' 플러그인만 사용 안하면 무료로 가능
     *
     * @example
     * [복사]
     *   - 파일 : ckeditor.js, ckeditor.js.map
     *
     * [이미지 업로드 처리]
     * @link https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html#implementing-a-custom-upload-adapter
     *   - The complete implementation - URL만 변경
     *
     * <파일 생성 후, import>
     * ckeditor_custom_upload.js
     *
     * [이미지 업로드 Backend 처리]
     * https://github.com/kdk1026/EditUpload/blob/main/src/main/java/kr/co/test/controller/EditorUploadController.java
     */
    ckeditor: function () {
        // 다운로드 경로\ckeditor5\sample\index.html 참고
        // html 모드는 지원 안하는 듯
    },
    /**
     * Summernote
     * @link https://summernote.org/getting-started/#requires-html5-doctype
     * @link https://summernote.org/getting-started/#without-bootstrap
     *
     * @description
     * Oops! jQuery 필수 (JQuery Lite 에서도 이상이 없을려나?)
     *
     * @example
     * [복사]
     *   - 폴더 : font, lang, plugin
     *   - 파일 : summernote-lite.min.css, summernote-lite.min.js, summernote-lite.min.js.map
     *
     *      ※ Bootstrap 환경에서는 summernote.min.css, summernote.min.js, summernote.min.js.map
     *
     * @example
     * [추가 옵션]
     * lang: "ko-KR",
     *
     * @example
     * [이미지 업로드 처리]
     * @link https://summernote.org/deep-dive/#custom-toolbar-popover
     *   - onImageUpload - 하단 참고
     *
     * [이미지 업로드 Backend 처리]
     * https://github.com/kdk1026/EditUpload/blob/main/src/main/java/kr/co/test/controller/EditorUploadController.java
     */
    summernote: function () {
        /*
            ...
                callbacks: {
                    onImageUpload: function(files) {
                        fnImageUpload( files[0], this );
                    }
                }
            });

        function fnImageUpload(file, editor) {
            const _param = new FormData();
            _param.append("upload", file);

            $.ajax({
                cache: false,
                traditional: true,
                contentType: false,
                processData : false,
                enctype: 'multipart/form-data',
                type: 'post',
                url: 'http://127.0.0.1:8080/summernote/img_upload',
                data: _param,
                success: function(result) {
                    $(editor).summernote('insertImage', result.url);
                },
                error: function(xhr, status, err) {
                    alert("code = "+ xhr.status + " message = " + xhr.responseText + " error = " + err);
                }
            });
        }
       */

        // html 모드 지원
    },
    /**
     * Toast Editor
     * @link https://ui.toast.com/tui-editor
     *
     * @description
     * NHN에서 만든 오픈소스 에디터 / Markdown 기반 지원 / npm 환경 최적화
     *
     * @example
     * [CDN 다운로드 후 복사]
     *   - https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js
     *   - https://uicdn.toast.com/editor/latest/toastui-editor.min.css
     *
     * [Editor is not defined]
     * @link https://velog.io/@khw970421/Toast-UI-%EC%82%AC%EC%9A%A9%EB%B2%95-%EA%B8%B0%EB%B3%B8%EB%B2%95
     *   - new Editor -> new toastui.Editor
     *
     * [이미지 업로드 처리]
     * @link https://velog.io/@unani92/Vue-toast-ui-editor-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
     * @link https://nhn.github.io/tui.editor/latest/ToastUIEditorCore#addHook
     *   - addImageBlobHook - 하단 참고
     * @link https://kodepaper.tistory.com/31
     *
     * [이미지 업로드 Backend 처리]
     * https://github.com/kdk1026/EditUpload/blob/main/src/main/java/kr/co/test/controller/EditorUploadController.java
     *
     */
    toastEditor: function () {
        /*
                hooks: {
                    addImageBlobHook: function (blob, callback) {
                        fnImageUpload(blob, function(data) {
                            const imgUrl = data;
                            callback(imgUrl);
                        });
                    }
                }

        async function fnImageUpload(blob, callback) {
            const _param = new FormData();
            _param.append("upload", blob);

            let imgUrl = null;
            let result;

            await fetch('http://127.0.0.1:8080/toast/img_upload', {
                method: 'post',
                body: _param
            })
            .then( (res) => {
                return res.json();
            })
            .then((json) => {
                imgUrl = json.url;
                callback(imgUrl);
            });
        }

        jQuery 사용 시, summernote 와 동일하되 다음 옵션만 추가하면 됨
            async: false
        */

        // html 모드는 지원 안하는 듯
    }
};

CommonJS.Http = {
    /**
     * 공통 JavaScript Ajax 처리
     *   - jQuery 사용하는 경우에는 jQuery Ajax 사용할 것 (commonJquery.js 링크 참고)
     *
     * @link https://github.com/kdk1026/JsUtilsKdk/blob/master/JsUtilsKdk/commonJquery.js
     *
     * @param {boolean} isAsync
     * @param {string} method
     * @param {string} url
     * @param {(undefined|Object)} header
     *   - param, callback 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {(undefined|Object|Element)} param
     *   - form인 경우에만 Element로 넘길 것
     * @param {(undefined|Function)} callback
     * @returns
     * @example
     * CommonJS.Http.commonAjax(isAsync, method, url, header, param, callback);
     *
     * @link https://202psj.tistory.com/1647
     *
     * @link http://tcpschool.com/ajax/ajax_server_xmlhttprequest
     * @description 놀랍도다... 어째든 Ajax를 IE 5 시절부터 사용했다는 말...
     *      윈도우 3.1, 95 시절에는 인터넷 존재를 몰라서... 플로피디스크 게임이나 주구장창 하던 시절인데...
     *      IE 7 시절부터 XMLHttpRequest 사용했다는 것도 놀라울 일... Ajax 라는 걸 jQuery 에서 처음 알아서...
     */
    commonAjax: function (isAsync, method, url, header, param, callback) {
        let retData = {};

        let contentType = "application/x-www-form-urlencoded; charset=utf-8";
        let params = (param == undefined) ? {} : param;

        if (!CommonJS.Valid.isEmptyObject(param)) {
            if (method.toLowerCase() === 'get') {
                url = url + CommonJS.Object.objectToQueryString(param);
            }
        }

        if (typeof param == 'object') {
            const classType = CommonJS.getClassType(param);

            if (classType === 'Object') {
                // serialize() 는 jQuery 만 지원
                params = CommonJS.Object.makeFormBody(param);
            }

            if (classType === 'Array') {
                contentType = "application/json; charset=utf-8";
                params = CommonJS.JSON.objectToJsonString(param);
            }
        }

        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open(method, url, isAsync);

        for (let key in header) {
            xmlHttp.setRequestHeader(key, header[key]);
        }

        if ('FORM' === param.nodeName) {
            const formData = new FormData(param);
            xmlHttp.send(formData);
        } else {
            xmlHttp.setRequestHeader('Content-type', contentType);

            if (!CommonJS.Valid.isEmptyObject(params)) {
                xmlHttp.send(params);
            } else {
                xmlHttp.send(null);
            }
        }

        if (isAsync) {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === xmlHttp.DONE) {
                    if (xmlHttp.status === 200 || xmlHttp.status === 201) {
                        try {
                            callback(CommonJS.JSON.jsonToObject(xmlHttp.response));
                        } catch (error) {
                            console.error(error);
                            callback(xmlHttp.response);
                        }
                    } else {
                        alert(xmlHttp.statusText);
                    }
                }
            }
        } else {
            if (xmlHttp.status !== 200) {
                alert(xmlHttp.statusText);
                return false;
            }

            if ((CommonJS.Valid.isUndefined(callback)) || (typeof callback != 'function')) {
                try {
                    retData = CommonJS.JSON.jsonToObject(xmlHttp.response);
                } catch (error) {
                    console.error(error);
                    retData = xmlHttp.response;
                }

            } else {
                try {
                    callback(CommonJS.JSON.jsonToObject(xmlHttp.response));
                } catch (error) {
                    console.error(error);
                    callback(xmlHttp.response);
                }
            }
        }

        return retData;
    },
    /**
     * 공통 Fetch 처리
     *
     * @link https://developer.mozilla.org/ko/docs/Web/API/Fetch_API
     * @link https://www.daleseo.com/js-window-fetch/
     *
     * @description IE는 지원하지 않음. 속 썩이던 IE 잘가~ 이제 슬슬 사라질 때 되지 않았나?
     * @description 비동기만 지원
     *
     * @param {string} method
     * @param {string} url
     * @param {(null|Headers)} header
     * @param {({}|Object)} param
     * @param {Function} callback
     * @example
     * CommonJS.Http.commonFetch(method, url, header, param, callback);
     *
     * @example
     * [화살표 함수]
     * (response) =>
     *      console.log(response)
     *
     * function(response) {
     *      console.log(response)
     * }
     */
    commonFetch: function (method, url, header, param, callback) {
        let contentType = "application/x-www-form-urlencoded; charset=utf-8";
        let params;

        if (!CommonJS.Valid.isEmptyObject(param)) {
            if (method.toLowerCase() === 'get') {
                url = url + CommonJS.Object.objectToQueryString(param);
            }
        }

        if (method.toLowerCase() === 'get') {
            params = null;
        }

        if (typeof param == 'object') {
            if (method.toLowerCase() === 'post') {
                const classType = CommonJS.getClassType(param);

                if (classType === 'Object') {
                    params = CommonJS.Object.makeFormBody(param);
                }

                if (classType === 'Array') {
                    contentType = "application/json; charset=utf-8";
                    params = CommonJS.JSON.objectToJsonString(param);
                }
            }
        }

        let myHeaders = new Headers();
        if (header == null) {
            myHeaders.append('Content-Type', contentType);
        } else {
            myHeaders = header;
        }

        if (myHeaders.get('Content-Type') == null) {
            myHeaders.append('Content-Type', contentType);
        }

        if ('FORM' === param.nodeName) {
            params = new FormData(param);
            myHeaders = new Headers();
        }

        fetch(url, {
            method: method,
            headers: myHeaders,
            body: params
        })
        .then((response) =>
            //console.log(response)
            response.json()
        )
        .then((data) =>
            callback(data)
        )
        .catch((error) =>
            alert('Error: ' + error)
        )
    }
};

CommonJS.Code = {
    /**
     * 바코드 생성
     *   - 라이브러리 사용법이 간단해서 굳이 공통 함수로 만들지는 않음
     * @link https://barcode-coder.com/en/barcode-jquery-plugin-201.html
     *
     * @description
     * jQuery 필수
     */
    makeBarcode: function () {},
    /**
     * QR 코드 생성
     * @param {Element} qrCodeDivElement
     * @param {string} text
     * @param {(undefined|number)} width
     * @param {(undefined|number)} height
     * @link https://github.com/davidshimjs/qrcodejs
     *
     * @example
     * [복사]
     *   - 파일 : qrcode.min.js
     *
     * @description 색상 옵션도 제공하지만 딱히 필요 없을거 같아서 생략함
     *
     * @example
     * [JavaScript]
     * CommonJS.Code.makeQrCode(document.querySelector( ID or Class ), 'http://www.naver.com');
     * CommonJS.Code.makeQrCode(document.querySelector( ID or Class ), 'http://www.naver.com', 128, 128);
     *
     * [jQuery]
     * CommonJS.Code.makeQrCode($( ID or Class ), '대한민국');
     * CommonJS.Code.makeQrCode($( ID or Class ), '대한민국', 128, 128);
     */
    makeQrCode: function (qrCodeDivElement, text, width, height) {
        let el = null;

        if (CommonJS.Valid.isUndefined(qrCodeDivElement.length)) {
            el = qrCodeDivElement;
        } else {
            if (CommonJS.Valid.isUndefined(qrCodeDivElement.attr('id'))) {
                el = document.querySelector('.' + qrCodeDivElement.attr('class'));
            }

            if (CommonJS.Valid.isUndefined(qrCodeDivElement.attr('class'))) {
                el = document.querySelector('#' + qrCodeDivElement.attr('id'));
            }
        }

        // eslint-disable-next-line
        new QRCode(el, {
            text: text,
            width: CommonJS.Valid.isUndefined(width) ? 128 : width,
            height: CommonJS.Valid.isUndefined(width) ? 128 : height
        });
    },
    /**
     * QR 코드, 바코드 스캐너
     * @param {Function} scanSuccCallBack
     * @param {Function} scanErrCallBack
     * @link https://blog.minhazav.dev/research/html5-qrcode
     *
     * @link https://github.com/mebjas/html5-qrcode
     *  - dist/html5-qrcode.min.js
     *
     * @link https://github.com/mebjas/html5-qrcode/tree/master/examples/html5
     *
     * @example
     * https://test-a9f7e.web.app/scanner.html
     *
     * @description 내부적으로는 이걸 이용한다고 한다. (안드로이드 사용하는 라이브러리의 JS 버전)
     *      https://zxing-js.github.io/library/
     *
     * @example
     * https://test-a9f7e.web.app/zxing.html
     *
     * @description QR코드는 그래도 쓸만
     *  바코드는 QR코드 넓이와 비슷한 것만 인식 가능
     */
    startScanner() {
        /*
            <div style="width: 500px" id="qr-reader"></div>
            <div id="qr-reader-results"></div>

            <script>
                window.onload = function() {
                    var lastResult;

                    function onScanSuccess(decodedText, decodedResult) {
                        if (lastResult !== decodedText) {
                            lastResult = decodedText;
                            document.querySelector('#qr-reader-results').innerText = decodedText;
                        }
                    }
                    let html5QrcodeScanner = new Html5QrcodeScanner(
                        "qr-reader", { fps: 10, qrbox: 250 });
                    html5QrcodeScanner.render(onScanSuccess);
                }
            </script>
        */
    }
};

/**
 * ********************************************************************
 * 소셜 로그인은 정확한 처리 방법을 아직 모름...
 *
 * 로그인 > 토큰 할당 > DB / LocalStorage / SessionStorage 에 저장해서 시간 체크해서 갱신 해주는게 맞는거 같기는 한데...
 * 현재까지는 토큰은 무시하고, 사용자 정보 가져오기 > 회원가입/로그인 처리
 *
 * <참고>
 * ※ 개발자 계정, 추가 등록 계정 외에 로그인 위한 설정
 *
 * - 카카오
 *   : 도메인 추가 가능
 *   : 앱 로고 등록, 사업자 등록번호 등록, OAuth Redirect URI 설정
 *   : 로그인 필수 동의 항목 (프로필 정보(닉네임/프로필 사진), 카카오계정(이메일) 외에는 선택 동의는 가능하지만 필수 동의는 검수 필요)
 *
 * - 네이버
 *   : 환경별로 각갇 등록
 *   : 앱 로고 등록
 *   : 검수요청 필수 (제공 정보 활용처 확인 - 이미지, 서비스 적용 형태 확인 - 이미지)
 *
 * ※ 나름 중요한 데이터 이므로 const 최대 활용
 *
 * ※ https://github.com/kdk1026/SocialLogin
 * ********************************************************************
 */
CommonJS.SocialLogin = {
    /**
     * 카카오 로그인
     *
     * @param {Function} userMeSucCallBack
     * @param {Function} userMeFailCallBak
     * @param {Function} loginFailCallBack
     *
     * @link https://developers.kakao.com/docs/latest/ko/kakaologin/js
     *
     * @example
     * CommonJS.SocialLogin.loginWithKakao(userMeSucCallBack, userMeFailCallBak, loginFailCallBack);
     */
    loginWithKakao: function (userMeSucCallBack, userMeFailCallBak, loginFailCallBack) {
        Kakao.Auth.login({
            success: function (response) {
                const accessToken = response.access_token;

                // 토큰 할당
                Kakao.Auth.setAccessToken(accessToken);

                // 사용자 정보 가져오기
                Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (response) {
                        userMeSucCallBack(response);
                    },
                    fail: function (error) {
                        userMeFailCallBak(error);
                    }
                });
            },
            fail: function (error) {
                loginFailCallBack(error);
            }
        });
    },
    /**
     * 카카오 로그아웃
     * @param {Function} logoutCallBack
     * @returns
     *
     * @example
     * CommonJS.SocialLogin.logoutWithKakao(logoutCallBack);
     */
    logoutWithKakao: function(logoutCallBack) {
        if (!Kakao.Auth.getAccessToken()) {
            console.log('Not logged in.');
            return;
        }

        Kakao.Auth.logout(function() {
            logoutCallBack( Kakao.Auth.getAccessToken() );
        });
    },
    /**
     * 네이버 로그인
     * @param {string} ClientId
     * @param {string} CallBackUrl
     * @param {string} serviceDoamin
     *
     * @link https://developers.naver.com/docs/login/web/web.md
     * @description SDK 버전 1
     *
     * @link https://developers.naver.com/docs/login/sdks/sdks.md
     * @description SDK 버전 2
     *
     * @link https://triplexlab.tistory.com/45
     *
     * @see SDK 버전2로 변경
     *
     * @example
     * <!-- 네이버아이디로로그인 버튼 노출 영역 -->
     * <div id="naverIdLogin" style="display: none;"></div>
     *
     * document.querySelector('#naverIdLogin').firstChild.click();
     *
     * CommonJS.SocialLogin.loginWithNaver(ClientId, 'http://127.0.0.1:5500/test/naver_login_callback.html');
     */
    loginWithNaver: function(ClientId, CallBackUrl)  {
        const naverLogin = new naver.LoginWithNaverId(
            {
                clientId: ClientId,
                callbackUrl: CallBackUrl,
                isPopup: true, /* 팝업을 통한 연동처리 여부 */
                loginButton: {color: "green", type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */
            }
        );

        /* 설정정보를 초기화하고 연동을 준비 */
        naverLogin.init();
    },
    /**
     * 네이버 로그인 콜백
     * @param {string} ClientId
     * @param {string} CallBackUrl
     * @returns
     *
     * @see SDK 버전2로 변경
     *
     * @example
     * const naverIdLogin = CommonJS.SocialLogin.loginWithNaverCallBack(ClientId, 'http://127.0.0.1:5500/test/naver_login_callback.html');
     *
     * // Callback의 처리. 정상적으로 Callback 처리가 완료될 경우 main page로 redirect(또는 Popup close)
     * window.addEventListener('load', function () {
     * 		naverLogin.getLoginStatus(function (status) {
     * 			if (status) {
     * 				// 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크
     * 				const email = naverLogin.user.getEmail();
     * 				const name = naverLogin.user.getName();
     * 				const mobile = naverLogin.user.getMobile();
     *
     * 				const profileObj = {};
     * 				profileObj.email = email;
     * 				profileObj.name = name;
     * 				profileObj.mobile = mobile;
     *
     * 				window.opener.getProfileSucCallBack(profileObj);
     * 				window.close();
     * 			} else {
     * 				console.log("callback 처리에 실패하였습니다.");
     * 			}
     * 		});
     * });
     */
    loginWithNaverCallBack: function(ClientId, CallBackUrl) {
        const naverLogin = new naver.LoginWithNaverId(
            {
                clientId: ClientId,
                callbackUrl: CallBackUrl,
                isPopup: true,
                callbackHandle: true
                /* callback 페이지가 분리되었을 경우에 callback 페이지에서는 callback처리를 해줄수 있도록 설정합니다. */
            }
        );

        /* 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */
        naverLogin.init();

        return naverLogin;
    },
    // 네이버 로그아웃은 JavaScript로 제공하지 않으므로 REST API 이용해야 함 (접근 토큰 삭제)

    /**
     * 구글 로그인
     *
     * @link https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin
     * @link https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
     *
     * @example
     * - 구글은 구현 이전에 설정부터 복잡하다...
     * - 설정 시, URI 입력하는 부분이 있는데 IP로 입력하면 구글 로그인이 안된다.
     *   예) http://127.0.0.1:5500 (X), http://localhost:5500 (O)
     *
     * - 유틸로 만들 수가 없다... 아래 링크의 블로그 주인장분이 너무 정리를 잘해주셨지만... 구현 방법만 정리해 놓음
     *
     * @link https://tyrannocoding.tistory.com/51
     */
    loginWithGoogle: function() {
        /*
            <head>
                ...
                <meta name ="google-signin-client_id" content="OAuth2.0 클라이언트ID">

                ...
                <script src="https://apis.google.com/js/platform.js?onload=googleAuthInit" async defer></script>
            </head>
            <body>
                <div class="g-signin2" id="GgCustomLogin"></div>
                <a href="#" onclick="googleSignOut();">Sign out</a>

                <script>
                    function googleAuthInit() {
                        gapi.load('auth2', function() {
                            gapi.auth2.init();

                            options = new gapi.auth2.SigninOptionsBuilder();
                            options.setPrompt('select_account');
                            options.setScope('profile').setScope('email');

                            gapi.auth2.getAuthInstance().attachClickHandler('GgCustomLogin', options, googleSignIn, googleSignFailure);
                        });
                    }

                    function googleSignIn(googleUser) {
                        const access_token = googleUser.getAuthResponse().access_token;

                        const method = 'get';
                        const url = 'https://people.googleapis.com/v1/people/me';

                        const param = {};
                        param.personFields = 'birthdays';
                        param.key = 'API 키';
                        param.access_token = access_token;

                        CommonJS.Http.commonFetch(method, url, null, param, googleSignInCallBack);
                    }

                    // 프로필을 가져온다
                    function googleSignInCallBack(data) {
                        const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
                        const profile = googleUser.getBasicProfile();

                        console.log(profile);
                    }

                    function googleSignFailure(t) {
                        console.log(t);
                    }

                    // 로그아웃
                    function googleSignOut() {
                        const auth2 = gapi.auth2.getAuthInstance();
                        auth2.signOut().then(function () {
                            console.log('User signed out.');
                        });
                        auth2.disconnect();
                    }
                </script>
            </body>
        */
    },
    /**
     * 페이스북 로그인
     *
     * @link https://developers.facebook.com/docs/facebook-login/web?locale=ko_KR
     *
     * @example
     * - 구글에 비하면 양반인듯
     * - 유틸로 만들 수가 없다... 구글 로그인 참고 블로그 주인장 분이 페이스북 로그인도 정리를 잘해주셔서... 구현 방법만 정리해 놓음
     * - 버전에 따라 구현 방식이 조금씩 달라지는듯 한데, 공식 레퍼런스 참고하면 된다. (구글에 비하면 천국임)
     *
     * @link https://tyrannocoding.tistory.com/50
     *
     * @description SDK 임포트 URL > 코드 받기
     *      나머지 내용 훑어보고, 전체 코드 예시 참고
     * @link https://developers.facebook.com/docs/facebook-login/web#loginbutton
     *
     * @description Language는 URL 참고 후, Locales URL 참고
     * @link https://developers.facebook.com/docs/javascript/advanced-setup
     * @link http://fbdevwiki.com/wiki/Locales
     *
     * @description 버전도 다르지만 따라할 수는 없으니 참고만 해서 진행하다 보면
     *      콘솔에 이런 오류가 발생한다. 그냥 한마디로 https 쓰라는거다...
     *      sdk.js?hash=8fdbc8422dc2ce03b58408150cdadd42:49 The Login Button plugin no longer works on http pages. Please update your site to use https for Facebook Login
     *
     *      링크를 통해 VS코드 Live Server에 https 적용
     * @link https://uiyoji-journal.tistory.com/89
     *
     * @description VS코드 settings.json 파일 열기 참고
     * @link https://velog.io/@devyang97/VScode-settings.json
     *
     * @description 안드로이드의 경우, 네이티브로 개발해야 함 (웹뷰 방식 중단)
     *
     * @example
     * 아이고야...까탑스럽구만...
     *
     * 기본설정: 기본 설정 열기(JSON)
     * liveServer.settings.https 검색 복사
     * 기본설정: 설정 열기(JSON)
     * 최하단에 추가
     * 설정 이후, Liver Server 다시 시작, 안전하지 않음 클릭
     */
    loginWithFacebook: function() {
        /*
            <head>
                ...
                <script async defer crossorigin="anonymous" src="https://connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v11.0&appId=앱ID&autoLogAppEvents=1" nonce="rRcgKpNh"></script>
            </head>
            <body>
                <div id="fb-root"></div>
                <div class="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"
                    scope="public_profile,email" onlogin="checkLoginState();"></div>

                <a href="#" onclick="facebookSignOut();">Sign out</a>

                <script>
                    window.fbAsyncInit = function() {
                        FB.init({
                            appId            : '앱ID',
                            autoLogAppEvents : true,
                            xfbml            : true,
                            version          : 'v11.0'
                        });

                        FB.getLoginStatus(function(response) {
                            statusChangeCallback(response);
                        });
                    });

                    function checkLoginState() {
                        FB.getLoginStatus(function(response) {
                            // console.log( response );
                            statusChangeCallback(response);
                        });
                    }

                    function statusChangeCallback(response) {
                        if (response.status === 'connected') {
                            callgetProfileAPI();
                        } else if (response.status === 'not_authorized') {
                            // 사람은 Facebook에 로그인했지만 앱에는 로그인하지 않았습니다.
                            alert('앱에 로그인해야 이용가능한 기능입니다.');
                        } else {
                            // 그 사람은 Facebook에 로그인하지 않았으므로이 앱에 로그인했는지 여부는 확실하지 않습니다.
                            alert('페이스북에 로그인해야 이용가능한 기능입니다.');
                        }
                    }

                    function callgetProfileAPI() {
                        FB.api('/me', function(response) {
                            console.log(response);
                        });
                    }

                    function facebookSignOut() {
                        FB.logout(function(response) {
                            console.log(response);
                        });
                    }
                </script>
            </body>
        */
    }
};

CommonJS.Addr = {
    /**
     * 다음(카카오) 주소찾기
     * @param {Element} zipcodeEl
     * @param {Element} roadAddrEl
     * @param {Element} jibunAddrEl
     *
     * @link https://postcode.map.daum.net/guide#sample
     *
     * @description 신청 과정 없이 그냥 사용
     *
     * @example
     * [JavaScript]
     * CommonJS.Addr.daumPostcode( document.querySelector('#zipcode'), document.querySelector('#roadAddr'), document.querySelector('#jibunAddr') );
     *
     * [jQuery]
     * CommonJS.Addr.daumPostcode( $('#zipcode'), $('#roadAddr'), $('#jibunAddr') );
     */
    daumPostcode: function(zipcodeEl, roadAddrEl, jibunAddrEl) {
        new daum.Postcode({
            oncomplete: function(data) {
                const zipcode = data.zonecode;
                const roadAddr = data.roadAddress;
                const jibunAddr = data.jibunAddress;

                if ( CommonJS.Valid.isUndefined(zipcodeEl.length) ) {
                    zipcodeEl.value = zipcode;
                } else {
                    zipcodeEl.val(zipcode);
                }

                if ( CommonJS.Valid.isUndefined(roadAddrEl.length) ) {
                    roadAddrEl.value = roadAddr;
                } else {
                    roadAddrEl.val(roadAddr);
                }

                if ( CommonJS.Valid.isUndefined(jibunAddrEl.length) ) {
                    jibunAddrEl.value = jibunAddr;
                } else {
                    jibunAddrEl.val(jibunAddr);
                }
            }
        }).open();
    },
    /**
     * 도로명주소 API
     *
     * @link https://www.juso.go.kr/addrlink/devCenterEventBoardDetail.do?regSn=731&noticeType=T&currentPage=1&keyword=&searchType=
     *
     * @description URL 별로 신청해야 함 - 운영(본인인증 O) / 개발(본인인증 X, 기간 제한)
     *
     * @example
     * - JavaScript는 지원하지 않지만 참고하기 위해 명시해 놓음
     * - 서버 사이드만 지원 (JSP | PHP | ASP)
     * - 팝업 API를 제공하지만 절대 사용하면 안된다. 세션이 끊어지는 이슈가 존재
     * - 위 링크는 검색 API를 팝업 API처럼 사용할 수 있도록 디자인 적용한 샘플소스, 그냥 이거 쓰면 된다.
     */
    roadAddrAPI: function() {
    }
};

CommonJS.Discount = {
    /**
     * 할인율 구하기
     * @param {number} originPrice
     * @param {number} salePrice
     * @returns
     */
    calcRate: function(originPrice, salePrice) {
        return Math.round(100 - ((salePrice / originPrice) * 100))
    },
    /**
     * 할인가 구하기
     * @param {number}} originPrice
     * @param {float|double} rate
     * @returns
     */
    clacSalePrice: function(originPrice, rate) {
        const savePrice = originPrice * (rate / 100);
        return originPrice - savePrice;
    }
};

CommonJS.Print = {
    /**
     * 해당 영역안의 내용만 프린트 출력 (주로 div, textarea)
     * @param {Element} Element
     * @description CSS 먹지 않음
     *
     * @example
     * [JavaScript]
     * CommonJS.Print.printTheArea( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Print.printTheArea( $(셀렉터) );
     */
    printTheArea: function (Element) {
        const win = window.open();
        self.focus();
        
        const printDoc = win.document;
        printDoc.open();

        let contentToPrint = '';
        if (Element.length === undefined) {
            contentToPrint = Element.innerHTML;
        } else {
            contentToPrint = Element.html();
        }

        printDoc.body.innerHTML = contentToPrint;

        printDoc.close();
        win.print();
        win.close();
    },
    /**
     * 해당 영역안의 내용만 프린트 출력 (주로 div, textarea)
     * @param {Element} Element
     * @description CSS 먹음, 프린트 이후 어쩔 수 없이 자동 새로고침
     * @description body에 CSS가 있는 경우, 안먹을 듯...
     *
     * @example
     * [JavaScript]
     * CommonJS.Print.printAsItIs( document.querySelector(셀렉터) );
     *
     * [jQuery]
     * CommonJS.Print.printAsItIs( $(셀렉터) );
     *
     * @link http://lemon421.cafe24.com/blog/textyle/23385
     */
    printAsItIs: function (Element) {
        let printBeforeBody;

        if (Element.length === undefined) {
            printBeforeBody = Element.innerHTML;
        } else {
            printBeforeBody = Element.html();
        }

        window.onbeforeprint = function () {
            document.body.innerHTML = printBeforeBody;
        }

        window.print();
        location.reload();
    }
};

CommonJS.Scroll = {
    /**
     * CommonJS.Scroll.scrollPagingDiv( document.querySelector(셀렉터), pageNum, callback );
     *
     * @description
     * function fnCallback(pageNum) {
     *      console.log( pageNum );
     *
     *      if ( totCnt > pageNum * pageSize ) {
     *          조회
     *      }
     * }
     *
     * @param {*} divElement
     * @param {*} pageNum
     * @param {*} callback
     */
    scrollPagingDiv: function(divElement, pageNum, callback) {
        divElement.addEventListener('scroll', function() {
            const scroll = this.scrollTop + this.clientHeight;
            const height = this.scrollHeight;

            if ( scroll >= height ) {
                pageNum ++;
                callback(pageNum);
            }
        });
    }
};

CommonJS.Masking = {
    /**
     * 이메일 마스킹
     *  - 원본 데이터 : abcdefg12345@naver.com
     *  - 변경 데이터 : ab**********@naver.com
     * @param {string} str
     * @returns
     * @example
     * CommonJS.Masking.email1( 'abcdefg12345@naver.com' );
     */
    email1: function(str) {
        let originStr = str;

        const emailMatch = originStr.match(/^([a-z0-9._-]+)@([a-z0-9._-]+\.[a-z0-9._-]+)$/i);

        if (!emailMatch || emailMatch.length < 3) {
            return originStr;
        }

        const username = emailMatch[1];
        const domain = emailMatch[2];

        let maskedUsername = username;
        if (username.length > 2) {
            maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
        }

        return `${maskedUsername}@${domain}`;
    },
    /**
     * 이메일 마스킹
     *  - 원본 데이터 : abcdefg12345@naver.com
     *  - 변경 데이터 : ab**********@nav******
     * @param {string} str
     * @returns
     * @example
     * CommonJS.Masking.email2( 'abcdefg12345@naver.com' );
     */
    email2: function(str) {
        let originStr = str;

        const emailRegex = /^([a-z0-9._-]+)@([^.]+\..+)$/i;
        const emailParts = emailRegex.exec(originStr);

        if (!emailParts) {
            return originStr;
        }

        const username = emailParts[1]; 
        const domain = emailParts[2];

        let maskedUsername = username;
        if (username.length > 2) {
            maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
        }

        let maskedDomain = domain;
        const lastDotIndex = domain.lastIndexOf('.');
        if (lastDotIndex > -1) {
            const domainName = domain.substring(0, lastDotIndex);
            const tld = domain.substring(lastDotIndex);
    
            if (domainName.length > 3) {
                maskedDomain = domainName.substring(0, 3) + '*'.repeat(domainName.length - 3) + tld;
            } else {
                maskedDomain = domainName + tld;
            }
        } else if (domain.length > 3) {
            maskedDomain = domain.substring(0, 3) + '*'.repeat(domain.length - 3);
        }
    
        return `${maskedUsername}@${maskedDomain}`;
    },
    /**
     * 이메일 마스킹
     *  - 원본 데이터 : abcdefg12345@naver.com
     *  - 변경 데이터 : abcd********@******
     * @param {string} str
     * @returns
     * @example
     * CommonJS.Masking.email3( 'abcdefg12345@naver.com' );
     */
    email3: function(str) {
        let originStr = str;

        const emailMatch = originStr.match(/^([a-z0-9._-]+)@([a-z0-9._-]+\.[a-z0-9._-]+)$/i);

        if (!emailMatch || emailMatch.length < 3) {
            return originStr;
        }

        const username = emailMatch[1];

        let maskedUsername = username;
        if (username.length > 4) {
            maskedUsername = username.substring(0, 4) + '*'.repeat(username.length - 4);
        }

        const maskedDomain = '******';
        return `${maskedUsername}@${maskedDomain}`;
    },
    /**
     * 휴대폰 번호 마스킹
     *  - 원본 데이터 : 01012345678, 변경 데이터 : 010****5678
     *  - 원본 데이터 : 010-1234-5678, 변경 데이터 : 010-****-5678
     *  - 원본 데이터 : 0111234567, 변경 데이터 : 011***4567
     *  - 원본 데이터 : 011-123-4567, 변경 데이터 : 011-***-4567
     * @param {string} str
     * @example
     * CommonJS.Masking.cellPhone( '01012345678' );
     */
    cellPhone: function(str) {
        let originStr = str;
        let phoneStr;
        let maskingStr;

        if ( CommonJS.Valid.isBlank(originStr) ) {
            return originStr;
        }

        // '-'가 없는 경우
        if ( originStr.toString().split('-').length != 3 ) {
            phoneStr = originStr.length < 11 ? originStr.match(/\d{10}/) : originStr.match(/\d{11}/);
            if ( CommonJS.Valid.isBlank(phoneStr) || CommonJS.Valid.isBlank(phoneStr[0]) ) {
                return originStr;
            }

            if ( originStr.length < 11 ) {
                // 1.1) 0110000000
                maskingStr = originStr.toString().replace(phoneStr[0], phoneStr[0].toString().replace(/(\d{3})(\d{3})(\d{4})/,'$1***$3'));
            } else {
                // 1.2) 01000000000
                maskingStr = originStr.toString().replace(phoneStr[0], phoneStr[0].toString().replace(/(\d{3})(\d{4})(\d{4})/,'$1****$3'));
            }
        } else {
            // '-'가 있는 경우
            phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/);
            if ( CommonJS.Valid.isBlank(phoneStr) || CommonJS.Valid.isBlank(phoneStr[0]) ) {
                return originStr;
            }

            if ( /-\d{3}-/.test(phoneStr) ) {
                // 2.1) 00-000-0000
                maskingStr = originStr.toString().replace(phoneStr[0], phoneStr[0].toString().replace(/-\d{3}-/g, "-***-"));
            } else {
                // 2.2) 00-0000-0000
                maskingStr = originStr.toString().replace(phoneStr[0], phoneStr[0].toString().replace(/-\d{4}-/g, "-****-"));
            }
        }

        return maskingStr;
    },
    /**
     * 주민등록 번호 마스킹 (Resident Registration Number, RRN Masking)
     *  - 원본 데이터 : 990101-1234567, 변경 데이터 : 990101-1******
     *  - 원본 데이터 : 9901011234567, 변경 데이터 : 9901011******
     * @param {string} str
     * @example
     * CommonJS.Masking.rrn( '990101-1234567' );
     */
    rrn: function(str) {
        let originStr = str;

        if ( CommonJS.Valid.isBlank(originStr) ) {
            return originStr;
        }

        const rrnRegex = /^(\d{6})-?([1-4]\d{6})$/;

        const match = rrnRegex.exec(originStr);
        if (match) {
            const frontPart = match[1];
            const backPart = match[2];

            const maskedBackPart = backPart.charAt(0) + '******'; // '1' + '******' = '1******'

            return `${frontPart}${originStr.includes('-') ? '-' : ''}${maskedBackPart}`;
        } else {
            return originStr;
        }
    },
    /**
     * 이름 마스킹
     *  - 원본 데이터 : 갓댐희, 변경 데이터 : 갓*희
     *  - 원본 데이터 : 하늘에수, 변경 데이터 : 하**수
     *  - 원본 데이터 : 갓댐, 변경 데이터 : 갓*
     * @param {string} str
     * @example
     * CommonJS.Masking.name(str);
     */
    name: function(str) {
        const userName = String(str); 

        if (userName.length <= 1) {
            return userName;
        }

        let frsName = userName.substring(0, 1);
        let lstName = userName.substring(userName.length - 1);

        let maskingName;

        if ( userName.length === 2 ) {
            maskingName = frsName + '*';
        } else {
            const midLength = userName.length - 2;
            const cnvMidName = '*'.repeat(midLength);
            maskingName = frsName + cnvMidName + lstName;
        }

        return maskingName;
    }
};

CommonJS.Time = {
    /**
     * 해당 시간 기준으로 방금 전 ~ 년 전
     * @param {Date} createdAt
     * @returns
     * @example
     * CommonJS.Time.displayedAt(createdAt);
     */
    displayedAt: function(createdAt) {
        const milliSeconds = new Date() - createdAt;

        const seconds = milliSeconds / 1000;
        if (seconds < 60) return `방금 전`

        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`

        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`

        const days = hours / 24;
        if (days < 7) return `${Math.floor(days)}일 전`

        const weeks = days / 7;
        if (weeks < 5) return `${Math.floor(weeks)}주 전`

        const months = days / 30;
        if (months < 12) return `${Math.floor(months)}개월 전`

        const years = days / 365;
        return `${Math.floor(years)}년 전`
    }
};

CommonJS.Url = {
    /**
     * URL 공유
     * @param {undefined|null|string} title 
     * @param {undefined|null|string} text 
     * @returns
     * @example
     * CommonJS.Url.shareUrl();
     */
    shareUrl: function(title, text) {
        const currentURL = window.location.href;
        if ( !currentURL.startsWith('https://') && !currentURL.includes('localhost') && !currentURL.includes('127.0.0.1') ) {
            alert('URL은 localhost, 127.0.0.1 또는 HTTPS여야 합니다.');
            return;
        }

        if ( navigator.share ) {
            navigator.share({
                title: title || '',
                text: text || '',
                url: window.location.href
            })
            .then(() => {
                console.log('콘텐츠가 성공적으로 공유되었습니다.');
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    alert('사용자가 공유를 취소했습니다.');
                } else {
                    alert('콘텐츠 공유 중 오류 발생: ' + error);
                }
            });
        } else {
            alert('공유 API가 지원되지 않는 브라우저입니다.');
        }
    }
};

CommonJS.Base64 = {
    /**
     * 순수 아스키 문자열 Base64 인코딩
     * @param {string} str 
     * @returns 
     * @example
     * CommonJS.Base64.encodeBase64(str);
     */
    encodeBase64: function(str) {
        if ( typeof str !== 'string' || !str?.trim() ) {
            return '';
        }
    
        return btoa(str);
    },
    /**
     * 순수 아스키 문자열 Base64 디코딩
     * @param {string} str 
     * @returns 
     * @example
     * CommonJS.Base64.decodeBase64(str);
     */
    decodeBase64: function(str) {
        if ( typeof str !== 'string' || !str?.trim() ) {
            return '';
        }
    
        return atob(str);  
    },
    /**
     * 유니코드 (한글 포함) Base64 인코딩
     * @param {string} str 
     * @returns 
     * @example
     * CommonJS.Base64.encodeUnicodeBase64(str);
     */
    encodeUnicodeBase64: function(str) {
        if ( typeof str !== 'string' || !str?.trim() ) {
            return '';
        }
    
        // 유니코드를 UTF-8 URL 인코딩 (퍼센트 인코딩) -> 이스케이프 시퀀스 -> 이진 문자열 -> Base64
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(p1) {
                return String.fromCharCode('0x' + p1);
            })); 
    },
    /**
     * 유니코드 (한글 포함) Base64 디코딩
     * @param {string} str 
     * @returns 
     * @example
     * CommonJS.Base64.decodeUnicodeBase64(str);
     */
    decodeUnicodeBase64: function(str) {
        if ( typeof str !== 'string' || !str?.trim() ) {
            return '';
        }
    
        // Base64 -> 이진 문자열 -> 이스케이프 시퀀스 -> UTF-8 URL 디코딩 -> 유니코드
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },
};