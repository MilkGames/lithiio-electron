const { app, BrowserWindow, shell, Menu, Tray, nativeImage, dialog } = require('electron')
const { autoUpdater } = require("electron-updater")
autoUpdater.autoDownload = false
const path = require('path');
app.on('ready', function(){
	autoUpdater.checkForUpdatesAndNotify();
	win = new BrowserWindow({ width: 800, height: 600, nodeIntegration: true, frame: true, show: false, icon: path.join(__dirname, '/build/icon.png') });
	win.loadFile('./www/setup.html')
	win.once('ready-to-show', () => {
		win.show();
		win.maximize();
		win.setMenuBarVisibility(false);
	});
	tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '/build/icon.png')));
	var contextMenu = Menu.buildFromTemplate([
		{ click: function(){
			win.isVisible() ? win.hide() : win.show();
		}, label: 'Show/Hide in tray', type: 'normal' },
		{ click: function(){
			win.webContents.executeJavaScript('openUp();');
		}, label: 'Upload file(s)', type: 'normal' },
		//{ label: 'History (TODO)', type: 'normal' },
		{ click: function(){
			win.webContents.executeJavaScript('logout();'); 
		}, label: 'Logout', type: 'normal' },
		{ click: function(){
			app.quit();
		}, label: 'Quit', type: 'normal' }
		])
	tray.setToolTip('Lithiio')
	tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
	app.quit();
});

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?\n\nRelease notes:' + info.releaseNotes.replace(/(<([^>]+)>)/ig, ""), // 
    buttons: ['No', 'Sure']
  }, (buttonIndex) => {
    if (buttonIndex === 1) {
      autoUpdater.downloadUpdate()
    }
    else {
      autoUpdater.enabled = false;
    }
  })
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
  	type: 'info',
    title: 'Install Updates',
    message: 'Updates downloaded, restart?',
    buttons: ['Restart']
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})