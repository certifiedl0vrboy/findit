import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Star, Shield, Quote, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';

interface Provider {
    id: string;
    name: string;
    category: string;
    phone: string;
    location: string;
    rating: number;
    reviews: number;
    verified: boolean;
    description: string;
    images: string[];
    services: string[];
    hours: string;
    joined: string;
    avatar_url?: string;
}



const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPhone, setShowPhone] = useState(false);

    // Local state for reviews (fetched from Supabase)
    const [localReviews, setLocalReviews] = useState<any[]>([]);
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, text: '', name: '' });

    const fetchReviews = async () => {
        try {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('profile_id', id)
                .order('created_at', { ascending: false });

            if (data) setLocalReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }

    };

    useEffect(() => {
        const fetchProvider = async () => {
            setLoading(true);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select(`
                        *,
                        business_photos (storage_path, caption)
                    `)
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    setLoading(false);
                    return;
                }

                if (data) {
                    setProvider({
                        id: data.id,
                        name: data.user_type === 'business' ? (data.business_name || data.full_name) : (data.full_name || 'Service Provider'),
                        category: data.category || 'General',
                        phone: data.phone,
                        location: data.location || 'Nairobi, Kenya',
                        rating: data.rating || 5.0,
                        reviews: data.reviews_count || 0,
                        verified: data.subscription_status === 'active',
                        description: data.description || `Professional ${data.category || 'service'} provider offering quality services.`,
                        images: [
                            ...(data.avatar_url ? [data.avatar_url] : []),
                            ...(data.business_photos?.map((bp: any) => bp.storage_path) || [])
                        ],
                        services: [data.category || 'General', 'Consultation', 'Custom Work'],
                        hours: data.business_hours || '8:00 AM - 6:00 PM',
                        joined: new Date(data.created_at).getFullYear().toString(),
                        avatar_url: data.avatar_url,
                    });
                    fetchReviews();
                }
            } catch (err) {
                console.error('Profile fetch failed:', err);
            }
            setLoading(false);
        };

        fetchProvider();
    }, [id]);


    if (loading) {
        return (
            <div className="min-h-screen bg-alabaster flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-forest-black/30 border-t-forest-black rounded-full animate-spin" />
            </div>
        );
    }

    if (!provider) return (
        <div className="min-h-screen bg-alabaster flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Profile Not Found</h2>
            <p className="text-mocha/60 font-sans">This profile doesn't exist or is no longer available.</p>
            <button onClick={() => navigate('/search')} className="px-6 py-3 bg-forest-black text-white rounded-full font-sans font-medium hover:bg-forest-black/90 transition-colors">
                Back to Search
            </button>
        </div>
    );

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    profile_id: id,
                    author_name: newReview.name || "Anonymous User",
                    rating: newReview.rating,
                    content: newReview.text
                }]);

            if (error) {
                alert('Error submitting review: ' + error.message);
                return;
            }

            // Update reviews list and close form
            await fetchReviews();
            setNewReview({ rating: 5, text: '', name: '' });
            setIsWritingReview(false);

            // Optionally update the local provider reviews count
            if (provider) {
                setProvider({
                    ...provider,
                    reviews: (provider.reviews || 0) + 1
                });
            }
        } catch (err) {
            console.error('Review submission error:', err);
            alert('An unexpected error occurred.');
        }
    };

    const handleCall = () => {
        if (!showPhone) {
            setShowPhone(true);
        } else if (provider) {
            window.location.href = `tel:${provider.phone}`;
        }
    };

    return (
        <div className="min-h-screen bg-alabaster text-[#333333] font-sans selection:bg-champagne/30 leading-[1.7]">

            {/* ─── Navigation ─── */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
                <button
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
                >
                    <ArrowLeft className="w-5 h-5 text-forest-black group-hover:-translate-x-0.5 transition-transform" />
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">

                    {/* ─── 1. Sticky Identity Sidebar (Left) ─── */}
                    <div className="lg:col-span-3 lg:sticky lg:top-32 h-fit z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[2rem] p-8 shadow-xl border border-black/5 text-center relative overflow-visible"
                        >
                            {/* Profile Image */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <img
                                    src={provider.avatar_url || '/placeholder-user.jpg'}
                                    alt={provider.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                                />
                                {provider.verified && (
                                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow-md">
                                        <Shield className="w-5 h-5 text-champagne fill-current" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2 leading-tight">
                                {provider.name}
                            </h1>
                            <p className="text-mocha/60 text-sm font-medium tracking-wide uppercase mb-6 font-sans">
                                {provider.category}
                            </p>

                            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-[#333333]">
                                <MapPin className="w-4 h-4 text-forest-black" />
                                <span>{provider.location}</span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-6 mb-8">
                                <div>
                                    <p className="text-2xl font-serif font-bold text-forest-black">{provider.rating}</p>
                                    <div className="flex justify-center text-champagne text-[10px] space-x-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-serif font-bold text-forest-black">{localReviews.length}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-mocha/60">Reviews</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Action Button - Updated Call Logic */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="mt-6 space-y-3"
                        >
                            <Button
                                onClick={handleCall}
                                className={`w-full h-14 rounded-full font-bold text-lg shadow-xl shadow-forest-black/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 ${showPhone
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gradient-to-r from-forest-black to-[#2A2A2A] text-white'
                                    }`}
                            >
                                {showPhone ? (
                                    <>
                                        <Phone className="w-5 h-5 fill-current" />
                                        <span>Call {provider.phone}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Hire Me</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>

                            {showPhone && (
                                <p className="text-xs text-center text-mocha/60 animate-in fade-in">
                                    Click again to dial automatically
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/* ─── 2. Work Gallery (Bento Grid) ─── */}
                    <div className="lg:col-span-9 space-y-16">

                        <motion.section
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2 variants={itemVariants} className="text-sm font-bold uppercase tracking-[0.15em] text-forest-black mb-6 font-serif">
                                Selected Work
                            </motion.h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">

                                {/* Hero Project (2x2) */}
                                {provider.images[0] && (
                                    <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 relative group rounded-[1.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                                        <img src={provider.images[0]} alt="Hero Project" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-6 left-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg">
                                                <p className="text-white font-medium text-sm">Main Project Showcase</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Before/After Shot (2x1) */}
                                {provider.images[1] && (
                                    <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-1 relative group rounded-[1.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                                        <img src={provider.images[1]} alt="Before After" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">Before / After</div>
                                    </motion.div>
                                )}

                                {/* Detail Shot 1 (1x1) */}
                                {provider.images[2] && (
                                    <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 relative group rounded-[1.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                                        <img src={provider.images[2]} alt="Detail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </motion.div>
                                )}

                                {/* Testimonial Tile (1x1) */}
                                <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 bg-[#F5F2EA] rounded-[1.5rem] p-6 flex flex-col justify-between shadow-sm border border-black/5">
                                    <Quote className="w-8 h-8 text-champagne mb-2" />
                                    <p className="font-serif text-lg leading-snug text-forest-black">"Remarkable quality and speed."</p>
                                    <p className="text-xs font-bold uppercase tracking-wider text-mocha/60 mt-4">— Happy Client</p>
                                </motion.div>

                                {/* Detail Shot 2 (1x1) */}
                                {provider.images[3] && (
                                    <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 relative group rounded-[1.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                                        <img src={provider.images[3]} alt="Detail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </motion.div>
                                )}

                                {/* More... */}
                            </div>
                        </motion.section>


                        {/* ─── 3. Trust Section (Reviews) ─── */}
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-forest-black font-serif">
                                    Client Reviews ({localReviews.length})
                                </h2>
                                <Button
                                    onClick={() => setIsWritingReview(!isWritingReview)}
                                    className="bg-forest-black text-white rounded-full px-6 hover:bg-forest-black/90 shadow-lg shadow-forest-black/20"
                                >
                                    {isWritingReview ? 'Cancel Review' : 'Write a Review'}
                                </Button>
                            </div>

                            {/* Review Form - Expands when clicked */}
                            {isWritingReview && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 mb-8"
                                >
                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={newReview.name}
                                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                                className="w-full rounded-xl border-black/10 bg-alabaster p-3 focus:outline-none focus:ring-2 focus:ring-forest-black/20"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                        className={`transition-transform hover:scale-110 ${star <= newReview.rating ? 'text-champagne' : 'text-gray-200'}`}
                                                    >
                                                        <Star className="w-8 h-8 fill-current" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Your Experience</label>
                                            <textarea
                                                required
                                                value={newReview.text}
                                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                                className="w-full rounded-xl border-black/10 bg-alabaster p-3 h-32 focus:outline-none focus:ring-2 focus:ring-forest-black/20 resize-none"
                                                placeholder="Share details of your own experience..."
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" className="bg-forest-black text-white rounded-xl px-8 py-6 font-bold hover:bg-forest-black/90">
                                                Submit Review
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-snap-x">
                                {localReviews.map((review: any) => (
                                    <div key={review.id} className="min-w-[300px] md:min-w-[350px] scroll-snap-center">
                                        <div className="bg-white/60 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="flex text-champagne mb-4">
                                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                                </div>
                                                <p className="text-gray-600 font-sans leading-relaxed mb-6">"{review.content}"</p>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-black/5 pt-4">
                                                <span className="font-serif font-bold text-[#1A1A1A]">{review.author_name}</span>
                                                <span className="text-xs text-mocha/40">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* About Section (Lower Priority) */}
                        <section className="space-y-6 max-w-2xl">
                            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">About {provider.name}</h2>
                            <p className="text-lg text-gray-600 leading-relaxed font-sans">{provider.description}</p>

                            <div className="flex flex-wrap gap-3 mt-4">
                                {provider.services.map((service, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-alabaster border border-black/5 text-sm font-medium text-forest-black">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
