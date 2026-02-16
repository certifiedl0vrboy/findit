import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ImageSlideshow from '@/components/ImageSlideshow';
import { backgroundImages } from '@/lib/backgroundImages';

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo, accept any phone/password
      navigate('/dashboard');
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('OTP will be sent to your phone number for password reset.');
  };

  return (
    <div className="min-h-screen bg-alabaster flex relative overflow-hidden font-sans selection:bg-champagne/30 leading-[1.7]">

      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-20 bg-alabaster/95 backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 md:p-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/landing')}
            className="text-[#333333] hover:bg-black/5 hover:text-forest-black transition-colors rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-md w-full mx-auto">
            {/* Logo & Welcome */}
            <div className="mb-12 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="w-12 h-12 bg-forest-black rounded-xl flex items-center justify-center shadow-lg shadow-forest-black/20 transform -rotate-3">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#1A1A1A] tracking-[-0.02em]">FIND<span className="text-forest-black">IT</span></h1>
              </div>
              <h2 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-4 tracking-[-0.02em]">Welcome back</h2>
              <p className="text-[#333333] text-lg font-medium font-sans">Please enter your details to sign in.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-kenyan-red text-sm font-medium flex items-center gap-2 animate-in fade-in zoom-in-95 font-sans">
                <span className="bg-red-100 p-1 rounded-full shrink-0">!</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              {/* Phone Input */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-forest-black ml-1 uppercase tracking-[0.15em] font-serif">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/60 group-focus-within:text-forest-black transition-colors" />
                  <Input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-12 pr-4 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-forest-black ml-1 uppercase tracking-[0.15em] font-serif">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/60 group-focus-within:text-forest-black transition-colors" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-mocha/60 hover:text-forest-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-gray-300 data-[state=checked]:bg-forest-black data-[state=checked]:border-forest-black rounded text-white w-5 h-5"
                  />
                  <label htmlFor="remember" className="text-sm text-[#333333]/80 font-medium cursor-pointer select-none font-sans">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-bold text-forest-black hover:text-forest-black/80 hover:underline underline-offset-4 font-sans"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-7 bg-forest-black hover:bg-forest-black/90 text-white font-bold text-lg rounded-xl shadow-xl shadow-forest-black/20 hover:shadow-2xl hover:shadow-forest-black/30 transform hover:-translate-y-0.5 transition-all duration-300 mt-4 font-sans tracking-wide"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-alabaster text-mocha/60 font-bold uppercase tracking-[0.15em] text-xs font-serif">New to Find It?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <button
                onClick={() => navigate('/register')}
                className="group text-[#1A1A1A] hover:text-forest-black font-bold text-base transition-colors flex items-center justify-center gap-2 mx-auto font-sans"
              >
                Create an account
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-forest-black"></span>
              </button>
            </div>

            {/* Footer Copyright */}
            <div className="mt-16 text-center text-xs text-mocha/40 font-bold tracking-[0.15em] uppercase font-serif">
              &copy; {new Date().getFullYear()} Find It. All rights reserved.
            </div>

          </div>
        </div>
      </div>

      {/* Right Side - Image Slideshow */}
      <div className="hidden lg:block lg:w-1/2 relative bg-forest-black overflow-hidden">
        <ImageSlideshow images={backgroundImages} interval={5000} />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
        <div className="absolute inset-0 bg-forest-black/20 z-10 mix-blend-multiply" />

        {/* Content on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <div className="max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <h3 className="text-5xl font-serif font-bold mb-6 leading-[0.95] tracking-[-0.02em]">Connect with <br />Excellence.</h3>
            <p className="text-white/80 text-lg leading-[1.7] max-w-md font-sans">
              Join thousands of Kenyan businesses and service providers growing their reach today.
            </p>

            {/* Decorative Line */}
            <div className="h-1 w-24 bg-champagne mt-8 rounded-full" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
