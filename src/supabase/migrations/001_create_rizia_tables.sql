-- =====================================================
-- RIZIA EVENT PLATFORM - DATABASE SCHEMA
-- PostgreSQL Migration File
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.users_login CASCADE;

-- =====================================================
-- TABLE 1: users_login
-- Stores login credentials and authentication data
-- =====================================================
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

-- Index for faster email lookups
CREATE INDEX idx_users_login_email ON public.users_login(email);

-- =====================================================
-- TABLE 2: users
-- Stores user profile and signup data
-- =====================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login_id UUID REFERENCES public.users_login(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON public.users(email);

-- =====================================================
-- TABLE 3: bookings
-- Stores all event booking data
-- =====================================================
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_time TEXT NOT NULL,
    city TEXT NOT NULL,
    venue TEXT NOT NULL,
    ticket_quantity INTEGER NOT NULL DEFAULT 1,
    price_per_ticket DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status TEXT DEFAULT 'confirmed',
    payment_method TEXT,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users Login Policies
-- Allow anyone to read (for login verification)
CREATE POLICY "Anyone can read users_login for authentication"
    ON public.users_login FOR SELECT
    USING (true);

-- Allow anyone to insert (for signup)
CREATE POLICY "Anyone can insert into users_login"
    ON public.users_login FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own login data
CREATE POLICY "Users can update their own login data"
    ON public.users_login FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Users Policies
-- Allow anyone to read users (for profile display)
CREATE POLICY "Anyone can read users"
    ON public.users FOR SELECT
    USING (true);

-- Allow anyone to insert (for signup)
CREATE POLICY "Anyone can insert into users"
    ON public.users FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Bookings Policies
-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Users can insert their own bookings
CREATE POLICY "Users can insert their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid()::text = user_id::text);

-- Users can delete their own bookings
CREATE POLICY "Users can delete their own bookings"
    ON public.bookings FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_login_updated_at BEFORE UPDATE ON public.users_login
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - Admin User
-- =====================================================

-- Insert admin login credentials
INSERT INTO public.users_login (email, password_hash, is_admin, created_at)
VALUES ('admin@rizia.com', '$2a$10$YourHashedPasswordHere', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert admin user profile
INSERT INTO public.users (login_id, name, email, created_at)
SELECT id, 'Admin', 'admin@rizia.com', NOW()
FROM public.users_login
WHERE email = 'admin@rizia.com'
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.users_login IS 'Stores user authentication credentials';
COMMENT ON TABLE public.users IS 'Stores user profile and signup information';
COMMENT ON TABLE public.bookings IS 'Stores event booking transactions';

COMMENT ON COLUMN public.users_login.is_admin IS 'Flag to identify admin users';
COMMENT ON COLUMN public.users_login.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN public.users_login.login_count IS 'Total number of successful logins';
COMMENT ON COLUMN public.bookings.booking_status IS 'Status: confirmed, cancelled, pending, completed';
COMMENT ON COLUMN public.bookings.payment_method IS 'Payment method used: card, upi, netbanking';
