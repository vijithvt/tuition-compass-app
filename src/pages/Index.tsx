
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ModuleAccordion from '../components/modules/ModuleAccordion';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import LoginForm from '../components/auth/LoginForm';
import { moduleData } from '../data/moduleData';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface IndexProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Index: React.FC<IndexProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const [modules, setModules] = useState(moduleData);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleUpdateLesson = (moduleId: string, lessonId: string, updates: any) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, ...updates };
          }
          return lesson;
        });
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    
    setModules(updatedModules);
  };
  
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
        <h1 className="text-3xl font-bold mb-6">C Programming Class Tracker</h1>
        
        <ProgressSummary modules={modules} />
        
        <h2 className="text-2xl font-bold mb-4">Course Modules</h2>
        <ModuleAccordion 
          modules={modules} 
          isEditable={isLoggedIn}
          onUpdateLesson={handleUpdateLesson}
        />
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

export default Index;
