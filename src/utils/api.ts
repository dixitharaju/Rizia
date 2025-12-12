import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6a8bd82a`;

// Helper function to get auth header
function getAuthHeader(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  return headers;
}

// ==================== AUTH API ====================

export async function signup(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Signup error:', data.error);
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

export async function signin(email: string, password: string, isAdmin: boolean = false) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ email, password, isAdmin }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Signin error:', data.error);
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function getSession(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get session error:', data.error);
    throw new Error(data.error || 'Failed to get session');
  }

  return data;
}

export async function signout(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signout`, {
    method: 'POST',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Signout error:', data.error);
    throw new Error(data.error || 'Signout failed');
  }

  return data;
}

// ==================== EVENTS API ====================

export async function getEvents(city?: string) {
  const url = city ? `${API_BASE_URL}/events?city=${encodeURIComponent(city)}` : `${API_BASE_URL}/events`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get events error:', data.error);
    throw new Error(data.error || 'Failed to fetch events');
  }

  return data.events;
}

export async function getEventById(id: string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get event error:', data.error);
    throw new Error(data.error || 'Failed to fetch event');
  }

  return data.event;
}

export async function createEvent(token: string, eventData: any) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Create event error:', data.error);
    throw new Error(data.error || 'Failed to create event');
  }

  return data.event;
}

export async function updateEvent(token: string, id: string, updates: any) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(token),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Update event error:', data.error);
    throw new Error(data.error || 'Failed to update event');
  }

  return data.event;
}

export async function deleteEvent(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Delete event error:', data.error);
    throw new Error(data.error || 'Failed to delete event');
  }

  return data;
}

// ==================== BOOKINGS API ====================

export async function getUserBookings(token: string, userId: string) {
  const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get user bookings error:', data.error);
    throw new Error(data.error || 'Failed to fetch bookings');
  }

  return data.bookings;
}

export async function getAllBookings(token: string) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get all bookings error:', data.error);
    throw new Error(data.error || 'Failed to fetch bookings');
  }

  return data.bookings;
}

export async function createBooking(token: string, bookingData: any) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Create booking error:', data.error);
    throw new Error(data.error || 'Failed to create booking');
  }

  return data.booking;
}

export async function updateBookingStatus(token: string, bookingId: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'PUT',
    headers: getAuthHeader(token),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Update booking error:', data.error);
    throw new Error(data.error || 'Failed to update booking');
  }

  return data.booking;
}

// ==================== SUBMISSIONS API ====================

export async function getUserSubmissions(token: string, userId: string) {
  const response = await fetch(`${API_BASE_URL}/submissions/user/${userId}`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get user submissions error:', data.error);
    throw new Error(data.error || 'Failed to fetch submissions');
  }

  return data.submissions;
}

export async function getAllSubmissions(token: string) {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get all submissions error:', data.error);
    throw new Error(data.error || 'Failed to fetch submissions');
  }

  return data.submissions;
}

export async function getEventSubmissions(token: string, eventId: string) {
  const response = await fetch(`${API_BASE_URL}/submissions/event/${eventId}`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get event submissions error:', data.error);
    throw new Error(data.error || 'Failed to fetch event submissions');
  }

  return data.submissions;
}

export async function createSubmission(token: string, submissionData: any) {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify(submissionData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Create submission error:', data.error);
    throw new Error(data.error || 'Failed to create submission');
  }

  return data.submission;
}

export async function updateSubmissionStatus(token: string, submissionId: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}`, {
    method: 'PUT',
    headers: getAuthHeader(token),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Update submission error:', data.error);
    throw new Error(data.error || 'Failed to update submission');
  }

  return data.submission;
}

// ==================== USERS API ====================

export async function getAllUsers(token: string) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Get users error:', data.error);
    throw new Error(data.error || 'Failed to fetch users');
  }

  return data.users;
}

export async function updateUserProfile(token: string, userId: string, updates: any) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeader(token),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Update user error:', data.error);
    throw new Error(data.error || 'Failed to update user');
  }

  return data.user;
}

// ==================== ANALYTICS API ====================

export async function getAnalytics(token: string) {
  const response = await fetch(`${API_BASE_URL}/analytics`, {
    method: 'GET',
    headers: getAuthHeader(token),
  });

  const data = await response.json();

  if (!response.ok) {
    // Silently fail for analytics - don't log errors
    throw new Error(data.error || 'Failed to fetch analytics');
  }

  return data;
}

// ==================== INITIALIZATION ====================

export async function initializeData() {
  const response = await fetch(`${API_BASE_URL}/init`, {
    method: 'POST',
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Init error:', data.error);
    throw new Error(data.error || 'Failed to initialize data');
  }

  return data;
}