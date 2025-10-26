# ✅ Deployment Checklist

Print this and check off as you go!

---

## 🎯 Pre-Deployment

- [ ] Code is committed and pushed to GitHub
- [ ] You have a GitHub account
- [ ] You have an email address for Netlify

**Time needed:** 10 minutes total

---

## 📋 PART 1: Database Setup (2 min)

- [ ] Go to https://neon.tech
- [ ] Create account (use GitHub for fast signup)
- [ ] Click "Create a project"
- [ ] Name it: `ai-survey-db`
- [ ] Copy connection string
- [ ] Save it somewhere safe (you'll need it in Part 3)

**Example connection string:**
```
postgresql://user:pass@ep-name.region.neon.tech/db?sslmode=require
```

✅ **Part 1 Complete!**

---

## 📋 PART 2: Netlify Deployment (3 min)

- [ ] Go to https://app.netlify.com
- [ ] Sign in/up (use GitHub)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Choose GitHub
- [ ] Select `AI4SWE` repository
- [ ] Verify settings:
  - [ ] Base directory: `ai-survey-app`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `.next`
- [ ] Click "Deploy site"
- [ ] Copy your Netlify URL (e.g., https://abc123.netlify.app)
- [ ] Save the URL

✅ **Part 2 Complete!** (Don't worry if build fails - we need env vars)

---

## 📋 PART 3: Environment Variables (3 min)

Go to: Site settings → Environment variables → "Add a variable"

Add these 5 variables:

### Variable 1/5: DATABASE_URL
- [ ] Key: `DATABASE_URL`
- [ ] Value: Your Neon connection string from Part 1
- [ ] Click "Add variable"

### Variable 2/5: NEXTAUTH_SECRET
- [ ] Key: `NEXTAUTH_SECRET`
- [ ] Value: `KnqXf+GAcpD7ChBup1Q5DbhaqoJ/bFxzsGezFfYXUb8=`
- [ ] Click "Add variable"

### Variable 3/5: NEXTAUTH_URL
- [ ] Key: `NEXTAUTH_URL`
- [ ] Value: Your Netlify URL from Part 2 (with https://, no trailing slash)
- [ ] Click "Add variable"

### Variable 4/5: NODE_ENV
- [ ] Key: `NODE_ENV`
- [ ] Value: `production`
- [ ] Click "Add variable"

### Variable 5/5: LOG_LEVEL
- [ ] Key: `LOG_LEVEL`
- [ ] Value: `info`
- [ ] Click "Add variable"

**Redeploy:**
- [ ] Go to "Deploys" tab
- [ ] Click "Trigger deploy" → "Deploy site"
- [ ] Wait 2-3 minutes for build

✅ **Part 3 Complete!**

---

## 📋 PART 4: Database Initialization (2 min)

Open terminal on your computer:

```bash
cd ai-survey-app
```

Run these commands:

- [ ] `export DATABASE_URL="your-neon-url-here"`
  (Replace with your actual Neon URL)

- [ ] `npx prisma generate`
  (Generates database client)

- [ ] `npx prisma db push`
  (Creates tables in database)

- [ ] `npm run db:seed`
  (Adds the 6 survey questions)

✅ **Part 4 Complete!**

---

## 📋 PART 5: Testing (1 min)

- [ ] Visit your Netlify URL
- [ ] Page loads without errors
- [ ] Click "Register"
- [ ] Create account (email, password, name)
- [ ] Sign in with credentials
- [ ] Dashboard appears
- [ ] Click "New Evaluation"
- [ ] Fill in name and phase
- [ ] Complete all 6 questions
- [ ] Submit survey
- [ ] View results on dashboard
- [ ] Click "View Details" to see responses

✅ **Part 5 Complete!**

---

## 🎉 DEPLOYMENT SUCCESSFUL!

Your app is live at: ___________________________________

**Share this URL with your team!**

---

## 📝 Post-Deployment (Optional)

### Immediate (5 min)

- [ ] Test on mobile device
- [ ] Test with different browser
- [ ] Create another test evaluation
- [ ] Invite team member to test

### Soon (15 min)

- [ ] Set up custom domain (optional)
  - Site settings → Domain management
  - Update NEXTAUTH_URL after setup
  - Redeploy

- [ ] Enable Netlify Analytics
  - Site settings → Analytics → Enable

- [ ] Bookmark important URLs:
  - [ ] Your live site
  - [ ] Netlify dashboard
  - [ ] Neon dashboard
  - [ ] GitHub repository

### Later (30 min)

- [ ] Set up error monitoring (Sentry.io)
- [ ] Configure automatic backups
- [ ] Add team members to Netlify
- [ ] Review security settings
- [ ] Plan first evaluation session

---

## 📞 Troubleshooting

### Problem: Build fails

**Check:**
- [ ] All 5 environment variables are set
- [ ] Build command is `npm run build`
- [ ] Publish directory is `.next`
- [ ] Base directory is `ai-survey-app`

**Fix:** Update settings and "Trigger deploy"

### Problem: Can't log in

**Check:**
- [ ] NEXTAUTH_URL matches site URL exactly
- [ ] No trailing slash in NEXTAUTH_URL
- [ ] Includes `https://` prefix

**Fix:** Update NEXTAUTH_URL and redeploy

### Problem: Database errors

**Check:**
- [ ] DATABASE_URL has `?sslmode=require`
- [ ] Ran `npx prisma db push`
- [ ] Ran `npm run db:seed`

**Fix:** Re-run Part 4 commands

---

## 📚 Resources

Saved these URLs:

- [ ] Netlify site: https://app.netlify.com/sites/YOUR_SITE
- [ ] Neon dashboard: https://console.neon.tech
- [ ] GitHub repo: https://github.com/tracybannon/AI4SWE
- [ ] Live app: https://your-site.netlify.app

Documentation:
- [ ] [DEPLOY_ME_FIRST.md](./DEPLOY_ME_FIRST.md) - Step-by-step guide
- [ ] [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md) - Complete documentation
- [ ] [DEPLOYMENT.md](./DEPLOYMENT.md) - All platform options

---

## ✅ Status

**Deployment Date:** _______________

**Deployed By:** _______________

**Live URL:** _______________

**Database:** Neon ☐  Supabase ☐  Railway ☐  Other: _______________

**Status:**
- ☐ In Progress
- ☐ Deployed (not tested)
- ☐ Deployed & Tested
- ☐ Production Ready

**Notes:**
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

---

**🎉 Congratulations on your successful deployment!**
