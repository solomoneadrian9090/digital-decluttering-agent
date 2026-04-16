# Custom Icon Guide

## 🎨 How to Add a Custom Icon to Your Dashboard Launcher

Follow these steps to give your Digital Decluttering Agent a custom icon!

---

## 📋 Quick Steps

### 1. Prepare Your Icon Image

**Requirements:**
- Format: PNG (recommended) or JPG
- Size: 512x512 or 1024x1024 pixels (square)
- Name: `icon.png`

**Where to get icons:**
- Create your own in design software
- Use free icon sites (flaticon.com, icons8.com)
- Generate with AI (DALL-E, Midjourney)
- Use emoji as icon (see method below)

### 2. Add Icon to Project

Place your `icon.png` file in the project directory:
```
~/Bob/Digital Decluttering agent/icon.png
```

### 3. Apply the Icon

Run the icon setter script:
```bash
cd ~/Bob/"Digital Decluttering agent"
./set_custom_icon.sh
```

### 4. Update Desktop Shortcut (if created)

If you already created a desktop shortcut, update it:
```bash
./create_desktop_shortcut.sh
```

---

## 🎨 Icon Ideas

### Option 1: Broom/Cleaning Theme
- 🧹 Broom icon (cleaning/decluttering)
- 🗑️ Trash bin icon
- ✨ Sparkles (clean/organized)

### Option 2: File/Folder Theme
- 📁 Folder with magnifying glass
- 📊 Chart/analytics icon
- 🔍 Search/scan icon

### Option 3: IBM Theme
- IBM logo with cleaning elements
- Blue/white color scheme
- Professional corporate style

---

## 🖼️ Creating an Icon from Emoji (Easy Method)

If you don't have a custom icon, you can create one from an emoji:

### Using Preview (macOS)

1. **Open TextEdit**
   - Type a large emoji (🧹 or 📊 or 🗑️)
   - Select the emoji and increase font size to 500+

2. **Take Screenshot**
   - Press `Cmd + Shift + 4`
   - Drag to capture just the emoji
   - Screenshot saves to Desktop

3. **Convert to PNG**
   - Open screenshot in Preview
   - File → Export
   - Format: PNG
   - Name: `icon.png`
   - Save to: `~/Bob/Digital Decluttering agent/`

4. **Apply Icon**
   ```bash
   cd ~/Bob/"Digital Decluttering agent"
   ./set_custom_icon.sh
   ```

---

## 🎯 Recommended Emojis

- 🧹 Broom (cleaning)
- 🗑️ Wastebasket (deletion)
- 📊 Chart (analytics)
- 🔍 Magnifying glass (search)
- ✨ Sparkles (clean)
- 📁 Folder (files)
- 🧼 Soap (cleaning)
- 💾 Floppy disk (storage)

---

## 🛠️ Advanced: Custom Design

### Using Design Software

**Figma (Free, Web-based):**
1. Create 1024x1024 canvas
2. Design your icon
3. Export as PNG
4. Name it `icon.png`
5. Place in project directory

**Canva (Free):**
1. Create custom size: 1024x1024
2. Design icon with elements
3. Download as PNG
4. Follow steps above

**Adobe Illustrator/Photoshop:**
1. Create 1024x1024 document
2. Design icon
3. Export as PNG
4. Follow steps above

---

## 🔧 Troubleshooting

### Icon Not Showing?

1. **Check file name**: Must be exactly `icon.png`
2. **Check location**: Must be in project root directory
3. **Check format**: PNG works best
4. **Refresh Finder**: Press `Cmd + R` or restart Finder
5. **Re-run script**: Try running `./set_custom_icon.sh` again

### Icon Looks Blurry?

- Use higher resolution (1024x1024 minimum)
- Ensure image is square
- Use PNG format for best quality

### Permission Errors?

```bash
chmod +x ~/Bob/"Digital Decluttering agent"/set_custom_icon.sh
```

---

## 📝 Example Workflow

```bash
# 1. Navigate to project
cd ~/Bob/"Digital Decluttering agent"

# 2. Add your icon.png file here
# (use Finder to drag and drop)

# 3. Apply the icon
./set_custom_icon.sh

# 4. Update desktop shortcut (if exists)
./create_desktop_shortcut.sh

# 5. Done! Your launcher now has a custom icon
```

---

## 🎨 Sample Icon Resources

**Free Icon Sites:**
- [Flaticon](https://www.flaticon.com) - Search "cleaning" or "files"
- [Icons8](https://icons8.com) - Free icons with attribution
- [Noun Project](https://thenounproject.com) - Simple, clean icons
- [Iconmonstr](https://iconmonstr.com) - Free simple icons

**AI Generation:**
- ChatGPT/DALL-E: "Create a simple icon for a file cleaning app"
- Midjourney: "minimalist broom icon, flat design, blue and white"

---

## 💡 Tips

- **Keep it simple**: Simple icons look better at small sizes
- **Use contrast**: Make sure icon is visible on light/dark backgrounds
- **Test it**: Check how it looks at different sizes
- **Match theme**: Consider IBM's blue color scheme (#0f62fe)

---

## 🎊 Enjoy Your Custom Icon!

Your Digital Decluttering Agent will now have a unique, personalized look!