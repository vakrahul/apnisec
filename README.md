#  APNISEC - Next-Gen Security Platform

![Version](https://img.shields.io/badge/version-1.0.0-cyan.svg)
![Stack](https://img.shields.io/badge/Next.js-15-black)
![Database](https://img.shields.io/badge/PostgreSQL-Supabase-green)
![Style](https://img.shields.io/badge/Style-Cyberpunk-pink)

**ApniSec** is a cutting-edge cybersecurity platform backend built with **Next.js**, **Prisma**, and **PostgreSQL**. It features a high-performance, dark-themed cyberpunk UI with advanced authentication, optimized animations, and a secure dashboard architecture.

---

## 🚀 Features

* **⚡ High-Performance UI:** Optimized animations aiming for 90+ Lighthouse score.
* **🔐 Secure Authentication:** JWT-based robust login/signup system with hashed passwords (bcrypt).
* **🎨 Cyberpunk Aesthetic:** Custom SCSS modules with neon glows, glassmorphism, and GPU-accelerated effects.
* **🗄️ Database ORM:** Managed via Prisma with a scalable PostgreSQL connection (Supabase).
* **📱 Responsive Design:** Fully adaptive layouts for Desktop, Tablet, and Mobile.
* **🛡️ Type Safety:** Built entirely with TypeScript for reliability.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (Stable)](https://nextjs.org/)
* **Language:** TypeScript
* **Database:** PostgreSQL (via [Supabase](https://supabase.com/))
* **ORM:** [Prisma](https://www.prisma.io/)
* **Styling:** SCSS Modules & Tailwind CSS
* **Deployment:** Netlify / Vercel

 ```bash
2. Install Dependencies
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add your Supabase connection string:
# Supabase Transaction Pooler String (Recommended for Serverless)
# Go to Supabase > Settings > Database > Connection Pooling
DATABASE_URL="postgres://postgres.xxxx:[password]@[aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true)"
# Security
JWT_SECRET="your_super_secret_random_key_here"
```
# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```bash
4. Setup Database
Push the schema to Supabase:
npx prisma generate
npx prisma db push
5. Run Development Server
npm run dev
```
---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/apnisec-backend.git](https://github.com/your-username/apnisec-backend.git)
cd apnisec-backend
```

<p align="center"> Built with ❤️ by <strong>Rahul Vakiti With Intrest and passion</strong> </p> 
