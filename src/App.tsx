import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocationModal } from './components/LocationModal';
import { useDarkMode } from './hooks/useDarkMode';
import * as api from './utils/api';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Competitions from './pages/Competitions';
import CompetitionDetails from './pages/CompetitionDetails';
import RegistrationConfirmation from './pages/RegistrationConfirmation';
import Submission from './pages/Submission';
import SubmissionSuccess from './pages/SubmissionSuccess';
import MySubmissions from './pages/MySubmissions';
import AccountSettings from './pages/AccountSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCompetitions from './pages/admin/ManageCompetitions';
import ReviewSubmissions from './pages/admin/ReviewSubmissions';
import AllBookings from './pages/admin/AllBookings';
import Analytics from './pages/admin/Analytics';
import UsersManagement from './pages/admin/UsersManagement';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Help from './pages/Help';
import Checkout from './pages/Checkout';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // Initialize data on first load
    const initData = async () => {
      try {
        await api.initializeData();
        setIsInitialized(true);
      } catch (error) {
        console.log('Data already initialized or error:', error);
        setIsInitialized(true);
      }
    };

    initData();

    // Check for existing user session
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    const savedCity = localStorage.getItem('selectedCity');
    
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAdmin(savedIsAdmin === 'true');
    }

    if (savedCity) {
      setSelectedCity(savedCity);
    } else {
      // Show location modal on first visit
      setShowLocationModal(true);
    }
  }, []);

  const handleLogin = (userData, token, adminStatus = false) => {
    setUser(userData);
    setAccessToken(token);
    setIsAdmin(adminStatus);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
    localStorage.setItem('isAdmin', adminStatus.toString());
  };

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await api.signout(accessToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setAccessToken(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAdmin');
  };

  const handleLocationSelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
    setShowLocationModal(false);
  };

  // Pass access token to all components that need it
  const userWithToken = user ? { ...user, accessToken } : null;

  return (
    <>
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
      />
      
      <Router>
        <Routes>
          <Route path="/" element={<Home user={userWithToken} selectedCity={selectedCity} onChangeCity={() => setShowLocationModal(true)} />} />
          <Route path="/signup" element={user ? <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} /> : <Signup onSignup={handleLogin} />} />
          <Route path="/login" element={user ? <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user && !isAdmin ? <Dashboard user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/competitions" element={<Competitions user={userWithToken} selectedCity={selectedCity} onChangeCity={() => setShowLocationModal(true)} />} />
          <Route path="/competition/:id" element={<CompetitionDetails user={userWithToken} />} />
          <Route path="/registration-confirmation/:id" element={user ? <RegistrationConfirmation user={userWithToken} /> : <Navigate to="/login" />} />
          <Route path="/submission/:id" element={user ? <Submission user={userWithToken} /> : <Navigate to="/login" />} />
          <Route path="/submission-success" element={user ? <SubmissionSuccess user={userWithToken} /> : <Navigate to="/login" />} />
          <Route path="/my-submissions" element={user ? <MySubmissions user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/account-settings" element={user ? <AccountSettings user={userWithToken} onLogout={handleLogout} onUpdateUser={handleLogin} /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/manage-competitions" element={isAdmin ? <ManageCompetitions user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/review-submissions/:id" element={isAdmin ? <ReviewSubmissions user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/all-bookings" element={isAdmin ? <AllBookings user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/bookings" element={isAdmin ? <AllBookings user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/analytics" element={isAdmin ? <Analytics user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/users-management" element={isAdmin ? <UsersManagement user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={isAdmin ? <UsersManagement user={userWithToken} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          
          {/* Additional Routes */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/checkout/:id" element={user ? <Checkout user={userWithToken} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}