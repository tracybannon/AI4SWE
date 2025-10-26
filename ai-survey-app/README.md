# AI Adoption Survey Application

A secure, enterprise-grade web application for assessing and tracking AI tool adoption across the software development lifecycle. Built with modern technologies and following best practices for security, modularity, and maintainability.

## 🌟 Features

- **Before & After Evaluations**: Capture baseline metrics before implementing AI tools and measure improvements after adoption
- **Configurable Questions**: Dynamic survey questions that can be updated over time without affecting existing data
- **Wizard-Style Interface**: User-friendly multi-step survey with progress tracking and validation
- **User Authentication**: Secure email/password authentication with encrypted credentials
- **User Profiles**: Each user can create and manage multiple evaluation sessions
- **Enterprise Security**: Built-in CSRF protection, input validation, SQL injection prevention, and XSS protection
- **Comprehensive Logging**: Structured logging with Winston for debugging and monitoring
- **Centralized Error Handling**: Consistent error handling across the entire application
- **Responsive Design**: Modern UI built with Tailwind CSS that works on all devices

## 🏗️ Architecture & Technology Stack

### Frontend
- **Next.js 16** - React framework with server-side rendering and API routes
- **TypeScript** - Type-safe development
- **React Hook Form** - Efficient form handling and validation
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - Schema validation for forms and API requests

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access with migrations
- **SQLite** (development) / **PostgreSQL** (production) - Database options
- **NextAuth.js** - Authentication framework
- **bcryptjs** - Password hashing

### Cross-Cutting Concerns
- **Winston** - Enterprise logging with daily log rotation
- **Custom Error Classes** - Typed error handling with error codes
- **Security Headers** - Comprehensive security headers in Next.js config
- **Input Validation** - Zod schemas for all user inputs

## 📁 Project Structure

```
ai-survey-app/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── evaluations/   # Evaluation CRUD endpoints
│   │   │   └── questions/     # Questions endpoint
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── survey/            # Survey creation pages
│   │   ├── evaluations/       # Evaluation details
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── forms/             # Form components (SurveyWizard)
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   ├── providers/         # Context providers (SessionProvider)
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── auth/              # Authentication utilities
│   │   ├── db/                # Database client
│   │   ├── errors/            # Error handling system
│   │   └── logger/            # Logging infrastructure
│   └── types/                 # TypeScript type definitions
├── .env.example               # Environment variables template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- SQLite (included) or PostgreSQL (for production)

### Installation

1. **Clone the repository**
   ```bash
   cd ai-survey-app
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   NODE_ENV="development"
   LOG_LEVEL="info"
   ```

   **Important**: Generate a secure secret for production:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed initial questions
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### Creating an Account

1. Click "Register" on the homepage
2. Fill in your email, password, and name
3. Submit the registration form
4. Sign in with your credentials

### Creating an Evaluation

1. After signing in, click "New Evaluation" or navigate to "New Survey"
2. Fill in the evaluation details:
   - **Name**: Give your evaluation a descriptive name
   - **Description**: Add optional context
   - **Phase**: Select "Before" (baseline) or "After" (post-implementation)
3. Click "Continue to Survey"
4. Complete the wizard-style survey:
   - Answer each question
   - Navigate with "Previous" and "Next" buttons
   - Submit when complete

### Viewing Evaluations

1. Go to the Dashboard to see all your evaluations
2. Evaluations are grouped by "Before" and "After" phases
3. Click "View Details" to see responses
4. Responses are organized by category for easy review

## 🔒 Security Features

### Authentication & Authorization
- Secure password hashing with bcrypt (12 salt rounds)
- JWT-based session management
- Protected API routes requiring authentication
- User isolation (users can only access their own data)

### Input Validation
- Zod schema validation for all user inputs
- Type-safe forms with React Hook Form
- Server-side validation for all API requests

### Security Headers
- Strict-Transport-Security (HSTS)
- X-Frame-Options (prevent clickjacking)
- X-Content-Type-Options (prevent MIME sniffing)
- X-XSS-Protection
- Content-Security-Policy
- Referrer-Policy
- Permissions-Policy

### Database Security
- SQL injection prevention (Prisma ORM)
- Parameterized queries
- Connection pooling
- Cascade deletes for data integrity

### Additional Security
- CSRF protection (built into Next.js)
- XSS prevention (React's built-in escaping)
- Environment variable protection
- No sensitive data in logs

## 📊 Database Schema

### Models

**User**
- Stores user account information
- Hashed passwords with bcrypt
- One-to-many relationship with evaluations

**Question**
- Configurable survey questions
- Support for multiple question types (text, textarea, select, multiselect, radio)
- Can be activated/deactivated without deletion
- Version control via timestamps

**Evaluation**
- Represents a before/after assessment session
- Links to user and contains multiple responses
- Tracks status and completion time

**Response**
- Individual answers to questions
- Links evaluation to question with answer
- Unique constraint per evaluation/question pair

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
npm run type-check   # Run TypeScript type checking
```

### Logging

The application uses Winston for enterprise-grade logging:

- **Development**: Colorized console output with debug information
- **Production**: JSON logs with daily rotation, 30-day retention
- **Log Levels**: error, warn, info, http, debug
- **Context**: All logs include context and metadata

Log files are stored in the `logs/` directory (production only).

### Error Handling

Centralized error handling with custom error classes:

- `AuthenticationError` - Authentication failures (401)
- `AuthorizationError` - Insufficient permissions (403)
- `ValidationError` - Input validation errors (400)
- `NotFoundError` - Resource not found (404)
- `DatabaseError` - Database operation failures (500)
- `BusinessError` - Business logic violations (400)

All errors are logged and return consistent JSON responses.

## 🧪 Testing Considerations

The application is built with testability in mind:

- Pure functions for business logic
- Dependency injection for services
- Mock-friendly database layer
- Isolated components

Recommended testing tools:
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** or **Cypress** - E2E testing

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-secure-secret"
NODE_ENV="production"
LOG_LEVEL="warn"
```

### Deployment Platforms

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS** (EC2, ECS, Lambda)
- **Google Cloud Platform**
- **Azure**
- **Docker** containers

### Database Migration for Production

1. Update `DATABASE_URL` to PostgreSQL connection string
2. Run migrations:
   ```bash
   npm run db:push
   npm run db:seed
   ```

## 📖 API Documentation

### Authentication Endpoints

**POST /api/auth/register**
- Register a new user
- Body: `{ email, password, name? }`
- Returns: `{ success, message, user }`

**POST /api/auth/signin**
- Sign in (handled by NextAuth)

**POST /api/auth/signout**
- Sign out (handled by NextAuth)

### Evaluation Endpoints

**GET /api/evaluations**
- Get all evaluations for current user
- Requires authentication
- Returns: `{ success, evaluations[] }`

**POST /api/evaluations**
- Create new evaluation with responses
- Requires authentication
- Body: `{ name, description?, phase, responses }`
- Returns: `{ success, message, evaluation }`

**GET /api/evaluations/[id]**
- Get evaluation details with responses
- Requires authentication
- Returns: `{ success, evaluation }`

### Questions Endpoint

**GET /api/questions**
- Get all active questions
- Returns: `{ success, questions[] }`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Add JSDoc comments for functions
- Use meaningful variable names
- Keep functions small and focused

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ for assessing AI adoption in software development**
