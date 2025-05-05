
import React from 'react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-2">C Programming Course</h3>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">&copy; {currentYear} Vijith V T, Technical Trainer & AI Specialist</p>
            <p className="text-sm text-gray-500 mt-1">All rights reserved.</p>
          </div>
          
          <div className="text-center md:text-right">
            <div className="space-x-4">
              <a href="#modules" className="text-gray-700 hover:text-primary">Modules</a>
              <a href="#schedule" className="text-gray-700 hover:text-primary">Schedule</a>
              <a href="#materials" className="text-gray-700 hover:text-primary">Materials</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
