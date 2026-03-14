# Rizia - Test Credentials

This document contains all the test credentials for local development and testing.

## ⚠️ IMPORTANT: First Time Setup

**Before you can login, you MUST run the SQL seed script in your Supabase database!**

### Quick Setup Steps:
1. Open your Supabase Dashboard → SQL Editor
2. Run `/supabase/FIX_ADMIN_LOGIN.sql` (recommended) OR `/supabase/seed_test_users.sql`
3. Verify users were created
4. Start using the credentials below

**If admin login doesn't work, see `/ADMIN_LOGIN_FIX_GUIDE.md`**

---

## How to Set Up Test Users

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Rizia project

2. **Run the SQL Script**
   - Navigate to the SQL Editor (left sidebar)
   - Copy the contents of `/supabase/seed_test_users.sql`
   - Paste and run the SQL script
   - This will create all test users in your database

3. **Start Using the Credentials**
   - Use any of the credentials below to log in

---

## Admin Credentials

### Admin Account
- **Email:** `admin@rizia.com`
- **Password:** `admin123`
- **Access:** Full admin panel access
- **Use Case:** Testing admin features, analytics, user management, booking management

---

## Regular User Credentials

### Test User 1
- **Email:** `test@rizia.com`
- **Password:** `test123`
- **Category:** Event Enthusiast
- **Use Case:** Basic user testing

### Test User 2
- **Email:** `john.doe@example.com`
- **Password:** `test123`
- **Category:** Music Lover
- **Use Case:** Additional user for testing multiple user scenarios

### Test User 3
- **Email:** `sarah.smith@example.com`
- **Password:** `test123`
- **Category:** Art Enthusiast
- **Use Case:** Testing different user profiles

---

## Password Hash Information

All passwords are hashed using SHA-256 (as defined in `/utils/supabaseClient.ts`).

- `admin123` → `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`
- `test123` → `ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae`

---

## Quick Login Steps

1. **Go to the Login page** (`/login`)
2. **Select login type:**
   - Click "User Login" for regular users
   - Click "Admin Login" for admin access
3. **Enter credentials:**
   - Use any email/password combination from above
4. **Click "Sign In"**

---

## Testing Workflows

### Test User Registration
1. Go to `/signup`
2. Create a new account
3. Check if the user appears in Supabase database

### Test Booking Flow
1. Log in as a regular user
2. Browse events on home page
3. Click on an event
4. Click "Book Tickets"
5. Fill out checkout form
6. Click "Make Payment" (dummy payment - no real payment required)
7. Check booking confirmation
8. Verify booking appears in Dashboard

### Test Admin Features
1. Log in as admin (`admin@rizia.com`)
2. Navigate to `/admin/dashboard`
3. View analytics
4. Manage users at `/admin/users`
5. View all bookings at `/admin/bookings`

---

## Notes

- All passwords use SHA-256 hashing for demo purposes
- In production, use bcrypt or Argon2 for password hashing
- The dummy payment system simulates a 1.5-second payment delay
- No real payment gateway is integrated - this is for testing only
- Row Level Security (RLS) policies are enabled on all tables

---

## Troubleshooting

### "Database not configured" error
- Make sure you have set up your `.env` file with:
  - `VITE_SUPABASE_URL=your-project-url`
  - `VITE_SUPABASE_ANON_KEY=your-anon-key`

### "Invalid email or password" error
- Make sure you've run the seed SQL script in Supabase
- Verify the user exists in the `users_login` table
- Check that the password hash matches

### Admin login not working
- Make sure you selected "Admin Login" tab
- Use the admin credentials: `admin@rizia.com` / `admin123`
- Verify `is_admin` is set to `true` in the database

---

## Creating New Test Users Manually

If you want to create additional test users:

1. **Generate password hash:**
   ```javascript
   // Run this in browser console
   const password = "yourpassword";
   const encoder = new TextEncoder();
   const data = encoder.encode(password);
   crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
     const hashArray = Array.from(new Uint8Array(hashBuffer));
     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
     console.log('Password hash:', hashHex);
   });
   ```

2. **Insert into Supabase:**
   ```sql
   -- Insert login credentials
   INSERT INTO public.users_login (email, password_hash, is_admin)
   VALUES ('newemail@example.com', 'YOUR_HASH_HERE', false);

   -- Insert user profile
   INSERT INTO public.users (login_id, name, email, category)
   SELECT id, 'User Name', 'newemail@example.com', 'Category'
   FROM public.users_login
   WHERE email = 'newemail@example.com';
   ```

---

**Last Updated:** February 2, 2026