# 🎓 LearnOpto — AI-Powered Smart Learning Hub

<p align="center">
  <img src="docs/images/Landing%20Page.png" alt="LearnOpto Hero Banner" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</p>

<p align="center">
  <strong>LearnOpto</strong> is an intelligent, personalized learning resource aggregator powered by Google Gemini AI. It instantly curates, validates, and prioritizes real-world learning materials — including YouTube videos, podcasts, articles, interactive courses, and official documentation.
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-ui-showcase">UI Showcase</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a>
</p>

---

## 📸 UI Showcase

### 🌐 Landing Page
Discover trending topics, features, and seamless onboarding.
<p align="center">
  <img src="docs/images/Landing%20Page.png" alt="LearnOpto Landing Page" width="100%" style="border-radius: 8px;" />
</p>

---

### ⚡ AI Dashboard
Search any subject, view live-validated resources, filter by media type, and track saved items.
<p align="center">
  <img src="docs/images/dashboard.png" alt="LearnOpto Dashboard" width="100%" style="border-radius: 8px;" />
</p>

---

### 🔐 Secure Authentication & Passkeys
Modern passwordless authentication with WebAuthn Passkeys, Google OAuth, and secure JWT sessions.
<p align="center">
  <img src="docs/images/Log-in-page.png" alt="LearnOpto Login Page" width="100%" style="border-radius: 8px;" />
</p>

---

## ✨ Key Features

- 🧠 **AI-Driven Resource Curation:** Generates tailored learning paths with real, live learning links powered by Google Gemini AI (`gemini-2.5-flash`).
- ⚡ **Multi-Key API Rotation & Failover:** Automatic load distribution and failover across up to 10 Gemini API keys to guarantee uptime and avoid quota limits.
- 🔗 **Real-Time Link Health Check:** Automatically verifies URLs via HEAD/GET requests before presenting them to users, filtering out dead links and hallucinations.
- 🔑 **Passwordless Passkeys & OAuth 2.0:** Support for biometric/hardware WebAuthn Passkeys alongside traditional login and Google Single Sign-On.
- 📊 **Learning Analytics & History:** Real-time metrics for searches, views, saved bookmarks, and custom media format preferences.
- ☁️ **Serverless PostgreSQL Database:** Powered by Prisma ORM and hosted on Neon DB serverless SQL.
- 🎨 **Neo-Brutalist & Modern UI:** Responsive interface crafted with React, Tailwind CSS, Framer Motion, and shadcn/ui.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) (built with [Vite](https://vitejs.dev/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State & Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)

### Backend
- **Server Environment:** [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) with TypeScript
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) / [Neon Serverless DB](https://neon.tech/) via [Prisma ORM](https://www.prisma.io/)
- **AI Engine:** [Google GenAI SDK](https://ai.google.dev/) (`gemini-2.5-flash`)
- **Authentication:** WebAuthn (`@simplewebauthn`), JWT (`jsonwebtoken`), `bcryptjs`
- **Security:** Rate limiting (`express-rate-limit`), Helmet security headers, CORS, Zod validation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **npm** or **pnpm**
- **PostgreSQL** instance (Local or [Neon Serverless DB](https://neon.tech))
- **Gemini API Key(s)** from [Google AI Studio](https://aistudio.google.com/)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/LearnOpto.git
   cd LearnOpto
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:8080

# Neon Serverless / PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@ep-something.neon.tech/neondb?sslmode=require"

# Gemini API Key Pool (Supports up to 10 keys for rotation)
GEMINI_API_KEY_1=your_gemini_api_key_1
GEMINI_API_KEY_2=your_gemini_api_key_2

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

### Database Migration

Push the database schema to your PostgreSQL / Neon DB instance:

```bash
cd backend
npx prisma db push
```

---

### Running the Application

Open two terminal windows to run both servers concurrently:

**1. Start the Backend API Server:**
```bash
cd backend
npm run dev
# Server running at http://localhost:3000
```

**2. Start the Frontend Client:**
```bash
cd frontend
npm run dev
# Application running at http://localhost:8080
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user with credentials |
| `POST` | `/api/auth/logout` | Terminate active user session |
| `GET` | `/api/auth/me` | Retrieve current authenticated user profile |
| `POST` | `/api/search` | Search and curate resources using Gemini AI |
| `GET` | `/api/search/history` | Fetch user's search history |
| `DELETE` | `/api/search/history/:id` | Delete a specific search query |
| `GET` | `/api/resources/saved` | List all saved resources |
| `POST` | `/api/resources/save` | Save a resource to personal library |
| `DELETE` | `/api/resources/save/:id` | Remove a resource from saved library |
| `GET` | `/api/user/analytics` | Retrieve learning analytics metrics |
| `POST` | `/api/user/preferences` | Update resource media format preferences |

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).
