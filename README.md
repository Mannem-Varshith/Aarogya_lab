# M-Aarogya (Pathology Lab) — Full Run Guide

This repository contains a React + Vite frontend (`Aarogya/`) and a Node/Express + MySQL backend (`backend/`).
This README explains how to set up the project from scratch, initialize the database (SQL), and run both frontend and backend for development and production.

## Project Concept

M-Aarogya is a lightweight pathology lab management system that connects patients, doctors and labs. The core goals are:

- Provide patients with a simple dashboard to view and download lab reports.
- Allow doctors to search patients and view patient reports.
- Let authorized lab users upload test reports and update report statuses.
- Provide an Admin panel to manage users, approve registrations for doctors/labs, and view system statistics.

The app is split into a frontend single-page application (React) and a RESTful backend (Express + MySQL). The backend exposes APIs for authentication, report upload, patient management and admin operations. The frontend consumes those APIs and provides role-based UI flows.

## Tech Stack

- Frontend: Vite, React, TypeScript (mix of .tsx and .jsx files), Tailwind-like utility-first classes (project uses utility classes in components)
- UI / Components: Radix UI primitives and custom components under `src/components/ui`
- Icons: `lucide-react`
- State / Data fetching: React + optional react-query (present in package.json)
- Backend: Node.js, Express.js
- Database: MySQL (mysql2 driver). Schema available in `backend/src/config/schema.sql` and backend attempts auto-creation on startup.
- Authentication: JWT (jsonwebtoken) and bcryptjs for password hashing
- File uploads: `multer` — uploaded files stored under `uploads/`
- Development tooling: Vite (frontend), nodemon (backend dev), http-server (optional static preview)

---

## Contents
- `Aarogya/` — Frontend (Vite + React + TypeScript)
- `backend/` — Backend (Node, Express, MySQL)

---

## Prerequisites

- Node.js 16+ and npm (or Yarn)
- MySQL Server (or compatible, e.g. MariaDB)
- Git

Optional helpful tools:
- `npx http-server` (for quickly serving `dist`), `mysql` CLI client, and browser DevTools.

---

## Quick overview — steps

1. Install dependencies for both frontend and backend
2. Configure backend environment variables (`backend/.env`)
3. Create the database schema (either using the provided SQL or let the backend initialize it)
4. Start the backend server
5. Start the frontend dev server
6. (Optional) Run `node src/scripts/createAdmin.js` to create an admin user

---

## 1) Clone repository

```powershell
git clone <repo-url> Aarogya_lab
cd Aarogya_lab
```

Replace `<repo-url>` with the remote URL.

---

## 2) Backend setup (MySQL + Node)

1. Open a terminal and change into the backend folder:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Create a `.env` file in the `backend/` folder (the backend will load `backend/.env`). Example `.env` contents:

```env
# backend/.env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456789
DB_NAME=m_aarogya
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
```

Adjust `DB_PASSWORD` and other values for your environment. The database.js file logs helpful diagnostics if the connection fails.

4. Initialize the database schema (two options):

- Option A — Let the backend initialize schema automatically (recommended for development):
  - The server runs a `testConnection()` on startup that will create the database and necessary tables if they don't exist. Just start the server (next step) and watch the logs.

- Option B — Run the SQL manually using the MySQL client:
  - From a terminal where `mysql` CLI is available:

```powershell
mysql -u root -p < src/config/schema.sql
```

  - If you have schema updates later, run:

```powershell
mysql -u root -p < src/config/schema_updates.sql
```

5. Start the backend server (development):

```powershell
npm run dev
```

Or for production:

```powershell
npm start
```

You should see a message like `Server is running on port 3000` and the backend will be available at `http://localhost:3000` by default.

6. (Optional) Create the admin user (creates/updates admin with password `Admin@123`):

```powershell
# run from backend/ folder
node src/scripts/createAdmin.js
```

---

## 3) Frontend setup (Vite + React)

1. Open a new terminal and change into frontend folder:

```powershell
cd Aarogya
```

2. Install frontend dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

By default Vite will try to use port `5173`. If that port is in use it will pick the next free port (e.g. `5174`). The terminal will show the exact URL, e.g. `http://localhost:5173/`.

4. Build for production (optional):

```powershell
npm run build
npm run preview   # preview the production build (uses vite preview)
```

If you want to serve `dist` with a static server (for local checks):

```powershell
# from project root
cd Aarogya
npx http-server ./dist -p 5173
```

---

## 4) Running frontend + backend together

- Start the backend first (`backend/`: `npm run dev`) to ensure APIs are reachable.
- Start the frontend (`Aarogya/`: `npm run dev`).
- Open the frontend URL shown by Vite (usually `http://localhost:5173`).

Use two terminals (or a terminal multiplexer) — one for backend and one for frontend.

---

## 5) Database notes

- The backend uses `mysql2` and the file `backend/src/config/database.js` tries to create the database and tables automatically on startup via `testConnection()`; running the SQL manually is optional.
- SQL schema is available at `backend/src/config/schema.sql`.
- If you get permission errors, check that your MySQL server is running and that the credentials in `backend/.env` are correct.

Common MySQL troubleshooting hints:
- If you see `ER_ACCESS_DENIED_ERROR` try:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

---

## 6) Admin panel

- Admin routes are available under `/admin` in the frontend (e.g. `http://localhost:5173/admin/login`).
- Use `node src/scripts/createAdmin.js` (from `backend/`) to create/update the admin account.

---

## 7) Troubleshooting & common issues

- Blank white screen in browser:
  - Open DevTools (F12) → Console. Paste the first error here.
  - Example fix: `Uncaught Error: You cannot render a <Router> inside another <Router>` happens when the app mounts nested `BrowserRouter` instances. Fix: remove the extra `BrowserRouter` from `src/App.tsx` (the root `src/main.tsx` already wraps the app).

- Ports in use:
  - If Vite says `Port 5173 is in use, trying another one...`, either visit the new port shown, or free port 5173 (kill the process using it) and restart.

- Backend DB connection errors:
  - Double-check `backend/.env` and that MySQL is running and reachable.

---

## 8) Useful commands summary

- Frontend
  - Install: `cd Aarogya && npm install`
  - Dev: `npm run dev` (from `Aarogya`)
  - Build: `npm run build` (from `Aarogya`)

- Backend
  - Install: `cd backend && npm install`
  - Dev server: `npm run dev` (from `backend`)
  - Start: `npm start` (from `backend`)
  - Create admin: `node src/scripts/createAdmin.js` (from `backend`)

---

## 9) Where to look next

- Frontend source: `Aarogya/src`
- Backend source: `backend/src`
- DB schema: `backend/src/config/schema.sql`

If you want, I can add a top-level convenience script (for example a single `run-dev` PowerShell script) that starts both servers in parallel. Tell me if you'd like that and whether you'd prefer a cross-platform solution (npm package `concurrently`) or a simple PowerShell-only script.

---

If anything fails while following this guide, paste the exact terminal output or browser console error and I will help fix it.

Happy hacking! 🚀
