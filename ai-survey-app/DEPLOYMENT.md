# Deployment Guide

This guide covers deploying the AI Adoption Survey application to various platforms, with a focus on Netlify deployment.

## Table of Contents

1. [Netlify Deployment](#netlify-deployment) (Recommended)
2. [Vercel Deployment](#vercel-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Self-Hosted Deployment](#self-hosted-deployment)

---

## Netlify Deployment

Netlify is a great platform for deploying Next.js applications with built-in CI/CD, serverless functions, and edge computing.

### Prerequisites

- Netlify account ([Sign up for free](https://app.netlify.com/signup))
- PostgreSQL database (see [Database Setup](#database-setup))
- GitHub/GitLab/Bitbucket repository

### Step 1: Set Up Database

Netlify doesn't provide database hosting, so you need to use an external PostgreSQL service.

#### Recommended Database Providers

**Option A: Neon (Recommended)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (format: `postgresql://user:password@host/database`)
4. Neon offers a generous free tier with serverless PostgreSQL

**Option B: Supabase**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Free tier includes 500MB database

**Option C: Railway**
1. Sign up at [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the connection string from the PostgreSQL service
4. $5/month credit included free

**Option D: ElephantSQL**
1. Sign up at [elephantsql.com](https://elephantsql.com)
2. Create a new instance (Tiny Turtle is free)
3. Copy the URL from the instance details
4. Free tier: 20MB storage

### Step 2: Deploy to Netlify

#### Via Netlify UI (Easiest)

1. **Connect Repository**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `.netlify/functions`
   - These are already configured in `netlify.toml`

3. **Set Environment Variables**

   Go to Site settings → Environment variables and add:

   ```env
   DATABASE_URL=postgresql://user:password@host/database
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=https://your-site-name.netlify.app
   NODE_ENV=production
   LOG_LEVEL=info
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your app
   - Future commits will trigger automatic deployments

#### Via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```
   - Follow prompts to create new site or link existing
   - Choose build command: `npm run build`
   - Choose publish directory: `.next`

4. **Set Environment Variables**
   ```bash
   netlify env:set DATABASE_URL "postgresql://user:password@host/database"
   netlify env:set NEXTAUTH_SECRET "your-secret-here"
   netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"
   netlify env:set NODE_ENV "production"
   netlify env:set LOG_LEVEL "info"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Step 3: Initialize Database

After deployment, initialize your database:

1. **Local Setup First**
   ```bash
   # Set your production DATABASE_URL temporarily
   export DATABASE_URL="your-production-database-url"

   # Generate Prisma client
   npm run db:generate

   # Push schema to production database
   npm run db:push

   # Seed initial questions
   npm run db:seed
   ```

2. **Alternative: Use Netlify CLI**
   ```bash
   # Run commands in Netlify environment
   netlify env:import .env.production
   netlify dev
   # Then run db commands
   ```

### Step 4: Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to use custom domain
5. Redeploy for changes to take effect

### Step 5: Test Deployment

1. Visit your Netlify site URL
2. Register a new account
3. Create an evaluation
4. Verify all functionality works

### Troubleshooting Netlify Deployment

**Build Fails**
- Check build logs in Netlify dashboard
- Verify all environment variables are set
- Ensure `netlify.toml` is in repository root

**Database Connection Errors**
- Verify `DATABASE_URL` is correct
- Check database allows connections from Netlify IPs (usually all IPs: `0.0.0.0/0`)
- Ensure SSL is enabled for database connection

**Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your site URL (including https://)
- Check that cookies are enabled

**Function Timeouts**
- Netlify functions have 10-second timeout on free tier
- Optimize slow database queries
- Consider upgrading to Pro for 26-second timeout

---

## Vercel Deployment

Vercel is the creator of Next.js and offers excellent Next.js support.

### Quick Deploy

1. **Via Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (same as Netlify)
   - Deploy

2. **Via Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   # Follow prompts
   ```

### Environment Variables for Vercel

Set these in Project Settings → Environment Variables:

```env
DATABASE_URL=postgresql://user:password@host/database
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
LOG_LEVEL=info
```

### Database Options for Vercel

- **Vercel Postgres** (Recommended for Vercel): Built-in PostgreSQL
- **Neon**: Serverless PostgreSQL
- **PlanetScale**: MySQL (requires schema changes)
- **Supabase**: PostgreSQL with extras

---

## Docker Deployment

Deploy using Docker to any container platform (AWS ECS, Google Cloud Run, DigitalOcean, etc.)

### Using Docker Compose (Local/VPS)

1. **Update docker-compose.yml**

   Edit database password and secrets in `docker-compose.yml`:
   ```yaml
   POSTGRES_PASSWORD: your-secure-password
   NEXTAUTH_SECRET: your-secure-secret
   ```

2. **Deploy**
   ```bash
   docker-compose up -d
   ```

3. **Initialize Database**
   ```bash
   docker-compose exec app npx prisma db push
   docker-compose exec app npx prisma db seed
   ```

### Using Docker Only

1. **Build Image**
   ```bash
   docker build -t ai-survey-app .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
     -e NEXTAUTH_SECRET="your-secret" \
     -e NEXTAUTH_URL="https://yourdomain.com" \
     -e NODE_ENV="production" \
     ai-survey-app
   ```

### Deploy to Cloud Platforms

**AWS ECS/Fargate**
- Push image to ECR
- Create ECS task definition
- Configure RDS PostgreSQL
- Deploy service

**Google Cloud Run**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-survey-app
gcloud run deploy --image gcr.io/PROJECT_ID/ai-survey-app
```

**DigitalOcean App Platform**
- Connect GitHub repository
- Configure Dockerfile build
- Add managed PostgreSQL database
- Deploy

**Azure Container Apps**
```bash
az containerapp create \
  --name ai-survey-app \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/ai-survey-app:latest
```

---

## Self-Hosted Deployment

Deploy on your own server (VPS, dedicated server, etc.)

### Prerequisites

- Ubuntu 22.04 LTS (or similar)
- Node.js 18+
- PostgreSQL 14+
- Nginx (reverse proxy)
- PM2 (process manager)

### Installation Steps

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Set Up PostgreSQL**
   ```bash
   sudo -u postgres psql

   CREATE DATABASE ai_survey;
   CREATE USER ai_survey_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ai_survey TO ai_survey_user;
   \q
   ```

3. **Clone and Configure App**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/ai-survey-app.git
   cd ai-survey-app

   # Install dependencies
   npm install --legacy-peer-deps

   # Create environment file
   cat > .env << EOF
   DATABASE_URL="postgresql://ai_survey_user:secure_password@localhost:5432/ai_survey"
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   NEXTAUTH_URL="https://yourdomain.com"
   NODE_ENV="production"
   LOG_LEVEL="info"
   EOF

   # Build application
   npm run build

   # Initialize database
   npm run db:push
   npm run db:seed
   ```

4. **Configure PM2**
   ```bash
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'ai-survey-app',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   EOF

   # Start app with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/ai-survey-app
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-survey-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Install SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Database Setup

### PostgreSQL Connection Strings

Format: `postgresql://[user]:[password]@[host]:[port]/[database]?[parameters]`

Examples:
```bash
# Local development
DATABASE_URL="postgresql://user:pass@localhost:5432/ai_survey"

# With SSL (production)
DATABASE_URL="postgresql://user:pass@host.com:5432/db?sslmode=require"

# Neon
DATABASE_URL="postgresql://user:pass@ep-name.region.neon.tech/dbname?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.project.supabase.co:5432/postgres"
```

### Database Migrations

For production, use Prisma migrations:

```bash
# Create migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

---

## Post-Deployment Checklist

- [ ] Database is initialized with seed data
- [ ] All environment variables are set
- [ ] HTTPS/SSL is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] Can register new user
- [ ] Can create evaluation
- [ ] Can view evaluation details
- [ ] Authentication works correctly
- [ ] Logs are accessible
- [ ] Backups are configured
- [ ] Monitoring is set up
- [ ] Update `NEXTAUTH_URL` if domain changes

---

## Monitoring and Maintenance

### Logs

**Netlify:**
- View in Netlify dashboard → Functions → Function logs
- Use Netlify CLI: `netlify logs`

**Vercel:**
- View in Vercel dashboard → Deployments → Logs
- Use Vercel CLI: `vercel logs`

**Docker:**
```bash
docker-compose logs -f app
```

**PM2:**
```bash
pm2 logs ai-survey-app
```

### Database Backups

**Automated backups:**
- Neon: Automatic point-in-time recovery
- Supabase: Daily backups on free tier
- Railway: Automatic backups
- Self-hosted: Set up cron job with `pg_dump`

**Manual backup:**
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup-20250126.sql
```

### Updates

Keep application updated:

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install --legacy-peer-deps

# Rebuild
npm run build

# Restart (PM2)
pm2 restart ai-survey-app

# Or redeploy (Netlify/Vercel)
git push origin main
```

---

## Security Recommendations

1. **Use strong secrets** - Generate with `openssl rand -base64 32`
2. **Enable HTTPS** - Always use SSL/TLS in production
3. **Restrict database access** - Use VPC/private networks where possible
4. **Enable rate limiting** - Use Netlify/Vercel built-in or Cloudflare
5. **Monitor logs** - Set up alerts for errors
6. **Update regularly** - Keep dependencies current with `npm update`
7. **Backup data** - Automate database backups
8. **Use secrets management** - Never commit secrets to git

---

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Review platform-specific documentation
5. Open issue on GitHub repository

---

**Recommended for beginners:** Netlify + Neon (both have generous free tiers)

**Recommended for scale:** Vercel + Vercel Postgres or AWS

**Recommended for full control:** Docker on VPS + managed PostgreSQL
