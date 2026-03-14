-- =====================================================
-- RIZIA - FIX ADMIN LOGIN ISSUES
-- Run this in your Supabase SQL Editor to fix admin login
-- =====================================================

-- Step 1: Ensure RLS policies allow public access for authentication
-- =====================================================

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can update their own login data" ON public.users_login;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;

-- Recreate policies that work with custom auth (no auth.uid())
-- Allow everyone to read users_login (needed for authentication)
CREATE POLICY "Public read for authentication" 
    ON public.users_login FOR SELECT 
    USING (true);

-- Allow everyone to insert (for signup)
CREATE POLICY "Public insert for signup" 
    ON public.users_login FOR INSERT 
    WITH CHECK (true);

-- Allow everyone to update (for login count and last_login_at)
CREATE POLICY "Public update for login tracking" 
    ON public.users_login FOR UPDATE 
    USING (true);

-- Users table policies
CREATE POLICY "Public read users" 
    ON public.users FOR SELECT 
    USING (true);

CREATE POLICY "Public insert users" 
    ON public.users FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public update users" 
    ON public.users FOR UPDATE 
    USING (true);

-- Bookings table policies (allow all for now - restrict in production)
CREATE POLICY "Public read bookings" 
    ON public.bookings FOR SELECT 
    USING (true);

CREATE POLICY "Public insert bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public update bookings" 
    ON public.bookings FOR UPDATE 
    USING (true);

CREATE POLICY "Public delete bookings" 
    ON public.bookings FOR DELETE 
    USING (true);

-- Step 2: Create/Update Admin User with Correct Hash
-- =====================================================
-- Password: admin123
-- SHA-256 Hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

-- Delete existing admin if exists (to ensure clean slate)
DELETE FROM public.users WHERE email = 'admin@rizia.com';
DELETE FROM public.users_login WHERE email = 'admin@rizia.com';

-- Insert admin login credentials with correct SHA-256 hash
INSERT INTO public.users_login (email, password_hash, is_admin, created_at, login_count)
VALUES ('admin@rizia.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', true, NOW(), 0);

-- Insert admin user profile
INSERT INTO public.users (login_id, name, email, category, created_at)
SELECT id, 'Admin User', 'admin@rizia.com', 'Administrator', NOW()
FROM public.users_login
WHERE email = 'admin@rizia.com';

-- Step 3: Create Test Users (Optional)
-- =====================================================

-- Test User 1: test@rizia.com / test123
INSERT INTO public.users_login (email, password_hash, is_admin, created_at, login_count)
VALUES ('test@rizia.com', 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae', false, NOW(), 0)
ON CONFLICT (email) DO UPDATE SET 
    password_hash = 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae',
    is_admin = false;

INSERT INTO public.users (login_id, name, email, category, created_at)
SELECT id, 'Test User', 'test@rizia.com', 'Event Enthusiast', NOW()
FROM public.users_login
WHERE email = 'test@rizia.com'
ON CONFLICT (email) DO UPDATE SET 
    name = 'Test User',
    category = 'Event Enthusiast';

-- Test User 2: john.doe@example.com / test123
INSERT INTO public.users_login (email, password_hash, is_admin, created_at, login_count)
VALUES ('john.doe@example.com', 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae', false, NOW(), 0)
ON CONFLICT (email) DO UPDATE SET 
    password_hash = 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae',
    is_admin = false;

INSERT INTO public.users (login_id, name, email, category, created_at)
SELECT id, 'John Doe', 'john.doe@example.com', 'Music Lover', NOW()
FROM public.users_login
WHERE email = 'john.doe@example.com'
ON CONFLICT (email) DO UPDATE SET 
    name = 'John Doe',
    category = 'Music Lover';

-- Step 4: Verification
-- =====================================================
-- Check if admin user was created successfully
SELECT 
    ul.email,
    ul.is_admin,
    u.name,
    u.category,
    ul.password_hash as hash_preview,
    ul.created_at
FROM public.users_login ul
LEFT JOIN public.users u ON ul.email = u.email
WHERE ul.email = 'admin@rizia.com';

-- Show all users
SELECT 
    ul.email,
    ul.is_admin,
    u.name,
    u.category
FROM public.users_login ul
LEFT JOIN public.users u ON ul.email = u.email
ORDER BY ul.is_admin DESC, ul.email;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- You can now login with:
-- Email: admin@rizia.com
-- Password: admin123
-- Login Type: Select "Admin Login" tab
-- =====================================================
