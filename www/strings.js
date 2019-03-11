var STRINGS = {
"en": {
	"OFFLINE": "Offline",
	"ONLINE": "L I T H I I O", // DO NOT TRANSLATE
	"CONFIRM_LOGOUT_TITLE": "Logout",
	"CONFIRM_LOGOUT": "Are you SURE you want to logout? This will clear your upload history!",
	"LOGOUT_BUTTON": "Logout",
	"CONFIRM_CLEAR_UPLOAD_HISTORY_TITLE": "Clear history",
	"CONFIRM_CLEAR_UPLOAD_HISTORY": "This will clear your upload history, are you sure?",
	"CLEAR_UPLOAD_HISTORY_DONE": "History cleared.",
	"CANCEL_BUTTON": "Cancel",
	"SETTINGS_TITLE": "Settings",
	"YES": "Yes",
	"NO": "No",
	"HISTORY": "History",
	"CLEAR_HISTORY_BUTTON": "Clear",
	"LANGUAGE": "Language",
	"THEME": "Theme",
	"DARK_THEME": "Dark",
	"LIGHT_THEME": "Light",
	"GO_BACK_BUTTON": "Back"
	},
"nl": {
	"OFFLINE": "Offline",
	"ONLINE": "L I T H I I O", // DO NOT TRANSLATE
	"CONFIRM_LOGOUT_TITLE": "Uitloggen",
	"CONFIRM_LOGOUT": "Weet je het ZEKER dat je wilt uitloggen? Je upload geschiedenis wordt gewist!",
	"LOGOUT_BUTTON": "Uitloggen",
	"CONFIRM_CLEAR_UPLOAD_HISTORY_TITLE": "Geschiedenis wissen",
	"CONFIRM_CLEAR_UPLOAD_HISTORY": "Dit zal je upload geschiedenis wissen, weet je het zeker?",
	"CLEAR_UPLOAD_HISTORY_DONE": "Geschiedenis gewist.",
	"CANCEL_BUTTON": "Annuleren",
	"SETTINGS_TITLE": "Instellingen",
	"YES": "Ja",
	"NO": "Nee",
	"HISTORY": "Geschiedenis",
	"CLEAR_HISTORY_BUTTON": "Wissen",
	"LANGUAGE": "Taal",
	"THEME": "Thema",
	"DARK_THEME": "Donker",
	"LIGHT_THEME": "Licht",
	"GO_BACK_BUTTON": "Terug"
	}
}

var lang = localStorage.getItem("language");
var i10n_elements = document.getElementsByClassName("i10n"); // Every HTML element that should be translated
for(var i = 0; i < i10n_elements.length; i++) { // Loop through all the translatable elements
   i10n_elements[i].textContent = STRINGS[lang][i10n_elements[i].id] // Set the element to the relevant string for the relevant language
}