# 🚀 Rizia - Supabase PostgreSQL Setup Guide

## 📋 Overview

This guide will help you set up the Supabase PostgreSQL database for Rizia event platform with three tables:
1. **users_login** - Authentication and login data
2. **users** - User profiles and signup data  
3. **bookings** - Event booking transactions

---

## 🔧 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `rizia-events`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
5. Click "Create New Project" and wait 2-3 minutes

---

## 📊 Step 2: Run SQL Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"+ New Query"**
3. Copy the entire contents of `/supabase/migrations/001_create_rizia_tables.sql`
4. Paste it into the SQL Editor
5. Click **"Run"** button (bottom right)
6. You should see: **"Success. No rows returned"**

---

## 🔑 Step 3: Get API Keys

1. Go to **Settings** → **API** (left sidebar)
2. You'll need two keys:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

---

## 🌐 Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace with your actual values from Step 3!**

---

## ✅ Step 5: Create Admin User

The SQL migration automatically creates an admin user, but you need to set the password.

### Option A: Update via SQL Editor

Run this in SQL Editor (replace `your-hashed-password`):

```sql
-- First, generate a hash of 'admin123' using your app
-- Then update with the actual hash
UPDATE public.users_login 
SET password_hash = 'your-actual-sha256-hash-here'
WHERE email = 'admin@rizia.com';
```

### Option B: Sign up as admin manually

1. Delete the placeholder admin:
```sql
DELETE FROM public.users WHERE email = 'admin@rizia.com';
DELETE FROM public.users_login WHERE email = 'admin@rizia.com';
```

2. Use the Rizia signup page to create admin account with:
   - Email: `admin@rizia.com`
   - Password: `admin123`
   - Name: `Admin`

3. Then mark as admin:
```sql
UPDATE public.users_login 
SET is_admin = true 
WHERE email = 'admin@rizia.com';
```

---

## 🧪 Step 6: Test the Integration

### Test Signup:
1. Go to `/signup` in your Rizia app
2. Create a new user account
3. Check Supabase **Table Editor** → `users` and `users_login` tables
4. You should see your new user!

### Test Login:
1. Go to `/login`
2. Login with your new credentials
3. Check Supabase **Table Editor** → `users_login`
4. `last_login_at` and `login_count` should update!

### Test Booking:
1. Login as a user
2. Browse events and book one
3. Complete the dummy payment
4. Check Supabase **Table Editor** → `bookings`
5. You should see your booking!

### Test Admin:
1. Go to `/login`
2. Click "Admin Login" tab
3. Login with:
   - Email: `admin@rizia.com`
   - Password: `admin123`
4. You should see the admin dashboard!

---

## 📊 Step 7: View Your Data

Go to **Table Editor** in Supabase dashboard:

### users_login Table
- Contains login credentials
- `is_admin` field identifies admins
- `last_login_at` tracks login activity

### users Table
- Contains user profiles
- Linked to `users_login` via `login_id`
- Stores name, email, category preference

### bookings Table
- Contains all event bookings
- Linked to `users` via `user_id`
- Tracks ticket quantity, prices, status

---

## 🔒 Row Level Security (RLS)

The database has RLS policies enabled:

- **Users can only view/edit their own data**
- **Admins need separate policies** (can be added later)
- **Anyone can signup** (insert into users tables)
- **Bookings are private** (users see only their bookings)

To add admin privileges to view all data:

```sql
-- Allow admins to view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users_login 
    WHERE email = auth.jwt()->>'email' 
    AND is_admin = true
  )
);
```

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the SQL migration
- Check Table Editor to verify tables exist

### Error: "permission denied"
- Check RLS policies are created
- Verify API keys are correct in `.env`

### Error: "password_hash doesn't match"
- The hashing in `/utils/supabaseClient.ts` uses SHA-256
- Make sure both signup and login use same hash function

### Admin can't login
- Verify `is_admin = true` in `users_login` table
- Check you're using "Admin Login" tab

### Bookings not saving
- Make sure user is logged in
- Check `user?.id` exists
- Verify RLS policies allow inserts

---

## 🎉 You're All Set!

Your Rizia platform now has:
- ✅ Full user authentication with PostgreSQL
- ✅ Secure login/signup system
- ✅ Admin user management
- ✅ Event booking system with database storage
- ✅ Dummy payment processing

---

## 📞 Need Help?

Check the Supabase documentation:
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🔐 Security Notes

**Important for Production:**

1. **Password Hashing**: Currently using SHA-256. For production, use bcrypt:
   ```bash
   npm install bcryptjs
   ```

2. **Environment Variables**: Never commit `.env` to git
   ```bash
   echo ".env" >> .gitignore
   ```

3. **API Keys**: The anon key is safe for frontend use
   - Service role key should NEVER be exposed to frontend

4. **HTTPS Only**: Always use HTTPS in production

5. **Rate Limiting**: Add rate limiting to prevent abuse

---

**Happy Coding! 🚀**
