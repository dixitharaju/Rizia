# Rizia - Quick Start Guide

Follow these steps to get Rizia running on your local machine.

---

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- A Supabase account (free tier works fine)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- React Router
- Supabase Client
- Tailwind CSS
- Lucide Icons
- And more...

---

## Step 2: Set Up Supabase Project

### 2.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in project details:
   - **Name:** Rizia (or any name you prefer)
   - **Database Password:** Choose a strong password
   - **Region:** Choose closest to you
5. Click "Create new project"
6. Wait for project to initialize (~2 minutes)

### 2.2 Get API Credentials

1. Go to your project dashboard
2. Click "Settings" (gear icon) in sidebar
3. Click "API" under Project Settings
4. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **API Keys** → Find "anon" "public" key
5. Keep this page open for next step

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File

In your project root directory, create a file named `.env`:

```bash
# On Mac/Linux
touch .env

# On Windows (Command Prompt)
type nul > .env

# Or simply create it in your code editor
```

### 3.2 Add Your Credentials

Open `.env` and add:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with your actual values** from Step 2.2 above!

Example:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNDI5MDI4OSwiZXhwIjoxOTI5ODY2Mjg5fQ.example
```

### 3.3 Verify .env File

Make sure:
- ✅ File is named exactly `.env` (not `.env.txt`)
- ✅ No quotes around the values
- ✅ No spaces before or after the `=` sign
- ✅ File is in the root directory (same level as `package.json`)

---

## Step 4: Set Up Database

### 4.1 Run Migration 1 - Create Core Tables

1. In Supabase Dashboard, click "SQL Editor" (sidebar)
2. Click "New query"
3. Open `/supabase/migrations/001_create_rizia_tables.sql` from your project
4. Copy the **entire contents**
5. Paste into Supabase SQL Editor
6. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
7. You should see "Success. No rows returned"

This creates tables:
- `users_login` (authentication)
- `users` (user profiles)
- `bookings` (ticket bookings)

### 4.2 Run Migration 2 - Create Events Table

1. Click "New query" again in SQL Editor
2. Open `/supabase/migrations/002_create_events_table.sql`
3. Copy and paste entire contents
4. Click "Run"

This creates:
- `events` table (all events/shows)
- `competitions` table (talent competitions)
- `submissions` table (competition entries)

### 4.3 Seed Test Users

1. Click "New query" again
2. Open `/supabase/seed_test_users.sql`
3. Copy and paste entire contents
4. Click "Run"

This creates test users:
- Admin: `admin@rizia.com` / `admin123`
- User: `test@rizia.com` / `test123`
- And a few more test users

### 4.4 Verify Tables Created

1. In Supabase Dashboard, click "Table Editor" (sidebar)
2. You should see these tables:
   - ✅ users_login
   - ✅ users
   - ✅ bookings
   - ✅ events
   - ✅ competitions
   - ✅ submissions

---

## Step 5: Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 6: Test the Application

### 6.1 Open in Browser

1. Open your browser
2. Go to `http://localhost:5173`
3. You should see the Rizia homepage!

### 6.2 Test User Login

1. Click "Login" in the top right
2. Make sure "User Login" tab is selected
3. Enter credentials:
   - Email: `test@rizia.com`
   - Password: `test123`
4. Click "Sign In"
5. You should be redirected to the user dashboard ✅

### 6.3 Test Admin Login

1. Logout (if logged in)
2. Click "Login"
3. Select "Admin Login" tab
4. Enter credentials:
   - Email: `admin@rizia.com`
   - Password: `admin123`
5. Click "Sign In"
6. You should be redirected to the admin dashboard ✅

---

## Step 7: Add Your First Event (Admin)

1. Login as admin
2. On the admin dashboard, click "Create Event"
3. Fill in event details:
   - **Title:** Summer Music Festival
   - **Description:** Amazing outdoor concert with top artists
   - **Category:** Concert
   - **Location:** Mumbai
   - **Date:** Pick a future date
   - **Time:** 7:00 PM
   - **Venue:** NSCI Dome
   - **Price:** 999
   - **Capacity:** 5000
   - **Image URL:** Use an Unsplash link like:
     `https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800`
4. Click "Create Event"
5. Event should appear immediately on the homepage! ✅

---

## Step 8: Test Booking Flow

1. Logout from admin account
2. Login as regular user (`test@rizia.com` / `test123`)
3. On homepage, click on any event
4. Click "Book Tickets"
5. Fill in checkout form:
   - Number of tickets: 2
   - Name, email, phone
6. Click "Make Payment"
7. Wait for mock payment to process (~1.5 seconds)
8. You should see booking confirmation! ✅
9. Go to "Dashboard" to see your booking

---

## Troubleshooting

### "Database not configured" error
➡️ Check your `.env` file exists and has correct credentials

### "Cannot find module" errors
➡️ Run: `npm install`

### "Invalid email or password"
➡️ Make sure you ran the seed SQL script (`seed_test_users.sql`)

### Tables don't exist
➡️ Run all migration files in Supabase SQL Editor

### Events not showing
➡️ Create events as admin first

### For more issues, see:
- `/TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `/TEST_CREDENTIALS.md` - All test login credentials
- `/DATABASE_STRUCTURE.md` - Database schema details

---

## Project Structure

```
rizia/
├── .env                     ← YOUR CREDENTIALS (create this!)
├── .env.example             ← Template
├── App.tsx                  ← Main app component
├── package.json             ← Dependencies
├── components/              ← Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroCarousel.tsx
│   └── ...
├── pages/                   ← All page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── admin/              ← Admin pages
│   │   ├── AdminDashboard.tsx
│   │   ├── Analytics.tsx
│   │   └── ...
│   └── ...
├── utils/                   ← Helper functions
│   ├── supabaseClient.ts   ← Supabase configuration
│   └── supabaseHelpers.ts  ← Database helpers
├── supabase/               ← Database files
│   ├── migrations/         ← SQL migration files
│   │   ├── 001_create_rizia_tables.sql
│   │   └── 002_create_events_table.sql
│   └── seed_test_users.sql ← Test user data
└── styles/
    └── globals.css         ← Global styles
```

---

## Next Steps

Once everything is working:

1. **Explore the App:**
   - Browse events by city
   - Try different user roles (user vs admin)
   - Test booking flow end-to-end
   - Check admin analytics

2. **Customize:**
   - Add your own events
   - Modify the design/colors
   - Add more features

3. **Learn More:**
   - Check `/RIZIA_SUPABASE_INTEGRATION.md` for integration details
   - Read `/guidelines/Guidelines.md` for development guidelines
   - See `/DATABASE_STRUCTURE.md` for database schema

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Support

If you encounter any issues:

1. Check `/TROUBLESHOOTING.md` first
2. Verify all migration scripts ran successfully
3. Check browser console for errors (F12)
4. Ensure `.env` file is configured correctly
5. Make sure Supabase project is active

---

## Security Notes

- ✅ Never commit `.env` file to Git
- ✅ The `.env` file is already in `.gitignore`
- ✅ Anon key is safe for frontend use
- ✅ Row Level Security (RLS) protects your data
- ⚠️ This is a demo app - use proper password hashing (bcrypt) in production
- ⚠️ Payment integration is mocked - integrate real payment gateway for production

---

**🎉 You're all set! Enjoy using Rizia!**

Last Updated: March 1, 2026
