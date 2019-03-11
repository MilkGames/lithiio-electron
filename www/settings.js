const {dialog} = require('electron').remote;
document.getElementById("languagev").value = localStorage.getItem("language");
var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
	if (this.readyState === 4) {
		alert(this.responseText);
	}
});

function clearHistory() {
	dialog.showMessageBox({
		type: 'question',
		buttons: [STRINGS[lang].CANCEL_BUTTON, STRINGS[lang].CLEAR_HISTORY_BUTTON],
		defaultId: 0,
		title: STRINGS[lang].CONFIRM_CLEAR_UPLOAD_HISTORY_TITLE,
		message: STRINGS[lang].CONFIRM_CLEAR_UPLOAD_HISTORY
	}, function(response){
		if (response == 1) {
			localStorage.removeItem("history");
			dialog.showMessageBox({
				type: 'info',
				buttons: ['OK'],
				defaultId: 0,
				title: STRINGS[lang].CONFIRM_CLEAR_UPLOAD_HISTORY_TITLE,
				message: STRINGS[lang].CLEAR_UPLOAD_HISTORY_DONE
			});
		}
	})
}

function changeLang() {
	localStorage.setItem("language", document.getElementById("languagev").value);
	window.location.reload()
}