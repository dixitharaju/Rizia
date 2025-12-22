import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize Supabase client with anon key for regular operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6a8bd82a/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint - creates new user with email confirmation
app.post("/make-server-6a8bd82a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, category, isAdmin } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Check if this is an admin signup
    if (isAdmin) {
      return c.json({ error: 'Admin signup is not allowed through this endpoint' }, 403);
    }

    // Create user with Supabase Auth using service role
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: name || email.split('@')[0],
        category: category || '',
        role: 'user'
      },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.error('Error during user signup:', error);
      return c.json({ error: `Signup error: ${error.message}` }, 400);
    }

    // Store additional user data in KV store
    if (data.user) {
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0],
        category: category || '',
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }

    return c.json({ 
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        category: data.user?.user_metadata?.category,
        role: data.user?.user_metadata?.role
      }
    });
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return c.json({ error: `Unexpected signup error: ${error.message}` }, 500);
  }
});

// Login endpoint - verifies credentials and returns user data
app.post("/make-server-6a8bd82a/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, loginType } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Check for admin login
    if (loginType === 'admin') {
      // Check for hardcoded admin credentials
      if (email === 'admin@rizia.com' && password === 'admin123') {
        // Create/get admin user in Supabase (if not exists)
        const { data: existingUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
        
        if (getUserError || !existingUser.user) {
          // Create admin user
          const { data: adminData, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: { 
              name: 'Admin',
              role: 'admin'
            },
            email_confirm: true
          });

          if (createError) {
            console.error('Error creating admin user:', createError);
          } else if (adminData.user) {
            await kv.set(`user:${adminData.user.id}`, {
              id: adminData.user.id,
              email: adminData.user.email,
              name: 'Admin',
              role: 'admin',
              createdAt: new Date().toISOString()
            });
          }
        }

        // Sign in as admin
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Admin login error:', error);
          return c.json({ error: `Admin login failed: ${error.message}` }, 401);
        }

        return c.json({ 
          user: {
            id: data.user?.id,
            email: data.user?.email,
            name: 'Admin',
            role: 'admin'
          },
          session: {
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token
          },
          isAdmin: true
        });
      } else {
        return c.json({ error: 'Invalid admin credentials' }, 401);
      }
    }

    // Regular user login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error during user login:', error);
      return c.json({ error: `Login error: ${error.message}` }, 401);
    }

    // Get additional user data from KV store
    let userData = await kv.get(`user:${data.user?.id}`);
    
    if (!userData) {
      // Fallback to user metadata if KV store doesn't have the data
      userData = {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name || data.user?.email?.split('@')[0],
        category: data.user?.user_metadata?.category || '',
        role: data.user?.user_metadata?.role || 'user'
      };
    }

    return c.json({ 
      user: userData,
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token
      },
      isAdmin: false
    });
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return c.json({ error: `Unexpected login error: ${error.message}` }, 500);
  }
});

// Get current session endpoint
app.get("/make-server-6a8bd82a/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      console.error('Session validation error:', error);
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Get additional user data from KV store
    let userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        category: user.user_metadata?.category || '',
        role: user.user_metadata?.role || 'user'
      };
    }

    return c.json({ 
      user: userData,
      isAdmin: userData.role === 'admin'
    });
  } catch (error) {
    console.error('Unexpected error validating session:', error);
    return c.json({ error: `Session validation error: ${error.message}` }, 500);
  }
});

// Logout endpoint
app.post("/make-server-6a8bd82a/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);

    if (error) {
      console.error('Logout error:', error);
      return c.json({ error: `Logout error: ${error.message}` }, 400);
    }

    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Unexpected error during logout:', error);
    return c.json({ error: `Unexpected logout error: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);