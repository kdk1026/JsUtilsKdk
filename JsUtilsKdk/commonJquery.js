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
            contentType : false,
            processData : false,
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
     * 공통 AJAX Sync 처리
     *  - 응답: HTML
     * @param {string} url 
     * @param {(undefined|Object)} header 
     * @param {(undefined|Object)} param
     * @param {Element} $divElement
     */
    ajaxSyncHtml: function(url, header, param, $divElement) {
        var _retObj = {};

		$.ajax({
            url: url,
            async: false,
            cache: false,
            traditional: true,
            dataType: 'html',
            headers: (header == undefined) ? {} : header,
            data: (param == undefined) ? {} : param,
			type: 'POST',
			success: function(result) {
                $divElement.html(result);
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