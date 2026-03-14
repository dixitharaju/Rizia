import { createClient } from '@supabase/supabase-js';

// Supabase credentials
// TODO: Replace with your actual anon public key from Supabase Dashboard
// Go to: Project Settings > API > Project API keys > anon public key
const supabaseUrl = 'https://ibzofkbppmhgfovlyhni.supabase.co';
const supabaseAnonKey = 'sb_publishable_AQ6n1B9Wm4USyPflfhRBXA_SGNv83Kb';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null && supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Helper function to hash passwords (simple version for demo)
export const hashPassword = async (password: string): Promise<string> => {
  // In production, use bcrypt or similar
  // For demo purposes, we'll use a simple hash
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Helper function to verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};