#!/bin/bash

# Digital Decluttering Agent - Dashboard Launcher

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DASHBOARD_DIR="$SCRIPT_DIR/dashboard"

echo "=========================================="
echo "Digital Decluttering Agent Dashboard"
echo "=========================================="
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed."
    exit 1
fi

# Convert latest report to JSON
echo "Converting latest report to JSON..."
cd "$DASHBOARD_DIR"
python3 convert_report.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to convert report."
    echo "Make sure you have run a scan first."
    exit 1
fi

echo ""
echo "=========================================="
echo "Starting dashboard server..."
echo "=========================================="
echo ""

# Start Python HTTP server
PORT=8080
echo "Dashboard is now running at:"
echo ""
echo "  http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser
sleep 1
if command -v open &> /dev/null; then
    open "http://localhost:$PORT"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT"
fi

# Start API server with file deletion capabilities
cd "$DASHBOARD_DIR"
python3 api.py

# Made with Bob
