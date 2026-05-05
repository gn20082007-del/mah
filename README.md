# 📰 Mahoko Friday News — Full Stack Application

**React.js + Node.js + MongoDB**  
*Make Youth's Voice Be Heard* — Rwanda's youth news platform

---

## 🗂 Project Structure

```
mfn/
├── backend/          # Node.js + Express + MongoDB API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route handlers
│   ├── middleware/   # Auth + upload middleware
│   ├── server.js     # Express entry point
│   ├── db.js         # MongoDB connection
│   └── seed.js       # Database seeder
└── frontend/         # React.js app
    └── src/
        ├── components/
        │   ├── layout/   # PublicLayout, AdminLayout
        │   └── ui/       # Reusable components
        ├── context/      # AuthContext
        ├── hooks/        # Custom hooks
        ├── pages/
        │   ├── public/   # Home, Story, Category, Search, Author, Videos
        │   └── admin/    # Dashboard, Stories, Authors, Comments, Videos, Ads, Settings
        └── utils/        # Axios API client
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** v6+ (local or Atlas)

---

### 1 — Clone & Install

```bash
# Backend
cd mfn/backend
cp .env.example .env          # Edit with your MongoDB URI and JWT secret
npm install

# Frontend
cd mfn/frontend
npm install
```

---

### 2 — Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mfn_news
JWT_SECRET=your_very_long_secret_key_here_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Edit `frontend/.env` (create it):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 3 — Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin user**: username `Gerard banya`, password `admin123`  
- Sample stories across all categories  
- Default author

---

### 4 — Start Development

**Backend** (Terminal 1):
```bash
cd backend
npm run dev       # Starts on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start         # Starts on http://localhost:3000
```

---

## 🔐 Default Admin Login

| Field | Value |
|-------|-------|
| URL | http://localhost:3000/admin/login |
| Username | `Gerard banya` |
| Password | `admin123` |

> ⚠️ **Change the password** immediately after first login via Settings → Change Password.

---

## 🌐 Pages & Routes

### Public
| Route | Page |
|-------|------|
| `/` | Home — hero, latest, categories, sidebar |
| `/story/:id` | Full story with comments, reactions, share |
| `/category/:category` | Category listing with pagination |
| `/search?q=…` | Full-text search |
| `/author/:name` | Author profile & their stories |
| `/videos` | Video library (YouTube embeds) |
| `/about` | About MFN |
| `/contact` | Contact form |
| `/subscribe` | Newsletter signup |
| `/privacy` | Privacy policy |

### Admin (protected — requires login)
| Route | Page |
|-------|------|
| `/admin/dashboard` | Analytics overview |
| `/admin/stories` | Stories list with filters |
| `/admin/stories/new` | Create new story |
| `/admin/stories/edit/:id` | Edit existing story |
| `/admin/authors` | Author management |
| `/admin/comments` | Comment moderation |
| `/admin/videos` | Video management |
| `/admin/ads` | Advertisement management |
| `/admin/subscribers` | Newsletter subscribers |
| `/admin/audit` | Security audit logs |
| `/admin/settings` | Password, users, site info |

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/login            Login
GET    /api/auth/me               Current user
PUT    /api/auth/change-password  Change password
GET    /api/auth/users            List admins (Admin only)
POST   /api/auth/users            Create admin (Admin only)
```

### Stories
```
GET    /api/stories               List (filter: category, search, page, status)
GET    /api/stories/stats/popular Most viewed
GET    /api/stories/:id           Single story (increments views)
POST   /api/stories               Create (auth required)
PUT    /api/stories/:id           Update (auth required)
DELETE /api/stories/:id           Delete (Admin only)
POST   /api/stories/:id/react     Like/dislike
```

### Authors
```
GET    /api/authors               All authors with story counts
GET    /api/authors/:id           Single author
GET    /api/authors/:id/stories   Author's stories
POST   /api/authors               Create (auth)
PUT    /api/authors/:id           Update (auth)
DELETE /api/authors/:id           Delete (Admin)
```

### Comments
```
GET    /api/comments              All (admin, filter by status)
GET    /api/comments/story/:id    Approved comments for story
POST   /api/comments              Submit comment (public)
PUT    /api/comments/:id/approve  Approve (Moderator+)
PUT    /api/comments/:id/spam     Mark spam (Moderator+)
DELETE /api/comments/:id          Delete (Moderator+)
```

### Other
```
GET    /api/videos                Video list
POST   /api/videos                Add video (auth)
DELETE /api/videos/:id            Delete video (Admin)

GET    /api/ads                   Active ads (public)
GET    /api/ads/all               All ads (admin)
POST   /api/ads                   Create ad (Admin)
PUT    /api/ads/:id/toggle        Toggle active (Admin)
DELETE /api/ads/:id               Delete ad (Admin)

POST   /api/subscribe             Subscribe to newsletter
GET    /api/subscribers           All subscribers (admin)

GET    /api/analytics/overview    Dashboard stats (admin)
GET    /api/audit-logs            Audit trail (Admin)
GET    /api/breaking              Breaking news ticker
```

---

## 🛡 Role Permissions

| Permission | Admin | Editor | Journalist | Moderator |
|-----------|-------|--------|-----------|-----------|
| Publish story | ✅ | ✅ | ✅ | ❌ |
| Edit story | ✅ | ✅ | ❌ | ❌ |
| Delete story | ✅ | ❌ | ❌ | ❌ |
| Manage authors | ✅ | ✅ | ❌ | ❌ |
| Approve comments | ✅ | ✅ | ❌ | ✅ |
| Delete comments | ✅ | ❌ | ❌ | ✅ |
| Manage ads | ✅ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ | ❌ |

---

## 🐳 Docker (Optional)

```bash
cd mfn
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 3000

---

## 🚀 Production Deployment

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend Build
```bash
cd frontend
npm run build
# Serve the `build/` folder with nginx or any static host
```

### MongoDB Atlas (Cloud)
Replace `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/mfn_news
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| State | Context API + useState |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (jsonwebtoken) |
| Passwords | bcryptjs |
| File Upload | Multer |
| Security | Helmet, express-rate-limit, CORS |

---

## 📞 Contact

**Mahoko Friday News**  
📧 mahokofridaynews@gmail.com  
📞 +250 739 903 542  
📍 Kigali, Rwanda  

Developed by **Gerard** — Make Youth's Voice Be Heard 🎙️
