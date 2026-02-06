#!/bin/bash

# PostgreSQL Setup Script for dev-link
# This script helps you set up PostgreSQL using Docker

echo "🚀 Setting up PostgreSQL for dev-link..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q '^postgres-devlink$'; then
    echo "📦 Container 'postgres-devlink' already exists."
    read -p "Do you want to remove it and create a new one? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Removing existing container..."
        docker rm -f postgres-devlink
    else
        echo "✅ Starting existing container..."
        docker start postgres-devlink
        exit 0
    fi
fi

# Create and start PostgreSQL container
echo "🐘 Creating PostgreSQL container..."
docker run --name postgres-devlink \
  -e POSTGRES_PASSWORD=devlink2024 \
  -e POSTGRES_USER=devlink \
  -e POSTGRES_DB=devlink \
  -p 5432:5432 \
  -d postgres:15

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q '^postgres-devlink$'; then
    echo "✅ PostgreSQL is running!"
    echo ""
    echo "📝 Update your .env file with:"
    echo "   DATABASE_URL=\"postgresql://devlink:devlink2024@localhost:5432/devlink?schema=public\""
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Update .env with the DATABASE_URL above"
    echo "   2. Run: pnpm prisma db push"
    echo "   3. Run: pnpm dev"
    echo ""
    echo "🛠️  Useful commands:"
    echo "   Stop:    docker stop postgres-devlink"
    echo "   Start:   docker start postgres-devlink"
    echo "   Remove:  docker rm -f postgres-devlink"
    echo "   Logs:    docker logs postgres-devlink"
    echo "   Shell:   docker exec -it postgres-devlink psql -U devlink -d devlink"
else
    echo "❌ Failed to start PostgreSQL container"
    exit 1
fi
