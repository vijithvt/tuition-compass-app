
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ClassSchedule from '../components/schedule/ClassSchedule';
import LoginForm from '../components/auth/LoginForm';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface SchedulePageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
  };
  
  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isLoggedIn={isLoggedIn}
        onLogin={handleLoginClick}
        onLogout={onLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Class Schedule</h1>
        
        <ClassSchedule isEditable={isLoggedIn} />
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Online Class Information</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Meet Link:</h3>
            <div className="flex items-center">
              <a 
                href="https://meet.google.com/qdt-ught-pbf" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://meet.google.com/qdt-ught-pbf
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Joining Instructions:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Join the meeting 5 minutes before the scheduled time</li>
              <li>Ensure your microphone and camera are working properly</li>
              <li>Have your notes and materials ready</li>
              <li>Use headphones if possible for better audio quality</li>
            </ul>
          </div>
        </div>
      </main>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <LoginForm 
            onLogin={handleLoginSuccess} 
            onCancel={() => setIsLoginDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePage;
