import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Logo713 = ({ width = "28", height = "28", className = "" }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="logoGradient713" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="50%" stopColor="#7b64ff" />
        <stop offset="100%" stopColor="#ff6b6b" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="35" height="80" rx="5" fill="url(#logoGradient713)" />
    <rect x="55" y="25" width="35" height="65" rx="5" fill="url(#logoGradient713)" opacity="0.8" />
    <rect x="32.5" y="45" width="35" height="35" rx="5" fill="url(#logoGradient713)" />
  </svg>
);

const InvitationLandingPage = ({ onSuccess, onShowAuth }) => {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/verify-passcode`, null, {
        params: { passcode }
      });
      
      if (response.data.valid) {
        localStorage.setItem('valueNumberAccess', 'granted');
        onSuccess();
      } else {
        setError('Invalid code.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestInvitation = () => {
    window.open('mailto:713consulting@gmail.com?subject=Value%20Number%20Invitation%20Request&body=Hello%20Keith,%0D%0A%0D%0AI%20would%20like%20to%20request%20an%20invitation%20code%20for%20Value%20Number.%0D%0A%0D%0AName:%0D%0AOrganization:%0D%0AReason%20for%20interest:%0D%0A%0D%0AThank%20you!', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 flex items-center justify-center p-4 relative">
      {/* Simple Gradient Background Only - No Squares */}
      
      <div className="max-w-md w-full text-center relative z-10">
        {/* EXACT Animated SCI™ Banner from 713Consulting.net */}
        <div className="mb-8 flex justify-center">
          <div className="sci-badge">
            <div className="atom-icon">
              <div className="atom-nucleus"></div>
              <div className="atom-orbit"><div className="atom-electron"></div></div>
              <div className="atom-orbit"><div className="atom-electron"></div></div>
              <div className="atom-orbit"><div className="atom-electron"></div></div>
            </div>
            <span>SCI™ POWERED by Emergent</span>
          </div>
        </div>

        {/* 3D Rotating Cube */}
        <div className="mb-8">
          <div className="cube-container-landing">
            <div className="cube-landing">
              <div className="face-landing front">VN</div>
              <div className="face-landing back">VN</div>
              <div className="face-landing right">VN</div>
              <div className="face-landing left">VN</div>
              <div className="face-landing top">VN</div>
              <div className="face-landing bottom">VN</div>
            </div>
          </div>
        </div>

        {/* Value Number™ Title */}
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 mb-4">
          Value Number™
        </h1>

        {/* Invitation Only */}
        <h2 className="text-xl text-white font-medium mb-8">
          Invitation Only
        </h2>

        {/* Description - Reformatted to 3 Lines */}
        <div className="text-gray-300 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          <p className="mb-0">Welcome to the platform designed to solve the</p>
          <p className="mb-0"><span className="text-white font-semibold">$7.3 trillion problem</span> of poor decision-making. This is the</p>
          <p className="mb-0"><span className="text-white font-semibold">SCI™ Standard</span>—where every calculation is trusted, traceable, and built with integrity.</p>
        </div>

        {/* Access Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-6">
            <input
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.toUpperCase())}
              placeholder="Enter invitation code"
              className="w-full px-6 py-4 bg-transparent border-2 border-purple-400 rounded-xl text-white placeholder-gray-400 text-center font-mono text-lg tracking-widest focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-300/20"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm mb-4">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !passcode}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
          >
            {loading ? 'Verifying...' : 'Access the Value Number™ Calculator'}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Request Invitation Button */}
        <button
          onClick={handleRequestInvitation}
          className="w-full border-2 border-purple-400 text-purple-300 hover:text-white hover:border-purple-300 font-medium py-3 px-8 rounded-xl text-lg transition-all duration-300 hover:bg-purple-400/10"
        >
          Request Invitation
        </button>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm flex items-center justify-center gap-2">
          <Logo713 width="20" height="20" className="drop-shadow-lg" />
          <span>© 2025 All rights reserved | 713 Consulting & Development | Keith Bolden</span>
        </div>
      </div>
    </div>
  );
};

export default InvitationLandingPage;