import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Lock, Eye, EyeOff, Camera, Check, ChevronDown, Building2, Wrench, Upload, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { usePaystackPayment } from 'react-paystack';
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



  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: 25000, // 250 KES in kobo/cents
    currency: 'KES',
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
    metadata: {
      custom_fields: [
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: formData.phone
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Record the payment
        await supabase.from('payments').insert([{
          profile_id: (await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single()).data?.id,
          paystack_reference: String(reference?.reference || config.reference),
          amount: 250,
          currency: 'KES',
          status: 'success',
          raw_response: reference,
        }]);

        // 2. Activate the profile — ONLY on successful payment
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('auth_user_id', user.id);
      }
    } catch (error) {
      console.error('Error recording payment:', error);
    }
    alert('Payment successful! Welcome to FINDIT. 🎉');
    navigate('/dashboard');
  };

  const onClose = () => {
    setIsSubmitting(false);
    alert('Payment is required to complete registration. You can log in and pay later.');
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
        // 2. Trigger Payment immediately
        initializePayment({ onSuccess, onClose });
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
      setIsSubmitting(false); // Only stop submitting on error. If success, waiting for payment.
    }
  };

  const filteredCategories = serviceCategories.filter(cat =>
    cat.toLowerCase().includes(formData.category.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <ImageSlideshow images={backgroundImages} interval={6000} />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-black/90 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/landing')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    <span className="text-green-500">FIND</span>IT
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-gray-900">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {step} of 3</span>
              <span className="text-sm text-green-500">{step === 1 ? 'Basic Info' : step === 2 ? 'Category' : 'Payment'}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="glass rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Register Your {registrationType === 'service' ? 'Service' : 'Business'}</h2>
                <p className="text-gray-400">Join 10,000+ service providers on FINDIT</p>
              </div>

              {/* Registration Type Toggle */}
              {step === 1 && (
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setRegistrationType('service')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${registrationType === 'service'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                      }`}
                  >
                    <Wrench className={`w-6 h-6 mx-auto mb-2 ${registrationType === 'service' ? 'text-green-500' : 'text-gray-400'}`} />
                    <p className={`font-semibold ${registrationType === 'service' ? 'text-white' : 'text-gray-400'}`}>Service Provider</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistrationType('business')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${registrationType === 'business'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                      }`}
                  >
                    <Building2 className={`w-6 h-6 mx-auto mb-2 ${registrationType === 'business' ? 'text-green-500' : 'text-gray-400'}`} />
                    <p className={`font-semibold ${registrationType === 'business' ? 'text-white' : 'text-gray-400'}`}>Business Owner</p>
                  </button>
                </div>
              )}

              <form onSubmit={handleRegistration} className="space-y-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        {registrationType === 'service' ? 'Full Name' : 'Business Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={registrationType === 'service' ? 'John Kamau' : 'ABC Enterprises'}
                          value={registrationType === 'service' ? formData.fullName : formData.businessName}
                          onChange={(e) => handleInputChange(registrationType === 'service' ? 'fullName' : 'businessName', e.target.value)}
                          className="pl-12 pr-4 py-6 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-12 pr-4 py-6 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-12 pr-4 py-6 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-12 pr-12 py-6 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-12 pr-4 py-6 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Category & Photos */}
                {step === 2 && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Select Category</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCategories(!showCategories)}
                          className="w-full flex items-center justify-between px-4 py-4 bg-white/5 border border-gray-700 rounded-lg text-left text-white hover:border-green-500 transition-colors"
                        >
                          <span className={formData.category ? 'text-white' : 'text-gray-500'}>
                            {formData.category || 'Search and select a category...'}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                        </button>

                        {showCategories && (
                          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-4 max-h-64 overflow-y-auto z-50">
                            <Input
                              type="text"
                              placeholder="Search categories..."
                              value={formData.category}
                              onChange={(e) => handleInputChange('category', e.target.value)}
                              className="mb-4 bg-white/5 border-gray-700 text-white placeholder:text-gray-500"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              {filteredCategories.map((category, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleCategorySelect(category)}
                                  className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-green-600/20 text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Profile Picture (Optional)</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden">
                          {profilePic ? (
                            <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-500" />
                          )}
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-gray-700 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-300">Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Additional Photos */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Additional Photos (Optional, max 3)</label>
                      <div className="flex flex-wrap gap-4">
                        {photos.map((photo, index) => (
                          <div key={index} className="w-24 h-24 rounded-lg bg-white/5 border border-gray-700 overflow-hidden">
                            <img src={URL.createObjectURL(photo)} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {photos.length < 3 && (
                          <label className="w-24 h-24 rounded-lg bg-white/5 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                            <Upload className="w-6 h-6 text-gray-500 mb-1" />
                            <span className="text-xs text-gray-500">Add Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="glass rounded-xl p-6 bg-green-600/10 border-green-600/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Almost Done!</h3>
                          <p className="text-gray-400">Review your information</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white capitalize">{registrationType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{registrationType === 'service' ? formData.fullName : formData.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white">{formData.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 border-red-600/30">
                      <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">Subscription Fee (30 days)</span>
                        <span className="text-2xl font-bold text-green-500">KES 250</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        You will be redirected to Paystack to complete your payment.
                        Your listing will be activated immediately after payment confirmation.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                        className="mt-1 border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-400">
                        I agree to the{' '}
                        <button type="button" className="text-green-500 hover:text-green-400">Terms of Service</button>
                        {' '}and{' '}
                        <button type="button" className="text-green-500 hover:text-green-400">Privacy Policy</button>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      variant="outline"
                      className="flex-1 py-6 border-gray-700 text-white hover:bg-white/10"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting || (step === 3 && !formData.agreeTerms)}
                    className="flex-1 py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : step === 3 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>Pay KES 250 & Complete</span>
                      </div>
                    ) : (
                      <span>Continue</span>
                    )}
                  </Button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-green-500 hover:text-green-400 font-semibold"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800">
          <div className="h-1 flex">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-green-600" />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
            © 2025 FINDIT. Secure registration powered by Paystack.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;


