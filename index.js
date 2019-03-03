const { app, BrowserWindow, shell} = require('electron')

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600, nodeIntegration: true, frame: true });
  win.loadFile('./www/setup.html')
  win.maximize();
  win.setMenuBarVisibility(false);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit();
});