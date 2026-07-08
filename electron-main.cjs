const { app, BrowserWindow, Menu, shell } = require('electron');
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let mainWindow;
let nextServer;
const PORT = 3210;

function waitForPort(port, host = '127.0.0.1', timeout = 30000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const socket = net.createConnection(port, host);
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() - started > timeout) reject(new Error('Next.js server startup timed out'));
        else setTimeout(check, 250);
      });
    };
    check();
  });
}

function getServerPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app-server', 'server.js');
  }
  return path.join(__dirname, '.next', 'standalone', 'server.js');
}

async function startNextServer() {
  const serverPath = getServerPath();
  if (!fs.existsSync(serverPath)) {
    throw new Error(`Không tìm thấy server Next.js: ${serverPath}. Hãy chạy npm run build trước.`);
  }

  nextServer = fork(serverPath, [], {
    cwd: path.dirname(serverPath),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(PORT),
      HOSTNAME: '127.0.0.1',
      ELECTRON_RUN_AS_NODE: '1',
    },
    stdio: 'inherit',
  });

  await waitForPort(PORT);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    backgroundColor: '#eaf6ff',
    autoHideMenuBar: true,
    icon: app.isPackaged
      ? path.join(process.resourcesPath, 'app-server', 'public', 'icon.png')
      : path.join(__dirname, 'public', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createMenu() {
  const template = [
    {
      label: 'WeatherNow',
      submenu: [
        { label: 'Tải lại', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.reload() },
        { label: 'Toàn màn hình', accelerator: 'F11', click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()) },
        { type: 'separator' },
        { label: 'Thoát', accelerator: 'Alt+F4', click: () => app.quit() },
      ],
    },
    {
      label: 'Hiển thị',
      submenu: [
        { role: 'zoomIn', label: 'Phóng to' },
        { role: 'zoomOut', label: 'Thu nhỏ' },
        { role: 'resetZoom', label: 'Kích thước mặc định' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
  try {
    await startNextServer();
    createMenu();
    createWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && nextServer) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (nextServer && !nextServer.killed) nextServer.kill();
});
