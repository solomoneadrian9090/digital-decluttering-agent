#!/bin/bash

# Digital Decluttering Agent - Background Dashboard Launcher
# This version runs silently without opening browser

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DASHBOARD_DIR="$SCRIPT_DIR/dashboard"

# Use absolute path to Python
PYTHON="/usr/bin/python3"

# Convert latest report to JSON
cd "$DASHBOARD_DIR"
$PYTHON convert_report.py > /dev/null 2>&1

if [ $? -ne 0 ]; then
    exit 1
fi

# Start API server in background (no browser opening)
cd "$DASHBOARD_DIR"
$PYTHON api.py > /dev/null 2>&1 &

exit 0

# Made with Bob
