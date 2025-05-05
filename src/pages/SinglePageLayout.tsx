
import React, { useState, useEffect } from 'react';
import { moduleData } from '../data/moduleData';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { QuoteCard } from '@/components/dashboard/QuoteCard';
import { ClassSession } from '@/types';
import { TooltipProvider } from "@/components/ui/tooltip";

// Imported components
import LoginForm from '../components/auth/LoginForm';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import ClassSchedule from '../components/schedule/ClassSchedule';
import MaterialsPanel from '../components/materials/MaterialsPanel';
import HeaderSection from '../components/layout/HeaderSection';
import FooterSection from '../components/layout/FooterSection';
import CourseInfoSection from '../components/dashboard/CourseInfoSection';
import ModulesSection from '../components/dashboard/ModulesSection';

interface SinglePageLayoutProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const examDate = new Date('2025-05-19T09:00:00');

const SinglePageLayout: React.FC<SinglePageLayoutProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const [modules] = useState(moduleData);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [nextClass, setNextClass] = useState<ClassSession | null>(null);
  
  useEffect(() => {
    fetchClasses();
  }, []);
  
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      // Cast the mode to the correct type
      const typedData = data?.map(item => ({
        ...item,
        mode: (item.mode === 'offline' ? 'offline' : 'online') as 'online' | 'offline'
      })) || [];

      setClasses(typedData);
      
      // Find the next upcoming class
      const now = new Date();
      const upcoming = typedData.find(cls => {
        const classDate = new Date(`${cls.date}T${cls.start_time}`);
        return classDate > now;
      });
      
      setNextClass(upcoming || null);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };
  
  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
  };
  
  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false);
    onLogin();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <HeaderSection 
          isLoggedIn={isLoggedIn} 
          onLoginClick={handleLoginClick} 
          onLogout={onLogout}
          nextClass={nextClass}
        />
        
        <div className="container mx-auto px-4 py-8">
          {/* Course Info Section */}
          <CourseInfoSection examDate={examDate} nextClass={nextClass} />
          
          {/* Motivational Quote */}
          <QuoteCard rotateQuotes={true} rotationInterval={10000} />
          
          {/* Progress Summary */}
          <section id="progress" className="mb-12">
            <ProgressSummary modules={modules} classes={classes} />
          </section>
          
          {/* Class Schedule (Only full version for logged in users) */}
          {isLoggedIn && (
            <ClassSchedule 
              isEditable={isLoggedIn} 
              onClassesUpdate={fetchClasses}
              displayMode="full"
            />
          )}
          
          {/* Modules Section */}
          <ModulesSection modules={modules} isLoggedIn={isLoggedIn} />
          
          {/* Materials Section */}
          <MaterialsPanel isEditable={isLoggedIn} />
        </div>

        <FooterSection />

        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent className="sm:max-w-md p-0">
            <LoginForm 
              onLogin={handleLoginSuccess} 
              onCancel={() => setIsLoginDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default SinglePageLayout;
