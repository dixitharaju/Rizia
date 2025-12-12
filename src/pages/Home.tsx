import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CompetitionCard } from '../components/CompetitionCard';
import { HeroCarousel } from '../components/HeroCarousel';
import * as api from '../utils/api';
import { Sparkles, Trophy, Users, Award, ArrowRight, Star, CheckCircle, Calendar, DollarSign, Ticket, MapPin, Zap, Heart, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomeProps {
  user?: any;
  selectedCity?: string | null;
  onChangeCity?: () => void;
}

export default function Home({ user, selectedCity, onChangeCity }: HomeProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const categories = [
    { 
      name: 'Concert', 
      icon: '🎵', 
      image: 'https://images.unsplash.com/photo-1642552556378-549e3445315e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBwZXJmb3JtZXJ8ZW58MXx8fHwxNzY0OTAyMjAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: '12',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Comedy', 
      icon: '😂', 
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1080',
      count: '8',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Dance', 
      icon: '💃', 
      image: 'https://images.unsplash.com/photo-1698824554771-293b5dcc42db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzY0ODI1Nzc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: '10',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Art', 
      icon: '🎨', 
      image: 'https://images.unsplash.com/photo-1683222042853-37cd29faf895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMGNhbnZhc3xlbnwxfHx8fDE3NjQ4NDk1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: '6',
      gradient: 'from-purple-500 to-violet-500'
    },
    { 
      name: 'Literature', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1612907260223-2c7aff7a7d3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbm90ZWJvb2slMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NjQ4NTE1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: '5',
      gradient: 'from-teal-500 to-emerald-500'
    },
    { 
      name: 'Festival', 
      icon: '🎪', 
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1080',
      count: '15',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { label: 'Live Events', value: '250+', icon: Ticket, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Happy Attendees', value: '50K+', icon: Users, gradient: 'from-purple-500 to-indigo-500' },
    { label: 'Cities Covered', value: '12', icon: MapPin, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Events This Month', value: '80+', icon: Calendar, gradient: 'from-orange-500 to-amber-500' }
  ];

  // Filter events by selected city
  const displayEvents = selectedCity 
    ? events.filter(e => e).slice(0, 6)
    : events.filter(e => e).slice(0, 6);

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
                Find events that match your interests
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
                      {category.count} events
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
                  <span className="text-sm text-pink-700">Hot Events</span>
                </div>
                <h2 className="text-gray-900 mb-2 text-4xl md:text-5xl">
                  {selectedCity ? `Trending in ${selectedCity}` : 'Trending Events'}
                </h2>
                <p className="text-gray-600 text-lg">Don't miss out on these popular events</p>
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
                <span>View All Events</span>
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
                <Star size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-700 dark:text-blue-300">Why Choose Us</span>
              </div>
              <h2 className="text-gray-900 dark:text-white mb-4 text-4xl md:text-5xl">Why Choose Rizia?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your trusted platform for event discovery and booking
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-pink-100 dark:border-pink-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Ticket className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Easy Booking</h3>
                  <p className="text-gray-600 dark:text-gray-400">Quick and hassle-free ticket booking process with instant confirmation.</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-100 dark:border-purple-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <Star className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Best Events</h3>
                  <p className="text-gray-600 dark:text-gray-400">Curated selection of the best events happening in your city.</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-100 dark:border-blue-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Multiple Cities</h3>
                  <p className="text-gray-600 dark:text-gray-400">Events across major cities in India with easy location-based discovery.</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-emerald-100 dark:border-emerald-950/50">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">Secure Payment</h3>
                  <p className="text-gray-600 dark:text-gray-400">Safe and secure payment options with multiple payment methods.</p>
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
              <Zap size={18} />
              <span className="text-sm">Get Started Today</span>
            </div>
            <h2 className="text-white text-4xl md:text-5xl mb-6">
              Ready to Explore Events?
            </h2>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              {selectedCity 
                ? `Discover amazing events happening in ${selectedCity}`
                : 'Select your city and start discovering amazing events'
              }
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {selectedCity ? (
                <Link
                  to="/competitions"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105"
                >
                  <span className="text-lg">Browse Events</span>
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <button
                  onClick={onChangeCity}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105"
                >
                  <MapPin size={20} />
                  <span className="text-lg">Select Your City</span>
                </button>
              )}
              {!user && (
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border-2 border-white/20"
                >
                  <Heart size={20} />
                  <span className="text-lg">Create Free Account</span>
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