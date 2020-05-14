/*
[Ajax Global 설정 참고]
    - 헤더 fragment 등에서 선언

$(function(){
    $.ajaxSetup({
        beforeSend: function(xhr) {
			// JWT, oAuth 등 인증
			xhr.setRequestHeader('Authorization', authorization);
			
			// Spring Security의 CSRF 사용 시
			xhr.setRequestHeader(csrfHeader, csrfToken);
			
			// 로딩 이미지 Show
		},
		, complete: function() {
			// 로딩 이미지 Hide
		}
    });
});
*/

/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.12.02
 * @version 1.0
 * @description 특정 프로젝트가 아닌, 범용적으로 사용하기 위한 jQuery 확장
 */
$.extend({
    /**
     * 숫자만 입력
     * @param {Element} $element 
     */
    inputOnlyNum: function($element) {
        $element.on('blur keyup', function(){
            $(this).val( $(this).val().replace(/[^0-9]/gi, '') );
        });
    },
    /**
     * 숫자만 입력 + 세 자리마다 콤마 자동 입력
     * @param {Element} $element 
     */
    inputOnlyFormatNum: function($element) {
        $element.on('blur keyup', function(){
            var _val = $element.val().replace(/,/g, '').replace(/[^0-9]/gi, '');
            var _re = /(^[+-]?\d+)(\d{3})/;

            while (_re.test(_val)) {
                _val = _val.replace(_re, '$1' + ',' + '$2');
            }

            return $element.val(_val);
        });
    },
    /**
     * 영문만 입력
     * @param {Element} $element 
     */
	inputOnlyEng: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^a-zA-Z]/gi, '') );
		});
	},
    /**
     * 영문 + '_' 만 입력
     * @param {Element} $element 
     */
	inputOnlyEngUnder: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^a-zA-Z_]/gi, '') );
		});
    },
    /**
     * 영문 + 숫자만 입력
     * @param {Element} $element 
     */
	inputOnlyEngNum: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^a-zA-Z0-9]/gi, '') );
		});
    },
    /**
     * 영문 + SPACE 입력
     * @param {Element} $element 
     */
	inputOnlyEngBlank: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^a-zA-Z\s]/gi, '') );
		});
    },
    /**
     * 한글만 입력
     *  - 한글: 자음, 모음 제외
     * @param {Element} $element 
     */
	inputOnlyHangul: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^가-힣]/gi, '') );
		});
    },
    /**
     * 한글 + SPACE 입력
     *  - 한글: 자음, 모음 제외
     * @param {Element} $element 
     */
	inputOnlyHangulBlank: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^가-힣\s]/gi, '') );
		});
    },
    /**
     * 한글 + 영문 + 숫자 입력
     *  - 한글: 자음, 모음 제외
     * @param {Element} $element
     */
	inputOnlyHanEngNum: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^가-힣a-zA-Z0-9]/gi, '') );
		});
    },
    /**
     * 한글 + 영문 + 숫자 + SPACE 입력
     *  - 한글: 자음, 모음 제외
     * @param {Element} $element 
     */
	inputOnlyHanEngNumBlank: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^가-힣a-zA-Z0-9\s]/gi, '') );
		});
    },
    /**
     * 한글 입력 막기
     *  - 한글: 자음, 모음 포함
     * @param {Element} $element 
     */
	inputBlockingHangul: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/gi, '') );
		});
    },
    
	/**
	 * 엔터키 이벤트 발생 시, 다음 포커스로 이동
     * @param {Element} $element 
	 */
	enterEventFocus: function($element) {
		$element.keypress(function(e) {
			if (e.keyCode == 13) {
				var inputs = $(this).parents("form").eq(0).find(':input:visible');
				inputs.eq( inputs.index(this)+ 1 ).focus();
			}
		});
	},
	/**
	 * 엔터키 이벤트 발생 시, 함수 실행
     * @param {Element} $element
     * @param {Function} callback
	 */
	enterEventCallback: function($element, callback) {
		if (typeof callback === 'function') {
			$element.keypress(function(e) {
				if (e.keyCode == 13) {
                    callback();
				}
			});
		}
    },
    /**
     * 공통 AJAX Sync 처리
     *  - 요청: default (application/x-www-form-urlencoded; charset=UTF-8')
     * @param {string} url 
     * @param {(undefined|Object)} header 
     * @param {(undefined|Object)} param
     * @param {(undefined|Function)} callback 
     */
    ajaxSync: function(url, header, param, callback) {
        var _retObj = {};

		$.ajax({
            url: url,
            async: false,
            cache: false,
            traditional: true,
            headers: (header == undefined) ? {} : header,
            data: (param == undefined) ? {} : param,
			type: 'POST',
			success: function(result) {
                if (callback == undefined) {
                    _retObj = result;
                } else {
                    callback(result);
                }
			},
			error: function(xhr, status, err) {
                var _ret = xhr.responseJSON;
                if ( _ret != null && _ret.replace(/ /gi,'') != '' ) {
                    _retObj = _ret;
                } else {
                    alert('[code] - '+xhr.status+', [error] - '+err);
                }
			}
        });
        return _retObj;
    },
    /**
     * 공통 AJAX Sync 파일 처리
     *  - 요청: default (application/x-www-form-urlencoded; charset=UTF-8')
     * @param {string} url 
     * @param {(undefined|Object)} header
     * @param {Element} $formElement 
     * @param {(undefined|Function)} callback 
     */
    ajaxSyncFile: function(url, header, $formElement, callback) {
        var _form = $formElement;
        var _data = new FormData(_form);
        var _retObj = {};

		$.ajax({
            url: url,
            async: false,
            cache: false,
            traditional: true,
            headers: (header == undefined) ? {} : header,
            data: _data,
			type: 'POST',
			success: function(result) {
                if (callback == undefined) {
                    _retObj = result;
                } else {
                    callback(result);
                }
			},
			error: function(xhr, status, err) {
                var _ret = xhr.responseJSON;
                if ( _ret != null && _ret.replace(/ /gi,'') != '' ) {
                    _retObj = _ret;
                } else {
                    alert('[code] - '+xhr.status+', [error] - '+err);
                }
			}
        });
        return _retObj;
    },
    /**
     * 공통 AJAX Sync 처리
     *  - 요청: JSON
     * @param {string} url 
     * @param {(undefined|Object)} header 
     * @param {(undefined|Object)} param
     * @param {(undefined|Function)} callback 
     */
    ajaxSyncJson: function(url, header, param, callback) {
        var _retObj = {};

		$.ajax({
            url: url,
            async: false,
            cache: false,
            traditional: true,
            contentType: "application/json; charset=UTF-8",
            headers: (header == undefined) ? {} : header,
            data: (param == undefined) ? {} : param,
			type: 'POST',
			success: function(result) {
                if (callback == undefined) {
                    _retObj = result;
                } else {
                    callback(result);
                }
			},
			error: function(xhr, status, err) {
                var _ret = xhr.responseJSON;
                if ( _ret != null && _ret.replace(/ /gi,'') != '' ) {
                    _retObj = _ret;
                } else {
                    alert('[code] - '+xhr.status+', [error] - '+err);
                }
			}
        });
        return _retObj;
    },

    /**
     * <pre>
     * form의 데이터를 Object 형태로 반환
     *   - Array 때문에 serialize() 가 안되는 경우 등 사용
     * </pre>
     * @param {Element} $formElement 
     */
	formSerializeObject: function($formElement) {
		var _disabled = $formElement.find(':disabled').removeAttr('disabled');
    	var _obj;
    	var _arr = $formElement.serializeArray();
    	if (_arr) {
    		_obj = {};
    		$.each(_arr, function() {
    			_obj[this.name] = this.value;
    		});
    	}
    	_disabled.attr('disabled', 'disabled');
    	return _obj;
	}
})