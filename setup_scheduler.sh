#!/bin/bash

# Setup Script for Digital Decluttering Agent Scheduler
# This script installs the monthly scheduled task

echo "=========================================="
echo "Digital Decluttering Agent"
echo "Monthly Scheduler Setup"
echo "=========================================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLIST_FILE="$SCRIPT_DIR/com.digitalclutter.scanner.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
INSTALLED_PLIST="$LAUNCH_AGENTS_DIR/com.digitalclutter.scanner.plist"

# Create logs directory
mkdir -p "$SCRIPT_DIR/logs"

# Make scripts executable
chmod +x "$SCRIPT_DIR/run_scheduled_scan.sh"
chmod +x "$SCRIPT_DIR/file_scanner_user_only.py"

echo "✓ Scripts made executable"
echo ""

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Copy plist file to LaunchAgents
cp "$PLIST_FILE" "$INSTALLED_PLIST"

if [ $? -eq 0 ]; then
    echo "✓ Scheduler configuration installed"
else
    echo "❌ Failed to install scheduler configuration"
    exit 1
fi

# Unload existing job if it exists
launchctl unload "$INSTALLED_PLIST" 2>/dev/null

# Load the new job
launchctl load "$INSTALLED_PLIST"

if [ $? -eq 0 ]; then
    echo "✓ Scheduler activated"
else
    echo "❌ Failed to activate scheduler"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "The Digital Decluttering Agent will now run:"
echo "  📅 Every month on the 1st"
echo "  🕘 At 9:00 AM"
echo ""
echo "You will receive a notification titled:"
echo "  'Digital Decluttering Agent'"
echo ""
echo "Reports will be saved to:"
echo "  $SCRIPT_DIR/reports/"
echo ""
echo "Logs will be saved to:"
echo "  $SCRIPT_DIR/logs/"
echo ""
echo "To test the notification now, run:"
echo "  $SCRIPT_DIR/run_scheduled_scan.sh"
echo ""
echo "To check scheduler status:"
echo "  launchctl list | grep digitalclutter"
echo ""
echo "To uninstall the scheduler:"
echo "  $SCRIPT_DIR/uninstall_scheduler.sh"
echo ""

# Made with Bob
