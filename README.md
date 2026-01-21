# APNISEC - Next-Gen Security Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-apnisecz.netlify.app-00f3ff?style=for-the-badge&logo=netlify)](https://apnisecz.netlify.app/)

![Version](https://img.shields.io/badge/version-1.0.0-cyan.svg)
![Stack](https://img.shields.io/badge/Next.js-15-black)
![Database](https://img.shields.io/badge/PostgreSQL-Supabase-green)
![Style](https://img.shields.io/badge/Style-Cyberpunk-pink)

**ApniSec** is a cutting-edge cybersecurity platform backend built with **Next.js**, **Prisma**, and **Supabase**. It features a high-performance, dark-themed cyberpunk UI with advanced authentication, optimized animations, and a secure dashboard architecture.

---

## 🚀 Features

* **⚡ High-Performance UI:** Optimized animations utilizing `content-visibility` and GPU layering for 90+ Lighthouse scores.
* **🔐 Secure Authentication:** JWT-based robust login/signup system with hashed passwords (bcrypt).
* **🎨 Cyberpunk Aesthetic:** Custom SCSS modules with neon glows, glassmorphism, and GPU-accelerated effects.
* **🗄️ Database ORM:** Managed via Prisma with a scalable PostgreSQL connection (Supabase).
* **📱 Responsive Design:** Fully adaptive layouts for Desktop, Tablet, and Mobile.
* **🛡️ Type Safety:** Built entirely with TypeScript for reliability and maintainability.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (Stable)](https://nextjs.org/)
* **Language:** TypeScript
* **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
* **ORM:** [Prisma](https://www.prisma.io/)
* **Styling:** SCSS Modules & Tailwind CSS
* **Deployment:** Netlify

---
```
Getting Started
Follow these steps to set up the project locally.
1. Clone the Repository
2. git clone [https://github.com/your-username/apnisec-backend.git](https://github.com/your-username/apnisec-backend.git)
cd apnisec-backend
```
```
3. Install Dependencies
npm install
4. Configure Environment Variables
Create a .env file in the root directory (refer to .env.example). Add your Supabase connection string:
```
```
# Supabase Transaction Pooler String (Recommended for Serverless)
# Go to Supabase > Settings > Database > Connection Pooling
DATABASE_URL="postgres://postgres.xxxx:[password]@[aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true)"
# Security (Generate a random string: openssl rand -base64 32)
JWT_SECRET="your_super_secret_random_key_here"
# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
```
4. Setup Database
Push the schema to Supabase:
npx prisma generate
npx prisma db push
5. Run Development Server
npm run dev
```
## 📂 Project Structure

```text
apnisec-backend/
├── prisma/               # Database Schema
├── public/               # Static assets (images, icons)
├── src/
│   ├── app/              # Next.js App Router Pages
│   │   ├── api/          # Backend API Routes (Auth, Services)
│   │   ├── login/        # Login Page
│   │   ├── register/     # Registration Page
│   │   ├── home.module.scss  # Core Animation Styles
│   │   └── page.tsx      # Landing Page
│   ├── components/       # Reusable UI Components (Navbar, etc.)
│   └── lib/              # Utilities (AuthService, PrismaClient)
├── .env.example          # Template for environment variables
├── next.config.ts        # Next.js Configuration
└── package.json          # Dependencies & Scripts
