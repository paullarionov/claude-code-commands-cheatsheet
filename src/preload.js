const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
  getLimitsData: () => ipcRenderer.invoke('get-limits-data'),
});
