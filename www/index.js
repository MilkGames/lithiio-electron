const {dialog, shell, clipboard} = require('electron').remote;
const fs = require('fs');
const lithiio = require('node-lithiio-upload');
const timeago = require("timeago.js");
var clipboardmultiu = "";
var imgs = ["png", "jpg", "jpeg", "gif", "webp"];
if (localStorage.getItem("language")) {
    localStorage.setItem("language", "en");
};
if (!localStorage.getItem("apikey")) {
    window.location.replace("setup.html");
};
if (!localStorage.getItem("history")) {
    localStorage.setItem("history", "[]");
};
renderHistory();

document.body.ondragover = () => {
    return false;
};

document.body.ondragleave = () => {
    return false;
};

document.body.ondragend = () => {
    return false;
};

document.body.ondrop = (e) => {
    for (let f of e.dataTransfer.files) {
        uploadfp(f.path)
    }
    return false;
};

document.body.onpaste = (data) => {
    if (clipboard.readText()) { // Its a path, most likely.
        uploadfp(clipboard.readText());
    } else if (clipboard.readImage()) { // Image?
        console.log(clipboard.readImage())
        uploadf(clipboard.readImage());
    }
    console.log(clipboard.readImage())
};

function takepicupload() {
  var options = {
    quality: localStorage.getItem("quality"),
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    allowEdit: JSON.parse(localStorage.getItem("allowedit")),
    encodingType: Camera.EncodingType.JPEG, // add to settings when?
    saveToPhotoAlbum: true, // add to settings when?
    correctOrientation: true
};
navigator.camera.getPicture(function cameraSuccess(data) {
    uploadfp(data, false, true, false);
}, function cameraError(error) {
    console.error(error);
}, options);
};

if (!navigator.onLine) { // now this, is not broken.
	document.getElementsByClassName("info")[0].style.backgroundColor = "hsla(0, 100%, 50%, 0.2)";
    document.getElementsByClassName("info")[0].textContent = STRINGS[lang].OFFLINE;
};

window.addEventListener("offline", function(event){ // this seems to be broken, at least on my phone...
    document.getElementsByClassName("info")[0].style.backgroundColor = "hsla(0, 100%, 50%, 0.2)";
    document.getElementsByClassName("info")[0].innerHTML = STRINGS[lang].OFFLINE;
});

window.addEventListener("online", function(event){ // also seems broken
    document.getElementsByClassName("info")[0].style.backgroundColor = "hsla(0, 0%, 100%, 0.2)";
    document.getElementsByClassName("info")[0].innerHTML = STRINGS[lang].ONLINE;
});

function renderHistory() {
    if (document.getElementById("table").rows.length > 0) {
        document.getElementById("table").innerHTML = "";
    }
    let uhistory = JSON.parse(localStorage.getItem("history"));
    for (var i = 0; i < uhistory.length; i++) {
        if (imgs.includes(uhistory[i].url.split('.').pop())) {
            document.getElementById("table").insertAdjacentHTML("afterbegin", "<tr> <td><div class=imageblock><a href=\"javascript:shell.openExternal('" + uhistory[i].url + "')\"><img class=thumb src=" + uhistory[i].url + "><div class=type>Picture </a><img class=link src=link.png></div><div class=timestamp datetime=" + uhistory[i].time + "></div></div></td></tr>");
        } else {
            document.getElementById("table").insertAdjacentHTML("afterbegin", "<tr> <td><div class=imageblock><a href=\"javascript:shell.openExternal('" + uhistory[i].url + "')\"><img class=thumb src=file.png><div class=type>File (." + uhistory[i].url.split('.').pop() + ")</a> <img class=link src=link.png></div><div class=timestamp datetime=" + uhistory[i].time + "></div></div></td></tr>");
        }
    }
    timeago.render(document.querySelectorAll('.timestamp'));
};

function uploadfp(path) {
    if (!path) return;
    lithiio.upload(localStorage.getItem('apikey'), fs.createReadStream(path)).then(function(url) {
            document.getElementById("message").setAttribute("href", url);
            document.getElementById("message").innerHTML = url;
            clipboard.writeText(url);
            let date = new Date();
            let obj = JSON.parse(localStorage.getItem("history"));
            obj.push({
                url: url,
                time: date
            });
            jsonStr = JSON.stringify(obj);
            localStorage.setItem("history", jsonStr);
            let uploadnoti = new Notification('Upload successful', {
                body: url + " - " + date,
                icon: (imgs.includes(url.split('.').pop()) ? url : "./file.png")
            });
            uploadnoti.onclick = () => {
                shell.openExternal(url);
            }
            renderHistory();
        }).catch(function(error) { // If there's an error uploading the file
        dialog.showErrorBox('oopsie', error)
        console.error(error);
    });
}

function uploadf(data) {
    if (!data) return;
    lithiio.upload(localStorage.getItem('apikey'), data.toDataURL()).then(function(url) {
            document.getElementById("message").setAttribute("href", url);
            document.getElementById("message").innerHTML = url;
            clipboard.writeText(url);
            let date = new Date();
            let obj = JSON.parse(localStorage.getItem("history"));
            obj.push({
                url: url,
                time: date
            });
            jsonStr = JSON.stringify(obj);
            localStorage.setItem("history", jsonStr);
            let uploadnoti = new Notification('Upload successful', {
                body: url + " - " + date,
                icon: (imgs.includes(url.split('.').pop()) ? url : "./file.png")
            });
            uploadnoti.onclick = () => {
                shell.openExternal(url);
            }
            renderHistory();
        }).catch(function(error) { // If there's an error uploading the file
        dialog.showErrorBox('oopsie', error)
        console.error(error);
    });
}

function cancelUp() {
    ft.abort();
    cordova.plugins.firebase.analytics.logEvent("cancel");
};

function openUp() {
    dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
    }, function (files) {
        if (files !== undefined) {
            for (var i = 0; i < files.length; i++) {
                uploadfp(files[i]);
            }
        }
    });
}

function logout() {
    dialog.showMessageBox({
        type: 'question',
        buttons: [STRINGS[lang].CANCEL_BUTTON, STRINGS[lang].LOGOUT_BUTTON],
        defaultId: 0,
        title: STRINGS[lang].CONFIRM_LOGOUT_TITLE,
        message: STRINGS[lang].CONFIRM_LOGOUT
    }, function(response){
        if (response == 1) {
            localStorage.removeItem("apikey");
            localStorage.removeItem("history");
            window.location.replace("setup.html");
        }
    })
}