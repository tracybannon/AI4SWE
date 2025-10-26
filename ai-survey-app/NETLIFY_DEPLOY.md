# Netlify Deployment Guide

## Quick Deploy to Netlify (10 minutes)

This guide will walk you through deploying your AI Adoption Survey application to Netlify.

## Prerequisites

- GitHub/GitLab/Bitbucket account with this repository
- Netlify account (sign up free at [netlify.com](https://netlify.com))
- PostgreSQL database (we'll use Neon's free tier)

---

## Method 1: Deploy via Netlify UI (Easiest - Recommended)

### Step 1: Set Up Database (5 minutes)

**Using Neon (Recommended - Free)**

1. Go to [neon.tech](https://neon.tech) and sign up
2. Click "Create a project"
3. Choose a name (e.g., "ai-survey-db")
4. Select a region close to you
5. Click "Create project"
6. Copy the connection string - it looks like:
   ```
   postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require
   ```
7. **Save this!** You'll need it in a moment

**Alternative Database Options:**
- **Supabase**: [supabase.com](https://supabase.com) - Free 500MB
- **Railway**: [railway.app](https://railway.app) - $5/month credit
- **ElephantSQL**: [elephantsql.com](https://elephantsql.com) - Free 20MB

### Step 2: Deploy to Netlify (3 minutes)

1. **Sign in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign up/login with GitHub

2. **Import Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your repositories
   - Select your `AI4SWE` repository

3. **Configure Build Settings**

   Netlify should auto-detect settings from `netlify.toml`, but verify:

   - **Base directory**: `ai-survey-app`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

   Click "Deploy site" (don't worry, it will fail first - we need to add environment variables)

4. **Set Environment Variables**

   After the initial deploy attempt, go to:
   - Site settings → Environment variables → "Add a variable"

   Add these variables:

   **DATABASE_URL**
   ```
   postgresql://user:password@host/database
   ```
   (Use the connection string from Step 1)

   **NEXTAUTH_SECRET**
   ```bash
   # Generate on your machine:
   openssl rand -base64 32
   ```
   Copy the output and paste it here

   **NEXTAUTH_URL**
   ```
   https://your-site-name.netlify.app
   ```
   (Use your Netlify site URL - found in Site settings → General → Site information)

   **NODE_ENV**
   ```
   production
   ```

   **LOG_LEVEL**
   ```
   info
   ```

5. **Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for build to complete (2-3 minutes)

### Step 3: Initialize Database (2 minutes)

You need to initialize your production database with the schema and seed data.

**Option A: Use Netlify CLI (Recommended)**

On your local machine:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
cd ai-survey-app
netlify link

# Set DATABASE_URL temporarily
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma generate
npx prisma db push
npm run db:seed
```

**Option B: Use Local Environment**

1. Create `.env.production` file:
   ```env
   DATABASE_URL="your-production-database-url"
   ```

2. Run migrations:
   ```bash
   export $(cat .env.production | xargs)
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

### Step 4: Test Your Site! 🎉

1. Visit your Netlify site URL (e.g., https://ai-survey-xxx.netlify.app)
2. Click "Register" and create an account
3. Create a "Before" evaluation
4. Complete the survey
5. View your results on the dashboard

**Success!** Your app is now live! 🚀

---

## Method 2: Deploy via Netlify CLI

### Prerequisites

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login
```

### Quick Deploy

```bash
cd ai-survey-app

# Initialize site
netlify init

# Set environment variables
netlify env:set DATABASE_URL "postgresql://user:pass@host/db"
netlify env:set NEXTAUTH_SECRET "$(openssl rand -base64 32)"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"
netlify env:set NODE_ENV "production"
netlify env:set LOG_LEVEL "info"

# Run database migrations
npx prisma generate
npx prisma db push
npm run db:seed

# Deploy
netlify deploy --prod
```

### Or Use the Deployment Script

```bash
cd ai-survey-app
./deploy-netlify.sh
```

---

## Method 3: One-Click Deploy Button

### Using the Deploy to Netlify Button

1. Add this to your GitHub README:

   ```markdown
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/AI4SWE)
   ```

2. Click the button
3. Netlify will:
   - Fork the repository (or use yours)
   - Set up a new site
   - Configure build settings

4. Add environment variables as shown above
5. Deploy!

---

## Post-Deployment Checklist

### ✅ Verify Everything Works

- [ ] Site loads without errors
- [ ] Can register a new user
- [ ] Can log in
- [ ] Can create an evaluation
- [ ] Can complete the survey
- [ ] Can view evaluation details
- [ ] Dashboard displays evaluations

### ✅ Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., survey.yourdomain.com)
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` environment variable
6. Redeploy

### ✅ Set Up Monitoring (Optional)

**Netlify Analytics** (Built-in)
- Site settings → Analytics → Enable

**External Services**
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Uptime Robot](https://uptimerobot.com) - Uptime monitoring

### ✅ Configure Backups

**Database Backups:**
- **Neon**: Automatic point-in-time recovery (included)
- **Supabase**: Daily backups on free tier
- **Railway**: Automatic backups
- **Manual**: Set up cron job with `pg_dump`

**Application Backups:**
- Your code is in Git (already backed up)
- Environment variables are in Netlify (download them periodically)

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check that all dependencies are in `package.json`
- Try clearing cache: Deploys → Clear cache and retry deploy

**Error: "Prisma client not generated"**
- Ensure `prisma generate` runs in build command
- Check `netlify.toml` build command

**Error: "Module not found: Can't resolve 'next-auth'"**
- Run `npm install --legacy-peer-deps` locally
- Push updated `package-lock.json`

### Database Connection Issues

**Error: "Connection refused"**
- Verify `DATABASE_URL` is correct
- Check database allows connections from all IPs (`0.0.0.0/0`)
- Ensure `sslmode=require` is in connection string

**Error: "SSL required"**
- Add `?sslmode=require` to end of DATABASE_URL
- Example: `postgresql://user:pass@host/db?sslmode=require`

### Authentication Issues

**Error: "NextAuth: no secret provided"**
- Verify `NEXTAUTH_SECRET` is set in Netlify environment variables
- Make sure it's not empty

**Error: "Callback URL mismatch"**
- Ensure `NEXTAUTH_URL` matches your Netlify site URL exactly
- Include `https://` prefix
- No trailing slash

**Can't Log In After Registration**
- Check browser console for errors
- Verify cookies are enabled
- Try in incognito mode
- Check `NEXTAUTH_URL` is correct

### Function Timeouts

**Error: "Function execution timed out"**
- Netlify free tier: 10 second timeout
- Pro tier: 26 second timeout
- Optimize slow database queries
- Consider upgrading to Pro if needed

### Page Not Found (404)

**All pages return 404**
- Check build completed successfully
- Verify publish directory is `.next`
- Check `netlify.toml` configuration

---

## Updating Your Deployed Site

### Automatic Updates (Recommended)

Netlify automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Deploy

```bash
cd ai-survey-app
netlify deploy --prod
```

### Rollback to Previous Version

1. Go to Netlify dashboard → Deploys
2. Find the working deployment
3. Click "Publish deploy"

---

## Environment Variable Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | `(random 32-byte string)` | NextAuth encryption secret |
| `NEXTAUTH_URL` | Yes | `https://site.netlify.app` | Your site URL |
| `NODE_ENV` | Yes | `production` | Node environment |
| `LOG_LEVEL` | No | `info` | Logging level |

### Generating Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Upgrade Cost |
|---------|-----------|--------------|
| **Netlify** | 100GB bandwidth/month | $19/month (Pro) |
| **Neon (Database)** | 0.5GB storage | $19/month (Scale) |
| **Total** | **$0/month** | ~$40/month (if needed) |

**Recommendation:** Start with free tier. Only upgrade when you need more resources.

---

## Next Steps

1. ✅ Site is deployed
2. ✅ Database is initialized
3. ✅ Can create evaluations

**Consider:**
- Set up custom domain
- Configure SSL (automatic with Netlify)
- Enable analytics
- Set up error monitoring (Sentry)
- Create backups
- Add team members (Netlify → Team settings)
- Set up staging environment (Deploy Preview)

---

## Support & Resources

**Documentation:**
- [Netlify Docs](https://docs.netlify.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)

**Community:**
- [Netlify Community](https://answers.netlify.com)
- [Next.js Discord](https://nextjs.org/discord)

**Troubleshooting:**
- Check Netlify function logs: Site → Functions → Function logs
- Check build logs: Deploys → [deployment] → Deploy log
- Check application logs: Functions → [function] → Logs

---

## Quick Reference Commands

```bash
# Deploy
netlify deploy --prod

# View logs
netlify logs

# Open site in browser
netlify open:site

# Open Netlify dashboard
netlify open:admin

# View environment variables
netlify env:list

# Run function locally
netlify dev

# Link to existing site
netlify link

# Unlink from site
netlify unlink
```

---

**🎉 Congratulations! Your AI Adoption Survey app is now live on Netlify!**

For detailed troubleshooting and advanced configurations, see the main [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
