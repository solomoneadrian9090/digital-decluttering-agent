#!/bin/bash

# Digital Decluttering Agent - Stop Script
# Stops the running Electron app

echo "🛑 Stopping Digital Decluttering Agent..."

# Kill any running Electron processes for this app
pkill -f "electron.*Digital Decluttering agent"

# Kill any running Python API servers
pkill -f "python3.*api.py"

echo "✓ App stopped"

# Made with Bob