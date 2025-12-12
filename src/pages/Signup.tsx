import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles, Tag } from 'lucide-react';
import { RiziaLogo } from '../components/RiziaLogo';
import * as api from '../utils/api';

interface SignupProps {
  onSignup: (user: any, token: string) => void;
}

export default function Signup({ onSignup }: SignupProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
  });

  const categories = ['Concert', 'Comedy', 'Dance', 'Art', 'Literature', 'Festival'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.signup(formData.email, formData.password, formData.name);
      
      const userData = {
        id: response.profile.id,
        name: response.profile.name,
        email: response.profile.email,
      };

      onSignup(userData, response.session.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 hover:scale-105 transition-transform">
            <RiziaLogo size="lg" />
          </Link>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 dark:text-white mb-2 text-3xl">Join Rizia</h1>
            <p className="text-gray-600 dark:text-gray-400">Create your account and start discovering events</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Category of Interest <span className="text-gray-500 dark:text-gray-400 text-sm">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                required 
                className="w-4 h-4 mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
              />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="#" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg group"
            >
              <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
              <span>Create Account</span>
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Additional Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🎫</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Easy Booking</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Best Events</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}