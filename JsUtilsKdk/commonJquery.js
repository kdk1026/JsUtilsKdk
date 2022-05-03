/*
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		// JWT, oAuth 등 인증
		xhr.setRequestHeader('Authorization', authorization);
		
    	if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {			
			// Spring Security의 CSRF 사용 시
			xhr.setRequestHeader(csrfHeader, csrfToken);
        }

		// Spring Security의 AccessDeniedHandler 인터페이스 구현 시, Ajax 호출 여부 판단
    	xhr.setRequestHeader("X-Ajax-Call", "TRUE");
		
		// 로딩 이미지 Show (ajaxStart 에서도 가능)
    }, complete: function() {
		// 로딩 이미지 Hide (ajaxStop 에서도 가능)
	}
});

$(document).ajaxStart(function() {
	// 로딩 이미지 Show
});

$(document).ajaxStop(function() {
	// 로딩 이미지 Hide
});
*/

/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.12.02
 * @version 2.1
 * @description 특정 프로젝트가 아닌, 범용적으로 사용하기 위한 jQuery 확장
 */
 $.extend({
	/**
	 * 엔터키 이벤트 발생 시, 다음 포커스로 이동
     * @param {Element} $element 
	 * @example
	 * $.enterEventFocus($element);
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
     * 공통 Ajax 처리
     * @param {boolean} isAsync 
     * @param {string} method 
     * @param {string} url 
     * @param {(undefined|Object)} header 
     *   - param, callback 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {(undefined|Object)} param 
     * @param {(undefined|Function)} callback 
     * @returns 
	 * @example
	 * $.commonAjax(isAsync, method, url, header, param, callback);
     */
	commonAjax: function(isAsync, method, url, header, param, callback) {
		let _retData = {};

		let _contentType = "application/x-www-form-urlencoded; charset=utf-8";
		let _params = (param == undefined) ? {} : param;

		if (typeof param == 'object') {
			try {
				_params = param.serialize();

			} catch (e) {
				if (Array.isArray(param)) {
					_contentType = "application/json; charset=utf-8";
					_params = JSON.stringify(param);
				}
			}
		}

		$.ajax({
			async: isAsync,
			cache: false,
			traditional: true,
			contentType: _contentType,
			dataType: "json",
			type: method,
			url: url,
            headers: (header == undefined) ? {} : header,
			data: _params,
			success: function(result) {
				if (isAsync) {
					callback(result);
				} else {
					if ( (callback == undefined) || (typeof callback != 'function') ) {
						_retData = result;
					} else {
						callback(result);
					}
				}
			},
			error: function(xhr, status, err) {
				alert("code = "+ xhr.status + " message = " + xhr.responseText + " error = " + err);
			}
		});

		return _retData;
	},
    /**
     * 공통 Ajax 처리 (JSON)
     * @param {boolean} isAsync 
     * @param {string} method 
     * @param {string} url 
     * @param {(undefined|Object)} header 
     *   - param, callback 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {(undefined|Object)} param 
     * @param {(undefined|Function)} callback 
     * @returns 
	 * @example
	 * $.commonAjax(isAsync, method, url, header, param, callback);
     */
	 commonAjaxJson: function(isAsync, method, url, header, param, callback) {
		let _retData = {};

		let _contentType = "application/json; charset=utf-8";
		let _params = (param == undefined) ? {} : param;

		$.ajax({
			async: isAsync,
			cache: false,
			traditional: true,
			contentType: _contentType,
			dataType: "json",
			type: method,
			url: url,
            headers: (header == undefined) ? {} : header,
			data: _params,
			success: function(result) {
				if (isAsync) {
					callback(result);
				} else {
					if ( (callback == undefined) || (typeof callback != 'function') ) {
						_retData = result;
					} else {
						callback(result);
					}
				}
			},
			error: function(xhr, status, err) {
				alert("code = "+ xhr.status + " message = " + xhr.responseText + " error = " + err);
			}
		});

		return _retData;
	},
    /**
     * 공통 Ajax 파일 처리
     * @param {boolean} isAsync 
     * @param {string} method 
     * @param {string} url 
     * @param {(undefined|Object)} header  
     *   - param, callback 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {Element} $formElement 
     * @param {(undefined|Function)} callback 
     * @returns 
	 * @example
	 * $.commonAjaxFile(isAsync, method, url, header, $formElement, callback);
     */
	commonAjaxFile: function(isAsync, method, url, header, $formElement, callback) {
		let _retData = {};

		let _param = new FormData($formElement[0]);

		$.ajax({
			async: isAsync,
			cache: false,
			traditional: true,
			contentType: false,
			processData : false,
			enctype: 'multipart/form-data',
			type: method,
			url: url,
			headers: (header == undefined) ? {} : header,
			data: _param,
			success: function(result) {
				if (isAsync) {
					callback(result);
				} else {
					if ( (callback == undefined) || (typeof callback != 'function') ) {
						_retData = result;
					} else {
						callback(result);
					}
				}
			},
			error: function(xhr, status, err) {
				alert("code = "+ xhr.status + " message = " + xhr.responseText + " error = " + err);
			}
		});

		return _retData;
	},
    
    /**
     * <pre>
     * form의 데이터를 Object 형태로 반환
     *   - Array 때문에 serialize() 가 안되는 경우 등 사용
     * </pre>
     * @param {Element} $formElement 
	 * @example
	 * $.formSerializeObject($formElement);
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