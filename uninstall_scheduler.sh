#!/bin/bash

# Uninstall Script for Digital Decluttering Agent Scheduler

echo "=========================================="
echo "Digital Decluttering Agent"
echo "Uninstalling Monthly Scheduler"
echo "=========================================="
echo ""

LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
INSTALLED_PLIST="$LAUNCH_AGENTS_DIR/com.digitalclutter.scanner.plist"

if [ -f "$INSTALLED_PLIST" ]; then
    # Unload the job
    launchctl unload "$INSTALLED_PLIST" 2>/dev/null
    
    # Remove the plist file
    rm "$INSTALLED_PLIST"
    
    if [ $? -eq 0 ]; then
        echo "✓ Scheduler uninstalled successfully"
        echo ""
        echo "The monthly scan will no longer run automatically."
        echo "You can still run scans manually using:"
        echo "  ./run_user_scanner.sh"
    else
        echo "❌ Failed to remove scheduler configuration"
        exit 1
    fi
else
    echo "⚠️  Scheduler is not installed"
    echo ""
    echo "Nothing to uninstall."
fi

echo ""

# Made with Bob
