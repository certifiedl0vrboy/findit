import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogIn, UserPlus, MapPin, Phone, Star, TrendingUp, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageSlideshow from '@/components/ImageSlideshow';
import { backgroundImages } from '@/lib/backgroundImages';

const LandingPage = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<string>(() => {
    // If no geolocation available, default immediately
    if (!('geolocation' in navigator)) return 'Kenya';
    return 'Detecting location...';
  });
  const [isLocating, setIsLocating] = useState(() => {
    return 'geolocation' in navigator;
  });

  // Auto-detect user location
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Try to get location name from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();

          if (data.address) {
            const city = data.address.city || data.address.town || data.address.village || '';
            const county = data.address.county || '';
            const displayLocation = city ? `${city}, Kenya` : county ? `${county}, Kenya` : 'Kenya';
            setUserLocation(displayLocation);
            // Store location in localStorage for other pages
            localStorage.setItem('userLocation', displayLocation);
            localStorage.setItem('userCoords', JSON.stringify({ lat: latitude, lng: longitude }));
          } else {
            setUserLocation('Kenya');
          }
        } catch {
          setUserLocation('Kenya');
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setUserLocation('Kenya');
        // Default to Kenya if location is denied
        localStorage.setItem('userLocation', 'Kenya');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const stats = [
    { icon: MapPin, label: 'Locations', value: '47+ Counties' },
    { icon: Phone, label: 'Service Providers', value: '10,000+' },
    { icon: Star, label: 'Services', value: '250+' },
    { icon: TrendingUp, label: 'Daily Users', value: '50,000+' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Image Slideshow Background */}
      <ImageSlideshow images={backgroundImages} interval={6000} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-green-500">FIND</span>IT
                </h1>
                <p className="text-xs text-gray-400">FINDIT.COM</p>
              </div>
            </div>

            {/* Location Display */}
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              {isLocating ? (
                <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm text-white">
                {isLocating ? 'Detecting...' : userLocation}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-slideUp">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Find <span className="text-green-500">Services</span> & <span className="text-red-500">Businesses</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-2 drop-shadow-md">
              Connect with 10,000+ verified service providers and businesses across Kenya
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>Auto-detected location • Find nearest providers instantly</span>
            </div>
          </div>

          {/* Action Buttons — Find Services is the hero */}
          <div className="flex items-center justify-center gap-4 md:gap-6 max-w-5xl w-full mb-16">
            {/* Login Button — small */}
            <button
              onClick={() => navigate('/login')}
              className="group glass rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-slideUp w-40 md:w-48 shrink-0"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-red-600/40 transition-colors">
                <LogIn className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Login</h3>
              <p className="text-gray-400 text-xs">Access dashboard</p>
            </button>

            {/* Find Services — HERO center button */}
            <button
              onClick={() => navigate('/search')}
              className="group glass rounded-2xl p-8 md:p-10 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-slideUp flex-1 max-w-md border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-green-600/40 transition-colors">
                <Search className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Find Services</h3>
              <p className="text-gray-300 text-sm">Search for services and businesses near you</p>
            </button>

            {/* Register Button — small */}
            <button
              onClick={() => navigate('/register')}
              className="group glass rounded-2xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-slideUp w-40 md:w-48 shrink-0"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-colors">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Register</h3>
              <p className="text-gray-400 text-xs">List your service</p>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl w-full">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass rounded-xl p-4 text-center animate-slideUp"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 FINDIT. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Button variant="link" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Button>
              <Button variant="link" className="text-gray-400 hover:text-white">
                Terms of Service
              </Button>
            </div>
          </div>
        </footer>

        {/* Kenyan flag accent */}
        <div className="h-1 flex">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-green-600" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
