const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let apiServerProcess;

// API server port
const API_PORT = 8080;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'Digital Decluttering Agent',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js')
    },
    backgroundColor: '#161616', // IBM Carbon dark theme
    show: false, // Don't show until ready
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 }
  });

  // Show window when ready to avoid flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the dashboard
  mainWindow.loadURL(`http://localhost:${API_PORT}`);

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startAPIServer() {
  return new Promise((resolve, reject) => {
    const dashboardPath = path.join(__dirname, 'dashboard');
    const apiScript = path.join(dashboardPath, 'api.py');
    
    console.log('Starting API server...');
    console.log('Dashboard path:', dashboardPath);
    console.log('API script:', apiScript);
    
    // Check if Python 3 is available
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    apiServerProcess = spawn(pythonCmd, [apiScript], {
      cwd: dashboardPath,
      env: { ...process.env, PORT: API_PORT },
      stdio: 'pipe'
    });

    apiServerProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`API Server: ${output}`);
      if (output.includes('Serving') || output.includes('listening') || output.includes('started')) {
        resolve();
      }
    });

    apiServerProcess.stderr.on('data', (data) => {
      console.error(`API Server Error: ${data}`);
    });

    apiServerProcess.on('error', (error) => {
      console.error('Failed to start API server:', error);
      reject(error);
    });

    apiServerProcess.on('close', (code) => {
      console.log(`API server process exited with code ${code}`);
    });

    // Resolve after 3 seconds if no explicit ready message
    setTimeout(resolve, 3000);
  });
}

function stopAPIServer() {
  if (apiServerProcess) {
    console.log('Stopping API server...');
    apiServerProcess.kill();
    apiServerProcess = null;
  }
}

// IPC handlers
ipcMain.handle('show-open-dialog', async (event, options) => {
  return await dialog.showOpenDialog(mainWindow, options);
});

ipcMain.handle('show-message-box', async (event, options) => {
  return await dialog.showMessageBox(mainWindow, options);
});

ipcMain.handle('open-external', async (event, url) => {
  return await shell.openExternal(url);
});

ipcMain.handle('run-scanner', async (event) => {
  return new Promise((resolve, reject) => {
    const scannerScript = path.join(__dirname, 'file_scanner_user_only.py');
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    console.log('Running file scanner...');
    
    const scannerProcess = spawn(pythonCmd, [scannerScript], {
      cwd: __dirname,
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    scannerProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`Scanner: ${data}`);
    });

    scannerProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Scanner Error: ${data}`);
    });

    scannerProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject({ success: false, error: errorOutput || 'Scanner failed' });
      }
    });

    scannerProcess.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
  });
});

// App lifecycle
app.whenReady().then(async () => {
  try {
    // Start API server first
    await startAPIServer();
    
    // Then create window
    createWindow();
    
    console.log('✓ Digital Decluttering Agent started successfully');
  } catch (error) {
    console.error('Failed to start application:', error);
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start the application: ${error.message}\n\nPlease ensure Python 3 is installed.`
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopAPIServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  stopAPIServer();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

console.log('🧹 Digital Decluttering Agent - Electron main process loaded');

// Made with Bob