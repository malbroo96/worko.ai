# Candidate Referral Management System

Full-stack referral management platform with role-based JWT authentication.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, Tailwind CSS utilities
- Auth: JWT (`candidate`, `admin` roles)
- File Upload: Multer + Cloudinary (PDF resumes)

## Project Structure

```text
worko.ai/
  referral-backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    server.js
  referral-frontend/
    src/
      components/
      utils/
      App.jsx
      main.jsx
```

## Features

- Candidate signup/login
- Admin login
- JWT-protected API routes
- Role-based access control
- Candidate creates referrals with optional PDF resume upload
- Admin reviews referrals and updates status
- Dashboard with metrics and referral table

## Backend Setup (`referral-backend`)

### 1. Install dependencies

```bash
cd referral-backend
npm install
```

### 2. Configure environment

Create `.env` from `.env.example` and set real values:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_EMAIL=admin@worko.ai
ADMIN_PASSWORD=Admin@123

# Comma-separated origins allowed by CORS
FRONTEND_URLS=https://workoai-eight.vercel.app,http://localhost:5173
```

### 3. Run backend

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

Health check:

```text
GET /health
```

## Frontend Setup (`referral-frontend`)

### 1. Install dependencies

```bash
cd referral-frontend
npm install
```

### 2. Configure environment

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, set:

```env
VITE_API_BASE_URL=https://worko-ai-1-fdx6.onrender.com/api
```

### 3. Run frontend

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Authentication and Roles

- `candidate`
  - signup/login
  - create referrals
  - view own referrals
- `admin`
  - login
  - view all referrals
  - update referral status

Admin user is auto-seeded at backend startup if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are present.

## API Endpoints

Base URL: `/api`

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (protected)

### Referrals

- `POST /referrals` (protected, `candidate`, multipart/form-data)
- `GET /referrals` (protected, role-aware)
- `PATCH /referrals/:id/status` (protected, `admin`)

## Deployment

### Backend (Render)

- Root: `referral-backend`
- Build command: `npm install`
- Start command: `npm start`
- Set all backend env vars in Render dashboard.

### Frontend (Vercel)

- Root: `referral-frontend`
- Set env var:

```env
VITE_API_BASE_URL=https://worko-ai-1-fdx6.onrender.com/api
```

- Redeploy after env updates.

## Important Security Notes

- Never commit `.env` files.
- Rotate any secrets that were exposed (MongoDB, Cloudinary, JWT secret).
- Use strong random values for `JWT_SECRET`.

## Troubleshooting

- `403 Not allowed by CORS`
  - Check `FRONTEND_URLS` in backend env and redeploy.
- `401 Invalid or expired token`
  - Login again and retry.
- Resume upload errors
  - Verify Cloudinary env vars and that file is PDF under size limit.
- Frontend cannot reach backend
  - Verify `VITE_API_BASE_URL` in frontend deployment settings.