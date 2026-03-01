import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  User as UserIcon,
  Mail,
  Phone,
  TrendingUp,
  Award,
  History,
  Settings,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { fetchUserBookings } from '../utils/supabaseHelpers';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings');

  useEffect(() => {
    loadUserBookings();
  }, [user]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchUserBookings(user.id);
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <AlertCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  const upcomingBookings = bookings.filter(b => new Date(b.event_date) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.event_date) < new Date());

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} onLogout={onLogout} />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <UserIcon size={32} />
                  </div>
                  <div>
                    <h1 className="text-white text-3xl mb-1">Welcome back, {user.name}!</h1>
                    <p className="text-purple-200">Manage your bookings and profile</p>
                  </div>
                </div>
                <Link
                  to="/competitions"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                >
                  <Ticket size={20} />
                  <span>Browse Events</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
                  <Ticket className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl text-white mb-1">{bookings.length}</div>
                  <div className="text-sm text-purple-200">Total Bookings</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl text-white mb-1">{upcomingBookings.length}</div>
                  <div className="text-sm text-purple-200">Upcoming Events</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-3xl text-white mb-1">{pastBookings.length}</div>
                  <div className="text-sm text-purple-200">Events Attended</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="border-b border-white/20">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 px-6 py-4 font-medium transition-all ${
                    activeTab === 'bookings'
                      ? 'text-white bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-b-2 border-purple-400'
                      : 'text-purple-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Ticket size={20} />
                    <span>My Bookings</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 font-medium transition-all ${
                    activeTab === 'profile'
                      ? 'text-white bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-b-2 border-purple-400'
                      : 'text-purple-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <UserIcon size={20} />
                    <span>Profile</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'bookings' ? (
                <div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-purple-200">Loading your bookings...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="text-purple-300" size={40} />
                      </div>
                      <h3 className="text-white text-xl mb-2">No bookings yet</h3>
                      <p className="text-purple-200 mb-6">Start exploring and booking amazing events!</p>
                      <Link
                        to="/competitions"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                      >
                        <Ticket size={20} />
                        <span>Browse Events</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Upcoming Bookings */}
                      {upcomingBookings.length > 0 && (
                        <div>
                          <h3 className="text-white text-xl mb-4 flex items-center gap-2">
                            <Calendar size={24} />
                            Upcoming Events
                          </h3>
                          <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                                        <Ticket className="text-white" size={20} />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-white text-lg mb-1">{booking.event_name}</h4>
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${getStatusColor(booking.status)}`}>
                                          {getStatusIcon(booking.status)}
                                          <span className="capitalize">{booking.status}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                      <div className="flex items-center gap-2 text-purple-200">
                                        <Calendar size={16} />
                                        <span>{booking.event_date}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-purple-200">
                                        <Clock size={16} />
                                        <span>{booking.event_time}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-purple-200">
                                        <MapPin size={16} />
                                        <span>{booking.venue}, {booking.city}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-purple-200">
                                        <Ticket size={16} />
                                        <span>{booking.ticket_count} Ticket(s)</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-2">
                                    <div className="text-2xl text-white">₹{booking.total_price}</div>
                                    <div className="text-xs text-purple-300">
                                      Booked on {new Date(booking.booking_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Past Bookings */}
                      {pastBookings.length > 0 && (
                        <div>
                          <h3 className="text-white text-xl mb-4 flex items-center gap-2">
                            <History size={24} />
                            Past Events
                          </h3>
                          <div className="space-y-4">
                            {pastBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 opacity-75 hover:opacity-100 transition-all"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
                                        <Ticket className="text-white" size={20} />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-white text-lg mb-1">{booking.event_name}</h4>
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs border border-gray-500/30">
                                          <CheckCircle size={16} />
                                          <span>Completed</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-purple-200">
                                      <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{booking.event_date}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{booking.venue}, {booking.city}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-xl text-purple-300">₹{booking.total_price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-white text-xl mb-6">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <UserIcon className="text-purple-300" size={20} />
                        <span className="text-purple-300 text-sm">Name</span>
                      </div>
                      <div className="text-white text-lg">{user.name}</div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="text-purple-300" size={20} />
                        <span className="text-purple-300 text-sm">Email</span>
                      </div>
                      <div className="text-white text-lg">{user.email}</div>
                    </div>

                    {user.phone && (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="text-purple-300" size={20} />
                          <span className="text-purple-300 text-sm">Phone</span>
                        </div>
                        <div className="text-white text-lg">{user.phone}</div>
                      </div>
                    )}

                    {user.city && (
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="text-purple-300" size={20} />
                          <span className="text-purple-300 text-sm">City</span>
                        </div>
                        <div className="text-white text-lg">{user.city}</div>
                      </div>
                    )}

                    <Link
                      to="/account-settings"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                    >
                      <Settings size={20} />
                      <span>Edit Profile</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
