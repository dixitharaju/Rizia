import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  FileText, 
  LogOut,
  Settings,
  Bell,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Activity,
  DollarSign,
  Eye,
  Ticket,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { RiziaLogo } from '../../components/RiziaLogo';
import { AdminMobileNav } from '../../components/AdminMobileNav';
import { fetchDashboardStats, fetchAllEvents, fetchAllBookings } from '../../utils/supabaseHelpers';

interface AnalyticsProps {
  onLogout: () => void;
}

export default function Analytics({ onLogout }: AnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [topEvents, setTopEvents] = useState<any[]>([]);
  const [cityPerformance, setCityPerformance] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, eventsData, bookingsData] = await Promise.all([
        fetchDashboardStats(),
        fetchAllEvents(),
        fetchAllBookings()
      ]);
      
      setStats(dashboardStats);
      
      // Calculate top performing events from real booking data
      const eventBookings = bookingsData.reduce((acc: any, booking: any) => {
        const eventId = booking.event_id;
        if (!acc[eventId]) {
          acc[eventId] = {
            name: booking.event_name,
            bookings: 0,
            revenue: 0
          };
        }
        acc[eventId].bookings += 1;
        acc[eventId].revenue += parseFloat(booking.total_price) || 0;
        return acc;
      }, {});

      const topEventsData = Object.values(eventBookings)
        .sort((a: any, b: any) => b.bookings - a.bookings)
        .slice(0, 5)
        .map((event: any) => ({
          name: event.name,
          bookings: event.bookings,
          revenue: `₹${event.revenue.toLocaleString('en-IN')}`,
          growth: '+0%'
        }));
      setTopEvents(topEventsData.length > 0 ? topEventsData : []);

      // Calculate city performance from real booking data
      const cityStats = bookingsData.reduce((acc: any, booking: any) => {
        const city = booking.city || 'Unknown';
        if (!acc[city]) {
          acc[city] = { city, bookings: 0, revenue: 0 };
        }
        acc[city].bookings += 1;
        acc[city].revenue += parseFloat(booking.total_price) || 0;
        return acc;
      }, {});

      const totalCityBookings = Object.values(cityStats).reduce((sum: number, city: any) => sum + city.bookings, 0);
      const cityPerfData = Object.values(cityStats)
        .sort((a: any, b: any) => b.bookings - a.bookings)
        .slice(0, 5)
        .map((city: any) => ({
          city: city.city,
          bookings: city.bookings,
          revenue: `₹${city.revenue.toLocaleString('en-IN')}`,
          percentage: totalCityBookings > 0 ? Math.round((city.bookings / totalCityBookings) * 100) : 0
        }));
      setCityPerformance(cityPerfData.length > 0 ? cityPerfData : []);

      // Calculate category breakdown from real events data
      const categoryStats = eventsData.reduce((acc: any, event: any) => {
        const category = event.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += 1;
        return acc;
      }, {});

      const totalEvents = Object.values(categoryStats).reduce((sum: number, count: any) => sum + count, 0);
      const categoryColors: any = {
        'Concert': 'from-pink-500 to-rose-500',
        'Comedy': 'from-amber-500 to-orange-500',
        'Dance': 'from-purple-500 to-violet-500',
        'Art': 'from-cyan-500 to-blue-500',
        'Festival': 'from-indigo-500 to-purple-500',
        'Music': 'from-blue-500 to-cyan-500',
        'Literature': 'from-teal-500 to-emerald-500'
      };

      const categoryData = Object.entries(categoryStats)
        .map(([category, count]: [string, any]) => ({
          category,
          count,
          color: categoryColors[category] || 'from-gray-500 to-gray-600',
          percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);
      setCategoryBreakdown(categoryData.length > 0 ? categoryData : []);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings.toString(),
      change: '+0%',
      trend: 'up',
      icon: Ticket,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Total Events',
      value: stats.totalEvents.toString(),
      change: '+0%',
      trend: 'up',
      icon: Trophy,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Total Users',
      value: stats.totalUsers.toString(),
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <RiziaLogo size="sm" />
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              <button className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors relative">
                <Bell size={18} className="text-gray-600 dark:text-gray-400 md:w-5 md:h-5" />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg"
              >
                <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)] p-6">
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
              className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group"
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
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl shadow-lg group"
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
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <div>
                <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl mb-1">Analytics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Real-time insights into your platform performance</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm">
                  <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">All Time</span>
                  <span className="sm:hidden">All</span>
                </button>
                <button 
                  onClick={loadAnalyticsData}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg text-sm"
                >
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {displayStats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className={`p-2 md:p-3 bg-gradient-to-br ${stat.color} rounded-xl md:rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-white" size={20} />
                  </div>
                  {stat.change !== '+0%' && (
                    <div className={`flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg ${
                      stat.trend === 'up' 
                        ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span className="text-xs">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Performing Events */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-900 dark:text-white mb-6 text-xl">Top Performing Events</h2>
              {topEvents.length > 0 ? (
                <div className="space-y-4">
                  {topEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-900/50 dark:to-purple-950/30 rounded-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">{event.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">{event.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Ticket className="mx-auto mb-2" size={32} />
                  <p>No booking data yet</p>
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-900 dark:text-white mb-6 text-xl">Events by Category</h2>
              {categoryBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {categoryBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900 dark:text-white">{item.category}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Trophy className="mx-auto mb-2" size={32} />
                  <p>No events created yet</p>
                </div>
              )}
            </div>
          </div>

          {/* City Performance */}
          {cityPerformance.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
              <h2 className="text-gray-900 dark:text-white mb-4 md:mb-6 text-lg md:text-xl">City-wise Performance</h2>
              
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {cityPerformance.map((city, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-900/50 dark:to-purple-950/30 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 dark:text-white mb-1">{city.city}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{city.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white">{city.revenue}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all"
                          style={{ width: `${city.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{city.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">City</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Bookings</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Revenue</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600 dark:text-gray-400">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cityPerformance.map((city, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <td className="px-4 py-4 text-gray-900 dark:text-white">{city.city}</td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{city.bookings}</td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{city.revenue}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-xs">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"
                                style={{ width: `${city.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">{city.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <AdminMobileNav />
    </div>
  );
}
