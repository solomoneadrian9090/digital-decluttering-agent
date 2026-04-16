# Screenshot Quick Reference Card

## 🚀 Fast Workflow

### 1. Take Screenshots
```
Cmd + Shift + 4  →  Drag to select area  →  Release
```

### 2. Move to Project
```bash
cd ~/Bob/"Digital Decluttering agent"
mv ~/Desktop/Screenshot*.png screenshots/
```

### 3. Rename Files
```bash
cd screenshots/
mv "Screenshot 2026-04-16 at 1.23.45 PM.png" dashboard-main.png
mv "Screenshot 2026-04-16 at 1.24.12 PM.png" file-selection.png
mv "Screenshot 2026-04-16 at 1.24.45 PM.png" filters.png
```

### 4. Commit & Push
```bash
cd ..
git add screenshots/*.png
git commit -m "Add dashboard screenshots"
git push origin main
```

## 📋 Required Screenshots

| Filename | What to Capture |
|----------|----------------|
| `dashboard-main.png` | Full dashboard with file list |
| `file-selection.png` | Selected files with checkboxes |
| `filters.png` | Filter panel with options |

## 🎯 Markdown Syntax

```markdown
![Description](screenshots/filename.png)
*Caption text*
```

## 📖 Full Guide

See [SCREENSHOTS_GUIDE.md](../SCREENSHOTS_GUIDE.md) for detailed instructions.