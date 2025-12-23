import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Shield, User, Loader2 } from 'lucide-react';
import { RiziaLogo } from '../components/RiziaLogo';
import { supabase, verifyPassword, isSupabaseConfigured } from '../utils/supabaseClient';

interface LoginProps {
  onLogin: (user: any, isAdmin?: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loginType: 'user' // 'user' or 'admin'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        setError('Database not configured. Please set up Supabase credentials.');
        setLoading(false);
        return;
      }

      // Get login credentials from database
      const { data: loginData, error: loginError } = await supabase
        .from('users_login')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (loginError || !loginData) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Verify password
      const isPasswordValid = await verifyPassword(formData.password, loginData.password_hash);
      
      if (!isPasswordValid) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Check if admin login matches
      if (formData.loginType === 'admin' && !loginData.is_admin) {
        setError('You do not have admin privileges');
        setLoading(false);
        return;
      }

      if (formData.loginType === 'user' && loginData.is_admin) {
        setError('Admin users must login through Admin Login');
        setLoading(false);
        return;
      }

      // Update last login
      await supabase
        .from('users_login')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: (loginData.login_count || 0) + 1
        })
        .eq('id', loginData.id);

      // Get user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (userError || !userData) {
        setError('User profile not found');
        setLoading(false);
        return;
      }

      // Create user object for session
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        category: userData.category,
      };

      // Login user
      onLogin(user, loginData.is_admin);
      
      // Navigate based on user type
      if (loginData.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

        {/* Login Type Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loginType: 'user' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
              formData.loginType === 'user'
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <User size={18} />
            <span>User Login</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, loginType: 'admin' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
              formData.loginType === 'admin'
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Shield size={18} />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-gray-900 dark:text-white mb-2 text-3xl">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to continue to Rizia</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                  placeholder="••••••••"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
              <span>Sign In</span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                Sign up
              </Link>
            </p>
          </form>

          {/* Demo Credentials */}
          {formData.loginType === 'admin' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200 dark:border-purple-800 rounded-2xl">
              <p className="text-sm text-purple-900 dark:text-purple-200 mb-1 flex items-center gap-2">
                <Shield size={16} />
                <span>Demo Admin Credentials:</span>
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-300">Email: admin@rizia.com</p>
              <p className="text-sm text-purple-800 dark:text-purple-300">Password: admin123</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <Link to="#" className="text-purple-600 dark:text-purple-400 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="#" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}