/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.11.30
 * @version 1.0
 * @description 진행중
 */
var CommonJS = {
    
    /**
     * 공백, 빈 문자열 체크 (undefined == null)
     * @param {*} val
     * @returns {boolean}
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
        var _re = /[`~!@#$%^&*()-_=+{};:'\",.<>?]+$/;
        return _re.test(val);
    },
    /**
     * 숫자 금액표시 (세자리 콤마)
     * @param {number} num
     * @returns {string}
     */
    numberWithCommas: function(num) {
        return (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    },
    /**
     * 팝업창 띄우기
     * @param {string} url
     * @param {(null|blank|string)} name
     * @param {(null|number)} width
     * @param {(null|number)} height
     */
    openPopup: function(url, name, width, height) {
        var _height = (this.isUndefined(height)) ? screen.height : Number(height);
        var _width = (this.isUndefined(width)) ? screen.width : Number(width);
        var _left = (screen.width - width) / 2;
        var _top = (screen.height - height) / 2;
        var _option = '';
        _option += 'height='+_height+', width='+_width+', left='+_left+', top='+_top;
        _option += 'menubar=no, status=no';
        _option += 'resizable=no, scrollbars=no, toolbar=no';   // IE only | IE, Firefox, Opera only | IE, Firefox only

        window.open(url, name, _option);
    },
    /**
     * HTML Escape 처리
     * @param {*} val
     * @returns {string}
     */
    escapeHtml: function(val) {
        var _ret = val.replace('\"', '&quot;').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
        return _ret;
    },
    /**
     * HTML Unescape 처리
     * @param {*} val
     * @returns {string}
     */
    unescapeHtml: function(val) {
        var _ret = val.replace('&quot;', '\"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>');
        return _ret;
    },
    /**
     * JSON Escape 처리
     * @param {*} val
     * @returns {string}
     */
    escapeJson: function(val) {
        var _ret = val.replace('\"', '\\\"').replace('\\"', '\\\\"').replace('/', '\\/');
        return _ret;
    },
    /**
     * JSON Unescape 처리
     * @param {*} val
     * @returns {string}
     */
    unescapeJson: function(val) {
        var _ret = val.replace('\\\"', '\"').replace('\\\\"', '\\"').replace('\\/', '/');
        return _ret;
    },
    /**
     * Byte 길이 구하기 (UTF8)
     * @param {*} val
     * @returns {number}
     */
    getByteLengthUtf8: function(val) {
        var _char = '';
        var _nCnt = 0;

        for (var i=0; i < val.length; i++) {
            _char = val.charAt(i);
            if ( escape(val).length > 4 ) {
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
            _char = val.charAt(i);
            if ( escape(val).length > 4 ) {
                _nCnt += 2;
            } else {
                _nCnt ++;
            }
        }
        return _nCnt;
    }
    
    // TODO : 이메일 형식 체크
    // TODO : 전화번호 형식 체크
    // TODO : 휴대폰번호 형식 체크

    // TODO : 전환번호 표시 (하이픈)
    // TODO : 휴대폰번호 표시 (하이픈)

    // TODO : 입력 길이 체크

    // TODO : Object 데이터를 Tree 구조 JSON 형태의 문자열로 반환

    // TODO : DateTime 관련 자주 쓰일만한 것 (그 외에는 DateTime.js로 처리)
    // TODO : File 관련
}

/**
 * IE 12(Edge) / Chrome 41 이하에서 startsWith 사용
 * @param {string} val
 * @returns {boolean}
 */
String.prototype.startsWith = function(val) {
	return this.substring(0, val.length) === val;
}
/**
 * IE 12(Edge) / Chrome 41 이하에서 endsWith 사용
 * @param {string} val
 * @returns {boolean}
 */
String.prototype.endsWith = function(val) {
	return this.substring(this.length - val.length, this.length) === val;
}
/**
 * IE 14(Edge) / Chrome 47 이하에서 includes 사용 (start는 제외)
 * @param {*} element
 * @returns {boolean} 
 */
Array.prototype.includes = function(element) {
	var i = this.length;
	while (i--) {
		if (this[i] === element) {
			return true;
		}
	}
	return false;
}