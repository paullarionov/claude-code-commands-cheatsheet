# Claude Limits Widget - Desktop Application

The Claude Limits Widget is now available as a standalone desktop application for macOS and Windows, providing quick access to your API limits status from the system traybar.

## Features

- **System Tray Integration**: Quick access from your macOS menu bar or Windows system tray
- **Real-time Status Updates**: Displays current API limits period and countdown to next period
- **24-Hour Timeline**: Visual representation of peak hours (16:00-01:00 UTC) vs best time (01:00-16:00 UTC)
- **System Status Monitoring**: Shows Claude API system status with operational/degraded/outage indicators
- **Minimal Resource Usage**: Lightweight Electron app that runs quietly in the background
- **Multi-platform**: Works on macOS and Windows

## Installation

### Prerequisites
- Node.js 14+ and npm

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create tray icons:
   - Place `tray-icon-mac.png` (16x16-44x44px) in the `assets/` directory for macOS
   - Place `tray-icon-win.png` (16x16-32x32px) in the `assets/` directory for Windows
   - See `assets/README.md` for icon creation guidance

3. Run in development mode:
```bash
npm run dev
```

## Building

### Build for Mac and Windows
```bash
npm run build:all
```

### Build for Mac only
```bash
npm run build:mac
```

### Build for Windows only
```bash
npm run build:win
```

The built applications will be in the `dist/` directory.

## Usage

### Starting the Application
1. Launch the app from your applications folder (macOS) or Start menu (Windows)
2. The app will start minimized in the system tray

### Accessing the Widget
- **macOS**: Click the icon in the menu bar (top-right corner)
- **Windows**: Click the icon in the system tray (bottom-right corner)

### Menu Options
- **Show Widget**: Display the main limits status window
- **Check Status**: Open and focus the status widget
- **Preferences**: Access app settings (future enhancement)
- **Quit**: Close the application

### Keyboard Shortcuts
- **Cmd+Q** (macOS) or **Ctrl+Q** (Windows): Quit the application
- **Cmd+,** (macOS) or **Ctrl+,** (Windows): Open preferences (future enhancement)

## How It Works

### Peak Hours vs Best Time
The Claude API has different rate limits depending on UTC time:

- **Peak Hours** (16:00 - 01:00 UTC, shown in red):
  - Lower rate limits apply
  - Best time to batch large requests is outside these hours
  - Current period shows "Low Limits"

- **Best Time** (01:00 - 16:00 UTC, shown in green):
  - Higher rate limits apply
  - Ideal window for large API requests
  - Current period shows "High Limits"

### System Status
The widget displays the Claude API system status:
- 🟢 **Operational**: All systems running normally
- 🟡 **Degraded**: Minor or major issues detected
- 🔴 **Critical**: Service outage
- ⚫ **Unknown**: Unable to fetch status

Click the status indicator to open the Claude status page.

## Configuration

### Window Behavior
By default, the widget window:
- Hides when you click away (macOS only)
- Appears in the center of your screen
- Remembers its position between sessions

### Theme Support
The app respects your system theme preference (light/dark mode).

## File Structure

```
src/
├── main.js           # Electron main process
├── preload.js        # IPC security bridge
├── widget.html       # Widget UI
├── widget.css        # Widget styles
└── widget.js         # Widget logic

assets/
├── tray-icon-mac.png # macOS tray icon
└── tray-icon-win.png # Windows tray icon

package.json         # App configuration and scripts
```

## Troubleshooting

### Tray Icon Not Showing
- Ensure icon files exist in the `assets/` directory
- Check that icon dimensions are correct (16x16 minimum)
- Rebuild the application: `npm run build`

### Widget Not Updating
- Check that you have an internet connection (for status updates)
- Restart the application

### Memory Usage
- The app uses minimal resources (~50-100MB)
- If experiencing issues, restart the application

## Development

### Adding New Features
To modify the widget:
1. Update `src/widget.html` for UI changes
2. Update `src/widget.css` for styling
3. Update `src/widget.js` for logic changes
4. Update `src/main.js` for traybar/window behavior

### IPC Communication
The app uses Electron's IPC for secure communication between the main process and renderer:

```javascript
// In widget.js (renderer process)
const status = await window.electronAPI.getSystemStatus();

// In main.js (main process)
ipcMain.handle('get-system-status', async () => {
  // Fetch data
  return statusData;
});
```

## Future Enhancements

Potential features for future versions:
- [ ] Preferences window with theme and notification settings
- [ ] API key validation and usage analytics
- [ ] Custom notifications before peak hours
- [ ] Integration with other Claude tools
- [ ] Auto-start on system boot option
- [ ] Multiple API keys management

## License

MIT License - See main repository for full license information

## Support

For issues or feature requests related to the desktop app:
1. Check the troubleshooting section above
2. Ensure all files are in the correct locations
3. Rebuild the application with `npm run build`
4. Report issues to the main repository's issue tracker

## Changelog

### Version 1.0.0
- Initial release
- macOS and Windows support
- System tray integration
- Real-time API limits display
- System status monitoring
