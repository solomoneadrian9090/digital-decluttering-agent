#!/bin/bash

# Create Desktop Shortcut for Digital Decluttering Agent

echo "Creating desktop shortcut..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create an alias to the launch.command file on Desktop
ln -sf "$SCRIPT_DIR/launch.command" ~/Desktop/"Digital Decluttering Dashboard.command"

echo ""
echo "✅ Desktop shortcut created!"
echo ""
echo "You can now double-click 'Digital Decluttering Dashboard.command'"
echo "on your Desktop to launch the dashboard."
echo ""

# Made with Bob
