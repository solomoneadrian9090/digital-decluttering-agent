#!/bin/bash

# Create macOS App Bundle for Digital Decluttering Agent
# This creates a proper .app that supports custom icons

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_NAME="Digital Decluttering Dashboard"
APP_PATH="$SCRIPT_DIR/$APP_NAME.app"
ICON_FILE="$SCRIPT_DIR/icon.png"

echo "Creating macOS App Bundle..."
echo ""

# Create app bundle structure
mkdir -p "$APP_PATH/Contents/MacOS"
mkdir -p "$APP_PATH/Contents/Resources"

# Create Info.plist
cat > "$APP_PATH/Contents/Info.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>launcher</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.ibm.digitalclutter</string>
    <key>CFBundleName</key>
    <string>Digital Decluttering Dashboard</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Create launcher script that runs in background
cat > "$APP_PATH/Contents/MacOS/launcher" << 'EOF'
#!/bin/bash

# Get the directory where this app is located
APP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../../.. && pwd )"
cd "$APP_DIR"

# Use absolute paths
LSOF="/usr/sbin/lsof"
OPEN="/usr/bin/open"

# Check if server is already running
if $LSOF -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    # Server already running, just open browser
    $OPEN "http://localhost:8080"
    exit 0
fi

# Start server in background using dedicated background script
./start_dashboard_background.sh &
SERVER_PID=$!

# Wait for server to start (max 10 seconds)
for i in {1..20}; do
    if $LSOF -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        # Server is ready, open browser
        sleep 0.5  # Extra delay to ensure server is fully ready
        $OPEN "http://localhost:8080"
        exit 0
    fi
    sleep 0.5
done

# If we get here, server didn't start
/usr/bin/osascript -e 'display notification "Failed to start dashboard server. Try running ./start_dashboard.sh manually to see errors." with title "Digital Decluttering Agent"'
exit 1
EOF

chmod +x "$APP_PATH/Contents/MacOS/launcher"

echo "✅ App bundle created!"

# Apply custom icon if it exists
if [ -f "$ICON_FILE" ]; then
    echo "Applying custom icon..."
    
    # Create iconset directory
    ICONSET_DIR="$APP_PATH/Contents/Resources/AppIcon.iconset"
    mkdir -p "$ICONSET_DIR"
    
    # Generate different icon sizes
    sips -z 16 16     "$ICON_FILE" --out "$ICONSET_DIR/icon_16x16.png" > /dev/null 2>&1
    sips -z 32 32     "$ICON_FILE" --out "$ICONSET_DIR/icon_16x16@2x.png" > /dev/null 2>&1
    sips -z 32 32     "$ICON_FILE" --out "$ICONSET_DIR/icon_32x32.png" > /dev/null 2>&1
    sips -z 64 64     "$ICON_FILE" --out "$ICONSET_DIR/icon_32x32@2x.png" > /dev/null 2>&1
    sips -z 128 128   "$ICON_FILE" --out "$ICONSET_DIR/icon_128x128.png" > /dev/null 2>&1
    sips -z 256 256   "$ICON_FILE" --out "$ICONSET_DIR/icon_128x128@2x.png" > /dev/null 2>&1
    sips -z 256 256   "$ICON_FILE" --out "$ICONSET_DIR/icon_256x256.png" > /dev/null 2>&1
    sips -z 512 512   "$ICON_FILE" --out "$ICONSET_DIR/icon_256x256@2x.png" > /dev/null 2>&1
    sips -z 512 512   "$ICON_FILE" --out "$ICONSET_DIR/icon_512x512.png" > /dev/null 2>&1
    sips -z 1024 1024 "$ICON_FILE" --out "$ICONSET_DIR/icon_512x512@2x.png" > /dev/null 2>&1
    
    # Convert to icns
    iconutil -c icns "$ICONSET_DIR" -o "$APP_PATH/Contents/Resources/AppIcon.icns"
    
    # Clean up iconset
    rm -rf "$ICONSET_DIR"
    
    echo "✅ Custom icon applied!"
else
    echo "ℹ️  No custom icon found (icon.png)"
    echo "   The app will use the default icon"
fi

# Update icon cache
touch "$APP_PATH"
killall Finder 2>/dev/null || true

echo ""
echo "=========================================="
echo "✅ Success!"
echo "=========================================="
echo ""
echo "Your app is ready: $APP_NAME.app"
echo ""
echo "You can now:"
echo "  1. Double-click '$APP_NAME.app' to launch"
echo "  2. Drag it to your Dock for quick access"
echo "  3. Move it to Applications folder"
echo "  4. Create an alias on your Desktop"
echo ""

# Made with Bob
