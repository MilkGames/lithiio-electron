const { app, BrowserWindow, shell, Menu, Tray, nativeImage, dialog } = require('electron')
const { autoUpdater } = require("electron-updater")
autoUpdater.autoDownload = false
const path = require('path');
app.on('ready', function(){
	autoUpdater.checkForUpdatesAndNotify();
	win = new BrowserWindow({ width: 800, height: 600, nodeIntegration: true, frame: true, show: false, icon: './build/icon.png' });
	win.loadFile('./www/setup.html')
	win.once('ready-to-show', () => {
		win.show();
		win.maximize();
		win.setMenuBarVisibility(false);
	});
	tray = new Tray(nativeImage.createFromPath(path.join(__dirname, '/build/icon.png')));
	var contextMenu = Menu.buildFromTemplate([
		/*{ click: function(){
			win.isVisible() ? win.hide() : win.show();
			console.log(contextMenu)
			contextMenu.getMenuItemById('hideshow').label = win.isVisible() ? 'Hide in tray' : 'Show'; // Oh yeah baby
			tray.setContextMenu(contextMenu); // For the Linux bois
		}, label: 'EPIC GAMER MOMENT', type: 'normal', id: 'hideshow' }, SOMEONE PLEASE FIX THIS OH GOD HELP ME*/
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

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['No', 'Sure']
  }, (buttonIndex) => {
    if (buttonIndex === 1) {
      autoUpdater.downloadUpdate()
    }
    else {
      autoUpdater.enabled = true
      autoUpdater = null
    }
  })
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, restarting for update...'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})