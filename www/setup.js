if (localStorage.getItem("apikey")) {
	window.location.replace("index.html");
}
const {shell} = require('electron').remote;
const lithiio = require('node-lithiio-upload');
function login() {
	document.getElementById("loginb").classList.add("loading")
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	lithiio.fetchAPIKey(email, password).once('success', function(apikey) {
		localStorage.setItem("apikey", apikey);
		window.location.replace("index.html");
	}).once('error', function(error) { // If there's an error fetching the API Key
	document.getElementById("error").innerHTML = error;
	document.getElementById("loginb").classList.remove("loading")
});
};
document.getElementById("password").addEventListener("keyup", function(event) {
	if (event.key === "Enter") {
		login();
	}
});