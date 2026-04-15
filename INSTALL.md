# Installation Guide

Complete installation instructions for the Digital Decluttering Agent.

## 📋 Prerequisites

### System Requirements
- **Operating System**: macOS 10.14 or later
- **Python**: Python 3.7 or higher
- **Disk Space**: ~50 MB for the application
- **RAM**: 512 MB minimum

### Check Python Version
```bash
python3 --version
```

If Python 3 is not installed, download it from [python.org](https://www.python.org/downloads/)

## 🚀 Quick Install

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/IBM/digital-decluttering-agent.git

# Navigate to the directory
cd digital-decluttering-agent

# Install Python dependencies
pip3 install pandas openpyxl

# Make scripts executable
chmod +x "Digital Decluttering agent"
chmod +x start_dashboard.sh
chmod +x run_scheduled_scan.sh

# Run your first scan
./"Digital Decluttering agent"
```

### Option 2: Download ZIP

1. Download the latest release from [GitHub Releases](https://github.com/IBM/digital-decluttering-agent/releases)
2. Extract the ZIP file
3. Open Terminal and navigate to the extracted folder
4. Follow steps 3-5 from Option 1

## 📦 Installing Dependencies

### Using pip (Recommended)
```bash
pip3 install pandas openpyxl
```

### Using requirements.txt
```bash
pip3 install -r requirements.txt
```

### Verify Installation
```bash
python3 -c "import pandas, openpyxl; print('Dependencies installed successfully!')"
```

## 🔧 Configuration

### 1. Set Up Reports Directory

The application automatically creates a reports directory at:
```
~/Bob/Digital Decluttering agent/reports/
```

No manual configuration needed!

### 2. Configure Scan Threshold (Optional)

By default, the scanner finds files older than 6 months (180 days).

To change this, edit `file_scanner_user_only.py`:
```python
# Line 230: Change the number of days
cutoff_date = datetime.now() - timedelta(days=180)  # Change 180 to your preference
```

### 3. Customize Scanned Directories (Optional)

Edit `file_scanner_user_only.py` to add/remove directories:
```python
# Lines 18-30
USER_DIRECTORIES = [
    'Desktop',
    'Documents',
    'Downloads',
    'Pictures',
    'Movies',
    'Music',
    'YourCustomFolder',  # Add your own
]
```

## 🔄 Setting Up Automated Scanning

### Enable Monthly Scans

```bash
# Copy the LaunchAgent configuration
cp com.digitalclutter.scanner.plist ~/Library/LaunchAgents/

# Load the agent
launchctl load ~/Library/LaunchAgents/com.digitalclutter.scanner.plist

# Verify it's loaded
launchctl list | grep digitalclutter
```

### Customize Schedule

Edit `com.digitalclutter.scanner.plist`:
```xml
<!-- Run on the 1st of each month at 9:00 AM -->
<key>StartCalendarInterval</key>
<dict>
    <key>Day</key>
    <integer>1</integer>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>0</integer>
</dict>
```

## 🌐 Dashboard Setup

### Start the Dashboard

```bash
./start_dashboard.sh
```

The dashboard will:
1. Convert the latest report to JSON
2. Start the API server on port 8080
3. Open your browser automatically

### Access Dashboard

Open your browser to:
```
http://localhost:8080
```

### Stop the Dashboard

Press `Ctrl+C` in the terminal where the dashboard is running.

## 🔍 Verification

### Test the Scanner
```bash
./"Digital Decluttering agent"
```

Expected output:
```
======================================================================
FILE INVENTORY SCANNER - USER FILES ONLY
======================================================================
Scanning for files not accessed since: 2025-10-15
...
✓ Report successfully created at: ~/Bob/Digital Decluttering agent/reports/...
```

### Test the Dashboard
```bash
./start_dashboard.sh
```

Expected output:
```
==========================================
Digital Decluttering Agent Dashboard
==========================================
...
Dashboard is now running at:
  http://localhost:8080
```

## 🐛 Troubleshooting

### Issue: "Permission Denied"
```bash
chmod +x "Digital Decluttering agent"
chmod +x start_dashboard.sh
```

### Issue: "Module not found: pandas"
```bash
pip3 install --upgrade pandas openpyxl
```

### Issue: "Port 8080 already in use"
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9

# Restart dashboard
./start_dashboard.sh
```

### Issue: "No report data found"
```bash
# Run a scan first
./"Digital Decluttering agent"

# Then start dashboard
./start_dashboard.sh
```

### Issue: Python version too old
```bash
# Check version
python3 --version

# If < 3.7, install newer version from python.org
```

## 🔐 Security Notes

- The application only scans user directories
- System files are protected and excluded
- All data stays on your local machine
- No external connections or data sharing

## 📱 Uninstallation

### Remove the Application
```bash
rm -rf ~/Bob/"Digital Decluttering agent"
```

### Remove LaunchAgent (if configured)
```bash
launchctl unload ~/Library/LaunchAgents/com.digitalclutter.scanner.plist
rm ~/Library/LaunchAgents/com.digitalclutter.scanner.plist
```

### Remove Python Dependencies (optional)
```bash
pip3 uninstall pandas openpyxl
```

## 🆘 Getting Help

- **Documentation**: See README.md, DASHBOARD_GUIDE.md, INTERACTIVE_DELETION_GUIDE.md
- **Issues**: [GitHub Issues](https://github.com/IBM/digital-decluttering-agent/issues)
- **IBM Slack**: #digital-decluttering
- **Email**: digital-decluttering@ibm.com

## ✅ Next Steps

After installation:
1. ✅ Run your first scan
2. ✅ Launch the dashboard
3. ✅ Explore the features
4. ✅ Set up automated scanning (optional)
5. ✅ Start decluttering!

---

**Installation complete! Happy decluttering! 🎉**