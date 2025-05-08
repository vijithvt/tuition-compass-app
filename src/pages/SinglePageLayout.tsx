
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { moduleData } from '../data/moduleData';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

// Layout components
import HeaderSection from '../components/layout/HeaderSection';
import FooterSection from '../components/layout/FooterSection';

// Dashboard components
import ProgressSummary from '../components/dashboard/ProgressSummary';
import NonUserProgressSummary from '../components/dashboard/NonUserProgressSummary';
import CourseInfoSection from '../components/dashboard/CourseInfoSection';
import ExamCountdown from '../components/dashboard/ExamCountdown';
import QuoteCard from '../components/dashboard/QuoteCard';
import CourseProgress from '../components/dashboard/CourseProgress';

// Schedule components
import ClassSchedule from '../components/schedule/ClassSchedule';

// Auth components
import LoginForm from '../components/auth/LoginForm';

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
  const examDate = new Date('2025-05-19T09:00:00');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderSection 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLoginClick} 
        onLogout={onLogout}
        nextClass={nextClass}
      />

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Show full progress summary for all users */}
        <ProgressSummary 
          modules={processedModules}
          classes={classes}
          isLoggedIn={isLoggedIn} // Optional: useful if you want to tweak behavior inside
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            {/* CourseInfoSection without Class Hours Breakdown */}
            <Card className="h-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Course Details</h2>
                <div className="mb-4">
                  <p className="text-gray-600"><span className="font-medium">Tutor:</span> Vijith V T</p>
                  <p className="text-gray-600"><span className="font-medium">Student:</span> Aadira Philip</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <ExamCountdown 
              examDate={examDate}
              examTitle="KTU Final Examination"
            />
          </div>
          <div className="md:col-span-1">
            <QuoteCard />
          </div>
        </div>
        
        {/* New Dynamic Course Progress Section */}
        <CourseProgress isLoggedIn={isLoggedIn} />
        
        {/* Classes Section - Only show completed for non-logged users */}
        <div id="classes" className="mb-12">
          <ClassSchedule 
            isEditable={isLoggedIn}
            onClassesUpdate={fetchClasses}
            displayMode={isLoggedIn ? "full" : "completedOnly"}
          />
        </div>
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
