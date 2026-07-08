@echo off
cd /d %~dp0
if not exist node_modules (
  echo Dang cai thu vien...
  call npm install
)
echo Khoi dong website tai http://localhost:3000
call npm run dev
pause
