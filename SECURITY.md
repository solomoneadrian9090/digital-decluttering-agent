# Security Analysis & Best Practices

This document provides a comprehensive security analysis of the Digital Decluttering Agent and recommendations for safe usage.

## 🔒 Security Overview

The Digital Decluttering Agent has been designed with security in mind, but like any tool that can delete files, it requires careful usage and understanding of potential risks.

## ✅ Built-in Security Features

### 1. System File Protection

**Location**: [`dashboard/api.py:269-289`](dashboard/api.py:269)

The agent prevents deletion of critical system files by blocking access to:

```python
system_paths = [
    '/System',      # macOS system files
    '/Library',     # System libraries
    '/bin',         # System binaries
    '/sbin',        # System admin binaries
    '/usr',         # Unix system resources
    '/var',         # Variable data
    '/private',     # Private system files
    '/etc',         # System configuration
    '/dev',         # Device files
    '/Applications' # Installed applications
]
```

**Protection Level**: ✅ Strong
- Prevents accidental deletion of OS files
- Blocks deletion of installed applications
- Protects system configuration

### 2. Directory Traversal Prevention

**Location**: [`dashboard/api.py:30-33`](dashboard/api.py:30)

```python
# Security: prevent directory traversal
if '..' in path:
    self.send_error(403, "Forbidden")
    return
```

**Protection Level**: ✅ Strong
- Prevents path traversal attacks (e.g., `../../etc/passwd`)
- Blocks access to files outside dashboard directory
- Returns 403 Forbidden for suspicious paths

### 3. User Directory Scanning Only

**Location**: [`file_scanner_user_only.py:18-30`](file_scanner_user_only.py:18)

The scanner only examines user content directories:
- Desktop, Documents, Downloads
- Pictures, Movies, Music
- User-created project folders

**Protection Level**: ✅ Strong
- Never scans system directories
- Focuses only on user-created content
- Excludes hidden system folders

### 4. Development Artifact Exclusion

**Location**: [`file_scanner_user_only.py:33-48`](file_scanner_user_only.py:33)

Automatically excludes:
- `.git`, `node_modules`, `__pycache__`
- `.vscode`, `.idea`, `.config`
- `venv`, `env`, `.cache`

**Protection Level**: ✅ Good
- Prevents deletion of development dependencies
- Protects version control data
- Preserves IDE configurations

### 5. Critical File Extension Protection

**Location**: [`file_scanner_user_only.py:50-54`](file_scanner_user_only.py:50)

Blocks deletion of:
- `.dylib`, `.framework`, `.kext` (system libraries)
- `.plist`, `.app` (macOS applications)
- `.bundle`, `.plugin`, `.component` (system components)

**Protection Level**: ✅ Strong
- Prevents deletion of macOS system components
- Protects application bundles
- Preserves system frameworks

## ⚠️ Security Considerations

### 1. Local Network Exposure

**Risk Level**: 🟡 Medium

**Issue**: The dashboard server runs on `localhost:8080` without authentication.

**Implications**:
- Anyone with access to your computer can use the dashboard
- If port 8080 is exposed to network, others could access it
- No password protection on file deletion operations

**Mitigation**:
```bash
# Check if port is exposed to network
lsof -i :8080

# Should show: localhost:8080 (LISTEN)
# Should NOT show: *:8080 (LISTEN)
```

**Recommendations**:
- ✅ Server binds to localhost only (not exposed to network by default)
- ✅ Only accessible from your computer
- ⚠️ Don't expose port 8080 to external networks
- ⚠️ Don't run on shared computers without supervision

### 2. No Authentication Required

**Risk Level**: 🟡 Medium

**Issue**: Dashboard has no login or password protection.

**Implications**:
- Anyone using your computer can delete files
- No audit trail of who deleted what
- No user-level permissions

**Mitigation**:
- Use macOS user account security
- Lock your computer when away
- Don't leave dashboard running unattended

**Recommendations**:
- ✅ Rely on macOS user account protection
- ✅ Use FileVault for disk encryption
- ⚠️ Don't share your user account
- ⚠️ Lock screen when leaving computer

### 3. AppleScript Injection Risk

**Risk Level**: 🟢 Low (but worth noting)

**Location**: [`dashboard/api.py:234-241`](dashboard/api.py:234)

**Issue**: File paths are inserted into AppleScript for Trash operations.

**Current Protection**:
```python
# Escape file path for AppleScript
escaped_path = file_path.replace('"', '\\"')
```

**Potential Risk**:
- Malicious file paths could theoretically inject AppleScript commands
- Example: `file"; do shell script "rm -rf /"; tell`

**Mitigation in Place**:
- ✅ Double quotes are escaped
- ✅ File paths come from trusted source (your own scans)
- ✅ System file protection prevents critical deletions

**Additional Recommendations**:
- File paths should only come from scan results
- Never manually enter file paths in dashboard
- Don't modify JSON data files manually

### 4. CORS Enabled (Wildcard)

**Risk Level**: 🟢 Low

**Location**: [`dashboard/api.py:298`](dashboard/api.py:298)

**Issue**: 
```python
self.send_header('Access-Control-Allow-Origin', '*')
```

**Implications**:
- Any website could make requests to your local server
- Only matters if server is running and browser is open

**Mitigation**:
- ✅ Server only runs when you start it
- ✅ Binds to localhost only
- ✅ No sensitive data exposed via API

**Recommendations**:
- Stop server when not using dashboard
- Don't browse untrusted websites while dashboard is running

### 5. Permanent Deletion Option

**Risk Level**: 🔴 High (by design)

**Issue**: Dashboard offers permanent file deletion (not just Trash).

**Implications**:
- Files deleted permanently cannot be recovered
- No undo operation
- Requires double confirmation

**Mitigation in Place**:
- ✅ Double confirmation required
- ✅ Clear warning messages
- ✅ "Move to Trash" is default/recommended option
- ✅ Shows file count before deletion

**Recommendations**:
- ⚠️ **Always use "Move to Trash" first**
- ⚠️ Review files carefully before deleting
- ⚠️ Keep backups of important data
- ⚠️ Test with small batches first

## 🛡️ Security Best Practices

### For Users

1. **Use Move to Trash (Not Permanent Delete)**
   ```
   ✅ Move to Trash - Files can be recovered
   ❌ Delete Permanently - No recovery possible
   ```

2. **Review Before Deleting**
   - Check file names carefully
   - Verify file locations
   - Start with small batches
   - Use filters to narrow selection

3. **Keep Backups**
   - Use Time Machine
   - Cloud backup (iCloud, Dropbox, etc.)
   - External drive backups
   - Test restore process

4. **Secure Your Computer**
   - Enable FileVault encryption
   - Use strong password
   - Lock screen when away
   - Don't share user account

5. **Stop Server When Done**
   ```bash
   # Press Ctrl+C in terminal
   # Or close terminal window
   ```

### For Developers/Advanced Users

1. **Restrict Network Access**
   ```python
   # In api.py, server binds to localhost only:
   server_address = ('', port)  # '' = localhost only
   
   # To make more restrictive:
   server_address = ('127.0.0.1', port)
   ```

2. **Add Authentication (Optional)**
   ```python
   # Example: Add basic auth to API handler
   def do_POST(self):
       auth = self.headers.get('Authorization')
       if not self.check_auth(auth):
           self.send_error(401, "Unauthorized")
           return
       # ... rest of code
   ```

3. **Improve AppleScript Escaping**
   ```python
   # More robust escaping:
   import shlex
   escaped_path = shlex.quote(file_path)
   ```

4. **Add Rate Limiting**
   ```python
   # Prevent rapid deletion requests
   from time import time
   
   class RateLimiter:
       def __init__(self, max_requests=10, window=60):
           self.max_requests = max_requests
           self.window = window
           self.requests = []
   ```

5. **Enable Logging**
   ```python
   # Log all deletion operations
   import logging
   
   logging.basicConfig(
       filename='deletions.log',
       level=logging.INFO,
       format='%(asctime)s - %(message)s'
   )
   ```

## 🔍 Security Checklist

Before using the agent:

- [ ] ✅ I have backups of important files
- [ ] ✅ I understand files can be permanently deleted
- [ ] ✅ I will use "Move to Trash" instead of permanent delete
- [ ] ✅ I will review files before deleting
- [ ] ✅ My computer is password protected
- [ ] ✅ I will stop the server when done
- [ ] ✅ I won't expose port 8080 to network
- [ ] ✅ I won't run on shared/public computers

## 🚨 What to Do If Something Goes Wrong

### Accidentally Deleted Files

1. **If used "Move to Trash"**:
   ```bash
   # Open Trash
   open ~/.Trash
   
   # Restore files by dragging back
   ```

2. **If used "Permanent Delete"**:
   - Check Time Machine backups
   - Check cloud backups (iCloud, Dropbox)
   - Use data recovery software (TestDisk, PhotoRec)
   - Contact professional data recovery service

### Server Won't Stop

```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>

# Or kill all Python API servers
pkill -f "python3 api.py"
```

### Suspicious Activity

```bash
# Check what's running on port 8080
lsof -i :8080

# Check recent file modifications
find ~ -type f -mtime -1

# Review system logs
log show --predicate 'process == "python3"' --last 1h
```

## 📊 Risk Assessment Summary

| Risk | Level | Mitigation | Status |
|------|-------|------------|--------|
| System file deletion | 🔴 Critical | System path blocking | ✅ Protected |
| Accidental deletion | 🟡 Medium | Confirmation dialogs | ✅ Protected |
| Network exposure | 🟡 Medium | Localhost binding | ✅ Protected |
| No authentication | 🟡 Medium | OS-level security | ⚠️ User responsibility |
| AppleScript injection | 🟢 Low | Path escaping | ✅ Protected |
| CORS wildcard | 🟢 Low | Localhost only | ✅ Acceptable |

## 🔐 Privacy & Data Handling

### What Data is Collected?

**None.** The agent:
- ✅ Runs entirely on your local machine
- ✅ No data sent to external servers
- ✅ No analytics or tracking
- ✅ No internet connection required
- ✅ All reports stored locally

### Where is Data Stored?

- **Scan reports**: `reports/` folder (Excel files)
- **Dashboard cache**: `dashboard/data/` folder (JSON)
- **No cloud storage**: Everything stays on your Mac

### Can Others Access My Data?

**No**, unless:
- They have physical access to your computer
- They have your user account password
- You share the files manually

## 📝 Compliance & Legal

### GDPR Compliance

The agent is GDPR-compliant because:
- No personal data is transmitted
- All data stays on user's device
- No third-party data sharing
- User has full control over data

### Data Retention

- Reports are kept indefinitely (user's choice)
- User can delete reports anytime
- No automatic data deletion
- No data sent to external parties

## 🔄 Updates & Patches

### Checking for Updates

```bash
cd ~/Bob/"Digital Decluttering agent"
git pull origin main
```

### Security Updates

- Monitor GitHub repository for security patches
- Review CHANGELOG for security fixes
- Update dependencies regularly:
  ```bash
  pip3 install --upgrade pandas openpyxl
  ```

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Email: [Your contact email]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 📚 Additional Resources

- [macOS Security Guide](https://support.apple.com/guide/security/welcome/web)
- [Python Security Best Practices](https://python.readthedocs.io/en/stable/library/security_warnings.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Last Updated**: 2026-04-17  
**Version**: 1.0  
**Security Review**: Completed

**Remember**: The best security is careful usage and good backups! 🔒