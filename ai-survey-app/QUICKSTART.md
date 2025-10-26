# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd ai-survey-app
npm install --legacy-peer-deps
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

Update `.env` with your secret:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
NODE_ENV="development"
LOG_LEVEL="info"
```

### 3. Set Up Database
```bash
# Generate Prisma client (may show network warnings - safe to ignore in dev)
npm run db:generate

# Create database
npm run db:push

# Seed initial questions
npm run db:seed
```

**Note**: If you encounter Prisma engine download errors, you can:
1. Continue with the next steps - the application will work once dependencies are properly installed
2. Or manually install Prisma CLI: `npm install -g prisma`

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Using the Application

### First Time Setup

1. **Register an Account**
   - Click "Register" on homepage
   - Enter email, password (min 8 chars with uppercase, lowercase, and number)
   - Optional: Add your name

2. **Create Your First Evaluation**
   - Sign in with your credentials
   - Click "New Evaluation"
   - Fill in:
     - **Name**: "Q1 2025 Backend Team - Before"
     - **Phase**: Select "Before - Baseline Assessment"
   - Click "Continue to Survey"

3. **Complete the Survey**
   - Answer 6 questions about your current state:
     1. Business domain
     2. Development methodology
     3. SDLC phases you're targeting
     4. Why you're doing this
     5. How you'll measure success
     6. Current metrics you collect
   - Navigate with Previous/Next buttons
   - Submit when complete

4. **View Your Results**
   - Dashboard shows all evaluations
   - Click "View Details" to see responses
   - Organized by category for easy reading

### After Implementing AI Tools

1. Create a new evaluation with Phase: "After - Post-Implementation Assessment"
2. Answer the same questions based on your new state
3. Compare Before vs After evaluations on the dashboard

## 🎯 The 6 Default Questions

1. **What is your business domain?** (Text)
   - e.g., Healthcare, Finance, E-commerce

2. **What software development methodology do you use?** (Single Select)
   - Options: Agile (Scrum), Agile (Kanban), Waterfall, DevOps, Lean, Hybrid, Other

3. **What tasks or phase in the SDLC are you targeting?** (Multi-Select)
   - Requirements, Design, Development, Code Review, Testing, Deployment, Monitoring, Documentation, Project Management

4. **Why are you doing this?** (Text Area)
   - Describe motivation and expected benefits

5. **How will you measure your success?** (Text Area)
   - Define specific, measurable outcomes

6. **What software measures or metrics do you collect now?** (Multi-Select)
   - Velocity, Cycle Time, Deployment Frequency, MTTR, Code Coverage, Defect Density, etc.

## 🔧 Common Tasks

### Add New Questions
```bash
# Open Prisma Studio
npm run db:studio

# Navigate to Questions table
# Click "Add Record"
# Fill in fields (order, text, type, etc.)
```

### View Database
```bash
npm run db:studio
```
Opens a web UI at [http://localhost:5555](http://localhost:5555)

### Check Application Health
```bash
curl http://localhost:3000/api/health
```

### View Logs (Development)
Logs appear in console with colors

### Reset Database
```bash
# Remove database file
rm prisma/dev.db

# Recreate
npm run db:push
npm run db:seed
```

## 🐳 Docker Deployment

### Using Docker Compose (PostgreSQL + App)
```bash
docker-compose up -d
```

Access at [http://localhost:3000](http://localhost:3000)

### Using Docker Only
```bash
docker build -t ai-survey-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  ai-survey-app
```

## 📊 Project Structure at a Glance

```
ai-survey-app/
├── src/
│   ├── app/                    # Pages and API routes
│   │   ├── api/               # Backend API
│   │   ├── auth/              # Auth pages
│   │   ├── dashboard/         # Main dashboard
│   │   └── survey/            # Survey wizard
│   ├── components/            # Reusable UI components
│   │   ├── forms/             # Form components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Base UI components
│   └── lib/                   # Business logic
│       ├── auth/              # Authentication
│       ├── db/                # Database client
│       ├── errors/            # Error handling
│       └── logger/            # Logging
├── prisma/                    # Database schema
├── README.md                  # Full documentation
└── SECURITY.md               # Security guide
```

## 🎨 Customization

### Change Primary Color
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Change these hex values
    600: '#your-color',
    700: '#your-darker-color',
  }
}
```

### Modify Questions
1. Use Prisma Studio: `npm run db:studio`
2. Or update `prisma/seed.ts` and re-seed

### Add New Pages
Create files in `src/app/your-page/page.tsx`

## 🆘 Troubleshooting

### "Prisma engine download failed"
- **Solution**: This is a network restriction. The app will still work once you install dependencies
- **Alternative**: Use PostgreSQL via Docker: `docker-compose up -d`

### "NextAuth: no secret provided"
- **Solution**: Ensure `.env` has `NEXTAUTH_SECRET` set
- Generate with: `openssl rand -base64 32`

### "Database not found"
- **Solution**: Run `npm run db:push` to create database

### Port 3000 already in use
- **Solution**: Change port: `PORT=3001 npm run dev`

### Can't sign in
- **Solution**: Ensure user is registered first
- Check password meets requirements (8+ chars, uppercase, lowercase, number)

## 📚 Next Steps

- Read the full [README.md](./README.md) for comprehensive documentation
- Review [SECURITY.md](./SECURITY.md) for security best practices
- Customize the questions for your organization
- Deploy to production (Vercel, AWS, etc.)
- Set up monitoring and logging
- Implement rate limiting

## 💡 Tips

- Create "Before" evaluations before any AI tool implementation
- Use descriptive names: "Team Name - Phase - Date"
- Add descriptions to track context
- Review evaluations side-by-side on dashboard
- Export data from Prisma Studio for analysis

---

**Need help?** Check the full README.md or open an issue!
