#!/bin/bash

# Digital Decluttering Agent - Double-Click Launcher
# This file can be double-clicked from Finder to launch the dashboard

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the project directory
cd "$SCRIPT_DIR"

# Run the dashboard
./start_dashboard.sh