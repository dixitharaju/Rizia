import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import * as api from '../utils/api';
import { Calendar, FileText, Trophy, Settings } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id || !user?.accessToken) return;

      try {
        setLoading(true);
        const [fetchedEvents, fetchedBookings, fetchedSubmissions] = await Promise.all([
          api.getEvents(),
          api.getUserBookings(user.accessToken, user.id),
          api.getUserSubmissions(user.accessToken, user.id)
        ]);
        
        setEvents(fetchedEvents || []);
        setBookings(fetchedBookings || []);
        setSubmissions(fetchedSubmissions || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} onLogout={onLogout} />
      
      <main className="flex-1 py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <h1 className="text-gray-900 mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">
              Here's an overview of your competitions and submissions
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="text-blue-600" size={24} />
                <span className="text-gray-600">Active Competitions</span>
              </div>
              <div className="text-gray-900">{events.length}</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-green-600" size={24} />
                <span className="text-gray-600">Registered</span>
              </div>
              <div className="text-gray-900">{bookings.length}</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-purple-600" size={24} />
                <span className="text-gray-600">Submissions</span>
              </div>
              <div className="text-gray-900">{submissions.length}</div>
            </div>

            <Link to="/account-settings" className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-600 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="text-gray-600" size={24} />
                <span className="text-gray-600">Settings</span>
              </div>
              <div className="text-gray-900">Manage Account</div>
            </Link>
          </div>

          {/* Pending Submissions Alert */}
          {bookings.length > 0 && submissions.length < bookings.length && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-yellow-900 mb-2">Pending Submissions</h3>
              <p className="text-yellow-800 mb-4">
                You have {bookings.length - submissions.length} competition(s) awaiting your submission
              </p>
              <div className="space-y-2">
                {bookings.map((booking) => {
                  const event = events.find(e => e.id === booking.eventId);
                  if (!event) return null;
                  const isSubmitted = submissions.some(sub => sub.eventId === event.id);
                  if (isSubmitted) return null;
                  return (
                    <div key={event.id} className="flex items-center justify-between bg-white rounded p-3">
                      <div>
                        <div className="text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600">Deadline: {event.deadline}</div>
                      </div>
                      <Link
                        to={`/submission/${event.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Work
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/competitions"
              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <h3 className="text-gray-900 mb-2">View Competitions</h3>
              <p className="text-gray-600">Browse all available competitions</p>
            </Link>

            <Link
              to="/my-submissions"
              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <h3 className="text-gray-900 mb-2">My Submissions</h3>
              <p className="text-gray-600">View and manage your submissions</p>
            </Link>

            <Link
              to="/account-settings"
              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-600 hover:shadow-md transition-all"
            >
              <h3 className="text-gray-900 mb-2">Account Settings</h3>
              <p className="text-gray-600">Update your profile information</p>
            </Link>
          </div>

          {/* Registered Competitions */}
          {bookings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-gray-900 mb-6">Your Registered Competitions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => {
                  const event = events.find(e => e.id === booking.eventId);
                  if (!event) return null;
                  return (
                    <CompetitionCard
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      category={event.category}
                      description={event.description}
                      deadline={event.deadline}
                      prize={event.prize}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Competitions */}
          <div>
            <h2 className="text-gray-900 mb-6">Available Competitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <CompetitionCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  category={event.category}
                  description={event.description}
                  deadline={event.deadline}
                  prize={event.prize}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}