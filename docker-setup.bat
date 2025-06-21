@echo off
REM Docker Setup Script for LollyLaw Assessment (Windows)

echo 🐳 Setting up LollyLaw Application with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create .env file from example if it doesn't exist
if not exist ".env" (
    echo 📄 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please review and update the environment variables.
)

REM Build and start the services
echo 🔨 Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo 📋 Migrations will run automatically when the app starts...
echo ⏳ Waiting for application to be ready...
timeout /t 5 /nobreak >nul

echo ✅ Setup complete!
echo.
echo 🌐 Application is running at: http://localhost:3000
echo 🗄️  Database is running at: localhost:5432
echo.
echo 📋 Useful commands:
echo   - View logs: docker-compose logs -f
echo   - Stop services: docker-compose down
echo   - Restart services: docker-compose restart
echo   - Access app container: docker-compose exec app sh
echo   - Access database: docker-compose exec db psql -U postgres -d lollylaw

pause
