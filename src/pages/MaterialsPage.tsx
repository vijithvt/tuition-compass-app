
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import MaterialsPanel from '../components/materials/MaterialsPanel';
import LoginForm from '../components/auth/LoginForm';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface MaterialsPageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const MaterialsPage: React.FC<MaterialsPageProps> = ({ isLoggedIn, onLogin, onLogout }) => {
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
        <h1 className="text-3xl font-bold mb-6">Study Materials</h1>
        
        <MaterialsPanel isEditable={isLoggedIn} />
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Materials Guide</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How to Use These Materials:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Review materials before and after each class</li>
                <li>Complete all practice exercises</li>
                <li>Code along with the provided examples</li>
                <li>Use the reference guides while working on assignments</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Recommended Study Approach:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Read the theory materials first</li>
                <li>Try to understand the example code without running it</li>
                <li>Implement the examples yourself</li>
                <li>Complete the practice exercises</li>
                <li>Review challenging concepts again</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <LoginForm 
            onLoginSuccess={handleLoginSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialsPage;
