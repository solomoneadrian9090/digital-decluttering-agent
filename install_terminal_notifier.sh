#!/bin/bash

# Install terminal-notifier for better notifications with custom icons

echo "Installing terminal-notifier..."
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo ""
    echo "To install Homebrew, run:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""
    echo "After installing Homebrew, run this script again."
    exit 1
fi

# Install terminal-notifier
echo "Installing terminal-notifier via Homebrew..."
brew install terminal-notifier

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ terminal-notifier installed successfully!"
    echo ""
    echo "Your notifications will now show your custom icon!"
    echo ""
else
    echo ""
    echo "❌ Installation failed."
    echo "Try running: brew install terminal-notifier"
    exit 1
fi

# Made with Bob
