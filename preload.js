// A BrowserWindow's preload script runs in a context that has access to both the HTML DOM 
// and a limited subset of Node.js and Electron APIs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})