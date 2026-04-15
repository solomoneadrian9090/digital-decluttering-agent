#!/usr/bin/env python3
"""
Test/Demo Script for File Scanner
This script demonstrates the scanner functionality on a smaller scope (Desktop only)
"""

import os
import time
from datetime import datetime, timedelta
from pathlib import Path
import sys

# Add the current directory to the path to import from file_scanner
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from file_scanner import get_file_info, is_excluded_path, scan_files, create_excel_report

def test_scanner():
    """Test the scanner on Desktop directory only."""
    print("=" * 70)
    print("FILE INVENTORY SCANNER - TEST MODE")
    print("=" * 70)
    print("This is a test run that only scans your Desktop folder.")
    print("=" * 70)
    print()
    
    # Calculate cutoff date (1 year ago)
    cutoff_date = datetime.now() - timedelta(days=365)
    
    # Get Desktop directory
    desktop_dir = os.path.join(str(Path.home()), 'Desktop')
    
    if not os.path.exists(desktop_dir):
        print(f"❌ Desktop directory not found: {desktop_dir}")
        return
    
    # Create reports directory
    reports_dir = os.path.join(os.path.dirname(__file__), 'reports')
    os.makedirs(reports_dir, exist_ok=True)
    
    # Generate report filename
    report_date = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    report_filename = f'test_report_desktop_{report_date}.xlsx'
    report_path = os.path.join(reports_dir, report_filename)
    
    print(f"Test scan starting from: {desktop_dir}")
    print(f"Looking for files not accessed since: {cutoff_date.strftime('%Y-%m-%d')}")
    print(f"Report will be saved to: {report_path}")
    print()
    
    # Scan files
    old_files = scan_files(desktop_dir, cutoff_date)
    
    # Create Excel report
    if old_files:
        create_excel_report(old_files, report_path)
        print(f"\n✓ Test report successfully created at: {report_path}")
        print("\nYou can now review this test report before running the full scan.")
    else:
        print("\n✓ No old files found on Desktop.")
        print("This is normal if you regularly use your Desktop or it's relatively clean.")
    
    print("\nTo run the full scan on your entire home directory, use:")
    print("  ./run_scanner.sh")
    print("  or")
    print("  python3 file_scanner.py")

if __name__ == '__main__':
    test_scanner()

# Made with Bob
