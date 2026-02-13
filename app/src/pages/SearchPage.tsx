import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, ArrowLeft, Filter, Star, Navigation, Building2, Wrench, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageSlideshow from '@/components/ImageSlideshow';
import { backgroundImages } from '@/lib/backgroundImages';

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

// Sample service providers data
const sampleServiceProviders = [
  { id: 1, name: 'John Kamau', service: 'Plumber', phone: '+254712345678', rating: 4.8, reviews: 124, distance: '0.5 km', location: 'Nairobi CBD' },
  { id: 2, name: 'Mary Wanjiku', service: 'Electrician', phone: '+254723456789', rating: 4.9, reviews: 89, distance: '1.2 km', location: 'Westlands' },
  { id: 3, name: 'Peter Ochieng', service: 'Carpenter', phone: '+254734567890', rating: 4.7, reviews: 156, distance: '2.1 km', location: 'Kilimani' },
  { id: 4, name: 'Grace Muthoni', service: 'Hairdresser', phone: '+254745678901', rating: 4.9, reviews: 234, distance: '0.8 km', location: 'Ngara' },
  { id: 5, name: 'James Mwangi', service: 'Mechanic', phone: '+254756789012', rating: 4.6, reviews: 78, distance: '3.5 km', location: 'Industrial Area' },
  { id: 6, name: 'Amina Hassan', service: 'Tailor', phone: '+254767890123', rating: 4.8, reviews: 145, distance: '1.5 km', location: 'Eastleigh' },
];

// Sample businesses data
const sampleBusinesses = [
  { id: 1, name: 'Nairobi Auto Spa', type: 'Car Wash', phone: '+254711111111', rating: 4.7, reviews: 89, distance: '0.3 km', location: 'Nairobi CBD', hours: 'Open 24 hours' },
  { id: 2, name: 'Westlands Pharmacy', type: 'Pharmacy', phone: '+254722222222', rating: 4.9, reviews: 234, distance: '1.5 km', location: 'Westlands', hours: 'Open until 10 PM' },
  { id: 3, name: 'Kilimani Supermarket', type: 'Supermarket', phone: '+254733333333', rating: 4.5, reviews: 567, distance: '2.0 km', location: 'Kilimani', hours: 'Open until 9 PM' },
  { id: 4, name: 'Java House Ngara', type: 'Restaurant', phone: '+254744444444', rating: 4.6, reviews: 445, distance: '0.7 km', location: 'Ngara', hours: 'Open until 11 PM' },
  { id: 5, name: 'Eastleigh Hardware', type: 'Hardware Store', phone: '+254755555555', rating: 4.4, reviews: 123, distance: '2.5 km', location: 'Eastleigh', hours: 'Open until 7 PM' },
  { id: 6, name: 'Industrial Garage', type: 'Garage', phone: '+254766666666', rating: 4.8, reviews: 198, distance: '4.0 km', location: 'Industrial Area', hours: 'Open until 6 PM' },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');
  const [serviceSearch, setServiceSearch] = useState('');
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

  // Derive filtered services from search state
  const filteredServices = useMemo(() => {
    if (serviceSearch || selectedServiceCategory) {
      return sampleServiceProviders.filter(provider =>
        provider.service.toLowerCase().includes((serviceSearch || selectedServiceCategory).toLowerCase()) ||
        provider.name.toLowerCase().includes(serviceSearch.toLowerCase())
      );
    }
    return sampleServiceProviders;
  }, [serviceSearch, selectedServiceCategory]);

  // Derive filtered businesses from search state
  const filteredBusinesses = useMemo(() => {
    if (businessSearch || selectedBusinessCategory) {
      return sampleBusinesses.filter(business =>
        business.type.toLowerCase().includes((businessSearch || selectedBusinessCategory).toLowerCase()) ||
        business.name.toLowerCase().includes(businessSearch.toLowerCase())
      );
    }
    return sampleBusinesses;
  }, [businessSearch, selectedBusinessCategory]);

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ImageSlideshow images={backgroundImages} interval={6000} />
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-black/90 border-b border-gray-800 sticky top-0 z-50">
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

              <div className="flex items-center gap-2 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    <span className="text-green-500">FIND</span>IT
                  </h1>
                </div>
              </div>

              {/* User location */}
              <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                {isLocating ? (
                  <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm text-white hidden md:inline">{userLocation}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
              What are you looking for?
            </h2>

            {/* Location Input */}
            <div className="relative mb-6 max-w-xl mx-auto">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Your location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="pl-12 pr-4 py-5 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
              />
              {isLocating && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-spin" />
              )}
            </div>

            {/* Tabs for Services and Businesses */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-800">
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="businesses"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Businesses
                </TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for a service (e.g., Plumber, Electrician...)"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    onFocus={() => setShowServiceCategories(true)}
                    className="pl-12 pr-12 py-5 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500"
                  />
                  {selectedServiceCategory && (
                    <button
                      onClick={clearServiceFilter}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Service Categories Dropdown */}
                {showServiceCategories && (
                  <div className="mt-4 glass rounded-xl p-4 max-h-80 overflow-y-auto max-w-xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Select from 250+ services</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowServiceCategories(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Close
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredServiceCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleServiceCategorySelect(category)}
                          className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-green-600/20 text-gray-300 hover:text-white text-sm transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Category Badge */}
                {selectedServiceCategory && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Badge className="bg-green-600 text-white px-3 py-1">
                      {selectedServiceCategory}
                    </Badge>
                  </div>
                )}
              </TabsContent>

              {/* Businesses Tab */}
              <TabsContent value="businesses" className="mt-6">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for a business (e.g., Restaurant, Pharmacy...)"
                    value={businessSearch}
                    onChange={(e) => setBusinessSearch(e.target.value)}
                    onFocus={() => setShowBusinessCategories(true)}
                    className="pl-12 pr-12 py-5 bg-white/5 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500"
                  />
                  {selectedBusinessCategory && (
                    <button
                      onClick={clearBusinessFilter}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Business Categories Dropdown */}
                {showBusinessCategories && (
                  <div className="mt-4 glass rounded-xl p-4 max-h-80 overflow-y-auto max-w-xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Select from 250+ businesses</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBusinessCategories(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Close
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredBusinessCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleBusinessCategorySelect(category)}
                          className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-red-600/20 text-gray-300 hover:text-white text-sm transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Category Badge */}
                {selectedBusinessCategory && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Badge className="bg-red-600 text-white px-3 py-1">
                      {selectedBusinessCategory}
                    </Badge>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Services Results */}
          {activeTab === 'services' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {filteredServices.length} Service Providers Found
                </h3>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {filteredServices.map((provider) => (
                  <div
                    key={provider.id}
                    className="glass rounded-xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-white">
                            {provider.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white">{provider.name}</h4>
                          <Badge className="bg-green-600/20 text-green-400 border-green-600/30 mt-1">
                            {provider.service}
                          </Badge>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-white">{provider.rating}</span>
                              <span>({provider.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-green-500" />
                              <span>{provider.distance}</span>
                            </div>
                            <div className="hidden md:flex items-center gap-1">
                              <Navigation className="w-4 h-4 text-gray-500" />
                              <span>{provider.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`tel:${provider.phone}`}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
                  <p className="text-gray-400">Try searching with different keywords</p>
                </div>
              )}
            </>
          )}

          {/* Businesses Results */}
          {activeTab === 'businesses' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {filteredBusinesses.length} Businesses Found
                </h3>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {filteredBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="glass rounded-xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white">{business.name}</h4>
                          <Badge className="bg-red-600/20 text-red-400 border-red-600/30 mt-1">
                            {business.type}
                          </Badge>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-white">{business.rating}</span>
                              <span>({business.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span>{business.distance}</span>
                            </div>
                            <div className="hidden md:flex items-center gap-1">
                              <Navigation className="w-4 h-4 text-gray-500" />
                              <span>{business.location}</span>
                            </div>
                          </div>
                          <p className="text-sm text-green-500 mt-1">{business.hours}</p>
                        </div>
                      </div>

                      <a
                        href={`tel:${business.phone}`}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBusinesses.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No businesses found</h3>
                  <p className="text-gray-400">Try searching with different keywords</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-12">
          <div className="h-1 flex">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-green-600" />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            © 2025 FINDIT. Connecting Kenya&apos;s businesses with customers.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SearchPage;
