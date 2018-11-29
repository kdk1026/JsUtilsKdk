jQuery.extend({

	// ajax 공통
	ajaxSend: function(method, url, param) {
		var resObj = {};
		var $token = $("input[name='_csrf']").val();
		var header = "X-CSRF-TOKEN";

		$.ajaxSetup({
			beforeSend: function(xhr) {
				xhr.setRequestHeader(header, $token);
			}
		});

		$.ajax({
			url: url,
			data: param,
			type: method,
			dataType: 'json',
			success: function(data){
				resObj = data;
			},
			async: false,
			error: function(xhr, e) {
				console.log(e.responseText);
				xhr.abort();
			}
		});
		return resObj;
	},

	// 이미지 미리보기
	previewImage: function($fileElement, $imgElement) {
		$fileElement.change(function(e) {
			if (window.FileReader) {
				// IE 9 이상
				var reader = new FileReader();
				reader.onload = function(e) {
					$imgElement.src("src", e.target.result);
				}
				reader.readAsDataURL(fileElement.files[0]);
			} else {
				// IE 8
				fileElement.select();
				$imgElement.src("src", document.selection.createRange().text);
			}
			$imgElement.removeAttr("style");
		});
	},

	//----------------------------------------------------
	// 텍스트 필드 관련
	//----------------------------------------------------

	// 숫자만 입력 (나머지 문자는 제거)
	inputOnlyNumber: function($element) {
		$element.keyup(function(e) {
			$element.val( $element.val().replace(/[^0-9]/gi, '') );
		});
	},

	// 영문만 입력 (나머지 문자는 제거)
	inputOnlyEnglish: function($element) {
		$element.keyup(function(e) {
			$element.val( $element.val().replace(/[^a-zA-Z]/gi, '') );
		});
	},

	// 한글만 입력 (나머지 문자는 제거)
	inputOnlyHangul: function($element) {
		$element.keyup(function(e) {
			$element.val( $element.val().replace(/[a-zA-Z0-9]|[`~!@#$%^&*()-_=+\[\]{}|;':''"<>?,./\s]/g, '') );
		});
	},

	// 특수문자만 제거하고 입력
	inputNotSpecial: function($element) {
		$element.keyup(function(e) {
			$element.val( $element.val().replace(/[`~!@#$%^&*()-_=+\[\]{}|;':''"<>?,./\s]/g, '') );
		});
	},

	// 숫자만 입력 + 숫자 세자리마다 콤마 찍기
	numberFormat: function($element) {
		$element.keyup(function(e) {
			var strVal = $element.val().replace(/,/g, '').replace(/[^0-9]/gi, '');
			var regExp = /(^[+-]?\d+)(\d{3})/;

			while (regExp.test(strVal)) {
				strVal = strVal.replace(regExp, '$1' + ',' + '$2');
			}

			return $element.val(strVal);
		});
	},

	// 엔터키 이벤트 발생 시, 함수 실행
	enterEventCallback: function($element, callback) {
		if (typeof callback === 'function') {
			$element.keypress(function(e) {
				if (e.keyCode == 13) {
					callback();
				}
			});
		}
	}

});