import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Phone, Clock, Image, Settings, LogOut,
  Eye, Calendar, Camera, Edit, ChevronRight, Bell,
  MapPin, Star, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ImageSlideshow from '@/components/ImageSlideshow';
import { backgroundImages } from '@/lib/backgroundImages';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile] = useState({
    name: 'John Kamau',
    service: 'Professional Plumber',
    phone: '+254712345678',
    email: 'john@example.com',
    location: 'Nairobi, Kenya',
    rating: 4.8,
    reviews: 124,
    profileViews: 1250,
    callsReceived: 89,
    daysRemaining: 18,
    totalDays: 30,
    joinDate: '2025-01-15',
    expiryDate: '2025-02-14',
  });

  const [photos] = useState([
    '/images/backgrounds/plumber_service.jpg',
    '/images/backgrounds/mechanic_garage.jpg',
  ]);

  const stats = [
    {
      title: 'Profile Views',
      value: profile.profileViews,
      change: '+12%',
      trend: 'up',
      icon: Eye,
      color: 'green',
    },
    {
      title: 'Calls Received',
      value: profile.callsReceived,
      change: '+8%',
      trend: 'up',
      icon: Phone,
      color: 'blue',
    },
    {
      title: 'Days Remaining',
      value: profile.daysRemaining,
      change: 'Renew soon',
      trend: 'neutral',
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Rating',
      value: profile.rating,
      change: `${profile.reviews} reviews`,
      trend: 'up',
      icon: Star,
      color: 'purple',
    },
  ];

  const recentActivity = [
    { type: 'view', message: 'Someone viewed your profile', time: '2 minutes ago' },
    { type: 'call', message: 'Received a call from +2547XXXXXXX', time: '15 minutes ago' },
    { type: 'view', message: 'Someone viewed your profile', time: '1 hour ago' },
    { type: 'call', message: 'Received a call from +2547XXXXXXX', time: '3 hours ago' },
    { type: 'review', message: 'New 5-star review received', time: '1 day ago' },
  ];

  const handleLogout = () => {
    navigate('/landing');
  };

  const handlePhotoUpload = () => {
    alert('Photo upload functionality would open here');
  };

  const handleRenewal = () => {
    alert('Redirecting to Paystack for renewal payment...');
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      <ImageSlideshow images={backgroundImages} interval={6000} />
      <div className="relative z-10 min-h-screen flex w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  <span className="text-green-500">FIND</span>IT
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-green-600/20 text-green-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-green-600/20 text-green-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Users className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'photos' ? 'bg-green-600/20 text-green-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Image className="w-5 h-5" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-green-600/20 text-green-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Dashboard</h2>
                <p className="text-sm text-gray-400">Welcome back, {profile.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Subscription Alert */}
            {profile.daysRemaining <= 7 && (
              <div className="mb-6 glass rounded-xl p-4 border-yellow-600/30 bg-yellow-600/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-white font-semibold">Subscription Expiring Soon</p>
                      <p className="text-sm text-gray-400">{profile.daysRemaining} days remaining. Renew now to keep your listing active.</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleRenewal}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Renew Now
                  </Button>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="glass rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-600/20 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    </div>
                    {stat.trend !== 'neutral' && (
                      <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{stat.change}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Info */}
                <div className="glass rounded-xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                    <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-white/10">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-bold text-white">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-xl font-semibold text-white">{profile.name}</h4>
                        <Badge className="bg-green-600/20 text-green-400 border-green-600/30 mt-1">
                          {profile.service}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {profile.joinDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{profile.rating} ({profile.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Photos</h3>
                    <Button
                      onClick={handlePhotoUpload}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-white/10"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Add Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <button
                      onClick={handlePhotoUpload}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors"
                    >
                      <Camera className="w-8 h-8 mb-2" />
                      <span className="text-sm">Add Photo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Subscription Status */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Days Remaining</span>
                        <span className="text-white font-semibold">{profile.daysRemaining}/{profile.totalDays}</span>
                      </div>
                      <Progress value={(profile.daysRemaining / profile.totalDays) * 100} className="h-2" />
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Started</span>
                        <span className="text-white">{profile.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-400">Expires</span>
                        <span className="text-white">{profile.expiryDate}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleRenewal}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Renew Subscription
                    </Button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'view' ? 'bg-blue-600/20' :
                            activity.type === 'call' ? 'bg-green-600/20' : 'bg-yellow-600/20'
                          }`}>
                          {activity.type === 'view' && <Eye className="w-4 h-4 text-blue-500" />}
                          {activity.type === 'call' && <Phone className="w-4 h-4 text-green-500" />}
                          {activity.type === 'review' && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="w-full mt-4 text-green-500 hover:text-green-400">
                    View All Activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'overview' ? 'text-green-500' : 'text-gray-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'profile' ? 'text-green-500' : 'text-gray-400'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'photos' ? 'text-green-500' : 'text-gray-400'}`}
          >
            <Image className="w-5 h-5" />
            <span className="text-xs">Photos</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'settings' ? 'text-green-500' : 'text-gray-400'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
