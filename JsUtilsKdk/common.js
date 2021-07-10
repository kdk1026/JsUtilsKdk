/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.12.02
 * @version 2.4
 * @description 특정 프로젝트가 아닌, 범용적으로 사용하기 위한 함수 모음
 *
 * @property {object} CommonJS.Text - 2021.07.10 추가 (CommonJS 에서 addZero 분리하고, 추가)
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
    openPopup: function(url, name, width, height) {
        var _height = (this.Valid.isUndefined(height)) ? screen.height : Number(height);
        var _width = (this.Valid.isUndefined(width)) ? screen.width : Number(width);
        var _left = (screen.width / 2) - (width / 2);
        var _top = (screen.height / 2) - (height / 2);
        var _option = '';
        _option += 'height='+_height+', width='+_width+', left='+_left+', top='+_top;
        _option += 'menubar=no, status=no';
        _option += 'resizable=no, scrollbars=no, toolbar=no';   // IE only | IE, Firefox, Opera only | IE, Firefox only

        window.open(url, name, _option);
    },
    /**
     * F12 버튼 막기 및 우클릭 막기 (추가 : 드래그 방지, 선택 방지)
     *  - keyCode 는 deprecated 되었으므로 code 활용
     *    > https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
     * @example
     * CommonJS.blockSourceView();
     */
    blockSourceView: function() {
        // F12 버튼 막기
        document.onkeydown = function(e) {
            if ( e.code === 'F12' ) {
                e.preventDefault();
                e.returnValue = false;
            }
        };

        // 우클릭 방지
        document.oncontextmenu = function() {
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
     getLocation: function(onSuccess, onError) {
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
    scriptHook: function(beforeFuncNm, funcNm, parent) {
        if (typeof parent == 'undefined') parent = window;
        for (var i in parent) {
            if (parent[i] === funcNm) {
                parent[i] = function() {
                    var Return = beforeFuncNm();
                    if(Return === false) return;
                    return funcNm.apply(this, arguments);
                }
            }
        }
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
     addZero: function(num) {
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
    defaultString: function(string, defaultStr) {
        if ( CommonJS.Valid.isBlank(string) || CommonJS.Valid.isUndefined(string) ) {
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
    copyToClipBoard: function(textElement, string) {
        if ( textElement != null ) {
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
     */
    isBlank: function(val) {
        return (val == null || val.replace(/ /gi,'') == '');
    },
    /**
     * undefined 체크 ('undefined' 포함)
     * @param {*} val
     * @returns {boolean}
     */
    isUndefined: function(val) {
        return (val == undefined || val === 'undefined');
    },
    /**
     * 숫자 체크
     * @param {*} val
     * @returns {boolean}
     */
    isNumber: function(val) {
        var _re = /^[0-9]+$/;
        return _re.test(val);
    },
    /**
     * 특수문자 체크
     * @param {*} val
     * @returns {boolean}
     */
    isSpecial: function(val) {
        var _re = /[`~!@#$%^&*()-_=+{}|;:'\",.<>?]+$/;
        return _re.test(val);
    },
	/**
	 * 공백 체크
	 * @param {string} val
	 * @returns {boolean}
	 */
	checkSpace: function(val) {
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
	 */
	isNotHangul: function(val) {
		var _re = /[a-zA-Z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
		return _re.test(val);
	},
    /**
     * Object가 비어있는지 체크
     * @param {Object} param 
     * @returns 
     */
    isEmptyObject: function(param) {
        return Object.keys(param).length === 0 && param.constructor === Object;
    },
    /**
     * Array가 비어있는지 체크
     * @param {Array} param 
     * @returns 
     */
    isEmptyArray: function(param) {
        return Object.keys(param).length === 0 && param.constructor === Array;
    }
}

/**
 * ********************************************************************
 * CommonJS.DateTime.함수 대신 Moment.js 적극 권장
 * <참고> https://github.com/kdk1026/node_utils/blob/main/libs/date.js
 * ********************************************************************
 */
CommonJS.DateTime = {
    /**
     * 날짜를 yyyy-MM-dd 형식으로 반환
     * @param {Date} date
     * @returns {string}
     */
	dateToString: function(date) {
		var _year = date.getFullYear();
		var	_month = (date.getMonth() + 1);
		var	_day = date.getDate();

		_month = CommonJS.Text.addZero(_month);
		_day = CommonJS.Text.addZero(_day);

		return [_year, _month, _day].join('-');
    },
    /**
     * 시간을 HH:mm:ss 형식으로 반환
     * @param {Date} date
     * @returns {string}
     */
	timeToString: function(date) {
		var _hour = date.getHours();
		var	_minute = date.getMinutes();
		var	_second = date.getSeconds();

		_hour = CommonJS.Text.addZero(hour);
		_minute = CommonJS.Text.addZero(minute);
		_second = CommonJS.Text.addZero(second);

		return [_hour, _minute, _second].join(':');
    },
    /**
     * 날짜 형식의 문자열을 Date 객체로 반환
     * @param {string} val
     * @returns {Date}
     */
	stringToDate: function(val) {
		var _date = new Date();
		val = val.replace(/-|\s|:/gi, '');

		if ( !/^[\d]+$/.test(val) ) {
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
     */
	plusMinusDay: function(day) {
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
     */
	plusMinusMonth: function(month) {
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
     */
	plusMinusYear: function(year) {
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
     */
	plusMinusHour: function(hours) {
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
     */
	plusMinusMinute: function(minutes) {
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
     */
	plusMinusSecond: function(seconds) {
		var _date = new Date();
		var _newDate = new Date();

		_newDate.setSeconds(_date.getSeconds() + seconds);
		return _newDate;
    },
    /**
     * 한글 요일 구하기
     * @param {Date} date
     * @returns {string}
     */
	getKorDayOfWeek: function(date) {
		var _week = new Array('일', '월', '화', '수', '목', '금', '토');
		return _week[date.getDay()];
    },
    /**
     * 현재 월의 마지막 일자를 반환
     * @param {Date} date
     */
	getLastDayOfMonth: function(date) {
		return new Date(date.getYear(), date.getMonth()+1, 0).getDate();
	}
}

CommonJS.Format = {
    /**
     * 숫자 금액 형식 변환 (세자리 콤마)
     * @param {number} num
     * @returns {string}
     */
    formatNumber: function(num) {
        return (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    },
    /**
     * 전화번호, 휴대폰 번호 형식 변환
     * @param {number} num
     * @returns {string}
     */
    addHyphenPhoneNumber: function(num) {
        return (num + '').replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,'$1-$2-$3');
    },
    /**
     * 날짜 형식 변환
     * @param {number} num
     * @returns {string}
     */
    addHyphenDate: function(num) {
        return (num + '').replace(/([0-9]{4})(0[1-9]|1[012])(0[1-9]|1[0-9]|2[0-9]|3[01])/,'$1-$2-$3');
    },
    /**
     * 특수 문자 제거
     * @param {string}} val
     * @returns {string}
     */
    removeSpecial: function(val) {
        var _re = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        return val.replace(_re, '');
    }
}

CommonJS.FormatValid = {
    /**
     * 날짜 형식 체크 (YYYYMMDD, YYYY-MM-DD)
     * @param {string} val1
     * @returns {boolean}
     */
     isDate: function(val) {
		var _re = /^[0-9]{4}-?(0[1-9]|1[012])-?(0[1-9]|1[0-9]|2[0-9]|3[01])+$/;
		return _re.test(val);
    },
    /**
     * 시간 형식 체크 (HH24MI, HH24:MI, HH24MISS, HH24:MI:SS)
     * @param {string} val1
     * @returns {boolean}
     */
    isTime: function(val) {
        var _re = /^([1-9]|[01][0-9]|2[0-3]):?([0-5][0-9])?(:?([0-5][0-9]))+$/;
        return _re.test(val);
    },
    /**
     * 이메일 형식 체크
     * @param {string} val1
     * @param {(undefined|null|string)} val2
     * @returns {boolean}
     */
	isEmail: function(val1, val2) {
        var _val = val1;
        if ( !CommonJS.Valid.isBlank(val2) ) {
            _val = val1 +'@'+ val2;
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
     */
	isPhoneNumber: function(val1, val2, val3) {
        var _val = val1;
        if ( !CommonJS.Valid.isBlank(val2) && !CommonJS.Valid.isBlank(val3) ) {
            _val = val1 +'-'+ val2 +'-'+ val3;
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
     */
	isCellPhoneNumber: function(val1, val2, val3) {
        var _val = val1;
        if ( !CommonJS.Valid.isBlank(val2) && !CommonJS.Valid.isBlank(val3) ) {
            _val = val1 +'-'+ val2 +'-'+ val3;
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
     */
	isBusinessRegNumber: function(val1, val2, val3) {
        var _val = val1;
        if ( !CommonJS.Valid.isBlank(val2) && !CommonJS.Valid.isBlank(val3) ) {
            _val = val1 +'-'+ val2 +'-'+ val3;
        }
		var _re = /^[(\d{3})-?(\d{2})-?(\d{5})+$]/;
		return _re.test(_val);
    },
    /**
     * 아이디 형식 체크 (첫 글자 영문, 7자 이상 30자 이내)
     * @param {string} val
     * @returns {boolean}
     */
	isId: function(val) {
		var _re = /^[a-zA-Z](?=.*[a-zA-Z])(?=.*[0-9]).{6,29}$/;
		return _re.test(val);
    },
    /**
     * 비밀번호 형식 체크 (영문, 숫자, 특수문자 조합 8자 이상)
     * @param {*} val 
     * @returns 
     */
     isPassword: function(val) {
        var _re = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*[^\w\s]).{8,}$/;
        return _re.test(val);
    },
    /**
     * URL 형식 체크
     * @param {*} val 
     * @returns 
     */
     isUrl: function(val) {
        var _re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return _re.test(val);
    }
}

CommonJS.JSON = {
    /**
     * JSON String을 Object로 변환
     * @param {string} jsonStr
     * @returns {Object}
     */
    jsonToObject: function(jsonStr) {
        return JSON.parse(jsonStr);
    },
    /**
     * Object를 JSON String으로 변환
     * @param {Object} obj
     * @returns {string}
     */
    objectToJsonString: function(obj) {
        return JSON.stringify(obj);
    },
    /**
     * Object를 Tree 구조의 JSON String으로 변환
     * @param {Object} obj
     * @returns {string}
     */
    objectToJsonStringPretty: function(obj) {
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
	getFileInfo: function(fileElement) {
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
     */
	getFileExt: function(fileObj) {
		var _fileName = fileObj.name;
		return _fileName.substring(_fileName.lastIndexOf(".")+1);
    },
    /**
     * 파일 용량 단위 구하기
     * @param {number} size
     * @returns {string}
     */
	readableFileSize: function(size) {
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
	previewImage: function(fileElement, imgElement) {
        if (window.addEventListener) {
            fileElement.addEventListener('change', fnSrc);
        } else {
            fileElement.attachEvent('onchange', fnSrc);
        }

        function fnSrc(e) {
            if (window.FileReader) {
                // IE 10 이상
                var _reader = new FileReader();
                _reader.onload = function(e) {
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
    previewVideo: function(fileElement, videoElement) {
        fileElement.addEventListener('change', function(e) {
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
    preListenAudio: function(fileElement, audioElement) {
        fileElement.addEventListener('change', function(e) {
            var _fileUrl = window.URL.createObjectURL(e.target.files[0]);
            audioElement.setAttribute('src', _fileUrl);
        });
    }
}

CommonJS.FileValid = {
    /**
     * 지원 파일 체크 (문서, 이미지)
     * @param {Object}
     * @returns {boolean}
     */
     isAllowFile: function(fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var _arrAllowExt = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp', 'odt', 'odp', 'ods', 'jpg', 'jpeg', 'gif', 'png'];
        return _arrAllowExt.includes(_ext);
    },
    /**
     * 지원 파일 체크 (문서)
     * @param {Object}
     * @returns {boolean}
     */
    isAllowDoc: function(fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var _arrAllowExt = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp', 'odt', 'odp', 'ods'];
        return _arrAllowExt.includes(_ext);
    },
    /**
     * 지원 파일 체크 (이미지)
     * @param {Object}
     * @returns {boolean}
     */
    isAllowImg: function(fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var _arrAllowExt = ['jpg', 'jpeg', 'gif', 'png'];
        return _arrAllowExt.includes(_ext);
    },
    /**
     * 지원 파일 체크 (실행 파일)
     *  - 결과가 true면 업로드 불가, false면 업로드 가능
     * @param {Object} fileObj
     * @returns {boolean}
     */
    ifRunableFile: function(fileObj) {
        var _ext = CommonJS.File.getFileExt(fileObj);
        var extReg = /(bat|bin|cmd|com|cpl|dll|exe|gadget|inf1|ins|isu|jse|lnk|msc|msi|msp|mst|paf|pif|ps1|reg|rgs|scr|sct|sh|shb|shs|u3p|vb|vbe|vbs|vbscript|ws|wsf|wsh)$/i;
        return extReg.test(_ext);
    },
    /**
     * 지원 파일 체크 (커스텀)
     * @param {Object} fileObj 
     * @param {Array} arrAllowExt 
     * @returns 
     */
     isAllowCustom: function(fileObj, arrAllowExt) {
        if ( Array.isArray ) {
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
     */
     isFileMaxSize: function(fileObj, maxSize) {
        return (Number(fileObj.size) > Number(maxSize));
    }
}

CommonJS.Cookie = {
    /**
     * 쿠키 생성
     * @param {string} name
     * @param {*} value
     * @param {number} expireDay
     */
	setCookie: function(name, value, expireDay) {
		var _date = new Date();
		_date.setDate(_date.getDate() + Number(expireDay));
		document.cookie = name +'='+ escape(value) +'; path=/; expires='+ _date.toGMTString() +';';
    },
    /**
     * 쿠키 값 얻기
     * @param {string} name
     * @returns {*}
     */
	getCookie: function(name) {
        var _value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return _value ? unescape(_value[2]) : null;
    },
    /**
     * 쿠키 삭제
     * @param {string} name
     */
	deleteCookie: function(name) {
		var _date = new Date();
        _date.setDate(_date.getDate() -1);
        document.cookie = name +'='+ '; path=/; expires='+ _date.toGMTString() +';';
	}
}

CommonJS.Byte = {
    /**
     * Byte 길이 구하기 (UTF8)
     * @param {*} val
     * @returns {number}
     */
    getByteLengthUtf8: function(val) {
        var _char = '';
        var _nCnt = 0;

        for (var i=0; i < val.length; i++) {
        	_char = val.charCodeAt(i);
        	if ( _char > 127 ) {
        		_nCnt += 3;
        	} else {
        		_nCnt ++;
        	}
        }
        return _nCnt;
    },
    /**
     * Byte 길이 구하기 (EUC_KR)
     * @param {*} val
     * @returns {number}
     */
    getByteLengthEucKr: function(val) {
        var _char = '';
        var _nCnt = 0;

        for (var i=0; i < val.length; i++) {
        	_char = val.charCodeAt(i);
        	if ( _char > 127 ) {
        		_nCnt += 2;
        	} else {
        		_nCnt ++;
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
     */
    escapeHtml: function(val) {
        var _ret = val.replace(/\"/gi, '&quot;').replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        return _ret;
    },
    /**
     * HTML Unescape 처리
     * @param {*} val
     * @returns {string}
     */
    unescapeHtml: function(val) {
        var _ret = val.replace(/&quot;/gi, '\"').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
        return _ret;
    }
}

CommonJS.BrowserInfo = {
    /**
     * 브라우저 종류 및 버전 체크
     * @returns {Object}}
     */
    checkTypeVersion: function() {
        var _agent = navigator.userAgent.toLowerCase();
        var _re = '';

        var browser = {
            name: null,
            version: null
        };

        // IE 체크
        // - IE 12에 해당하는 초장기 Edge 체크 의미 없어져서 제외시킴
        if (_agent.match(/msie/) || _agent.match(/trident/) ) {
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
                browser.name = 'Whale';     // Chromium 기반
            }
            else if (_agent.match(/edg/)) {
                // edge 에서 edg 로 변경됨....
                _re = /edg\/(\S+)/;
                browser.name = 'Edge';      // Chromium 기반
            }

            else if (_agent.match(/opr/)) {
                // opera 에서 opr 로 변경됨....
                _re = /opr\/(\S+)/;
                browser.name = 'Opera';     // Chromium 기반
            }
            else if (_agent.match(/chrome/)) {
                _re = /chrome\/(\S+)/;
                browser.name = 'Chrome';    // Chromium 기반
            }
            else if (_agent.match(/firefox/)) {
                _re = /firefox\/(\S+)/;
                browser.name = 'Firefox';
            }
            else if (_agent.match(/safari/)) {
                _re = /safari\/(\S+)/;
                browser.name = 'Safari';
            }
            else {
                console.log( _agent );
            }

            if ( browser.name != null ) {
                browser.version = _re.exec(_agent)[1];
            }
        }

        return browser;
    },
    /**
     * 모바일 브라우저 여부 체크
     * @returns {boolean}
     */
    isMobile: function() {
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
     */
    isMobileOs: function() {
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
    onlyNum: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^0-9]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^0-9]/gi, '') );
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
    onlyFormatNum: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {    
                this.value = fnTemp(e);
            });
        } else {
            $(document).on('keyup', inputElement, function(e) {
                inputElement.val( fnTemp(e) );
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
    onlyEng: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^a-zA-Z]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^a-zA-Z]/gi, '') );
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
    onlyEngUnder: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^a-zA-Z_]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^a-zA-Z_]/gi, '') );
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
    onlyEngNum: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^a-zA-Z0-9]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^a-zA-Z0-9]/gi, '') );
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
    onlyEngBlank: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^a-zA-Z\s]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^a-zA-Z\s]/gi, '') );
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
    onlyHangul: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '') );
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
    onlyHangulBlank: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/gi, '') );
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
    onlyHanEngNum: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]/gi, '') );
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
    blockingHangul: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                this.value = e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '');
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				inputElement.val( e.target.value.replace(/[가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '') );
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
    enterEventFocus: function(inputElement, focusElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keypress', function(e) {
                fnTemp(e);
            });
        } else {
			$(document).on('keypress', inputElement, function(e) {
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
    enterEventCallback: function(inputElement, callback) {
        if (typeof callback === 'function') {
            if ( inputElement.length === undefined ) {
                inputElement.addEventListener('keypress', function(e) {
                    fnTemp(e);
                });
            } else {
                $(document).on('keypress', inputElement, function(e) {
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
    formatHypenPhone: function(inputElement) {
        if ( inputElement.length === undefined ) {
            inputElement.addEventListener('keyup', function(e) {
                fnTemp(e, inputElement);
            });
        } else {
			$(document).on('keyup', inputElement, function(e) {
				fnTemp(e, inputElement);
			});
        }

        function fnTemp(e, inputElement) {
			var _type;
			if ( inputElement.length === undefined ) {
				_type = 0;
			} else {
				_type = 1;
			}
			
            var _str;
			if ( _type === 0 ) {
				_str = inputElement.value;
			} else {
				_str = inputElement.val();
			}
			
            _str = _str.replace(/[^0-9]/g, '');
    
            var tmp = '';

            if ( _str.substring(0, 2) == 02 ) {
                // 서울 전화번호일 경우 10자리까지만 나타나고 그 이상의 자리수는 자동삭제
                if ( _str.length < 3 ) {
					if ( _type === 0 ) {
						inputElement.value = _str;
					} else {
						inputElement.val( _str );
					}
                } else if ( _str.length < 6 ) {
                    tmp += _str.substr(0, 2);
                    tmp += '-';
                    tmp += _str.substr(2);
                    
					if ( _type === 0 ) {
						inputElement.value = tmp;
					} else {
						inputElement.val( tmp );
					}
                } else if ( _str.length < 10 ) {
                    tmp += _str.substr(0, 2);
                    tmp += '-';
                    tmp += _str.substr(2, 3);
                    tmp += '-';
                    tmp += _str.substr(5);
                    
					if ( _type === 0 ) {
						inputElement.value = tmp;
					} else {
						inputElement.val( tmp );
					}
                } else {
                    tmp += _str.substr(0, 2);
                    tmp += '-';
                    tmp += _str.substr(2, 4);
                    tmp += '-';
                    
					if ( _type === 0 ) {
						inputElement.value = tmp;
					} else {
						inputElement.val( tmp );
					}
                }
            } else {
                // 핸드폰 및 다른 지역 전화번호 일 경우
                if ( _str.length < 4 ) {
					if ( _type === 0 ) {
						inputElement.value = _str;
					} else {
						inputElement.val( _str );
					}
                } else if ( _str.length < 7 ) {
                    tmp += _str.substr(0, 3);
                    tmp += '-';
                    tmp += _str.substr(3);
					
					if ( _type === 0 ) {
						inputElement.value = tmp;
					} else {
						inputElement.val( tmp );
					}
                } else if ( _str.length < 11 ) {
                    tmp += _str.substr(0, 3);
                    tmp += '-';
                    tmp += _str.substr(3, 3);
                    tmp += '-';
                    tmp += _str.substr(6);
					
					if ( _type === 0 ) {
						inputElement.value = tmp;
					} else {
						inputElement.val( tmp );
					}
                } else {
                    tmp += _str.substr(0, 3);
                    tmp += '-';
                    tmp += _str.substr(3, 4);
                    tmp += '-';
                    tmp += _str.substr(7);
					
					if ( _type === 0 ) {
						inputElement.value = tmp;
					} else {
						inputElement.val( tmp );
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
    makeNewForm: function(searchKeyword) {
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
    searchGoogle: function(searchKeyword) {
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
    searchNaver: function(searchKeyword) {
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
    searchDaum: function(searchKeyword) {
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
    shareFacebook: function(url) {
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
    shareTwitter: function(url) {
        window.open(
            'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url)
        );
    },
    /**
     * Kakao 공유
     * @param {string} apiKey 
     * @param {string} webUrl
     * @param {string} mobileWebUrl
     * @param {string} title - 공유 미리보기 제목
     * @param {string} imageUrl - 공유 미리보기 썸네일
     * @param {string} btnTitle
     * @example
     * CommonJS.SnsShare.shareKakao(apiKey, webUrl, mobileWebUrl, title, imageUrl, btnTitle);
     * 
     * @link https://developers.kakao.com/docs/latest/ko/getting-started/sdk-js
     * @link https://developers.kakao.com/docs/latest/ko/message/js-link
     */
    shareKakao: function(apiKey, webUrl, mobileWebUrl, title, imageUrl, btnTitle) {
        Kakao.init(apiKey);
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
            buttons: [
                {
                    title: btnTitle, 
                    link: {
                        webUrl: webUrl,
                        mobileWebUrl: mobileWebUrl
                    } 
                }
            ]
        });
    },
    /**
     * Kakao Story 공유
     * @param {string} apiKey 
     * @param {string} url 
     * @param {string} title 
     * @example
     * CommonJS.SnsShare.shareKakaoStory(apiKey, url, title);
     */
    shareKakaoStory: function(apiKey, url, title) {
        Kakao.init(apiKey);
        Kakao.Story.share(
            {
                url: url,
                text: title
            }
        );
    }
}

CommonJS.Mobile = {
    /**
     * SMS 문자 보내기
     *   - 연락처, 문자 내용 설정된 상태로 문자 보내기 화면으로 이동 시킴
     * @param {string|number} telNo 
     * @param {string} content 
     * @example
     * CommonJS.Mobile.sendSMS('010-9924-3732', '테스트');
     */
    sendSMS: function(telNo, content) {
        if ( CommonJS.BrowserInfo.isMobile() ) {
            if ( CommonJS.FormatValid.isCellPhoneNumber(telNo) ) {
                var _mobileOs = CommonJS.BrowserInfo.isMobileOs().iOS ? 'ios' : 'android';

                location.href = 'sms:' + telNo +(_mobileOs == 'ios' ? '&' : '?') + 'body='+ encodeURIComponent(content);
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
    makeAcall: function(telNo) {
        if ( CommonJS.BrowserInfo.isMobile() ) {
            if ( CommonJS.FormatValid.isCellPhoneNumber(telNo) ) {
                location.href = 'tel:' + telNo;
            }
        } else {
            console.log('모바일 플랫폼에서만 사용 가능합니다.');
        }
    }
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