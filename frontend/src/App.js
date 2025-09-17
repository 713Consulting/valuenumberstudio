import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ProtectedConceptsPage from "./components/ProtectedConceptsPage";
import InvitationLandingPage from "./components/InvitationLandingPage";
import ModernCalculatorInterface from "./components/ModernCalculatorInterface";
import ValueNumberCalculator from "./components/ValueNumberCalculator";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing access and authentication on app load
  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = localStorage.getItem('valueNumberAccess') === 'granted';
      setAccessGranted(hasAccess);
    };

    const checkAuth = async () => {
      const token = localStorage.getItem('valueNumberToken');
      if (token && accessGranted) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          // Token invalid, remove it
          localStorage.removeItem('valueNumberToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAccess();
    if (accessGranted) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [accessGranted]);

  const handleAccessGranted = () => {
    setAccessGranted(true);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('valueNumberToken', token);
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('valueNumberToken');
    setUser(null);
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If access not granted, show landing page
  if (!accessGranted) {
    return (
      <InvitationLandingPage 
        onSuccess={handleAccessGranted}
        onShowAuth={handleShowAuth}
      />
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 713 Consulting Routes */}
          <Route path="/713consulting" element={<HomePage />} />
          <Route path="/concepts" element={<ProtectedConceptsPage />} />
          
          {/* Value Number™ Routes */}
          <Route path="/" element={
            <ModernCalculatorInterface 
              user={user}
              onShowAuth={handleShowAuth}
              onLogout={handleLogout}
            />
          } />
          <Route path="/calculator" element={
            <ValueNumberCalculator 
              user={user}
              onShowAuth={handleShowAuth}
              onLogout={handleLogout}
            />
          } />
          <Route path="/profile" element={
            user ? <UserProfile user={user} onLogout={handleLogout} /> : 
            <ModernCalculatorInterface user={user} onShowAuth={handleShowAuth} onLogout={handleLogout} />
          } />
          <Route path="/admin" element={
            user ? <AdminDashboard user={user} onLogout={handleLogout} /> :
            <ModernCalculatorInterface user={user} onShowAuth={handleShowAuth} onLogout={handleLogout} />
          } />
        </Routes>
      </BrowserRouter>

      {/* Authentication Modal */}
      {showAuth && (
        <AuthModal 
          onClose={handleCloseAuth}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;