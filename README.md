```markdown:README.md```
# TableGo Business Backend

A comprehensive backend service for restaurant owners to manage their businesses through the TableGo platform. This service handles restaurant owner registration, authentication, restaurant management, menu management, and more.

## 📖 Summary
TableGo Business Backend is designed for restaurant owners to:
- Register and manage their accounts
- Add and manage their restaurants
- Handle menu items and categories
- Manage reservations and bookings
- Track customer analytics
- Handle email verifications and notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.10 or higher)
- Yarn package manager
- Docker and Docker Compose
- PostgreSQL
- Redis

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tablego-business-backend.git
cd tablego-business-backend
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start Docker services:
```bash
docker compose up -d
```

5. Run database migrations:
```bash
npx prisma generate
npx prisma migrate dev --name ['your-migration-name']
```

6. Start development server:
```bash
yarn dev
```

## 🔑 Authentication Endpoints

### 1. Register Restaurant Owner
Register a new restaurant owner account.

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John",
  "lastName": "Doe",
  "email": "restaurant.owner@example.com",
  "password": "securePassword123",
  "referralCode": "REF123"
}'
```

Response:
```json
{
  "success": true,
  "status": 201,
  "message": "Registration successful! Please check your email for verification.",
  "user": {
    "name": "John",
    "lastName": "Doe",
    "email": "restaurant.owner@example.com"
  }
}
```

### 2. Email Verification
Verify email address with received code.

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-code \
-H "Content-Type: application/json" \
-d '{
  "email": "restaurant.owner@example.com",
  "code": "123456"
}'
```

Response:
```json
{
  "success": true,
  "status": 200,
  "message": "Email verified successfully."
}
```

### 3. Resend Verification Code
Request a new verification code.

```bash
curl -X POST http://localhost:3000/api/v1/auth/resend-code \
-H "Content-Type: application/json" \
-d '{
  "email": "restaurant.owner@example.com"
}'
```

Response:
```json
{
  "success": true,
  "status": 200,
  "message": "Verification code sent successfully."
}
```
### 4. Login
Authenticate restaurant owner.

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "restaurant.owner@example.com",
  "password": "securePassword123"
}'
```

Response:
```json
{
  "success": true,
  "status": 200,
  "message": "Login successful.",
}
```

## 🛠️ Development Tools

### Database Management
- Prisma Studio: `yarn prisma studio`
- Access at: http://localhost:5555

### Redis Management
- RedisInsight: http://localhost:5540
- Credentials in .env file

## 📦 Project Structure
```
src/
├── config/          # Configuration files
├── core/            # Core infrastructure
├── routes/          # API endpoints
├── services/        # Business logic
└── utils/           # Helpers and utilities
```

## 🔒 Security Features
- Secure password hashing
- Email verification
- JWT authentication
- Rate limiting
- CORS protection

## 🚦 Error Handling
Standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## 🐳 Docker Services
```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f
```

## 📝 Environment Variables
Required environment variables in `.env`:
```example.env
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=db
POSTGRES_PORT=5432

# Database URL
DATABASE_URL="postgresql://admin:admin@postgres:5432/db?schema=public"

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=password

# SMTP
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the private License.
```

