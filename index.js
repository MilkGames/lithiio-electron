const { app, BrowserWindow, shell} = require('electron')

function createWindow () {
	win = new BrowserWindow({ width: 800, height: 600, nodeIntegration: true, frame: true, show: false, icon: './build/icon.png' });
	win.loadFile('./www/setup.html')
	win.once('ready-to-show', () => {
		win.show()
		win.maximize();
		win.setMenuBarVisibility(false);
	}) 
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	app.quit();
});