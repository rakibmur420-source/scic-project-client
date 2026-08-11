# Market — Frontend (Next.js)

A small e-commerce storefront built to consume the SCIC/EJP-13 backend API.

## Live Links

| | |
|---|---|
| **Live Site** | https://scic-project-client.vercel.app/ |
| **GitHub Repository** | https://github.com/rakibmur420-source/scic-project-client |
| **Backend API (live)** | https://scic-project-server.onrender.com |
| **Backend Repository** | https://github.com/rakibmur420-source/scic-project-server |

> Note: the backend is hosted on Render's free tier, which sleeps after inactivity. The first request after idle time may take 30–50 seconds while it wakes up.

## Test / Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@123` |
| Role | ADMIN |

Log in with these on the live site to access `/admin/products` and add/remove products.

## Features
- Product catalog with search + category filter
- Product detail page with reviews (add review, average rating)
- Cart (persisted in localStorage) → checkout → creates a real order via the backend
- JWT auth: register/login, token stored and sent on every API request
- My Orders page (receipt-style order history)
- Admin page (`/admin/products`) to add/delete products — visible only to `ADMIN` role users

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Point it at the backend
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Set `NEXT_PUBLIC_API_URL`:
- Local backend: `http://localhost:5000/api`
- Live backend: `https://scic-project-server.onrender.com/api`

### 3. Run the dev server
```bash
npm run dev
```
Opens at `http://localhost:3000`.

## Test flow
1. Register a new account (or log in as admin above).
2. Browse products, open one, leave a review.
3. Add to cart, check out — creates a real order (stock decrements on the backend).
4. Visit "My Orders" to see it.
5. As admin, visit `/admin/products` to add or remove products — changes reflect immediately in the catalog.

## Deployment (Vercel)
1. Import this repo into Vercel.
2. Set environment variable `NEXT_PUBLIC_API_URL` = `https://scic-project-server.onrender.com/api`.
3. Deploy — Vercel auto-detects Next.js, no other config needed.
