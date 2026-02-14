#!/bin/bash
echo "🔨 Building TalkFiy Backend..."
cd backend
mvn clean install -DskipTests
echo "✅ Build complete!"
