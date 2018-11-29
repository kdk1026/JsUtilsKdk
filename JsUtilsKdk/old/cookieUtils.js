/**
 * HttpOnly 옵션 설정이 불가능하므로 '오늘 하루동안 보지않기' 같은 경우에만 사용 권장
 */
var CookieUtils = {
	
	addCookie: function(cookieName, cookieValue, expireDays) {
		var date = new Date();
		date.setDate(date.getDate() + parseInt(expireDays));
		
		document.cookie = cookieName+'='+escape(cookieValue)+'; path=/; expires='+todayDate.toGMTString() +';'
	},
	
	getCookie: function(cookieName) {
		var isSuccess = false;
		var start = 0,
			end = 0;
		
		var cookie = document.cookie;
		for (var i=0; i < cookie.length; i++) {
			start = i;
			end = start + cookieName.length;
			
			if (cookie.substring(start, end) === cookieName) {
				isSuccess = true;
				break;
			}
		}
		
		if (isSuccess) {
			start = end + 1;
			end = cookie.indexOf(';', start);
			
			if (end < start) {
				end = cookie.length;
			}
			return cookie.substring(start, end);
		}
		return null;
	},
	
	removeCookie: function(cookieName) {
		var date = new Date();
		date.setDate(date.getDate() -1);
		
		document.cookie = cookieName + '=' + '; expires=' + expireDate.toGMTString() + '; path=/';
	}
	
};