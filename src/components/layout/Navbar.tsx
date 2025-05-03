
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogin, onLogout }: { 
  isLoggedIn: boolean; 
  onLogin: () => void; 
  onLogout: () => void; 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-bold text-xl text-gray-900">C Programming Tracker</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
            <Link to="/schedule" className="text-gray-700 hover:text-primary font-medium">Schedule</Link>
            <Link to="/materials" className="text-gray-700 hover:text-primary font-medium">Materials</Link>
            {isLoggedIn && (
              <button 
                onClick={onLogout} 
                className="text-gray-700 hover:text-primary font-medium"
              >
                Sign Out
              </button>
            )}
            {!isLoggedIn && (
              <button 
                onClick={onLogin} 
                className="text-gray-700 hover:text-primary font-medium"
              >
                Tutor Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary font-medium">Dashboard</Link>
            <Link to="/schedule" className="block py-2 text-gray-700 hover:text-primary font-medium">Schedule</Link>
            <Link to="/materials" className="block py-2 text-gray-700 hover:text-primary font-medium">Materials</Link>
            {isLoggedIn && (
              <button 
                onClick={onLogout} 
                className="block w-full text-left py-2 text-gray-700 hover:text-primary font-medium"
              >
                Sign Out
              </button>
            )}
            {!isLoggedIn && (
              <button 
                onClick={onLogin} 
                className="block w-full text-left py-2 text-gray-700 hover:text-primary font-medium"
              >
                Tutor Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
