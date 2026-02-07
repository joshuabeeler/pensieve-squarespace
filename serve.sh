#!/usr/bin/env bash
set -euo pipefail

# Simple local dev server for static files with no-cache headers
python3 - <<'PY'
import http.server
import socketserver

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

with socketserver.TCPServer(("", 8000), NoCacheHandler) as httpd:
    print("Serving at http://localhost:8000")
    httpd.serve_forever()
PY
