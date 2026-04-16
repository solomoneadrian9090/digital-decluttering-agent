#!/bin/bash

# Install global command for Digital Decluttering Agent
# This allows you to run "declutter" from anywhere in your terminal

echo "Installing global 'declutter' command..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create the global command script
cat > /usr/local/bin/declutter << EOF
#!/bin/bash
cd "$SCRIPT_DIR"
./start_dashboard.sh
EOF

# Make it executable
chmod +x /usr/local/bin/declutter

echo ""
echo "✅ Installation complete!"
echo ""
echo "You can now run the dashboard from anywhere by typing:"
echo "  declutter"
echo ""

# Made with Bob
