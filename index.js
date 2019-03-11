const { app, BrowserWindow, shell, Menu, Tray } = require('electron')
const { autoUpdater } = require("electron-updater")

app.on('ready', function(){
	autoUpdater.checkForUpdatesAndNotify();
	win = new BrowserWindow({ width: 800, height: 600, nodeIntegration: true, frame: true, show: false, icon: './build/icon.png' });
	win.loadFile('./www/setup.html')
	win.once('ready-to-show', () => {
		win.show();
		win.maximize();
		win.setMenuBarVisibility(false);
	});
	tray = new Tray('./build/icon.png')
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