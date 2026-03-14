import { Link } from 'react-router';
import { Trophy, Mail, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';
import { RiziaLogo } from './RiziaLogo';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <RiziaLogo size="md" />
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Celebrate Church History through creative expression. Join Rizia's diocesan-level competitions across 11 exciting categories.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg transition-all shadow-md hover:shadow-lg">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg transition-all shadow-md hover:shadow-lg">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg transition-all shadow-md hover:shadow-lg">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">Browse Categories</Link></li>
              <li><Link to="/about-us" className="hover:text-pink-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-pink-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/help" className="hover:text-pink-400 transition-colors">Help & FAQ</Link></li>
              <li><Link to="/signup" className="hover:text-pink-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white mb-4">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">🎨 Drawing & Painting</Link></li>
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">✍️ Article Writing</Link></li>
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">📝 Poetry</Link></li>
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">🎭 Skit / Drama</Link></li>
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">💃 Choreography / Dance</Link></li>
              <li><Link to="/competitions" className="hover:text-pink-400 transition-colors">🎥 Vlogs / Short Videos</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-pink-400" />
                <a href="mailto:info@rizia.com" className="hover:text-pink-400 transition-colors">
                  info@rizia.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-pink-400" />
                <a href="mailto:support@rizia.com" className="hover:text-pink-400 transition-colors">
                  support@rizia.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white text-sm mb-2">Newsletter</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:border-pink-500 placeholder:text-gray-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all text-sm shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; 2025 Rizia. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link>
              <Link to="/help" className="hover:text-pink-400 transition-colors">Help Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}