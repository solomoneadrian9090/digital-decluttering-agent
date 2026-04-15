# Digital Decluttering Agent - Dashboard Guide

## Quick Start

```bash
cd ~/Bob/"Digital Decluttering agent"
./start_dashboard.sh
```

The dashboard will automatically:
1. Convert the latest Excel report to JSON
2. Start a local web server on port 8080
3. Open your browser to http://localhost:8080

## Dashboard Features

### IBM Design Language
- Professional IBM Plex Sans typography
- IBM Carbon color palette
- Clean, modern interface
- Responsive design

### Intelligent File Categories

**Documents** 📄
- PDF, Word, Text files
- Presentations, Spreadsheets

**Media** 🎬
- Images (JPG, PNG, GIF, SVG)
- Videos (MP4, MOV, AVI)
- Audio (MP3, WAV, M4A)

**Archives** 📦
- ZIP, RAR, 7Z files
- DMG, ISO images

**Downloads** ⬇️
- All files in Downloads folder
- Often contains duplicates

**Other** 📁
- Everything else

### Smart Recommendations

**DELETE** 🗑️ (Red)
- Large files (>100MB) unused 2+ years
- Old download archives (1+ year)
- Clear space-saving opportunities

**ARCHIVE** 📦 (Purple)
- Large media files (>50MB, 1+ year)
- Old documents (2+ years)
- Move to external storage

**REVIEW** 👀 (Yellow)
- Possible duplicates
- Files to manually check
- General old files

**KEEP** ✅ (Green)
- Recently accessed
- Important files

## Dashboard Sections

### 1. Summary Cards
- **Total Old Files**: Count of files not accessed in 1+ year
- **Total Size**: Combined size of all old files
- **Recommended for Deletion**: Files safe to remove
- **Last Scan**: When the report was generated

### 2. Category Tabs
Click tabs to filter files by category:
- All Files
- Documents
- Media
- Archives
- Downloads
- Other

### 3. Files Table
Sortable table showing:
- File Name
- Location (path)
- Size (in MB/GB)
- Last Accessed (human-readable)
- File Type
- Recommendation (DELETE/ARCHIVE/REVIEW/KEEP)
- Actions (Show in Finder)

### 4. Insights & Recommendations
AI-powered analysis including:
- **Potential Space Savings**: How much you can free up
- **Downloads Folder Analysis**: Old downloads to clean
- **Large Files**: Biggest space consumers
- **File Type Distribution**: What types you have most

## Using the Dashboard

### Viewing Files
1. Click category tabs to filter by type
2. Files are sorted by size (largest first)
3. Hover over file names to see full path
4. Check the recommendation tag for guidance

### Taking Action
1. Review files marked for **DELETE**
2. Consider archiving **ARCHIVE** files to external storage
3. Manually review **REVIEW** files
4. Keep **KEEP** files

### Refreshing Data
After running a new scan:
```bash
./start_dashboard.sh
```

Or click "Refresh Data" button in the dashboard (requires restart).

## Tips for Best Results

### Space Savings Priority
1. Start with **DELETE** recommendations
2. Focus on files >100MB first
3. Clean Downloads folder regularly
4. Archive old media files

### Safety First
- Always review before deleting
- Keep backups of important data
- Check file paths carefully
- When in doubt, archive instead of delete

### Regular Maintenance
- Run monthly scans (automated via scheduler)
- Review dashboard after each scan
- Clean Downloads folder weekly
- Archive old projects quarterly

## Keyboard Shortcuts

- **Tab**: Navigate between sections
- **Cmd+R**: Refresh browser (after new scan)
- **Cmd+F**: Search in table
- **Cmd+W**: Close browser tab

## Troubleshooting

### Dashboard shows no data
```bash
# Regenerate data
cd ~/Bob/"Digital Decluttering agent"/dashboard
python3 convert_report.py
```

### Server won't start
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill existing process
kill -9 <PID>

# Or use different port
cd ~/Bob/"Digital Decluttering agent"/dashboard
python3 -m http.server 8081
```

### Browser shows old data
1. Stop server (Ctrl+C)
2. Run new scan
3. Restart dashboard

## Advanced Usage

### Custom Port
```bash
cd ~/Bob/"Digital Decluttering agent"/dashboard
python3 convert_report.py
python3 -m http.server 9000
```

### View JSON Data
```bash
cat ~/Bob/"Digital Decluttering agent"/dashboard/data/latest_report.json
```

### Export Filtered Data
Use browser's developer tools (F12) to access filtered data:
```javascript
// In browser console
console.log(dashboard.files);
```

## Understanding Recommendations

### DELETE Criteria
- Files >100MB not accessed in 2+ years
- Archives in Downloads >1 year old
- Clear duplicates

### ARCHIVE Criteria
- Media files >50MB, 1+ year old
- Documents not accessed in 2+ years
- Large files worth keeping

### REVIEW Criteria
- Files with "copy" or "duplicate" in name
- Files with (1), (2) in name
- General old files

## Integration with Scheduler

The monthly scheduler automatically:
1. Runs scan on 1st of month at 9 AM
2. Generates Excel report
3. Sends notification

To view results:
```bash
./start_dashboard.sh
```

## IBM Design Compliance

This dashboard follows IBM Design Language:
- **Typography**: IBM Plex Sans
- **Colors**: IBM Carbon palette
- **Spacing**: IBM 8px grid system
- **Components**: IBM Carbon style
- **Interactions**: IBM motion principles

## Support

For issues:
- Check terminal output for errors
- Verify report exists in `reports/` folder
- Ensure Python 3 and pandas are installed
- Review logs in `logs/` directory