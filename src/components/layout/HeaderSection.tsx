
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClassSession } from '@/types';
import { Menu, Calendar, Bell } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';

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
    if (!nextClass) return null;
    
    const classDate = new Date(`${nextClass.date}T${nextClass.start_time}`);
    const now = new Date();
    
    let dateText = '';
    if (isToday(classDate)) {
      dateText = 'Today';
    } else if (isTomorrow(classDate)) {
      dateText = 'Tomorrow';
    } else {
      dateText = format(classDate, 'EEE, MMM d');
    }
    
    return (
      <span>
        <span className="font-medium">{dateText}</span> at {format(classDate, 'h:mm a')} 
        ({nextClass.mode === 'online' ? 'Online' : 'Offline'})
      </span>
    );
  };

  return (
    <header className="bg-white border-b shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        {nextClass && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex items-center text-blue-800">
            <Bell size={18} className="mr-2 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium">Next Class:</span> {getNextClassText()}
              {nextClass.mode === 'online' && nextClass.meet_link && (
                <a 
                  href={nextClass.meet_link} 
                  className="ml-2 text-primary hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Join Link
                </a>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">C Programming Course</h1>
            <p className="text-xs sm:text-sm text-gray-600">For KTU B.Tech 2024 Scheme</p>
          </div>
          
          <div className="flex items-center">
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
