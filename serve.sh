#!/bin/sh
cd "$(dirname "$0")"
echo "Sandu → http://localhost:8766  (Ctrl+C to stop)"
exec ruby -run -e httpd . -p 8766
