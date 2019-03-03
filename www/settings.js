document.getElementById("languagev").value = localStorage.getItem("language");
var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
	if (this.readyState === 4) {
		alert(this.responseText);
	}
});

function clearHistory() {
	if (confirm(STRINGS[lang].CLEAR_UPLOAD_HISTORY)) {
		localStorage.setItem("history", "");
		alert(STRINGS[lang].CLEAR_UPLOAD_HISTORY_DONE);
	}
}

function changeLang() {
	localStorage.setItem("language", document.getElementById("languagev").value);
	window.location.reload()
}