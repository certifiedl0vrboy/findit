import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, ArrowRight } from 'lucide-react';
import ImageSlideshow from '../components/ImageSlideshow';
import { motion } from 'framer-motion';

// ─── Category Data ──────────────────────────────────────────────
const categories = [
  {
    name: 'Cleaners',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    name: 'Handymen',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.048.58.024 1.193-.14 1.743" />
      </svg>
    ),
  },
  {
    name: 'Landscapers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
  {
    name: 'Movers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    name: 'Plumbers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
];

// ─── Project Cards Data ─────────────────────────────────────────
const projectCards = [
  { title: 'House Cleaning', image: '/images/backgrounds/laundry_service.jpg' },
  { title: 'Plumbing Repair', image: '/images/backgrounds/plumber_service.jpg' },
  { title: 'Electrical Work', image: '/images/backgrounds/electrician_service.jpg' },
  { title: 'Landscaping', image: '/images/backgrounds/farming_agriculture.jpg' },
  { title: 'Home Renovation', image: '/images/backgrounds/carpenter_workshop.jpg' },
  { title: 'Pest Control', image: '/images/backgrounds/pest_control.jpg' },
];

const heroImages = projectCards.map(card => card.image);

// ─── Why Customers Love Items ───────────────────────────────────
const loveItems = [
  {
    title: 'Get a pro faster',
    description: 'Instantly connect with verified service providers in your area. No more endless searching.',
  },
  {
    title: 'Trusted & Verified',
    description: 'Every professional on Find It is vetted with ID verification and customer reviews.',
  },
  {
    title: 'Fair Pricing',
    description: 'Compare quotes from multiple providers to get the best deal, every time.',
  },
];

// ─── How It Works Data ──────────────────────────────────────────
const howItWorksSteps = [
  {
    id: 1,
    title: 'Search',
    description: 'Browse through hundreds of verified professionals in your area. Filter by rating, price, and expertise to find the perfect match for your specific needs.',
    image: '/images/backgrounds/electrician_service.jpg'
  },
  {
    id: 2,
    title: 'Compare',
    description: 'View detailed profiles, read real customer reviews from your neighbors, and compare quotes to ensure you make the best choice.',
    image: '/images/backgrounds/carpenter_workshop.jpg'
  },
  {
    id: 3,
    title: 'Hire & Relax',
    description: 'Connect directly, book your service, and get the job done. Enjoy secure payments and our satisfaction guarantee.',
    image: '/images/backgrounds/plumber_service.jpg'
  }
];

// ─── Component ─────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Rotating text state
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const services = [
    'Find a fundi near you',
    'Connect with businesses near you',
    'One click find',
    'Your customer is near you',
    'Connections made easy'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (name: string) => {
    navigate(`/search?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-alabaster font-sans selection:bg-champagne/30 text-[#333333] leading-[1.7]">
      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav className="w-full border-b border-black/5 sticky top-0 bg-alabaster/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => navigate('/landing')} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-forest-black flex items-center justify-center shadow-lg shadow-forest-black/20">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-forest-black font-serif">
              FIND<span className="text-forest-black">IT</span>
            </span>
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-mocha/80 font-sans">
            <button onClick={() => navigate('/search')} className="hover:text-forest-black transition-colors">
              Find Services
            </button>
            <button onClick={() => navigate('/register')} className="hover:text-forest-black transition-colors">
              List Your Business
            </button>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4 font-sans">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-mocha hover:text-[#333333] transition-colors px-4 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-bold text-white bg-forest-black hover:bg-forest-black/90 transition-colors px-6 py-3 rounded-full shadow-lg shadow-forest-black/20"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────── */}
      <section className="pt-16 pb-0 md:pt-24 md:pb-0 px-4">
        <div className="max-w-5xl mx-auto text-center">

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#1A1A1A] leading-[1.2] tracking-tight mb-8 relative z-10 min-h-[1.2em] overflow-hidden">
            <span key={currentServiceIndex} className="block animate-fade-in-up">
              {services[currentServiceIndex]}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-mocha/80 mb-12 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed font-sans">
            Connect with trusted professionals across Kenya for any project, big or small.
          </p>

          {/* Search Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto relative z-10 mb-20 font-sans">
            <button
              onClick={() => navigate('/search')}
              className="w-full sm:w-auto px-10 py-5 bg-forest-black hover:bg-forest-black/90 text-white font-bold rounded-full transition-all duration-200 hover:scale-105 shadow-xl shadow-forest-black/20 flex items-center justify-center gap-3 text-lg"
            >
              <Search className="w-6 h-6" />
              <span>Find Service</span>
            </button>

            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-5 bg-[#1A1A1A] hover:bg-black text-white font-bold rounded-full transition-all duration-200 hover:scale-105 shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              <span>Register your Service/Business</span>
            </button>
          </div>

          {/* Arch Slideshow */}
          <div className="mx-auto w-full max-w-[28rem] h-[36rem] relative rounded-t-full overflow-hidden shadow-2xl shadow-mocha/10 ring-1 ring-black/5">
            <ImageSlideshow images={heroImages} interval={4000} />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ─── CATEGORY PILLS ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-8 md:gap-16 overflow-x-auto hide-scrollbar py-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="flex flex-col items-center gap-3 group cursor-pointer shrink-0 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-black/5 bg-white shadow-sm transition-all duration-300 ${hoveredCategory === cat.name ? 'scale-110 shadow-lg border-champagne/30' : ''
                    }`}
                >
                  <div className={`transition-colors duration-300 ${hoveredCategory === cat.name ? 'text-forest-black' : 'text-mocha/60'}`}>
                    {cat.icon}
                  </div>
                </div>
                <span className={`text-base font-medium font-sans transition-colors duration-300 ${hoveredCategory === cat.name ? 'text-[#333333]' : 'text-mocha/70'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS IN YOUR AREA ──────────────────────────── */}
      <section className="py-24 px-4 bg-white/50 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-forest-black/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h3 className="text-xs font-serif font-bold uppercase tracking-[0.15em] text-forest-black mb-3">
                Featured Work
              </h3>
              <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-[-0.02em] text-[#1A1A1A] mb-4">
                Projects in your area
              </h2>
              <p className="text-mocha/70 text-xl font-medium max-w-xl font-sans leading-[1.7]">
                Explore popular services near you, curated for quality and reliability.
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-forest-black font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300 group font-sans"
            >
              <span>View all projects</span>
              <ArrowRight className="w-5 h-5 group-hover:text-forest-black/70" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {projectCards.map((card, index) => (
              <button
                key={card.title}
                onClick={() => navigate(`/search?q=${encodeURIComponent(card.title)}`)}
                className={`group relative rounded-[2rem] overflow-hidden aspect-[4/5] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 ${index % 3 === 1 ? 'md:translate-y-16' : ''
                  } ${index % 3 === 2 ? 'md:translate-y-32' : ''
                  }`}
              >
                {/* Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />

                {/* Glassmorphism 2.0 Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="relative z-10 overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-2xl group-hover:border-white/20">
                    <h3 className="text-white text-2xl font-serif font-semibold tracking-tight drop-shadow-md mb-2">
                      {card.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium font-sans">
                      <span>View professionals</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (SCROLLYTELLING) ────────────────── */}
      <section className="py-24 px-4 bg-alabaster relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column - Scrolling Text */}
          <div className="relative z-10 px-4 md:px-0">
            <h3 className="text-xs font-serif font-bold uppercase tracking-[0.15em] text-forest-black mb-3">
              How it Works
            </h3>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-[-0.02em] text-[#1A1A1A] mb-16">
              Simple steps to get <br /> the job done.
            </h2>

            <div className="space-y-40 pb-40"> {/* Large spacing for scroll */}
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20% 0px -20% 0px", amount: 0.5 }}
                  transition={{ duration: 0.8 }}
                  onViewportEnter={() => setActiveStep(index)}
                  className="max-w-md"
                >
                  <div className="w-12 h-12 rounded-full bg-champagne text-forest-black flex items-center justify-center font-serif font-bold text-xl mb-6 shadow-lg shadow-champagne/30">
                    {step.id}
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-mocha/80 text-lg leading-[1.7] font-sans">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Sticky Images */}
          <div className="hidden lg:block relative h-[600px] sticky top-32">
            <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 bg-forest-black/5">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeStep === index ? 1 : 0,
                    scale: activeStep === index ? 1.05 : 1
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent mix-blend-multiply" />

                  {/* Scrollytelling visual accent */}
                  <div className="absolute bottom-10 left-10 text-white z-20">
                    <p className="font-serif text-2xl font-bold">{step.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CUSTOMERS LOVE FIND IT ─────────────────────── */}
      <section className="py-32 px-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-champagne/10 rounded-full blur-[120px] -z-10 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left — Text (Spans 5 cols) */}
          <div className="lg:col-span-5 relative z-10">
            <h3 className="text-xs font-serif font-bold uppercase tracking-[0.15em] text-forest-black mb-3">
              The Find It Difference
            </h3>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-[-0.02em] text-[#1A1A1A] leading-[1.0] mb-12">
              Why Kenyans love{' '}
              <span className="text-forest-black relative inline-block">
                Find It.
                <svg className="absolute w-[110%] h-4 -bottom-1 left-0 text-champagne/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h2>

            <div className="space-y-8">
              {loveItems.map((item, index) => (
                <div
                  key={item.title}
                  className={`relative p-6 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group ${index === 1 ? 'lg:ml-8' : ''
                    } ${index === 2 ? 'lg:ml-16' : ''}`}
                >
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-full bg-forest-black text-white flex items-center justify-center shrink-0 shadow-lg shadow-forest-black/20 group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A] mb-2">{item.title}</h3>
                      <p className="text-mocha/80 leading-[1.7] font-sans">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/search')}
              className="mt-16 inline-flex items-center gap-3 bg-forest-black hover:bg-forest-black/90 text-white font-bold px-12 py-6 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 text-lg shadow-2xl shadow-forest-black/30 hover:shadow-forest-black/40 font-sans"
            >
              <span>Get started</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Right — Phone Mockup (Spans 7 cols with overlap) */}
          <div className="lg:col-span-7 flex items-center justify-center lg:justify-end relative">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Broken Grid Elements floating behind/around */}
              <div className="absolute top-10 -left-10 w-40 h-40 bg-forest-black rounded-[2rem] opacity-10 animate-pulse -z-10" />
              <div className="absolute bottom-20 -right-10 w-60 h-60 bg-champagne rounded-full opacity-10 blur-2xl -z-10" />

              {/* Main Image Container with Glassmorphism 2.0 */}
              <div className="relative rounded-[3rem] p-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <img
                  src="/images/phone-mockup.webp"
                  alt="Find It mobile app"
                  className="relative w-full h-auto rounded-[2.5rem] shadow-2xl"
                />

                {/* Floating Glass Cards */}
                <div className="absolute -bottom-10 -left-10 p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl max-w-xs animate-bounce-subtle hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg font-sans">Verified Pro</p>
                      <p className="text-white/60 text-sm font-sans">ID Checked & Vetted</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-10 -right-10 p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl max-w-xs animate-bounce-subtle animation-delay-500 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="text-forest-black text-center">
                      <p className="text-3xl font-bold mb-0 leading-none font-serif">4.9</p>
                      <div className="flex text-champagne text-xs">★★★★★</div>
                    </div>
                    <div>
                      <p className="text-[#1A1A1A] font-bold text-base font-sans">Top Rated</p>
                      <p className="text-mocha/60 text-sm font-sans">500+ Reviews</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-10 px-4 font-sans text-sm text-[#333333]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-forest-black flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-forest-black font-serif">
              FIND<span className="text-forest-black">IT</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/search')} className="hover:text-black transition-colors">
              Find Services
            </button>
            <button onClick={() => navigate('/register')} className="hover:text-black transition-colors">
              List Your Business
            </button>
            <button className="hover:text-black transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-black transition-colors">
              Terms of Service
            </button>
          </div>

          {/* Copyright */}
          <p className="text-gray-400">
            © 2025 FINDIT. All rights reserved.
          </p>
        </div>

        {/* Kenyan flag accent */}
        <div className="mt-8 h-1 flex max-w-6xl mx-auto rounded-full overflow-hidden">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-forest-black" />
          <div className="flex-1 bg-green-600" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
