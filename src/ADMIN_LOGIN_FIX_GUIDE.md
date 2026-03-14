# 🔧 Admin Login Fix Guide - Rizia

This guide will help you fix any admin login issues in your Rizia platform.

---

## 🚨 Common Admin Login Issues

### Issue 1: "Invalid email or password"
**Cause:** Admin user not created in database or wrong password hash

### Issue 2: "You do not have admin privileges"
**Cause:** `is_admin` flag not set to `true` in database

### Issue 3: "Database not configured"
**Cause:** Missing Supabase environment variables

### Issue 4: "User profile not found"
**Cause:** Admin exists in `users_login` but not in `users` table

---

## ✅ **Quick Fix (Recommended)**

Follow these steps to fix all admin login issues at once:

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your Rizia project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Fix Script
1. Open the file `/supabase/FIX_ADMIN_LOGIN.sql` in your project
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button

### Step 3: Verify Admin User Created
After running the script, you should see a success message showing:
```
email: admin@rizia.com
is_admin: true
name: Admin User
category: Administrator
```

### Step 4: Test Admin Login
1. Go to your Rizia app login page: `/login`
2. Click on **"Admin Login"** tab (important!)
3. Enter credentials:
   - **Email:** `admin@rizia.com`
   - **Password:** `admin123`
4. Click **"Sign In"**
5. You should be redirected to `/admin/dashboard`

---

## 🔍 **Manual Verification Steps**

If the quick fix doesn't work, verify each step manually:

### 1. Check if Admin User Exists in Database

Run this SQL in Supabase:
```sql
SELECT * FROM public.users_login 
WHERE email = 'admin@rizia.com';
```

**Expected Result:**
- Email: `admin@rizia.com`
- Password hash: `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`
- is_admin: `true`

### 2. Check if Admin Profile Exists

Run this SQL:
```sql
SELECT * FROM public.users 
WHERE email = 'admin@rizia.com';
```

**Expected Result:**
- Name: `Admin User`
- Email: `admin@rizia.com`
- Category: `Administrator`

### 3. Check RLS Policies

Run this SQL:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Policies for users_login:**
- `Public read for authentication` - SELECT - USING (true)
- `Public insert for signup` - INSERT - WITH CHECK (true)
- `Public update for login tracking` - UPDATE - USING (true)

---

## 🛠️ **Advanced Troubleshooting**

### Problem: RLS Policies Blocking Access

If RLS policies are preventing access, run this:

```sql
-- Temporarily disable RLS for testing (NOT recommended for production)
ALTER TABLE public.users_login DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Try logging in now. If it works, the issue is RLS policies.
-- Then re-enable RLS:
ALTER TABLE public.users_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- And run the FIX_ADMIN_LOGIN.sql script to set correct policies
```

### Problem: Password Hash Mismatch

If you suspect password hash is wrong, regenerate it:

**In Browser Console:**
```javascript
const password = "admin123";
const encoder = new TextEncoder();
const data = encoder.encode(password);
crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Password hash:', hashHex);
});
```

**Expected Output:**
```
Password hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
```

Then update in database:
```sql
UPDATE public.users_login
SET password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
WHERE email = 'admin@rizia.com';
```

### Problem: Supabase Not Configured

Check your `.env` file (or environment variables):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get these values:**
1. Go to Supabase Dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `VITE_SUPABASE_ANON_KEY`

---

## 📊 **Test All User Types**

After fixing admin login, test all user types:

### Admin Login
- **Email:** `admin@rizia.com`
- **Password:** `admin123`
- **Login Type:** **Admin Login** tab
- **Expected:** Redirect to `/admin/dashboard`

### Regular User Login
- **Email:** `test@rizia.com`
- **Password:** `test123`
- **Login Type:** **User Login** tab
- **Expected:** Redirect to `/dashboard`

---

## 🎯 **What the Fix Script Does**

The `/supabase/FIX_ADMIN_LOGIN.sql` script:

1. ✅ **Fixes RLS Policies** - Updates Row Level Security to work with custom auth
2. ✅ **Creates Admin User** - With correct SHA-256 password hash
3. ✅ **Creates Test Users** - For testing different scenarios
4. ✅ **Verifies Setup** - Shows all created users

---

## 🚀 **Prevention Tips**

To avoid admin login issues in the future:

1. **Always use the migration script** when setting up new database
2. **Run seed scripts** after migrations to create test users
3. **Test login immediately** after database setup
4. **Keep password hashes consistent** - Use SHA-256 (or upgrade to bcrypt)
5. **Check RLS policies** when access is denied

---

## 📞 **Still Having Issues?**

If admin login still doesn't work after following this guide:

1. **Check browser console** for error messages
2. **Check Supabase logs** in Dashboard → Logs
3. **Verify network requests** in browser DevTools → Network tab
4. **Test with different browser** (clear cache/cookies)
5. **Check if Supabase project is paused** (free tier auto-pauses after inactivity)

---

## 🔐 **Security Notes**

⚠️ **Important for Production:**

1. **Change default password** - `admin123` is for testing only
2. **Use bcrypt or Argon2** - SHA-256 is not secure for password hashing
3. **Implement proper RLS** - Current policies allow public access
4. **Add rate limiting** - Prevent brute force attacks
5. **Enable 2FA** - Add two-factor authentication for admin accounts
6. **Use environment variables** - Never commit credentials to git

---

## ✨ **Success Checklist**

- [ ] Ran `/supabase/FIX_ADMIN_LOGIN.sql` in Supabase SQL Editor
- [ ] Verified admin user exists with correct hash
- [ ] Verified RLS policies are set correctly
- [ ] Tested admin login with `admin@rizia.com` / `admin123`
- [ ] Successfully redirected to `/admin/dashboard`
- [ ] Can see dashboard stats and recent events
- [ ] Can navigate to all admin pages

---

**Last Updated:** March 4, 2026
**Version:** 1.0.0
