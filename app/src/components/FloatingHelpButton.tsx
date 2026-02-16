import { useState } from 'react';
import { HelpCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingHelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Help Modal/Tooltip */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-2 w-72 animate-in fade-in slide-in-from-bottom-5 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-gray-900">Need Help?</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Our support team is here to assist you with any questions or issues.
                    </p>

                    <Button
                        asChild
                        className="w-full bg-kenyan-red hover:bg-red-700 text-white rounded-full flex items-center justify-center gap-2"
                    >
                        <a href="tel:+254117223644">
                            <Phone className="w-4 h-4" />
                            <span>0117 223 644</span>
                        </a>
                    </Button>

                    <div className="mt-3 text-center">
                        <span className="text-xs text-gray-400">Available 8am - 5pm</span>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-kenyan-red hover:bg-red-700 text-white shadow-lg shadow-red-900/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
                {isOpen ? (
                    <X className="w-7 h-7" />
                ) : (
                    <HelpCircle className="w-7 h-7" />
                )}
            </button>
        </div>
    );
};

export default FloatingHelpButton;
