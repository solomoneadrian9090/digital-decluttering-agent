# Scanner Comparison Guide

## Two Scanner Versions Available

### 1. Full System Scanner (`file_scanner.py`)
**Run with:** `./run_scanner.sh`

**What it scans:**
- Your entire home directory (`/Users/adriansolomone`)
- All files and folders except system-critical directories

**Excludes:**
- System directories: `/System`, `/Library`, `/usr`, `/Applications`, etc.
- Critical system files: `.dylib`, `.framework`, `.kext`, `.app`, etc.
- Hidden system files in root

**Best for:**
- Complete disk space analysis
- Finding all old files across your entire system
- Comprehensive cleanup

**Report filename:** `file_inventory_report_YYYY-MM-DD_HH-MM-SS.xlsx`

---

### 2. User Files Only Scanner (`file_scanner_user_only.py`) ⭐ RECOMMENDED
**Run with:** `./run_user_scanner.sh`

**What it scans:**
Only these user content directories:
- ✅ Desktop
- ✅ Documents
- ✅ Downloads
- ✅ Pictures
- ✅ Movies
- ✅ Music
- ✅ Projects
- ✅ Development
- ✅ Code
- ✅ Work
- ✅ Bob

**Excludes:**
- System directories (completely skipped)
- Hidden config folders: `.cache`, `.npm`, `.vscode`, `.config`
- Development artifacts: `node_modules`, `__pycache__`, `.git`, `venv`
- User Library folder
- Trash folder

**Best for:**
- Finding YOUR old files (documents, downloads, media)
- Faster scanning (only user directories)
- Avoiding system files completely
- Safer cleanup recommendations

**Report filename:** `user_files_report_YYYY-MM-DD_HH-MM-SS.xlsx`

---

## Quick Comparison

| Feature | Full System Scanner | User Files Only Scanner |
|---------|-------------------|------------------------|
| **Scan Speed** | Slower (entire home) | Faster (selected dirs) |
| **Files Found** | More files | Fewer, more relevant files |
| **System Files** | Excluded but checked | Never scanned |
| **Safety** | Safe | Very Safe |
| **Best For** | Complete analysis | Your personal files |
| **Recommended** | Advanced users | Most users ⭐ |

---

## Which Should You Use?

### Use **User Files Only Scanner** if:
- ✅ You want to find YOUR old files (documents, downloads, photos)
- ✅ You want faster results
- ✅ You want to avoid any system files
- ✅ You're cleaning up personal content
- ✅ You're not sure which to use (this is the safer choice)

### Use **Full System Scanner** if:
- ✅ You need a complete disk space analysis
- ✅ You want to find ALL old files
- ✅ You're comfortable reviewing system-adjacent files
- ✅ You need maximum coverage

---

## How to Switch Between Scanners

### Run User Files Only Scanner (Recommended):
```bash
cd ~/Bob/Files-inventory
./run_user_scanner.sh
```

### Run Full System Scanner:
```bash
cd ~/Bob/Files-inventory
./run_scanner.sh
```

### Test on Desktop Only:
```bash
cd ~/Bob/Files-inventory
python3 test_scanner.py
```

---

## Example Output Differences

### User Files Only Scanner:
```
Scanning user directories in: /Users/adriansolomone
Looking for files not accessed since: 2025-04-15

User directories to scan:
  ✓ Desktop
  ✓ Documents
  ✓ Downloads
  ✓ Pictures
  ✗ Movies (not found)
  ✓ Music
  ✗ Projects (not found)
  ✓ Bob

Scanning 6 directories...

Scanning Desktop...
  Scanned 500 files, found 23 old files...
Scanning Documents...
  Scanned 1000 files, found 67 old files...
...

Scan complete! Scanned 3,245 files.
Found 156 files not accessed in over 1 year.
```

### Full System Scanner:
```
Starting scan from: /Users/adriansolomone
Looking for files not accessed since: 2025-04-15
This may take a while...

Scanned 1000 files, found 45 old files...
Scanned 2000 files, found 89 old files...
Scanned 3000 files, found 134 old files...
...

Scan complete! Scanned 15,432 files.
Found 567 files not accessed in over 1 year.
```

---

## Recommendation

**For most users, we recommend starting with the User Files Only Scanner** (`./run_user_scanner.sh`). It's:
- Faster
- More focused on your actual files
- Safer (avoids system areas completely)
- Easier to review the results

You can always run the full system scanner later if needed.