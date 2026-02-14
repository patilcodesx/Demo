#!/bin/bash
echo "🚀 Setting up TalkFiy Backend..."
cp .env.backend .env.backend.local
echo "✅ Created .env.backend.local - Please edit with your credentials"
docker-compose up -d
echo "✅ Docker services started!"
echo "🔍 Check status: docker-compose ps"
