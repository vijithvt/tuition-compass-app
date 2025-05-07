
import React from 'react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between text-center">
          <p className="text-gray-600 w-full md:w-auto">
            &copy; {currentYear} Vijith V T, Technical Trainer & AI Specialist. All rights reserved.
          </p>
          <div className="hidden md:flex space-x-4">
            <a href="#modules" className="text-gray-700 hover:text-primary">Modules</a>
            <a href="#schedule" className="text-gray-700 hover:text-primary">Schedule</a>
            <a href="#materials" className="text-gray-700 hover:text-primary">Materials</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
