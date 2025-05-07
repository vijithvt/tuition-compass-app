
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Code, BookOpen, Calendar, FileText, User } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogin, onLogout }: { 
  isLoggedIn: boolean; 
  onLogin: () => void; 
  onLogout: () => void; 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Code className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl text-gray-900">C Programming</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium flex items-center">
              <BookOpen size={18} className="mr-1.5" />
              <span>Curriculum</span>
            </Link>
            <Link to="/schedule" className="text-gray-700 hover:text-primary font-medium flex items-center">
              <Calendar size={18} className="mr-1.5" />
              <span>Schedule</span>
            </Link>
            <Link to="/materials" className="text-gray-700 hover:text-primary font-medium flex items-center">
              <FileText size={18} className="mr-1.5" />
              <span>Materials</span>
            </Link>
            {isLoggedIn && (
              <button 
                onClick={onLogout} 
                className="text-gray-700 hover:text-primary font-medium flex items-center"
              >
                <User size={18} className="mr-1.5" />
                <span>Sign Out</span>
              </button>
            )}
            {!isLoggedIn && (
              <button 
                onClick={onLogin} 
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Tutor Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in border-t">
            <Link 
              to="/" 
              className="flex items-center py-3 text-gray-700 hover:text-primary font-medium"
              onClick={toggleMobileMenu}
            >
              <BookOpen size={18} className="mr-3" />
              <span>Curriculum</span>
            </Link>
            <Link 
              to="/schedule" 
              className="flex items-center py-3 text-gray-700 hover:text-primary font-medium"
              onClick={toggleMobileMenu}
            >
              <Calendar size={18} className="mr-3" />
              <span>Schedule</span>
            </Link>
            <Link 
              to="/materials" 
              className="flex items-center py-3 text-gray-700 hover:text-primary font-medium"
              onClick={toggleMobileMenu}
            >
              <FileText size={18} className="mr-3" />
              <span>Materials</span>
            </Link>
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  onLogout();
                  toggleMobileMenu();
                }}
                className="flex items-center w-full text-left py-3 text-gray-700 hover:text-primary font-medium"
              >
                <User size={18} className="mr-3" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  onLogin();
                  toggleMobileMenu();
                }}
                className="mt-3 w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors"
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
