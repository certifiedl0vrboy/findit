import { Home, Search, Heart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Home', path: '/landing' },
        { icon: Search, label: 'Search', path: '/search' },
        { icon: Heart, label: 'Saved', path: '/saved' },
        { icon: User, label: 'Profile', path: '/dashboard' },
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <div className="bg-white rounded-full shadow-xl border border-gray-100 p-2 flex justify-between items-center px-6">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive(item.path) ? 'text-kenyan-red' : 'text-bolt-gray'
                            }`}
                    >
                        <item.icon
                            className={`w-6 h-6 ${isActive(item.path) ? 'fill-current' : ''}`}
                            strokeWidth={isActive(item.path) ? 0 : 2.5}
                        />
                        {/* <span className="text-[10px] font-bold">{item.label}</span> */}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
