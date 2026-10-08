# 📋 Project Commands & Run Guide

Quick reference for all operational commands used to set up, configure, build, and run the **ApexAuto AI** application.

---

## ⚡ Quick Run (One-Click)

From the project root:
- **Windows Command Prompt / Double-click**: Run [`run-dev.bat`](file:///c:/Praveen/Projects/AI_Car_MarketPlace/run-dev.bat)
- **PowerShell**: Run [`run-dev.ps1`](file:///c:/Praveen/Projects/AI_Car_MarketPlace/run-dev.ps1):
  ```powershell
  .\run-dev.ps1
  ```

---

## 🛠️ Step-by-Step Terminal Commands

### 1. Navigate to Project
```powershell
cd c:\Praveen\Projects\AI_Car_MarketPlace\ai-car-marketplace-main
```

### 2. Dependency Management
> [!NOTE]
> `--legacy-peer-deps` is required to resolve peer dependencies between React 19, `react-day-picker@8.10.1`, and `date-fns@4.1.0`.

```powershell
# Install all dependencies cleanly
npm install --legacy-peer-deps

# Force install (if npm cache has conflicts)
npm install --force
```

### 3. Database (Prisma ORM & Supabase)
```powershell
# Generate Prisma Client (after modifying schema or first install)
npx prisma generate

# Push schema directly to database (Supabase PostgreSQL)
npx prisma db push

# Open visual database browser in web browser
npx prisma studio

# Pull schema from existing database
npx prisma db pull
```

### 4. Running the Development Server
```powershell
# Run with Turbopack (default & fastest)
npm run dev

# Alternative: Run standard Next dev without Turbopack
npx next dev -p 3000
```
Server runs at: **`http://localhost:3000`**

### 5. Production Build & Test
```powershell
# Create optimized production build
npm run build

# Start production server (runs build artifacts)
npm run start

# Run ESLint validation
npm run lint
```

---

## 🔑 Environment Variables Setup

Ensure `.env` exists in `ai-car-marketplace-main/` (reference: [`.env.example`](file:///c:/Praveen/Projects/AI_Car_MarketPlace/ai-car-marketplace-main/.env.example)):

```env
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# AI & Security
GEMINI_API_KEY=AIzaSy...
ARCJET_KEY=ajkey_...
```

---

## 🛑 Stop the Development Server
- In the active terminal window running the server: Press `Ctrl + C` and type `Y`.
