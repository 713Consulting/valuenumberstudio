import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TimeInput = ({ label, value, onChange, required = false }) => {
  const handleHoursChange = (e) => {
    const hours = Math.max(0, Math.min(9999, parseInt(e.target.value) || 0));
    onChange({ ...value, hours });
  };

  const handleMinutesChange = (e) => {
    const minutes = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    onChange({ ...value, minutes });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <input
            type="number"
            min="0"
            max="9999"
            value={value.hours}
            onChange={handleHoursChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hours"
          />
          <span className="text-xs text-gray-500 mt-1 block">Hours</span>
        </div>
        <span className="text-lg font-medium text-gray-400">:</span>
        <div className="flex-1">
          <input
            type="number"
            min="0"
            max="59"
            value={value.minutes}
            onChange={handleMinutesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minutes"
          />
          <span className="text-xs text-gray-500 mt-1 block">Minutes</span>
        </div>
      </div>
    </div>
  );
};

const EffortSlider = ({ label, value, onChange, required = false }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="px-3">
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 (Easy)</span>
          <span className="font-medium text-blue-600">{value}</span>
          <span>10 (Extremely Hard)</span>
        </div>
      </div>
    </div>
  );
};

const CostInput = ({ label, value, onChange, required = false }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2 text-gray-500">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

const ResultCard = ({ result, onClear }) => {
  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'strong_go': return 'bg-green-100 border-green-500 text-green-800';
      case 'go': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'caution': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'no_go': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
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

  return (
    <div className="mt-6 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Value Number™ Result</h3>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {result.value_number}
        </div>
        <div className={`inline-block px-4 py-2 rounded-full border-2 font-medium ${getRecommendationColor(result.recommendation)}`}>
          {getRecommendationText(result.recommendation)}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Analysis</h4>
        <p className="text-gray-700 text-sm leading-relaxed">{result.explanation}</p>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Formula: {result.calculation_type === 's_formula' ? 'S = Z / (Y + V)' : 'W = (Z×M) / (Y×T + V)'}
      </div>
    </div>
  );
};

const ValueNumberCalculator = () => {
  const [activeTab, setActiveTab] = useState('s_formula');
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

  const validateInputs = (inputs, formula) => {
    if (inputs.old_time.hours === 0 && inputs.old_time.minutes === 0) {
      return 'Old time cannot be zero';
    }
    if (inputs.training_time.hours === 0 && inputs.training_time.minutes === 0 && inputs.new_effort === 0) {
      return 'Training time plus new effort cannot be zero';
    }
    if (formula === 'w_formula' && inputs.old_cost === 0) {
      return 'Old cost must be greater than zero for W formula';
    }
    return null;
  };

  const handleSCalculate = async () => {
    const validationError = validateInputs(sInputs, 's_formula');
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/calculate/s-formula`, sInputs);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWCalculate = async () => {
    const validationError = validateInputs(wInputs, 'w_formula');
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API}/calculate/w-formula`, wInputs);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError('');
  };

  useEffect(() => {
    clearResult();
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Value Number™ Calculator</h1>
        <p className="text-gray-600">Mathematical certainty in every decision</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('s_formula')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 's_formula' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          S Formula (Without Costs)
        </button>
        <button
          onClick={() => setActiveTab('w_formula')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'w_formula' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          W Formula (With Costs)
        </button>
      </div>

      {/* Calculator Forms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 's_formula' ? (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">S Formula: S = Z / (Y + V)</h3>
              <p className="text-sm text-gray-600">Evaluate based on time and effort alone, without cost bias.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <TimeInput
                label="Z - Old Time"
                value={sInputs.old_time}
                onChange={(time) => setSInputs({...sInputs, old_time: time})}
                required
              />
              <EffortSlider
                label="Q - Old Effort"
                value={sInputs.old_effort}
                onChange={(effort) => setSInputs({...sInputs, old_effort: effort})}
                required
              />
              <TimeInput
                label="Y - Training Time"
                value={sInputs.training_time}
                onChange={(time) => setSInputs({...sInputs, training_time: time})}
                required
              />
              <EffortSlider
                label="V - New Effort"
                value={sInputs.new_effort}
                onChange={(effort) => setSInputs({...sInputs, new_effort: effort})}
                required
              />
            </div>
            
            <button
              onClick={handleSCalculate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Calculating...' : 'Calculate S Value'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">W Formula: W = (Z×M) / (Y×T + V)</h3>
              <p className="text-sm text-gray-600">Include financial factors for a comprehensive evaluation.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <TimeInput
                label="Z - Old Time"
                value={wInputs.old_time}
                onChange={(time) => setWInputs({...wInputs, old_time: time})}
                required
              />
              <EffortSlider
                label="Q - Old Effort"
                value={wInputs.old_effort}
                onChange={(effort) => setWInputs({...wInputs, old_effort: effort})}
                required
              />
              <TimeInput
                label="Y - Training Time"
                value={wInputs.training_time}
                onChange={(time) => setWInputs({...wInputs, training_time: time})}
                required
              />
              <EffortSlider
                label="V - New Effort"
                value={wInputs.new_effort}
                onChange={(effort) => setWInputs({...wInputs, new_effort: effort})}
                required
              />
              <CostInput
                label="M - Old Cost"
                value={wInputs.old_cost}
                onChange={(cost) => setWInputs({...wInputs, old_cost: cost})}
                required
              />
              <CostInput
                label="T - New Cost"
                value={wInputs.new_cost}
                onChange={(cost) => setWInputs({...wInputs, new_cost: cost})}
                required
              />
            </div>
            
            <button
              onClick={handleWCalculate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Calculating...' : 'Calculate W Value'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {result && <ResultCard result={result} onClear={clearResult} />}
    </div>
  );
};

export default ValueNumberCalculator;