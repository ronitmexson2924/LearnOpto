# LearnOpto

LearnOpto is an AI-powered study assistant designed to resolve all your learning needs. It curates high-quality YouTube videos, podcasts, documentation, and online courses based on your queries to provide a customized learning experience.

## Features

- **AI-Powered Search & Curation:** Find the best resources tailored to your learning goals using Google GenAI.
- **Passkey Authentication:** Secure, passwordless login using WebAuthn.
- **Resource Management:** Save and organize your favorite learning materials.
- **Learning Analytics:** Keep track of your search history and resource interactions.
- **Modern User Interface:** Built with a beautiful, neo-brutalist inspired UI utilizing React, Tailwind CSS, and shadcn/ui.

## Tech Stack

### Frontend
- **Framework:** React with TypeScript (via Vite)
- **Styling:** Tailwind CSS, Framer Motion
- **UI Components:** shadcn/ui, Radix UI
- **Routing:** React Router

### Backend
- **Framework:** Node.js, Express
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Authentication:** SimpleWebAuthn (Passkeys), JWT
- **AI Integration:** Google GenAI SDK

### Database
- **Engine:** PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/)

## Local Development Setup

### 1. Clone the repository

If you haven't already, clone the repository to your local machine:
```bash
git clone <repository-url>
cd learn-opto
```

### 2. Install Dependencies

Install the dependencies for both the frontend and the backend.

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory and configure the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:8080
DATABASE_URL="postgresql://username:password@localhost:5432/learn-opto"
```

### 4. Database Setup

Ensure your PostgreSQL server is running. Then, push the database schema using Prisma:

```bash
cd backend
npx prisma db push
```

### 5. Start the Development Servers

You will need to run the frontend and backend servers concurrently.

**Start the Backend:**
```bash
cd backend
npm run dev
```
The backend server will typically run on `http://localhost:3000`.

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
The frontend Vite server will typically run on `http://localhost:8080`.

## License

This project is licensed under the ISC License.
