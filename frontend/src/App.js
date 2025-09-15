import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ValueNumberCalculator from "./components/ValueNumberCalculator";
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">VN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Value Number™</h1>
                <p className="text-xs text-gray-500">SCI™ POWERED by Emergent Solutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={handleAdminAccess}
                  className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Admin Dashboard
                </button>
              )}
              
              {authMode === 'guest' && (
                <button
                  onClick={handleUpgradeAccount}
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-8">
        <ValueNumberCalculator user={user} />
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Solving the <strong>$7.3 trillion problem</strong> of poor decision-making
            </p>
            <p className="text-xs text-gray-500">
              713 Consulting and Development • Houston, TX
            </p>
            {authMode === 'guest' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Guest Access:</strong> Create an account to save your calculations and access advanced features.
                </p>
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