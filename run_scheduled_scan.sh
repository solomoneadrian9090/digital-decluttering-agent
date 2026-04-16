#!/bin/bash

# Digital Decluttering Agent - Scheduled Scanner
# Runs the user file scanner and sends a macOS notification

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Log file for scheduled runs
LOG_FILE="$SCRIPT_DIR/logs/scheduled_scan.log"
mkdir -p "$SCRIPT_DIR/logs"

# Start logging
echo "========================================" >> "$LOG_FILE"
echo "Digital Decluttering Agent" >> "$LOG_FILE"
echo "Scan started: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Run the scanner and capture output
OUTPUT=$(python3 "$SCRIPT_DIR/file_scanner_user_only.py" 2>&1)
EXIT_CODE=$?

# Log the output
echo "$OUTPUT" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Extract key information from output
FILES_FOUND=$(echo "$OUTPUT" | grep "Found" | grep "files not accessed" | awk '{print $2}')
TOTAL_SIZE=$(echo "$OUTPUT" | grep "Total size of old files:" | awk '{print $5, $6}')
REPORT_PATH=$(echo "$OUTPUT" | grep "Report successfully created at:" | awk -F': ' '{print $2}')

# Prepare notification
if [ $EXIT_CODE -eq 0 ] && [ ! -z "$FILES_FOUND" ]; then
    # Success notification
    TITLE="Digital Decluttering Agent"
    MESSAGE="Monthly scan complete! Found $FILES_FOUND old files ($TOTAL_SIZE)"
    SUBTITLE="Report ready for review"
    
    echo "Scan completed successfully" >> "$LOG_FILE"
    echo "Files found: $FILES_FOUND" >> "$LOG_FILE"
    echo "Total size: $TOTAL_SIZE" >> "$LOG_FILE"
    echo "Report: $REPORT_PATH" >> "$LOG_FILE"
else
    # Error notification
    TITLE="Digital Decluttering Agent"
    MESSAGE="Scan completed with issues. Check logs for details."
    SUBTITLE="Monthly scan"
    
    echo "Scan completed with exit code: $EXIT_CODE" >> "$LOG_FILE"
fi

# Send macOS notification with custom icon
# If the app bundle exists, use it to show custom icon
APP_BUNDLE="$SCRIPT_DIR/Digital Decluttering Dashboard.app"

if [ -d "$APP_BUNDLE" ]; then
    # Use terminal-notifier for better notifications with custom icon
    if command -v terminal-notifier &> /dev/null; then
        terminal-notifier -title "$TITLE" -subtitle "$SUBTITLE" -message "$MESSAGE" \
            -sound Glass -group "digital-declutter" \
            -appIcon "$APP_BUNDLE/Contents/Resources/AppIcon.icns" 2>/dev/null
    else
        # Fallback to osascript (no custom icon support)
        osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" subtitle \"$SUBTITLE\" sound name \"Glass\"" 2>/dev/null
    fi
else
    # App bundle doesn't exist, use standard notification
    osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" subtitle \"$SUBTITLE\" sound name \"Glass\"" 2>/dev/null
fi

echo "Notification sent" >> "$LOG_FILE"
echo "Scan finished: $(date '+%Y-%m-%d %H:%M:%S')" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

exit $EXIT_CODE

# Made with Bob
