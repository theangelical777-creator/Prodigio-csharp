@echo off
echo ========================================
echo   Iniciando ProdigioApp...
echo   URL: http://localhost:5136
echo ========================================
if exist "%~dp0ProdigioApp.csproj" (
    cd /d "%~dp0"
) else (
    cd /d "%~dp0.."
    if not exist "ProdigioApp.csproj" (
        cd /d "C:\Users\SERRANO\.gemini\antigravity\scratch\prodigio-csharp"
    )
)
dotnet run --launch-profile http
pause

