import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PasscodeModal = ({ isOpen, onClose, onSuccess }) => {
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
        setError(response.data.message || 'Invalid passcode');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestInvitation = () => {
    // This could open another modal or redirect to a form
    window.open('mailto:713consulting@gmail.com?subject=Value%20Number%20Invitation%20Request&body=Hello%20Keith,%0D%0A%0D%0AI%20would%20like%20to%20request%20an%20invitation%20code%20for%20Value%20Number.%0D%0A%0D%0AName:%0D%0AOrganization:%0D%0AReason%20for%20interest:%0D%0A%0D%0AThank%20you!', '_blank');
  };

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Value Number™</h3>
          <p className="text-sm text-gray-600">
            Welcome to the platform designed to solve the <strong>$7.3 trillion problem</strong> of poor decision-making. 
            This is the <strong>.SCI Standard</strong>—where every calculation is trusted, traceable, and built with integrity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <input
              type="text"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.toUpperCase())}
              placeholder="Enter your invitation code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono text-lg tracking-widest"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !passcode}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Verifying...' : 'Access Calculator'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Don't have an access code?</p>
          <button
            onClick={handleRequestInvitation}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Request Invitation
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            713 Consulting and Development • Houston, TX
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasscodeModal;