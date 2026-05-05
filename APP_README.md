# Digital Decluttering Agent - Electron App

A native macOS application built with Electron for intelligent file analysis and cleanup.

## 🎯 Overview

This is the **Electron app version** of the Digital Decluttering Agent, providing a native macOS experience with:

- **Native App Interface**: Runs as a standalone macOS application
- **Integrated Scanner**: Run file scans directly from the app
- **Interactive Dashboard**: Full-featured web dashboard with IBM Design Language
- **File Management**: Safe deletion with Move to Trash or Permanent Delete options
- **Smart Recommendations**: AI-powered suggestions for file cleanup

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Python 3** (for the file scanner)
- **macOS** (this is a macOS-specific app)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd ~/Bob/"Digital Decluttering agent"
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

### Running the App

#### Option 1: Using the Launch Script (Recommended)
```bash
./launch-app.sh
```

#### Option 2: Using npm
```bash
npm start
```

#### Option 3: Development Mode
```bash
npm run dev
```

### Stopping the App

```bash
./stop-app.sh
```

Or simply close the app window and quit from the menu.

## 📦 Building the App

### Build for Distribution

Create a distributable macOS app:

```bash
npm run build
```

This creates:
- **DMG installer** in `dist/` directory
- **ZIP archive** for direct distribution
- Universal binary (Intel + Apple Silicon)

### Build Options

- **Intel only**: `npm run build -- --x64`
- **Apple Silicon only**: `npm run build -- --arm64`
- **Universal**: `npm run build:universal` (default)

## 🎨 Features

### 1. Integrated File Scanner

- Click **"Run Scanner"** button in the app
- Scans user directories for files not accessed in 180+ days
- Generates detailed reports automatically
- Dashboard updates with latest scan results

### 2. Interactive Dashboard

- **Summary Cards**: Total files, size, recommendations, last scan
- **Category Tabs**: Documents, Media, Archives, Downloads, Other
- **Advanced Filters**: Search, size range, file type, recommendations
- **Bulk Operations**: Select all, deselect all, bulk delete

### 3. Safe File Deletion

- **Move to Trash**: Recoverable deletion (recommended)
- **Permanent Delete**: Irreversible deletion (use with caution)
- **System Protection**: Prevents deletion of critical system files
- **Real-time Updates**: Dashboard refreshes after operations

### 4. Smart Recommendations

The app provides intelligent recommendations:
- **DELETE**: Large unused files, old downloads
- **ARCHIVE**: Old documents, large media files
- **REVIEW**: Possible duplicates, uncertain files
- **KEEP**: Recently accessed or important files

## 🏗️ Project Structure

```
Digital Decluttering agent/
├── electron-main.js              # Main Electron process
├── electron-preload.js           # Preload script (security)
├── package.json                  # App configuration
├── launch-app.sh                 # Launch script
├── stop-app.sh                   # Stop script
├── file_scanner_user_only.py    # Python scanner
├── requirements.txt              # Python dependencies
├── dashboard/                    # Web dashboard
│   ├── index.html               # Dashboard UI
│   ├── app.js                   # Dashboard logic
│   ├── styles.css               # IBM Design styling
│   ├── api.py                   # Backend API server
│   └── data/                    # Report data
├── assets/                       # App icons
│   ├── icon.svg                 # Vector icon
│   ├── icon.png                 # PNG icon (512x512)
│   └── icon.icns                # macOS icon
├── build/                        # Build configuration
│   └── entitlements.mac.plist   # macOS entitlements
├── scripts/                      # Utility scripts
│   └── generate-icons.js        # Icon generator
└── dist/                         # Build output (gitignored)
```

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

This enables:
- DevTools automatically opened
- Hot reload on code changes
- Detailed console logging

### Debugging

1. **Main Process**: Check terminal output
2. **Renderer Process**: Use DevTools (Cmd+Option+I)
3. **Python Scanner**: Check logs in `logs/` directory

### Making Changes

1. **UI Changes**: Edit files in `dashboard/`
2. **App Logic**: Edit `electron-main.js`
3. **Scanner**: Edit `file_scanner_user_only.py`
4. **Styling**: Edit `dashboard/styles.css`

## 🎨 Customizing the Icon

### Using Your Own Icon

1. Create a 512x512 PNG file
2. Save it as `assets/icon.png`
3. Run the icon generator:
   ```bash
   npm run generate-icons
   ```

### Using the Default Icon

The app includes a default cleaning brush icon. To regenerate it:

```bash
npm run generate-icons
```

## 📝 Configuration

### Electron Builder

Configuration is in `package.json` under the `build` key:

```json
{
  "build": {
    "appId": "com.adriansolomone.digitalclutter",
    "productName": "Digital Decluttering Agent",
    "mac": {
      "category": "public.app-category.utilities",
      "icon": "assets/icon.icns"
    }
  }
}
```

### Scanner Settings

Edit `file_scanner_user_only.py` to customize:
- Scan directories (line 18-30)
- Excluded subdirectories (line 33-48)
- File age threshold (line 230)

## 🔒 Security

### Electron Security

- **Context Isolation**: Enabled
- **Node Integration**: Disabled in renderer
- **Preload Script**: Secure IPC communication
- **CSP**: Content Security Policy enforced

### File Operations

- System files are protected
- Confirmation required for deletions
- Double confirmation for permanent delete
- Permission validation before operations

## 🐛 Troubleshooting

### App Won't Start

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.0.0+
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Python:**
   ```bash
   python3 --version
   pip3 install -r requirements.txt
   ```

### Scanner Not Working

1. **Check Python dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Check file permissions:**
   ```bash
   chmod +x file_scanner_user_only.py
   ```

3. **Run scanner manually:**
   ```bash
   python3 file_scanner_user_only.py
   ```

### Dashboard Not Loading

1. **Check API server:**
   - Look for "API Server: Serving" in terminal
   - Check port 8080 is not in use

2. **Check report data:**
   ```bash
   ls -la dashboard/data/
   ```

3. **Restart the app:**
   ```bash
   ./stop-app.sh
   ./launch-app.sh
   ```

## 📊 Performance

### Optimization Tips

1. **Large File Sets**: Use filters to narrow results
2. **Memory Usage**: Close other apps during scanning
3. **Scan Speed**: Exclude unnecessary directories
4. **Dashboard**: Limit visible files with filters

### System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for app + dependencies
- **macOS**: 10.13 (High Sierra) or later

## 🔄 Updates

### Updating the App

1. Pull latest changes
2. Reinstall dependencies:
   ```bash
   npm install
   pip3 install -r requirements.txt
   ```
3. Rebuild if needed:
   ```bash
   npm run build
   ```

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check existing documentation
- Review troubleshooting section
- Check GitHub issues
- Contact: adrian@example.com

---

**Made with Bob** 🤖

For the original web-based version, see the main [README.md](README.md)