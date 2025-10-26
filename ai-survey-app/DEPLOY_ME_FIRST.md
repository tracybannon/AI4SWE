# 🚀 DEPLOY IN 3 STEPS (Copy-Paste Ready!)

## I've pre-configured everything for you! Just follow these 3 steps:

---

## 📋 STEP 1: Get a Free Database (2 minutes)

### Option A: Neon (Recommended - Easiest)

1. **Go to:** https://neon.tech
2. **Click:** "Sign up" (use GitHub for fastest signup)
3. **Click:** "Create a project"
4. **Name it:** `ai-survey-db`
5. **Copy the connection string** - it looks like:
   ```
   postgresql://user:password@ep-something.region.neon.tech/neondb?sslmode=require
   ```
6. **Save it!** You'll need this in Step 3

✅ **Done with Step 1!**

---

## 📋 STEP 2: Deploy to Netlify (3 minutes)

### Method A: Via Netlify UI (Easiest)

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Choose:** GitHub (authorize if needed)
4. **Select:** Your `AI4SWE` repository
5. **Configure build:**
   - Base directory: `ai-survey-app`
   - Build command: `npm run build`
   - Publish directory: `.next`
   - (These should auto-fill from netlify.toml)
6. **Click:** "Deploy site"

**Don't worry if it fails!** We need to add environment variables next.

7. **Save your site URL!** It will be something like:
   ```
   https://spectacular-cupcake-abc123.netlify.app
   ```

✅ **Done with Step 2!**

---

## 📋 STEP 3: Configure Environment Variables (2 minutes)

In your Netlify site dashboard:

1. **Go to:** Site settings → Environment variables → "Add a variable"

2. **Copy-paste these 5 variables:**

### Variable 1: DATABASE_URL
**Key:**
```
DATABASE_URL
```
**Value:** (paste your Neon connection string from Step 1)
```
postgresql://YOUR_CONNECTION_STRING_HERE
```

### Variable 2: NEXTAUTH_SECRET
**Key:**
```
NEXTAUTH_SECRET
```
**Value:** (pre-generated for you)
```
KnqXf+GAcpD7ChBup1Q5DbhaqoJ/bFxzsGezFfYXUb8=
```

### Variable 3: NEXTAUTH_URL
**Key:**
```
NEXTAUTH_URL
```
**Value:** (your Netlify URL from Step 2)
```
https://your-site-name.netlify.app
```
⚠️ **Important:** Replace with YOUR actual Netlify URL, include `https://`, NO trailing slash!

### Variable 4: NODE_ENV
**Key:**
```
NODE_ENV
```
**Value:**
```
production
```

### Variable 5: LOG_LEVEL
**Key:**
```
LOG_LEVEL
```
**Value:**
```
info
```

3. **Click:** "Trigger deploy" → "Deploy site"

4. **Wait 2-3 minutes** for build to complete

✅ **Done with Step 3!**

---

## 📋 STEP 4: Initialize Database (2 minutes)

### On your local machine, run these commands:

```bash
# Navigate to the app directory
cd ai-survey-app

# Set your production database URL temporarily
export DATABASE_URL="your-neon-connection-string-here"

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Add the 6 survey questions
npm run db:seed
```

✅ **Done with Step 4!**

---

## 🎉 TEST YOUR SITE!

1. **Visit your Netlify URL:** https://your-site-name.netlify.app

2. **Register an account:**
   - Click "Register"
   - Enter email, password, name
   - Click "Register"

3. **Sign in:**
   - Use your credentials
   - You'll see the dashboard

4. **Create an evaluation:**
   - Click "New Evaluation"
   - Name: "Test Evaluation"
   - Phase: "Before"
   - Complete the 6 questions
   - Submit!

5. **View your results:**
   - Dashboard shows your evaluation
   - Click "View Details" to see responses

## ✅ SUCCESS! Your app is live! 🎉

---

## 🔧 Troubleshooting

### Build Failed?

**Check:**
- Site settings → Build & deploy → Build command is `npm run build`
- Publish directory is `.next`

**Fix:** If wrong, update and click "Trigger deploy"

### Can't Connect to Database?

**Check:**
- DATABASE_URL has `?sslmode=require` at the end
- DATABASE_URL is from Neon (Step 1)

**Fix:** Update DATABASE_URL in environment variables and redeploy

### Can't Log In?

**Check:**
- NEXTAUTH_URL matches your Netlify URL EXACTLY
- No trailing slash: ✅ `https://site.netlify.app` ❌ `https://site.netlify.app/`
- Includes `https://`

**Fix:** Update NEXTAUTH_URL and redeploy

### Page Shows "Application Error"?

**Check:**
- All 5 environment variables are set
- DATABASE_URL is correct
- Database has been initialized (Step 4)

**Fix:** Review Step 3 and Step 4

---

## 📞 Need Help?

1. Check the full guides:
   - [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md) - Complete guide
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - All platforms

2. Check Netlify logs:
   - Site → Functions → Function logs
   - Look for errors

3. Open an issue on GitHub

---

## 🎯 What's Next?

### Optional Improvements:

1. **Custom Domain** (5 min)
   - Site settings → Domain management
   - Add custom domain
   - Update NEXTAUTH_URL
   - Redeploy

2. **Enable Analytics** (1 min)
   - Site settings → Analytics → Enable

3. **Set Up Backups** (Automatic with Neon)
   - Neon does automatic backups
   - Download periodic backups of environment variables

4. **Add Team Members** (1 min)
   - Site settings → Team → Invite

5. **Set Up Monitoring** (Optional)
   - Use Netlify Analytics (built-in)
   - Or add Sentry.io for error tracking

---

## 📊 Your Stack (All Free!)

| Service | What It Does | Cost |
|---------|--------------|------|
| **Netlify** | Hosts your app | Free |
| **Neon** | PostgreSQL database | Free |
| **GitHub** | Stores your code | Free |
| **Total** | Full production app | **$0/month** |

**Can handle 1000s of users on free tier!**

---

## 🎉 You're Done!

Your AI Adoption Survey app is now:
- ✅ Deployed to production
- ✅ Has a live URL
- ✅ Connected to database
- ✅ Secure (HTTPS, encrypted)
- ✅ Ready for users

**Share your URL and start collecting evaluations!**

---

**Questions? Check [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md) for detailed troubleshooting.**
