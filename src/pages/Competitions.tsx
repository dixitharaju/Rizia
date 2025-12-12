import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import * as api from '../utils/api';
import { Filter, MapPin } from 'lucide-react';

interface CompetitionsProps {
  user?: any;
  selectedCity?: string | null;
  onChangeCity?: () => void;
}

export default function Competitions({ user, selectedCity, onChangeCity }: CompetitionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Concert', 'Comedy', 'Dance', 'Art', 'Literature', 'Music Festival', 'Festival'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await api.getEvents(selectedCity || undefined);
        setEvents(fetchedEvents || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCity]);

  // Filter by category
  const filteredEvents = events.filter((event) => {
    if (!event) return false; // Filter out null/undefined events
    if (selectedCategory === 'All') return true;
    return event.category === selectedCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} selectedCity={selectedCity} onChangeCity={onChangeCity} />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header with City */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-gray-900 mb-2">
                  {selectedCity ? `Events in ${selectedCity}` : 'All Events'}
                </h1>
                <p className="text-gray-600">
                  Discover amazing experiences happening around you
                </p>
              </div>
              {selectedCity && onChangeCity && (
                <button
                  onClick={onChangeCity}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <MapPin size={18} />
                  <span>Change City</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-red-500" />
              <span className="text-gray-900">Filter Events</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Events</option>
                  <option value="deadline">Date (Earliest First)</option>
                  <option value="new">Newly Added</option>
                </select>
              </div>
            </div>
          </div>

          {/* Event Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {selectedCity && ` in ${selectedCity}`}
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
              <CompetitionCard
                key={event.id}
                id={event.id}
                title={event.title}
                category={event.category}
                description={event.description}
                deadline={event.date}
                prize={event.price}
                image={event.image}
                venue={event.venue}
                city={event.city}
              />
            ))}
          </div>

          {sortedEvents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">
                {selectedCity 
                  ? `No events found in ${selectedCity} for this category. Try selecting a different category or city.`
                  : 'No events found for this category. Try selecting a different category.'
                }
              </p>
              {selectedCity && onChangeCity && (
                <button
                  onClick={onChangeCity}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:from-red-600 hover:to-orange-600 transition-colors"
                >
                  <MapPin size={18} />
                  <span>Change City</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}