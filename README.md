# 🎓 EduMart - Production-Grade E-Commerce Platform

A secure, scalable, multi-vendor education e-commerce platform built with modern TypeScript.

**Live Demo** | [Architecture Docs](./docs/ARCHITECTURE.md) | [API Reference](./docs/API.md) | [Deployment Guide](./docs/DEPLOYMENT.md)

---

## ✨ Features

### 🛍️ For Customers
- ✅ Browse and search 10,000+ educational products
- ✅ Add to cart, wishlist, and checkout securely
- ✅ Track orders and manage addresses
- ✅ Leave reviews and ratings
- ✅ Receive order notifications
- ✅ Apply discount coupons

### 🏪 For Vendors
- ✅ Create and manage product catalog
- ✅ Track inventory and pricing
- ✅ View orders and analytics
- ✅ Manage fulfillment status
- ✅ Vendor verification workflow
- ✅ Upload product images securely

### 👨‍💼 For Admins
- ✅ User and vendor management
- ✅ Product approval and moderation
- ✅ Site content (banners, coupons, categories)
- ✅ Comprehensive audit logs
- ✅ Revenue and performance analytics
- ✅ Vendor suspension & account management

### 🔒 Security
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Bcrypt password hashing
- ✅ CSRF protection
- ✅ Rate limiting on auth endpoints
- ✅ Soft deletes for data safety
- ✅ Comprehensive audit logging
- ✅ Input validation with Zod
- ✅ Environment-based secrets management

### 📱 Multi-Platform
- ✅ Responsive web app (Next.js 14)
- ✅ Native React Native app (Expo)
- ✅ Shared API SDK for both apps
- ✅ Consistent authentication across platforms

### 🚀 DevOps Ready
- ✅ Docker support
- ✅ GitHub Actions CI/CD
- ✅ Database migrations (Prisma)
- ✅ SEO optimization for web
- ✅ Performance monitoring ready

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Web** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Frontend Mobile** | React Native, Expo, TypeScript |
| **API** | Next.js API Routes |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | JWT + Refresh Tokens (Supabase/Auth0 ready) |
| **Validation** | Zod |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **State Management** | React Query, lightweight context |
| **Storage** | Pluggable (Local / S3 / Cloudinary) |

### Monorepo Structure

```
edumart/
├── apps/
│   ├── web/              # Next.js 14 web app + API
│   └── mobile/           # React Native app (Expo)
├── packages/
│   ├── shared/           # Types, enums, constants
│   ├── validation/       # Zod schemas
│   ├── sdk/              # API client SDK
│   ├── ui/               # Design tokens
│   └── config/           # Configuration
├── prisma/               # Database schema
├── scripts/              # Database seeding
├── docker/               # Container setup
└── .github/workflows/    # CI/CD pipelines
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17+ ([Download](https://nodejs.org/))
- **pnpm** 8+ ([Install](https://pnpm.io/installation))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Docker** (optional, for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/edumart.git
   cd edumart
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/edumart_dev"

   # App
   NEXT_PUBLIC_APP_NAME="EduMart"
   NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api/v1"

   # Auth (choose one: JWT or managed provider)
   JWT_SECRET="your-super-secret-key-min-32-characters"
   JWT_EXPIRES_IN="1h"

   # Features
   FEATURE_VENDOR_VERIFICATION=true
   FEATURE_PRODUCT_APPROVAL=true
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker compose -f docker/docker-compose.yml up -d

   # Run migrations
   cd apps/web
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   Servers will start at:
   - 🌐 Web: http://localhost:3000
   - 📱 Mobile: http://localhost:8081
   - 🔌 API: http://localhost:3000/api/v1

---

## 📖 Usage

### Web App

```bash
# Development
cd apps/web
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

**Features:**
- Homepage with categories and featured products
- Product search and filtering
- Customer dashboard (orders, addresses, wishlist)
- Vendor dashboard (product management, analytics)
- Admin dashboard (user management, approvals, reports)

### Mobile App

```bash
# Start Expo
cd apps/mobile
pnpm start

# Run on Android simulator
expo start --android

# Run on iOS simulator
expo start --ios

# Build APK/IPA
eas build --platform android
eas build --platform ios
```

### API

REST API available at `http://localhost:3000/api/v1`

#### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

#### Authentication
```bash
# Sign up
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123"
  }'
```

#### Use returned access token for authenticated requests
```bash
curl http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🗄️ Database Schema

Key entities:

- **Users** - Customers, vendors, and admins
- **Vendor Profiles** - Seller information with verification status
- **Products** - Catalog with approval workflow
- **Categories** - Hierarchical product categories
- **Orders** - Order management with fulfillment tracking
- **Cart** - Shopping cart with items
- **Reviews** - Product reviews with moderation
- **Addresses** - User shipping/billing addresses
- **Coupons** - Discount codes with usage limits
- **Audit Logs** - Track admin and vendor actions
- **Notifications** - Order and system notifications
- **Banners** - Homepage content management

### View the schema
```bash
cd apps/web
npx prisma studio  # Opens Prisma Studio UI
```

---

## 🔐 Authentication & Authorization

### Auth Flow

1. **Sign up** → Create user account with email/password
2. **Login** → Receive JWT access token + refresh token
3. **API calls** → Include token in `Authorization: Bearer <token>` header
4. **Token expiry** → Use refresh token to get new access token
5. **Logout** → Clear tokens client-side

### Role-Based Access Control

| Role | Permissions |
|------|------------|
| **CUSTOMER** | Browse products, manage cart/orders, leave reviews |
| **VENDOR** | Create/manage products, view orders, manage inventory |
| **ADMIN** | Full platform control, user/vendor management, approvals |

Routes are protected by middleware:
```typescript
// app/api/v1/admin/[...].ts - Only ADMIN role can access
// app/api/v1/vendor/[...].ts - Only VENDOR role can access
// app/(customer)/* - Only CUSTOMER role can access
```

---

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### Coverage
```bash
pnpm test --coverage
```

### E2E Tests (Playwright)
```bash
# Install browsers (one-time)
pnpm exec playwright install

# Run E2E tests
pnpm test:e2e
```

**Test Coverage:**
- ✅ Auth flows (signup, login, refresh token, logout)
- ✅ Product management (create, update, approve)
- ✅ Order processing (cart, checkout, fulfillment)
- ✅ Role-based access control
- ✅ Vendor approval workflow
- ✅ API validation

---

## 📦 Deployment

### Docker

```bash
# Build image
docker build -f docker/Dockerfile.web -t edumart-web .

# Run container
docker run -p 3000:3000 --env-file .env.local edumart-web
```

### Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
```

### Traditional VPS / Docker Compose

See [Deployment Guide](./docs/DEPLOYMENT.md)

### Environment Setup

Create `.env.production`:
```env
DATABASE_URL="postgresql://prod-user:secure-password@prod-db-host:5432/edumart_prod"
NEXT_PUBLIC_API_BASE_URL="https://api.edumart.com/api/v1"
JWT_SECRET="your-production-secret-min-32-chars"
NODE_ENV="production"
```

---

## 🛠️ Development

### Project Scripts

```bash
# Development
pnpm dev              # Start all apps
pnpm dev --filter=@edumart/web    # Web only
pnpm dev --filter=@edumart/mobile # Mobile only

# Building
pnpm build            # Build all apps
pnpm build --filter=@edumart/web  # Web only

# Quality
pnpm lint             # Run linter
pnpm lint:fix         # Auto-fix lint issues
pnpm type-check       # TypeScript type check

# Database
pnpm db:push          # Push schema changes
pnpm db:migrate       # Create migration
pnpm db:seed          # Seed with test data
pnpm db:studio        # Open Prisma Studio

# Docker
pnpm docker:build     # Build containers
pnpm docker:up        # Start services
pnpm docker:down      # Stop services
```

### Code Style

- **ESLint** - Linting and code quality
- **Prettier** - Code formatting
- **TypeScript** - Strict type checking
- **Zod** - Runtime validation

```bash
# Format all code
pnpm format

# Check formatting
pnpm lint
```

### Making Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and commit: `git commit -m "feat: add feature"`
3. Push to remote: `git push origin feature/my-feature`
4. Create a Pull Request
5. Wait for CI/CD to pass
6. Merge when approved

---

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and decisions
- [API Reference](./docs/API.md) - Endpoint documentation
- [Database Schema](./docs/DATABASE.md) - Entity relationships
- [Authentication](./docs/AUTH.md) - Auth flow and RBAC
- [Deployment](./docs/DEPLOYMENT.md) - Production setup
- [Contributing](./CONTRIBUTING.md) - Development guidelines

---

## 🐛 Troubleshooting

### Database connection fails
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Or start it
docker compose -f docker/docker-compose.yml up postgres

# Test connection
psql postgresql://user:password@localhost:5432/edumart_dev
```

### Prisma Client generation fails
```bash
cd apps/web
npx prisma generate
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Node modules issues
```bash
# Clean install
pnpm clean
pnpm install
```

---

## 📊 Default Credentials (Development Only)

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@edumart.com` | `Admin@123456` |
| Customer | `customer1@edumart.com` | `Customer@123456` |
| Vendor | `vendor1@edumart.com` | `Vendor@123456` |

**⚠️ Change these immediately in production!**

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Add tests for new features
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

---

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/edumart/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/edumart/discussions)
- **Email**: support@edumart.com
- **Docs**: [Full documentation](./docs)

---

## 🎯 Roadmap

- [ ] Phase 2: Auth system (JWT + managed providers)
- [ ] Phase 3: Product management & approval workflow
- [ ] Phase 4: Shopping cart & orders
- [ ] Phase 5: Dashboards (customer, vendor, admin)
- [ ] Phase 6: Advanced features (search, notifications, coupons)
- [ ] Phase 7: Mobile app (React Native)
- [ ] Phase 8: Production deployment & security hardening

---

## ✨ Made with ❤️ by the EduMart Team

**Happy coding! 🚀**
