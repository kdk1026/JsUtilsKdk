$.extend({
	/**
	 * IE, Edge 버전 체크
	 */
	IEVersionCheck: function() {
		var word,
			version = false;

		var agent = navigator.userAgent.toLowerCase();
		if ( agent.match(/msie/) ) {
			word = 'msie ';
		} else {
			if ( agent.match(/trident/) ) {
				word = 'trident/.*rv:';
			}
			else if (agent.match(/edge/) ) {
				word = 'edge/';
			}
		}

		var reg = new RegExp(word + "([0-9]{1,})([\.0-9]{0,})");
		if (reg.exec(agent) != null) {
			if ( RegExp.$2 !== '.0' ) {
				version = RegExp.$1 + RegExp.$2;
			} else {
				version = RegExp.$1;
			}
		}
		return version;
	},
	/**
	 * Chrome 버전 체크
	 */
	ChromeVersionCheck: function() {
		var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		return raw ? parseInt(raw[2], 10) : false;
	},
	/**
	 * 이미지 미리보기
	 */
	previewImage: function($fileElement, $imgElement) {
		$fileElement.change(function() {
			if (window.FileReader) {
				var reader = new FileReader();
				reader.onload = function(e) {
					$imgElement.src("src", e.target.result);
				}
				reader.readAsDataURL(fileElement.files[0]);
			}
		});
	},
	/**
	 * JSON String -> Object 변환
	 */
	jsonToObj: function(json) {
		var resObj = {};

		if (json != null) {
			if ( json.replace(/ /gi,'') != '' ) {
				resObj = $.parseJSON(json);
			}
		}
		return resObj;
	},
	/**
	 * Object -> JSON String 변환
	 */
	objToJson: function(obj) {
		var resStr = '';

		if (obj != null) {
			if (obj.length > 0) {
				resStr = JSON.stringify(obj);
			}
		}
		return resStr;
	},
	/**
	 * 팝업 창 띄우기
	 */
	openPopup: function(width, height, winName, url) {
		var leftPos = (screen.width) ? (screen.width - width) / 2 : 100,
			topPos = (screen.height) ? (screen.height - height) / 2 : 100;

		var option = '';
		option += 'toolbar=0, location=0, directories=0, status=0, menubar=0, scrollbars=yes, resizable=0';
		option += ', top='+topPos+', left='+leftPos+',copyhistory=0, width='+width+', height='+height;

		window.open(url, winName, option);
	},
	/**
	 * 숫자만 입력
	 */
	inputOnlyNumber: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^0-9]/gi, '') );
		});
	},
	/**
	 * 영문만 입력
	 */
	inputOnlyEnglish: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^a-zA-Z]/gi, '') );
		});
	},
	/**
	 * 영문+숫자만 입력
	 */
	inputOnlyEngNum: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^a-zA-Z0-9]/gi, '') );
		});
	},
	/**
	 * 한글만 입력(자음,모음 제외)
	 */
	inputOnlyHangul: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^가-힣]/gi, '') );
		});
	},
	/**
	 * 한글(자음,모음 제외)+영문+숫자만 입력
	 */
	inputOnlyHanEngNum: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[^가-힣a-zA-Z0-9]/gi, '') );
		});
	},
	/**
	/**
	 * 자음,모음 포함한 한글 입력 막기
	 */
	inputBlockHangul: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/gi, '') );
		});
	},
	/**
	 * 특수문자만 제외하고 입력
	 */
	inputBlockSpecial: function($element) {
		$element.on('blur keyup', function(){
			$(this).val( $(this).val().replace(/[\\W|~!@#$%^&*()-_+|<>?:{}]/gi, '') );
		});
	},
	/**
	 * 숫자만 입력 + 숫자 세자리마다 콤마 찍기
	 */
	numberFormat: function($element) {
		$element.on('blur keyup', function(){
			var strVal = $element.val().replace(/,/g, '').replace(/[^0-9]/gi, '');
			var regExp = /(^[+-]?\d+)(\d{3})/;

			while (regExp.test(strVal)) {
				strVal = strVal.replace(regExp, '$1' + ',' + '$2');
			}

			return $element.val(strVal);
		});
	},
	/**
	 * 엔터키 이벤트 발생 시, 포커스 이동
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
	 * ajax 공통
	 */
	ajaxSync: function(url, param) {
		var retObj = {};

		$.ajaxSetup({
			traditional: true,
			cache: false,
			async: false
		});

		$.ajax({
			url: url,
			data: param,
			type: 'post',
			contentType: "application/x-www-form-urlencoded",
			dataType: 'json',
			success: function(data) {
				retObj = data;
			},
			error: function(res, status) {
				retObj = res.responseJSON;
			}
		});
		return retObj;
	},
	/**
	 * ajax 공통 JSON
	 */
	ajaxSyncJson: function(url, headers, param) {
		var retObj = {};
		
		$.ajaxSetup({
			traditional: true,
			cache: false,
			async: false,
			headers: headers
		});
		
		$.ajax({
			url: url,
			type: 'post',
			contentType: "application/json",
			data: param,
			success: function(data) {
				retObj = data;
			},
			error: function(res, status) {
				retObj = res.responseJSON;
			}
		});
		return retObj;
	},
	/**
	 * ajax 공통 FILE
	 */
	ajaxSyncFile: function(url, headers, file) {
		var retObj = {};
		var data = new FormData();
		data.append("file", file);
		
		$.ajaxSetup({
			traditional: true,
			cache: false,
			async: false,
			headers: headers
		});
		
		$.ajax({
			url: url,
			type: 'post',
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			data: data,
			success: function(data) {
				retObj = data;
			},
			error: function(res, status) {
				retObj = res.responseJSON;
			}
		});
		return retObj;
	},
	/**
	 * ajax 공통 FILE Security
	 */
	ajaxSyncFileSec: function(url, headers, csrfToken, csrfHeader, file) {
		var retObj = {};
		var data = new FormData();
		data.append("file", file);
		
		$.ajaxSetup({
			traditional: true,
			cache: false,
			async: false,
			headers: headers
		});
		
		$.ajax({
			url: url,
			type: 'post',
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			data: data,
			beforeSend: function(xhr) {
				xhr.setRequestHeader(header, token);
			},
			success: function(data) {
				retObj = data;
			},
			error: function(res, status) {
				retObj = res.responseJSON;
			}
		});
		return retObj;
	},
	/**
	 * form의 데이터를 Object 형태로 반환
	 */
	formSerializeObject: function($formElement) {
		var disabled = $formElement.find(':disabled').removeAttr('disabled');
    	var obj = null;
    	var arr = $formElement.serializeArray();
    	if (arr) {
    		obj = {};
    		$.each(arr, function() {
    			obj[this.name] = this.value;
    		});
    	}
    	disabled.attr('disabled', 'disabled');
    	return obj;
	},
	/**
	 * Object 데이터를 Tree 구조 JSON 형태의 문자열로 반환
	 * - pre 태그 및 textarea 태그에서만 적용 가능
	 */
	jsonPrettyPrint: function(obj) {
		var sJson = '';
		sJson = JSON.stringify(obj, null, 2);
		return sJson;
	}
});

/**
 * IE 12(Edge) / Chrome 41 이하에서 startsWith 사용
 */
String.prototype.startsWith = function(str) {
	return this.substring( 0, str.length ) === str;
}
/**
 * IE 12(Edge) / Chrome 41 이하에서 endsWith 사용
 */
String.prototype.endsWith = function(str) {
	return this.substring( this.length - str.length, this.length ) === str;
}

//----------------------------------------------------
//Array.prototype (contains)
//----------------------------------------------------
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}