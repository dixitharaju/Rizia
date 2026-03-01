// =====================================================
// TYPE DEFINITIONS ONLY
// All data now comes from Supabase database
// =====================================================

export interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  full_description?: string;
  city: string;
  venue: string;
  venue_address?: string;
  date: string;
  time: string;
  price: string;
  image?: string;
  tags?: string[];
  language?: string;
  age_restriction?: string;
  features?: string[];
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  event_name: string;
  city: string;
  venue: string;
  event_date: string;
  event_time: string;
  ticket_count: number;
  total_price: string;
  booking_date: string;
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  created_at?: string;
}

export interface Submission {
  id: string;
  competition_id: string;
  competition_name: string;
  user_id: string;
  title: string;
  description: string;
  file_url: string;
  timestamp: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
}

// For backward compatibility
export type Competition = Event;
export type Registration = Booking;
