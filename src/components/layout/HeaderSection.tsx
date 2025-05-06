
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClassSession } from '@/types';
import { Menu } from 'lucide-react';

interface HeaderSectionProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  nextClass: ClassSession | null;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  isLoggedIn, 
  onLoginClick, 
  onLogout, 
  nextClass 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const getNextClassText = () => {
    if (!nextClass) return "";
    
    const classDate = new Date(`${nextClass.date}T${nextClass.start_time}`);
    const now = new Date();
    const diffInHours = Math.floor((classDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Next class in ${diffInHours} hours`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `Next class in ${days} days`;
    }
  };

  return (
    <header className="bg-white border-b shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">C Programming Course</h1>
            <p className="text-xs sm:text-sm text-gray-600">KTU B.Tech 2024 Scheme</p>
          </div>
          
          <div className="flex items-center">
            {nextClass && (
              <div className="hidden md:flex items-center border border-orange-200 bg-orange-50 px-3 py-1 rounded-lg mr-4">
                <span className="text-sm font-medium text-orange-700">
                  {getNextClassText()}
                </span>
              </div>
            )}
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="#modules" className="text-gray-700 hover:text-primary px-3">Modules</a>
              <a href="#classes" className="text-gray-700 hover:text-primary px-3">Classes</a>
              <a href="#materials" className="text-gray-700 hover:text-primary px-3">Materials</a>
            </div>
            
            {isLoggedIn ? (
              <Button 
                variant="outline"
                onClick={onLogout}
                className="ml-4"
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={onLoginClick}
                className="ml-4"
              >
                Tutor Login
              </Button>
            )}
            
            {/* Mobile menu button */}
            <button
              className="ml-4 p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {nextClass && (
                <div className="border border-orange-200 bg-orange-50 px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-orange-700">
                    {getNextClassText()}
                  </span>
                </div>
              )}
              <a href="#modules" className="text-gray-700 hover:text-primary py-1">Modules</a>
              <a href="#classes" className="text-gray-700 hover:text-primary py-1">Classes</a>
              <a href="#materials" className="text-gray-700 hover:text-primary py-1">Materials</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderSection;
