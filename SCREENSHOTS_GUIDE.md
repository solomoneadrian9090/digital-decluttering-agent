# Screenshots Guide

This guide explains how to add screenshots to the README file for the Digital Decluttering Agent project.

## 📸 Taking Screenshots on Mac

### Method 1: Capture Entire Screen
```
Press: Cmd + Shift + 3
```
- Screenshot saved to Desktop automatically

### Method 2: Capture Selected Area (Recommended)
```
Press: Cmd + Shift + 4
```
- Cursor changes to crosshair
- Click and drag to select area
- Release to capture
- Screenshot saved to Desktop

### Method 3: Capture Specific Window
```
Press: Cmd + Shift + 4, then press Spacebar
```
- Cursor changes to camera icon
- Click on window to capture
- Screenshot saved to Desktop

## 📁 Organizing Screenshots

### 1. Move Screenshots to Project
After taking screenshots, move them to the screenshots folder:

```bash
cd ~/Bob/"Digital Decluttering agent"
mv ~/Desktop/Screenshot*.png screenshots/
```

### 2. Rename Screenshots
Give your screenshots descriptive names:

```bash
cd screenshots/
mv "Screenshot 2026-04-16 at 1.23.45 PM.png" dashboard-main.png
mv "Screenshot 2026-04-16 at 1.24.12 PM.png" file-selection.png
mv "Screenshot 2026-04-16 at 1.24.45 PM.png" filters.png
```

## 📝 Recommended Screenshots

### 1. Dashboard Main View (`dashboard-main.png`)
**What to capture:**
- Full dashboard with file list
- Show the IBM design styling
- Include the category tabs at top
- Show some files in the table

**How to take it:**
1. Launch dashboard: `./start_dashboard.sh`
2. Wait for data to load
3. Press Cmd + Shift + 4
4. Select the entire browser window content
5. Save as `dashboard-main.png`

### 2. File Selection (`file-selection.png`)
**What to capture:**
- Files with checkboxes selected
- Show the selection count
- Include "Select All" / "Deselect All" buttons
- Show the deletion buttons at bottom

**How to take it:**
1. Select several files using checkboxes
2. Press Cmd + Shift + 4
3. Capture the file list area
4. Save as `file-selection.png`

### 3. Advanced Filters (`filters.png`)
**What to capture:**
- The filter panel with options visible
- Show search bar, size filters, file type dropdown
- Include recommendation filter

**How to take it:**
1. Click on filter dropdowns to show options
2. Press Cmd + Shift + 4
3. Capture the filter area
4. Save as `filters.png`

### 4. Deletion Confirmation (`deletion-confirm.png`) - Optional
**What to capture:**
- The confirmation dialog
- Show the warning message
- Include file count

**How to take it:**
1. Select files and click "Move to Trash"
2. When dialog appears, press Cmd + Shift + 4
3. Capture the dialog
4. Save as `deletion-confirm.png`

### 5. Category Views (`category-*.png`) - Optional
**What to capture:**
- Different category tabs (Documents, Media, Archives, etc.)
- Show how files are organized by category

**How to take it:**
1. Click each category tab
2. Capture each view
3. Save as `category-documents.png`, `category-media.png`, etc.

## 🖼️ Adding Screenshots to README

### Markdown Syntax
```markdown
![Alt Text Description](screenshots/filename.png)
*Optional caption text in italics*
```

### Example
```markdown
### Dashboard Overview
![Dashboard Main View](screenshots/dashboard-main.png)
*The main dashboard showing file analysis with IBM Design Language*
```

### Current Screenshot Section in README
The README already has a Screenshots section with placeholders:

```markdown
## 📸 Screenshots

### Dashboard Overview
![Dashboard Main View](screenshots/dashboard-main.png)
*The main dashboard showing file analysis with IBM Design Language*

### File Selection & Deletion
![File Selection](screenshots/file-selection.png)
*Interactive file selection with bulk operations*

### Filtering & Search
![Advanced Filters](screenshots/filters.png)
*Advanced filtering by size, type, and recommendation*
```

## 🎨 Screenshot Best Practices

### 1. Resolution
- Use high-resolution screenshots (Retina display quality)
- Recommended: 2560x1600 or similar
- GitHub will automatically resize for display

### 2. Content
- Show real data (not empty states)
- Include enough files to demonstrate features
- Make sure text is readable
- Avoid sensitive file names or paths

### 3. Cropping
- Crop out unnecessary browser chrome
- Focus on the dashboard content
- Include enough context to understand the feature

### 4. File Size
- Keep images under 1MB each
- Use PNG format for UI screenshots
- Compress if needed: `pngquant screenshots/*.png`

### 5. Naming Convention
- Use lowercase
- Use hyphens instead of spaces
- Be descriptive: `dashboard-main.png` not `screenshot1.png`

## 🚀 Quick Workflow

### Complete Screenshot Process
```bash
# 1. Launch dashboard
cd ~/Bob/"Digital Decluttering agent"
./start_dashboard.sh

# 2. Take screenshots (Cmd + Shift + 4)
# - Capture main view
# - Select some files and capture
# - Show filters and capture

# 3. Move and rename screenshots
mv ~/Desktop/Screenshot*.png screenshots/
cd screenshots/
mv "Screenshot 2026-04-16 at 1.23.45 PM.png" dashboard-main.png
mv "Screenshot 2026-04-16 at 1.24.12 PM.png" file-selection.png
mv "Screenshot 2026-04-16 at 1.24.45 PM.png" filters.png

# 4. Verify screenshots are in place
ls -lh

# 5. Commit to git
cd ..
git add screenshots/*.png
git commit -m "Add dashboard screenshots"
git push origin main
```

## 🔍 Verifying Screenshots on GitHub

After pushing to GitHub:

1. Go to your repository
2. Navigate to the README
3. Scroll to the Screenshots section
4. Verify images display correctly
5. Check that they're not too large or too small

## 📋 Checklist

Before committing screenshots:

- [ ] Screenshots are in `screenshots/` folder
- [ ] Files are named descriptively
- [ ] Images are PNG format
- [ ] File sizes are reasonable (<1MB each)
- [ ] No sensitive information visible
- [ ] Images show actual dashboard features
- [ ] README references match actual filenames
- [ ] Screenshots display correctly locally

## 🆘 Troubleshooting

### Screenshots Not Showing on GitHub
- Check file paths are correct
- Verify files are committed and pushed
- Ensure filenames match exactly (case-sensitive)
- Check file extensions are `.png` not `.PNG`

### Images Too Large
```bash
# Install pngquant (if needed)
brew install pngquant

# Compress images
pngquant screenshots/*.png --ext .png --force
```

### Wrong Screenshot Captured
- Delete the file
- Take a new screenshot
- Rename and move to screenshots folder

---

**Need Help?**
- Check the main [README.md](README.md)
- See [DASHBOARD_GUIDE.md](DASHBOARD_GUIDE.md) for dashboard features