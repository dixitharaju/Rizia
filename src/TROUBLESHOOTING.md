# Rizia - Troubleshooting Guide

## Common Issues and Solutions

### 1. Application Won't Start / Build Errors

#### Issue: "Cannot find module" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: TypeScript errors
**Solution:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

#### Issue: Vite build fails
**Solution:**
Make sure you have `.env` file in root directory:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### 2. Login Issues

#### Issue: "Database not configured" error
**Cause:** Missing or incorrect Supabase credentials

**Solution:**
1. Create a `.env` file in the project root
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
3. Get these values from:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy "Project URL" and "anon/public" key
4. Restart your dev server:
```bash
npm run dev
```

#### Issue: "Invalid email or password" error
**Cause:** User doesn't exist in database or password hash doesn't match

**Solution:**
1. Make sure you've run the database migrations:
   - Go to Supabase Dashboard → SQL Editor
   - Run `/supabase/migrations/001_create_rizia_tables.sql`
   - Run `/supabase/migrations/002_create_events_table.sql`

2. Seed test users:
   - Run `/supabase/seed_test_users.sql` in SQL Editor
   
3. Try test credentials:
   - User: `test@rizia.com` / `test123`
   - Admin: `admin@rizia.com` / `admin123`

#### Issue: "You do not have admin privileges" error
**Cause:** Trying to login as admin with a regular user account

**Solution:**
- Make sure you're using the admin credentials: `admin@rizia.com` / `admin123`
- OR switch to "User Login" tab if you're a regular user

#### Issue: "Admin users must login through Admin Login" error
**Cause:** Trying to login with admin account using "User Login" tab

**Solution:**
- Click the "Admin Login" tab
- Then enter your admin credentials

---

### 3. Supabase Database Setup

#### Issue: Tables don't exist
**Solution:**
Run these SQL scripts in order in Supabase SQL Editor:

1. **Create tables:**
```sql
-- Copy and run the entire contents of:
-- /supabase/migrations/001_create_rizia_tables.sql
```

2. **Create events table:**
```sql
-- Copy and run the entire contents of:
-- /supabase/migrations/002_create_events_table.sql
```

3. **Seed test users:**
```sql
-- Copy and run the entire contents of:
-- /supabase/seed_test_users.sql
```

#### Issue: Row Level Security (RLS) blocking queries
**Solution:**
The migrations already set up RLS policies. If you're having issues:

1. Go to Supabase Dashboard → Authentication → Policies
2. Verify policies exist for:
   - `users_login` table
   - `users` table
   - `bookings` table
   - `events` table
   - `competitions` table
   - `submissions` table

---

### 4. Event/Competition Not Showing

#### Issue: No events appear on homepage
**Cause:** No events in database

**Solution:**
1. Login as admin (`admin@rizia.com` / `admin123`)
2. Go to Admin Dashboard
3. Click "Create Event" or "Manage Events"
4. Add events with details:
   - Title
   - Description
   - Location/City
   - Date & Time
   - Price
   - Category
   - Image URL (use Unsplash URLs)

#### Issue: Events show but can't book
**Cause:** Event may be in the past or not properly configured

**Solution:**
1. Check event date is in the future
2. Verify event has available tickets
3. Make sure event status is "active"

---

### 5. Booking Issues

#### Issue: Checkout page shows "Loading event..."
**Cause:** Event ID doesn't exist or database query failed

**Solution:**
1. Check browser console for errors
2. Verify the event exists in database
3. Make sure Supabase credentials are correct

#### Issue: Payment doesn't complete
**Cause:** This is a demo app with mock payments

**Solution:**
- The payment is simulated and always succeeds after 1.5 seconds
- No real payment gateway is connected
- Just click "Make Payment" and wait for confirmation

---

### 6. Admin Panel Issues

#### Issue: Can't access admin dashboard
**Cause:** Not logged in as admin or wrong credentials

**Solution:**
1. Make sure you're logged in with admin account
2. Use credentials: `admin@rizia.com` / `admin123`
3. Make sure "Admin Login" tab was selected during login
4. Verify in Supabase that user has `is_admin = true` in `users_login` table

#### Issue: Analytics not showing data
**Cause:** No bookings in database yet

**Solution:**
1. Create some test bookings as a regular user
2. The analytics will automatically update
3. Charts show data from bookings table

---

### 7. Environment Setup

#### Complete Setup Checklist:

1. ✅ **Install Dependencies**
```bash
npm install
```

2. ✅ **Create `.env` file**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. ✅ **Run Supabase Migrations**
   - Run `001_create_rizia_tables.sql`
   - Run `002_create_events_table.sql`
   - Run `seed_test_users.sql`

4. ✅ **Start Dev Server**
```bash
npm run dev
```

5. ✅ **Test Login**
   - Try logging in with `test@rizia.com` / `test123`
   - Try admin login with `admin@rizia.com` / `admin123`

---

### 8. Browser Console Errors

#### Check Browser Console:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages

**Common errors and fixes:**

- **CORS errors:** Check Supabase URL is correct
- **401 Unauthorized:** Check Supabase anon key is correct
- **Network errors:** Check internet connection
- **Module not found:** Run `npm install` again

---

### 9. Data Not Persisting

#### Issue: Data disappears after refresh
**Cause:** Using localStorage instead of Supabase

**Solution:**
- This should not happen - the app is fully integrated with Supabase
- Check browser console for database errors
- Verify Supabase credentials are correct
- Make sure you're not in incognito/private browsing mode (for localStorage session data)

---

### 10. Quick Debug Commands

```bash
# Check if .env file exists
ls -la .env

# Verify environment variables are loaded
npm run dev
# Then check browser console:
# console.log(import.meta.env.VITE_SUPABASE_URL)

# Clear all caches and reinstall
rm -rf node_modules .vite package-lock.json
npm install
npm run dev

# Check Node version (should be 16+)
node --version

# Check npm version
npm --version
```

---

### 11. Getting Help

If none of these solutions work:

1. **Check the file structure:**
   - Make sure all files are in correct locations
   - Verify `/utils/supabaseClient.ts` exists
   - Check `/App.tsx` is the entry point

2. **Verify Supabase setup:**
   - Login to Supabase dashboard
   - Check if project is active
   - Verify API keys are valid
   - Check table permissions

3. **Review error messages:**
   - Check terminal/console for specific errors
   - Look for stack traces
   - Note the exact error message

4. **Test with fresh database:**
   - Create a new Supabase project
   - Run all migrations fresh
   - Use new credentials

---

## File Structure Verification

Your project should have this structure:

```
rizia/
├── .env (MUST CREATE THIS!)
├── App.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HeroCarousel.tsx
│   ├── LocationModal.tsx
│   ├── RiziaLogo.tsx
│   └── ...
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   └── ...
├── utils/
│   ├── supabaseClient.ts
│   └── supabaseHelpers.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_rizia_tables.sql
│   │   └── 002_create_events_table.sql
│   └── seed_test_users.sql
└── package.json
```

---

## Still Having Issues?

1. Make sure you've followed the setup guide in `/SUPABASE_SETUP_GUIDE.md`
2. Check test credentials in `/TEST_CREDENTIALS.md`
3. Review database structure in `/DATABASE_STRUCTURE.md`
4. Verify integration status in `/INTEGRATION_COMPLETE.md`

---

**Last Updated:** March 1, 2026
