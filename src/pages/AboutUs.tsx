import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Church, Users, BookOpen, Award, Target, Heart, Sparkles, Trophy } from 'lucide-react';

interface AboutUsProps {
  user?: any;
}

export default function AboutUs({ user }: AboutUsProps) {
  const values = [
    {
      icon: Church,
      title: 'Faith Heritage',
      description: 'Cultivate awareness of Church history among young minds and preserve our spiritual legacy.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Sparkles,
      title: 'Creative Expression',
      description: 'Encourage creative faith expression through art, writing, performance, and digital media.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Bridge generations through shared heritage and build stronger diocesan connections.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'Nurture talents for evangelization and celebrate outstanding creative achievements.',
      gradient: 'from-cyan-500 to-teal-500'
    }
  ];

  const stats = [
    { value: '500+', label: 'Participants' },
    { value: '7', label: 'Categories' },
    { value: '4', label: 'Age Groups' },
    { value: '100+', label: 'Parishes' }
  ];

  const categories = [
    {
      name: 'Creative Arts',
      items: ['Drawing & Painting', 'Poetry'],
      icon: '🎨',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      name: 'Literary & Oratory',
      items: ['Article Writing', 'Speech'],
      icon: '✍️',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Performing Arts',
      items: ['Skit / Drama', 'Choreography / Dance'],
      icon: '🎭',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      name: 'Digital Media',
      items: ['Vlogs / Short Videos'],
      icon: '🎥',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const team = [
    {
      name: 'Fr. Joseph Thomas',
      role: 'Diocesan Coordinator',
      image: '⛪',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      name: 'Sr. Mary Elizabeth',
      role: 'Program Director',
      image: '📖',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'John Paul',
      role: 'Youth Ministry Lead',
      image: '🙏',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      name: 'Sarah Joseph',
      role: 'Creative Arts Coordinator',
      image: '🎨',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <Header user={user} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 dark:from-pink-500/5 dark:via-purple-500/5 dark:to-indigo-500/5"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/50 dark:to-purple-950/50 rounded-full mb-6">
                <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-purple-700 dark:text-purple-300">About Rizia</span>
              </div>
              <h1 className="text-gray-900 dark:text-white mb-6 text-4xl md:text-6xl">
                Rediscovering Our Roots <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Turning Back to Church History
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Rizia is more than just a competition; it is a spiritual and creative journey back to the foundations of our faith, organized at the Diocesan level.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-4xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-gray-900 dark:text-white mb-6 text-3xl md:text-4xl">Our Mission</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  <p>
                    By "Turning Back to Church History," we don't just look at the past; we find the inspiration to build our future. Rizia challenges participants to creatively express the foundations of Christian faith through diverse artistic mediums.
                  </p>
                  <p>
                    From the courage of the early martyrs to the vibrant traditions that shape our worship today, we invite youth and adults alike to explore the rich tapestry of Church History and express it creatively.
                  </p>
                  <p>
                    In a fast-changing world, knowing where we come from helps us understand who we are. "To be Christian is to be historical." History is the story of God working through people. By participating in Rizia, you help keep the flame of our heritage alive for the next generation.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-1">
                  <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-9xl">⛪</div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl opacity-20 blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 dark:text-white mb-4 text-3xl md:text-4xl">Our Core Values</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <value.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3 text-xl">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 dark:text-white mb-4 text-3xl md:text-4xl">Meet Our Team</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                The passionate people behind Rizia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${member.gradient} rounded-3xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform shadow-lg`}>
                    {member.image}
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-2 text-xl">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-white mb-6 text-3xl md:text-4xl">
              Join the Rizia Movement
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Express your faith creatively and help preserve our Church heritage for future generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/competitions"
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl hover:bg-gray-100 transition-all shadow-lg text-lg"
              >
                Browse Categories
              </a>
              <a
                href="/signup"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl hover:bg-white/10 transition-all text-lg"
              >
                Register Now
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}