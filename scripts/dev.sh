#!/bin/bash
echo "🚀 Starting TalkFiy in Development Mode..."
echo "📦 Starting infrastructure..."
docker-compose up -d postgres mongodb redis rabbitmq

echo "⏳ Waiting for databases to be ready (30s)..."
sleep 30

echo "🏗️ Building User Service..."
cd backend/user-service
mvn clean install -DskipTests

echo "🚀 Starting User Service..."
mvn spring-boot:run
