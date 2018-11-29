//----------------------------------------------------
// String.prototype (trim, ltrim, rtrim)
//----------------------------------------------------

if ( typeof String.prototype.trim === 'undefined' ) {
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, '');
	}
};

if ( typeof String.prototype.ltrim === 'undefined' ) {
	String.prototype.ltrim = function() {
		return this.replace(/(^\s*)/g, '');
	}
};

if ( typeof String.prototype.rtrim === 'undefined' ) {
	String.prototype.rtrim = function() {
		return this.replace(/(\s*$)/g, '');
	}
};


//----------------------------------------------------
// String.prototype (startsWith, endsWith)
//----------------------------------------------------
// IE 12 이하에서 사용을 위한 startsWith
String.prototype.startsWith = function(str) {
	return this.substring( 0, str.length ) === str;
}

String.prototype.endsWith = function(str) {
	return this.substring( this.length - str.length, this.length ) === str;
}

String.prototype.contains = function(str) {
	return this.indexOf(str) != -1;
}


//----------------------------------------------------
// Array.prototype (contains)
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


//----------------------------------------------------
// Array.prototype (removeElement)
//----------------------------------------------------
Array.prototype.removeElement = function(element) {
	var i;
	while ( (i = this.indexOf(element)) != -1 ) {
		this.splice(i, 1);
	}
	return this;
}