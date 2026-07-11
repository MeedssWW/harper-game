@echo off
setlocal
cd /d "%~dp0"

set "PYTHON=C:\Users\samk1\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if not exist "%PYTHON%" set "PYTHON=python"

start "HARPER local server" /min "%PYTHON%" -m http.server 8765 --bind 127.0.0.1
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:8765/"

endlocal
