#!/bin/bash

###############################################################################
# Netlify Deployment Script
#
# This script automates the deployment of the AI Adoption Survey app to Netlify
#
# Prerequisites:
# - Netlify CLI installed: npm install -g netlify-cli
# - Netlify account created
# - Database ready (Neon, Supabase, etc.)
###############################################################################

set -e  # Exit on error

echo "🚀 AI Adoption Survey - Netlify Deployment Script"
echo "=================================================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found!"
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI found"
echo ""

# Check if logged in to Netlify
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "📝 Please login to Netlify..."
    netlify login
else
    echo "✅ Already logged in to Netlify"
fi
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your production values!"
    echo "Press Enter when ready to continue..."
    read
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Validate required environment variables
echo "🔍 Validating environment variables..."
REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '   - %s\n' "${MISSING_VARS[@]}"
    echo ""
    echo "Please set these in your .env file:"
    echo "   DATABASE_URL=\"postgresql://user:pass@host/db\""
    echo "   NEXTAUTH_SECRET=\"\$(openssl rand -base64 32)\""
    echo "   NEXTAUTH_URL=\"https://your-site.netlify.app\""
    exit 1
fi

echo "✅ All required environment variables are set"
echo ""

# Initialize Netlify site if not already initialized
if [ ! -f .netlify/state.json ]; then
    echo "🌐 Initializing Netlify site..."
    netlify init
else
    echo "✅ Netlify site already initialized"
fi
echo ""

# Set environment variables in Netlify
echo "⚙️  Setting environment variables in Netlify..."
netlify env:set DATABASE_URL "$DATABASE_URL" --context production
netlify env:set NEXTAUTH_SECRET "$NEXTAUTH_SECRET" --context production
netlify env:set NEXTAUTH_URL "$NEXTAUTH_URL" --context production
netlify env:set NODE_ENV "production" --context production
netlify env:set LOG_LEVEL "info" --context production

echo "✅ Environment variables configured"
echo ""

# Run database migrations
echo "🗄️  Running database migrations..."
if command -v npx &> /dev/null; then
    echo "   Generating Prisma client..."
    npx prisma generate

    echo "   Pushing schema to database..."
    npx prisma db push

    echo "   Seeding database..."
    npm run db:seed

    echo "✅ Database migrations completed"
else
    echo "⚠️  npx not found. Please run database migrations manually:"
    echo "   npx prisma generate"
    echo "   npx prisma db push"
    echo "   npm run db:seed"
fi
echo ""

# Build the application
echo "🔨 Building application..."
npm run build
echo "✅ Build completed"
echo ""

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🎉 Your app should now be live!"
echo ""
echo "Next steps:"
echo "1. Visit your Netlify dashboard to see your site URL"
echo "2. Test the registration and login flow"
echo "3. Create a test evaluation"
echo "4. Set up a custom domain (optional)"
echo ""
echo "📚 For more information, see DEPLOYMENT.md"
