import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UserProfile = ({ user, onUpdate, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-gold-100 text-gold-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'executive': return 'Executive';
      case 'user': return 'Member';
      case 'guest': return 'Guest';
      default: return 'Unknown';
    }
  };

  const loadCalculationHistory = async () => {
    const token = localStorage.getItem('valueNumberToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API}/calculations/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCalculations(response.data);
    } catch (err) {
      console.error('Failed to load calculation history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'strong_go': return 'text-green-600';
      case 'go': return 'text-blue-600';
      case 'caution': return 'text-yellow-600';
      case 'no_go': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      loadCalculationHistory();
    }
  }, [isOpen, user]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium">{user.email}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Profile</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {formatDate(user.created_at)}
            </p>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Recent Calculations</h4>
            {loading ? (
              <div className="text-center py-4">
                <div className="loading-spinner mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            ) : calculations.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {calculations.slice(0, 5).map((calc) => (
                  <div key={calc.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm font-medium">
                        {calc.calculation_type === 's_formula' ? 'S' : 'W'} = {calc.value_number}
                      </span>
                      <p className="text-xs text-gray-500">{formatDate(calc.timestamp)}</p>
                    </div>
                    <span className={`text-xs font-medium ${getRecommendationColor(calc.recommendation)}`}>
                      {calc.recommendation.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
                {calculations.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{calculations.length - 5} more calculations
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No calculations yet
              </p>
            )}
          </div>

          <div className="p-4">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;