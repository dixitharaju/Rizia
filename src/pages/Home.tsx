import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { fetchActiveEvents } from '../utils/supabaseHelpers';
import { Sparkles, Trophy, Users, Award, ArrowRight, Star, CheckCircle, Calendar, BookOpen, Church, Heart, Zap, Pen, Video, Mic, TrendingUp, Ticket, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomeProps {
  user?: any;
  selectedCity?: string | null;
  onChangeCity?: () => void;
}

export default function Home({ user, selectedCity, onChangeCity }: HomeProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchActiveEvents();
      setEvents(data);
      
      // Calculate category counts dynamically
      const counts = data.reduce((acc: Record<string, number>, event: any) => {
        const category = event.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { 
      name: 'Drawing & Painting', 
      icon: '🎨', 
      image: 'https://images.unsplash.com/photo-1683222042853-37cd29faf895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMGNhbnZhc3xlbnwxfHx8fDE3NjQ4NDk1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Drawing & Painting'] || 0,
      gradient: 'from-purple-500 to-violet-500'
    },
    { 
      name: 'Article Writing', 
      icon: '✍️', 
      image: 'https://images.unsplash.com/photo-1612907260223-2c7aff7a7d3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbm90ZWJvb2slMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NjQ4NTE1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Article Writing'] || 0,
      gradient: 'from-teal-500 to-emerald-500'
    },
    { 
      name: 'Poetry', 
      icon: '📝', 
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1080',
      count: categoryCounts['Poetry'] || 0,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Skit / Drama', 
      icon: '🎭', 
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1080',
      count: categoryCounts['Skit / Drama'] || 0,
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Choreography / Dance', 
      icon: '💃', 
      image: 'https://images.unsplash.com/photo-1698824554771-293b5dcc42db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzY0ODI1Nzc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Choreography / Dance'] || 0,
      gradient: 'from-orange-500 to-amber-500'
    },
    { 
      name: 'Vlogs / Short Videos', 
      icon: '🎥', 
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1080',
      count: categoryCounts['Vlogs / Short Videos'] || 0,
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      name: 'Speech', 
      icon: '🎤', 
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1080',
      count: categoryCounts['Speech'] || 0,
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Creative Arts', 
      icon: '🖌️', 
      image: 'https://images.unsplash.com/photo-1761116182933-544a89286835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGFydHMlMjBwYWxldHRlJTIwYnJ1c2hlc3xlbnwxfHx8fDE3NzM1MTA0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Creative Arts'] || 0,
      gradient: 'from-fuchsia-500 to-pink-500'
    },
    { 
      name: 'Literary & Oratory', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1585742162711-ed1a0fb549ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwbGlicmFyeSUyMHJlYWRpbmclMjBsaXRlcmF0dXJlfGVufDF8fHx8MTc3MzUxMDQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Literary & Oratory'] || 0,
      gradient: 'from-green-500 to-teal-500'
    },
    { 
      name: 'Performing Arts', 
      icon: '🎪', 
      image: 'https://images.unsplash.com/photo-1761618291331-535983ae4296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzM0OTY2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Performing Arts'] || 0,
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      name: 'Digital Media', 
      icon: '📱', 
      image: 'https://images.unsplash.com/photo-1758553026412-bc1da0ebd366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWVkaWElMjBjYW1lcmElMjBwcm9kdWN0aW9ufGVufDF8fHx8MTc3MzUxMDQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      count: categoryCounts['Digital Media'] || 0,
      gradient: 'from-sky-500 to-blue-500'
    }
  ];

  const stats = [
    { label: 'Active Categories', value: '11', icon: Trophy, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Participants', value: '500+', icon: Users, gradient: 'from-purple-500 to-indigo-500' },
    { label: 'Age Groups', value: '4', icon: Award, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Total Submissions', value: events.length.toString(), icon: BookOpen, gradient: 'from-orange-500 to-amber-500' }
  ];

  // Filter events by selected city
  const displayEvents = selectedCity 
    ? events.filter(event => event.city === selectedCity).slice(0, 6)
    : events.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} selectedCity={selectedCity} onChangeCity={onChangeCity} />
      
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Stats Section with Enhanced Design */}
        <section className="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-white" size={28} />
                  </div>
                  <div className="text-3xl md:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Categories with Enhanced Cards */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/50 dark:to-purple-950/50 rounded-full mb-4">
                <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-700 dark:text-purple-300">Explore Categories</span>
              </div>
              <h2 className="text-gray-900 dark:text-white mb-4 text-4xl md:text-5xl">Browse by Category</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Choose your category and express your faith creatively
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to="/competitions"
                  className="group relative overflow-hidden rounded-3xl aspect-square bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <ImageWithFallback 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-6">
                    <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">{category.icon}</div>
                    <div className="text-white text-center mb-2 group-hover:text-lg transition-all">{category.name}</div>
                    <div className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${category.gradient} text-white`}>
                      {category.count} competitions
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Events with New Design */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full mb-4">
                  <TrendingUp size={18} className="text-pink-600" />
                  <span className="text-sm text-pink-700">Featured Categories</span>
                </div>
                <h2 className="text-gray-900 mb-2 text-4xl md:text-5xl">
                  {selectedCity ? `Competitions in ${selectedCity}` : 'Featured Competitions'}
                </h2>
                <p className="text-gray-600 text-lg">Express your faith through these creative categories</p>
              </div>
              <Link
                to="/competitions"
                className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>View All</span>
                <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayEvents.map((event) => (
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

            <div className="text-center mt-12 md:hidden">
              <Link
                to="/competitions"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg"
              >
                <span>View All Categories</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us with Fresh Design */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-full mb-4">
                <Church size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Why Rizia</span>
              </div>
              <h2 className="text-gray-900 dark:text-white mb-4 text-4xl md:text-5xl">Why Participate in Rizia?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Rediscover our faith through creative expression
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-pink-100 dark:border-pink-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Deepen Your Faith</h3>
                  <p className="text-gray-600 dark:text-gray-400">Understand the "why" behind our traditions and explore Church history.</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-100 dark:border-purple-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Trophy className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Showcase Talent</h3>
                  <p className="text-gray-600 dark:text-gray-400">Share your God-given gifts with the entire Diocese.</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-100 dark:border-blue-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Build Community</h3>
                  <p className="text-gray-600 dark:text-gray-400">Connect with brothers and sisters from different parishes.</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-100 dark:border-emerald-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Award className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Win Rewards</h3>
                  <p className="text-gray-600 dark:text-gray-400">Exciting prizes and certificates for winners in all categories!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with Vibrant Design */}
        <section className="py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6">
              <Church size={18} />
              <span className="text-sm">Turning Back to Church History</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl mb-6">
              Ready to Join Rizia?
            </h2>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Express your faith creatively and help keep the flame of our heritage alive for the next generation
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/competitions"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                <Trophy size={20} />
                <span className="text-lg">Browse Categories</span>
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border-2 border-white/20"
                >
                  <Heart size={20} />
                  <span className="text-lg">Register Now</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}