# Docker Deployment Guide

This guide explains how to run the LollyLaw Assessment application using Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone
   ```

2. **Navigate to the project directory:**
   ```bash
    cd lollylaw-assessment
    ```

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

1. **Clone the repository:**
   ```bash
   git clone
   ```


2. **Navigate to the project directory:**
   ```bash
    cd lollylaw-assessment
    ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
4. **Edit the .env file with your configuration:**
   ```env
   DATABASE_URL="postgresql://postgres:password@db:5432/lollylaw"
   JWT_SECRET="your-super-secret-jwt-key"
   url="http://localhost:3000"
   ```

5. **Build and start the services:**
   ```bash
   docker-compose up --build -d
   ```

6. **Run database migrations:**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   docker-compose exec app npx prisma generate
   ```

### Option 3: Manual Local Setup

0. **Ensure you have Node.js (18.x or later) and Yarn installed. If not, you can use Corepack to manage Yarn versions:**
   ```bash
   corepack enable
   corepack prepare yarn@stable --activate
   ```

1. **Clone the repository:**
   ```bash
   git clone
   ```

2. **Navigate to the project directory:**
   ```bash
   cd lollylaw-assessment
   ```

3. **Install dependencies:**
   ```bash
    yarn install
    ```
4. **Start PostgreSQL database:**
   ```bash
   docker-compose up -d db
   ```

5. **Create environment file:**
    ```bash
    cp .env.example .env
    ```

6. **Prisma setup:**
    ```bash
    npx prisma migrate deploy
    npx prisma generate
    ```

7. **Build the application:**
    ```bash
    yarn build
    ```

8. **Start the application:**
    ```bash
    yarn start
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
```

## API Documentation

The LollyLaw Assessment API provides endpoints for managing customers, matters, and authentication. All endpoints except authentication require JWT authentication via HTTP-only cookies. JWT tokens are automatically included via HTTP-only cookies after login.

### Base URL
- **Development**: `http://localhost:3000`
- **Docker**: `http://localhost:3000`

---

## Authentication Endpoints

### Sign Up
Creates a new user account.

**POST** `/api/auth/signup`

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "securepassword"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
    }
}
```

### Sign In
Authenticates a user and sets JWT cookie.

**POST** `/api/auth/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "securepassword",
    "rememberMe": false
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
    }
}
```

### Get Current User
Returns the currently authenticated user's information.

**GET** `/api/auth/me`

**Response:**
```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
}
```

### Sign Out
Logs out the current user and clears authentication cookie.

**POST** `/api/auth/logout`

**Response:**
```json
{
    "message": "Logged out successfully"
}
```

---

## Customer Endpoints

### Get All Customers
Retrieves a paginated list of customers with optional search.

**GET** `/api/customers`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name/email

**Example:** `/api/customers?page=1&limit=10&search=john`

**Response:**
```json
{
    "customers": [
        {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "phone": "123-456-7890",
            "createdAt": "2024-01-01T00:00:00.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "totalCount": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    }
}
```

### Get Customer by ID
Retrieves a specific customer by their ID.

**GET** `/api/customers/{id}`

**Response:**
```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Create Customer
Creates a new customer.

**POST** `/api/customers`

**Request Body:**
```json
{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "123-456-7890"
}
```

**Response:**
```json
{
    "id": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "123-456-7890",
    "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Customer
Updates an existing customer.

**PUT** `/api/customers/{id}`

**Request Body:**
```json
{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "987-654-3210"
}
```

**Response:**
```json
{
    "id": 2,
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "987-654-3210",
    "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Delete Customer
Deletes a customer and all associated matters.

**DELETE** `/api/customers/{id}`

**Response:**
```json
{
    "message": "Customer and 3 associated matters deleted successfully"
}
```

---

## Matter Endpoints

### Get Customer Matters
Retrieves all matters for a specific customer with pagination and search.

**GET** `/api/customers/{customerId}/matters`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 6)
- `search` (optional): Search term for title/description/status

**Example:** `/api/customers/1/matters?page=1&limit=6&search=contract`

**Response:**
```json
{
    "matters": [
        {
            "id": 1,
            "title": "Contract Review",
            "description": "Review employment contract",
            "status": "open",
            "createdAt": "2024-01-01T00:00:00.000Z",
            "customerId": 1
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 6,
        "totalCount": 1,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    }
}
```

### Get Specific Matter
Retrieves a specific matter by ID.

**GET** `/api/customers/{customerId}/matters/{matterId}`

**Response:**
```json
{
    "id": 1,
    "title": "Contract Review",
    "description": "Review employment contract",
    "status": "open",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "customerId": 1
}
```

### Create Matter
Creates a new matter for a customer.

**POST** `/api/customers/{customerId}/matters`

**Request Body:**
```json
{
    "title": "Legal Consultation",
    "description": "Initial legal consultation",
    "status": "open"
}
```

**Response:**
```json
{
    "id": 2,
    "title": "Legal Consultation",
    "description": "Initial legal consultation",
    "status": "open",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "customerId": 1
}
```

### Update Matter
Updates an existing matter.

**PUT** `/api/customers/{customerId}/matters/{matterId}`

**Request Body:**
```json
{
    "title": "Updated Matter Title",
    "status": "in-progress"
}
```

**Response:**
```json
{
    "id": 1,
    "title": "Updated Matter Title",
    "description": "Review employment contract",
    "status": "in-progress",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "customerId": 1
}
```

### Delete Matter
Deletes a specific matter.

**DELETE** `/api/customers/{customerId}/matters/{matterId}`

**Response:**
```json
{
    "message": "Matter deleted successfully"
}
```

---

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found
- **500**: Internal Server Error

## Error Response Format

```json
{
    "error": "Error message description"
}
```

## Matter Status Values

Valid status values for matters:
- `open`
- `in-progress` 
- `completed`
- `closed`


## Things I'd improve

- **Error Handling**: Implement more robust error handling and logging.
- **Testing**: Add unit and integration tests for all endpoints.
- **Logging**: Implement structured logging for better observability.
- **Rate Limiting**: Add rate limiting to prevent abuse of API endpoints.
- **Sorting**: Implement sorting options for customers and matters.
