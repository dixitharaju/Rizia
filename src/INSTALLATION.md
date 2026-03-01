# 🚀 Rizia Installation Instructions

**Complete setup in under 5 minutes!**

---

## ✅ Pre-Installation Checklist

Before you begin, make sure you have:

- [ ] Node.js 16 or higher installed
- [ ] npm or yarn package manager
- [ ] A Supabase account (free: https://supabase.com)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

---

## 📦 Step 1: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This installs all required packages (~2 minutes).

**Expected output:**
```
added XXX packages, and audited XXX packages in Xs
```

---

## 🔑 Step 2: Set Up Environment Variables

### 2.1 Create .env File

**Option A - Using Terminal (Mac/Linux):**
```bash
cp .env.example .env
```

**Option B - Using Command Prompt (Windows):**
```cmd
copy .env.example .env
```

**Option C - Manual:**
1. Create a new file named `.env` in the root directory
2. Copy contents from `.env.example`

### 2.2 Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Sign in or create a free account
3. Create a new project or select existing one
4. Wait for project to initialize (~2 minutes)
5. Go to **Settings** → **API**
6. Copy these two values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon public key** (long string starting with eyJ...)

### 2.3 Update .env File

Open `.env` file and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key...
```

**⚠️ Important:**
- No quotes around the values
- No spaces before or after the `=` sign
- Keep this file secure (already in .gitignore)

---

## 🗄️ Step 3: Set Up Database

### 3.1 Run Migration Files

Go to Supabase Dashboard → **SQL Editor** → **New Query**

**Run these files IN ORDER:**

#### File 1: Create Core Tables
1. Open `/supabase/migrations/001_create_rizia_tables.sql`
2. Copy the **entire contents**
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

This creates:
- ✅ `users_login` table
- ✅ `users` table
- ✅ `bookings` table

#### File 2: Create Events & Competitions Tables
1. Click **New Query** in Supabase SQL Editor
2. Open `/supabase/migrations/002_create_events_table.sql`
3. Copy and paste entire contents
4. Click **Run**
5. Success message should appear

This creates:
- ✅ `events` table
- ✅ `competitions` table
- ✅ `submissions` table

#### File 3: Seed Test Users
1. Click **New Query** again
2. Open `/supabase/seed_test_users.sql`
3. Copy and paste entire contents
4. Click **Run**
5. Success message should appear

This creates:
- ✅ Admin user: admin@rizia.com
- ✅ Test users: test@rizia.com and others

### 3.2 Verify Database Setup

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see 6 tables listed:
   - users_login
   - users
   - bookings
   - events
   - competitions
   - submissions

Click on `users_login` table and verify you see test users.

---

## ▶️ Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## ✅ Step 5: Verify Installation

### 5.1 Open Browser

Go to: **http://localhost:5173**

You should see:
- ✅ Rizia homepage
- ✅ Beautiful gradient background
- ✅ Location modal (may appear on first visit)
- ✅ Navigation bar with Login/Signup

### 5.2 Test User Login

1. Click **"Login"** in top right
2. Make sure **"User Login"** tab is selected (blue highlighted)
3. Enter:
   - Email: `test@rizia.com`
   - Password: `test123`
4. Click **"Sign In"**

**Expected Result:** 
- ✅ Redirects to `/dashboard`
- ✅ Shows user dashboard with bookings

### 5.3 Test Admin Login

1. Click logout (if logged in)
2. Click **"Login"**
3. Select **"Admin Login"** tab
4. Enter:
   - Email: `admin@rizia.com`
   - Password: `admin123`
5. Click **"Sign In"**

**Expected Result:**
- ✅ Redirects to `/admin/dashboard`
- ✅ Shows admin panel with statistics

---

## 🎉 Installation Complete!

If you've reached this point successfully, congratulations! 🎊

Your Rizia platform is now:
- ✅ Installed and running
- ✅ Connected to Supabase database
- ✅ Ready for development
- ✅ Ready to create events and bookings

---

## 🎯 Next Steps

### Create Your First Event (as Admin)

1. Login as admin (`admin@rizia.com` / `admin123`)
2. On admin dashboard, you'll see stats and options
3. Click on sidebar: **"Manage Events"**
4. Click **"Create Event"** button
5. Fill in event details:
   - Title: Summer Music Festival
   - Description: Amazing outdoor concert
   - Category: Concert
   - Location/City: Mumbai
   - Date: Pick a future date
   - Time: 7:00 PM
   - Venue: NSCI Dome
   - Price: 999
   - Capacity: 5000
   - Image URL: `https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800`
6. Click **"Create Event"**
7. Event appears immediately! ✅

### Test Booking Flow (as User)

1. Logout from admin
2. Login as user (`test@rizia.com` / `test123`)
3. Go to homepage
4. Click on your newly created event
5. Click **"Book Tickets"**
6. Fill in checkout form
7. Click **"Make Payment"**
8. Wait for mock payment (~1.5 seconds)
9. Booking confirmed! ✅
10. Check **Dashboard** to see your booking

---

## 🔍 Troubleshooting Installation

### Issue: "npm install" fails

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Database not configured" on login

**Causes:**
- Missing `.env` file
- Wrong Supabase credentials
- Credentials not loaded

**Solutions:**
1. Check `.env` file exists in root directory
2. Verify credentials are correct
3. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Issue: "Invalid email or password"

**Cause:** Test users not seeded

**Solution:**
- Run `/supabase/seed_test_users.sql` in Supabase SQL Editor
- Verify in Table Editor → `users_login` that users exist

### Issue: Tables don't exist errors

**Cause:** Migration files not run

**Solution:**
- Run migration files in correct order (see Step 3)
- Check Table Editor in Supabase to verify tables exist

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill the process using port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port:
npm run dev -- --port 3000
```

---

## 📚 Documentation Reference

For more detailed information:

| Problem | Document |
|---------|----------|
| General setup help | [QUICK_START.md](./QUICK_START.md) |
| Errors and fixes | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| Pre-launch checks | [PRE_FLIGHT_CHECKLIST.md](./PRE_FLIGHT_CHECKLIST.md) |
| Test credentials | [TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md) |
| Database info | [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md) |
| Latest status | [ERROR_RESOLUTION_SUMMARY.md](./ERROR_RESOLUTION_SUMMARY.md) |

---

## 📞 Need More Help?

1. ✅ Check browser console (F12) for errors
2. ✅ Check terminal for error messages
3. ✅ Verify all environment variables are set
4. ✅ Verify Supabase project is active
5. ✅ Verify all migration scripts ran successfully
6. ✅ Try the troubleshooting guide

---

## ✨ Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean reinstall
rm -rf node_modules package-lock.json && npm install

# Check Node version (should be 16+)
node --version

# Check npm version
npm --version
```

---

## 🔐 Security Reminders

- ✅ Never commit `.env` file to Git (already in .gitignore)
- ✅ Use the anon/public key, NOT the service_role key
- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Change admin password in production
- ⚠️ Current password hashing is SHA-256 (for demo)
- ⚠️ Use bcrypt or Argon2 in production

---

## 🎊 Installation Success!

You should now have:
- ✅ A running development server
- ✅ Working login system
- ✅ Connected database
- ✅ Test users created
- ✅ Admin panel accessible
- ✅ Ready to develop!

**Welcome to Rizia! 🎉**

---

**Installation completed:** March 1, 2026  
**Time to complete:** ~5 minutes  
**Status:** 🟢 Ready to develop!
