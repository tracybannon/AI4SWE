#!/bin/bash

###############################################################################
# Environment Setup Script
#
# This script helps you generate secure environment variables
# for the AI Adoption Survey application
###############################################################################

echo "🔐 AI Adoption Survey - Environment Setup"
echo "=========================================="
echo ""

# Function to generate random secret
generate_secret() {
    openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
}

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled. Your existing .env file was not modified."
        exit 0
    fi
fi

echo "📝 Let's set up your environment variables..."
echo ""

# Database URL
echo "1️⃣  Database Configuration"
echo "   Which database provider are you using?"
echo "   1) Neon (Recommended)"
echo "   2) Supabase"
echo "   3) Railway"
echo "   4) ElephantSQL"
echo "   5) Other/Custom"
echo ""
read -p "   Enter choice (1-5): " db_choice

case $db_choice in
    1)
        echo ""
        echo "   ℹ️  Neon Setup:"
        echo "   1. Go to https://neon.tech"
        echo "   2. Create a new project"
        echo "   3. Copy the connection string"
        echo ""
        ;;
    2)
        echo ""
        echo "   ℹ️  Supabase Setup:"
        echo "   1. Go to https://supabase.com"
        echo "   2. Create a new project"
        echo "   3. Go to Settings → Database"
        echo "   4. Copy the connection string (URI format)"
        echo ""
        ;;
    3)
        echo ""
        echo "   ℹ️  Railway Setup:"
        echo "   1. Go to https://railway.app"
        echo "   2. Create new project → Add PostgreSQL"
        echo "   3. Copy the connection string from the PostgreSQL service"
        echo ""
        ;;
    4)
        echo ""
        echo "   ℹ️  ElephantSQL Setup:"
        echo "   1. Go to https://elephantsql.com"
        echo "   2. Create a new instance (Tiny Turtle is free)"
        echo "   3. Copy the URL from the instance details"
        echo ""
        ;;
esac

read -p "   Paste your DATABASE_URL: " DATABASE_URL

# NextAuth Secret
echo ""
echo "2️⃣  Authentication Secret"
echo "   Generating secure NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(generate_secret)
echo "   ✅ Generated: ${NEXTAUTH_SECRET:0:20}..."

# NextAuth URL
echo ""
echo "3️⃣  Application URL"
echo "   What is your application URL?"
echo "   - For local development: http://localhost:3000"
echo "   - For Netlify: https://your-site.netlify.app"
echo "   - For custom domain: https://yourdomain.com"
echo ""
read -p "   Enter NEXTAUTH_URL: " NEXTAUTH_URL

# Node Environment
echo ""
echo "4️⃣  Environment"
echo "   1) development (local)"
echo "   2) production (deployed)"
echo ""
read -p "   Enter choice (1-2): " env_choice

if [ "$env_choice" = "2" ]; then
    NODE_ENV="production"
    LOG_LEVEL="info"
else
    NODE_ENV="development"
    LOG_LEVEL="debug"
fi

# Write .env file
cat > .env << EOF
# Database Configuration
DATABASE_URL="$DATABASE_URL"

# NextAuth Configuration
NEXTAUTH_URL="$NEXTAUTH_URL"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

# Application Settings
NODE_ENV="$NODE_ENV"
LOG_LEVEL="$LOG_LEVEL"

# Generated on: $(date)
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "📋 Your configuration:"
echo "   DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "   NEXTAUTH_URL: $NEXTAUTH_URL"
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "   NODE_ENV: $NODE_ENV"
echo "   LOG_LEVEL: $LOG_LEVEL"
echo ""

# Additional setup for production
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Production Environment Detected"
    echo ""
    echo "Next steps for Netlify deployment:"
    echo ""
    echo "1. Go to your Netlify site settings"
    echo "2. Navigate to: Site settings → Environment variables"
    echo "3. Add these variables:"
    echo ""
    echo "   DATABASE_URL=$DATABASE_URL"
    echo "   NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo "   NEXTAUTH_URL=$NEXTAUTH_URL"
    echo "   NODE_ENV=production"
    echo "   LOG_LEVEL=info"
    echo ""
    echo "4. Trigger a new deploy"
    echo ""
fi

# Database setup
echo "🗄️  Database Setup"
echo ""
read -p "Do you want to initialize the database now? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📦 Generating Prisma client..."
    npx prisma generate

    echo ""
    echo "🔨 Pushing schema to database..."
    npx prisma db push

    echo ""
    echo "🌱 Seeding database with initial questions..."
    npm run db:seed

    echo ""
    echo "✅ Database setup completed!"
else
    echo ""
    echo "⏭️  Skipped database setup."
    echo "   Run these commands when ready:"
    echo "   npx prisma generate"
    echo "   npx prisma db push"
    echo "   npm run db:seed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "   npm run dev"
echo ""
echo "To deploy to Netlify:"
echo "   ./deploy-netlify.sh"
echo ""
echo "For more information, see:"
echo "   - QUICKSTART.md"
echo "   - NETLIFY_DEPLOY.md"
echo "   - DEPLOYMENT.md"
echo ""
