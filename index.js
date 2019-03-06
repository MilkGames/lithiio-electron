const { app, BrowserWindow, shell, Menu, Tray } = require('electron')

app.on('ready', function(){
	win = new BrowserWindow({ width: 800, height: 600, nodeIntegration: true, frame: true, show: false, icon: './build/icon.png' });
	win.loadFile('./www/setup.html')
	win.once('ready-to-show', () => {
		win.show();
		win.maximize();
		win.setMenuBarVisibility(false);
	});
	tray = new Tray('./build/icon.png')
	const contextMenu = Menu.buildFromTemplate([
		{ click: function(){
			win.webContents.executeJavaScript('openUp();');
		}, label: 'Upload file(s)', type: 'normal' },
		{ label: 'History (TODO)', type: 'normal' },
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