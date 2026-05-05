#!/bin/bash

# Script to create a macOS .app bundle for Digital Decluttering Agent

APP_NAME="Digital Decluttering Agent"
APP_DIR="${APP_NAME}.app"
CONTENTS_DIR="${APP_DIR}/Contents"
MACOS_DIR="${CONTENTS_DIR}/MacOS"
RESOURCES_DIR="${CONTENTS_DIR}/Resources"

echo "🎨 Creating macOS Application Bundle..."
echo "========================================"

# Clean up existing app if it exists
if [ -d "${APP_DIR}" ]; then
    echo "🗑️  Removing existing app..."
    rm -rf "${APP_DIR}"
fi

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p "${MACOS_DIR}"
mkdir -p "${RESOURCES_DIR}"

# Create Info.plist
echo "📝 Creating Info.plist..."
cat > "${CONTENTS_DIR}/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>launcher</string>
    <key>CFBundleIdentifier</key>
    <string>com.adriansolomone.digitalclutter</string>
    <key>CFBundleName</key>
    <string>Digital Decluttering Agent</string>
    <key>CFBundleDisplayName</key>
    <string>Digital Decluttering Agent</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Create the launcher script
echo "🚀 Creating launcher script..."
cat > "${MACOS_DIR}/launcher" << 'EOF'
#!/bin/bash

# Get the directory where the app bundle is located
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_DIR="$(dirname "$APP_DIR")"

cd "$PROJECT_DIR"

# Check if Python dependencies are installed
if ! python3 -c "import pandas" 2>/dev/null; then
    osascript -e 'display dialog "Python dependencies not installed. Please run:\n\npip3 install -r requirements.txt" buttons {"OK"} default button "OK" with icon stop with title "Digital Decluttering Agent"'
    exit 1
fi

# Check if a scan report exists
if [ ! -f "dashboard/data/latest_report.json" ]; then
    RESPONSE=$(osascript -e 'display dialog "No scan report found. Would you like to run a scan now?" buttons {"Cancel", "Run Scan"} default button "Run Scan" with icon note with title "Digital Decluttering Agent"')
    
    if [[ $RESPONSE == *"Run Scan"* ]]; then
        # Run scan in Terminal
        osascript -e 'tell application "Terminal"
            activate
            do script "cd '"$PROJECT_DIR"' && ./\"Digital Decluttering agent\" && echo \"\" && echo \"Scan complete! Press any key to close...\" && read -n 1"
        end tell'
        
        # Wait for scan to complete
        while [ ! -f "dashboard/data/latest_report.json" ]; do
            sleep 2
        done
    else
        exit 0
    fi
fi

# Start the dashboard server in the background
./start_dashboard.sh > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Open the dashboard in default browser
open "http://localhost:8080"

# Show notification
osascript -e 'display notification "Dashboard is now running at http://localhost:8080" with title "Digital Decluttering Agent" sound name "Glass"'

# Keep the app "running" (the server runs in background)
# The user can quit by closing the browser and stopping the server manually
EOF

chmod +x "${MACOS_DIR}/launcher"

# Create app icon (using emoji as fallback)
echo "🎨 Creating app icon..."
if command -v sips &> /dev/null; then
    # Create a simple icon using ImageMagick or sips if available
    # For now, we'll skip icon creation - macOS will use default
    echo "   (Using default icon - you can customize later)"
else
    echo "   (Using default icon)"
fi

# Make the app executable
chmod +x "${APP_DIR}"

echo ""
echo "✅ Application created successfully!"
echo ""
echo "📍 Location: ${APP_DIR}"
echo ""
echo "To use the app:"
echo "1. Double-click '${APP_NAME}.app' to launch"
echo "2. Or drag it to your Applications folder"
echo "3. Or drag it to your Dock for quick access"
echo ""
echo "Note: On first launch, macOS may ask for permission."
echo "      Go to System Settings → Privacy & Security → Allow"
echo ""

# Made with Bob
