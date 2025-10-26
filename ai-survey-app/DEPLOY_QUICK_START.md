# 🚀 Deploy to Netlify in 10 Minutes

## Quick Deploy Checklist

### ☐ Step 1: Database (2 min)
1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create project
4. Copy connection string

### ☐ Step 2: Deploy (3 min)
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. "Add new site" → "Import project"
4. Select your repository
5. Base directory: `ai-survey-app`
6. Click "Deploy"

### ☐ Step 3: Configure (3 min)
In Netlify: Site settings → Environment variables → Add:

```
DATABASE_URL = postgresql://user:pass@host/db
NEXTAUTH_SECRET = [run: openssl rand -base64 32]
NEXTAUTH_URL = https://your-site.netlify.app
NODE_ENV = production
LOG_LEVEL = info
```

### ☐ Step 4: Initialize DB (2 min)
On your local machine:

```bash
cd ai-survey-app
export DATABASE_URL="your-production-url"
npx prisma db push
npm run db:seed
```

### ☐ Step 5: Test! (1 min)
1. Visit your Netlify URL
2. Register an account
3. Create an evaluation
4. ✅ Done!

---

## Alternative: One Command Deploy

Run this script and follow the prompts:

```bash
cd ai-survey-app
./setup-env.sh
./deploy-netlify.sh
```

---

## Troubleshooting

**Build fails?**
- Check: Site settings → Build → Build command is `npm run build`
- Check: Publish directory is `.next`

**Can't connect to database?**
- Add `?sslmode=require` to DATABASE_URL
- Check database allows connections from `0.0.0.0/0`

**Can't log in?**
- Check NEXTAUTH_URL matches your site URL exactly
- Include `https://`
- No trailing slash

---

## Full Documentation

- [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md) - Complete Netlify guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - All deployment options
- [QUICKSTART.md](./QUICKSTART.md) - Local development setup

---

**Need Help?** Open an issue or check the full deployment guides above.
