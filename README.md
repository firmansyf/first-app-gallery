# FirstMate

A private photo gallery and portfolio platform with an admin dashboard for tracking visitor analytics and receiving messages. Built with Next.js 16, React 19, and SQLite.

## Features

- **Public Gallery** -- Grid view of uploaded photos and videos for visitors
- **Post Detail View** -- Full-screen media viewer with automatic view tracking
- **Admin Dashboard** -- Stats overview (total views, posts, unread messages) with per-post visitor analytics (IP, browser, OS, location)
- **Message Inbox** -- Floating chat widget lets visitors send messages; admin can read, reply, and delete
- **Post Creation** -- Upload images/videos with optional text, geolocation (auto-detected + reverse geocoded via Nominatim)
- **Profile Management** -- Update display name and avatar
- **View Analytics** -- Tracks visitor IP, user agent, country, and city with hourly deduplication
- **Auth** -- JWT-based cookie authentication, single admin user (no public registration)

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Next.js 16 (App Router)                |
| Frontend    | React 19, TypeScript, Tailwind CSS 4   |
| Database    | SQLite via better-sqlite3               |
| ORM         | Prisma 7                                |
| Auth        | JWT (jsonwebtoken) + bcryptjs           |
| File Upload | Local filesystem (`/public/uploads/`)   |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Seed the admin user
npx prisma db seed
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | `admin@firstmate.app`|
| Password | `admin123`           |

> Change these credentials in production.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, logout, session (register disabled)
│   │   ├── messages/      # Public send + admin CRUD
│   │   ├── posts/         # CRUD with pagination
│   │   ├── views/         # View tracking + analytics
│   │   ├── upload/        # File upload
│   │   └── profile/       # Profile update
│   ├── admin/             # Dashboard + messages inbox
│   ├── components/        # AuthProvider, Navbar, Gallery, Feed, ChatWidget, etc.
│   ├── login/             # Admin login page
│   ├── profile/           # Edit profile page
│   ├── post/[id]/         # Post detail page
│   └── page.tsx           # Gallery (public) / Feed (authenticated)
├── lib/
│   ├── auth.ts            # JWT helpers
│   └── prisma.ts          # Prisma client singleton
└── generated/prisma/      # Auto-generated Prisma types

prisma/
├── schema.prisma          # Data models (User, Post, View, Message)
├── seed.ts                # Admin user seeder
└── migrations/            # Migration history
```

## API Routes

| Method | Route                | Auth     | Description                     |
|--------|----------------------|----------|---------------------------------|
| POST   | `/api/auth/login`    | Public   | Login, returns JWT cookie       |
| POST   | `/api/auth/logout`   | Public   | Clear session cookie            |
| GET    | `/api/auth/me`       | Required | Get current user                |
| GET    | `/api/posts`         | Public   | List posts (cursor pagination)  |
| POST   | `/api/posts`         | Required | Create a post                   |
| GET    | `/api/posts/[id]`    | Public   | Get single post                 |
| DELETE | `/api/posts/[id]`    | Required | Delete own post                 |
| POST   | `/api/messages`      | Public   | Send a message                  |
| GET    | `/api/messages`      | Required | List all messages               |
| PATCH  | `/api/messages/[id]` | Required | Mark read / reply               |
| DELETE | `/api/messages/[id]` | Required | Delete message                  |
| POST   | `/api/upload`        | Required | Upload image/video              |
| PUT    | `/api/profile`       | Required | Update name / avatar            |
| POST   | `/api/views`         | Public   | Track a post view               |
| GET    | `/api/views`         | Required | View analytics                  |

## Database Models

- **User** -- Admin account (username, email, password hash, avatar)
- **Post** -- Media content with optional text, geolocation, and location name
- **View** -- Per-post visitor analytics (IP, user agent, country, city, timestamp)
- **Message** -- Visitor messages with read status and optional admin reply

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```
