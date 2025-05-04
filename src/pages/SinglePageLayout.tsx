import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModuleAccordion from '../components/modules/ModuleAccordion';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import ClassSchedule from '../components/schedule/ClassSchedule';
import MaterialsPanel from '../components/materials/MaterialsPanel';
import LoginForm from '../components/auth/LoginForm';
import { moduleData } from '../data/moduleData';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { QuoteCard } from '@/components/dashboard/QuoteCard';
import ExamCountdown from '../components/dashboard/ExamCountdown';
import { ClassSession } from '@/types';
import { TooltipProvider } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm py-4 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-primary">C Programming Course</h1>
                <p className="text-sm text-gray-600">KTU B.Tech 2024 Scheme</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {nextClass && (
                  <div className="hidden md:flex items-center border border-orange-200 bg-orange-50 px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-orange-700">
                      {getNextClassText()}
                    </span>
                  </div>
                )}
                
                <div className="hidden md:block">
                  <a href="#modules" className="text-gray-700 hover:text-primary px-3">Modules</a>
                  <a href="#schedule" className="text-gray-700 hover:text-primary px-3">Schedule</a>
                  <a href="#materials" className="text-gray-700 hover:text-primary px-3">Materials</a>
                </div>
                
                {isLoggedIn ? (
                  <Button 
                    variant="outline"
                    onClick={onLogout}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button 
                    onClick={handleLoginClick}
                  >
                    Tutor Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          {/* Exam countdown and course info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Course Info Card */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h2 className="text-xl font-bold mb-4">Course Details</h2>
                <div>
                  <p className="text-gray-600"><span className="font-medium">Tutor:</span> Vijith V T</p>
                  <p className="text-gray-600"><span className="font-medium">Student:</span> Aadira Philip</p>
                </div>
              </div>
            </div>
            
            {/* Exam Countdown */}
            <div className="md:col-span-1">
              <ExamCountdown examDate={examDate} examTitle="C Programming Final Exam" />
            </div>
          </div>
          
          {/* Motivational Quote */}
          <QuoteCard rotateQuotes={true} rotationInterval={10000} />
          
          {/* Progress Summary */}
          <section id="progress" className="mb-12">
            <ProgressSummary modules={modules} classes={classes} />
          </section>
          
          {/* Modules Section */}
          <section id="modules" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Course Modules</h2>
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <ModuleAccordion 
                modules={modules} 
                isEditable={isLoggedIn}
                onUpdateLesson={() => {}}
              />
            </ScrollArea>
          </section>
          
          {/* Schedule Section */}
          <ClassSchedule 
            isEditable={isLoggedIn} 
            onClassesUpdate={fetchClasses}
          />
          
          {/* Materials Section */}
          <MaterialsPanel isEditable={isLoggedIn} />
        </div>

        <footer className="bg-white border-t py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2025 Vijith V T, Technical Trainer & AI Specialist. All rights reserved.</p>
          </div>
        </footer>

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
