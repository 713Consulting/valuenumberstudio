import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModernCalculatorInterface from "./components/ModernCalculatorInterface";
import InvitationLandingPage from "./components/InvitationLandingPage";
import AuthModal from "./components/AuthModal";
import UserProfile from "./components/UserProfile";
import AdminDashboard from "./components/AdminDashboard";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('guest'); // 'guest', 'authenticated'

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem('valueNumberToken');
    const userData = localStorage.getItem('valueNumberUser');
    const accessGranted = localStorage.getItem('valueNumberAccess');

    if (token && userData) {
      // User is authenticated
      try {
        setUser(JSON.parse(userData));
        setAuthMode('authenticated');
        setHasAccess(true);
        
        // Verify token is still valid
        verifyToken(token);
      } catch (error) {
        // Invalid stored data, clear it
        clearAuth();
      }
    } else if (accessGranted === 'granted') {
      // Guest access with passcode
      setAuthMode('guest');
      setHasAccess(true);
    }
    // If no access, show invitation landing page (default state)
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      // Token is invalid, clear auth
      clearAuth();
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('valueNumberToken');
    localStorage.removeItem('valueNumberUser');
    localStorage.removeItem('valueNumberAccess');
    setUser(null);
    setAuthMode('guest');
    setHasAccess(false);
  };

  const handleInvitationSuccess = () => {
    setHasAccess(true);
    setAuthMode('guest');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setAuthMode('authenticated');
    setHasAccess(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    clearAuth();
    setShowAdminDashboard(false);
  };

  const handleUpgradeAccount = () => {
    setShowAuthModal(true);
  };

  const handleAdminAccess = () => {
    if (user?.role === 'admin') {
      setShowAdminDashboard(true);
    }
  };

  const handleBackFromAdmin = () => {
    setShowAdminDashboard(false);
  };

  if (!hasAccess) {
    return (
      <div>
        <InvitationLandingPage 
          onSuccess={handleInvitationSuccess}
          onShowAuth={() => setShowAuthModal(true)}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  if (showAdminDashboard) {
    return (
      <AdminDashboard 
        user={user}
        onBack={handleBackFromAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Header with Darker Background */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">VN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Value Number™</h1>
                <p className="text-xs text-gray-200">SCI™ POWERED by Emergent Solutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={handleAdminAccess}
                  className="text-sm bg-purple-600/80 backdrop-blur text-white px-4 py-2 rounded-lg hover:bg-purple-700/80 transition-all duration-300 border border-purple-500/30"
                >
                  Admin Dashboard
                </button>
              )}
              
              {authMode === 'guest' && (
                <button
                  onClick={handleUpgradeAccount}
                  className="text-sm bg-green-600/80 backdrop-blur text-white px-4 py-2 rounded-lg hover:bg-green-700/80 transition-all duration-300 border border-green-500/30"
                >
                  Create Account
                </button>
              )}
              
              {authMode === 'authenticated' && user ? (
                <UserProfile 
                  user={user} 
                  onUpdate={setUser}
                  onLogout={handleLogout}
                />
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-gray-200 hover:text-white text-sm transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <ModernCalculatorInterface user={user} />
      </main>
      
      {/* Enhanced Footer with Darker Background */}
      <footer className="bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl border-t border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg text-gray-200 mb-2">
              Solving the <span className="text-purple-300 font-semibold">$7.3 trillion problem</span> of poor decision-making
            </p>
            <p className="text-sm text-gray-300">
              713 Consulting and Development • Houston, TX
            </p>
            {authMode === 'guest' && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-sm text-blue-200">
                    <strong>Guest Access:</strong> Create an account to save your calculations and access advanced features.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;