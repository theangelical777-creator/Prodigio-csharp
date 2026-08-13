@echo off
rem -------------------------------------------------
rem  Copia iniciar-app.bat al folder de inicio de Windows
rem  para que el servidor arranque automáticamente al iniciar sesión.
rem -------------------------------------------------

rem Obtener la ruta del folder Startup del usuario actual
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

rem Verificar que la carpeta existe
if not exist "%STARTUP%" (
    echo ERROR: No se pudo encontrar la carpeta de inicio: "%STARTUP%"
    pause
    exit /b 1
)

rem Ruta del batch que queremos copiar (el actual directorio del proyecto)
set "SOURCE=%~dp0iniciar-app.bat"

rem Copiar el archivo
copy /Y "%SOURCE%" "%STARTUP%\iniciar-app.bat" >nul

if %errorlevel% neq 0 (
    echo ERROR: No se pudo copiar el archivo al folder de inicio.
    pause
    exit /b 1
) else (
    echo El archivo iniciar-app.bat se copió al inicio con éxito.
    echo Ahora el servidor se iniciará automáticamente al iniciar sesión.
    pause
)
