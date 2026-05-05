const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Dialog methods
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Shell methods
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Scanner methods
  runScanner: () => ipcRenderer.invoke('run-scanner'),
  
  // Platform info
  platform: process.platform,
  
  // App info
  isElectron: true,
  appVersion: require('./package.json').version,
  appName: 'Digital Decluttering Agent'
});

console.log('🧹 Digital Decluttering Agent preload script loaded');

// Made with Bob