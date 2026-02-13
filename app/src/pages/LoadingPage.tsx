import { useEffect, useState } from 'react';
import { MapPin, Search, Users } from 'lucide-react';

// Pre-compute particle positions outside the component to avoid impure renders
const generateParticles = () =>
  [...Array(20)].map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 2}s`,
  }));

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [particles] = useState(generateParticles);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-600 rounded-full opacity-20 animate-float"
            style={style}
          />
        ))}
      </div>

      {/* Kenyan flag colors stripe */}
      <div className="absolute top-0 left-0 right-0 h-2 flex">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-green-700" />
      </div>

      {/* Main content */}
      <div className="z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-green-600 flex items-center justify-center animate-pulse-glow">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
          {/* Orbiting icons */}
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center animate-float">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-black border-2 border-white rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight">
          <span className="text-green-500">FIND</span>
          <span className="text-white">IT</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 tracking-widest uppercase">
          Connect. Discover. Grow.
        </p>

        {/* Tagline */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-600" />
          <p className="text-sm text-gray-500">Kenya&apos;s Business Directory</p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* Loading spinner */}
        <div className="loading-spinner mb-4" />

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-600 via-red-600 to-green-600 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500 text-sm mt-2">{progress}% Loading...</p>
      </div>

      {/* Bottom stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex">
        <div className="flex-1 bg-green-700" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-black" />
      </div>
    </div>
  );
};

export default LoadingPage;
