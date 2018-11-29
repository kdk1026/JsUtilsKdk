var CommonUtils = {

	// 브라우저 종류 판별
	getBrowserType: function() {
		var browserType;
		var userAgent = navigator.userAgent.toLowerCase();

		if ( (userAgent.indexOf('msie') > -1) || (userAgent.indexOf('trident') > -1) ) {
			browserType = 'IE';
		}
		else if (userAgent.indexOf('edge') > -1) {
			browserType = 'Edge';
		}
		else if (userAgent.indexOf('chrome') > -1) {
			browserType = 'Chrome';
		}
		else if (userAgent.indexOf('firefox') > -1) {
			browserType = 'Firefox';
		}
		else if (userAgent.indexOf('safari') > -1) {
			browserType = 'Safari';
		}
		else if (userAgent.toLowerCase().indexOf('op') > -1) {
			browserType = 'Opera';
		}
		else {
			browserType = 'Etc';
		}

		return browserType;
	},

	// IE 버전 판별
	getIEVersion: function() {
		var version,
			word;
		var userAgent = navigator.userAgent.toLowerCase();
		var appName = navigator.appName;

		if (appName === 'Microsoft Internet Explorer') {
			word = 'msie '
		} else {
			if (userAgent.indexOf('trident') > -1) {
				word = 'trident/.*rv:';
			}
			else if (userAgent.indexOf('edge') > -1) {
				word = 'edge/';
			}
		}

		var reg = new RegExp(word + "([0-9]{1,})([\.0-9]{0,})");
		if (reg.exec(userAgent) != null) {
			version = RegExp.$1;
		}

		return version;
	},

	//----------------------------------------------------
	// 텍스트 필드 관련
	//----------------------------------------------------

	// 숫자만 입력 (나머지 문자는 제거)
	inputOnlyNumber: function(element) {
		fnAddEvent(element, "keyup", function() {
			return element.value = element.value.replace(/[^0-9]/gi, '');
		}, false);
	},

	// 영문만 입력 (나머지 문자는 제거)
	inputOnlyEnglish: function(element) {
		fnAddEvent(element, "keyup", function() {
			return element.value = element.value.replace(/[^a-zA-Z]/gi, '');
		}, false);
	},

	// 한글만 입력 (나머지 문자는 제거)
	inputOnlyHangul: function(element) {
		fnAddEvent(element, "keyup", function() {
			return element.value = element.value.replace(/[a-zA-Z0-9]|[`~!@#$%^&*()-_=+\[\]{}|;':''"<>?,./\s]/g, '');
		}, false);
	},

	// 특수문자만 제거하고 입력
	inputNotSpecial: function(element) {
		fnAddEvent(element, "keyup", function() {
			return element.value = element.value.replace(/[`~!@#$%^&*()-_=+\[\]{}|;':''"<>?,./\s]/g, '');
		}, false);
	},

	// 숫자만 입력 + 숫자 세자리마다 콤마 찍기
	numberFormat: function(element) {
		fnAddEvent(element, "keyup", function() {
			var strVal = element.value.replace(/,/g, '').replace(/[^0-9]/gi, '');
			var regExp = /(^[+-]?\d+)(\d{3})/;

			while (regExp.test(strVal)) {
				strVal = strVal.replace(regExp, '$1' + ',' + '$2');
			}

			return element.value = strVal;
		}, false);
	},

	// 엔터키 이벤트 발생여부
	isEnterEvent: function(e) {
		if (e.keyCode == 13) {
			return true;
		} else {
			return false;
		}
	},

	// 엔터키 이벤트 발생 시, 함수 실행
	enterEventCallback: function(element, callback) {
		if (typeof callback === 'function') {
			fnAddEvent(element, "keypress", function(e) {
				if (e.keyCode == 13) {
					callback();
					return true;
				}
			}, false);
		}
	},

	//----------------------------------------------------
	// 팝업 관련
	//----------------------------------------------------

	// window.open 팝업
	openPopup: function(width, height, winName, url, isScroll) {
		if (isScroll == null) {
			isScroll = true;
		}
		var scroll = (isScroll) ? 'YES' : 'NO';
		var leftPos = (screen.width) ? (screen.width - width) / 2 : 100,
			topPost = (screen.height) ? (screen.height - height) / 2 : 100;
		var option = '';
		option += 'toolbar=0, location=0, directories=0, status=0, menubar=0, scrollbars='+scroll+', resizable=0';
		option += ', top='+topPost+', left='+leftPos+',copyhistory=0, width='+width+', height='+height;

		window.open(url, winName, option);
	},

	//----------------------------------------------------
	// JSON 관련
	//	- IE 8 이하는 json2.js 라이브러리 필요
	//----------------------------------------------------

	jsonToObject: function(jsonStr) {
		var jsonObj = {};
		try {
			jsonObj = JSON.parse(jsonStr);
		} catch(err) {
			console.log(err.message);
		}
		return jsonObj;
	},

	objectToJson: function(obj) {
		var jsonStr = {};
		try {
			jsonStr = JSON.stringify(obj);
		} catch(err) {
			console.log(err.message);
		}
		return jsonStr;
	},

	arrayObjectToJson: function(arrayObj) {
		var jsonStr = {};
		try {
			for (var i in arrayObj) {
				jsonStr += JSON.stringify(arrayObj[i]);
			}
		} catch(err) {
			console.log(err.message);
		}
		return jsonStr;
	},

	//----------------------------------------------------
	// AJAX 관련
	//----------------------------------------------------

	ajaxSend: function(method, url, param) {
		var jsonObj = {};
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				jsonObj = fn_CommonUtil.jsonToObject(xmlhttp.responseText);
			}
		}

		method = method.toUpperCase();
		switch (method) {
			case "POST":
				xmlhttp.open(method, url, true);
				xmlhttp.send(param);
				break;
			default:
				url = url + '?' + param;
				xmlhttp.open(method, url, true);
				xmlhttp.send();
		}
		return jsonObj;
	},

	//----------------------------------------------------
	// Byte 관련
	//----------------------------------------------------

	getBytesUTF8: function(strVal) {
		var chStr,
			nCharCnt = 0;

		for (var i=0; i < strVal.length; i++) {
			chStr = strVal.charAt(i);
			if(escape(chStr).length > 4) {
				nCharCnt += 3;
			} else {
				nCharCnt++;
			}
		}
		return nCharCnt;
	},

	getBytesEUCKR: function(strVal) {
		var chStr,
			nCharCnt = 0;

		for (var i=0; i < strVal.length; i++) {
			chStr = strVal.charAt(i);
			if(escape(chStr).length > 4) {
				nCharCnt += 2;
			} else {
				nCharCnt++;
			}
		}
		return nCharCnt;
	}

};

function fnAddEvent(element, eventName, callback, isCapture) {
	if (window.addEventListener) {
		element.addEventListener(eventName, callback, isCapture);
	}
	else if (window.attachEvent) {
		element.attachEvent("on" + eventName, callback);
	}
	else {
		element["on" + eventName] = callback;
	}
}