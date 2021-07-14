/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.12.02
 * @version 3.1
 * @description 특정 프로젝트가 아닌, 범용적으로 사용하기 위한 함수 모음
 * @description 버전업 기준 : 수정 / 함수 추가
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
 * @property {object} CommonJS.SearchEngine - 2021.07.10 추가
 * @property {object} CommonJS.SnsShare - 2021.07.10 추가
 * @property {object} CommonJS.Mobile - 2021.07.10 추가
 * @property {object} CommonJS.Map - 2021.07.11 추가
 * @property {object} CommonJS.Editor - 2021.07.11 추가 (설명 위주로만 정리)
 * @property {object} CommonJS.Http - 2021.07.12 추가
 * @property {object} CommonJS.Code - 2021.07.13 추가
 * @property {object} CommonJS.SocialLogin - 2021.07.14 추가
 * @property {method} prototype
 */
var CommonJS = {
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
        var _height = (CommonJS.Valid.isUndefined(height)) ? screen.height : Number(height);
        var _width = (CommonJS.Valid.isUndefined(width)) ? screen.width : Number(width);
        var _left = (screen.width / 2) - (width / 2);
        var _top = (screen.height / 2) - (height / 2);
        var _option = '';
        _option += 'height=' + _height + ', width=' + _width + ', left=' + _left + ', top=' + _top;
        _option += 'menubar=no, status=no';
        _option += 'resizable=no, scrollbars=no, toolbar=no'; // IE only | IE, Firefox, Opera only | IE, Firefox only

        window.open(url, name, _option);
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
                e.returnValue = false;
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
     * @example
     * CommonJS.scriptHook(fnValid, fnSubmit);
     */
    scriptHook: function (beforeFuncNm, funcNm, parent) {
        if (typeof parent == 'undefined') parent = window;
        for (var i in parent) {
            if (parent[i] === funcNm) {
                parent[i] = function () {
                    var Return = beforeFuncNm();
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
     * 해당 영역안의 내용만 프린트 출력 (주로 div, textarea)
     * @param {Element}} Element 
     * @example
     * [JavaScript]
     * CommonJS.printTheArea( document.querySelector(셀렉터) );
     * 
     * [jQuery]
     * CommonJS.printTheArea( $(셀렉터) );
     */
    printTheArea: function (Element) {
        var _win = null;
        _win = window.open();
        self.focus();
        _win.document.open();

        if (Element.length === undefined) {
            _win.document.write(Element.innerHTML);
        } else {
            _win.document.write(Element.html());
        }

        _win.document.close;
        _win.print();
        _win.close();
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
    getClassType(any) {
        return Object.prototype.toString.call(any).slice(8, -1);
    }
    /*
    // TODO : 퍼블을 해야 테스트를 해야하므로.... 적합한 환경 접하면 테스트하는 걸로....
    scrollPaging: function(divElement, pageNum) {
        divElement.scroll(function() {
            var _innerHeight = this.innerHeight();
            var _scroll = this.scrollTop() + this.innerHeight(); 
            var _height = this.scrollHeight; 

            if ( _scroll >= _height ) {
                pageNum ++;

                console.log('pageNum is : ', pageNum);
            }

            return pageNum;
        });
    }
    */
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
     * 클립보드 복사하기
     *   - IE 10 이하 고려 안함
     * @param {undefined|Element} textElement 
     * @param {undefined|string} string 
     * @example
     * 클릭 이벤트 시에만 동작 (onload 시에는 불가)
     * 
     * CommonJS.Text.copyToClipBoard( document.querySelector(셀렉터) );
     * CommonJS.Text.copyToClipBoard( null, '복사할 내용' );
     */
    copyToClipBoard: function (textElement, string) {
        if (textElement != null) {
            textElement.select();
            document.execCommand("Copy");
        } else {
            const _t = document.createElement("textarea");
            document.body.appendChild(_t);
            _t.value = string;
            _t.select();
            document.execCommand("Copy");
            document.body.removeChild(_t);
        }

        console.log('클립보드에 복사 되었습니다.');
    }
},

CommonJS.Object = {
    /**
     * 인자로 받은 Object를 병합한 Object 반환
     * @param  {...any} sources 
     * @returns
     * @example
     * CommonJS.Object.mergeObject(obj1, obj2, obj3);
     */
    mergeObject: function (...sources) {
        var _newObj = {};
        return Object.assign(_newObj, ...sources);
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
        var _query = Object.keys(obj)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
            .join('&');
        return _query;
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
}

CommonJS.Valid = {
    /**
     * 공백, 빈 문자열 체크 (undefined == null)
     *  - 다음 형태로 대체 가능 (권장)
     *   [JavaScript] if ( !셀렉터.value.trim() ) { ... }
     *   [jQuery] if ( !셀렉터.val().trim() ) { ... }
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isBlank(val);
     */
    isBlank: function (val) {
        return (val == null || val.replace(/ /gi, '') == '');
    },
    /**
     * undefined 체크 ('undefined' 포함)
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isUndefined(val);
     */
    isUndefined: function (val) {
        return (val == undefined || val === 'undefined');
    },
    /**
     * 숫자 체크
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isNumber(val);
     */
    isNumber: function (val) {
        var _re = /^[0-9]+$/;
        return _re.test(val);
    },
    /**
     * 특수문자 체크
     * @param {*} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isSpecial(val);
     */
    isSpecial: function (val) {
        var _re = /[`~!@#$%^&*()-_=+{}|;:'\",.<>?]+$/;
        return _re.test(val);
    },
    /**
     * 공백 체크
     * @param {string} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.checkSpace(val);
     */
    checkSpace: function (val) {
        if (val.search(/\s/) != -1) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 한글만 입력 체크
     * @param {string} val
     * @returns {boolean}
     * @example
     * CommonJS.Valid.isNotHangul(val);
     */
    isNotHangul: function (val) {
        var _re = /[a-zA-Z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
        return _re.test(val);
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
}

/**
 * ********************************************************************
 * CommonJS.DateTime.함수 대신 Moment.js 적극 권장
 * 
 * @link https://momentjs.com/
 * @link https://github.com/kdk1026/node_utils/blob/main/libs/date.js
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
        var _year = date.getFullYear();
        var _month = (date.getMonth() + 1);
        var _day = date.getDate();

        _month = CommonJS.Text.addZero(_month);
        _day = CommonJS.Text.addZero(_day);

        return [_year, _month, _day].join('-');
    },
    /**
     * 시간을 HH:mm:ss 형식으로 반환
     * @param {Date} date
     * @returns {string}
     * @example
     * CommonJS.DateTime.timeToString(date);
     */
    timeToString: function (date) {
        var _hour = date.getHours();
        var _minute = date.getMinutes();
        var _second = date.getSeconds();

        _hour = CommonJS.Text.addZero(hour);
        _minute = CommonJS.Text.addZero(minute);
        _second = CommonJS.Text.addZero(second);

        return [_hour, _minute, _second].join(':');
    },
    /**
     * 날짜 형식의 문자열을 Date 객체로 반환
     * @param {string} val
     * @returns {Date}
     * @example
     * CommonJS.DateTime.stringToDate(val);
     */
    stringToDate: function (val) {
        var _date = new Date();
        val = val.replace(/-|\s|:/gi, '');

        if (!/^[\d]+$/.test(val)) {
            return false;
        }

        _date.setFullYear(val.substr(0, 4));
        _date.setMonth(val.substr(4, 2) - 1);
        _date.setDate(val.substr(6, 2));

        if (val.length == 14) {
            _date.setHours(val.substr(8, 2));
            _date.setMinutes(val.substr(10, 2));
            _date.setSeconds(val.substr(12, 2));
        }

        return _date;
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
        var _date = new Date();
        var _newDate = new Date();

        _newDate.setDate(_date.getDate() + day);
        return _newDate;
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
        var _date = new Date();
        var _newDate = new Date();

        _newDate.setMonth(_date.getMonth() + month);
        return _newDate;
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
        var _date = new Date();
        var _newDate = new Date();

        _newDate.setFullYear(_date.getFullYear() + year);
        return _newDate;
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
        var _date = new Date();
        var _newDate = new Date();

        _newDate.setHours(_date.getHours() + hours);
        return _newDate;
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
        var _date = new Date();
        var _newDate = new Date();

        _newDate.setMinutes(_date.getMinutes() + minutes);
        return _newDate;
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
        var _date = new Date();
        var _newDate = new Date();

        _newDate.setSeconds(_date.getSeconds() + seconds);
        return _newDate;
    },
    /**
     * 한글 요일 구하기
     * @param {Date} date
     * @returns {string}
     * @example
     * CommonJS.DateTime.getKorDayOfWeek(date);
     */
    getKorDayOfWeek: function (date) {
        var _week = new Array('일', '월', '화', '수', '목', '금', '토');
        return _week[date.getDay()];
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
}

CommonJS.Format = {
    /**
     * 숫자 금액 형식 변환 (세자리 콤마)
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Format.formatNumber(num);
     */
    formatNumber: function (num) {
        return (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    },
    /**
     * 전화번호, 휴대폰 번호 형식 변환
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Format.addHyphenPhoneNumber(num);
     */
    addHyphenPhoneNumber: function (num) {
        return (num + '').replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
    },
    /**
     * 날짜 형식 변환
     * @param {number} num
     * @returns {string}
     * @example
     * CommonJS.Format.addHyphenDate(num);
     */
    addHyphenDate: function (num) {
        return (num + '').replace(/([0-9]{4})(0[1-9]|1[012])(0[1-9]|1[0-9]|2[0-9]|3[01])/, '$1-$2-$3');
    },
    /**
     * 특수 문자 제거
     * @param {string}} val
     * @returns {string}
     * @example
     * CommonJS.Format.removeSpecial(val);
     */
    removeSpecial: function (val) {
        var _re = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        return val.replace(_re, '');
    }
}

CommonJS.FormatValid = {
    /**
     * 날짜 형식 체크 (YYYYMMDD, YYYY-MM-DD)
     * @param {string} val1
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isDate(val);
     */
    isDate: function (val) {
        var _re = /^[0-9]{4}-?(0[1-9]|1[012])-?(0[1-9]|1[0-9]|2[0-9]|3[01])+$/;
        return _re.test(val);
    },
    /**
     * 시간 형식 체크 (HH24MI, HH24:MI, HH24MISS, HH24:MI:SS)
     * @param {string} val1
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isTime(val);
     */
    isTime: function (val) {
        var _re = /^([1-9]|[01][0-9]|2[0-3]):?([0-5][0-9])?(:?([0-5][0-9]))+$/;
        return _re.test(val);
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
        var _val = val1;
        if (!CommonJS.Valid.isBlank(val2)) {
            _val = val1 + '@' + val2;
        }
        var _re = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})+$/;
        return _re.test(_val);
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
        var _val = val1;
        if (!CommonJS.Valid.isBlank(val2) && !CommonJS.Valid.isBlank(val3)) {
            _val = val1 + '-' + val2 + '-' + val3;
        }
        /*
            02-서울
            031-경기, 032-인천, 033-강원
            041-충남, 042-대전, 043-충복, 044-세종
            051-부산, 052-울산, 053-대구, 054-경북, 055-경남
            061-전남, 062-광주, 063-전북, 064-제주
            0505-평생번호/인터넷 팩스 번호, 0507-안심번호
            070-인터넷 전화
        */
        var _re = /^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|505|507|70))-?(\d{3,4})-?(\d{4})$/;
        return _re.test(_val);
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
        var _val = val1;
        if (!CommonJS.Valid.isBlank(val2) && !CommonJS.Valid.isBlank(val3)) {
            _val = val1 + '-' + val2 + '-' + val3;
        }
        var _re = /^(01[016789])-?(\d{3,4})-?(\d{4})+$/;
        return _re.test(_val);
    },
    /**
     * 사업자등록번호 형식 체크
     * @param {string} val1
     * @param {(undefined|null|string)} val2
     * @param {(undefined|null|string)} val3
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isBusinessRegNumber(val1);
     * CommonJS.FormatValid.isBusinessRegNumber(val1, val2, val3);
     */
    isBusinessRegNumber: function (val1, val2, val3) {
        var _val = val1;
        if (!CommonJS.Valid.isBlank(val2) && !CommonJS.Valid.isBlank(val3)) {
            _val = val1 + '-' + val2 + '-' + val3;
        }
        var _re = /^[(\d{3})-?(\d{2})-?(\d{5})+$]/;
        return _re.test(_val);
    },
    /**
     * 아이디 형식 체크 (첫 글자 영문, 7자 이상 30자 이내)
     * @param {string} val
     * @returns {boolean}
     * @example
     * CommonJS.FormatValid.isId(val);
     */
    isId: function (val) {
        var _re = /^[a-zA-Z](?=.*[a-zA-Z])(?=.*[0-9]).{6,29}$/;
        return _re.test(val);
    },
    /**
     * 비밀번호 형식 체크 (영문, 숫자, 특수문자 조합 8자 이상)
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.FormatValid.isPassword(val);
     */
    isPassword: function (val) {
        var _re = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[^\w\s]).{8,}$/;
        return _re.test(val);
    },
    /**
     * URL 형식 체크
     * @param {*} val 
     * @returns 
     * @example
     * CommonJS.FormatValid.isUrl(val);
     */
    isUrl: function (val) {
        var _re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return _re.test(val);
    }
}

CommonJS.JSON = {
    /**
     * JSON String을 Object로 변환
     * @param {string} jsonStr
     * @returns {Object}
     * @example
     * CommonJS.JSON.jsonToObject(jsonStr);
     */
    jsonToObject: function (jsonStr) {
        return JSON.parse(jsonStr);
    },
    /**
     * Object를 JSON String으로 변환
     * @param {Object} obj
     * @returns {string}
     * @example
     * CommonJS.JSON.objectToJsonString(obj);
     */
    objectToJsonString: function (obj) {
        return JSON.stringify(obj);
    },
    /**
     * Object를 Tree 구조의 JSON String으로 변환
     * @param {Object} obj
     * @returns {string}
     * @example
     * CommonJS.JSON.objectToJsonStringPretty(obj);
     */
    objectToJsonStringPretty: function (obj) {
        return JSON.stringify(obj, null, 2);
    }
}

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
        var _fileObj;
        if (window.File) {
            // IE 10 이상
            _fileObj = fileElement.files[0];
        } else {
            // IE 9 이하
            var _fso = new ActiveXObject("Scripting.FileSystemObject")
            var _fsoFile = _fso.getFile(fileElement.value);

            _fileObj = {};
            _fileObj.name = _fsoFile.name;
            _fileObj.type = _fsoFile.type;
            _fileObj.size = _fsoFile.size;
        }
        return _fileObj;
    },
    /**
     * 파일 확장자 가져오기
     * @param {Object}
     * @returns {string}
     * @example
     * CommonJS.File.getFileExt(fileObj);
     */
    getFileExt: function (fileObj) {
        var _fileName = fileObj.name;
        return _fileName.substring(_fileName.lastIndexOf(".") + 1);
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
        var _arrDataUnits = ['B', 'kB', 'MB', 'GB', 'TB'];
        var _i = Number(Math.floor(Math.log(size) / Math.log(1024)));
        return Math.round(size / Math.pow(1024, _i)) + ' ' + _arrDataUnits[_i];
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
                var _reader = new FileReader();
                _reader.onload = function (e) {
                    imgElement.src = e.target.result;
                }
                _reader.readAsDataURL(e.target.files[0]);
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
            var _fileUrl = window.URL.createObjectURL(e.target.files[0]);
            videoElement.setAttribute('src', _fileUrl);
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
            var _fileUrl = window.URL.createObjectURL(e.target.files[0]);
            audioElement.setAttribute('src', _fileUrl);
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
    downloadFile: function (Element, fileName) {
        var _a = document.createElement("a");
        var _downFileNm;
        var _tagNmae = Element.nodeName;

        if (Element.nodeName === undefined) {
            _tagNmae = Element.prop('tagName');
        }

        var _srcArr = ['VIDEO', 'AUDIO', 'IMG'];
        if (_srcArr.includes(_tagNmae)) {
            var _src;
            if (Element.length === undefined) {
                _src = Element.getAttribute('src');
            } else {
                _src = Element.attr('src');
            }

            _downFileNm = fileName;
            if (fileName == undefined) {
                var _fileExt = _src.substring(_src.lastIndexOf(".") + 1);
                var _temp = _src.substring(0, _src.lastIndexOf("."));
                var _fileName = _temp.substring(_src.lastIndexOf("/") + 1);
                _downFileNm = _fileName + '.' + _fileExt;
            }

            _a.href = _src;
        } else {
            var _alertMsg = '';
            _alertMsg += '파일 다운로드는\n(' + 'video, audio, img, textarea, input[type="text"]' + ')';
            _alertMsg += '\n만 가능합니다.';

            var _srcArr = ['TEXTAREA', 'INPUT', 'DIV'];
            if (!_srcArr.includes(_tagNmae)) {
                alert(_alertMsg);
                return false;
            } else {
                if ('INPUT' === _tagNmae) {
                    var _type;
                    if (Element.length === undefined) {
                        _type = Element.getAttribute('type');
                    } else {
                        _type = Element.attr('type');
                    }

                    if ('text' !== _type) {
                        alert(_alertMsg);
                        return false;
                    }
                }
            }

            _downFileNm = fileName;
            if (fileName == undefined) {
                _downFileNm = 'output.html';

                if ('INPUT' === _tagNmae) {
                    _downFileNm = 'output.text';
                }
            }

            if ('DIV' !== _tagNmae) {
                var _mimeType = 'text/html';
                if ('INPUT' === _tagNmae) {
                    _mimeType = 'text/plain';
                }

                var _blob;
                if (Element.length === undefined) {
                    _blob = new Blob([Element.value], {
                        type: _mimeType
                    });
                } else {
                    _blob = new Blob([Element.val()], {
                        type: _mimeType
                    });
                }

                var _url = window.URL.createObjectURL(_blob);
                _a.href = _url;
            } else {
                var _blob;
                if (Element.length === undefined) {
                    _blob = new Blob([Element.innerHTML], {
                        type: 'text/html'
                    });
                } else {
                    _blob = new Blob([Element.html()], {
                        type: 'text/html'
                    });
                }

                var _url = window.URL.createObjectURL(_blob);
                _a.href = _url;
            }
        }

        _a.download = _downFileNm;
        _a.target = '_blank';

        _a.click();
        _a.remove();
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
        var _fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
        if ('xls' !== _fileExt) {
            alert('xls 파일만 가능합니다.');
            return false;
        }

        var _dataType = 'data:application/vnd.ms-excel';
        var _html = '';
        _html += '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
        _html += '<head>';
        _html += '<meta http-equiv="content-type" content="' + _dataType + '; charset=UTF-8">';
        _html += '<xml>';
        _html += '<x:ExcelWorkbook>';
        _html += '<x:ExcelWorksheets>';
        _html += '<x:ExcelWorksheet>';
        _html += '<x:Name>' + sheetName + '</x:Name>';
        _html += '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions>';
        _html += '</x:ExcelWorksheet>';
        _html += '</x:ExcelWorksheets>';
        _html += '</xml>';
        _html += '</head>';
        _html += '<body>';
        _html += sheetHtml;
        _html += '</html>';

        var _ua = window.navigator.userAgent;
        var _blob = new Blob([_html], {
            type: "application/csv;charset=utf-8;"
        });

        if ((_ua.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) && window.navigator.msSaveBlob) {
            // ie이고 msSaveBlob 기능을 지원하는 경우
            navigator.msSaveBlob(_blob, fileName);
        } else {
            // ie가 아닌 경우 (바로 다운이 되지 않기 때문에 클릭 버튼을 만들어 클릭을 임의로 수행하도록 처리)
            var _anchor = window.document.createElement('a');
            _anchor.href = window.URL.createObjectURL(_blob);
            _anchor.download = fileName;
            document.body.appendChild(_anchor);
            _anchor.click();

            // 클릭(다운) 후 요소 제거
            document.body.removeChild(_anchor);
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
            var id = sheetElement.attr('id');
            sheetElement = document.querySelector('#' + id);
        }

        // 파일 체크
        var _arrAllowExt = ['xls', 'xlsx', 'ods'];
        var _fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

        if (!_arrAllowExt.includes(_fileExt)) {
            alert('xls, xlsx, ods 만 가능합니다.');
            return false;
        }

        var _type = 'xlsx';
        if ('ods' === _fileExt) _type = 'ods';
        if ('xls' === _fileExt) _type = 'biff8';

        var _wb = XLSX.utils.table_to_book(sheetElement, {
            sheet: sheetName
        });
        var _fn = undefined;

        XLSX.writeFile(_wb, _fn || fileName);
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
        var _fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

        if (_fileExt != 'pdf') {
            alert('pdf만 가능합니다.');
            return false;
        }

        html2canvas(pdfElement).then(function (canvas) { //저장 영역 div id
            // 캔버스를 이미지로 변환
            var imgData = canvas.toDataURL('image/png');

            var imgWidth = 190; // 이미지 가로 길이(mm) / A4 기준 210mm
            var pageHeight = imgWidth * 1.414; // 출력 페이지 세로 길이 계산 A4 기준
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;
            var margin = 10; // 출력 페이지 여백설정
            var doc = new jsPDF('p', 'mm');
            var position = 0;

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
}

CommonJS.FileValid = {
    /**
     * 지원 파일 체크 (문서, 이미지)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowFile(fileObj);
     */
    isAllowFile: function (fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var _arrAllowExt = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp', 'odt', 'odp', 'ods', 'jpg', 'jpeg', 'gif', 'png'];
        return _arrAllowExt.includes(_ext);
    },
    /**
     * 지원 파일 체크 (문서)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowDoc(fileObj);
     */
    isAllowDoc: function (fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var _arrAllowExt = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp', 'odt', 'odp', 'ods'];
        return _arrAllowExt.includes(_ext);
    },
    /**
     * 지원 파일 체크 (이미지)
     * @param {Object}
     * @returns {boolean}
     * @example
     * CommonJS.FileValid.isAllowImg(fileObj);
     */
    isAllowImg: function (fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var _arrAllowExt = ['jpg', 'jpeg', 'gif', 'png'];
        return _arrAllowExt.includes(_ext);
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
        var _ext = CommonJS.File.getFileExt(fileObj);
        var extReg = /(bat|bin|cmd|com|cpl|dll|exe|gadget|inf1|ins|isu|jse|lnk|msc|msi|msp|mst|paf|pif|ps1|reg|rgs|scr|sct|sh|shb|shs|u3p|vb|vbe|vbs|vbscript|ws|wsf|wsh)$/i;
        return extReg.test(_ext);
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
        if (Array.isArray) {
            var _ext = CommonJS.File.getFileExt(fileObj);
            return arrAllowExt.includes(_ext);
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
    }
}

CommonJS.Cookie = {
    /**
     * 쿠키 생성
     * @param {string} name
     * @param {*} value
     * @param {number} expireDay
     * @example
     * CommonJS.Cookie.setCookie(name, value, expireDay);
     */
    setCookie: function (name, value, expireDay) {
        var _date = new Date();
        _date.setDate(_date.getDate() + Number(expireDay));
        document.cookie = name + '=' + escape(value) + '; path=/; expires=' + _date.toGMTString() + ';';
    },
    /**
     * 쿠키 값 얻기
     * @param {string} name
     * @returns {*}
     * @example
     * CommonJS.Cookie.getCookie(name);
     */
    getCookie: function (name) {
        var _value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return _value ? unescape(_value[2]) : null;
    },
    /**
     * 쿠키 삭제
     * @param {string} name
     * @example
     * CommonJS.Cookie.deleteCookie(name);
     */
    deleteCookie: function (name) {
        var _date = new Date();
        _date.setDate(_date.getDate() - 1);
        document.cookie = name + '=' + '; path=/; expires=' + _date.toGMTString() + ';';
    }
}

CommonJS.Byte = {
    /**
     * Byte 길이 구하기 (UTF8)
     * @param {*} val
     * @returns {number}
     * @example
     * CommonJS.Byte.getByteLengthUtf8(val);
     */
    getByteLengthUtf8: function (val) {
        var _char = '';
        var _nCnt = 0;

        for (var i = 0; i < val.length; i++) {
            _char = val.charCodeAt(i);
            if (_char > 127) {
                _nCnt += 3;
            } else {
                _nCnt++;
            }
        }
        return _nCnt;
    },
    /**
     * Byte 길이 구하기 (EUC_KR)
     * @param {*} val
     * @returns {number}
     * @example
     * CommonJS.Byte.getByteLengthEucKr(val);
     */
    getByteLengthEucKr: function (val) {
        var _char = '';
        var _nCnt = 0;

        for (var i = 0; i < val.length; i++) {
            _char = val.charCodeAt(i);
            if (_char > 127) {
                _nCnt += 2;
            } else {
                _nCnt++;
            }
        }
        return _nCnt;
    }
}

CommonJS.Escape = {
    /**
     * HTML Escape 처리
     * @param {*} val
     * @returns {string}
     * @example
     * CommonJS.Escape.escapeHtml(val);
     */
    escapeHtml: function (val) {
        var _ret = val.replace(/\"/gi, '&quot;').replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        return _ret;
    },
    /**
     * HTML Unescape 처리
     * @param {*} val
     * @returns {string}
     * @example
     * CommonJS.Escape.unescapeHtml(val);
     */
    unescapeHtml: function (val) {
        var _ret = val.replace(/&quot;/gi, '\"').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
        return _ret;
    }
}

CommonJS.BrowserInfo = {
    /**
     * 브라우저 종류 및 버전 체크
     * @returns {Object}
     * @example
     * CommonJS.BrowserInfo.checkTypeVersion();
     */
    checkTypeVersion: function () {
        var _agent = navigator.userAgent.toLowerCase();
        var _re = '';

        var browser = {
            name: null,
            version: null
        };

        // IE 체크
        // - IE 12에 해당하는 초장기 Edge 체크 의미 없어져서 제외시킴
        if (_agent.match(/msie/) || _agent.match(/trident/)) {
            browser.name = "IE";

            if (_agent.match(/msie/)) {
                // IE 10 이하
                _re = /msie (\S+)/;
                browser.version = _re.exec(_agent)[1];
                browser.version = browser.version.replace(";", "");
            } else {
                // IE 11
                if (_agent.match(/trident/)) {
                    _re = /rv:(\S+)/;
                    browser.version = _re.exec(_agent)[1];
                }
            }
        } else {
            // Chromium 기반이면 Chrome 체크 위에 선언, 아래에 있으면 Chrome 으로 체크됨

            if (_agent.match(/whale/)) {
                _re = /whale\/(\S+)/;
                browser.name = 'Whale'; // Chromium 기반
            } else if (_agent.match(/edg/)) {
                // edge 에서 edg 로 변경됨....
                _re = /edg\/(\S+)/;
                browser.name = 'Edge'; // Chromium 기반
            } else if (_agent.match(/opr/)) {
                // opera 에서 opr 로 변경됨....
                _re = /opr\/(\S+)/;
                browser.name = 'Opera'; // Chromium 기반
            } else if (_agent.match(/chrome/)) {
                _re = /chrome\/(\S+)/;
                browser.name = 'Chrome'; // Chromium 기반
            } else if (_agent.match(/firefox/)) {
                _re = /firefox\/(\S+)/;
                browser.name = 'Firefox';
            } else if (_agent.match(/safari/)) {
                _re = /safari\/(\S+)/;
                browser.name = 'Safari';
            } else {
                console.log(_agent);
            }

            if (browser.name != null) {
                browser.version = _re.exec(_agent)[1];
            }
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
        var _filter = 'win16|win32|win64|mac';
        if (navigator.platform) {
            if (_filter.indexOf(navigator.platform.toLowerCase()) < 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    /**
     * Android, iOS 여부 체크
     * @returns {boolean}
     * @example
     * CommonJS.BrowserInfo.isMobileOs();
     */
    isMobileOs: function () {
        var _ret = {
            Android: navigator.userAgent.match(/Android/i) == null ? false : true,
            iOS: navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true
        };
        return _ret;
    }
}

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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^0-9]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^0-9]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = fnTemp(e);
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(fnTemp(e));
            });
        }

        function fnTemp(e) {
            var _val = e.target.value.replace(/,/g, '').replace(/[^0-9]/gi, '');
            var _re = /(^[+-]?\d+)(\d{3})/;

            while (_re.test(_val)) {
                _val = _val.replace(_re, '$1' + ',' + '$2');
            }

            return _val;
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^a-zA-Z]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^a-zA-Z]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^a-zA-Z_]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^a-zA-Z_]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^a-zA-Z0-9]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^a-zA-Z0-9]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^a-zA-Z\s]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^a-zA-Z\s]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/gi, ''));
            });
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
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                this.value = e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '');
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                inputElement.val(e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/gi, ''));
            });
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
     * 전화번호 하이픈(-) 자동입력
     * @param {Element} inputElement
     * @example
     * [JavaScript]
     * CommonJS.Input.formatHypenPhone( document.querySelector(셀렉터) );
     * 
     * [jQuery]
     * CommonJS.Input.formatHypenPhone( $(셀렉터) );
     */
    formatHypenPhone: function (inputElement) {
        if (inputElement.length === undefined) {
            inputElement.addEventListener('keyup', function (e) {
                fnTemp(e, inputElement);
            });
        } else {
            $(document).on('keyup', inputElement, function (e) {
                fnTemp(e, inputElement);
            });
        }

        function fnTemp(e, inputElement) {
            var _type;
            if (inputElement.length === undefined) {
                _type = 0;
            } else {
                _type = 1;
            }

            var _str;
            if (_type === 0) {
                _str = inputElement.value;
            } else {
                _str = inputElement.val();
            }

            _str = _str.replace(/[^0-9]/g, '');

            var tmp = '';

            if (_str.substring(0, 2) == 02) {
                // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
                if (_str.length < 3) {
                    if (_type === 0) {
                        inputElement.value = _str;
                    } else {
                        inputElement.val(_str);
                    }
                } else if (_str.length < 6) {
                    tmp += _str.substr(0, 2);
                    tmp += '-';
                    tmp += _str.substr(2);

                    if (_type === 0) {
                        inputElement.value = tmp;
                    } else {
                        inputElement.val(tmp);
                    }
                } else if (_str.length < 10) {
                    tmp += _str.substr(0, 2);
                    tmp += '-';
                    tmp += _str.substr(2, 3);
                    tmp += '-';
                    tmp += _str.substr(5);

                    if (_type === 0) {
                        inputElement.value = tmp;
                    } else {
                        inputElement.val(tmp);
                    }
                } else {
                    tmp += _str.substr(0, 2);
                    tmp += '-';
                    tmp += _str.substr(2, 4);
                    tmp += '-';

                    if (_type === 0) {
                        inputElement.value = tmp;
                    } else {
                        inputElement.val(tmp);
                    }
                }
            } else {
                // 핸드폰 및 다른 지역 전화번호 일 경우
                if (_str.length < 4) {
                    if (_type === 0) {
                        inputElement.value = _str;
                    } else {
                        inputElement.val(_str);
                    }
                } else if (_str.length < 7) {
                    tmp += _str.substr(0, 3);
                    tmp += '-';
                    tmp += _str.substr(3);

                    if (_type === 0) {
                        inputElement.value = tmp;
                    } else {
                        inputElement.val(tmp);
                    }
                } else if (_str.length < 11) {
                    tmp += _str.substr(0, 3);
                    tmp += '-';
                    tmp += _str.substr(3, 3);
                    tmp += '-';
                    tmp += _str.substr(6);

                    if (_type === 0) {
                        inputElement.value = tmp;
                    } else {
                        inputElement.val(tmp);
                    }
                } else {
                    tmp += _str.substr(0, 3);
                    tmp += '-';
                    tmp += _str.substr(3, 4);
                    tmp += '-';
                    tmp += _str.substr(7);

                    if (_type === 0) {
                        inputElement.value = tmp;
                    } else {
                        inputElement.val(tmp);
                    }
                }
            }
        }
    }
}

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
        var _newForm = document.createElement('form');
        _newForm.name = 'form';
        _newForm.method = 'get';
        _newForm.action = '';
        _newForm.target = '_blank';

        var _input = document.createElement('input');
        _input.setAttribute('type', 'hidden');
        _input.setAttribute('name', 'temp');
        _input.setAttribute('value', searchKeyword);

        _newForm.appendChild(_input);

        return _newForm;
    },
    /**
     * 구글 검색
     * @param {string} searchKeyword 
     * @example
     * CommonJS.SearchEngine.searchGoogle('나무위키');
     */
    searchGoogle: function (searchKeyword) {
        var _newForm = this.makeNewForm(searchKeyword);
        _newForm.action = 'https://www.google.com/search';

        var _field = _newForm.querySelector('input[name="temp"]');
        _field.setAttribute('name', 'q');

        document.body.appendChild(_newForm);
        _newForm.submit();
        document.body.removeChild(_newForm);
    },
    /**
     * 네이버 검색
     * @param {string} searchKeyword
     * @example
     * CommonJS.SearchEngine.searchNaver('나무위키');
     */
    searchNaver: function (searchKeyword) {
        var _newForm = this.makeNewForm(searchKeyword);
        _newForm.action = 'https://search.naver.com/search.naver';

        var _field = _newForm.querySelector('input[name="temp"]');
        _field.setAttribute('name', 'query');

        document.body.appendChild(_newForm);
        _newForm.submit();
        document.body.removeChild(_newForm);
    },
    /**
     * 다음 검색
     * @param {string} searchKeyword
     * @example
     * CommonJS.SearchEngine.searchDaum('나무위키');
     */
    searchDaum: function (searchKeyword) {
        var _newForm = this.makeNewForm(searchKeyword);
        _newForm.action = 'https://search.daum.net/search';

        var _field = _newForm.querySelector('input[name="temp"]');
        _field.setAttribute('name', 'q');

        document.body.appendChild(_newForm);
        _newForm.submit();
        document.body.removeChild(_newForm);
    }
}

/**
 * ********************************************************************
 * TODO : SNS를 안해서 테스트 안해봄... shareKakao 만 프로젝트에서 해봄
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
     * Kakao 공유
     * @param {string} webUrl
     * @param {string} mobileWebUrl
     * @param {string} title - 공유 미리보기 제목
     * @param {string} imageUrl - 공유 미리보기 썸네일
     * @param {string} btnTitle
     * @example
     * CommonJS.SnsShare.shareKakao(webUrl, mobileWebUrl, title, imageUrl, btnTitle);
     * 
     * @link https://developers.kakao.com/docs/latest/ko/getting-started/sdk-js
     * @link https://developers.kakao.com/docs/latest/ko/message/js-link
     */
    shareKakao: function (apiKey, webUrl, mobileWebUrl, title, imageUrl, btnTitle) {
        Kakao.Link.createDefaultButton({
            container: '#CONTAINER_ID',
            objectType: 'feed',
            content: {
                title: title,
                imageUrl: imageUrl,
                link: {
                    webUrl: webUrl,
                    mobileWebUrl: mobileWebUrl
                }
            },
            buttons: [{
                title: btnTitle,
                link: {
                    webUrl: webUrl,
                    mobileWebUrl: mobileWebUrl
                }
            }]
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
    }
}

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
 * 프로젝트에 따라 정석인 JavascriptBridge 대신 다른 방식으로 값 주고 받을 수 있음
 * ********************************************************************
 */
CommonJS.Mobile = {
        /**
         * SMS 문자 보내기
         *   - 연락처, 문자 내용 설정된 상태로 문자 보내기 화면으로 이동 시킴
         * @param {string|number} telNo 
         * @param {string} content 
         * @example
         * CommonJS.Mobile.sendSMS('010-9924-3732', '테스트');
         */
        sendSMS: function (telNo, content) {
            if (CommonJS.BrowserInfo.isMobile()) {
                if (CommonJS.FormatValid.isCellPhoneNumber(telNo)) {
                    var _mobileOs = CommonJS.BrowserInfo.isMobileOs().iOS ? 'ios' : 'android';

                    location.href = 'sms:' + telNo + (_mobileOs == 'ios' ? '&' : '?') + 'body=' + encodeURIComponent(content);
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
         * 카메라 실행
         *   - (일반적인) accept, capture 속성이 없는 경우
         *          : 카메라, 캠코더, 파일
         *   - accept 속성만 있는 경우
         *          accept="image/*" : 작업 선택 - 카메라, 내 파일, 파일
         *          accept="audio/*" : 작업 선택 - 음성 녹음, 내 파일, 파일
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
                    var _fileUrl = window.URL.createObjectURL(e.target.files[0]);

                    imgElement.setAttribute("src", _fileUrl);
                    this.removeAttribute('capture');
                } else {
                    // 카메라 실행이 목적이므로 실행 가능하더라도 실행 시키지 않음
                    console.log('모바일 플랫폼에서만 사용 가능합니다.');
                }
            });
        },
        /**
         * 음성 녹음 실행
         *   - runCamera 참고
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
            fileElement.setAttribute('accept', 'audio/*');
            fileElement.setAttribute('capture', 'microphone');

            fileElement.addEventListener('change', function (e) {
                if (CommonJS.BrowserInfo.isMobile()) {
                    var _fileUrl = window.URL.createObjectURL(e.target.files[0]);

                    audioElement.setAttribute("src", _fileUrl);
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
         * @param {string} package 
         * @returns
         * @example
         * CommonJS.Mobile.makeAndroidAppLinkUrl('instagram.com', 'https', 'com.instagram.android');
         * 
         * 링크 생성 하더라도 작동하려면 다음 설정 필수
         * AndroidManifest.xml
         *  <intent-filter>
         *      <action android:name="android.intent.action.VIEW" />
         *      <category android:name="android.intent.category.DEFAULT" />
         *      <category android:name="android.intent.category.BROWSABLE" />
         * 
         *      <data android:host="호스트" android:scheme="스키마" />
         *  </intent-filter>
         */
        makeAndroidAppLinkUrl: function (host, scheme, package) {
            return 'intent://' + host + '/#Intent;package=' + package + ';scheme=' + scheme + ';end';
        },
        /**
         * 앱링크 or 딥링크 실행
         * @param {string} androidUrl 
         * @param {string} iosUrl 
         * @param {string} iosAppStoreUrl 
         * @example
         * CommonJS.Mobile.runAppLinkUrl(androidUrl, iosUrl, iosAppStoreUrl);
         */
        runAppLinkUrl: function (androidUrl, iosUrl, iosAppStoreUrl) {
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
    },

    /**
     * ********************************************************************
     * GoogleMap - Geocoding 유료
     *   > https://cloud.google.com/maps-platform/pricing?hl=ko
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
            var container = mapElement;
            var options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };

            // 지도를 생성합니다  
            var map = new kakao.maps.Map(container, options);

            // 주소-좌표 변환 객체를 생성합니다
            var geocoder = new kakao.maps.services.Geocoder();

            // 주소로 좌표를 검색합니다
            geocoder.addressSearch(addr, function (result, status) {
                // 정상적으로 검색이 완료됐으면 
                if (status === kakao.maps.services.Status.OK) {
                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coords
                    });

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
            var mapOptions = {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 15
            };

            var map = new naver.maps.Map(mapElementId, mapOptions);

            // Geocoder를 활용한 주소와 좌표 검색 API 호출하기
            naver.maps.Service.geocode({
                query: addr
            }, function (status, response) {
                if (status === naver.maps.Service.Status.ERROR) {
                    return alert('Something wrong!');
                }

                // 성공 시의 response 처리
                var item = response.v2.addresses[0],
                    point = new naver.maps.Point(item.x, item.y);

                map.setCenter(point);

                // 원하는 위치에 마커 올리기
                var marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(item.y, item.x),
                    map: map
                });
            });
        }
    }

CommonJS.Editor = {
    /**
     * CK Editor
     * @param {Element} targetElement 
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
    ckeditor: function (targetElement) {
        // 다운로드 경로\ckeditor5\sample\index.html 참고
        // html 모드는 지원 안하는 듯
    },
    /**
     * Summernote
     * @param {Element} targetElement 
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
    summernote: function (targetElement) {
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
     * @param {Element} targetElement 
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
     * @description
     * jQuery 필수 아니라서 사용 안할려고 구글링 하면서 아주 발악을... fetch 아직은 너무도 어색한 그대...
     */
    toastEditor: function (targetElement) {
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
}

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
     */
    commonAjax: function (isAsync, method, url, header, param, callback) {
        var _retData = {};

        var _contentType = "application/x-www-form-urlencoded; charset=utf-8";
        var _params = (param == undefined) ? {} : param;

        if (!CommonJS.Valid.isEmptyObject(param)) {
            if (method.toLowerCase() === 'get') {
                url = url + CommonJS.Object.objectToQueryString(param);
            }
        }

        if (typeof param == 'object') {
            var _classType = CommonJS.getClassType(param);

            if (_classType === 'Object') {
                // serialize() 는 jQuery 만 지원
                _params = CommonJS.Object.makeFormBody(param);
            }

            if (_classType === 'Array') {
                _contentType = "application/json; charset=utf-8";
                _params = CommonJS.JSON.objectToJsonString(param);
            }
        }

        var _xmlHttp = new XMLHttpRequest();
        _xmlHttp.open(method, url, isAsync);

        for (key in header) {
            _xmlHttp.setRequestHeader(key, header[key]);
        }

        if ('FORM' === param.nodeName) {
            var _formData = new FormData(param);
            _xmlHttp.send(_formData);
        } else {
            _xmlHttp.setRequestHeader('Content-type', _contentType);

            if (!CommonJS.Valid.isEmptyObject(_params)) {
                _xmlHttp.send(_params);
            } else {
                _xmlHttp.send(null);
            }
        }

        if (isAsync) {
            _xmlHttp.onreadystatechange = function () {
                if (_xmlHttp.readyState === _xmlHttp.DONE) {
                    if (_xmlHttp.status === 200 || _xmlHttp.status === 201) {
                        try {
                            callback(CommonJS.JSON.jsonToObject(_xmlHttp.response));
                        } catch (error) {
                            callback(_xmlHttp.response);
                        }
                    } else {
                        alert(_xmlHttp.statusText);
                    }
                }
            }
        } else {
            if (_xmlHttp.status !== 200) {
                alert(_xmlHttp.statusText);
                return false;
            }

            if ((CommonJS.Valid.isUndefined(callback)) || (typeof callback != 'function')) {
                try {
                    _retData = CommonJS.JSON.jsonToObject(_xmlHttp.response);
                } catch (error) {
                    _retData = _xmlHttp.response;
                }

            } else {
                try {
                    callback(CommonJS.JSON.jsonToObject(_xmlHttp.response));
                } catch (error) {
                    callback(_xmlHttp.response);
                }
            }
        }

        return _retData;
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
     * 나름 신기술이라 var 대신 const, let 사용 / 화살표 함수 사용
     * 
     * [화살표 함수]
     * (response) => 
     *      console.log(response)
     * 
     * function(response) {
     *      console.log(response)
     * }
     */
    commonFetch: function (method, url, header, param, callback) {
        let _contentType = "application/x-www-form-urlencoded; charset=utf-8";
        let _params;

        if (!CommonJS.Valid.isEmptyObject(param)) {
            if (method.toLowerCase() === 'get') {
                url = url + CommonJS.Object.objectToQueryString(param);
            }
        }

        if (method.toLowerCase() === 'get') {
            _params = null;
        }

        if (typeof param == 'object') {
            if (method.toLowerCase() === 'post') {
                const _classType = CommonJS.getClassType(param);

                if (_classType === 'Object') {
                    _params = CommonJS.Object.makeFormBody(param);
                }

                if (_classType === 'Array') {
                    _contentType = "application/json; charset=utf-8";
                    _params = CommonJS.JSON.objectToJsonString(param);
                }
            }
        }

        let _myHeaders = new Headers();
        if (header == null) {
            _myHeaders.append('Content-Type', _contentType);
        } else {
            _myHeaders = header;
        }

        if (_myHeaders.get('Content-Type') == null) {
            _myHeaders.append('Content-Type', _contentType);
        }

        if ('FORM' === param.nodeName) {
            _params = new FormData(param);
            _myHeaders = new Headers();
        }

        fetch(url, {
                method: method,
                headers: _myHeaders,
                body: _params
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
}

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
            var _el = null;

            if (CommonJS.Valid.isUndefined(qrCodeDivElement.length)) {
                _el = qrCodeDivElement;
            } else {
                if (CommonJS.Valid.isUndefined(qrCodeDivElement.attr('id'))) {
                    _el = document.querySelector('.' + qrCodeDivElement.attr('class'));
                }

                if (CommonJS.Valid.isUndefined(qrCodeDivElement.attr('class'))) {
                    _el = document.querySelector('#' + qrCodeDivElement.attr('id'));
                }
            }

            new QRCode(_el, {
                text: text,
                width: CommonJS.Valid.isUndefined(width) ? 128 : width,
                height: CommonJS.Valid.isUndefined(width) ? 128 : height
            });
        }
    },

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
         *  CommonJS.SocialLogin.loginWithKakao(userMeSucCallBack, userMeFailCallBak, loginFailCallBack);
         */
        loginWithKakao: function (userMeSucCallBack, userMeFailCallBak, loginFailCallBack) {
            Kakao.Auth.login({
                success: function (response) {
                    // console.log('login response : ', response);

                    const accessToken = response.access_token;

                    // 토큰 할당
                    Kakao.Auth.setAccessToken(accessToken);

                    // 사용자 정보 가져오기
                    Kakao.API.request({
                        url: '/v2/user/me',
                        success: function (response) {
                            // console.log('/v2/user/me : ', response);
                            userMeSucCallBack(response);
                        },
                        fail: function (error) {
                            // console.log('/v2/user/me :', error);
                            userMeFailCallBak(error);
                        }
                    });
                },
                fail: function (error) {
                    // console.log('login fail : ', error);
                    loginFailCallBack(error);
                }
            });
        },
        /**
         * 카카오 로그아웃
         * @param {Function} logoutCallBack 
         * @returns 
         */
        logoutWithKakao: function(logoutCallBack) {
            if (!Kakao.Auth.getAccessToken()) {
                console.log('Not logged in.');
                return;
            }

            // console.log('before logout : ', Kakao.Auth.getAccessToken());

            Kakao.Auth.logout(function() {
                // console.log('after logout : ', Kakao.Auth.getAccessToken());
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
         */
        loginWithNaver: function(ClientId, CallBackUrl, serviceDoamin)  {
            // naver_id_login은 CallBackUrl 에도 설정 해줘야 함
            var naver_id_login = new naver_id_login(ClientId, CallBackUrl);
            var state = naver_id_login.getUniqState();
    
            naver_id_login.setButton("white", 2,40);
            naver_id_login.setDomain(serviceDoamin);
            naver_id_login.setState(state);
            naver_id_login.setPopup();
            naver_id_login.init_naver_id_login();
        },
        /**
         * 네이버 로그인 콜백
         * @param {string} ClientId 
         * @param {string} CallBackUrl 
         */
        loginWithNaverCallBack: function(ClientId, CallBackUrl) {
            var naver_id_login = new naver_id_login(ClientId, CallBackUrl);

            if ( naver_id_login.oauthParams.access_token ) {
                // 접근 토큰 값 출력
                // console.log('login response : ', naver_id_login.oauthParams.access_token);
        
                // 네이버 사용자 프로필 조회
                naver_id_login.get_naver_userprofile("naverSignInCallback()");
            }

            // 네이버 사용자 프로필 조회 이후 프로필 정보를 처리할 callback function
            function naverSignInCallback() {
                // console.log('getProfileData : ', naver_id_login.getProfileData('email'));
                // console.log('getProfileData : ', naver_id_login.getProfileData('nickname'));

                const profileObj = {};
                profileObj.email = naver_id_login.getProfileData('email');
                profileObj.nickname = naver_id_login.getProfileData('nickname');

                window.opener.getProfileSucCallBack(profileObj);
                window.close();
            }
        },
        // 네이버 로그아웃은 별도로 처리
    }


//--------------------------------------------------------------------
// prototype
// - 지원 함수 보다는 성능이 떨어지지 않을까? 하여 Default는 주석 처리해놓음
// - 제한된 인트라넷 환경에서 브라우저 버전 때문에 지원 안하는 경우, 주석 해제 후 사용
//--------------------------------------------------------------------
/**
 * IE 12(Edge) / Chrome 41 이하에서 startsWith 사용
 * @param {string} val
 * @returns {boolean}
 */
// String.prototype.startsWith = function(val) {
// 	return this.substring(0, val.length) === val;
// }
/**
 * IE 12(Edge) / Chrome 41 이하에서 endsWith 사용
 * @param {string} val
 * @returns {boolean}
 */
// String.prototype.endsWith = function(val) {
// 	return this.substring(this.length - val.length, this.length) === val;
// }
/**
 * IE 12(Edge) / Chrome 41 이하에서 includes 사용
 * @param {string} val
 */
// String.prototype.includes = function(val) {
// 	return this.indexOf(val) != -1;
// }
/**
 * IE 14(Edge) / Chrome 47 이하에서 includes 사용 (start는 제외)
 * @param {*} element
 * @returns {boolean}
 */
// Array.prototype.includes = function(element) {
// 	var i = this.length;
// 	while (i--) {
// 		if (this[i] === element) {
// 			return true;
// 		}
// 	}
// 	return false;
// }