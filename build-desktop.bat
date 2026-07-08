@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set "NPM_CONFIG_REGISTRY=https://registry.npmjs.org/"
set "npm_config_fetch_retries=5"
set "npm_config_fetch_retry_mintimeout=20000"
set "npm_config_fetch_retry_maxtimeout=120000"
set "npm_config_fetch_timeout=300000"

echo ================================================
echo   WEATHER NOW - TAO BO CAI WINDOWS
echo ================================================
echo.
echo Registry: %NPM_CONFIG_REGISTRY%
echo.

where node >nul 2>nul || goto no_node
where npm >nul 2>nul || goto no_node

echo [0/3] Don dep cu...
if exist node_modules (
  rmdir /s /q node_modules 2>nul
  if exist node_modules (
    echo Khong xoa duoc node_modules. Hay dong VS Code, CMD khac va ung dung WeatherNow, sau do chay lai file nay bang Run as administrator.
    goto error
  )
)
if exist package-lock.json del /f /q package-lock.json >nul 2>nul
if exist .next rmdir /s /q .next >nul 2>nul
if exist dist rmdir /s /q dist >nul 2>nul

call npm cache verify
if errorlevel 1 goto error

echo.
echo [1/3] Cai thu vien tu npm chinh thuc...
call npm install --registry=https://registry.npmjs.org/ --no-audit --no-fund
if errorlevel 1 goto error

echo.
echo [2/3] Build website...
call npm run build
if errorlevel 1 goto error

echo.
echo [3/3] Tao file cai dat .exe...
call npm run desktop:win
if errorlevel 1 goto error

echo.
echo HOAN TAT! Mo thu muc dist de lay file WeatherNow-Setup-1.0.0.exe.
pause
exit /b 0

:no_node
echo Khong tim thay Node.js hoac npm. Hay cai Node.js 22 LTS, dong CMD va mo lai.
goto error

:error
echo.
echo CO LOI XAY RA. Kiem tra thong bao phia tren.
pause
exit /b 1
