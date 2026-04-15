#!/bin/bash

# File Inventory Scanner - Run Script
# This script sets up and runs the file inventory scanner

echo "=========================================="
echo "File Inventory Scanner"
echo "=========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed."
    echo "Please install Python 3 to continue."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"
echo ""

# Check if required packages are installed
echo "Checking dependencies..."
if ! python3 -c "import pandas" 2>/dev/null; then
    echo "📦 Installing required packages..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies."
        echo "Please run: pip3 install -r requirements.txt"
        exit 1
    fi
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "Starting file scanner..."
echo ""

# Run the scanner
python3 file_scanner.py

echo ""
echo "=========================================="
echo "Scanner completed!"
echo "=========================================="

# Made with Bob
