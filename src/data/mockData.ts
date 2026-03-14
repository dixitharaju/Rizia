// =====================================================
// TYPE DEFINITIONS FOR RIZIA COMPETITION PLATFORM
// All data now comes from Supabase database
// Theme: "Turning Back to Church History"
// =====================================================

export interface Competition {
  id: string;
  title: string;
  category: string;
  description: string;
  full_description?: string;
  age_group: string; // Children, Youth, Young Adults, School & Parish Groups
  duration?: string; // Time limit for the competition
  guidelines?: string;
  rules?: string[];
  max_participants?: number;
  submission_format?: string; // e.g., "PDF", "Video", "Live Performance"
  word_limit?: string;
  time_limit?: string;
  language_options?: string[];
  is_active?: boolean;
  created_at?: string;
  registration_deadline?: string;
  preliminary_date?: string;
  grand_finale_date?: string;
  venue?: string;
}

export interface Submission {
  id: string;
  competition_id: string;
  competition_name: string;
  competition_category: string;
  user_id: string;
  user_name: string;
  user_email: string;
  age_group: string;
  title: string;
  description: string;
  file_url?: string;
  submission_date: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Winner';
  score?: number;
  judge_feedback?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age_group?: string; // Children, Youth, Young Adults
  parish?: string;
  diocese?: string;
  created_at?: string;
}

// Competition categories available
export const COMPETITION_CATEGORIES = [
  // Main competition categories with specific guidelines
  'Drawing & Painting',
  'Article Writing',
  'Poetry',
  'Skit / Drama',
  'Choreography / Dance',
  'Vlogs / Short Videos',
  'Speech',
  // Umbrella/Grouping categories
  'Creative Arts',
  'Literary & Oratory',
  'Performing Arts',
  'Digital Media'
] as const;

export const AGE_GROUPS = [
  'Children',
  'Youth',
  'Young Adults',
  'School & Parish Groups'
] as const;

// For backward compatibility with existing code
export type Event = Competition;
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
export type Registration = Submission;