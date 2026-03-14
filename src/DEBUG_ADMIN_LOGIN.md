# 🔍 DEBUG: Admin Login Issue - Step by Step

## 📋 Follow These Steps Exactly

### Step 1: Check Supabase Configuration ✅

**Open your browser console** (F12 or Right Click → Inspect → Console)

1. Go to your Rizia app
2. Open browser console
3. Type this and press Enter:

```javascript
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Expected Result:**
- Both should show your Supabase credentials
- NOT `undefined`

**If they're undefined:**
- Create a `.env` file in your project root
- Add:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- Restart your dev server

---

### Step 2: Verify Admin User in Database 🗄️

**Go to Supabase Dashboard:**
1. https://supabase.com/dashboard
2. Select your Rizia project
3. Click **Table Editor** → **users_login** table

**Check if admin user exists:**
- Look for row with email: `admin@rizia.com`
- Check `is_admin` column = `true`
- Check `password_hash` = `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`

**If admin user doesn't exist or has wrong hash:**
1. Go to **SQL Editor** in Supabase
2. Copy and run this:

```sql
-- Delete existing admin (if any)
DELETE FROM public.users WHERE email = 'admin@rizia.com';
DELETE FROM public.users_login WHERE email = 'admin@rizia.com';

-- Create admin user with correct hash
INSERT INTO public.users_login (email, password_hash, is_admin, created_at, login_count)
VALUES ('admin@rizia.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', true, NOW(), 0);

-- Create admin profile
INSERT INTO public.users (login_id, name, email, category, created_at)
SELECT id, 'Admin User', 'admin@rizia.com', 'Administrator', NOW()
FROM public.users_login
WHERE email = 'admin@rizia.com';

-- Verify
SELECT ul.email, ul.is_admin, ul.password_hash, u.name 
FROM public.users_login ul
LEFT JOIN public.users u ON ul.email = u.email
WHERE ul.email = 'admin@rizia.com';
```

**Expected Output:**
```
email: admin@rizia.com
is_admin: true
password_hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
name: Admin User
```

---

### Step 3: Check RLS Policies 🔒

**In Supabase SQL Editor, run:**

```sql
-- Check current policies on users_login
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users_login';
```

**You should see policies that allow SELECT, INSERT, and UPDATE with `qual` = `true`**

**If policies are wrong or blocking, run this:**

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Users can update their own login data" ON public.users_login;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Create permissive policies
CREATE POLICY "Public update for login tracking" 
    ON public.users_login FOR UPDATE 
    USING (true);

CREATE POLICY "Public update users" 
    ON public.users FOR UPDATE 
    USING (true);
```

---

### Step 4: Test Login with Console Logs 🐛

Now go to your login page and try to login:

1. Go to `/login`
2. **IMPORTANT: Click "Admin Login" tab** (not "User Login"!)
3. Enter:
   - Email: `admin@rizia.com`
   - Password: `admin123`
4. **Open browser console** (F12)
5. Click "Sign In"

**Watch the console for logs:**

You should see:
```
🔐 Login attempt started...
📧 Email: admin@rizia.com
👤 Login Type: admin
✅ Supabase configured
🔍 Querying users_login table...
📊 Query result: { loginData: {...}, loginError: null }
✅ User found in database
🔑 User is_admin status: true
🔐 Verifying password...
🔐 Password valid: true
✅ Password verified
✅ Login type matches user privileges
📝 Updating last login timestamp...
👤 Fetching user profile...
👤 User profile: { userData: {...}, userError: null }
✅ User profile found
💾 Storing user session...
✅ Login successful!
🚀 Navigating to dashboard...
→ Redirecting to /admin/dashboard
```

**Tell me where it STOPS or shows an error:**

Common stopping points:
- ❌ At "Supabase configured" → Environment variables issue
- ❌ At "User not found" → Admin user not in database
- ❌ At "Password verification failed" → Wrong password hash
- ❌ At "User tried admin login but is not admin" → is_admin is false
- ❌ At "User profile not found" → Admin not in users table

---

### Step 5: Verify Password Hash 🔑

**Test if your password generates the correct hash:**

**In browser console, run:**

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

**If it doesn't match, there's an issue with the hashing function.**

---

### Step 6: Check Network Requests 🌐

**In browser DevTools:**
1. Go to **Network** tab
2. Try logging in
3. Look for requests to Supabase (should see POST requests)
4. Click on the request
5. Check **Response** tab for errors

**Common errors:**
- 401: Authentication failed (wrong credentials)
- 403: RLS policies blocking access
- 500: Server error
- CORS error: Supabase configuration issue

---

## 🎯 Quick Checklist

Before you try to login, verify:

- [ ] `.env` file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- [ ] Dev server restarted after adding .env
- [ ] Admin user exists in users_login table
- [ ] Admin user has is_admin = true
- [ ] Admin user has correct password hash (240be518...)
- [ ] Admin profile exists in users table
- [ ] RLS policies allow public UPDATE on users_login
- [ ] Browser console is open to see logs
- [ ] Clicked "Admin Login" tab (not "User Login")
- [ ] Using exact email: admin@rizia.com
- [ ] Using exact password: admin123

---

## 🚨 Common Issues & Solutions

### Issue: "Database not configured"
**Solution:** 
- Check .env file exists
- Verify VITE_ prefix on variables
- Restart dev server
- Clear browser cache

### Issue: "Invalid email or password"
**Possible causes:**
1. Admin user doesn't exist → Run SQL to create admin user
2. Wrong password hash → Verify hash matches
3. RLS blocking read → Check SELECT policy exists

### Issue: "You do not have admin privileges"
**Solution:**
- Check is_admin column in users_login table
- Should be `true` (boolean) not 'true' (string)
- Run update: `UPDATE users_login SET is_admin = true WHERE email = 'admin@rizia.com';`

### Issue: "User profile not found"
**Solution:**
- Admin exists in users_login but NOT in users table
- Run the SQL to create admin profile (see Step 2)

### Issue: Login succeeds but redirects to /login again
**Solution:**
- Check App.tsx routing logic
- Verify localStorage is saving user data
- Check browser localStorage in DevTools → Application → Local Storage

---

## 📞 What to Tell Me

After following these steps, please tell me:

1. **Where do the console logs stop?** (Copy paste the last few lines)
2. **What error message do you see?** (Screenshot if possible)
3. **Does admin user exist in database?** (Yes/No + screenshot of Table Editor)
4. **What does the password hash show?** (From the hash verification in Step 5)
5. **Any errors in Network tab?** (Screenshot of failed request)

This will help me pinpoint the exact issue!

---

## 🔧 Nuclear Option: Complete Reset

If nothing else works, run this complete reset:

```sql
-- COMPLETE RESET - Run in Supabase SQL Editor

-- 1. Drop and recreate users_login table
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.users_login CASCADE;

-- 2. Create users_login table
CREATE TABLE public.users_login (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login_id UUID REFERENCES public.users_login(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.users_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Create permissive policies
CREATE POLICY "Public read" ON public.users_login FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.users_login FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON public.users_login FOR UPDATE USING (true);

CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update users" ON public.users FOR UPDATE USING (true);

-- 6. Create admin user
INSERT INTO public.users_login (email, password_hash, is_admin, created_at, login_count)
VALUES ('admin@rizia.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', true, NOW(), 0);

INSERT INTO public.users (login_id, name, email, category, created_at)
SELECT id, 'Admin User', 'admin@rizia.com', 'Administrator', NOW()
FROM public.users_login
WHERE email = 'admin@rizia.com';

-- 7. Verify
SELECT ul.email, ul.is_admin, ul.password_hash, u.name 
FROM public.users_login ul
LEFT JOIN public.users u ON ul.email = u.email
WHERE ul.email = 'admin@rizia.com';
```

**⚠️ WARNING: This will delete all users and bookings!**

Only use this if you're okay resetting everything.

---

**Last Updated:** March 4, 2026
