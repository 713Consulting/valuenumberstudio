import React, { useState, useEffect } from "react";

const MaskIcon = ({ src, size = 60 }) => (
  <div
    style={{
      width: size,
      height: size,
      background: 'var(--logo-gradient)',
      WebkitMask: `url(${src}) center / contain no-repeat`,
      mask: `url(${src}) center / contain no-repeat`
    }}
    aria-hidden="true"
  />
);

const ProductionCard = ({ production, index }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className={`glass-effect rounded-2xl overflow-hidden card-hover group relative ${production.featured ? 'ring-2 ring-blue-400/30' : ''}`}>
      {production.featured && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-blue-400 to-purple-400 text-white text-xs font-bold px-2 py-1 rounded-full">
          FLAGSHIP
        </div>
      )}
      
      {/* Video Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
        {!showVideo ? (
          <>
            {/* YouTube Thumbnail Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://img.youtube.com/vi/${production.videoId}/hqdefault.jpg), linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            
            {/* Animated Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
            </div>
            
            {/* Number Overlay */}
            <div className="absolute top-4 left-4 text-3xl font-black gradient-text opacity-70">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </>
        ) : (
          <>
            {/* YouTube Iframe */}
            <iframe
              src={`https://www.youtube.com/embed/${production.videoId}?autoplay=1&rel=0&modestbranding=1&fs=1`}
              title={production.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVideo(false);
              }}
              className="absolute top-2 right-2 z-30 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              ×
            </button>
          </>
        )}
      </div>
      
      <div className="p-6">
        <h4 
          className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 cursor-pointer hover:text-red-400 underline-offset-4 hover:underline"
          onClick={() => setShowVideo(true)}
        >
          {production.title}
        </h4>
        
        <p className="text-white/60 leading-relaxed text-sm group-hover:text-white/80 transition-colors duration-300">
          {production.description}
        </p>
      </div>
    </div>
  );
};

const Logo = ({ width = "45", height = "45", className = "" }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="50%" stopColor="#7b64ff" />
        <stop offset="100%" stopColor="#ff6b6b" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="35" height="80" rx="5" fill="url(#logoGradient)" />
    <rect x="55" y="25" width="35" height="65" rx="5" fill="url(#logoGradient)" opacity="0.8" />
    <rect x="32.5" y="45" width="35" height="35" rx="5" fill="url(#logoGradient)" />
  </svg>
);

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-black/20 backdrop-blur-md border-b border-white/10">
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

          <div className="hidden lg:flex items-center gap-8">
            <a className="relative text-white/80 hover:text-white font-medium transition-all duration-300 group" href="/">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="relative text-white/80 hover:text-white font-medium transition-all duration-300 group" href="#gallery">
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="relative text-white/80 hover:text-white font-medium transition-all duration-300 group" href="#fahtru">
              FahTru
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="relative text-white/80 hover:text-white font-medium transition-all duration-300 group" href="#mission">
              Mission
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="relative text-white/80 hover:text-white font-medium transition-all duration-300 group" href="#values">
              Values
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a className="relative text-white/80 hover:text-white font-medium transition-all duration-300 group" href="#contact">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <button 
            className="lg:hidden p-2 text-white hover:text-blue-400 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-3 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a className="text-white/80 hover:text-white font-medium transition-colors duration-300 text-sm" href="/">Home</a>
              <a className="text-white/80 hover:text-white font-medium transition-colors duration-300 text-sm" href="#gallery">Gallery</a>
              <a className="text-white/80 hover:text-white font-medium transition-colors duration-300 text-sm" href="#fahtru">FahTru</a>
              <a className="text-white/80 hover:text-white font-medium transition-colors duration-300 text-sm" href="#mission">Mission</a>
              <a className="text-white/80 hover:text-white font-medium transition-colors duration-300 text-sm" href="#values">Values</a>
              <a className="text-white/80 hover:text-white font-medium transition-colors duration-300 text-sm" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
      <div className="relative">
        <main className="min-h-screen">
          <Navigation />

          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <div className="floating-animation absolute w-[150%] h-[150%] -top-1/4 -left-1/4">
                <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent translate-x-1/2 translate-y-1/3"></div>
                <div className="absolute inset-0 bg-gradient-radial from-pink-500/5 via-transparent to-transparent -translate-x-1/4 translate-y-1/2"></div>
              </div>
            </div>

            <div className="relative z-10 container-custom text-center px-4">
              <div className="space-y-8">
                <div className="pulse-glow mx-auto w-40 h-40 lg:w-48 lg:h-48 mb-8">
                  <Logo width="100%" height="100%" className="drop-shadow-2xl" />
                </div>

                <div className="space-y-4">
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
                  <h1 className="gradient-text font-black tracking-tight text-balance pb-2 text-5xl lg:text-7xl">
                    Transforming Visions to Reality
                  </h1>
                  <p className="text-xl lg:text-2xl text-white/80 font-light max-w-4xl mx-auto text-balance leading-snug">
                    through innovative design, development, and
                  </p>
                  <p className="text-2xl lg:text-3xl text-white font-black max-w-4xl mx-auto text-balance leading-snug">
                    Synthetic Cumulative Intelligence™
                  </p>
                  <div className="flex items-center justify-center gap-3 text-white/80" style={{fontSize:'28px'}}>
                    <span className="sci-brand">
                      <span className="sci-brand-text">SCI™ powered by</span>
                      <img src={`${process.env.PUBLIC_URL}/emergent-logo.png`} alt="Emergent" style={{height:22, width:'auto'}} />
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-12">
                  {[
                    "Web Design & Development",
                    "SCI™ Powered Media Production",
                    "Digital Strategy",
                    "Creative Consulting"
                  ].map((service, index) => (
                    <div 
                      key={index}
                      className="glass-effect px-6 py-3 rounded-full text-sm lg:text-base font-medium text-white hover:bg-white/10 transition-all duration-300 cursor-default hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section id="mission" className="section-padding bg-gradient-to-b from-black to-zinc-900">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6 text-balance">Mission</h2>
                <div className="text-xl text-white/80 max-w-4xl mx-auto text-balance leading-relaxed text-center">
                  <p className="font-semibold">713 Consulting and Development Bridges the Gap</p>
                  <p className="mb-4">between visionary ideas and transformative reality.</p>
                  <p>Our mission is to empower businesses and individuals</p>
                  <p>through innovative technology solutions, the use ethical of SCI™ for</p>
                  <p className="font-semibold">People-Centered Design that Prioritizes Dignity, Authenticity, and Connection.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-effect rounded-2xl p-8 card-hover group">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <MaskIcon src={`${process.env.PUBLIC_URL}/icons/innovation-lightbulb.png`} size={60} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 text-center">Innovation</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300 text-center">
                    We develop breakthrough concepts powered by industry leading SCI™ technology that redefine how technology serves humanity.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-8 card-hover group">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <MaskIcon src={`${process.env.PUBLIC_URL}/icons/excellence-star.svg`} size={60} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 text-center">Excellence</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300 text-center">
                    Our decades of experience in human relations, concept development, and theatrical/broadcast production equips us to bring cutting edge creative excellence to every project.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-8 card-hover group">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <MaskIcon src={`${process.env.PUBLIC_URL}/icons/integrity-handshake.png`} size={60} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 text-center">Integrity</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300 text-center">
                    Our exceptional standards are shaped by Love, Truth, and Justice - principles that guide every innovation and business relationship.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section id="values" className="section-padding bg-zinc-900">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6 text-balance">Values</h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto text-balance">
                  Everything we create is built on these foundational principles
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="glass-effect rounded-2xl p-8 card-hover group text-center">
                  <div className="text-6xl mb-6 gradient-text">♥</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">Love</h3>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    We approach all projects with care for human success and authentic connection.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-8 card-hover group text-center">
                  <div className="text-6xl mb-6">
                    <div
                      className="mx-auto"
                      style={{
                        width: 60,
                        height: 60,
                        background: 'var(--logo-gradient)',
                        WebkitMask: `url(${process.env.PUBLIC_URL}/truth-leaf.png) center / contain no-repeat`,
                        mask: `url(${process.env.PUBLIC_URL}/truth-leaf.png) center / contain no-repeat`
                      }}
                      aria-label="Truth leaf icon"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">Truth</h3>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    Transparency, honesty, and ethical practices guide all our innovations and partnerships.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-8 card-hover group text-center">
                  <div className="text-6xl mb-6 gradient-text">⚖</div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">Justice</h3>
                  <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    Technology should empower and serve all people, not exploit or manipulate them.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="section-padding bg-gradient-to-b from-zinc-900 to-black">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6 text-balance">Gallery</h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto text-balance">
                  Showcasing our connections and collaborations with industry leaders, innovators, and visionaries
                </p>
              </div>

              <div className="masonry">
                {[
                  { 
                    name: "Hillary Clinton", 
                    date: "February 28, 2008", 
                    category: "Former Secretary of State",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/3cdz7vnz_Hillary%20Clinton%20and%20Keith%20Bolden%202.28.08.JPG",
                    filename: "Hillary Clinton and Keith Bolden 2.28.08.JPG",
                    fit: "contain",
                    objectPosition: "center 38%"
                  },
                  { 
                    name: "Shaquille O'Neal", 
                    category: "NBA Legend",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/b68wmlax_Shaq.jpg",
                    filename: "Shaq.jpg"
                  },
                  { 
                    name: "Nelly", 
                    category: "Hip-Hop Superstar",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/xkersud5_Nelly%20and%20Keith%20Bolden.JPG",
                    filename: "Nelly and Keith Bolden.JPG",
                    objectPosition: "center 37%"
                  },
                  { 
                    name: "K.D. & Pitbull", 
                    category: "International Music Superstar",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/j5femo13_KD_Pitbull.jpg",
                    filename: "KD_Pitbull.jpg"
                  },
                  { 
                    name: "K.D. & Billy Bob Thornton", 
                    category: "Hollywood Actor",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/639ddl7c_KD_Billy_Bob_Thorton.jpg",
                    filename: "KD_Billy_Bob_Thorton.jpg",
                    objectPosition: "center 38%"
                  },
                  { 
                    name: "Vivica Fox", 
                    category: "Hollywood Actress",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/fikmg78m_Vivica_Fox.jpg",
                    filename: "Vivica_Fox.jpg"
                  },
                  { 
                    name: "Vince Young", 
                    category: "NFL Quarterback",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/cmuab41q_Vince%20Young%20and%20Keith.JPG",
                    filename: "Vince Young and Keith.JPG"
                  },
                  { 
                    name: "Slick Rick", 
                    category: "Hip-Hop Legend",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/g1b4jjk5_Slick_Rick.jpg",
                    filename: "Slick_Rick.jpg"
                  },
                  { 
                    name: "Kurtis Blow", 
                    category: "Hip-Hop Pioneer",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/u8bulw08_Kurtis_Blow.jpg",
                    filename: "Kurtis_Blow.jpg"
                  },
                  { 
                    name: "LeToya Luckett", 
                    category: "R&B Superstar",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/r7tg26oo_LeToya_Luckett.jpg",
                    filename: "LeToya_Luckett.jpg"
                  },
                  { 
                    name: "Chelsea Clinton", 
                    category: "Political Leader & Author", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/0ajyc39o_Chelsea%20Clinton%20and%20Keith.JPG",
                    filename: "Chelsea Clinton and Keith.JPG"
                  },
                  { 
                    name: "Hakeem Olajuwon", 
                    category: "Houston Rockets Legend", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/9yz5lysa_Hakeem_Olajuwon.jpg",
                    filename: "Hakeem_Olajuwon.jpg"
                  },
                  { 
                    name: "Dwight Howard", 
                    category: "NBA Superstar", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/anc1r112_Dwight_Howard.jpg",
                    filename: "Dwight_Howard.jpg"
                  },
                  { 
                    name: "Paul Wall", 
                    category: "Houston Rap Legend",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/pkajvgcl_Paul_Wall.jpg",
                    filename: "Paul_Wall.jpg"
                  },
                  { 
                    name: "Mike Jones", 
                    category: "Houston Rap Icon",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/dhsukdjm_Mike%20Jones%20and%20Keith.JPG",
                    filename: "Mike Jones and Keith.JPG"
                  },
                  { 
                    name: "Tyson Beckford", 
                    category: "Supermodel & Actor",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/a3ij8ae3_Tyson_Beckford.jpg",
                    filename: "Tyson_Beckford.jpg"
                  },
                  { 
                    name: "Cus D'Amato", 
                    category: "Boxing Legend", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/01jumnj2_Cus%20Dmato%20and%20Keith.JPG",
                    filename: "Cus Dmato and Keith.JPG"
                  },
                  { 
                    name: "Macho Camacho", 
                    category: "Boxing Legend",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/e57u3swu_Macho%20Camacho%20and%20Keith.JPG",
                    filename: "Macho Camacho and Keith.JPG"
                  },
                  { 
                    name: "Mannie Fresh", 
                    category: "Hip-Hop Producer",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/it84lcn9_Mannie%20Fresh%20and%20Keith.JPG",
                    filename: "Mannie Fresh and Keith.JPG",
                    fit: "contain"
                  },
                  { 
                    name: "Chamillionaire", 
                    category: "Hip-hop Artist", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/wzrsmnsm_Chamillionaire.jpg",
                    filename: "Chamillionaire.jpg"
                  },
                  { 
                    name: "Amber Rose", 
                    category: "Media Personality", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/ryopojtz_Amber%20Rose%20and%20Keith.JPG",
                    filename: "Amber Rose and Keith.jpg"
                  },
                  { 
                    name: "Amber Rose", 
                    category: "Media Personality", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/vrhjrynm_Amber_Rose.JPG",
                    filename: "Amber_Rose.jpg",
                    objectPosition: "center 40%"
                  },
                  { 
                    name: "Johnny Dang", 
                    category: "Celebrity Jeweler",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/xiozo0kl_Johnny_Dang.jpg",
                    filename: "Johnny_Dang.jpg"
                  },
                  { 
                    name: "Annise Parker", 
                    category: "Former Houston Mayor", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/0kb2lan6_Annise_Parker.jpg",
                    filename: "Annise_Parker.jpg",
                    objectPosition: "center 35%"
                  },
                  { 
                    name: "Sheila Jackson Lee", 
                    category: "Congressional Representative",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/ere9e2pp_Sheila%20and%20me.jpg",
                    filename: "Sheila and me.jpg",
                    objectPosition: "center 42%"
                  },
                  { 
                    name: "Sheila Jackson Lee", 
                    category: "Congressional Representative",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/s2i7939a_Sheila_Jackson_Lee.jpg",
                    filename: "Sheila_Jackson_Lee.jpg",
                    objectPosition: "center 44%"
                  },
                  { 
                    name: "Christie Martin", 
                    category: "Professional Boxing",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/lsag8cih_Keith%20and%20Christie%20Martin.JPG",
                    filename: "Keith and Christie Martin.JPG"
                  },
                  { 
                    name: "Jennifer Reyes", 
                    category: "Media Personality",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/o43eai5z_Jennifer_Reyes.jpg",
                    filename: "Jennifer_Reyes.jpg",
                    objectPosition: "center 55%"
                  },
                  { 
                    name: "Reynaldo Ray", 
                    category: "Entertainment Industry",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/2wwi4b1v_Keith%20and%20Reynaldo%20Ray.JPG",
                    filename: "Keith and Reynaldo Ray.JPG"
                  },
                  { 
                    name: "Miya Shay", 
                    category: "Media Personality",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/8aq6a5x8_Miya_Shay.jpg",
                    filename: "Miya_Shay.jpg"
                  },
                  { 
                    name: "Greg Carter", 
                    category: "Film Producer", 
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/lnew985n_Greg_Carter.jpg",
                    filename: "Greg_Carter.jpg"
                  },
                  { 
                    name: "Shawn McElveen, Greg Carter, & Friend", 
                    category: "Entertainment Industry",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/741e5wb5_Shawn_Mac_Greg_Carter.jpg",
                    filename: "Shawn_Mac_Greg_Carter.jpg"
                  },
                  { 
                    name: "J. R. Richard", 
                    category: "Industry Professional",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/f6gsmwqm_JR.jpg",
                    filename: "JR.jpg"
                  },
                  { 
                    name: "Kurtis Blow, Troublesum, & Friend", 
                    category: "Hip-Hop Legends",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/p2f6bmur_Kurtis_Blow_Troublesum.jpg",
                    filename: "Kurtis_Blow_Troublesum.jpg"
                  },
                  { 
                    name: "Gary Sturgis", 
                    category: "Entertainment Industry",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/dn3nwgy3_Sturgis.jpg",
                    filename: "Sturgis.jpg"
                  },
                  { 
                    name: "Suavette", 
                    category: "Entertainment Industry",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/f5laynza_Suavette.jpg",
                    filename: "Suavette.jpg"
                  },
                  { 
                    name: "Keith on Set", 
                    category: "Behind the Scenes",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/xjy61n8s_Keith_on_set.jpg",
                    filename: "Keith_on_set.jpg"
                  },
                  /* deleted per request */
                  /* deleted per request */
                  { 
                    name: "FahTru Media Executive", 
                    category: "Media Leadership",
                    image: "https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/6hrudw4u_Keith_on_set4.jpg",
                    filename: "Keith_on_set4.jpg"
                  },
                ].map((person, index) => (
                  <div key={index}>
                    <div className="glass-effect rounded-2xl overflow-hidden">
                      <div className="relative overflow-hidden bg-black/80 flex items-center justify-center">
                      {person.image ? (
                        <img 
                          src={person.image} 
                          alt={person.name}
                          className="w-full h-auto object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <div className="text-center p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-white/40">
                              <path d="M15 3h6v6" />
                              <path d="M10 14 21 3" />
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            </svg>
                            {/* name moved below image */}
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                    <div className="pt-3 text-center">
                      <h3 className="text-base font-semibold text-white/90 leading-tight">{person.name}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <a href="#contact" className="btn-primary text-lg px-8 py-4">Discuss Your Project</a>
              </div>
            </div>
          </section>

          {/* FahTru Section */}
          <section id="fahtru" className="section-padding bg-black">
            <div className="container-custom">
              <div className="text-center mb-16">
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
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">FahTru</span>
                </h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto text-balance">
                  Productions for Global Broadcasting Company™ (GBC)
                </p>
              </div>

              {/* Global Reach Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <div className="glass-effect rounded-2xl p-8 card-hover group">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">Global Broadcast Series</h3>
                        <span className="text-blue-400 font-bold text-sm">13.9M+ Homes</span>
                      </div>
                      <span className="text-blue-400/80 text-sm font-medium">2008-2009</span>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    Revolutionary television programming reaching over 13.9 million homes across 17 European countries, 
                    showcasing innovative storytelling and cutting-edge production techniques.
                  </p>
                </div>

                <div className="glass-effect rounded-2xl p-8 card-hover group">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">Exclusive Interview</h3>
                        <span className="text-purple-400 font-bold text-sm">Channel 47</span>
                      </div>
                      <span className="text-purple-400/80 text-sm font-medium">Behind the Scenes</span>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed mb-4">
                    In-depth interview with Keith Bolden discussing FahTru's revolutionary approach to media production and global broadcasting.
                  </p>
                  <a 
                    href="https://customer-assets.emergentagent.com/job_site-creator-179/artifacts/752wrjhx_Keith%20Bolden%20Interview%20with%20C_47.doc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Read Full Interview
                  </a>
                </div>
              </div>

              {/* Production Portfolio */}
              <div className="mb-16">
                <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12 gradient-text">Production Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "On the Fringe",
                      description: "On the Fringe takes viewers on adventures that examine American myths and lore.",
                      videoId: "jkNVzchUlLU"
                    },
                    {
                      title: "Street Songs",
                      description: "Lil B of the pack hosts this urban music, fashion, and technology show produced by Drew Campbell of Adeline Studios for FahTru Media",
                      videoId: "-k4Cg4cj7yQ"
                    },
                    {
                      title: "Skate Vision",
                      description: "Goddess Productions' skateboard TV hit. You've never seen skateboarding like this!",
                      videoId: "fc2TpuVVWBY"
                    },
                    {
                      title: "America Unleashed",
                      description: "America Unleashed is broadcast on the Global Broadcasting Company (GBC) network to over 13.9 million homes in 17 European countries.",
                      videoId: "BucXX-istwc",
                      featured: true
                    },
                    {
                      title: "Hidden Histories",
                      description: "Exciting history you never knew",
                      videoId: "VGMW_nASDnI"
                    },
                    {
                      title: "Extreme Golf",
                      description: "You have never seen golf like this! Tiger Woods would not make it pass the 2nd hole. These guys are ruthless and the sexy ladies are the biggest distraction!",
                      videoId: "8tYL6P5PMiE"
                    },
                    {
                      title: "Nancy Pina's Right Relationships",
                      description: "Renowned relationship expert, Nancy Pina, discusses her new show and why she is using TV to get her message out.",
                      videoId: "0Mm9-08pLoc"
                    },
                    {
                      title: "Divalicious",
                      description: "FahTru Media's Divalicious featuring the beautiful Andre Echols is cooking like you've never seen before. Andrea offers an upscale urban twist to TV cooking. With hip music, clever tips, and even some fashion ideas this is a cooking show for the 'round the way girls!",
                      videoId: "elMX_6_1i20"
                    },
                    {
                      title: "Why Street Songs?",
                      description: "FahTru Media's Street Songs producer Drew Campbell and Alex Kopel talk about why they do the show.",
                      videoId: "Eqj8eq_tNI0"
                    },
                    {
                      title: "What's Next? with Schatar Sapphira",
                      description: "\"Hottie\" from Flavor Flav's Flavor of Love and Monique's Charm School has a new reality show that show's reality after the \"reality show.\" Airing on BSkyB's Channel 171. Check BSkyB's website for time and date.",
                      videoId: "f7zgxApVF1Y"
                    },
                    {
                      title: "Slick Rick does Street Songs",
                      description: "Slick Rick an original hip-hop pioneer gives FahTru Media's Stacy Valley an interview in the green room of the Arena Theater in Houston for the globally broadcast urban music/style show Street Songs",
                      videoId: "FZtJDG8-nJ4"
                    },
                    {
                      title: "MTV's Sway talks to \"KD\" for Street Songs",
                      description: "MTV's Sway talks to \"KD\" of FahTru Media for Street Songs at the 26th Annual Los Magnificos Car Show & Concert",
                      videoId: "9Ef331djQZo"
                    },
                    {
                      title: "Trae the Truth on Mike Jones",
                      description: "Trae the Truth talks about the \"incident\" with Mike Jones at the 2008 Ozone Awards without once saying Mike's name",
                      videoId: "ByM2nxnXHHQ"
                    },
                    {
                      title: "Street Songs Freestyle Salute: Mike Jones",
                      description: "Mike Jones on the set of his autobiographical film, American Dream, breaks out in a spontaneous acoustic freestyle performance. The momentum picks up as he hits his stride with soul man Joe Lee McCoy on guitar, along with several cast, crew, and extras including club and TV personality Fiya aka Fat Alberta.",
                      videoId: "IB4ZkLH2BaA"
                    },
                    {
                      title: "Nelly talks to FahTru Media",
                      description: "Nelly talks to FahTru Media's KD for Brother 2 Brother",
                      videoId: "JRruD3jBFtU"
                    },
                    {
                      title: "Shaq says he'll never rap again!",
                      description: "Basketball superstar and musical talent Shaquille O'Neal tells FahTru Media's \"KD\" for the Brother 2 Brother Show that this was his last rap recording.",
                      videoId: "bIeq9WSsdps"
                    },
                    {
                      title: "Undefeated Magazine TV: Marcus \"Too Much\" Johnson",
                      description: "Lou DiBella Entertainment's Marcus \"Too Much\" Johnson (16-0 with 13 knock outs) discusses his upcoming fight at Houston's Toyota Center and his future as a boxer. He also shares how he got the nickname \"Too Much\". Undefeated Magazine publisher Rosemary Acosta-Clark conducts the interview at the Prince Recreation Center in Houston's 5th Ward.",
                      videoId: "YvyI9qogduI"
                    },
                    {
                      title: "Antony David",
                      description: "Anthony David performs \"American Boy\" live at Numbers in Houston, Texas USA on Sunday March 6, 2011 Atlanta soulman Anthony David adds some Southern flavor to Estelle's \"American Boy\" since she only showed love to NYC and LA in the song.",
                      videoId: "iWGtCPg-pZ4"
                    },
                    {
                      title: "Brother 2 Brother BEHIND THE SCENES 2",
                      description: "FahTru Media's Brother 2 Brother's remote host \"KD\" talks about what it was like hanging out with Shaq for a few days straight.",
                      videoId: "lNlPzaO_gNo"
                    },
                    {
                      title: "Freestyle Salute: Kurtis Blow",
                      description: "On January 31, 2009 in the green room of the Arena Theater in Houston, Texas the founder of hip-hop Minister \"Kurtis Blow\" Walker gave an exclusive interview with FahTru Media's Stacie Valley for Street Songs. During the interview Minister Walker broke into a lyrical tribute to President Barack Obama. He also spoke briefly about his No Profanity tour featuring other hip-hop pioneers including Doug E. Fresh, Slick Rick, Whodini, and Sugar Hill.",
                      videoId: "bdpG76_WtG4"
                    },
                    {
                      title: "Caribbean Vybez",
                      description: "Caribbean Vybez host Ludi gets shout outs from some of the biggest names in Caribbean music",
                      videoId: "Vvk5nwa-OYY"
                    },
                    {
                      title: "Tyson Beckford",
                      description: "Tyson Beckford gives FahTru Media's Stacie Valley an exclusive interview for the Brother 2 Brother show and tells you want to know... but not in this clip. Stay tuned!",
                      videoId: "b3wctc-osA0"
                    },
                    {
                      title: "Ludi talks to Chamillionaire for Brother 2 Brother",
                      description: "FahTru Media Ludi Muse talks to Chamillionaire for Brother 2 Brother at the Bar Rios Club during the 2008 Ozone weekend.",
                      videoId: "owV0n28tdgQ"
                    },
                    {
                      title: "Lil' Boosie Trill Crew Opens a Can of Whoop Ass Ozone 2008",
                      description: "At Houston's Club Glo during a 2008 Ozone Awards event Lil' Boosie's Trill Entertainment crew decides to open up a family size can of whoop ass for some reason or another.",
                      videoId: "UcJZRDl_GnI"
                    },
                    {
                      title: "Houston Hip Hop family Shouts Out to Street Songs",
                      description: "Just about everyone who is someone in Houston hip-hop is shouting out to Street Songs at the 2008 Los Magnificos Car Show & Concert.",
                      videoId: "WXMo-qIHWEs"
                    },
                    {
                      title: "American Rocker",
                      description: "Goddess Productions presents an American story of rock music with the first episodes focusing on the Houston grown rock band Morgue City. Watch the escapades of the band members as they rise to the top of the urban rock music scene.",
                      videoId: "Mb4uo2HQSDA"
                    },
                    {
                      title: "Hector Macho Camacho talks to FahTru Media",
                      description: "Hector Macho Camacho talks to FahTru Media's Staci Valley for the Brother 2 Brother Show after winning his 10th title bout.",
                      videoId: "OGN4t3kDiDg"
                    }
                  ].map((production, index) => (
                    <ProductionCard key={index} production={production} index={index} />
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="glass-effect rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">Create Content for the World</h3>
                    <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto text-balance">
                      Bring your vision to millions of viewers worldwide through innovative SCI™ powered media production.
                    </p>
                    <a href="#contact" className="btn-primary text-lg px-8 py-4">
                      Start Your Production
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="section-padding bg-black">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-2 text-balance">Get In Touch</h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto text-balance">Ready to transform your vision into reality?</p>
                <p className="text-xl text-white/70 max-w-3xl mx-auto text-balance">Let's discuss your project and explore the possibilities.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div className="space-y-8">
                  <div className="glass-effect rounded-2xl p-8">
                    <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Phone</p>
                          <a href="tel:+17133289736" className="text-white text-lg font-semibold hover:text-blue-400 transition-colors duration-300">713.328.9736</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Email</p>
                          <a href="mailto:713Consulting@gmail.com" className="text-white text-lg font-semibold hover:text-blue-400 transition-colors duration-300">713Consulting@gmail.com</a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Address</p>
                          <p className="text-white text-lg font-semibold">1942 W. Gray St., Box #1259<br />Houston, TX 77019</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-effect rounded-2xl p-8">
                    <h3 className="text-2xl font-semibold text-white mb-6">Support Our Mission</h3>
                    <p className="text-white/60 mb-6 leading-relaxed">
                      Help bring innovative concepts to life through donations, investments, or partnerships.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-white/80">Zelle</span>
                        <span className="text-blue-400 font-medium">713Consulting@gmail.com</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-white/80">CashApp</span>
                        <span className="text-green-400 font-medium">$OriginalPower</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-white/80">Venmo</span>
                        <span className="text-purple-400 font-medium">@KeithBolden</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Send a Message</h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Project Type</label>
                      <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-blue-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300">
                        <option value="">Select project type</option>
                        <option value="web-development">Web Development</option>
                        <option value="media-production">Media Production</option>
                        <option value="consulting">Consulting</option>
                        <option value="innovation">Innovation Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Message</label>
                      <textarea 
                        rows="5"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-blue-400/50 focus:bg-white/10 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                    <div className="text-right"><button type="submit" className="btn-primary text-lg inline-block" style={{paddingTop: '0.35rem', paddingBottom: '0.35rem'}} >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 py-12">
            <div className="container-custom text-center">
              <p className="text-white/60 mb-2">© 2025 All rights reserved | 713 Consulting & Development | Keith Bolden</p>
              <p className="text-white/40">Creating Value Through Innovation and Excellence</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HomePage;