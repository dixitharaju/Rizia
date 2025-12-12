import { useState, useEffect } from 'react';
import * as api from '../utils/api';
import { Event } from '../data/mockData';

export function useEvents(city?: string | null, category?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const allEvents = await api.getEvents(city || undefined);
      
      // Filter by category if provided
      let filteredEvents = allEvents;
      if (category) {
        filteredEvents = allEvents.filter((e: Event) => e.category === category);
      }
      
      setEvents(filteredEvents || []);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [city, category]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventData = await api.getEventById(id);
        setEvent(eventData || null);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return { event, loading, error };
}
