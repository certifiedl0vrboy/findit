
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Lock, Eye, EyeOff, Check, ChevronDown, Building2, Wrench, Upload, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import ImageSlideshow from '@/components/ImageSlideshow';
import { backgroundImages } from '@/lib/backgroundImages';

// 250 Service categories
const serviceCategories = [
  'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mechanic', 'Auto Electrician',
  'Tailor', 'Fashion Designer', 'Barber', 'Hairdresser', 'Beautician', 'Nail Technician',
  'Cleaner', 'House Keeper', 'Security Guard', 'Bouncer', 'Driver', 'Chauffeur',
  'Chef', 'Caterer', 'Baker', 'Butcher', 'Fishmonger', 'Photographer', 'Videographer',
  'DJ', 'MC', 'Event Planner', 'Wedding Planner', 'Decorator', 'Florist',
  'Computer Repair', 'Phone Repair', 'Laptop Technician', 'Network Technician', 'IT Support',
  'Lawyer', 'Legal Consultant', 'Accountant', 'Bookkeeper', 'Tax Consultant', 'Auditor',
  'Nurse', 'Caregiver', 'Physiotherapist', 'Massage Therapist', 'Counselor', 'Psychologist',
  'Teacher', 'Tutor', 'Driving Instructor', 'Music Teacher', 'Dance Instructor', 'Art Teacher',
  'Welder', 'Metal Fabricator', 'Mason', 'Brick Layer', 'Roofer', 'Tiler',
  'Pool Cleaner', 'Pool Technician', 'Pest Control', 'Fumigator', 'Gardener', 'Landscaper',
  'Real Estate Agent', 'Property Manager', 'Surveyor', 'Architect', 'Interior Designer',
  'Farmer', 'Agricultural Consultant', 'Veterinarian', 'Animal Trainer', 'Pet Groomer',
  'Mobile Money Agent', 'Bank Agent', 'Insurance Agent', 'Microfinance Officer',
  'Graphic Designer', 'Web Designer', 'Web Developer', 'App Developer', 'Software Engineer',
  'Content Writer', 'Copywriter', 'Translator', 'Interpreter', 'Transcriptionist',
  'Social Media Manager', 'Digital Marketer', 'SEO Specialist', 'Email Marketer',
  'Watch Repair', 'Jewelry Repair', 'Shoe Repair', 'Shoe Shiner', 'Bag Repair',
  'Solar Installer', 'Solar Technician', 'Inverter Technician', 'Generator Technician',
  'Cyber Cafe Operator', 'Internet Cafe', 'Printing Services', 'Photocopying', 'Lamination',
  'Tour Guide', 'Travel Agent', 'Hotel Booking Agent', 'Safari Operator', 'Car Rental',
  'Gym Trainer', 'Personal Trainer', 'Yoga Instructor', 'Nutritionist', 'Dietitian',
  'Traditional Healer', 'Herbalist', 'Spiritual Healer', 'Fortune Teller',
  'Kiosk Vendor', 'Shopkeeper', 'Retail Store Owner', 'Supermarket Owner', 'Boutique Owner',
  'Gas Delivery', 'Water Delivery', 'Milk Delivery', 'Newspaper Delivery', 'Courier Service',
  'Excavator Operator', 'Bulldozer Operator', 'Crane Operator', 'Forklift Operator',
  'Truck Driver', 'Delivery Driver', 'Ride Share Driver', 'Taxi Driver', 'Bus Driver',
  'Car Wash', 'Auto Detailing', 'Window Tinting', 'Car Upholstery', 'Spare Parts Dealer',
  'Scrap Metal Dealer', 'Recycling Services', 'Waste Management', 'Garbage Collection',
  'Fire Safety Officer', 'First Aid Trainer', 'Safety Consultant', 'Security Systems Installer',
  'CCTV Installer', 'Alarm Technician', 'Locksmith', 'Safe Technician',
  'Furniture Maker', 'Furniture Repair', 'Upholsterer', 'Curtain Maker', 'Blind Installer',
  'Air Conditioner Repair', 'Fridge Repair', 'Washing Machine Repair', 'Microwave Repair',
  'TV Repair', 'Radio Repair', 'Speaker Repair', 'Electronics Repair',
  'Bicycle Repair', 'Motorcycle Repair', 'Motorcycle Mechanic', 'Spare Parts Seller',
  'Construction Worker', 'General Laborer', 'Mover', 'Packer', 'Warehouse Worker',
  'Sales Representative', 'Marketing Agent', 'Brand Ambassador', 'Promoter', 'Canvasser',
  'Debt Collector', 'Process Server', 'Private Investigator', 'Bodyguard',
  'Speech Therapist', 'Occupational Therapist', 'Special Needs Teacher', 'Sign Language Interpreter',
  'Braille Transcriber', 'Audio Describer', 'Disability Support Worker',
  'Childcare Provider', 'Babysitter', 'Nanny', 'Daycare Owner', 'Preschool Teacher',
  'Elderly Care', 'Home Care Worker', 'Hospice Worker', 'Palliative Care',
  'Funeral Director', 'Mortician', 'Grave Digger', 'Cemetery Caretaker',
  'Marriage Counselor', 'Family Therapist', 'Life Coach', 'Career Coach', 'Business Coach',
  'Public Speaker', 'Motivational Speaker', 'Trainer', 'Facilitator', 'Workshop Leader',
  'Researcher', 'Data Entry Clerk', 'Virtual Assistant', 'Personal Assistant', 'Secretary',
  'Receptionist', 'Call Center Agent', 'Customer Service Representative', 'Telemarketer',
  'Debt Counselor', 'Financial Advisor', 'Investment Advisor', 'Stock Broker', 'Forex Trader',
  'Insurance Broker', 'Mortgage Broker', 'Loan Officer', 'Credit Officer',
  'Human Resources Consultant', 'Recruiter', 'Headhunter', 'Career Consultant',
  'Environmental Consultant', 'Energy Auditor', 'Sustainability Consultant', 'Climate Advisor',
  'Sports Coach', 'Football Coach', 'Basketball Coach', 'Swimming Instructor', 'Tennis Coach',
  'Martial Arts Instructor', 'Boxing Coach', 'Wrestling Coach', 'Athletics Coach',
  'Chess Instructor', 'Board Game Tutor', 'Puzzle Maker', 'Game Developer',
  'Drone Operator', 'Drone Photographer', 'Aerial Surveyor', 'Drone Trainer',
  '3D Printer Technician', 'Laser Cutter Operator', 'CNC Machine Operator', 'Machinist',
  'Glass Blower', 'Potter', 'Ceramicist', 'Sculptor', 'Wood Carver', 'Stone Carver',
  'Embroiderer', 'Knitter', 'Crocheter', 'Quilter', 'Weaver', 'Basket Weaver',
  'Bead Maker', 'Jewelry Designer', 'Accessory Designer', 'Bag Designer', 'Shoe Designer',
  'Tattoo Artist', 'Piercing Artist', 'Body Modification Artist', 'Permanent Makeup Artist',
  'Makeup Artist', 'Bridal Makeup', 'Special Effects Makeup', 'Theatrical Makeup',
  'Hair Stylist', 'Wig Maker', 'Hair Extension Specialist', 'Braider', 'Dreadlock Technician',
  'Skin Care Specialist', 'Esthetician', 'Spa Therapist', 'Wellness Coach', 'Meditation Instructor',
  'Aromatherapist', 'Reflexologist', 'Acupuncturist', 'Chiropractor', 'Osteopath',
  'Blood Pressure Monitor', 'Diabetes Educator', 'HIV Counselor', 'Family Planning Counselor',
  'Midwife', 'Birth Doula', 'Postpartum Doula', 'Lactation Consultant', 'Infant Care Specialist',
  'Pet Sitter', 'Dog Walker', 'Animal Boarding', 'Pet Trainer', 'Animal Behaviorist',
  'Horse Trainer', 'Riding Instructor', 'Stable Manager', 'Farrier', 'Equine Therapist',
  'Poultry Farmer', 'Dairy Farmer', 'Fish Farmer', 'Beekeeper', 'Snail Farmer',
  'Compost Maker', 'Organic Fertilizer Producer', 'Seedling Producer', 'Horticulturist',
  'Irrigation Technician', 'Borehole Driller', 'Well Digger', 'Water Treatment Specialist',
  'Solar Water Heater Installer', 'Biogas Installer', 'Wind Turbine Technician',
  'Electric Vehicle Technician', 'Charging Station Installer', 'Battery Technician',
  'E-waste Recycler', 'Computer Assembler', 'Phone Assembler', 'Electronics Manufacturer'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState<'service' | 'business'>('service');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
    setShowCategories(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean = false) => {
    const files = e.target.files;
    if (files) {
      if (isProfile) {
        setProfilePic(files[0]);
      } else {
        setPhotos(prev => [...prev, ...Array.from(files)].slice(0, 3));
      }
    }
  };



  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Sign up user — profile is auto-created by DB trigger from metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            business_name: formData.businessName,
            phone: formData.phone,
            category: formData.category,
            user_type: registrationType,
          }
        }
      });

      if (authError) throw new Error(authError.message);

      if (authData.user) {
        // Free trial — no payment required at registration
        // The DB trigger sets subscription_status='trial' and trial_ends_at=now()+30 days
        alert('Welcome to FINDIT! 🎉 You have a 30-day free trial.');
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = serviceCategories.filter(cat =>
    cat.toLowerCase().includes(formData.category.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-alabaster flex relative overflow-hidden font-sans selection:bg-champagne/30 leading-[1.7]">

      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col relative z-20 bg-alabaster/95 backdrop-blur-sm h-screen overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between sticky top-0 bg-alabaster/95 backdrop-blur-md z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/landing')}
            className="text-[#333333] hover:bg-black/5 hover:text-forest-black transition-colors rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2 font-sans">
            <span className="text-sm font-bold text-mocha/40 uppercase tracking-widest">Step {step} of 3</span>
            <div className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-black transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}% ` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-md w-full mx-auto">
            {/* Title Section */}
            <div className="mb-10 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-3 tracking-[-0.02em]">Create Account</h2>
              <p className="text-[#333333] text-lg font-medium font-sans">Join Kenya's premier network of professionals.</p>
            </div>

            {/* Registration Type Toggle */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4 mb-10 animate-in fade-in zoom-in-95 duration-500 font-sans">
                <button
                  type="button"
                  onClick={() => setRegistrationType('service')}
                  className={`p - 6 rounded - 2xl border transition - all duration - 300 flex flex - col items - center justify - center gap - 3 group ${registrationType === 'service'
                    ? 'bg-forest-black border-forest-black text-white shadow-xl shadow-forest-black/20'
                    : 'bg-white border-black/10 text-mocha/60 hover:border-forest-black/20 hover:shadow-md'
                    } `}
                >
                  <Wrench className={`w - 8 h - 8 ${registrationType === 'service' ? 'text-champagne' : 'text-mocha/40 group-hover:text-forest-black'} `} />
                  <span className="font-bold tracking-wide">Professional</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType('business')}
                  className={`p - 6 rounded - 2xl border transition - all duration - 300 flex flex - col items - center justify - center gap - 3 group ${registrationType === 'business'
                    ? 'bg-forest-black border-forest-black text-white shadow-xl shadow-forest-black/20'
                    : 'bg-white border-black/10 text-mocha/60 hover:border-forest-black/20 hover:shadow-md'
                    } `}
                >
                  <Building2 className={`w - 8 h - 8 ${registrationType === 'business' ? 'text-champagne' : 'text-mocha/40 group-hover:text-forest-black'} `} />
                  <span className="font-bold tracking-wide">Business</span>
                </button>
              </div>
            )}

            <form onSubmit={handleRegistration} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">
                      {registrationType === 'service' ? 'Full Name' : 'Business Name'}
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/40 group-focus-within:text-forest-black transition-colors" />
                      <Input
                        type="text"
                        placeholder={registrationType === 'service' ? 'e.g. John Kamau' : 'e.g. Nairobi Enterprises'}
                        value={registrationType === 'service' ? formData.fullName : formData.businessName}
                        onChange={(e) => handleInputChange(registrationType === 'service' ? 'fullName' : 'businessName', e.target.value)}
                        className="pl-12 pr-4 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/40 group-focus-within:text-forest-black transition-colors" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-12 pr-4 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/40 group-focus-within:text-forest-black transition-colors" />
                      <Input
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-12 pr-4 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/40 group-focus-within:text-forest-black transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="******"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-12 pr-10 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/60 hover:text-forest-black transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Confirm</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha/40 group-focus-within:text-forest-black transition-colors" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="******"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-12 pr-4 py-6 bg-white border-black/10 text-[#333333] placeholder:text-mocha/40 rounded-xl focus:border-forest-black focus:ring-forest-black/5 transition-all font-medium shadow-sm font-sans"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Category & Photos */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Select Category</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCategories(!showCategories)}
                        className="w-full flex items-center justify-between px-6 py-5 bg-white border border-black/10 rounded-xl text-left text-[#333333] hover:border-forest-black transition-all shadow-sm font-sans"
                      >
                        <span className={`font-medium ${formData.category ? 'text-[#333333]' : 'text-mocha/40'}`}>
                          {formData.category || 'Search and select a category...'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-mocha/40 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                      </button>

                      {showCategories && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-black/10 p-4 max-h-64 overflow-y-auto z-50 custom-scrollbar animate-in fade-in zoom-in-95">
                          <Input
                            type="text"
                            placeholder="Search categories..."
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="mb-3 bg-alabaster border-black/10 text-[#333333] placeholder:text-mocha/40 font-sans"
                            autoFocus
                          />
                          <div className="grid grid-cols-2 gap-2">
                            {filteredCategories.map((category, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className="text-left px-3 py-2.5 rounded-lg hover:bg-black/5 text-mocha/80 hover:text-forest-black text-sm transition-colors font-medium font-sans"
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Profile Picture</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-alabaster border-2 border-dashed border-black/10 flex items-center justify-center overflow-hidden shrink-0">
                        {profilePic ? (
                          <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-mocha/40" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <div className="px-6 py-3 bg-forest-black text-white rounded-xl hover:bg-forest-black/90 transition-colors font-medium text-sm flex items-center gap-2 shadow-lg shadow-forest-black/20 font-sans">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] ml-1 font-serif">Work Samples (Max 3)</label>
                    <div className="grid grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-xl bg-alabaster border border-black/10 overflow-hidden relative group">
                          <img src={URL.createObjectURL(photo)} alt={`Work ${index}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {photos.length < 3 && (
                        <label className="aspect-square rounded-xl bg-alabaster border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-forest-black/50 hover:bg-forest-black/5 transition-colors gap-2 group">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4 text-mocha/40 group-hover:text-forest-black" />
                          </div>
                          <span className="text-xs text-mocha/40 font-medium group-hover:text-forest-black font-sans">Add Photo</span>
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e)} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm font-sans">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-forest-black/5 flex items-center justify-center">
                        <Check className="w-6 h-6 text-forest-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">Registration Complete</h3>
                        <p className="text-sm text-mocha/60">Please review your details before payment.</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm border-t border-black/5 pt-4">
                      {[
                        { label: 'Account Type', value: registrationType, capitalize: true },
                        { label: 'Name', value: registrationType === 'service' ? formData.fullName : formData.businessName },
                        { label: 'Phone', value: formData.phone },
                        { label: 'Category', value: formData.category },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1">
                          <span className="text-mocha/60 font-medium">{item.label}</span>
                          <span className={`text-[#333333] font-semibold ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-forest-black text-white p-6 rounded-[2rem] shadow-xl shadow-forest-black/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-lg font-bold mb-1 relative z-10 font-serif">Subscription Fee</h3>
                    <div className="flex items-baseline gap-1 relative z-10 mb-2">
                      <span className="text-3xl font-serif font-bold">KES 250</span>
                      <span className="text-sm text-white/60 font-sans">/ estimated</span>
                    </div>
                    <p className="text-sm text-white/60 relative z-10 font-sans">
                      Secure payment via Paystack. Your profile will be activated immediately.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 px-2 font-sans">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-forest-black data-[state=checked]:border-forest-black"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-[#333333]/70 leading-snug">
                      I agree to the <button type="button" className="text-forest-black font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-forest-black font-bold hover:underline">Privacy Policy</button>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4 font-sans">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    variant="outline"
                    className="flex-1 py-7 rounded-xl border-black/10 text-[#333333] font-bold hover:bg-black/5"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || (step === 3 && !formData.agreeTerms)}
                  className="flex-1 py-7 bg-forest-black hover:bg-forest-black/90 text-white font-bold text-lg rounded-xl shadow-xl shadow-forest-black/20 hover:shadow-2xl hover:shadow-forest-black/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : step === 3 ? (
                    'Pay KES 250'
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-mocha/60 text-sm font-medium font-sans">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-forest-black hover:text-forest-black/80 font-bold transition-colors underline underline-offset-4"
                >
                  Login here
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Right Side - Image Slideshow */}
      <div className="hidden lg:block lg:w-1/2 relative bg-forest-black overflow-hidden">
        <ImageSlideshow images={backgroundImages} interval={5500} />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
        <div className="absolute inset-0 bg-forest-black/20 z-10 mix-blend-multiply" />

        {/* Content on Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-20 px-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl animate-in fade-in zoom-in-95 duration-1000">
            <h3 className="text-4xl font-serif font-bold text-white mb-6 tracking-[-0.02em]">Join the Elite.</h3>
            <p className="text-white/80 text-lg leading-[1.7] mb-8 font-sans">
              "FINDIT has transformed how I do business. The quality of clients I get is unmatched."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl font-serif">
                S
              </div>
              <div className="text-left">
                <p className="text-white font-bold font-serif">Sarah K.</p>
                <p className="text-champagne text-sm font-sans">Professional Stylist</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center z-20">
          <p className="text-white/60 text-sm uppercase tracking-[0.15em] font-bold font-serif">Empowering Kenyan Businesses</p>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;


