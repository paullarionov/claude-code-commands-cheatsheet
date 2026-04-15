const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

let tray = null;
let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    show: false,
    icon: getTrayIcon(),
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'widget.html')}`;

  mainWindow.loadFile(path.join(__dirname, 'widget.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Hide window when unfocused (optional behavior)
  mainWindow.on('blur', () => {
    if (!mainWindow.isDestroyed() && process.platform === 'darwin') {
      mainWindow.hide();
    }
  });
};

const getTrayIcon = () => {
  const iconPath = process.platform === 'darwin'
    ? path.join(__dirname, '../assets/tray-icon-mac.png')
    : path.join(__dirname, '../assets/tray-icon-win.png');
  return iconPath;
};

const createTray = () => {
  tray = new Tray(getTrayIcon());

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Widget',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      },
    },
    {
      label: 'Check Status',
      click: () => {
        if (!mainWindow) {
          createWindow();
        }
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Preferences',
      accelerator: 'CmdOrCtrl+,',
      click: () => {
        // Open preferences window
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Claude Limits Status');

  // Click on tray icon to toggle window
  tray.on('click', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      if (!mainWindow) {
        createWindow();
      } else {
        mainWindow.show();
      }
    }
  });
};

app.on('ready', () => {
  createTray();
  createWindow();
});

app.on('window-all-closed', () => {
  // Keep app alive in tray on macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// IPC handlers for widget updates
ipcMain.handle('get-system-status', async () => {
  // Fetch actual API limits from Anthropic API
  try {
    const response = await fetch('https://api.anthropic.com/status');
    const data = await response.json();
    return {
      status: data.status || 'operational',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
});

ipcMain.handle('get-limits-data', async () => {
  // Return the current limits calculation
  const now = new Date();
  const utcHours = now.getUTCHours();
  const isPeakHours = utcHours >= 16 || utcHours < 1;

  return {
    currentPeriod: isPeakHours ? 'Peak Hours' : 'Best Time',
    isPeak: isPeakHours,
    utcHours: utcHours,
  };
});
