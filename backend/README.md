# TalkFiy Backend

## 🚀 Quick Start

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Configure Environment
```bash
cp .env.backend .env.backend.local
# Edit .env.backend.local with your API keys
```

### 3. Run User Service
```bash
cd backend/user-service
mvn clean install
mvn spring-boot:run
```

## 📡 Available Endpoints

### Health Check
```bash
GET http://localhost:8081/api/auth/health
```

### Register User
```bash
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "username": "yourname",
  "email": "your@email.com",
  "password": "password123",
  "displayName": "Your Name"
}
```

### Login
```bash
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "identifier": "yourname",
  "password": "password123"
}
```

## 🔧 Services

- **User Service**: http://localhost:8081
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **RabbitMQ**: http://localhost:15672 (talkfiy/talkfiy123)
- **Elasticsearch**: http://localhost:9200

## 📝 Default Credentials

Admin user:
- Username: admin
- Email: admin@talkfiy.com
- Password: admin123

Test user:
- Username: testuser
- Email: test@talkfiy.com
- Password: test123

## 🐛 Troubleshooting

### Database Connection Failed
```bash
docker-compose restart postgres
docker-compose logs postgres
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
```

### Clean Restart
```bash
docker-compose down -v
docker-compose up -d
```
