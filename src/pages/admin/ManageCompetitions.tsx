import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  FileText, 
  LogOut,
  Settings,
  Bell,
  Search,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  IndianRupee,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react';
import { RiziaLogo } from '../../components/RiziaLogo';
import * as api from '../../utils/api';

interface ManageCompetitionsProps {
  user: any;
  onLogout: () => void;
}

export default function ManageCompetitions({ user, onLogout }: ManageCompetitionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await api.getEvents();
        setEvents(fetchedEvents || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = ['All', 'Concert', 'Comedy', 'Dance', 'Art', 'Literature', 'Festival'];
  const cities = ['All', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || event.city === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Concert': 'from-pink-500 to-rose-500',
      'Comedy': 'from-amber-500 to-orange-500',
      'Dance': 'from-purple-500 to-violet-500',
      'Art': 'from-cyan-500 to-blue-500',
      'Literature': 'from-green-500 to-emerald-500',
      'Festival': 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <RiziaLogo size="md" />
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors relative">
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Settings size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)] p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-purple-200 dark:border-purple-800">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white truncate">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrator</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/manage-competitions"
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl shadow-lg group"
            >
              <Trophy size={20} />
              <span>Manage Events</span>
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group"
            >
              <FileText size={20} />
              <span>All Bookings</span>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group"
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group"
            >
              <Users size={20} />
              <span>Users</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-gray-900 dark:text-white text-3xl mb-2">Manage Events</h1>
                <p className="text-gray-600 dark:text-gray-400">Create, edit, and manage all your events</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span>Add New Event</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 min-w-64">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-white appearance-none cursor-pointer"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                <Download size={20} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Events Table */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">Event</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">Category</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">Location</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">Price</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(event.category)} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                            <Trophy size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">{event.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{event.description.substring(0, 40)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white rounded-full text-sm`}>
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white mb-1">
                            <Calendar size={14} />
                            <span>{event.date}</span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">{event.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{event.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                          <IndianRupee size={14} />
                          <span>{event.price.replace('₹', '')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-full text-sm">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/competition/${event.id}`}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                          </Link>
                          <button
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEvents.length} of {events.length} events
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all">
                  1
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}