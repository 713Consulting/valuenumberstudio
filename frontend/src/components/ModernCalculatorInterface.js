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

const ModernCalculatorInterface = ({ user, onShowAuth, onLogout }) => {
  const [activeFormula, setActiveFormula] = useState('s');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // S Formula state
  const [sInputs, setSInputs] = useState({
    old_time: { hours: 0, minutes: 0 },
    old_effort: 5.0,
    training_time: { hours: 0, minutes: 0 },
    new_effort: 3.0
  });

  // W Formula state
  const [wInputs, setWInputs] = useState({
    old_time: { hours: 0, minutes: 0 },
    old_effort: 5.0,
    training_time: { hours: 0, minutes: 0 },
    new_effort: 3.0,
    old_cost: 0,
    new_cost: 0
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('valueNumberToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSCalculate = async () => {
    if (sInputs.old_time.hours === 0 && sInputs.old_time.minutes === 0) {
      setError('Old time cannot be zero');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/calculate/s-formula`, sInputs, {
        headers: getAuthHeaders()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWCalculate = async () => {
    if (wInputs.old_time.hours === 0 && wInputs.old_time.minutes === 0) {
      setError('Old time cannot be zero');
      return;
    }
    if (wInputs.old_cost === 0) {
      setError('Old cost must be greater than zero for W formula');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/calculate/w-formula`, wInputs, {
        headers: getAuthHeaders()
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'strong_go': return 'from-green-500 to-green-600';
      case 'go': return 'from-blue-500 to-blue-600';
      case 'caution': return 'from-yellow-500 to-yellow-600';
      case 'no_go': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRecommendationText = (recommendation) => {
    switch (recommendation) {
      case 'strong_go': return 'Strong Go';
      case 'go': return 'Go';
      case 'caution': return 'Caution';
      case 'no_go': return 'No Go';
      default: return 'Unknown';
    }
  };

  const clearResult = () => {
    setResult(null);
    setError('');
  };

  useEffect(() => {
    clearResult();
  }, [activeFormula]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 relative">
      {/* Simple Gradient Background Only - No Squares */}
      
      {/* Navigation Header */}
      <div className="relative z-20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* SCI™ Badge */}
            <div className="sci-badge">
              <div className="atom-icon">
                <div className="atom-nucleus"></div>
                <div className="atom-orbit"><div className="atom-electron"></div></div>
                <div className="atom-orbit"><div className="atom-electron"></div></div>
                <div className="atom-orbit"><div className="atom-electron"></div></div>
              </div>
              <span>SCI™ POWERED by Emergent</span>
            </div>
            <h1 className="text-xl font-bold text-white">Value Number™</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white font-medium">{user.email}</span>
                <button
                  onClick={onLogout}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onShowAuth}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 z-10">
          {/* 3D Rotating Cube */}
          <div className="flex justify-center mb-8">
            <div className="vn-logo-3d" aria-hidden="true">
              <div className="logo-cube">
                <div className="logo-face">VN</div>
                <div className="logo-face">VN</div>
                <div className="logo-face">VN</div>
                <div className="logo-face">VN</div>
                <div className="logo-face">VN</div>
                <div className="logo-face">VN</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            {/* Updated Hero Text - Two Lines */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              Mathematical Certainty
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-8">
              in Every Decision
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12">
              From multi-million dollar corporate investments to life-changing personal choices, get your <span className="text-purple-400 font-semibold">Value Number™</span> and decide with confidence.
            </p>
            {user && (
              <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-green-300 font-medium">Welcome back, {user.email} • Your calculations are being saved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* S Formula Card */}
          <div className={`relative group transition-all duration-500 ${activeFormula === 's' ? 'scale-105 z-10' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-2xl p-8 hover:from-blue-600/15 hover:via-purple-600/15 hover:to-pink-600/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Without Cost</h2>
                  <div className="inline-flex items-center bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
                    <span className="text-blue-300 font-medium">S Formula</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveFormula('s')}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    activeFormula === 's' 
                      ? 'border-blue-400 bg-blue-400' 
                      : 'border-gray-400 hover:border-blue-400'
                  }`}
                />
              </div>

              <p className="text-gray-300 mb-6">Evaluate based on time and effort alone.</p>

              <div className="bg-black/20 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-mono text-blue-300 mb-2">S = Z / (Y + V)</div>
                  <div className="text-sm text-gray-400">Z=Old time, Y=Training time, V=New effort</div>
                </div>
              </div>

              {activeFormula === 's' && (
                <div className="space-y-6 animate-in slide-in-from-top duration-500">
                  {/* Z - Old Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">Z</span>
                      Old Time (HH:MM)
                      <div className="group relative ml-2">
                        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center cursor-help">
                          <span className="text-white text-xs">?</span>
                        </div>
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                          Example: The 100 hours it took to manually complete a task last year.
                        </div>
                      </div>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={sInputs.old_time.hours}
                        onChange={(e) => setSInputs({...sInputs, old_time: {...sInputs.old_time, hours: parseInt(e.target.value) || 0}})}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hours"
                      />
                      <span className="flex items-center text-white text-xl">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={sInputs.old_time.minutes}
                        onChange={(e) => setSInputs({...sInputs, old_time: {...sInputs.old_time, minutes: parseInt(e.target.value) || 0}})}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minutes"
                      />
                    </div>
                  </div>

                  {/* Q - Old Effort */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">Q</span>
                      Old Effort (1-10)
                    </label>
                    <div className="bg-white/5 rounded-lg p-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={sInputs.old_effort}
                        onChange={(e) => setSInputs({...sInputs, old_effort: parseFloat(e.target.value)})}
                        className="w-full h-2 bg-gradient-to-r from-green-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>1 (Easy)</span>
                        <span className="text-white font-bold text-lg">{sInputs.old_effort}</span>
                        <span>10 (Extremely Hard)</span>
                      </div>
                    </div>
                  </div>

                  {/* Y - Training Time */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">Y</span>
                      Training Time (HH:MM)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={sInputs.training_time.hours}
                        onChange={(e) => setSInputs({...sInputs, training_time: {...sInputs.training_time, hours: parseInt(e.target.value) || 0}})}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Hours"
                      />
                      <span className="flex items-center text-white text-xl">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={sInputs.training_time.minutes}
                        onChange={(e) => setSInputs({...sInputs, training_time: {...sInputs.training_time, minutes: parseInt(e.target.value) || 0}})}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Minutes"
                      />
                    </div>
                  </div>

                  {/* V - New Effort */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">V</span>
                      New Effort (1-10)
                    </label>
                    <div className="bg-white/5 rounded-lg p-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={sInputs.new_effort}
                        onChange={(e) => setSInputs({...sInputs, new_effort: parseFloat(e.target.value)})}
                        className="w-full h-2 bg-gradient-to-r from-green-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>1 (Easy)</span>
                        <span className="text-white font-bold text-lg">{sInputs.new_effort}</span>
                        <span>10 (Extremely Hard)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSCalculate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-3"></div>
                        Calculating...
                      </div>
                    ) : (
                      'Calculate S Value'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* W Formula Card - Similar structure but with cost inputs */}
          <div className={`relative group transition-all duration-500 ${activeFormula === 'w' ? 'scale-105 z-10' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-8 hover:from-purple-600/15 hover:via-pink-600/15 hover:to-blue-600/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">With Cost</h2>
                  <div className="inline-flex items-center bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2">
                    <span className="text-purple-300 font-medium">W Formula</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveFormula('w')}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    activeFormula === 'w' 
                      ? 'border-purple-400 bg-purple-400' 
                      : 'border-gray-400 hover:border-purple-400'
                  }`}
                />
              </div>

              <p className="text-gray-300 mb-6">Include financial factors for a comprehensive evaluation.</p>

              <div className="bg-black/20 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-mono text-purple-300 mb-2">W = (Z×M) / (Y×T + V)</div>
                  <div className="text-sm text-gray-400">M=Old cost, T=New cost</div>
                </div>
              </div>

              {activeFormula === 'w' && (
                <div className="space-y-6 animate-in slide-in-from-top duration-500">
                  {/* Similar inputs as S formula but with cost fields */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">Z</span>
                      Old Time (HH:MM)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={wInputs.old_time.hours}
                        onChange={(e) => setWInputs({...wInputs, old_time: {...wInputs.old_time, hours: parseInt(e.target.value) || 0}})}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Hours"
                      />
                      <span className="flex items-center text-white text-xl">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={wInputs.old_time.minutes}
                        onChange={(e) => setWInputs({...wInputs, old_time: {...wInputs.old_time, minutes: parseInt(e.target.value) || 0}})}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Minutes"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">M</span>
                      Old Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={wInputs.old_cost}
                        onChange={(e) => setWInputs({...wInputs, old_cost: parseFloat(e.target.value) || 0})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="1200.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white flex items-center">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">T</span>
                      New Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={wInputs.new_cost}
                        onChange={(e) => setWInputs({...wInputs, new_cost: parseFloat(e.target.value) || 0})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="300.00"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleWCalculate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-3"></div>
                        Calculating...
                      </div>
                    ) : (
                      'Calculate W Value'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-12 max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${getRecommendationColor(result.recommendation)} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">Your Value Number™ Result</h3>
                  <button
                    onClick={clearResult}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-7xl font-bold text-white mb-4 animate-pulse">
                    {result.value_number}
                  </div>
                  <div className={`inline-flex items-center bg-gradient-to-r ${getRecommendationColor(result.recommendation)} text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg`}>
                    {getRecommendationText(result.recommendation)}
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-xl p-6">
                  <h4 className="font-bold text-white mb-3 text-lg">Analysis</h4>
                  <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
                </div>
                
                <div className="mt-6 text-center text-gray-400 text-sm">
                  Formula: {result.calculation_type === 's_formula' ? 'S = Z / (Y + V)' : 'W = (Z×M) / (Y×T + V)'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support the Mission Section */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="cube-container-landing mx-auto mb-6">
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
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Support the Mission
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Your support helps us solve the $7.3 trillion problem of poor decision-making and bring mathematical certainty to the world.
          </p>

          <div className="bg-gradient-to-br from-purple-800/30 to-indigo-800/30 backdrop-blur-xl rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-pink-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Request an Invitation</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Value Number™ is currently in private beta. To get access, please send an email with your name, organization, and reason for interest.
            </p>
            
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Request Access via Email
            </button>
          </div>

          <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 backdrop-blur-xl rounded-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-pink-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Support the Initiative</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              You can support this initiative through several avenues: <strong>donations</strong>, which contribute to development and operational costs; <strong>investments</strong>, where you provide capital in exchange for equity; or a <strong>loan</strong>, offering a structured agreement with a clear repayment plan.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Testimonials
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how different people use Value Number™ to bring clarity to complex decisions. These are realistic examples to demonstrate the power of the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 backdrop-blur-xl rounded-2xl p-6 border-l-4 border-purple-400">
              <p className="text-gray-300 mb-6 italic">
                "I needed to know if a $5,000 software investment was worth it. Value Number didn't just give me an answer, it gave me mathematical certainty. The VN was 1.37. We bought the software and have already seen a 40% increase in efficiency."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Maria, Small Business Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 backdrop-blur-xl rounded-2xl p-6 border-l-4 border-pink-400">
              <p className="text-gray-300 mb-6 italic">
                "As a student, every dollar counts. I used the calculator to see if a new $1,200 laptop was a smart buy. The VN was 0.92—a Caution result. It made me realize I could be just as productive using the campus labs for free. It saved me from a bad financial decision."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <p className="text-white font-semibold">David, College Student</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-800/30 to-indigo-800/30 backdrop-blur-xl rounded-2xl p-6 border-l-4 border-blue-400">
              <p className="text-gray-300 mb-6 italic">
                "Choosing a family car was overwhelming. I compared a $30k minivan to a $22k SUV. The minivan had a higher Value Number (1.8 vs 1.4) because of its better fuel efficiency and lower maintenance costs. It made the choice obvious and stress-free."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Priya, Busy Parent</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-green-800/30 to-purple-800/30 backdrop-blur-xl rounded-2xl p-6 border-l-4 border-green-400">
              <p className="text-gray-300 mb-6 italic">
                "I've seen hundreds of pitch decks. The Value Number executive letter was different. It was clear, data-driven, and the only one that quantified its own value proposition. The SCI™ Standard is a powerful concept for ensuring integrity in business."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">C</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Mr. Chen, Investor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Section */}
      <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-xl py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Legal & Terms of Service
            </h2>
            <p className="text-gray-400 text-sm">Last Updated: August 19, 2025</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl rounded-xl p-4 mb-8 border border-yellow-500/30">
            <p className="text-yellow-200 text-sm">
              <strong>Disclaimer:</strong> This document is for informational purposes only and does not constitute legal advice. Please consult with a legal professional for advice specific to your situation.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">1. Introduction</h3>
              <p className="text-gray-300 leading-relaxed">
                Welcome to Value Number™ ("the Service"), owned and operated by 713 Consulting and Development ("the Company"). These Terms of Service ("Terms") govern your use of the ValueNumber.info website and the Value Number™ calculators (collectively, "the Service"). By accessing or using the Service, you agree to be bound by these Terms.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">2. Intellectual Property</h3>
              <p className="text-gray-300 leading-relaxed">
                The Service and its original content, including but not limited to the Value Number™ name, the SCI™ Standard, the S and W formulas, logos, features, and functionality, are and will remain the exclusive intellectual property of 713 Consulting and Development and its founder, Keith Bolden. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">3. Use License</h3>
              <p className="text-gray-300 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials on Value Number™'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the website; or remove any copyright or other proprietary notations from the materials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Section */}
      <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-xl py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h2>
            <p className="text-gray-400 text-sm">Last Updated: August 19, 2025</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">1. Introduction</h3>
              <p className="text-gray-300 leading-relaxed">
                713 Consulting and Development ("we", "us", or "our") operates the ValueNumber.info website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">2. Information Collection and Use</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white font-semibold mb-2">• Personal Data:</p>
                  <p className="text-gray-300 leading-relaxed">
                    While using our Service, such as when requesting an invitation, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to, your email address, name, and reason for interest.
                  </p>
                </div>
                
                <div>
                  <p className="text-white font-semibold mb-2">• Usage Data:</p>
                  <p className="text-gray-300 leading-relaxed">
                    We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data is anonymized and may include information such as your computer's IP address, browser type, and the pages of our Service that you visit.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-pink-400 mb-4">3. Use of Data</h3>
              <p className="text-gray-300 leading-relaxed">
                Value Number™ uses the collected data for various purposes: to provide and maintain our Service; to notify you about changes to our Service; to allow you to participate in interactive features when you choose to do so; to provide customer support; to gather analysis or valuable information so that we can improve our Service; and to monitor the usage of our Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-xl py-8 relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-white/60">© 2025 All rights reserved |</span>
            <Logo713 width="28" height="28" className="drop-shadow-lg" />
            <span className="text-white/60">713 Consulting & Development</span>
          </div>
          <p className="text-white/40">Mathematical Certainty in Every Decision through SCI™</p>
        </div>
      </footer>
    </div>
  );
};

export default ModernCalculatorInterface;