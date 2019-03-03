if (localStorage.getItem("apikey")) {
	window.location.replace("index.html");
}
const {shell} = require('electron').remote;
const lithiio = require('node-lithiio-upload');
function login() {
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	lithiio.fetchAPIKey(email, password).then(function(apikey) {
		localStorage.setItem("apikey", apikey);
		window.location.replace("index.html");
	}).catch(function(error) { // If there's an error fetching the API Key
	document.getElementById("error").innerHTML = error;
});
};