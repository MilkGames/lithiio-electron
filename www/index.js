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

function copyHistory(id) {
    clipboard.writeText(JSON.parse(localStorage.getItem("history"))[id].url);
}

function removeHistory(id) {
    let uhistory = JSON.parse(localStorage.getItem("history"));
    uhistory.splice(id, 1);
    localStorage.setItem("history", JSON.stringify(uhistory));
    renderHistory();
}

function renderHistory() {
    let uhistory = JSON.parse(localStorage.getItem("history"));
    let table = document.getElementById("table");
    if (document.getElementById("table").rows.length > 1) {
        document.getElementById("table").rows = "";
        for (var i = 1; i < table.rows.length; i++) {
            table.rows[i].remove(); // Loop through every row (that isn't the header) to rerender
            // TODO: Find better way to do this
        }
    }
    for (var i = 0; i < uhistory.length; i++) {
        if (imgs.includes(uhistory[i].url.split('.').pop())) {
            table.tBodies[0].insertAdjacentHTML("beforebegin", `<tr>
                <td>
                <div class=imageblock>
                <a href="javascript:shell.openExternal('${uhistory[i].url}')">
                <img class=thumb src="${uhistory[i].url}">
                <div class=type>Picture </a>
                </div>
                <div class=timestamp datetime="${uhistory[i].time}"></div></div>
                </td>
                <td><a href="#" onclick="removeHistory('${i}')">
                <img width=18 src="x.png"</a>
                <a href="#" onclick="copyHistory('${i}')">
                <img width=18 src="copy.png"</a></tr>`);
        } else {
            table.tBodies[0].insertAdjacentHTML("beforebegin", `<tr>
                <td>
                <div class=imageblock>
                <a href="javascript:shell.openExternal('${uhistory[i].url}')">
                <img class=thumb src="file.png">
                <div class=type>File (.${uhistory[i].url.split('.').pop()})</a>
                </div>
                <div class=timestamp datetime="${uhistory[i].time}"></div></div>
                </td>
                <td><a href="#" onclick="removeHistory('${i}')">
                <img width=18 src="x.png"</a>
                <a href="#" onclick="copyHistory('${i}')">
                <img width=18 src="copy.png"</a></tr>`);
        }
    }
    timeago.render(document.querySelectorAll('.timestamp'));
    if (uhistory.length !== 0 && !document.getElementById("fileuploads")) {
        document.getElementById("table").insertAdjacentHTML("beforeBegin", "<h3 id='fileuploads'>File Uploads</h3>");
    }
};

function uploadfp(path) {
    if (!path) return;
    document.getElementById("onlu").style.visibility = 'visible';
    upload = lithiio.upload(localStorage.getItem('apikey'), fs.createReadStream(path)).on('progress', function(prog){
        $('#progb').progress({
          percent: prog
      });
    }).once('success', function(url){
        document.getElementById("message").setAttribute("href", 'javascript:shell.openExternal("' + url + '")');
        document.getElementById("message").innerHTML = url;
        document.getElementById("progb").value = 0;
        document.getElementById("onlu").style.visibility = 'hidden';
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
    }).once('error', function(error){
        if (error !== 'Canceled') {
            dialog.showErrorBox('oopsie', error)
            console.error(error);
        } else {
            document.getElementById("progb").value = 0;
            document.getElementById("onlu").style.visibility = 'hidden';
        }
    });
}

function uploadf(data) {
    if (!data) return;
    document.getElementById("onlu").style.visibility = 'visible';
    upload = lithiio.upload(localStorage.getItem('apikey'), data.toDataURL()).on('progress', function(prog){
        document.getElementById("progb").value = prog;
    }).once('success', function(url){
        document.getElementById("message").setAttribute("href", 'javascript:shell.openExternal("' + url + '")');
        document.getElementById("message").innerHTML = url;
        document.getElementById("progb").value = 0;
        document.getElementById("onlu").style.visibility = 'hidden';
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
    }).once('error', function(error){
        if (error !== 'Canceled') {
            dialog.showErrorBox('oopsie', error)
            console.error(error);
        } else {
            document.getElementById("progb").value = 0;
            document.getElementById("onlu").style.visibility = 'hidden';
        }
    });
}

function cancelUp() {
    lithiio.cancel(upload)
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