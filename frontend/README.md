# Rivio - Customer Feedback & Reputation Management System

A modern React.js frontend for managing customer feedback and reputation.

## 🎨 Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Orange | `#FF7F16` | Accents, footers, highlights |
| Primary Dark (Navy) | `#08062A` | Buttons, headings |
| White | `#FFFFFF` | Backgrounds |
| Off-White | `#FAFBFD` | Page backgrounds |
| Light Gray | `#E7E9ED` | Borders, dividers |
| Slate | `#64748B` | Secondary text |
| Dark Gray | `#23272E` | Body text |

## 📁 Project Structure

```
rivio/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.jsx
│   │   │   └── AdminSidebar.jsx
│   │   └── common/
│   │       ├── FeedbackForm.jsx
│   │       ├── Footer.jsx
│   │       ├── Navbar.jsx
│   │       └── StarRating.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── UserLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FeedbackManagement.jsx
│   │   │   └── Settings.jsx
│   │   └── user/
│   │       ├── FeedbackSubmission.jsx
│   │       ├── Home.jsx
│   │       └── PublicReviews.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd rivio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Pages

### User Portal

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section and stats |
| Submit Feedback | `/submit-feedback` | Feedback submission form |
| Public Reviews | `/reviews` | List of approved reviews |

### Admin Portal

| Page | Route | Description |
|------|-------|-------------|
| Login | `/admin/login` | Admin authentication |
| Dashboard | `/admin/dashboard` | Overview stats and recent reviews |
| Feedback Management | `/admin/feedback` | Approve, hide, delete reviews |
| Settings | `/admin/settings` | System configuration |

## 🔌 API Integration

The project is prepared for Laravel backend integration. Update the `VITE_API_URL` in `.env` to point to your Laravel API.

### Demo Credentials

- Username: `admin`
- Password: `admin123`

## 🛠️ Built With

- **React 18** - UI Library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP Client
- **Vite** - Build Tool

## 📱 Features

- ✅ Responsive design (mobile-first)
- ✅ Star rating component
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Search and filtering
- ✅ Sorting functionality
- ✅ Toggle switches for settings
- ✅ Prepared for API integration

## 📜 License

This project is proprietary software.
