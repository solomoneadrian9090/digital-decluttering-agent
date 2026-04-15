#!/usr/bin/env python3
"""
Convert Excel report to JSON for dashboard
"""

import pandas as pd
import json
import os
from datetime import datetime
from pathlib import Path

def find_latest_report(reports_dir):
    """Find the most recent report file."""
    report_files = list(Path(reports_dir).glob('user_files_report_*.xlsx'))
    if not report_files:
        return None
    return max(report_files, key=lambda p: p.stat().st_mtime)

def convert_report_to_json(excel_path, output_path):
    """Convert Excel report to JSON format for dashboard."""
    try:
        # Read Excel file, skipping the first 3 header rows
        df = pd.read_excel(excel_path, skiprows=3)
        
        # Convert DataFrame to list of dictionaries
        files_data = []
        for _, row in df.iterrows():
            files_data.append({
                'file_path': str(row['file_path']),
                'last_access': row['last_access'].isoformat() if pd.notna(row['last_access']) else None,
                'last_modified': row['last_modified'].isoformat() if pd.notna(row['last_modified']) else None,
                'size_mb': float(row['size_mb']),
                'file_type': str(row['file_type'])
            })
        
        # Calculate total size
        total_size_mb = df['size_mb'].sum()
        
        # Get scan date from filename or use file modification time
        scan_date = datetime.fromtimestamp(os.path.getmtime(excel_path)).isoformat()
        
        # Create JSON structure
        report_data = {
            'scan_date': scan_date,
            'total_files': len(files_data),
            'total_size_mb': float(total_size_mb),
            'files': files_data
        }
        
        # Write JSON file
        with open(output_path, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"✓ Converted report to JSON: {output_path}")
        print(f"  Total files: {len(files_data)}")
        print(f"  Total size: {total_size_mb:.2f} MB")
        return True
        
    except Exception as e:
        print(f"❌ Error converting report: {e}")
        return False

def main():
    # Get script directory
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    
    # Paths
    reports_dir = project_dir / 'reports'
    data_dir = script_dir / 'data'
    
    # Create data directory if it doesn't exist
    data_dir.mkdir(exist_ok=True)
    
    # Find latest report
    latest_report = find_latest_report(reports_dir)
    
    if not latest_report:
        print("❌ No reports found in:", reports_dir)
        print("Run a scan first to generate a report.")
        return
    
    print(f"Found latest report: {latest_report.name}")
    
    # Convert to JSON
    output_path = data_dir / 'latest_report.json'
    success = convert_report_to_json(latest_report, output_path)
    
    if success:
        print(f"\n✓ Dashboard data ready!")
        print(f"Open the dashboard: file://{script_dir / 'index.html'}")

if __name__ == '__main__':
    main()

# Made with Bob
