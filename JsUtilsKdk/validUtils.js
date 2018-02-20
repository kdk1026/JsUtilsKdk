var ValidUtils = {};

ValidUtils = {

	// Null, 공백 체크
	isBlank: function(str) {
	    return (str == null || str.replace(/ /gi,'') == '');
	},

	// 숫자 체크
	isNumber: function(str) {
		var pattern = /^[0-9]+$/;
		return pattern.test(str);
	},

	// 영문 체크
	isEnglish: function(str) {
		var pattern = /^[a-zA-Z]+$/;
		return pattern.test(str);
	},

	// 영문, 공백 체크
	isEngBlank: function (str) {
		var pattern = /^[a-zA-Z\s]+$/;
		return pattern.test(str);
	},

	// 영문, 숫자 체크
	isEngNum: function (str) {
		var pattern = /^[a-zA-Z0-9]+$/;
		return pattern.test(str);
	},

	// 한글 체크
	isHangul: function(str) {
		var pattern = /^[가-힣]+$/;
		return pattern.test(str);
	},

	// 한글, 공백 체크
	isHanBlank: function(str) {
		var pattern = /^[가-힣\s]+$/;
		return pattern.test(str);
	},

	// 한글, 영문 체크
	isHanEng: function (str) {
		var pattern = /^[가-힣a-zA-Z]+$/;
		return pattern.test(str);
	},

	// 특수문자 체크
	isSpecial: function(str) {
		var pattern = /^[\W|~!@#$%^&*()-_+|<>?:{}]+$/;
		return pattern.test(str);
	},

	// 이메일 형식 체크
	isEmail: function(str) {
		var pattern = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})+$/;
		return pattern.test(str);
	},
	isEmail2: function(str1, str2) {
		var str = str1 +'@'+ str2;
		var pattern = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})+$/;
		return pattern.test(str);
	},

	// 전화번호 형식 체크
	isPhoneNum: function(str) {
		var pattern = /^(0[2|3[1|2|3]|4[1|2|3|4]|5[1|2|3|4|5]|6[1|2|3|4]])-?(\d{3,4})-?(\d{4})+$/;
		return pattern.test(str);
	},
	isPhoneNum2: function(str1, str2, str3) {
		var str = str1 +'-'+ str2 +'-'+ str3;
		var pattern = /^(0[2|3[1|2|3]|4[1|2|3|4]|5[1|2|3|4|5]|6[1|2|3|4]])-?(\d{3,4})-?(\d{4})+$/;
		return pattern.test(str);
	},

	// 휴대폰 번호 형식 체크
	isCellPhoneNum: function(str) {
		var pattern = /^(01[016789])-?(\d{3,4})-?(\d{4})+$/;
		return pattern.test(str);
	},
	isCellPhoneNum2: function(str1, str2, str3) {
		var str = str1 +'-'+ str2 +'-'+ str3;
		var pattern = /^(01[016789])-?(\d{3,4})-?(\d{4})+$/;
		return pattern.test(str);
	},

	// 사업자등록번호 형식 체크
	isBusinessRegNum: function(str) {
		var pattern = /^[(\d{3})-?(\d{2})-?(\d{5})+$]/;
		return pattern.test(str);
	},
	isBusinessRegNum2: function(str1, str2, str3) {
		var str = str1 +'-'+ str2 +'-'+ str3;
		var pattern = /^[(\d{3})-?(\d{2})-?(\d{5})+$]/;
		return pattern.test(str);
	},
	
	// IPv4 형식 체크
	isIPv4: function(str) {
		var pattern = /^(1[0-9]{2}|2[0-5][0-5]|[0-9]{1,2})(\.(1[0-9]{2}|2[0-5][0-5]|[0-9]{1,2})){3}+$/;
		return pattern.test(str);
	},
	
	// YYYYMMDD 형식 체크
	isYYYYMMDD: function(str) {
		var pattern = /^[0-9]{4}(0[1-9]|1[012])(0[1-9]|1[0-9]|2[0-9]|3[01])+$/;
		return pattern.test(str);
	},
	
	// Y/N 형식 체크
	isYN: function(str) {
		var pattern = /^[Y|N]+$/;
		return pattern.test(str);
	},
	
	// 아이디 형식 체크 (1. 첫 글자 영문, 2. 7자 이상 30자 이내)
	isId: function(str) {
		var pattern = /^[a-zA-Z](?=.*[a-zA-Z])(?=.*[0-9]).{6,29}$/;
		return pattern.test(str);
	},
	
	/*
	 * TODO: 2번째 패턴 이슈 - 2가지 조합도 통과
	 * 비밀번호 형식 체크 (1. 첫 글자 영문, 2. 첫 글자 이후 영문, 숫자, 특수문자 조합)
	 *  - 2가지 조합 시, 10자리 이상 / 3가지 조합 시, 8자리 이상
	 */
	isPassword: function(str) {
		var pattern1 = /^[a-zA-z](?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9\W|~!@#$%^&*()-_+|<>?:{}]{9,}$/;
		var pattern2 = /^[a-zA-z](?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W|~!@#$%^&*()-_+|<>?:{}])[a-zA-Z0-9\W|~!@#$%^&*()-_+|<>?:{}]{7,}$/;
		
		return pattern1.test(str) || pattern2.test(str);
	}
}

/** 순수 JavaScript 전용 */
ValidUtils.BtnChk = {
	// selected 'select box' 체크
	isSelected: function(element) {
		var len = element.options.length;
		for (var i=0; i < len; i++) {
			if (element.options[i].selected == true) {
				if (element.options[i].value != '') {
					return true;
				}
			}
		}
		return false;
	},

	// checked 'radio button', 'check box' 체크
	isChecked: function(element) {
		var len = element.length;
		for (var i=0; i < len; i++) {
			if (element[i].checked == true) {
				return true;
			}
		}
		return false;
	}	
}