import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Calendar,
  Star,
  User,
  Image,
  MessageSquare,
  BarChart3,
  Briefcase,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Eye,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle,
  Trash2,
  Camera,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { usePaystackPayment } from 'react-paystack';

const Dashboard = () => {
  console.log('Dashboard Rendering...', { time: new Date().toISOString() });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // No profile found — redirect to register
          navigate('/register');
          return;
        }

        const profileName = data.user_type === 'business' ? data.business_name : data.full_name;
        console.log('Profile fetched:', { id: data.id, type: data.user_type, name: profileName });

        setUserProfile({
          ...data,
          name: profileName || "User",
          service: data.category || "Service Provider",
          rating: 5.0, // Mock for now
          reviews: 0   // Mock for now
        });
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleViewProfile = () => {
    if (userProfile?.id) {
      navigate(`/profile/${userProfile.id}`);
    }
  };


  // Fallback if something fails
  const displayProfile = useMemo(() => {
    const p = userProfile || {};
    return {
      name: p.name || "User",
      service: p.service || "Service Provider",
      rating: p.rating || 0,
      reviews: p.reviews || 0
    };
  }, [userProfile]);

  // ─── Subscription / Trial Logic ───
  const getTrialDaysLeft = () => {
    if (!userProfile?.trial_ends_at) return 30; // default for mock
    const endDate = new Date(userProfile.trial_ends_at);
    const now = new Date();
    const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const trialDaysLeft = getTrialDaysLeft();
  const subscriptionStatus = userProfile?.subscription_status || 'trial';
  const isTrialExpired = subscriptionStatus === 'trial' && trialDaysLeft <= 0;
  const isActive = subscriptionStatus === 'active';
  const isOnTrial = subscriptionStatus === 'trial' && trialDaysLeft > 0;

  // Paystack config for subscription payment
  const paystackConfig = useMemo(() => ({
    reference: `sub_${new Date().getTime()}`,
    email: userProfile?.email || 'user@findit.co.ke',
    amount: 25000, // 250 KES in kobo
    currency: 'KES',
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
  }), [userProfile?.email, userProfile?.id]);

  const initializePayment = usePaystackPayment(paystackConfig);

  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const fetchGallery = async () => {
    if (!userProfile?.id) return;
    setGalleryLoading(true);
    try {
      const { data, error: galleryError } = await supabase
        .from('business_photos')
        .select('*')
        .eq('profile_id', userProfile.id);

      if (galleryError) throw galleryError;
      if (data) setGalleryPhotos(data);
    } catch (err) {
      console.error('Gallery fetch error:', err);
    }
    setGalleryLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab]);

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      const { error } = await supabase
        .from('business_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;
      setGalleryPhotos(galleryPhotos.filter(p => p.id !== photoId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete photo.');
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile?.id) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('business-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-photos')
        .getPublicUrl(filePath);

      // 3. Insert into business_photos table
      const { error: dbError } = await supabase
        .from('business_photos')
        .insert([{
          profile_id: userProfile.id,
          storage_path: publicUrl,
          caption: ''
        }]);

      if (dbError) throw dbError;

      alert('Photo uploaded successfully!');
      fetchGallery();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload photo. Ensure "business-photos" bucket exists.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile?.id) return;

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.id}/avatar.${fileExt}`; // Overwrite existing avatar
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userProfile.id);

      if (dbError) throw dbError;

      // 4. Update local state
      setUserProfile({
        ...userProfile,
        avatar_url: publicUrl
      });

      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert('Failed to upload profile picture. Ensure "avatars" bucket permissions are set.');
    } finally {
      setIsUploadingAvatar(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handlePaySubscription = () => {
    // alert('Payment integration is temporarily disabled for maintenance. Please check back later.');
    initializePayment({
      onSuccess: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('profiles')
              .update({ subscription_status: 'active' })
              .eq('auth_user_id', user.id);

            // Record payment
            const profileId = userProfile?.id;
            if (profileId) {
              await supabase.from('payments').insert([{
                profile_id: profileId,
                paystack_reference: paystackConfig.reference,
                amount: 250,
                currency: 'KES',
                status: 'success',
              }]);
            }

            alert('Payment successful! Your profile is now live. 🎉');
            window.location.reload();
          }
        } catch (error) {
          console.error('Payment recording error:', error);
        }
      },
      onClose: () => {
        alert('Payment cancelled. Your profile remains hidden until you subscribe.');
      },
    });
  };

  const [editFormData, setEditFormData] = useState({
    category: '',
    description: ''
  });

  useEffect(() => {
    if (userProfile) {
      setEditFormData({
        category: userProfile.category || '',
        description: userProfile.description || ''
      });
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          category: editFormData.category,
          description: editFormData.description
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      setUserProfile({
        ...userProfile,
        category: editFormData.category,
        description: editFormData.description,
        service: editFormData.category || "Service Provider"
      });

      alert('Profile updated successfully!');
      setActiveTab('overview');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-alabaster flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-forest-black" />
      </div>
    );
  }

  // ─── Render Content based on Tab ───
  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in">
            <div className="w-20 h-20 bg-forest-black/5 rounded-full flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-forest-black" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Analytics Coming Soon</h2>
            <p className="text-gray-500 max-w-md">Detailed performance metrics and insights will be available in the next update.</p>
          </div>
        );
      case 'messages':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in">
            <div className="w-20 h-20 bg-forest-black/5 rounded-full flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-forest-black" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Messages Coming Soon</h2>
            <p className="text-gray-500 max-w-md">Direct client messaging and inquiry management is currently under development.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in">
            <div className="w-20 h-20 bg-forest-black/5 rounded-full flex items-center justify-center">
              <Settings className="w-10 h-10 text-forest-black" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Account Settings</h2>
            <p className="text-gray-500 max-w-md">Manage your account preferences, billing, and notifications here.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="animate-in fade-in space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">My Profile</h2>
              <Button onClick={handleViewProfile} className="bg-forest-black text-white hover:bg-forest-black/90">
                View Public Page <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-black/5">
                <div className="w-24 h-24 rounded-full bg-alabaster flex items-center justify-center text-3xl font-serif font-bold text-forest-black border border-black/5 relative group overflow-hidden">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    ((displayProfile.name || 'User').split(' ') || ['U']).map((n: string) => n ? n[0] : '').join('').substring(0, 2)
                  )}

                  {/* Overlay for upload */}
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#1A1A1A]">{displayProfile.name}</h3>
                  <p className="text-mocha/60 font-sans">{displayProfile.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-mocha/40 font-serif">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-alabaster rounded-xl">
                      <span className="text-sm font-medium">Public Status</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isActive ? 'Live' : 'Trial'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-alabaster rounded-xl">
                      <span className="text-sm font-medium">Direct Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-champagne fill-champagne" />
                        <span className="text-xs font-bold">{displayProfile.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <Button onClick={() => setActiveTab('edit-services')} className="w-full bg-forest-black text-white py-6 rounded-xl font-bold transition-all hover:-translate-y-1">
                    Edit Profile Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'edit-services':
        return (
          <div className="animate-in fade-in space-y-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <LayoutDashboard className="w-6 h-6 text-mocha/40" />
              </button>
              <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">Edit Services</h2>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 max-w-2xl">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mocha/60 uppercase tracking-widest font-serif">Category / Service Type</label>
                  <input
                    type="text"
                    required
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full h-14 px-4 bg-alabaster border-none rounded-xl focus:ring-2 focus:ring-forest-black/10 font-sans outline-none font-medium"
                    placeholder="e.g. Professional Plumber"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-mocha/60 uppercase tracking-widest font-serif">Description</label>
                  <textarea
                    required
                    rows={6}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full p-4 bg-alabaster border-none rounded-xl focus:ring-2 focus:ring-forest-black/10 font-sans outline-none font-medium resize-none"
                    placeholder="Tell clients what makes your service stand out..."
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('overview')} className="flex-1 h-14 border-black/10 rounded-xl font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 h-14 bg-forest-black text-white rounded-xl font-bold hover:bg-forest-black/90 shadow-xl shadow-forest-black/10">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="animate-in fade-in space-y-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <LayoutDashboard className="w-6 h-6 text-mocha/40" />
              </button>
              <div className="flex-1">
                <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">Business Gallery</h2>
                <p className="text-mocha/60 text-sm font-sans mt-1">Showcase your work to potential clients.</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  disabled={isUploading}
                />
                <Button
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={isUploading}
                  className="bg-forest-black text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-forest-black/10 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
              {galleryLoading ? (
                <div className="py-20 flex justify-center w-full">
                  <Loader2 className="w-8 h-8 animate-spin text-forest-black" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {galleryPhotos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5">
                      <img src={photo.storage_path} alt={photo.caption || 'Business photo'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Photo Trigger Card */}
                  <div
                    onClick={() => !isUploading && document.getElementById('photo-upload')?.click()}
                    className="aspect-square bg-alabaster rounded-2xl border-2 border-dashed border-mocha/10 flex flex-col items-center justify-center cursor-pointer hover:bg-mocha/5 transition-all group hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-forest-black group-hover:scale-110 group-hover:bg-forest-black group-hover:text-white transition-all duration-300">
                      {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-bold text-mocha/40 uppercase tracking-widest font-serif mt-4">
                      {isUploading ? 'Uploading...' : 'Add Photo'}
                    </span>
                  </div>
                </div>
              )}

              {!galleryLoading && galleryPhotos.length === 0 && (
                <div className="text-center py-20 bg-alabaster rounded-[1.5rem] border border-dashed border-black/5">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Image className="w-8 h-8 text-mocha/20" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-forest-black">No photos yet</h3>
                  <p className="text-sm text-mocha/60 font-sans max-w-xs mx-auto">Upload photos of your work to attract more clients and build trust.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="animate-in fade-in space-y-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <LayoutDashboard className="w-6 h-6 text-mocha/40" />
              </button>
              <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">Billing & Plans</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
                <h3 className="text-xl font-serif font-bold mb-6">Current Plan</h3>
                <div className="p-6 bg-forest-black text-white rounded-2xl mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-[0.15em] font-serif mb-1">Status</p>
                      <h4 className="text-2xl font-serif font-bold">{isActive ? 'FINDIT PRO' : 'FREE TRIAL'}</h4>
                    </div>
                    {isActive && <CheckCircle className="w-6 h-6 text-champagne" />}
                  </div>
                  {!isActive && (
                    <p className="text-sm text-white/60 mb-6">Your trial ends in {trialDaysLeft} days. Upgrade to stay live.</p>
                  )}
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-white/40 text-sm font-medium">Renewal Date</span>
                    <span className="font-bold">{isOnTrial ? 'N/A' : 'Monthly'}</span>
                  </div>
                </div>
                {!isActive && (
                  <Button onClick={handlePaySubscription} className="w-full bg-kenyan-red hover:bg-kenyan-red/90 text-white py-6 rounded-xl font-bold shadow-xl shadow-kenyan-red/20 transition-all hover:-translate-y-1">
                    Upgrade to PRO — KES 250
                  </Button>
                )}
              </div>

              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
                <h3 className="text-xl font-serif font-bold mb-6">Payment History</h3>
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-alabaster rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-mocha/20" />
                    </div>
                    <p className="text-mocha/40 text-sm font-medium">No recent payments found.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'overview':
      default:
        return (
          <>
            {/* ─── Subscription Status Banner ─── */}
            {isTrialExpired && (
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-red-900">Your Free Trial Has Expired</h3>
                      <p className="text-red-700/80 text-sm">Your profile is hidden from search results. Pay <strong>KES 250</strong> to become visible again.</p>
                    </div>
                  </div>
                  <Button
                    onClick={handlePaySubscription}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl px-8 py-6 shadow-xl shadow-red-600/20 hover:shadow-2xl hover:scale-[1.02] transition-all whitespace-nowrap"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay KES 250 Now
                  </Button>
                </div>
              </div>
            )}

            {isOnTrial && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-900">
                      Free Trial — <span className="text-amber-600">{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left</span>
                    </p>
                    <p className="text-amber-700/70 text-sm">Your profile is visible in search. Subscribe to keep it live after your trial ends.</p>
                  </div>
                  <Button
                    onClick={handlePaySubscription}
                    className="hidden md:flex bg-amber-600 text-white font-bold rounded-xl px-6 hover:bg-amber-700 transition-all whitespace-nowrap"
                  >
                    Subscribe Now
                  </Button>
                </div>
              </div>
            )}

            {isActive && (
              <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-bold text-green-900 text-sm">Your profile is live and visible in search results ✓</p>
                </div>
              </div>
            )}

            {/* Top Bar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700 gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#1A1A1A] tracking-[-0.02em]">
                  Good Morning, {((displayProfile.name || 'User').split(' ') || ['User'])[0]}
                </h1>
                <p className="text-[#333333] mt-2 font-medium font-sans">Here's what's happening with your business today.</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Button variant="outline" className="hidden md:flex border-black/10 text-forest-black hover:bg-white items-center gap-2 rounded-xl h-12 px-6 font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </Button>
                <Button className="flex-1 md:flex-none bg-forest-black hover:bg-forest-black/90 text-white rounded-xl h-12 px-6 shadow-xl shadow-forest-black/20 font-bold tracking-wide transition-all hover:-translate-y-0.5">
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="inline">New Service</span>
                </Button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              {[
                { label: 'Total Views', value: '0', change: '0%', icon: Eye, color: 'text-forest-black', bg: 'bg-white' },
                { label: 'Leads Generated', value: '0', change: '0%', icon: Users, color: 'text-forest-black', bg: 'bg-white' },
                { label: 'Rating', value: displayProfile.rating.toString(), change: '0', icon: Star, color: 'text-champagne', bg: 'bg-forest-black' },
                { label: 'Revenue (Est.)', value: 'KES 0', change: '0%', icon: DollarSign, color: 'text-forest-black', bg: 'bg-white' },
              ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-[2rem] shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${stat.icon === Star ? 'bg-forest-black text-white' : 'bg-white text-[#1A1A1A]'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.icon === Star ? 'bg-white/10 text-champagne' : 'bg-alabaster text-forest-black'} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${stat.icon === Star ? 'bg-white/10 text-white' : 'bg-green-50 text-green-700'}`}>
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                  <h3 className={`text-3xl font-serif font-bold mb-1 ${stat.icon === Star ? 'text-white' : 'text-[#1A1A1A]'}`}>{stat.value}</h3>
                  <p className={`text-sm font-bold uppercase tracking-[0.15em] font-serif ${stat.icon === Star ? 'text-white/60' : 'text-mocha/60'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {/* Recent Activity / Leads */}
              <div className="lg:col-span-2 space-y-8">

                {/* Chart Placeholder */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Performance Overview</h3>
                    <select className="bg-alabaster border-none text-sm font-medium rounded-lg px-4 py-2 text-[#333333] focus:ring-0 cursor-pointer outline-none hover:bg-black/5 transition-colors font-sans">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-3 px-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="w-full bg-alabaster rounded-t-xl relative group overflow-hidden h-full">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-forest-black/80 group-hover:bg-kenyan-red transition-colors duration-500 rounded-t-xl mx-auto w-3/4"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 text-xs font-bold text-mocha/40 uppercase tracking-[0.15em] px-4 font-serif">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                {/* Recent Leads List */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Recent Inquiries</h3>
                    <a href="#" className="text-sm font-bold text-kenyan-red hover:text-kenyan-red/80 hover:underline decoration-2 underline-offset-4 font-sans">View All</a>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center p-4 rounded-2xl hover:bg-alabaster transition-colors border border-transparent hover:border-black/5 group cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-alabaster flex-shrink-0 mr-4 overflow-hidden flex items-center justify-center border border-black/5">
                          <User className="w-6 h-6 text-mocha/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1A1A1A] truncate font-serif">John Doe</h4>
                          <p className="text-sm text-mocha/60 truncate font-sans">Looking for plumbing services...</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-mocha/40 mb-1 font-serif">2m ago</p>
                          <div className="w-2 h-2 rounded-full bg-kenyan-red ml-auto group-hover:animate-pulse shadow-sm shadow-kenyan-red/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Side Column - Profile Completion & Quick Actions */}
              <div className="space-y-8">
                {/* Profile Card */}
                <div className="bg-forest-black text-white p-8 rounded-[2rem] shadow-xl shadow-forest-black/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-700" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 p-1 mb-4 relative">
                      <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center overflow-hidden backdrop-blur-sm relative group">
                        {userProfile?.avatar_url ? (
                          <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-serif font-bold text-white/50">
                            {((displayProfile.name || '').split(' ') || []).map((n: string) => n ? n[0] : '').join('').substring(0, 2)}
                          </span>
                        )}

                        {/* Overlay for upload */}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          {isUploadingAvatar ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <Camera className="w-6 h-6 text-white" />
                          )}
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                      </div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-kenyan-red rounded-full flex items-center justify-center border-4 border-forest-black shadow-lg">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-1 tracking-tight">{displayProfile.name}</h3>
                    <p className="text-white/60 text-sm mb-8 font-medium">{displayProfile.service}</p>

                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div className="bg-champagne h-full rounded-full w-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <div className="flex justify-between w-full text-xs font-bold text-white/40 mb-8 uppercase tracking-widest font-serif">
                      <span>Profile Completion</span>
                      <span className="text-champagne">50%</span>
                    </div>

                    <Button onClick={handleViewProfile} className="w-full bg-white text-forest-black hover:bg-gray-100 font-bold border-none rounded-xl py-6 shadow-lg shadow-black/20 font-sans tracking-wide">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab('edit-services')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-alabaster hover:bg-black/5 transition-colors text-left group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-forest-black group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm font-sans">Edit Services</span>
                      <ChevronRight className="w-4 h-4 text-mocha/40 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setActiveTab('gallery')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-alabaster hover:bg-black/5 transition-colors text-left group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-forest-black group-hover:scale-110 transition-transform">
                        <Image className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm font-sans">Update Gallery</span>
                      <ChevronRight className="w-4 h-4 text-mocha/40 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setActiveTab('billing')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-alabaster hover:bg-black/5 transition-colors text-left group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-forest-black group-hover:scale-110 transition-transform">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm font-sans">Billing & Plans</span>
                      <ChevronRight className="w-4 h-4 text-mocha/40 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };


  return (
    <div className="min-h-screen bg-alabaster flex font-sans selection:bg-champagne/30 leading-[1.7]">

      {/* Sidebar - Premium Dark Theme */}
      <aside className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-forest-black text-white flex flex-col transition-all duration-300 z-50 shadow-2xl shadow-forest-black/20 hidden md:flex">
        {/* Logo */}
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/5">
              <Briefcase className="w-5 h-5 text-champagne" />
            </div>
            <span className="hidden lg:block text-2xl font-serif font-bold tracking-tight text-white">
              FIND<span className="text-kenyan-red">IT</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-3 lg:px-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="mb-6 lg:mb-8 lg:px-4">
            <p className="hidden lg:block text-xs font-bold text-white/40 uppercase tracking-[0.15em] mb-4 font-serif">Main Menu</p>
            <div className="space-y-1">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                { id: 'profile', icon: User, label: 'My Profile' },
                { id: 'stats', icon: BarChart3, label: 'Analytics' },
                { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 3 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-3 lg:px-4 py-4 rounded-xl transition-all duration-300 group ${activeTab === item.id
                    ? 'bg-white text-forest-black shadow-lg shadow-black/20 translate-x-1'
                    : 'text-white/60 hover:bg-white/5 hover:text-white hover:pl-5'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-kenyan-red' : 'group-hover:text-white transition-colors'}`} />
                  <span className="hidden lg:block font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="hidden lg:flex ml-auto w-5 h-5 bg-kenyan-red text-white text-[10px] font-bold items-center justify-center rounded-full shadow-lg shadow-kenyan-red/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:px-4">
            <p className="hidden lg:block text-xs font-bold text-white/40 uppercase tracking-[0.15em] mb-4 font-serif">Settings</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-4 px-3 lg:px-4 py-4 rounded-xl transition-all duration-300 group ${activeTab === 'settings'
                  ? 'bg-white text-forest-black shadow-lg shadow-black/20 translate-x-1'
                  : 'text-white/60 hover:bg-white/5 hover:text-white hover:pl-5'}`}
              >
                <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-kenyan-red' : 'group-hover:rotate-90 transition-transform'}`} />
                <span className="hidden lg:block font-medium">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-3 lg:px-4 py-4 rounded-xl text-white/60 hover:bg-white/5 hover:text-kenyan-red transition-all duration-300 group hover:pl-5"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:block font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Mini Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center text-forest-black font-bold shadow-lg shadow-black/20 group-hover:scale-105 transition-transform">
              {((displayProfile.name || '').split(' ') || []).map((n: string) => n ? n[0] : '').join('').substring(0, 2)}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-bold text-white truncate font-serif">{displayProfile.name}</p>
              <p className="text-xs text-white/60 truncate font-sans">{isActive ? 'Pro Account' : isOnTrial ? 'Free Trial' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 lg:ml-72 p-4 md:p-8 lg:p-12 overflow-x-hidden mb-20 md:mb-0 bg-alabaster">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-30 shadow-[0_-5px_20px_rgb(0,0,0,0.05)] pb-safe">
        {[
          { id: 'overview', icon: LayoutDashboard, label: 'Home' },
          { id: 'profile', icon: User, label: 'Profile' },
          { id: 'stats', icon: BarChart3, label: 'Stats' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${activeTab === item.id ? 'text-kenyan-red bg-red-50' : 'text-gray-400'
              }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
