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

# Create app icon from PNG
echo "🎨 Creating app icon..."
if [ -f "icon.png" ]; then
    # Create iconset directory
    ICONSET_DIR="${RESOURCES_DIR}/AppIcon.iconset"
    mkdir -p "${ICONSET_DIR}"
    
    # Generate all required icon sizes using sips
    sips -z 16 16     icon.png --out "${ICONSET_DIR}/icon_16x16.png" > /dev/null 2>&1
    sips -z 32 32     icon.png --out "${ICONSET_DIR}/icon_16x16@2x.png" > /dev/null 2>&1
    sips -z 32 32     icon.png --out "${ICONSET_DIR}/icon_32x32.png" > /dev/null 2>&1
    sips -z 64 64     icon.png --out "${ICONSET_DIR}/icon_32x32@2x.png" > /dev/null 2>&1
    sips -z 128 128   icon.png --out "${ICONSET_DIR}/icon_128x128.png" > /dev/null 2>&1
    sips -z 256 256   icon.png --out "${ICONSET_DIR}/icon_128x128@2x.png" > /dev/null 2>&1
    sips -z 256 256   icon.png --out "${ICONSET_DIR}/icon_256x256.png" > /dev/null 2>&1
    sips -z 512 512   icon.png --out "${ICONSET_DIR}/icon_256x256@2x.png" > /dev/null 2>&1
    sips -z 512 512   icon.png --out "${ICONSET_DIR}/icon_512x512.png" > /dev/null 2>&1
    sips -z 1024 1024 icon.png --out "${ICONSET_DIR}/icon_512x512@2x.png" > /dev/null 2>&1
    
    # Convert iconset to icns
    iconutil -c icns "${ICONSET_DIR}" -o "${RESOURCES_DIR}/AppIcon.icns"
    
    # Clean up iconset directory
    rm -rf "${ICONSET_DIR}"
    
    echo "   ✓ Icon created from icon.png"
else
    echo "   ⚠ icon.png not found - using default icon"
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
