#!/bin/bash
echo "🧪 Testing TalkFiy API..."

echo "1️⃣ Health Check..."
curl -s http://localhost:8081/api/auth/health
echo -e "\n"

echo "2️⃣ Register User..."
curl -s -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123","displayName":"Test User"}' \
  | json_pp
echo -e "\n"

echo "3️⃣ Login..."
curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"testuser","password":"test123"}' \
  | json_pp
