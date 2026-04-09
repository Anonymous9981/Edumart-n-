#!/bin/bash
set -e

echo "🚀 EduMart Setup Script"
echo "======================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "📋 .env.local not found. Creating from .env.example..."
  cp .env.example .env.local
  echo "✅ .env.local created. Please update it with your configuration."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma Client
echo "🔧 Setting up database..."
cd apps/web
npx prisma generate
npx prisma db push

# Run seed script
echo "🌱 Seeding database..."
npx tsx ../../scripts/seed.ts

echo "✅ Setup complete!"
echo ""
echo "🎉 EduMart is ready to run!"
echo ""
echo "Next steps:"
echo "  • pnpm dev       - Start all apps in development mode"
echo "  • pnpm build     - Build all apps for production"
echo "  • pnpm test      - Run all tests"
