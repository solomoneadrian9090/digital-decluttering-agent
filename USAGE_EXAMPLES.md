# Usage Examples

## Example 1: First Time Running the Scanner

```bash
cd ~/Bob/Files-inventory
./run_scanner.sh
```

**Expected Output:**
```
==========================================
File Inventory Scanner
==========================================

✓ Python 3 found: Python 3.11.5
Checking dependencies...
📦 Installing required packages...
✓ Dependencies installed

Starting file scanner...

======================================================================
FILE INVENTORY SCANNER
======================================================================
Scanning for files not accessed since: 2025-04-15
Starting from: /Users/adriansolomone
Report will be saved to: /Users/adriansolomone/Bob/Files-inventory/reports/file_inventory_report_2026-04-15_16-30-00.xlsx
======================================================================

Starting scan from: /Users/adriansolomone
Looking for files not accessed since: 2025-04-15
This may take a while...

Scanned 1000 files, found 45 old files...
Scanned 2000 files, found 89 old files...
Scanned 3000 files, found 134 old files...

Scan complete! Scanned 5432 files.
Found 234 files not accessed in over 1 year.

Excel report created: /Users/adriansolomone/Bob/Files-inventory/reports/file_inventory_report_2026-04-15_16-30-00.xlsx
Total files in report: 234
Total size of old files: 12.45 GB

Top 5 largest files:
  1024.50 MB - /Users/adriansolomone/Downloads/old_video.mp4
  512.30 MB - /Users/adriansolomone/Documents/archive.zip
  256.75 MB - /Users/adriansolomone/Desktop/old_project.dmg
  128.40 MB - /Users/adriansolomone/Pictures/raw_photos.zip
  64.20 MB - /Users/adriansolomone/Downloads/installer.pkg

✓ Report successfully created at: /Users/adriansolomone/Bob/Files-inventory/reports/file_inventory_report_2026-04-15_16-30-00.xlsx

Done!

==========================================
Scanner completed!
==========================================
```

## Example 2: Testing on Desktop Only

Before running a full scan, test on your Desktop:

```bash
cd ~/Bob/Files-inventory
python3 test_scanner.py
```

**Expected Output:**
```
======================================================================
FILE INVENTORY SCANNER - TEST MODE
======================================================================
This is a test run that only scans your Desktop folder.
======================================================================

Test scan starting from: /Users/adriansolomone/Desktop
Looking for files not accessed since: 2025-04-15
Report will be saved to: /Users/adriansolomone/Bob/Files-inventory/reports/test_report_desktop_2026-04-15_16-35-00.xlsx

Starting scan from: /Users/adriansolomone/Desktop
Looking for files not accessed since: 2025-04-15
This may take a while...

Scan complete! Scanned 87 files.
Found 12 files not accessed in over 1 year.

Excel report created: /Users/adriansolomone/Bob/Files-inventory/reports/test_report_desktop_2026-04-15_16-35-00.xlsx
Total files in report: 12
Total size of old files: 2.34 GB

Top 5 largest files:
  512.30 MB - /Users/adriansolomone/Desktop/old_backup.zip
  256.75 MB - /Users/adriansolomone/Desktop/presentation.pptx
  128.40 MB - /Users/adriansolomone/Desktop/video.mp4
  64.20 MB - /Users/adriansolomone/Desktop/photos.zip
  32.10 MB - /Users/adriansolomone/Desktop/document.pdf

✓ Test report successfully created at: /Users/adriansolomone/Bob/Files-inventory/reports/test_report_desktop_2026-04-15_16-35-00.xlsx

You can now review this test report before running the full scan.

To run the full scan on your entire home directory, use:
  ./run_scanner.sh
  or
  python3 file_scanner.py
```

## Example 3: Manual Installation and Run

```bash
cd ~/Bob/Files-inventory

# Install dependencies
pip3 install -r requirements.txt

# Run the scanner
python3 file_scanner.py
```

## Example 4: Viewing Generated Reports

```bash
# List all reports
ls -lh ~/Bob/Files-inventory/reports/

# Open the latest report in Excel (macOS)
open ~/Bob/Files-inventory/reports/file_inventory_report_*.xlsx

# Or open a specific report
open ~/Bob/Files-inventory/reports/file_inventory_report_2026-04-15_16-30-00.xlsx
```

## Example 5: Understanding the Excel Report

When you open the report, you'll see:

**Header Section:**
```
Row 1: File Inventory Report - Files Not Accessed in Over 1 Year
Row 2: Report Generated: 2026-04-15 16:30:00
Row 3: Total Files Found: 234
```

**Data Columns:**
| File Path | Last Access Date | Last Modified Date | Size (MB) | File Type |
|-----------|-----------------|-------------------|-----------|-----------|
| /Users/.../old_video.mp4 | 2024-03-15 10:23:45 | 2024-03-10 14:30:00 | 1024.50 | .mp4 |
| /Users/.../archive.zip | 2024-02-20 09:15:30 | 2024-02-18 16:45:00 | 512.30 | .zip |
| ... | ... | ... | ... | ... |

## Example 6: Filtering Results in Excel

Once you have the report open:

1. **Find largest files:**
   - Already sorted by size (largest first)

2. **Filter by file type:**
   - Click on "File Type" column header
   - Use Excel's filter to show only .zip, .mp4, etc.

3. **Filter by date:**
   - Click on "Last Access Date" column
   - Filter to show files from specific time periods

4. **Search for specific paths:**
   - Use Ctrl+F (Cmd+F on Mac)
   - Search for "Downloads", "Desktop", etc.

## Example 7: What to Do After Getting the Report

### Step 1: Review the Report
```bash
open ~/Bob/Files-inventory/reports/file_inventory_report_*.xlsx
```

### Step 2: Identify Files to Delete
Look for:
- Large files you no longer need (videos, installers, archives)
- Old downloads
- Duplicate backups
- Temporary files

### Step 3: Safely Delete Files
```bash
# Move to trash instead of permanent deletion
mv "/path/to/old/file.zip" ~/.Trash/

# Or use Finder to move files to trash
```

### Step 4: Verify Space Freed
```bash
# Check available disk space
df -h ~
```

## Example 8: Running Regular Scans

Create a monthly reminder to run the scanner:

```bash
# Add to your calendar or crontab
# Run on the 1st of each month at 9 AM
0 9 1 * * cd ~/Bob/Files-inventory && ./run_scanner.sh
```

## Example 9: Customizing the Scan Period

Edit `file_scanner.py` to change the cutoff period:

```python
# Change from 365 days to 180 days (6 months)
cutoff_date = datetime.now() - timedelta(days=180)

# Or 730 days (2 years)
cutoff_date = datetime.now() - timedelta(days=730)
```

## Example 10: Troubleshooting

### Issue: "Permission Denied" errors
```bash
# Some files may not be accessible
# The scanner will skip them automatically
# This is normal and safe
```

### Issue: Scan takes too long
```bash
# Test on Desktop first
python3 test_scanner.py

# Or run in background
nohup ./run_scanner.sh > scan.log 2>&1 &
```

### Issue: Dependencies not installing
```bash
# Try with user flag
pip3 install --user -r requirements.txt

# Or use virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 file_scanner.py
```

## Tips for Best Results

1. **Close other applications** before scanning to improve performance
2. **Run during off-hours** if you have many files
3. **Review reports carefully** before deleting files
4. **Keep backups** of important data
5. **Run regularly** (monthly or quarterly) to maintain a clean system
6. **Start with test scan** to understand the output format
7. **Sort by size** in Excel to find the biggest space consumers first
8. **Check file types** to identify categories of files to clean up