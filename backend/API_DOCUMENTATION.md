# REPUFEED API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
The API uses **Laravel Sanctum** for authentication. Protected endpoints require an `Authorization: Bearer {token}` header.

---

## Endpoints

### Health Check
- **GET** `/health`
- **Description:** Returns API health status
- **Authentication:** Not required
- **Response:**
```json
{
  "status": "ok"
}
```

---

## Authentication Endpoints

### Admin Login
- **POST** `/admin/login`
- **Description:** Authenticate as admin and receive API token
- **Authentication:** Not required
- **Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "created_at": "2026-02-09T10:00:00Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz..."
}
```
- **Response (422):**
```json
{
  "message": "Invalid credentials"
}
```

### Get Current User
- **GET** `/admin/user`
- **Description:** Get authenticated user details
- **Authentication:** Required (Bearer token)
- **Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "created_at": "2026-02-09T10:00:00Z"
  }
}
```

### Verify Token
- **GET** `/admin/verify`
- **Description:** Verify token validity
- **Authentication:** Required (Bearer token)
- **Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "created_at": "2026-02-09T10:00:00Z"
  }
}
```

### Admin Logout
- **POST** `/admin/logout`
- **Description:** Revoke current API token
- **Authentication:** Required (Bearer token)
- **Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Feedback Endpoints

### Submit Feedback (Public)
- **POST** `/feedback`
- **Description:** Submit new feedback/review
- **Authentication:** Not required
- **Rate Limit:** 10 requests per minute
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is my feedback text",
  "rating": 5
}
```
- **Response (201):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is my feedback text",
  "comment": "This is my feedback text",
  "rating": 5,
  "is_approved": false,
  "status": "pending",
  "created_at": "2026-02-09T10:00:00+00:00",
  "date": "2026-02-09T10:00:00+00:00",
  "updated_at": "2026-02-09T10:00:00+00:00"
}
```

### Get All Feedback (Admin)
- **GET** `/feedback`
- **Description:** List all feedback (paginated)
- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `sort` (default: 'date') - 'date' or 'rating'
  - `order` (default: 'desc') - 'asc' or 'desc'
  - `limit` (default: 15) - Items per page
  - `page` (default: 1) - Page number
- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Great product!",
      "rating": 5,
      "is_approved": true,
      "status": "approved",
      "created_at": "2026-02-09T10:00:00+00:00",
      "date": "2026-02-09T10:00:00+00:00",
      "updated_at": "2026-02-09T10:00:00+00:00"
    }
  ],
  "pagination": {
    "total": 42,
    "per_page": 15,
    "current_page": 1,
    "last_page": 3,
    "from": 1,
    "to": 15
  }
}
```

### Get Approved Feedback (Public)
- **GET** `/feedback/approved`
- **Description:** List only approved feedback visible to public
- **Authentication:** Not required
- **Query Parameters:**
  - `sort` (default: 'date') - 'date' or 'rating'
  - `order` (default: 'desc') - 'asc' or 'desc'
  - `limit` (default: 10) - Items per page
  - `page` (default: 1) - Page number
- **Response (200):** Same structure as Get All Feedback

### Get Feedback Statistics
- **GET** `/feedback/stats`
- **Description:** Get feedback statistics (cached for 5 minutes)
- **Authentication:** Not required
- **Response (200):**
```json
{
  "total": 42,
  "approved": 35,
  "pending": 7,
  "average_rating": 4.5,
  "totalFeedback": 42,
  "pendingReviews": 7,
  "approvedReviews": 35,
  "avgRating": 4.5,
  "thisWeekFeedback": 8,
  "lastWeekFeedback": 12,
  "totalReviews": 35,
  "totalUsers": 42,
  "responseRate": 83.3
}
```

### Update Feedback Status (Admin)
- **PATCH** `/feedback/{id}/status`
- **Description:** Approve or reject feedback
- **Authentication:** Required (Bearer token)
- **Request Body:**
```json
{
  "status": "approved"
}
```
- **Valid Statuses:** `approved`, `pending`, `hidden`
- **Response (200):** Feedback resource with updated status

### Delete Feedback (Admin)
- **DELETE** `/feedback/{id}`
- **Description:** Delete feedback (soft delete)
- **Authentication:** Required (Bearer token)
- **Response (200):**
```json
{
  "message": "Feedback deleted successfully"
}
```

---

## Settings Endpoints

### Get Settings (Admin)
- **GET** `/settings`
- **Description:** Get all settings
- **Authentication:** Required (Bearer token)
- **Response (200):**
```json
{
  "enablePublicReviews": true,
  "requireApproval": true,
  "enableEmailNotifications": true,
  "showRatingsBreakdown": true,
  "allowAnonymousReviews": true,
  "minimumRatingToShow": 1,
  "notification_email": "admin@example.com"
}
```

### Get Public Settings
- **GET** `/settings/public`
- **Description:** Get public-facing settings (no auth required)
- **Authentication:** Not required
- **Response (200):**
```json
{
  "enablePublicReviews": true,
  "requireApproval": true,
  "showRatingsBreakdown": true,
  "allowAnonymousReviews": true,
  "minimumRatingToShow": 1
}
```

### Update Settings (Admin)
- **PUT** `/settings`
- **Description:** Update application settings
- **Authentication:** Required (Bearer token)
- **Request Body:** (all fields optional)
```json
{
  "enablePublicReviews": true,
  "requireApproval": false,
  "enableEmailNotifications": true,
  "showRatingsBreakdown": true,
  "allowAnonymousReviews": false,
  "minimumRatingToShow": 3,
  "notification_email": "newemail@example.com"
}
```
- **Response (200):** Updated settings object

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 404 Not Found
```json
{
  "message": "Feedback not found."
}
```

### 422 Unprocessable Entity
```json
{
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."],
    "rating": ["The rating must be between 1 and 5."]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while [action]."
}
```

---

## Request/Response Format

- **Content-Type:** `application/json`
- **Dates:** ISO 8601 format (`2026-02-09T10:00:00+00:00`)
- **Pagination:** Default per_page is 15 for admin endpoints, 10 for public

---

## Example Usage

### Login and Get Token
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Use Token to Access Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/feedback \
  -H "Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz..."
```

### Submit Public Feedback
```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "message":"Great experience!",
    "rating":5
  }'
```

---

## Rate Limiting

- **Feedback submission endpoint:** 10 requests per minute per IP
- Other endpoints: Standard Laravel rate limiting

---

## Migration & Setup

Run migrations:
```bash
php artisan migrate
```

Seed default admin account:
```bash
php artisan db:seed --class=AdminSeeder
```

Credentials:
- Email: `admin@example.com`
- Password: `password123`

**⚠️ Change these credentials immediately in production!**
