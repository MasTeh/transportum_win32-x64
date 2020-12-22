import { app, BrowserWindow, Tray, Menu } from 'electron';

const path = require('path');
const appIcon = path.join(__dirname, 'img/logo-online.png');

const updaterOptions = {
  repo: 'MasTeh/transportum_win32-x64.git',
  host: 'https://https://github.com',
  updateInterval: '5 minutes',
  logger: require('electron-log')
};

require('update-electron-app')(updaterOptions);



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;

let createTray = ()=> {
  tray = new Tray(appIcon);

  tray.on('click', ()=> {
    //createWindow();
    if (mainWindow != null) mainWindow.show();
  });

  //tray.displayBalloon({title: 'Новая заявка', content: 'Чет прилетело'});

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Открыть', click: function () {
        createWindow();
      }},
    { label: 'Выключить', click: function () {
        app.quit();
        tray.destroy();
      }}
  ]);

  tray.setToolTip('Транспортум работает.');
  tray.setContextMenu(contextMenu);

};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    title: "Транспортум",
    icon: appIcon,
    show: false,
    zoomFactor: 0.7,

  });


  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.desktop.html`);

  mainWindow.setMenu(null);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('will-resize', (e, bounds) => {
    let width = Number(bounds.width);
    let k = 0.0006;
    let newZoom = width*k;
    mainWindow.webContents.setZoomFactor(newZoom);
  });

  mainWindow.on('close', (e) => {

    if (mainWindow != null) mainWindow.hide();

    e.preventDefault();

  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {


    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  createTray();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
