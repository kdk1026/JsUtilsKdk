var FileUtils = {
	
	// 이미지 미리보기
	previewImage: function(fileElement, imgElement) {
		fnAddEvent(fileElement, "change", function() {	
			if (window.FileReader) {
				// IE 10 이상
				var reader = new FileReader();
				reader.onload = function(e) {
					imgElement.setAttribute("src", e.target.result);
				}
				reader.readAsDataURL(fileElement.files[0]);
			} else {
				// IE 8
				fileElement.select();
				imgElement.setAttribute("src", document.selection.createRange().text);
			}
			imgElement.removeAttribute("style");
		}, false);
	},
	
	// 파일 정보 가져오기 (change 이벤트에서 사용)
	getFileInfo: function(fileElement) {
		var fileObj = {};
		
		if (window.File) {
			// IE 10 이상
			var files = fileElement.files;
			
			fileObj.name = files[0].name;
			fileObj.type = files[0].type;
			fileObj.size = files[0].size;
		} else {
			// IE 7,8,9
			var IEVersion = CommonUtils.getIEVersion();
			if (CommonUtils.getBrowserType() === 'IE') {
				if ( (IEVersion > 7) && (IEVersion < 10) ) {
					var fso = new ActiveXObject("Scripting.FileSystemObject")						
					var fsoFile = fso.getFile(fileElement.value);
					
					fileObj.name = fsoFile.name;
					fileObj.type = fsoFile.type;
					fileObj.size = fsoFile.size;
				}
			}
		}
		return fileObj;
	},
	
	// 파일 확장자 구하기
	getFileExtension: function(fileObj) {
		var fileName = fileObj.name;
		return fileName.substring(fileName.lastIndexOf(".")+1);
	},
	
	// 파일 확장자 체크 (문서, 이미지)
	isAllowFileExtension: function(extension) {
		var arrStrExtension = ['txt', 'rtf', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp', 'odt', 'odp', 'ods', 'jpg', 'jpeg', 'bmp', 'gif', 'png'];
		return arrStrExtension.contains(extension);
	},
	
	// 파일 확장자 체크 (문서)
	isAllowDocFileExtension: function(extension) {
		var arrStrExtension = ['txt', 'rtf', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'hwp', 'odt', 'odp', 'ods'];
		return arrStrExtension.contains(extension);
	},
	
	// 파일 확장자 체크 (이미지)
	isAllowImgFileExtension: function(extension) {
		var arrStrExtension = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
		return arrStrExtension.contains(extension);
	},
	
	// 파일 용량 단위 변환
	readableFileSize: function(size) {
		var arrDataUnits = ['B', 'kB', 'MB', 'GB', 'TB'];
		if (size == 0) return '0';
		var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));		
		return Math.round(size / Math.pow(1024, i)) + ' ' + arrDataUnits[i];
	}
	
};