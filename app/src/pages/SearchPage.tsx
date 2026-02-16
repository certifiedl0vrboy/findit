import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Phone, ArrowLeft, Filter, Navigation, Building2, Wrench, Loader2, X, Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageSlideshow from '@/components/ImageSlideshow';
import { backgroundImages } from '@/lib/backgroundImages';
import { supabase } from '@/lib/supabase';

// Service categories (250 services)
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
];

// Business categories (250 businesses)
const businessCategories = [
  'Restaurant', 'Cafe', 'Fast Food', 'Hotel', 'Motel', 'Guest House', 'Lodging',
  'Supermarket', 'Grocery Store', 'Convenience Store', 'Kiosk', 'Retail Shop',
  'Boutique', 'Clothing Store', 'Shoe Store', 'Jewelry Store', 'Electronics Shop',
  'Phone Shop', 'Computer Shop', 'Furniture Store', 'Hardware Store', 'Building Materials',
  'Pharmacy', 'Chemist', 'Medical Clinic', 'Hospital', 'Dental Clinic', 'Optician',
  'Bookstore', 'Stationery Shop', 'Printing Press', 'Cyber Cafe', 'Internet Cafe',
  'Car Dealership', 'Car Parts Shop', 'Garage', 'Auto Repair Shop', 'Car Wash',
  'Gas Station', 'Petrol Station', 'Service Station', 'Parking Lot',
  'Beauty Salon', 'Barbershop', 'Spa', 'Massage Parlor', 'Nail Salon', 'Tattoo Parlor',
  'Gym', 'Fitness Center', 'Sports Club', 'Swimming Pool', 'Stadium',
  'School', 'College', 'University', 'Training Center', 'Driving School', 'Language School',
  'Bank', 'Microfinance', 'SACCO', 'Insurance Company', 'Investment Firm',
  'Real Estate Agency', 'Property Management', 'Construction Company', 'Architecture Firm',
  'Law Firm', 'Legal Services', 'Accounting Firm', 'Audit Firm', 'Consulting Firm',
  'IT Company', 'Software Company', 'Web Design Agency', 'Digital Marketing Agency',
  'Transport Company', 'Logistics Company', 'Courier Service', 'Delivery Service',
  'Tour Company', 'Travel Agency', 'Safari Operator', 'Hotel Booking', 'Car Rental',
  'Event Planning', 'Wedding Planning', 'Catering Service', 'Decoration Services',
  'Photography Studio', 'Video Production', 'Media Company', 'Advertising Agency',
  'Manufacturing', 'Factory', 'Processing Plant', 'Assembly Plant', 'Workshop',
  'Warehouse', 'Storage Facility', 'Cold Storage', 'Distribution Center',
  'Farm', 'Dairy Farm', 'Poultry Farm', 'Fish Farm', 'Greenhouse', 'Nursery',
  'Butchery', 'Meat Shop', 'Fish Market', 'Vegetable Market', 'Fruit Shop',
  'Bakery', 'Cake Shop', 'Pastry Shop', 'Ice Cream Parlor', 'Juice Bar',
  'Liquor Store', 'Wine Shop', 'Bar', 'Pub', 'Nightclub', 'Lounge',
  'Laundry', 'Dry Cleaner', 'Cleaning Services', 'Fumigation Services', 'Waste Management',
  'Security Company', 'Guard Services', 'Alarm Company', 'CCTV Installation',
  'Solar Company', 'Electrical Supplies', 'Plumbing Supplies', 'Hardware Store',
  'Paint Shop', 'Tile Shop', 'Flooring Store', 'Roofing Materials', 'Glass Shop',
  'Carpentry Shop', 'Woodworking', 'Furniture Workshop', 'Upholstery Shop',
  'Tailoring Shop', 'Embroidery', 'Screen Printing', 'Branding Services',
  'Daycare', 'Kindergarten', 'Primary School', 'Secondary School', 'Tuition Center',
  'Hospital', 'Clinic', 'Laboratory', 'Diagnostic Center', 'Pharmacy', 'Medical Supplies',
  'Veterinary Clinic', 'Pet Shop', 'Pet Grooming', 'Animal Feed Store',
  'Florist', 'Flower Shop', 'Garden Center', 'Plant Nursery', 'Landscaping Services',
  'Funeral Home', 'Mortuary', 'Cemetery Services', 'Cremation Services',
  'Church', 'Mosque', 'Temple', 'Religious Center', 'Community Center',
  'Cooperative', 'Farmers Market', 'Trading Center', 'Shopping Mall', 'Plaza',
  'Casino', 'Betting Shop', 'Lottery Shop', 'Gaming Center', 'Arcade',
  'Art Gallery', 'Museum', 'Cultural Center', 'Theater', 'Cinema', 'Concert Hall',
  'Library', 'Community Library', 'Mobile Library', 'Resource Center',
  'Radio Station', 'TV Station', 'Newspaper Office', 'Magazine Publisher',
  'Recycling Center', 'Scrap Yard', 'Junkyard', 'Second Hand Shop', 'Thrift Store',
  'Pawn Shop', 'Money Lender', 'Forex Bureau', 'Mobile Money Agent', 'ATM Services',
  'Courier Office', 'Post Office', 'Shipping Company', 'Freight Forwarder',
  'Employment Agency', 'Recruitment Firm', 'Manpower Services', 'Labor Supply',
  'Translation Office', 'Interpreter Services', 'Notary Public', 'Commissioner of Oaths',
  'Auction House', 'Estate Sale', 'Liquidation Services', 'Business Broker',
  'Franchise', 'Dealership', 'Distributor', 'Wholesaler', 'Importer', 'Exporter',
  'Mining Company', 'Quarry', 'Oil Company', 'Energy Company', 'Power Supplier',
  'Water Company', 'Sewage Services', 'Garbage Collection', 'Street Cleaning',
  'Road Construction', 'Bridge Construction', 'Building Contractor', 'Civil Engineering',
  'Interior Design Studio', 'Home Staging', 'Property Styling', 'Renovation Services',
  'Moving Company', 'Relocation Services', 'Storage Services', 'Packing Services',
  'Towing Service', 'Breakdown Service', 'Roadside Assistance', 'Emergency Services',
  'Fire Station', 'Police Station', 'Ambulance Service', 'Rescue Services',
  'NGO Office', 'Charity Organization', 'Community Organization', 'Social Services',
  'Embassy', 'Consulate', 'Government Office', 'Public Service', 'Municipal Office',
  'Court', 'Legal Aid', 'Probation Office', 'Correctional Facility',
  'Research Institute', 'Think Tank', 'Policy Center', 'Development Organization',
  'Tech Hub', 'Innovation Center', 'Startup Incubator', 'Co-working Space',
  'Call Center', 'BPO Office', 'Customer Support Center', 'Telemarketing Office',
  'Data Center', 'Server Farm', 'Cloud Services', 'Hosting Provider',
  'Cybersecurity Firm', 'IT Security', 'Network Security', 'Data Protection',
  'Drone Company', 'Aerial Photography', 'Surveying Company', 'Mapping Services',
  '3D Printing Service', 'Prototyping', 'Manufacturing Services', 'Fabrication',
  'Welding Shop', 'Metal Works', 'Iron Works', 'Steel Fabrication', 'Aluminum Works',
  'Plastic Factory', 'Rubber Products', 'Packaging Company', 'Label Printing',
  'Textile Mill', 'Garment Factory', 'Shoe Factory', 'Leather Goods', 'Bag Factory',
  'Food Processing', 'Beverage Company', 'Dairy Processing', 'Meat Processing',
  'Bottling Company', 'Canning Factory', 'Packaged Foods', 'Snack Factory',
  'Cosmetics Factory', 'Soap Factory', 'Detergent Factory', 'Chemical Products',
  'Pharmaceutical Company', 'Drug Manufacturer', 'Medical Equipment', 'Health Products',
  'Fertilizer Company', 'Agrochemicals', 'Seeds Company', 'Farm Inputs',
  'Construction Equipment', 'Heavy Machinery', 'Tools Shop', 'Equipment Rental',
  'Generator Sales', 'Solar Equipment', 'Inverter Sales', 'Battery Shop',
  'Air Conditioner Shop', 'Fridge Shop', 'Appliance Store', 'Electronics Store',
  'Bike Shop', 'Motorcycle Shop', 'Spare Parts', 'Accessories Shop', 'Tire Shop',
  'Fishing Supplies', 'Hunting Shop', 'Outdoor Gear', 'Sports Shop', 'Fitness Equipment',
  'Toy Shop', 'Baby Shop', 'Maternity Store', 'Kids Store', 'Children Products',
  'Gift Shop', 'Souvenir Shop', 'Craft Shop', 'Handicrafts', 'Art Supplies',
  'Musical Instruments', 'Music Store', 'Instrument Repair', 'Recording Studio',
  'Dance Studio', 'Yoga Studio', 'Meditation Center', 'Wellness Center', 'Health Spa',
  'Sauna', 'Steam Room', 'Jacuzzi', 'Hot Tub', 'Pool Services', 'Pool Supplies',
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeTab, setActiveTab] = useState('services');
  const [serviceSearch, setServiceSearch] = useState(categoryParam || '');
  const [businessSearch, setBusinessSearch] = useState('');
  const [locationQuery, setLocationQuery] = useState(() => {
    const stored = localStorage.getItem('userLocation');
    return stored || '';
  });
  const [showServiceCategories, setShowServiceCategories] = useState(false);
  const [showBusinessCategories, setShowBusinessCategories] = useState(false);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('');
  const [userLocation, setUserLocation] = useState<string>(() => {
    const stored = localStorage.getItem('userLocation');
    if (stored) return stored;
    if (!('geolocation' in navigator)) return 'Kenya';
    return 'Detecting location...';
  });
  const [isLocating, setIsLocating] = useState(() => {
    return !localStorage.getItem('userLocation') && 'geolocation' in navigator;
  });

  // Auto-detect location on page load
  useEffect(() => {
    // Check if location was stored from landing page
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      return;
    }

    if (!('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

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
            setLocationQuery(displayLocation);
            localStorage.setItem('userLocation', displayLocation);
            localStorage.setItem('userCoords', JSON.stringify({ lat: latitude, lng: longitude }));
          } else {
            setUserLocation('Kenya');
            setLocationQuery('Kenya');
          }
        } catch {
          setUserLocation('Kenya');
          setLocationQuery('Kenya');
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setUserLocation('Kenya');
        setLocationQuery('Kenya');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const [providers, setProviders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch real providers from Supabase
  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingData(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, business_name, category, phone, location, user_type, avatar_url, description, rating, reviews_count, business_hours')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching providers:', error);
        } else {
          setProviders(data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
      setLoadingData(false);
    };
    fetchProviders();
  }, []);

  // Split providers by user_type
  const serviceProviders = useMemo(() => providers.filter(p => p.user_type === 'service'), [providers]);
  const businesses = useMemo(() => providers.filter(p => p.user_type === 'business'), [providers]);

  // Derive filtered services from search state
  const filteredServices = useMemo(() => {
    if (serviceSearch || selectedServiceCategory) {
      const query = (serviceSearch || selectedServiceCategory).toLowerCase();
      return serviceProviders.filter(p =>
        (p.category || '').toLowerCase().includes(query) ||
        (p.full_name || '').toLowerCase().includes(serviceSearch.toLowerCase())
      );
    }
    return serviceProviders;
  }, [serviceSearch, selectedServiceCategory, serviceProviders]);

  // Derive filtered businesses from search state
  const filteredBusinesses = useMemo(() => {
    if (businessSearch || selectedBusinessCategory) {
      const query = (businessSearch || selectedBusinessCategory).toLowerCase();
      return businesses.filter(b =>
        (b.category || '').toLowerCase().includes(query) ||
        (b.business_name || '').toLowerCase().includes(businessSearch.toLowerCase())
      );
    }
    return businesses;
  }, [businessSearch, selectedBusinessCategory, businesses]);

  const handleServiceCategorySelect = (category: string) => {
    setSelectedServiceCategory(category);
    setServiceSearch(category);
    setShowServiceCategories(false);
  };

  const handleBusinessCategorySelect = (category: string) => {
    setSelectedBusinessCategory(category);
    setBusinessSearch(category);
    setShowBusinessCategories(false);
  };

  const clearServiceFilter = () => {
    setSelectedServiceCategory('');
    setServiceSearch('');
  };

  const clearBusinessFilter = () => {
    setSelectedBusinessCategory('');
    setBusinessSearch('');
  };

  const filteredServiceCategories = serviceCategories.filter(cat =>
    cat.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredBusinessCategories = businessCategories.filter(cat =>
    cat.toLowerCase().includes(businessSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-alabaster font-sans text-[#333333] relative selection:bg-champagne/30 leading-[1.7]">
      <ImageSlideshow images={backgroundImages} interval={6000} />

      {/* Overlay to ensure text readability on background */}
      <div className="fixed inset-0 bg-alabaster/95 z-0 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Glassmorphism */}
        <header className="sticky top-0 z-50 bg-alabaster/80 border-b border-black/5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/landing')}
                  className="text-[#333333] hover:bg-black/5 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-black flex items-center justify-center shadow-lg shadow-forest-black/20">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-serif font-semibold text-soft-black tracking-tight">
                    FIND<span className="text-forest-black">IT</span>
                  </h1>
                </div>
              </div>

              {/* User location pill */}
              <div className="flex items-center gap-2 bg-white/50 border border-black/5 shadow-sm rounded-full px-4 py-2 backdrop-blur-md">
                {isLocating ? (
                  <Loader2 className="w-4 h-4 text-forest-black animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 text-forest-black" />
                )}
                <span className="text-sm font-medium text-[#333333] hidden md:inline font-sans">{userLocation}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Search & Hero Section */}
        <div className="pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#1A1A1A] mb-4 tracking-[-0.02em]">
              Discover Excellence
            </h2>
            <p className="text-forest-black/70 font-bold tracking-[0.15em] uppercase text-xs font-serif">
              Connect with Kenya's Finest Professionals
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Location Input Floating */}
            <div className="relative group max-w-lg mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-forest-black/10 to-champagne/10 rounded-full blur transition-all opacity-40 group-hover:opacity-70" />
              <div className="relative flex items-center bg-white rounded-full shadow-lg shadow-black/5 border border-black/5 p-1">
                <div className="pl-4 pr-2 text-mocha/60">
                  <MapPin className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Your Location..."
                  className="border-none shadow-none focus-visible:ring-0 bg-transparent text-[#333333] placeholder:text-mocha/40 h-12 text-base font-sans"
                />
                {isLocating && (
                  <div className="pr-4">
                    <Loader2 className="w-4 h-4 text-forest-black animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white/50 p-1 border border-black/5 rounded-full shadow-sm mx-auto w-fit mb-8">
                <TabsTrigger
                  value="services"
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-forest-black data-[state=active]:text-white transition-all duration-300 font-medium font-sans text-mocha"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="businesses"
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-forest-black data-[state=active]:text-white transition-all duration-300 font-medium font-sans text-mocha"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Businesses
                </TabsTrigger>
              </TabsList>

              {/* Services Content */}
              <TabsContent value="services" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-forest-black/5 to-transparent rounded-2xl blur-xl opacity-50" />
                  <div className="relative bg-white rounded-2xl shadow-lg shadow-black/5 border border-black/5 p-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-mocha/40 ml-4 shrink-0" />
                    <Input
                      placeholder="Search for a service (e.g., Plumber...)"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      onFocus={() => setShowServiceCategories(true)}
                      className="border-none shadow-none focus-visible:ring-0 bg-transparent text-lg h-12 text-[#333333] placeholder:text-mocha/40 font-sans"
                    />
                    {selectedServiceCategory && (
                      <button onClick={clearServiceFilter} className="p-2 hover:bg-gray-100 rounded-full text-mocha/60">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  {showServiceCategories && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 flex justify-between items-center border-b border-black/5 mb-2">
                        <span className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] pl-2 font-serif">Categories</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowServiceCategories(false)} className="h-6 text-xs text-mocha hover:text-forest-black font-sans">Close</Button>
                      </div>
                      <div className="max-h-60 overflow-y-auto grid grid-cols-2 gap-1 p-1">
                        {filteredServiceCategories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => handleServiceCategorySelect(cat)}
                            className="text-left px-4 py-2.5 rounded-xl hover:bg-black/5 text-sm text-[#333333] hover:text-forest-black transition-colors font-sans"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedServiceCategory && (
                  <div className="flex justify-center">
                    <Badge className="bg-forest-black text-white px-4 py-1.5 text-sm font-medium rounded-full shadow-lg shadow-forest-black/20 font-sans">
                      {selectedServiceCategory}
                    </Badge>
                  </div>
                )}
              </TabsContent>

              {/* Businesses Content */}
              <TabsContent value="businesses" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-forest-black/5 to-transparent rounded-2xl blur-xl opacity-50" />
                  <div className="relative bg-white rounded-2xl shadow-lg shadow-black/5 border border-black/5 p-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-mocha/40 ml-4 shrink-0" />
                    <Input
                      placeholder="Search for a business (e.g., Cafe...)"
                      value={businessSearch}
                      onChange={(e) => setBusinessSearch(e.target.value)}
                      onFocus={() => setShowBusinessCategories(true)}
                      className="border-none shadow-none focus-visible:ring-0 bg-transparent text-lg h-12 text-[#333333] placeholder:text-mocha/40 font-sans"
                    />
                    {selectedBusinessCategory && (
                      <button onClick={clearBusinessFilter} className="p-2 hover:bg-gray-100 rounded-full text-mocha/60">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  {showBusinessCategories && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 flex justify-between items-center border-b border-black/5 mb-2">
                        <span className="text-xs font-bold text-forest-black uppercase tracking-[0.15em] pl-2 font-serif">Categories</span>
                        <Button variant="ghost" size="sm" onClick={() => setShowBusinessCategories(false)} className="h-6 text-xs text-mocha hover:text-forest-black font-sans">Close</Button>
                      </div>
                      <div className="max-h-60 overflow-y-auto grid grid-cols-2 gap-1 p-1">
                        {filteredBusinessCategories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => handleBusinessCategorySelect(cat)}
                            className="text-left px-4 py-2.5 rounded-xl hover:bg-black/5 text-sm text-[#333333] hover:text-forest-black transition-colors font-sans"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedBusinessCategory && (
                  <div className="flex justify-center">
                    <Badge className="bg-forest-black text-white px-4 py-1.5 text-sm font-medium rounded-full shadow-lg shadow-forest-black/20 font-sans">
                      {selectedBusinessCategory}
                    </Badge>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Results Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20 w-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
              {activeTab === 'services' ? `${filteredServices.length} Professionals` : `${filteredBusinesses.length} Businesses`} Found
            </h3>
            <Button variant="outline" className="rounded-full border-black/10 text-[#333333] hover:bg-black/5 hover:text-forest-black font-sans font-bold">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingData ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-forest-black" />
              </div>
            ) : activeTab === 'services' ? (
              filteredServices.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => navigate(`/profile/${provider.id}`)}
                  className="group bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-alabaster flex items-center justify-center text-xl font-bold text-forest-black shrink-0 border border-black/5 group-hover:bg-forest-black group-hover:text-white transition-colors duration-300 overflow-hidden">
                      {provider.avatar_url ? (
                        <img
                          src={provider.avatar_url}
                          alt={provider.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (provider.full_name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2)
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-[#1A1A1A] leading-tight group-hover:text-forest-black transition-colors">{provider.full_name || 'Service Provider'}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-mocha/70 font-sans">{provider.category || 'General'}</p>
                        <div className="flex items-center gap-1 bg-forest-black/5 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-champagne fill-champagne" />
                          <span className="text-[10px] font-bold text-forest-black">{provider.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 font-sans">
                    <div className="flex items-center gap-2 text-sm text-[#333333]/70">
                      <MapPin className="w-4 h-4 text-mocha/40" />
                      {provider.location || 'Nairobi, Kenya'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#333333]/70">
                      <Star className="w-4 h-4 text-mocha/30" />
                      <span>{provider.reviews_count || 0} reviews</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${provider.phone}`}
                    className="w-full relative z-10 block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button className="w-full rounded-xl bg-alabaster text-[#333333] hover:bg-forest-black hover:text-white font-bold py-6 transition-all duration-300 shadow-none hover:shadow-lg font-sans">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </a>
                </div>
              ))
            ) : (
              filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  onClick={() => navigate(`/profile/${business.id}`)}
                  className="group bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-alabaster flex items-center justify-center text-xl font-bold text-forest-black shrink-0 border border-black/5 group-hover:bg-forest-black group-hover:text-white transition-colors duration-300 overflow-hidden">
                      {business.avatar_url ? (
                        <img
                          src={business.avatar_url}
                          alt={business.business_name || business.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-[#1A1A1A] leading-tight group-hover:text-forest-black transition-colors">{business.business_name || business.full_name || 'Business'}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-mocha/70 font-sans">{business.category || 'General'}</p>
                        <div className="flex items-center gap-1 bg-forest-black/5 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-champagne fill-champagne" />
                          <span className="text-[10px] font-bold text-forest-black">{business.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 font-sans">
                    <div className="flex items-center gap-2 text-sm text-[#333333]/70">
                      <MapPin className="w-4 h-4 text-mocha/40" />
                      {business.location || 'Nairobi, Kenya'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#333333]/70">
                      <Clock className="w-4 h-4 text-mocha/40" />
                      {business.business_hours || '8:00 AM - 6:00 PM'}
                    </div>
                  </div>

                  <a
                    href={`tel:${business.phone}`}
                    className="w-full relative z-10 block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button className="w-full rounded-xl bg-alabaster text-[#333333] hover:bg-forest-black hover:text-white font-bold py-6 transition-all duration-300 shadow-none hover:shadow-lg hover:shadow-forest-black/20 font-sans">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                </div>
              ))
            )}

            {((activeTab === 'services' && filteredServices.length === 0) || (activeTab === 'businesses' && filteredBusinesses.length === 0)) && (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 rounded-full bg-alabaster flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-mocha/40" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-2">No results found</h3>
                <p className="text-mocha/60 font-sans">Try adjusting your search or location settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
