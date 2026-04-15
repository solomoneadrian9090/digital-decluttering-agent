# Digital Decluttering Agent - Scheduler Guide

## Overview

The Digital Decluttering Agent can run automatically every month and send you a notification when complete.

## Quick Setup

```bash
cd ~/Bob/Files-inventory
chmod +x setup_scheduler.sh
./setup_scheduler.sh
```

## What Gets Scheduled

- **Frequency:** Monthly (1st of each month)
- **Time:** 9:00 AM
- **Notification Title:** "Digital Decluttering Agent"
- **Notification Message:** Shows number of old files found and total size

## Notification Example

When the scan completes, you'll see a macOS notification:

```
┌─────────────────────────────────────┐
│ Digital Decluttering Agent          │
│ Monthly scan complete!              │
│                                     │
│ Found 339 old files (0.58 GB)      │
│ Report ready for review             │
└─────────────────────────────────────┘
```

## Files Created

### Scheduler Files
- `com.digitalclutter.scanner.plist` - LaunchAgent configuration
- `run_scheduled_scan.sh` - Script that runs monthly
- `setup_scheduler.sh` - Installation script
- `uninstall_scheduler.sh` - Removal script

### Log Files (created automatically)
- `logs/scheduled_scan.log` - Detailed scan logs
- `logs/launchd.out.log` - Standard output
- `logs/launchd.err.log` - Error output

## Testing the Notification

Before waiting for the monthly run, test it now:

```bash
cd ~/Bob/Files-inventory
./run_scheduled_scan.sh
```

You should immediately see:
1. The scan running
2. A notification when complete
3. A new report in the `reports/` folder
4. Log entry in `logs/scheduled_scan.log`

## Checking Scheduler Status

```bash
# Check if scheduler is running
launchctl list | grep digitalclutter

# View recent logs
tail -f ~/Bob/Files-inventory/logs/scheduled_scan.log
```

## Customizing the Schedule

Edit `com.digitalclutter.scanner.plist` to change when it runs:

```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Day</key>
    <integer>1</integer>        <!-- Day of month (1-31) -->
    <key>Hour</key>
    <integer>9</integer>         <!-- Hour (0-23) -->
    <key>Minute</key>
    <integer>0</integer>         <!-- Minute (0-59) -->
</dict>
```

After editing, reload the scheduler:
```bash
launchctl unload ~/Library/LaunchAgents/com.digitalclutter.scanner.plist
launchctl load ~/Library/LaunchAgents/com.digitalclutter.scanner.plist
```

## Common Schedule Examples

### Run on the 15th of each month at 2:00 PM
```xml
<key>Day</key>
<integer>15</integer>
<key>Hour</key>
<integer>14</integer>
<key>Minute</key>
<integer>0</integer>
```

### Run every Monday at 10:00 AM
```xml
<key>Weekday</key>
<integer>1</integer>  <!-- 0=Sunday, 1=Monday, etc. -->
<key>Hour</key>
<integer>10</integer>
<key>Minute</key>
<integer>0</integer>
```

### Run every Sunday at 8:00 PM
```xml
<key>Weekday</key>
<integer>0</integer>
<key>Hour</key>
<integer>20</integer>
<key>Minute</key>
<integer>0</integer>
```

## Uninstalling the Scheduler

```bash
cd ~/Bob/Files-inventory
./uninstall_scheduler.sh
```

This will:
- Stop the scheduled task
- Remove the LaunchAgent
- Keep all your reports and logs

You can still run scans manually after uninstalling.

## Troubleshooting

### Notification not appearing?

1. Check System Preferences → Notifications
2. Ensure "Script Editor" or "Terminal" has notifications enabled
3. Test manually: `./run_scheduled_scan.sh`

### Scheduler not running?

```bash
# Check if loaded
launchctl list | grep digitalclutter

# Check logs for errors
cat ~/Bob/Files-inventory/logs/launchd.err.log

# Reload scheduler
launchctl unload ~/Library/LaunchAgents/com.digitalclutter.scanner.plist
launchctl load ~/Library/LaunchAgents/com.digitalclutter.scanner.plist
```

### Want better notifications?

Install terminal-notifier for enhanced notifications:
```bash
brew install terminal-notifier
```

The script will automatically use it if available.

## What Happens During Scheduled Run

1. Scanner starts at scheduled time
2. Scans user directories (Desktop, Documents, Downloads, etc.)
3. Generates Excel report with timestamp
4. Logs results to `logs/scheduled_scan.log`
5. Sends macOS notification with summary
6. Completes silently in background

## Viewing Reports

All reports are saved in:
```
~/Bob/Files-inventory/reports/user_files_report_YYYY-MM-DD_HH-MM-SS.xlsx
```

To open the latest report:
```bash
open ~/Bob/Files-inventory/reports/user_files_report_*.xlsx
```

## Log Management

Logs are automatically appended. To clear old logs:
```bash
# Clear all logs
rm ~/Bob/Files-inventory/logs/*.log

# Or view recent entries only
tail -100 ~/Bob/Files-inventory/logs/scheduled_scan.log
```

## Privacy & Security

- Runs with your user permissions only
- No data sent externally
- All reports stored locally
- Logs contain file paths (review before sharing)
- Can be uninstalled anytime

## Support

For issues or questions:
- Check logs: `~/Bob/Files-inventory/logs/`
- Test manually: `./run_scheduled_scan.sh`
- Review configuration: `com.digitalclutter.scanner.plist`