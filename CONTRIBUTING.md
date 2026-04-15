# Contributing to Digital Decluttering Agent

Thank you for your interest in contributing to the Digital Decluttering Agent! This guide will help you get started.

## 🎯 For IBM Employees

This project is designed for IBM employees to help manage disk space and maintain clean file systems. We welcome contributions from all IBMers!

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- macOS (currently optimized for macOS)
- Basic knowledge of Python and web development

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/IBM/digital-decluttering-agent.git
   cd digital-decluttering-agent
   ```

2. **Install dependencies**
   ```bash
   pip3 install pandas openpyxl
   ```

3. **Make scripts executable**
   ```bash
   chmod +x "Digital Decluttering agent"
   chmod +x start_dashboard.sh
   chmod +x run_scheduled_scan.sh
   ```

4. **Run a test scan**
   ```bash
   ./"Digital Decluttering agent"
   ```

5. **Launch the dashboard**
   ```bash
   ./start_dashboard.sh
   ```

## 📝 How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in [GitHub Issues](https://github.com/IBM/digital-decluttering-agent/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (macOS version, Python version)
   - Screenshots if applicable

### Submitting Changes

1. **Fork the repository**
   - Click "Fork" on GitHub
   - Clone your fork locally

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Run the scanner
   - Test the dashboard
   - Verify deletion functionality works

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes clearly

## 🎨 Code Style Guidelines

### Python
- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions
- Keep functions focused and small

### JavaScript
- Use ES6+ features
- Follow IBM Carbon design patterns
- Add comments for complex logic
- Keep functions pure when possible

### HTML/CSS
- Follow IBM Design Language
- Use semantic HTML
- Keep CSS organized by component
- Maintain responsive design

## 🧪 Testing

Before submitting:
- [ ] Scanner runs without errors
- [ ] Dashboard loads correctly
- [ ] File selection works
- [ ] Deletion (Move to Trash) works
- [ ] All filters function properly
- [ ] No console errors in browser

## 📚 Documentation

When adding features:
- Update README.md if needed
- Update relevant guide files
- Add inline code comments
- Include usage examples

## 🔒 Security

- Never commit sensitive data
- Don't include personal file paths in examples
- Test deletion features carefully
- Report security issues privately

## 💡 Feature Ideas

We're looking for contributions in:
- **Cross-platform support** (Windows, Linux)
- **Additional file categories**
- **Smart recommendations** (ML-based)
- **Cloud storage integration**
- **Duplicate file detection**
- **File preview in dashboard**
- **Batch operations improvements**
- **Performance optimizations**
- **Internationalization (i18n)**

## 📞 Getting Help

- **Slack**: #digital-decluttering (IBM internal)
- **Email**: digital-decluttering@ibm.com
- **GitHub Issues**: For bugs and features

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in IBM internal channels

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Follow IBM's Code of Conduct

## 🎉 Thank You!

Every contribution, no matter how small, helps make this tool better for all IBMers. Thank you for your time and effort!

---

**Made with ❤️ by IBM employees, for IBM employees**