/**
 * @author 김대광 <daekwang1026&#64;gmail.com>
 * @since 2018.12.02
 * @version 2.2
 * 
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
				const inputs = $(this).parents("form").eq(0).find(':input:visible');
				inputs.eq( inputs.index(this)+ 1 ).focus();
			}
		});
	},

    /**
     * 공통 Ajax 처리
     * @param {string} method 
     * @param {string} url 
     * @param {(undefined|Object)} header 
	 * - param 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {(undefined|Object)} param 
     * @returns 
	 * @example
	 * $.commonAjax('GET', '/api/data', {}, {id: 1})
	 *  	.then(data => {
	 * 			console.log("데이터 성공:", data);
	 * 		})
	 * 		.catch(error => {
	 * 			console.error("에러 발생:", error);
	 * 		});
     */
	commonAjax: function(method, url, header, param) {
		return new Promise((resolve, reject) => {
			let contentType = "application/x-www-form-urlencoded; charset=utf-8";
			let params = (param == undefined) ? {} : param;

			if (typeof param == 'object') {
				try {
					params = param.serialize();
				} catch (e) {
					console.error("param is not a jQuery object: " + e.message);
					if (Array.isArray(param)) {
						contentType = "application/json; charset=utf-8";
						params = JSON.stringify(param);
					}
				}
			}

			$.ajax({
				async: true,
				cache: false,
				traditional: true,
				contentType: contentType,
				dataType: "json",
				type: method,
				url: url,
				headers: (header == undefined) ? {} : header,
				data: params,
				success: function(result) {
					resolve(result);
				},
				error: function(xhr, status, err) {
					console.error("Ajax Error:", status, err, xhr);
					alert(`code = ${xhr.status}\nmessage = ${xhr.responseText}\nerror = ${err}`);
					reject(err);
				}
			});
		});
	},
    /**
     * 공통 Ajax 처리 (JSON)
     * @param {string} method 
     * @param {string} url 
     * @param {(undefined|Object)} header 
     *   - param 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {(undefined|Object)} param 
     * @returns 
	 * @example
	 * $.commonAjaxJson('GET', '/api/users', { 'Auth-Token': 'your_token' }, { id: 123 })
	 * 		.then(data => {
	 * 			console.log("JSON 데이터 성공:", data);
	 * 		})
	 * 		.catch(error => {
	 * 			console.error("JSON 에러 발생:", error);
	 * 		});
     */	
	commonAjaxJson: function(method, url, header, param) {
		return new Promise((resolve, reject) => {
			const contentType = "application/json; charset=utf-8";
			const requestData = (param == undefined) ? {} : param;

			$.ajax({
				async: true,
				cache: false,
				traditional: true,
				contentType: contentType,
				dataType: "json",
				type: method,
				url: url,
				headers: (header == undefined) ? {} : header,
				data: JSON.stringify(requestData),
				success: function(result) {
					resolve(result);
				},
				error: function(xhr, status, err) {
					console.error("Ajax Error:", status, err, xhr);
					alert(`code = ${xhr.status}\nmessage = ${xhr.responseText}\nerror = ${err}`);
					reject({
						status: xhr.status,
						message: xhr.responseText,
						error: err
					});
				}
			});
		});
	},
    /**
     * 공통 Ajax 파일 처리
     * @param {string} method 
     * @param {string} url 
     * @param {(undefined|Object)} header  
     *   - param 없는 경우만 생략 가능 / 없으면 {} 로 넘길 것
     * @param {Element} $formElement 
     * @returns 
	 * @example
	 * const $myUploadForm = $('#uploadForm');
	 * 
	 * $.commonAjaxFile('POST', '/upload/file', { 'Auth-Token': 'your_upload_token' }, $myUploadForm)
	 * 		.then(data => {
	 * 			console.log("파일 업로드 성공:", data);
	 * 		})
	 * 		.catch(error => {
	 * 			console.error("파일 업로드 에러 발생:", error);
	 * 		});
     */
	commonAjaxFile: function(method, url, header, $formElement) {
		const param = new FormData($formElement[0]);

		return new Promise((resolve, reject) => {
			$.ajax({
				async: true,
				cache: false,
				contentType: false,
				processData: false,
				type: method,
				url: url,
				headers: (header == undefined) ? {} : header,
				data: param,
				success: function(result) {
					resolve(result);
				},
				error: function(xhr, status, err) {
					console.error("Ajax Error:", status, err, xhr);
					alert(`code = ${xhr.status}\nmessage = ${xhr.responseText}\nerror = ${err}`);
					reject({
						status: xhr.status,
						message: xhr.responseText,
						error: err,
						xhr: xhr
					});
				}
			});
		});
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
		const disabled = $formElement.find(':disabled').removeAttr('disabled');
		let obj;
		const arr = $formElement.serializeArray();
		if (arr) {
			obj = {};
			$.each(arr, function() {
				obj[this.name] = this.value;
			});
		}
		disabled.attr('disabled', 'disabled');
		return obj;
	}
})