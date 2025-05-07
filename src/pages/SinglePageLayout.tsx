
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { moduleData } from '../data/moduleData';
import { supabase } from '@/integrations/supabase/client';

// Layout components
import HeaderSection from '../components/layout/HeaderSection';
import FooterSection from '../components/layout/FooterSection';
import Navbar from '../components/layout/Navbar';

// Dashboard components
import ModulesSection from '../components/dashboard/ModulesSection';
import ProgressSummary from '../components/dashboard/ProgressSummary';
import CourseInfoSection from '../components/dashboard/CourseInfoSection';
import QuoteCard from '../components/dashboard/QuoteCard';

// Schedule components
import ClassSchedule from '../components/schedule/ClassSchedule';

// Auth components
import LoginForm from '../components/auth/LoginForm';

// Materials components
import MaterialsPanel from '../components/materials/MaterialsPanel';

// Types and utilities
import { ClassSession } from '@/types';
import { isPast } from 'date-fns';

interface SinglePageLayoutProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const SinglePageLayout: React.FC<SinglePageLayoutProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const { toast } = useToast();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [nextClass, setNextClass] = useState<ClassSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedClasses = data.map(item => ({
        ...item,
        mode: item.mode === 'offline' ? 'offline' : 'online'
      } as ClassSession));

      setClasses(formattedClasses);

      // Set the next upcoming class
      const now = new Date();
      const upcomingClasses = formattedClasses.filter(c => {
        const classDate = new Date(`${c.date}T${c.start_time}`);
        return classDate > now;
      }).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.start_time}`);
        const dateB = new Date(`${b.date}T${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });

      setNextClass(upcomingClasses.length > 0 ? upcomingClasses[0] : null);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        variant: "destructive",
        title: "Error loading class schedule",
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Get progress data from modules
  const getProcessedModules = () => {
    return moduleData.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => ({
        ...lesson
      }))
    }));
  };

  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false);
    onLogin();
    toast({
      title: "Login successful",
      description: "Welcome back, Tutor!",
    });
  };

  const processedModules = getProcessedModules();
  const examDate = new Date('2025-07-15T09:00:00');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderSection 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLoginClick} 
        onLogout={onLogout}
        nextClass={nextClass}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Non-logged users see simplified progress summary */}
        {!isLoggedIn && (
          <div className="mb-8 bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Course Progress</h2>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-4">
              {/* Progress Statistics */}
              <div className="bg-success/10 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-1">Completed</h3>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-muted-foreground mt-1">of 24 lessons</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-1">Planned</h3>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-muted-foreground mt-1">total lessons</p>
              </div>
              
              <div className="bg-warning/10 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-1">Remaining</h3>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-muted-foreground mt-1">lessons to complete</p>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Overall Progress</h3>
                <span className="text-lg font-bold">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Summary for logged-in users */}
        {isLoggedIn && (
          <ProgressSummary 
            modules={processedModules}
            classes={classes}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <CourseInfoSection 
              examDate={examDate}
              nextClass={null}
            />
          </div>
          <div className="md:col-span-1 flex flex-col space-y-4">
            <QuoteCard />
          </div>
        </div>
        
        <div id="classes" className="mb-12">
          <ClassSchedule 
            isEditable={isLoggedIn}
            onClassesUpdate={fetchClasses}
            displayMode={isLoggedIn ? "full" : "completedOnly"}
          />
        </div>

        <ModulesSection 
          modules={processedModules} 
          isLoggedIn={isLoggedIn}
        />
        
        <MaterialsPanel isEditable={isLoggedIn} />
      </main>
      
      <FooterSection />

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SinglePageLayout;
