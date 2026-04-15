# Interactive File Deletion Guide

## Overview

The Digital Decluttering Dashboard now supports **interactive file deletion** directly from the web interface. You can select one or multiple files and delete them safely.

## 🎯 Key Features

### 1. **File Selection**
- ✅ Select individual files with checkboxes
- ✅ Select all visible files with header checkbox
- ✅ Bulk selection controls (Select All / Deselect All)
- ✅ Visual feedback for selected files (blue highlight)

### 2. **Safe Deletion Options**

#### 🗑️ Move to Trash (Recommended)
- Files are moved to macOS Trash
- **Can be recovered** from Trash if needed
- Uses macOS Finder's native trash functionality
- Safer option for most use cases

#### ⚠️ Delete Permanently
- Files are **permanently deleted** from disk
- **Cannot be recovered** after deletion
- Requires double confirmation
- Use with extreme caution

### 3. **Safety Features**
- ✅ System file protection (prevents deletion of OS files)
- ✅ Confirmation dialogs before deletion
- ✅ Double confirmation for permanent deletion
- ✅ Detailed success/failure reporting
- ✅ Real-time dashboard updates after deletion

## 📋 How to Use

### Step 1: Start the Dashboard
```bash
cd ~/Bob/"Digital Decluttering agent"
./start_dashboard.sh
```

The dashboard will open at `http://localhost:8080`

### Step 2: Select Files

**Option A: Select Individual Files**
1. Browse through the file list
2. Check the checkbox next to files you want to delete
3. Selected files will be highlighted in blue

**Option B: Select All Visible Files**
1. Click the checkbox in the table header
2. All visible files in the current view will be selected

**Option C: Use Bulk Selection**
1. Select some files manually
2. Click "Select All" to select all visible files
3. Click "Deselect All" to clear selection

### Step 3: Delete Files

**Recommended: Move to Trash**
1. Click the orange "Move to Trash" button
2. Confirm the action in the dialog
3. Files will be moved to Trash
4. Dashboard updates automatically

**Permanent Deletion**
1. Click the red "Delete Permanently" button
2. Confirm the first warning dialog
3. Confirm the second warning dialog (double confirmation)
4. Files will be permanently deleted
5. Dashboard updates automatically

## 🔒 Safety Protections

### Protected Directories
The following system directories are **protected** and files within them cannot be deleted:
- `/System`
- `/Library`
- `/bin`, `/sbin`, `/usr`
- `/var`, `/private`, `/etc`
- `/dev`
- `/Applications`

### Confirmation System
- **Move to Trash**: Single confirmation
- **Permanent Delete**: Double confirmation required
- Clear warnings about irreversible actions

## 💡 Best Practices

### 1. **Use Filters First**
Before selecting files, use filters to narrow down:
```
- Search by filename
- Filter by file type (.zip, .pptx, etc.)
- Filter by size range
- Filter by recommendation (DELETE, ARCHIVE, etc.)
```

### 2. **Review Before Deleting**
- Check file names carefully
- Verify file locations
- Review file sizes
- Consider the recommendation tags

### 3. **Start with "Move to Trash"**
- Always use "Move to Trash" first
- Only use "Delete Permanently" if you're absolutely certain
- You can empty Trash later if needed

### 4. **Work in Batches**
- Don't select too many files at once
- Delete in smaller, manageable batches
- Review results after each batch

## 📊 Example Workflows

### Workflow 1: Clean Up Old Downloads
```
1. Click "Downloads" tab
2. Set "Min Size" to 50 MB
3. Select "File Type" → .zip
4. Review the filtered files
5. Select files to delete
6. Click "Move to Trash"
```

### Workflow 2: Remove Large Old Media
```
1. Click "Media" tab
2. Set "Min Size" to 100 MB
3. Select "Recommendation" → Delete
4. Review the files
5. Select files to delete
6. Click "Move to Trash"
```

### Workflow 3: Clean Up Duplicates
```
1. Click "All Files" tab
2. Search for "copy" or "duplicate"
3. Review the results
4. Select confirmed duplicates
5. Click "Move to Trash"
```

## 🚨 Troubleshooting

### "Permission Denied" Errors
**Problem**: Some files can't be deleted due to permissions

**Solution**:
- Check file ownership: `ls -la /path/to/file`
- You may need to change permissions first
- Some system files are intentionally protected

### Files Not Appearing in Trash
**Problem**: Files deleted but not in Trash

**Solution**:
- Check if using "Delete Permanently" instead of "Move to Trash"
- Some files may be on external drives (different trash location)
- Verify the file path was correct

### Dashboard Not Updating
**Problem**: Files still showing after deletion

**Solution**:
1. Click the "Refresh Data" button
2. Or reload the page (Cmd+R)
3. Run a new scan to update the report

## 🔧 Technical Details

### API Endpoints

**Move to Trash**
```
POST /api/move-to-trash
Body: { "files": ["/path/to/file1", "/path/to/file2"] }
```

**Permanent Delete**
```
POST /api/delete
Body: { "files": ["/path/to/file1", "/path/to/file2"] }
```

### Server Information
- **Server**: Python HTTP server with custom API
- **Port**: 8080
- **Location**: `~/Bob/Digital Decluttering agent/dashboard/api.py`

### File Operations
- **Move to Trash**: Uses macOS `osascript` with Finder
- **Delete**: Uses Python `os.remove()` and `shutil.rmtree()`
- **Safety**: Pre-deletion validation and system path checking

## ⚙️ Advanced Usage

### Stopping the Server
Press `Ctrl+C` in the terminal where the dashboard is running

### Restarting the Server
```bash
cd ~/Bob/"Digital Decluttering agent"
./start_dashboard.sh
```

### Viewing Server Logs
All API requests and responses are logged in the terminal

### Manual API Testing
```bash
# Test move to trash
curl -X POST http://localhost:8080/api/move-to-trash \
  -H "Content-Type: application/json" \
  -d '{"files": ["/path/to/test/file.txt"]}'

# Test permanent delete (use with caution!)
curl -X POST http://localhost:8080/api/delete \
  -H "Content-Type: application/json" \
  -d '{"files": ["/path/to/test/file.txt"]}'
```

## 📝 Notes

- **Backup Important Files**: Always have backups before bulk deletion
- **Test First**: Try with a few files before bulk operations
- **Review Trash**: Periodically review Trash before emptying
- **System Files**: Protected directories cannot be modified
- **Permissions**: You can only delete files you own or have permission to delete

## 🆘 Support

If you encounter issues:
1. Check the terminal for error messages
2. Verify file permissions
3. Ensure the API server is running
4. Try restarting the dashboard
5. Check the DASHBOARD_GUIDE.md for general dashboard help

---

**Made with Bob** 🤖