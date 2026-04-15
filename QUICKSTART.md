# Quick Start Guide

## Running the File Inventory Scanner

### Option 1: Using the Shell Script (Easiest)
```bash
cd ~/Bob/Files-inventory
./run_scanner.sh
```

### Option 2: Manual Installation and Run
```bash
cd ~/Bob/Files-inventory

# Install dependencies
pip3 install -r requirements.txt

# Run the scanner
python3 file_scanner.py
```

## What Happens Next?

1. The scanner will start from your home directory (`/Users/adriansolomone`)
2. It will search for files not accessed in over 1 year
3. Progress updates will appear every 1000 files scanned
4. An Excel report will be generated in the `reports/` folder
5. The report filename includes the date and time it was created

## Finding Your Report

Reports are saved in:
```
~/Bob/Files-inventory/reports/file_inventory_report_YYYY-MM-DD_HH-MM-SS.xlsx
```

## What's Included in the Report?

Each row contains:
- **File path**: Full location of the file
- **Last access date**: When you last opened/accessed the file
- **Last modification date**: When the file was last changed
- **File size (in MB)**: How much space it takes up
- **File type/extension**: The file extension (e.g., .pdf, .jpg, .zip)

## Safety Features

The scanner is designed to be safe:
- ✅ Excludes system directories (`/System`, `/Library`, etc.)
- ✅ Skips critical system files
- ✅ Ignores 0 MB files
- ✅ Only scans your home directory
- ✅ Read-only operation (doesn't delete anything)

## Tips

- The scan may take 5-30 minutes depending on how many files you have
- You can safely stop the scan with Ctrl+C if needed
- The report is sorted by file size (largest files first)
- Review the report before deleting any files
- Keep backups of important data before cleaning up

## Need Help?

Check the full README.md for more details and examples.