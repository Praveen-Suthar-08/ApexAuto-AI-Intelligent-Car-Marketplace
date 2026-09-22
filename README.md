# 🚗 ApexAuto AI — Intelligent Car Marketplace & Test Drive Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20Vision-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![ArcJet](https://img.shields.io/badge/ArcJet-Bot%20%26%20Rate%20Limit-000000?style=for-the-badge)](https://arcjet.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **ApexAuto AI** is a state-of-the-art full-stack automotive marketplace web application that brings artificial intelligence directly into car shopping. Featuring Google Gemini AI-driven computer vision search, real-time dealership inventory filtering, multi-slot test drive reservation management, dynamic role-based access control, and ArcJet cyber defense.

---

## 👨‍💻 Project Information & Author

- **Author**: **Praveen Suthar**
- **Repository**: [https://github.com/Praveen-Suthar-08/ApexAuto-AI-Intelligent-Car-Marketplace.git](https://github.com/Praveen-Suthar-08/ApexAuto-AI-Intelligent-Car-Marketplace.git)
- **Framework**: Next.js 15 (App Router with Turbopack support)

---

## ✨ Key Features & Capabilities

### 🔍 1. AI-Powered Visual Vehicle Search (Gemini Vision)
- Upload or drag-and-drop any car photo (JPEG, PNG, WEBP).
- Google Gemini multi-modal Vision model analyzes the image on the fly to detect **Make**, **Body Type** (SUV, Sedan, Hatchback, Convertible), and **Dominant Exterior Color**.
- Instantly matches and filters existing dealership inventory with zero manual query typing.

### 🚘 2. Dynamic Car Catalog & Multi-Criteria Filtering
- Filter by Price Range slider, Manufacturer/Make, Fuel Type (Gasoline, Electric, Hybrid, Diesel), Transmission (Automatic, Manual), and Body Class.
- High-performance server-side rendering combined with client-side reactive updates.
- Real-time car bookmarking/wishlist system with Clerk-authenticated synchronization.

### 📅 3. Real-Time Test Drive Scheduling & Reservation Ledger
- Interactive booking calendar synchronized with dealership working hours and existing slot availability.
- Conflict prevention: Prevents overlapping bookings on the same vehicle.
- Customer dashboard for tracking status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).

### 🛡️ 4. Enterprise Security & Attack Mitigation (ArcJet)
- Bot detection and rate limiting enabled across sensitive API routes.
- Protection against credential stuffing and automated scraping attacks.

### ⚡ 5. Executive Admin Management Portal
- Comprehensive KPI Dashboard: Total vehicles in fleet, active test drive requests, conversion metrics, and revenue charts.
- Vehicle inventory CRUD: Create new listings with Supabase multi-image drag-and-drop uploads.
- Working hour configurations per day of the week with slot capacity control.
- Role management: Grant or revoke administrative access to registered users.

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
    Client["Browser / Client (Next.js 15 + React 19 + TailwindCSS)"]
    Clerk["Clerk Authentication & RBAC"]
    ServerActions["Next.js Server Actions & App Router API"]
    Gemini["Google Gemini AI (Vision Model)"]
    ArcJet["ArcJet Security Engine"]
    Prisma["Prisma ORM"]
    Postgres["Supabase PostgreSQL Database"]
    SupaStorage["Supabase Object Storage (Car Photos)"]

    Client -->|Auth State| Clerk
    Client -->|Secure Requests| ArcJet
    ArcJet --> ServerActions
    ServerActions -->|Image Analysis| Gemini
    ServerActions -->|Data Operations| Prisma
    Prisma --> Postgres
    Client -->|Direct CDN Image Stream| SupaStorage
    ServerActions -->|Image Uploads| SupaStorage
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | High-speed Server Components & modern layout routing |
| **UI & Styling** | **TailwindCSS, Radix UI & Sonner** | Glassmorphism design tokens, accessible dialogs & toasts |
| **Authentication** | **Clerk** | Secure OAuth, user profiles, session validation, and RBAC |
| **Database & ORM** | **PostgreSQL (Supabase) + Prisma** | Strongly typed schema, relational models & indexing |
| **AI Neural Engine** | **Google Gemini AI SDK** | Multi-modal visual recognition & automotive attribute extraction |
| **Asset Storage** | **Supabase Storage** | High-throughput vehicle media hosting |
| **App Security** | **ArcJet** | Shielding against scrapers, DDOS, and abusive automated bots |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Praveen-Suthar-08/ApexAuto-AI-Intelligent-Car-Marketplace.git
cd AI-Car-Marketplace/ai-car-marketplace-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root of the project:

```env
# Database Connections (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Storage Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Google Gemini AI Key
GEMINI_API_KEY=AIzaSy...

# ArcJet Security Key
ARCJET_KEY=ajkey_...
```

### 4. Initialize Database Schema
Generate Prisma client and push your schema to the Supabase database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience **ApexAuto AI**.

---

## 📂 Project Directory Structure

```plaintext
ai-car-marketplace-main/
├── actions/              # Next.js Server Actions (car-listing, admin, settings, etc.)
├── app/
│   ├── (admin)/          # Dedicated Admin Dashboard & Inventory Management
│   ├── (auth)/           # Clerk Sign-in & Sign-up authentication pages
│   ├── (main)/           # Core customer views (cars, car details, test-drive, saved)
│   ├── globals.css       # Design tokens, custom animations & glassmorphic mesh
│   ├── layout.js         # Root Layout, global branding & custom footer
│   └── page.js           # Interactive Hero, stats & category discovery
├── components/
│   ├── ui/               # Radix UI + Tailwind primitive components
│   ├── car-card.jsx      # High-end vehicle card with quick-view and wishlist
│   ├── header.jsx        # Glassmorphic responsive navigation header
│   └── home-search.jsx   # AI Vision drag-and-drop search + trending pills
├── lib/                  # Utilities, Prisma client singleton, and Clerk user checks
├── prisma/
│   └── schema.prisma     # Relational database schema definition
└── public/               # Vehicle assets, manufacturer badges, and logos
```

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 💬 Acknowledgments & Contact

Crafted with care by **Praveen Suthar**  
GitHub: [@Praveen-Suthar-08](https://github.com/Praveen-Suthar-08)  
Repository: [AI-Car-Marketplace](https://github.com/Praveen-Suthar-08/ApexAuto-AI-Intelligent-Car-Marketplace.git)
