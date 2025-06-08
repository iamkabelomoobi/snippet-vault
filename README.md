# Snippet Vault

A modern, full-stack application for organizing and sharing code snippets. Built with a monorepo architecture using Next.js, GraphQL, and PostgreSQL.

## Features

- **Modern UI**: Beautiful, responsive interface built with Next.js and ShadCN UI
- **Code Management**: Create, edit, and organize code snippets with syntax highlighting
- **File Upload**: Attach code files to snippets with download functionality
- **User Authentication**: Secure login/register with password recovery
- **Admin Moderation**: Admin approval system for all snippets
- **Role-based Access**: User and Admin roles with appropriate permissions
- **Search & Filter**: Find snippets by language, title, or description
- **Dark/Light Theme**: Toggle between themes with system preference detection

## Technology Stack

### Frontend (apps/web)
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **Apollo Client** - GraphQL client for data fetching

### Backend (apps/api)
- **Node.js** - JavaScript runtime
- **Apollo Server** - GraphQL server
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### Development
- **Turborepo** - Monorepo build system
- **TypeScript** - Type safety across the stack
- **ESLint** - Code linting

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- SMTP server for email (optional)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd snippet-vault
npm install
```

2. **Database Setup**:
```bash
# Create PostgreSQL database
createdb snippet_vault

# Set up environment variables
cp apps/api/.env.example apps/api/.env
```

3. **Configure Environment Variables** (`apps/api/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/snippet_vault"
JWT_SECRET="your-super-secret-jwt-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
PORT=4000
```

4. **Initialize Database**:
```bash
cd apps/api
npm run db:push
```

5. **Start Development Servers**:
```bash
# From project root
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/graphql

## Project Structure

```
snippet-vault/
├── apps/
│   ├── api/              # GraphQL API server
│   │   ├── src/
│   │   │   ├── resolvers/    # GraphQL resolvers
│   │   │   ├── schema.ts     # GraphQL schema
│   │   │   ├── context.ts    # Request context
│   │   │   ├── upload.ts     # File upload logic
│   │   │   └── utils/        # Utility functions
│   │   ├── prisma/
│   │   │   └── schema.prisma # Database schema
│   │   └── uploads/          # File storage
│   └── web/              # Next.js frontend
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       └── lib/              # Utility functions
├── packages/
│   └── ui/               # Shared UI components (future)
└── turbo.json           # Turborepo configuration
```

## Key Features

### User Authentication
- Secure registration and login
- JWT-based authentication
- Password reset via email
- Role-based authorization (User/Admin)

### Snippet Management
- Create snippets with title, description, and code
- Support for multiple programming languages
- File attachment with download capability
- Syntax highlighting with Prism
- Copy-to-clipboard functionality

### Admin System
- Admin dashboard for snippet moderation
- Approve/reject submitted snippets
- View all snippets by status
- User management capabilities

### Modern UI/UX
- Responsive design for all devices
- Dark/light theme toggle
- Smooth animations and transitions
- Accessibility-focused components
- Loading states and error handling

## API Endpoints

### GraphQL Queries
- `snippets` - Get all approved snippets
- `snippet(id)` - Get specific snippet
- `mySnippets` - Get user's snippets (auth required)
- `allSnippets` - Get all snippets (admin only)
- `pendingSnippets` - Get pending snippets (admin only)

### GraphQL Mutations
- `register(email, password)` - Create account
- `login(email, password)` - User login
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, password)` - Reset password
- `createSnippet(input)` - Create new snippet
- `updateSnippet(id, input)` - Update snippet
- `deleteSnippet(id)` - Delete snippet
- `approveSnippet(id)` - Approve snippet (admin)
- `rejectSnippet(id)` - Reject snippet (admin)

### REST Endpoints
- `POST /upload` - Upload file
- `GET /download/:filename` - Download file
- `GET /files/:filename` - Serve file

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities:

- **User**: Authentication and profile data
- **Snippet**: Code snippets with metadata
- **Roles**: USER, ADMIN
- **Snippet Status**: PENDING, APPROVED, REJECTED

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Database Operations
```bash
cd apps/api

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## Deployment

The application is designed for easy deployment:

1. **Frontend**: Deploy to Vercel, Netlify, or similar
2. **Backend**: Deploy to Railway, Heroku, or containerized environments
3. **Database**: PostgreSQL on Supabase, Railway, or managed services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.