# REPUFEED Backend - Setup & Installation Guide

This is the Laravel backend for the REPUFEED feedback management system. It provides a robust REST API for managing feedback submissions, approvals, and system settings.

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 8.0+ or SQLite
- Node.js 18+ (for frontend)

### Installation

1. **Clone & Navigate**
```bash
cd backend
```

2. **Install Dependencies**
```bash
composer install
```

3. **Create Environment File**
```bash
cp .env.example .env
```

4. **Update `.env` with your database credentials**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=repufeed
DB_USERNAME=root
DB_PASSWORD=
```

5. **Generate Application Key**
```bash
php artisan key:generate
```

6. **Run Migrations**
```bash
php artisan migrate
```

7. **Seed Admin Account**
```bash
php artisan db:seed --class=AdminSeeder
```

8. **Start Development Server**
```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## 📋 Features Implemented

### ✅ Authentication & Security
- **Sanctum-based Authentication**: Token-based API authentication
- **Protected Admin Routes**: All admin endpoints require bearer token
- **Rate Limiting**: 10 requests per minute on feedback submission endpoint
- **Input Validation**: Comprehensive request validation with custom FormRequest classes
- **Error Handling**: Standardized error response format across all endpoints

### ✅ Feedback Management
- **Public Submission**: Users can submit feedback with optional verification
- **Admin Approval Workflow**: Approve/reject feedback submissions
- **Soft Deletes**: Deleted feedback remains in database for audit trails
- **Sorting & Filtering**: Sort by date or rating, filter by status
- **Pagination**: Cursor-based pagination with customizable page sizes

### ✅ API Resources
- **FeedbackResource**: Consistent feedback response formatting
- **UserResource**: Standardized user data transformation
- **Pagination Metadata**: Full pagination details in responses

### ✅ Performance Optimizations
- **Database Indexing**: Indexes on frequently queried columns (created_at, is_approved, rating)
- **Query Optimization**: Composite indexes for common combined queries
- **Caching**: 5-minute cache on statistics endpoint
- **Soft Deletes Index**: Optimized soft delete queries

### ✅ Admin Features
- **Settings Management**: Configurable application behavior
- **Email Notifications**: Notify admin of new submissions
- **Statistics Dashboard**: Real-time feedback metrics
- **Role-based Access**: Admin-only endpoints protected

### ✅ Data Integrity
- **Timestamping**: automatic created_at/updated_at tracking
- **Casting**: Proper type casting for database values
- **Relationships**: Pre-built for future enhancements

### ✅ Testing
- **Authentication Tests**: Login, logout, token verification
- **Feedback Tests**: Submission, listing, approval, deletion
- **Settings Tests**: Configuration management
- **Rate Limiting Tests**: Verification of request limits
- **Soft Delete Tests**: Deletion vs. permanent removal

## 📚 API Documentation

Full API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Key Endpoints

**Authentication:**
- `POST /api/admin/login` - Admin login
- `GET /api/admin/user` - Get current user
- `GET /api/admin/verify` - Verify token
- `POST /api/admin/logout` - Admin logout

**Feedback:**
- `POST /api/feedback` - Submit feedback (rate limited)
- `GET /api/feedback` - List all feedback (admin)
- `GET /api/feedback/approved` - Public approved feedback
- `GET /api/feedback/stats` - Statistics (cached)
- `PATCH /api/feedback/{id}/status` - Update status (admin)
- `DELETE /api/feedback/{id}` - Delete feedback (admin, soft)

**Settings:**
- `GET /api/settings/public` - Public settings
- `GET /api/settings` - Admin settings
- `PUT /api/settings` - Update settings (admin)

**System:**
- `GET /api/health` - Health check

## 🔐 Default Admin Credentials

⚠️ **CHANGE THESE IN PRODUCTION!**

```
Email: admin@example.com
Password: password123
```

Change in `database/seeders/AdminSeeder.php` before deployment.

## 📁 Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # API Controllers
│   │   ├── Requests/          # Form Request validation classes
│   │   └── Resources/         # API Resource transformers
│   ├── Models/                 # Eloquent models
│   ├── Mail/                   # Email notification classes
│   ├── Services/              # Business logic services (caching)
│   └── Providers/
├── database/
│   ├── migrations/            # Database schema
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories for testing
├── routes/
│   └── api.php               # API route definitions
├── tests/
│   └── Feature/              # Feature tests
├── config/
│   ├── app.php
│   ├── database.php
│   ├── mail.php
│   └── ...
└── bootstrap/
    ├── app.php
    └── providers.php
```

## 🧪 Running Tests

Run all tests:
```bash
php artisan test
```

Run specific test file:
```bash
php artisan test tests/Feature/AuthenticationTest.php
```

Run with coverage:
```bash
php artisan test --coverage
```

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `email_verified_at` (Timestamp, Nullable)
- `timestamps` (created_at, updated_at)

### Feedback Table
- `id` (Primary Key)
- `name` (String) - "Anonymous" if not provided
- `email` (String)
- `message` (Text)
- `rating` (Integer, 1-5)
- `is_approved` (Boolean, default: false)
- `deleted_at` (Timestamp, Nullable - Soft Delete)
- `timestamps` (created_at, updated_at)
- **Indexes**: created_at, is_approved, rating, (is_approved + created_at), deleted_at

### Settings Table
- `id` (Primary Key)
- `key` (String, Unique) - Always "app_settings"
- `value` (JSON)
- `timestamps`

### Personal Access Tokens Table
- For Sanctum token management

## 🔄 Email Configuration

Configure mail settings in `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@repufeed.local
MAIL_FROM_NAME="REPUFEED"
```

Or use Laravel's queue system for async email sending (recommended for production).

## 🚀 Deployment Checklist

- [ ] Change default admin credentials
- [ ] Update `.env` with production database
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate unique `APP_KEY` for production
- [ ] Configure mail service credentials
- [ ] Run `php artisan optimize` for production mode
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up automated backups
- [ ] Configure queue workers for email
- [ ] Set up monitoring/logging

## 🛠 Common Commands

```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Clear cache
php artisan cache:clear

# Generate API documentation
php artisan serve  # Then visit /api/health

# Check service status
php artisan tinker
```

## 📝 Environment Variables

```
APP_NAME=REPUFEED
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=repufeed
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SANCTUM_EXPIRATION=525600
```

## 🐛 Troubleshooting

**CORS Issues:**
- Check `config/cors.php` for allowed origins
- Ensure frontend URL is in the whitelist

**Database Connection Error:**
- Verify database credentials in `.env`
- Ensure MySQL is running
- Check database exists

**Authentication Failing:**
- Verify token format: `Authorization: Bearer {token}`
- Check token hasn't expired
- Run `php artisan db:seed --class=AdminSeeder` for default admin

**Tests Failing:**
- Run `php artisan config:clear`
- Ensure `.env.testing` is configured
- Run `php artisan test` with verbose flag: `php artisan test -v`

## 📞 Support

For issues or questions:
1. Check API_DOCUMENTATION.md for endpoint details
2. Review test files for usage examples
3. Check Laravel documentation: https://laravel.com/docs

## 📄 License

This project is proprietary software. All rights reserved.

## 🔄 Recent Updates

### Version 2.0 (Feb 9, 2026)

**Security & Auth:**
- ✅ Implemented Sanctum authentication
- ✅ Protected admin routes with auth middleware
- ✅ Added rate limiting to feedback submission

**Code Quality:**
- ✅ Created FormRequest validation classes
- ✅ Implemented Resource transformers
- ✅ Standardized error responses

**Performance:**
- ✅ Added database indexes
- ✅ Implemented caching for statistics
- ✅ Pagination support

**Testing:**
- ✅ Added 30+ feature tests
- ✅ Test coverage for auth, feedback, settings
- ✅ Rate limiting verification

**Documentation:**
- ✅ Comprehensive API documentation
- ✅ Database schema documentation
- ✅ Deployment checklist

---

**Built with ❤️ using Laravel**
