import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ValueNumberCalculator from "./components/ValueNumberCalculator";
import PasscodeModal from "./components/PasscodeModal";

const Home = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  useEffect(() => {
    // Check if user already has access
    const accessGranted = localStorage.getItem('valueNumberAccess');
    if (accessGranted === 'granted') {
      setHasAccess(true);
    } else {
      setShowPasscodeModal(true);
    }
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
    setShowPasscodeModal(false);
  };

  const handleAccessDenied = () => {
    setShowPasscodeModal(false);
    // Could redirect to a landing page or show information
  };

  if (!hasAccess) {
    return (
      <div>
        <PasscodeModal
          isOpen={showPasscodeModal}
          onClose={handleAccessDenied}
          onSuccess={handleAccessGranted}
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">VN</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Value Number™</h1>
              <p className="text-xl text-gray-600">Invitation Only</p>
            </div>
            <button
              onClick={() => setShowPasscodeModal(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Access the Calculator
            </button>
          </div>
        </div>
      </div>
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
                <p className="text-xs text-gray-500">SCI POWERED by Mathematical Certainty</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('valueNumberAccess');
                setHasAccess(false);
                setShowPasscodeModal(true);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="py-8">
        <ValueNumberCalculator />
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
          </div>
        </div>
      </footer>
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