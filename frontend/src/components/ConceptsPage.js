import React from "react";

const Logo = ({ width = "45", height = "45", className = "" }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="conceptsLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="50%" stopColor="#7b64ff" />
        <stop offset="100%" stopColor="#ff6b6b" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="35" height="80" rx="5" fill="url(#conceptsLogoGradient)" />
    <rect x="55" y="25" width="35" height="65" rx="5" fill="url(#conceptsLogoGradient)" opacity="0.8" />
    <rect x="32.5" y="45" width="35" height="35" rx="5" fill="url(#conceptsLogoGradient)" />
  </svg>
);

const ConceptsPage = () => {
  const innovativeConcepts = [
    {
      id: 1,
      title: "The Orbituary™",
      description: "A living tribute platform that celebrates people while they are alive, transforming how we express gratitude and recognition. Moving beyond traditional obituaries to create meaningful connections and shared appreciation experiences.",
      status: "Investment Ready",
      statusColor: "green",
      category: "Social Innovation"
    },
    {
      id: 2,
      title: "Personal Notification Protocol™",
      description: "Revolutionary SCI™ Powered (Synthetic Cumulative Intelligence™) by Emergent notification management system that gives users complete control over their digital attention. Building on the success of Small Call™ PRO with over 100,000 users.",
      status: "Active Development",
      statusColor: "orange",
      category: "Digital Wellness"
    },
    {
      id: 3,
      title: "Digifit™",
      description: "SCI™ Powered (Synthetic Cumulative Intelligence™) by Emergent virtual dressing room with micrometer-precision body scanning and real-time garment simulation. Full-length smart mirror technology for the perfect fit, every time.",
      status: "Investment Ready",
      statusColor: "green",
      category: "Fashion Tech"
    },
    {
      id: 4,
      title: "SphereSight™",
      description: "Revolutionary mobile app using multiple smartphone cameras to create semi-360 panoramic video and photo experiences. Captures the full richness of visual experiences beyond traditional rectangular frames.",
      status: "Concept Phase",
      statusColor: "purple",
      category: "Mobile Innovation"
    },
    {
      id: 5,
      title: "Fresh Grill™",
      description: "Revolutionary grilling technology featuring University of Toronto's nanoscale fletching technology for safe, non-toxic cooking surfaces with disposable wire mesh system for pristine results every time.",
      status: "University Partnership",
      statusColor: "blue",
      category: "Consumer Tech"
    },
    {
      id: 6,
      title: "Value Number™",
      description: "Proprietary decision-making app providing formula-based approach to evaluating choices based on time, effort, and cost. Clear rating system for informed and efficient decisions.",
      status: "In Development",
      statusColor: "orange",
      category: "Productivity"
    },
    {
      id: 7,
      title: "Always Me™",
      description: "Digital avatar platform creating Always Me Avatar (AMA) for virtual presence and post-mortem digital existence. A revolutionary step toward digital immortality and continuous connection.",
      status: "Concept Phase",
      statusColor: "purple",
      category: "Digital Legacy"
    },
    {
      id: 8,
      title: "AURA™ & The OPC™",
      description: "Alliance for Unbiased Responsible Algorithms and Original Power Company - ethical SCI™ Powered (Synthetic Cumulative Intelligence™) by Emergent revolution ensuring transparency, integrity, and justice in artificial intelligence systems.",
      status: "Active Movement",
      statusColor: "green",
      category: "SCI™ Ethics"
    },
    {
      id: 9,
      title: "Real Time Review™",
      description: "Immediate feedback system transforming commerce through instant customer recognition and community-driven business quality assessment.",
      status: "Market Research",
      statusColor: "orange",
      category: "Commerce"
    }
  ];

  const getStatusIcon = (statusColor) => {
    switch (statusColor) {
      case 'green':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
            <path d="M21.801 10A10 10 0 1 1 17 3.335"/>
            <path d="m9 11 3 3L22 4"/>
          </svg>
        );
      case 'orange':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        );
      case 'purple':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
        );
      case 'blue':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (statusColor) => {
    const colors = {
      green: 'bg-green-500/20 text-green-400 border-green-500/40',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
    };
    return colors[statusColor] || colors.purple;
  };

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

          {/* Hero Section */}
          <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0">
              <div className="floating-animation absolute w-[150%] h-[150%] -top-1/2 -left-1/4">
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
              </div>
            </div>
            <div className="relative z-10 container-custom text-center">
              <div>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="sci-badge">
                    <div className="atom-icon">
                      <div className="atom-nucleus"></div>
                      <div className="atom-orbit">
                        <div className="atom-electron"></div>
                      </div>
                      <div className="atom-orbit">
                        <div className="atom-electron"></div>
                      </div>
                      <div className="atom-orbit">
                        <div className="atom-electron"></div>
                      </div>
                    </div>
                    SCI™ POWERED
                  </div>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black gradient-text mb-6 text-balance">Innovative Concepts</h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto text-balance">
                  Transformative ideas and breakthrough innovations shaping the future of technology, from ethical SCI™ Powered (Synthetic Cumulative Intelligence™) by Emergent to revolutionary consumer products
                </p>
              </div>
            </div>
          </section>

          {/* Concepts Grid */}
          <section className="pb-20 lg:pb-32">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {innovativeConcepts.map((concept, index) => (
                  <div 
                    key={concept.id}
                    className="glass-effect rounded-2xl p-8 card-hover group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-6 right-6 text-4xl font-black gradient-text opacity-20">
                      {String(concept.id).padStart(2, '0')}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/40 mb-4">
                          {concept.category}
                        </span>
                        {(concept.id === 2 || concept.id === 3 || concept.id === 8) && (
                          <div className="sci-badge ml-2 inline-flex">
                            <div className="atom-icon">
                              <div className="atom-nucleus"></div>
                              <div className="atom-orbit">
                                <div className="atom-electron"></div>
                              </div>
                              <div className="atom-orbit">
                                <div className="atom-electron"></div>
                              </div>
                              <div className="atom-orbit">
                                <div className="atom-electron"></div>
                              </div>
                            </div>
                            SCI™
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 pr-16">
                        {concept.title}
                      </h3>
                      
                      <p className="text-white/60 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                        {concept.description}
                      </p>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(concept.statusColor)}`}>
                        {getStatusIcon(concept.statusColor)}
                        {concept.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-20">
                <div className="glass-effect rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Bring These Concepts to Life?</h2>
                    <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto text-balance">
                      Your support and collaboration can help transform these innovative ideas into reality. 
                      Join us in building the future through ethical SCI™ Powered (Synthetic Cumulative Intelligence™) by Emergent innovation and human-centered technology.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                      <a className="btn-primary" href="/#contact">Get Involved</a>
                      <a className="btn-outline" href="/">Learn More</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="glass-effect rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Investment Opportunities</h4>
                        <p className="text-white/60 text-sm">Partner with us to fund breakthrough innovations with global impact potential.</p>
                      </div>
                      <div className="glass-effect rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Strategic Partnerships</h4>
                        <p className="text-white/60 text-sm">Collaborate on development and bring these concepts to market together.</p>
                      </div>
                      <div className="glass-effect rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-2">Development Support</h4>
                        <p className="text-white/60 text-sm">Help accelerate research, prototyping, and market validation efforts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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

export default ConceptsPage;