import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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

// Middleware to verify user token
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  
  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) return null;

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;
  
  return user;
}

// Health check endpoint
app.get("/make-server-6a8bd82a/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up
app.post("/make-server-6a8bd82a/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Auth signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      user: data.user, 
      session: data.session,
      profile: { id: data.user.id, email, name, isAdmin: false }
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign in
app.post("/make-server-6a8bd82a/auth/signin", async (c) => {
  try {
    const { email, password, isAdmin } = await c.req.json();

    // Check if admin login
    if (isAdmin) {
      // Admin credentials check
      if (email === 'admin@rizia.com' && password === 'admin123') {
        // Create/get admin user
        const adminId = 'admin-rizia-2025';
        const adminData = {
          id: adminId,
          email: 'admin@rizia.com',
          name: 'Rizia Admin',
          isAdmin: true,
        };
        await kv.set(`user:${adminId}`, adminData);
        
        return c.json({ 
          user: { id: adminId, email: 'admin@rizia.com' },
          accessToken: 'admin-token-' + Date.now(),
          profile: adminData
        });
      } else {
        return c.json({ error: 'Invalid admin credentials' }, 401);
      }
    }

    // Regular user sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Auth signin error: ${error.message}`);
      return c.json({ error: error.message }, 401);
    }

    // Get user profile
    const profile = await kv.get(`user:${data.user.id}`);

    return c.json({ 
      user: data.user,
      session: data.session,
      accessToken: data.session.access_token,
      profile: profile || { id: data.user.id, email: data.user.email, name: email.split('@')[0], isAdmin: false }
    });
  } catch (error) {
    console.log(`Signin error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get session
app.get("/make-server-6a8bd82a/auth/session", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);

    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);

    return c.json({ 
      user,
      profile: profile || { id: user.id, email: user.email, name: user.email?.split('@')[0], isAdmin: false }
    });
  } catch (error) {
    console.log(`Session error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Sign out
app.post("/make-server-6a8bd82a/auth/signout", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // For admin tokens, just acknowledge the signout
    if (authHeader && authHeader.startsWith('admin-token-')) {
      return c.json({ success: true });
    }

    // For regular users, we don't need to do anything server-side
    // Token invalidation is handled by the client removing the token
    // Supabase sessions are managed on the client side
    return c.json({ success: true });
  } catch (error) {
    console.log(`Signout error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== EVENTS ROUTES ====================

// Get all events (with optional city filter)
app.get("/make-server-6a8bd82a/events", async (c) => {
  try {
    const city = c.req.query('city');
    
    const events = await kv.getByPrefix('event:');
    let eventsList = events.map(e => e.value);

    if (city) {
      eventsList = eventsList.filter(e => e.city === city);
    }

    return c.json({ events: eventsList });
  } catch (error) {
    console.log(`Get events error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get event by ID
app.get("/make-server-6a8bd82a/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);

    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    return c.json({ event });
  } catch (error) {
    console.log(`Get event error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Create event (admin only)
app.post("/make-server-6a8bd82a/events", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const eventData = await c.req.json();
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      id: eventId,
      ...eventData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`event:${eventId}`, event);

    return c.json({ event });
  } catch (error) {
    console.log(`Create event error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Update event (admin only)
app.put("/make-server-6a8bd82a/events/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existingEvent = await kv.get(`event:${id}`);
    if (!existingEvent) {
      return c.json({ error: 'Event not found' }, 404);
    }

    const updatedEvent = {
      ...existingEvent,
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`event:${id}`, updatedEvent);

    return c.json({ event: updatedEvent });
  } catch (error) {
    console.log(`Update event error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete event (admin only)
app.delete("/make-server-6a8bd82a/events/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const id = c.req.param('id');
    await kv.del(`event:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete event error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== BOOKINGS ROUTES ====================

// Get user bookings
app.get("/make-server-6a8bd82a/bookings/user/:userId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);

    if (!user && !authHeader?.startsWith('admin-token-')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const bookings = await kv.getByPrefix(`booking:user:${userId}:`);

    return c.json({ bookings: bookings.map(b => b.value) });
  } catch (error) {
    console.log(`Get user bookings error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all bookings (admin only)
app.get("/make-server-6a8bd82a/bookings", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const bookings = await kv.getByPrefix('booking:user:');
    return c.json({ bookings: bookings.map(b => b.value) });
  } catch (error) {
    console.log(`Get all bookings error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Create booking
app.post("/make-server-6a8bd82a/bookings", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);

    if (!user && !authHeader?.startsWith('admin-token-')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookingData = await c.req.json();
    const bookingId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const booking = {
      id: bookingId,
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: bookingData.status || 'Confirmed',
    };

    // Store booking with composite key for easy user lookup
    await kv.set(`booking:user:${booking.userId}:${bookingId}`, booking);
    // Also store by event for admin queries
    await kv.set(`booking:event:${booking.eventId}:${bookingId}`, booking);

    return c.json({ booking });
  } catch (error) {
    console.log(`Create booking error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Update booking status
app.put("/make-server-6a8bd82a/bookings/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const bookingId = c.req.param('id');
    const { status } = await c.req.json();

    // Find the booking
    const allBookings = await kv.getByPrefix('booking:user:');
    const bookingEntry = allBookings.find(b => b.value.id === bookingId);

    if (!bookingEntry) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    const updatedBooking = {
      ...bookingEntry.value,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:user:${updatedBooking.userId}:${bookingId}`, updatedBooking);
    await kv.set(`booking:event:${updatedBooking.eventId}:${bookingId}`, updatedBooking);

    return c.json({ booking: updatedBooking });
  } catch (error) {
    console.log(`Update booking error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== SUBMISSIONS ROUTES ====================

// Get user submissions
app.get("/make-server-6a8bd82a/submissions/user/:userId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);

    if (!user && !authHeader?.startsWith('admin-token-')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const submissions = await kv.getByPrefix(`submission:user:${userId}:`);

    return c.json({ submissions: submissions.map(s => s.value) });
  } catch (error) {
    console.log(`Get user submissions error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all submissions (admin only)
app.get("/make-server-6a8bd82a/submissions", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const submissions = await kv.getByPrefix('submission:user:');
    return c.json({ submissions: submissions.map(s => s.value) });
  } catch (error) {
    console.log(`Get all submissions error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get submissions by event
app.get("/make-server-6a8bd82a/submissions/event/:eventId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const eventId = c.req.param('eventId');
    const submissions = await kv.getByPrefix(`submission:event:${eventId}:`);

    return c.json({ submissions: submissions.map(s => s.value) });
  } catch (error) {
    console.log(`Get event submissions error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Create submission
app.post("/make-server-6a8bd82a/submissions", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);

    if (!user && !authHeader?.startsWith('admin-token-')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const submissionData = await c.req.json();
    const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const submission = {
      id: submissionId,
      ...submissionData,
      createdAt: new Date().toISOString(),
      status: submissionData.status || 'Submitted',
    };

    // Store submission with composite keys
    await kv.set(`submission:user:${submission.userId}:${submissionId}`, submission);
    await kv.set(`submission:event:${submission.competitionId}:${submissionId}`, submission);

    return c.json({ submission });
  } catch (error) {
    console.log(`Create submission error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Update submission status (admin only)
app.put("/make-server-6a8bd82a/submissions/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const submissionId = c.req.param('id');
    const { status } = await c.req.json();

    // Find the submission
    const allSubmissions = await kv.getByPrefix('submission:user:');
    const submissionEntry = allSubmissions.find(s => s.value.id === submissionId);

    if (!submissionEntry) {
      return c.json({ error: 'Submission not found' }, 404);
    }

    const updatedSubmission = {
      ...submissionEntry.value,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`submission:user:${updatedSubmission.userId}:${submissionId}`, updatedSubmission);
    await kv.set(`submission:event:${updatedSubmission.competitionId}:${submissionId}`, updatedSubmission);

    return c.json({ submission: updatedSubmission });
  } catch (error) {
    console.log(`Update submission error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== USER ROUTES ====================

// Get all users (admin only)
app.get("/make-server-6a8bd82a/users", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    const users = await kv.getByPrefix('user:');
    return c.json({ users: users.map(u => u.value) });
  } catch (error) {
    console.log(`Get users error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Update user profile
app.put("/make-server-6a8bd82a/users/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);

    if (!user && !authHeader?.startsWith('admin-token-')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingUser = await kv.get(`user:${userId}`);
    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Users can only update their own profile unless admin
    if (user && user.id !== userId) {
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Cannot update other users' }, 403);
      }
    }

    const updatedUser = {
      ...existingUser,
      ...updates,
      id: userId, // Preserve ID
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({ user: updatedUser });
  } catch (error) {
    console.log(`Update user error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ANALYTICS ROUTES ====================

// Get analytics data (admin only)
app.get("/make-server-6a8bd82a/analytics", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    // Check if admin
    if (!authHeader || !authHeader.startsWith('admin-token-')) {
      const user = await verifyAuth(authHeader);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      
      const profile = await kv.get(`user:${user.id}`);
      if (!profile?.isAdmin) {
        return c.json({ error: 'Admin access required' }, 403);
      }
    }

    // Get counts
    const events = await kv.getByPrefix('event:');
    const bookings = await kv.getByPrefix('booking:user:');
    const submissions = await kv.getByPrefix('submission:user:');
    const users = await kv.getByPrefix('user:');

    // Calculate revenue
    const totalRevenue = bookings.reduce((sum, b) => {
      const amount = parseFloat(b.value.totalAmount?.replace(/[₹,]/g, '') || '0');
      return sum + amount;
    }, 0);

    // Category breakdown
    const categoryStats = {};
    events.forEach(e => {
      const category = e.value.category;
      if (!categoryStats[category]) {
        categoryStats[category] = 0;
      }
      categoryStats[category]++;
    });

    // City breakdown
    const cityStats = {};
    events.forEach(e => {
      const city = e.value.city;
      if (!cityStats[city]) {
        cityStats[city] = 0;
      }
      cityStats[city]++;
    });

    return c.json({
      totalEvents: events.length,
      totalBookings: bookings.length,
      totalSubmissions: submissions.length,
      totalUsers: users.length,
      totalRevenue,
      categoryStats,
      cityStats,
      recentBookings: bookings.slice(-10).map(b => b.value).reverse(),
    });
  } catch (error) {
    console.log(`Get analytics error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== INITIALIZE DEFAULT DATA ====================

// Initialize with default events
app.post("/make-server-6a8bd82a/init", async (c) => {
  try {
    // Check if already initialized
    const existingEvents = await kv.getByPrefix('event:');
    if (existingEvents.length > 0) {
      return c.json({ message: 'Already initialized', count: existingEvents.length });
    }

    // Default events data - compact version
    const defaultEvents = [
      {
        id: '1', title: 'Arambikal​ama? - Tamil Unplugged Night', category: 'Concert',
        description: 'A full Tamil unplugged night by Jammmify at AEIOU Manyata Tech Park',
        fullDescription: 'ARAMBIKALAMA? A full Tamil unplugged night by Jammmify at AEIOU!',
        city: 'Bengaluru', venue: 'AEIOU Manyata, Manyata Tech Park',
        venueAddress: 'Manyata Tech Park, Nagavara, Bengaluru, Karnataka 560045',
        date: 'Dec 07, 2025', time: '7:00 PM onwards', price: '₹499 onwards',
        image: 'https://images.unsplash.com/photo-1642552556378-549e3445315e?w=1080',
        tags: ['Concert', 'Jamming', 'Tamil'], language: 'Tamil', ageRestriction: 'All age groups',
        features: ['Indoor Event', 'Family-Friendly', 'All safety measures'],
        latitude: 13.0458, longitude: 77.6208
      },
      {
        id: '2', title: 'Standup Comedy Night with Kenny Sebastian', category: 'Comedy',
        description: 'An evening of laughter with one of India\'s finest comedians',
        fullDescription: 'Join us for a hilarious night of standup comedy featuring Kenny Sebastian.',
        city: 'Mumbai', venue: 'Phoenix Marketcity, Kurla',
        venueAddress: 'Phoenix Marketcity, LBS Marg, Kurla West, Mumbai 400070',
        date: 'Dec 15, 2025', time: '8:00 PM', price: '₹799 onwards',
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1080',
        tags: ['Comedy', 'Standup'], language: 'English/Hindi', ageRestriction: '18+',
        features: ['Indoor Event', 'All safety measures'], latitude: 19.0822, longitude: 72.8865
      },
      {
        id: '3', title: 'Sunburn Arena ft. Martin Garrix', category: 'Music Festival',
        description: 'Asia\'s biggest EDM festival featuring international DJ Martin Garrix',
        fullDescription: 'Experience the ultimate EDM extravaganza with Martin Garrix live in concert.',
        city: 'Bengaluru', venue: 'Jayamahal Palace Grounds',
        venueAddress: 'Jayamahal Palace Grounds, Bengaluru, Karnataka 560006',
        date: 'Dec 31, 2025', time: '6:00 PM onwards', price: '₹2,499 onwards',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1080',
        tags: ['Music Festival', 'EDM', 'Dance'], language: 'All', ageRestriction: '18+',
        features: ['Outdoor Event', 'Multiple stages', 'Food available'], latitude: 13.0067, longitude: 77.5963
      },
      {
        id: '4', title: 'Classical Carnatic Music Evening', category: 'Concert',
        description: 'An evening of classical Carnatic music by renowned artists',
        fullDescription: 'Immerse yourself in the rich tradition of Carnatic music.',
        city: 'Chennai', venue: 'Music Academy',
        venueAddress: 'The Music Academy, TTK Road, Royapettah, Chennai 600014',
        date: 'Jan 05, 2026', time: '6:30 PM', price: '₹350 onwards',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1080',
        tags: ['Classical Music', 'Carnatic'], language: 'Tamil', ageRestriction: 'All ages',
        features: ['Indoor Event', 'Traditional', 'Family-Friendly'], latitude: 13.0527, longitude: 80.2569
      },
      {
        id: '5', title: 'Contemporary Dance Workshop', category: 'Dance',
        description: 'Learn contemporary dance from international choreographers',
        fullDescription: 'A 3-day intensive workshop on contemporary dance techniques.',
        city: 'Mumbai', venue: 'Prithvi Theatre',
        venueAddress: 'Prithvi Theatre, Juhu Church Road, Mumbai 400049',
        date: 'Jan 20, 2026', time: '10:00 AM - 5:00 PM', price: '₹3,500 for 3 days',
        image: 'https://images.unsplash.com/photo-1698824554771-293b5dcc42db?w=1080',
        tags: ['Dance', 'Workshop'], language: 'English', ageRestriction: '16+',
        features: ['Indoor Event', 'Professional training', 'Certificate'], latitude: 19.1076, longitude: 72.8263
      },
      {
        id: '6', title: 'Art Exhibition - Modern Perspectives', category: 'Art',
        description: 'A curated exhibition of contemporary Indian art',
        fullDescription: 'Explore the works of emerging and established Indian artists.',
        city: 'New Delhi', venue: 'National Gallery of Modern Art',
        venueAddress: 'Jaipur House, India Gate, New Delhi 110003',
        date: 'Dec 10, 2025', time: '10:00 AM - 6:00 PM', price: '₹100',
        image: 'https://images.unsplash.com/photo-1683222042853-37cd29faf895?w=1080',
        tags: ['Art', 'Exhibition'], language: 'All', ageRestriction: 'All ages',
        features: ['Indoor Event', 'Guided tours', 'Family-Friendly'], latitude: 28.6129, longitude: 77.2295
      },
      {
        id: '7', title: 'Poetry Slam Competition', category: 'Literature',
        description: 'Compete in Hyderabad\'s biggest poetry slam event',
        fullDescription: 'Showcase your poetry skills in this high-energy slam competition.',
        city: 'Hyderabad', venue: 'Lamakaan',
        venueAddress: 'Lamakaan, Road No. 1, Banjara Hills, Hyderabad 500034',
        date: 'Dec 18, 2025', time: '7:00 PM', price: 'Free Entry',
        image: 'https://images.unsplash.com/photo-1612907260223-2c7aff7a7d3d?w=1080',
        tags: ['Poetry', 'Literature', 'Competition'], language: 'English/Hindi/Telugu', ageRestriction: 'All ages',
        features: ['Indoor Event', 'Open Mic', 'Prizes'], latitude: 17.4239, longitude: 78.4738
      },
      {
        id: '8', title: 'Food & Music Festival', category: 'Festival',
        description: 'A celebration of food and music from across India',
        fullDescription: 'Experience the best of Indian cuisine paired with live music performances.',
        city: 'Bengaluru', venue: 'Cubbon Park',
        venueAddress: 'Kasturba Road, Sampangi Rama Nagar, Bengaluru 560001',
        date: 'Jan 25, 2026', time: '11:00 AM - 10:00 PM', price: '₹200 (Entry)',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1080',
        tags: ['Festival', 'Food', 'Music'], language: 'All', ageRestriction: 'All ages',
        features: ['Outdoor Event', 'Food stalls', 'Live music', 'Family-Friendly'], latitude: 12.9763, longitude: 77.5925
      },
      {id: '9', title: 'Zakir Khan Live - Comedy Tour', category: 'Comedy', description: 'India\'s favorite comedian Zakir Khan performing live', fullDescription: 'Experience an evening of relatable humor.', city: 'New Delhi', venue: 'Siri Fort Auditorium', venueAddress: 'Siri Fort Auditorium, New Delhi 110049', date: 'Dec 22, 2025', time: '7:30 PM', price: '₹999 onwards', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1080', tags: ['Comedy', 'Standup'], language: 'Hindi', ageRestriction: '16+', features: ['Indoor Event', 'Reserved seating'], latitude: 28.5494, longitude: 77.2195},
      {id: '10', title: 'Bollywood Dance Workshop', category: 'Dance', description: 'Learn Bollywood dance moves from professional choreographers', fullDescription: 'Master the art of Bollywood dancing.', city: 'Mumbai', venue: 'Shiamak Davar Dance Academy', venueAddress: 'Bandra West, Mumbai 400050', date: 'Dec 28, 2025', time: '4:00 PM - 7:00 PM', price: '₹1,200', image: 'https://images.unsplash.com/photo-1698824554771-293b5dcc42db?w=1080', tags: ['Dance', 'Bollywood'], language: 'Hindi/English', ageRestriction: '12+', features: ['Indoor Event', 'Professional instruction'], latitude: 19.0596, longitude: 72.8295},
      {id: '11', title: 'Rock Concert - The Local Train', category: 'Concert', description: 'India\'s popular indie rock band performing live', fullDescription: 'Experience the electrifying performance of The Local Train.', city: 'Pune', venue: 'Hard Rock Cafe', venueAddress: 'Hard Rock Cafe, Koregaon Park, Pune 411001', date: 'Jan 10, 2026', time: '8:00 PM', price: '₹1,499 onwards', image: 'https://images.unsplash.com/photo-1642552556378-549e3445315e?w=1080', tags: ['Concert', 'Rock'], language: 'Hindi/English', ageRestriction: '18+', features: ['Indoor Event', 'Bar available'], latitude: 18.5362, longitude: 73.8958},
      {id: '12', title: 'Literature Festival 2026', category: 'Literature', description: 'India\'s premier literature festival featuring renowned authors', fullDescription: 'Meet your favorite authors and attend book readings.', city: 'Jaipur', venue: 'Diggi Palace', venueAddress: 'Diggi Palace, Jaipur 302004', date: 'Jan 15, 2026', time: '9:00 AM - 6:00 PM', price: '₹500 per day', image: 'https://images.unsplash.com/photo-1612907260223-2c7aff7a7d3d?w=1080', tags: ['Literature', 'Books'], language: 'Multiple', ageRestriction: 'All ages', features: ['Outdoor/Indoor venues', 'Book signings', 'Family-Friendly'], latitude: 26.9124, longitude: 75.7873}
    ];

    // Store all events
    for (const event of defaultEvents) {
      await kv.set(`event:${event.id}`, event);
    }

    return c.json({ message: 'Initialized successfully', count: defaultEvents.length });
  } catch (error) {
    console.log(`Init error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);