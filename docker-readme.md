# Docker Deployment Guide

This guide explains how to run the LollyLaw Assessment application using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Quick Start

### Option 1: Automated Setup (Recommended)

**For Unix/Linux/macOS:**
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

**For Windows:**
```cmd
docker-setup.bat
```

### Option 2: Manual Setup

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
2. **Edit the .env file with your configuration:**
   ```env
   DATABASE_URL="postgresql://postgres:password@db:5432/lollylaw"
   JWT_SECRET="your-super-secret-jwt-key"
   url="http://localhost:3000"
   ```

3. **Build and start the services:**
   ```bash
   docker-compose up --build -d
   ```

4. **Run database migrations:**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   docker-compose exec app npx prisma generate
   ```

## Services

The Docker setup includes:

- **app**: Next.js application (port 3000)
- **db**: PostgreSQL database (port 5432)

## Networking

- Both services communicate through a custom bridge network called `lollylaw-network`
- The application connects to the database using the hostname `db`
- External access is available through the exposed ports

## Environment Variables

Key environment variables for Docker deployment:

| Variable | Description | Docker Value |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@db:5432/lollylaw` |
| `JWT_SECRET` | Secret for JWT tokens | (set your own) |
| `url` | Application base URL | `http://localhost:3000` |

## Useful Commands

### Development
```bash
# View logs
docker-compose logs -f

# View app logs only
docker-compose logs -f app

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Database Management
```bash
# Access database shell
docker-compose exec db psql -U postgres -d lollylaw

# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
docker-compose exec app npx prisma generate

# Reset database
docker-compose exec app npx prisma migrate reset
```

### Application Shell
```bash
# Access application container
docker-compose exec app sh

# Install packages with yarn
docker-compose exec app yarn add <package-name>
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change ports in docker-compose.yml if 3000 or 5432 are in use

2. **Database connection issues:**
   - Ensure the database service is healthy
   - Check network connectivity
   - Verify environment variables

3. **Build failures:**
   - Clear Docker cache: `docker system prune`
   - Rebuild images: `docker-compose build --no-cache`

4. **Permission issues:**
   - Ensure Docker has necessary permissions
   - Check file ownership in containers

### Logs and Debugging

```bash
# Check service status
docker-compose ps

# View all logs
docker-compose logs

# Debug specific service
docker-compose logs app
docker-compose logs db

# Access container for debugging
docker-compose exec app sh
```

## File Structure

```
├── Dockerfile              # Main application Dockerfile
├── docker-compose.yml      # Service orchestration
├── .dockerignore           # Files to exclude from build
├── .env.example            # Environment template
├── docker-setup.sh         # Unix setup script
├── docker-setup.bat        # Windows setup script
└── docker-readme.md        # This file
```
