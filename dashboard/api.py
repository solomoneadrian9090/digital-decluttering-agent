#!/usr/bin/env python3
"""
API server for Digital Decluttering Dashboard
Handles file deletion operations with safety checks
"""

import os
import json
import shutil
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import mimetypes

class DeclutterAPIHandler(BaseHTTPRequestHandler):
    """HTTP request handler with file deletion API"""
    
    def do_GET(self):
        """Handle GET requests - serve static files"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # Default to index.html
        if path == '' or path == '/':
            path = 'index.html'
        
        # Security: prevent directory traversal
        if '..' in path:
            self.send_error(403, "Forbidden")
            return
        
        # Try to serve the file
        try:
            file_path = os.path.join(os.path.dirname(__file__), path)
            
            if os.path.isfile(file_path):
                # Determine content type
                content_type, _ = mimetypes.guess_type(file_path)
                if content_type is None:
                    content_type = 'application/octet-stream'
                
                # Read and send file
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', len(content))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "File not found")
        except Exception as e:
            self.send_error(500, f"Server error: {str(e)}")
    
    def do_POST(self):
        """Handle POST requests - API endpoints"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/delete':
            self.handle_delete()
        elif parsed_path.path == '/api/move-to-trash':
            self.handle_move_to_trash()
        else:
            self.send_error(404, "API endpoint not found")
    
    def handle_delete(self):
        """Handle file deletion requests"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            file_paths = data.get('files', [])
            
            if not file_paths:
                self.send_json_response(400, {
                    'success': False,
                    'error': 'No files specified'
                })
                return
            
            # Validate and delete files
            results = []
            for file_path in file_paths:
                result = self.delete_file(file_path)
                results.append(result)
            
            # Count successes and failures
            successes = sum(1 for r in results if r['success'])
            failures = sum(1 for r in results if not r['success'])
            
            self.send_json_response(200, {
                'success': True,
                'total': len(file_paths),
                'deleted': successes,
                'failed': failures,
                'results': results
            })
            
        except json.JSONDecodeError:
            self.send_json_response(400, {
                'success': False,
                'error': 'Invalid JSON'
            })
        except Exception as e:
            self.send_json_response(500, {
                'success': False,
                'error': str(e)
            })
    
    def handle_move_to_trash(self):
        """Handle move to trash requests (safer than permanent delete)"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            file_paths = data.get('files', [])
            
            if not file_paths:
                self.send_json_response(400, {
                    'success': False,
                    'error': 'No files specified'
                })
                return
            
            # Move files to trash
            results = []
            for file_path in file_paths:
                result = self.move_to_trash(file_path)
                results.append(result)
            
            # Count successes and failures
            successes = sum(1 for r in results if r['success'])
            failures = sum(1 for r in results if not r['success'])
            
            self.send_json_response(200, {
                'success': True,
                'total': len(file_paths),
                'moved': successes,
                'failed': failures,
                'results': results
            })
            
        except json.JSONDecodeError:
            self.send_json_response(400, {
                'success': False,
                'error': 'Invalid JSON'
            })
        except Exception as e:
            self.send_json_response(500, {
                'success': False,
                'error': str(e)
            })
    
    def delete_file(self, file_path):
        """Delete a single file with safety checks"""
        try:
            # Expand user path
            file_path = os.path.expanduser(file_path)
            
            # Safety checks
            if not os.path.exists(file_path):
                return {
                    'file': file_path,
                    'success': False,
                    'error': 'File not found'
                }
            
            # Prevent deletion of system files
            if self.is_system_file(file_path):
                return {
                    'file': file_path,
                    'success': False,
                    'error': 'Cannot delete system file'
                }
            
            # Delete file or directory
            if os.path.isfile(file_path):
                os.remove(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
            
            return {
                'file': file_path,
                'success': True,
                'message': 'Deleted successfully'
            }
            
        except PermissionError:
            return {
                'file': file_path,
                'success': False,
                'error': 'Permission denied'
            }
        except Exception as e:
            return {
                'file': file_path,
                'success': False,
                'error': str(e)
            }
    
    def move_to_trash(self, file_path):
        """Move file to macOS Trash (safer than permanent delete)"""
        try:
            # Expand user path
            file_path = os.path.expanduser(file_path)
            
            # Safety checks
            if not os.path.exists(file_path):
                return {
                    'file': file_path,
                    'success': False,
                    'error': 'File not found'
                }
            
            # Prevent deletion of system files
            if self.is_system_file(file_path):
                return {
                    'file': file_path,
                    'success': False,
                    'error': 'Cannot delete system file'
                }
            
            # Use macOS 'osascript' to move to Trash
            import subprocess
            
            # Escape file path for AppleScript
            escaped_path = file_path.replace('"', '\\"')
            
            script = f'''
            tell application "Finder"
                move POSIX file "{escaped_path}" to trash
            end tell
            '''
            
            result = subprocess.run(
                ['osascript', '-e', script],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                return {
                    'file': file_path,
                    'success': True,
                    'message': 'Moved to Trash'
                }
            else:
                return {
                    'file': file_path,
                    'success': False,
                    'error': f'Failed to move to trash: {result.stderr}'
                }
            
        except Exception as e:
            return {
                'file': file_path,
                'success': False,
                'error': str(e)
            }
    
    def is_system_file(self, file_path):
        """Check if file is a system file that shouldn't be deleted"""
        system_paths = [
            '/System',
            '/Library',
            '/bin',
            '/sbin',
            '/usr',
            '/var',
            '/private',
            '/etc',
            '/dev',
            '/Applications'
        ]
        
        # Check if file is in system directory
        for sys_path in system_paths:
            if file_path.startswith(sys_path):
                return True
        
        return False
    
    def send_json_response(self, status_code, data):
        """Send JSON response"""
        response = json.dumps(data).encode('utf-8')
        
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.log_date_time_string()}] {format % args}")


def run_server(port=8080):
    """Start the API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, DeclutterAPIHandler)
    
    print(f"🚀 Digital Decluttering Dashboard API Server")
    print(f"📡 Server running on http://localhost:{port}")
    print(f"🗑️  File deletion API enabled")
    print(f"⚠️  Use with caution - files will be moved to Trash")
    print(f"\nPress Ctrl+C to stop the server\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped")
        httpd.shutdown()


if __name__ == '__main__':
    run_server()

# Made with Bob
