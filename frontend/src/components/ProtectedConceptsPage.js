import React, { useState } from "react";
import ConceptsPage from "./ConceptsPage";

const Logo = ({ width = "45", height = "45", className = "" }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="protectedLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="50%" stopColor="#7b64ff" />
        <stop offset="100%" stopColor="#ff6b6b" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="35" height="80" rx="5" fill="url(#protectedLogoGradient)" />
    <rect x="55" y="25" width="35" height="65" rx="5" fill="url(#protectedLogoGradient)" opacity="0.8" />
    <rect x="32.5" y="45" width="35" height="35" rx="5" fill="url(#protectedLogoGradient)" />
  </svg>
);

const ProtectedConceptsPage = () => {
  const [step, setStep] = useState('password'); // 'password', 'nda', 'concepts'
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    zip: ''
  });
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '504to713') {
      setStep('nda');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleNDASubmit = (e) => {
    e.preventDefault();
    if (formData.fullname && formData.email && formData.zip) {
      // Send to backend for email notification + logging
      fetch((process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL) + '/api/notify/concepts-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {});
      setStep('concepts');
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (step === 'concepts') {
    return <ConceptsPage />;
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
      <div className="relative">
        <main className="min-h-screen bg-black pt-20">
          {/* Navigation */}
          <nav className="fixed w-full top-0 z-50 glass-effect border-b border-white/10">
            <div className="container-custom">
              <div className="flex justify-between items-center py-4 lg:py-6">
                <a className="flex items-center gap-3 group transition-transform duration-300 hover:-translate-y-1" href="/">
                  <div className="relative">
                    <Logo className="drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300 group-hover:rotate-6" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl lg:text-4xl font-black gradient-text">713</span>
                    <span className="text-3xl lg:text-4xl font-black gradient-text">C&D</span>
                  </div>
                </a>
                <a className="flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors duration-300" href="/">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                  </svg>
                  Back to Home
                </a>
              </div>
            </div>
          </nav>

          {/* Password Step */}
          {step === 'password' && (
            <section className="relative py-20 lg:py-32 overflow-hidden">
              <div className="absolute inset-0">
                <div className="floating-animation absolute w-[150%] h-[150%] -top-1/2 -left-1/4">
                  <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="relative z-10 container-custom">
                <div className="max-w-md mx-auto">
                  <div className="glass-effect rounded-2xl p-8">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold gradient-text mb-4">Access Required</h1>
                      <p className="text-white/70">Please enter the password to view innovative concepts</p>
                    </div>
                    
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-6">
                        <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                          placeholder="Enter password"
                          required
                        />
                      </div>
                      
                      {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm">
                          {error}
                        </div>
                      )}
                      
                      <button type="submit" className="btn-primary w-full">
                        Access Concepts
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* NDA Step */}
          {step === 'nda' && (
            <section className="relative py-20 overflow-hidden">
              <div className="relative z-10 container-custom">
                <div className="max-w-4xl mx-auto">
                  <div className="glass-effect rounded-2xl p-8 lg:p-12">
                    <div style={{fontFamily: 'Arial, sans-serif', lineHeight: '1.5', maxWidth: '800px', margin: 'auto', padding: '20px', border: '1px solid #444', borderRadius: '10px'}}>
                      <h2 style={{textAlign: 'center', color: '#fff', marginBottom: '20px'}}>NDA / NC NOTICE — Confidentiality & Non-Compete</h2>
                      <p style={{color: '#ccc', marginBottom: '15px'}}>
                        By viewing or accessing these materials, you acknowledge that all content is the confidential and proprietary property of Keith Bolden and/or 713 Consulting and Development. You agree not to disclose, copy, share, or use these materials without prior written consent from the Owner. Any use, directly or indirectly, to compete with or harm the Owner's business is strictly prohibited. 
                      </p>
                      <p style={{color: '#ccc', marginBottom: '15px'}}>
                        Violations may result in immediate injunctive relief, monetary damages (including actual losses, unjust enrichment, and exemplary damages for willful misconduct), attorneys' fees, and potential criminal prosecution under applicable federal and state law. These laws include the Defend Trade Secrets Act (18 U.S.C. §1836), the Economic Espionage Act (18 U.S.C. §§1831–1832), the Computer Fraud and Abuse Act (18 U.S.C. §1030), and the Texas Uniform Trade Secrets Act (Chapter 134A, Civil Practice & Remedies Code). Courts have upheld enforcement of trade-secret rights in cases such as <i>Computer Mgmt. Assistance Co. v. Robert F. DeCastro, Inc.</i>, 220 F.3d 396 (5th Cir. 2000).
                      </p>
                      <p style={{color: '#ccc', marginBottom: '30px'}}>
                        By completing the acknowledgement below, you agree to be bound by these terms and confirm that you understand the legal consequences of unauthorized disclosure or competitive use. The Owner reserves all rights to seek remedies at law or equity without limitation.
                      </p>
                      
                      <form onSubmit={handleNDASubmit} style={{marginTop: '20px'}}>
                        <div style={{marginBottom: '15px'}}>
                          <label style={{color: '#fff', display: 'block', marginBottom: '5px'}}>Full Name:</label>
                          <input 
                            type="text" 
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            required 
                            style={{width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff'}}
                          />
                        </div>
                        
                        <div style={{marginBottom: '15px'}}>
                          <label style={{color: '#fff', display: 'block', marginBottom: '5px'}}>Email Address:</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required 
                            style={{width: '100%', padding: '8px', marginBottom: '10px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff'}}
                          />
                        </div>
                        
                        <div style={{marginBottom: '20px'}}>
                          <label style={{color: '#fff', display: 'block', marginBottom: '5px'}}>ZIP Code:</label>
                          <input 
                            type="text" 
                            name="zip"
                            value={formData.zip}
                            onChange={handleInputChange}
                            required 
                            style={{width: '100%', padding: '8px', marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', color: '#fff'}}
                          />
                        </div>
                        
                        {error && (
                          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm">
                            {error}
                          </div>
                        )}
                        
                        <button 
                          type="submit" 
                          className="btn-primary w-full"
                        >
                          I Acknowledge & Agree
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <footer className="border-t border-white/10 py-12">
            <div className="container-custom text-center">
              <p className="text-white/60 mb-2">© 2024 713 Consulting & Development | Keith Bolden. All rights reserved.</p>
              <p className="text-white/40">Creating Value Through Innovation and Excellence</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProtectedConceptsPage;