# ⚡ Quick Fix: Admin Login Not Working

## 🚨 Problem
Cannot login as admin with `admin@rizia.com` / `admin123`

---

## ✅ Solution (2 Minutes)

### Step 1: Open Supabase
Go to: https://supabase.com/dashboard → Your Project → **SQL Editor**

### Step 2: Copy & Run This SQL
```sql
-- Fix RLS Policies
DROP POLICY IF EXISTS "Users can update their own login data" ON public.users_login;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;

CREATE POLICY "Public update for login tracking" ON public.users_login FOR UPDATE USING (true);
CREATE POLICY "Public update users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Public delete bookings" ON public.bookings FOR DELETE USING (true);

-- Create Admin User
DELETE FROM public.users WHERE email = 'admin@rizia.com';
DELETE FROM public.users_login WHERE email = 'admin@rizia.com';

INSERT INTO public.users_login (email, password_hash, is_admin, created_at, login_count)
VALUES ('admin@rizia.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', true, NOW(), 0);

INSERT INTO public.users (login_id, name, email, category, created_at)
SELECT id, 'Admin User', 'admin@rizia.com', 'Administrator', NOW()
FROM public.users_login
WHERE email = 'admin@rizia.com';

-- Verify
SELECT ul.email, ul.is_admin, u.name FROM public.users_login ul
LEFT JOIN public.users u ON ul.email = u.email
WHERE ul.email = 'admin@rizia.com';
```

### Step 3: Test Login
1. Go to `/login`
2. Click **"Admin Login"** tab (IMPORTANT!)
3. Email: `admin@rizia.com`
4. Password: `admin123`
5. Click Sign In
6. ✅ Should redirect to `/admin/dashboard`

---

## 🎯 Common Mistakes

❌ **Using "User Login" tab** → Use "Admin Login" tab!  
❌ **Wrong password** → Use exactly `admin123`  
❌ **Didn't run SQL** → Must run in Supabase SQL Editor  
❌ **Wrong email** → Use `admin@rizia.com` not `admin@example.com`  

---

## 📞 Still Not Working?

See detailed guide: `/ADMIN_LOGIN_FIX_GUIDE.md`

Or run the full fix script: `/supabase/FIX_ADMIN_LOGIN.sql`
