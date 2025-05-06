
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModuleAccordion from '../modules/ModuleAccordion';
import { Module } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ModulesSectionProps {
  modules: Module[];
  isLoggedIn: boolean;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ modules, isLoggedIn }) => {
  const [modulesList, setModulesList] = useState<Module[]>(modules);

  // Load lesson progress from database when component mounts
  useEffect(() => {
    const fetchLessonProgress = async () => {
      if (isLoggedIn) {
        try {
          const { data, error } = await supabase.from('lesson_progress').select('*');
          
          if (error) {
            console.error('Error fetching lesson progress:', error);
            return;
          }
          
          if (data && data.length > 0) {
            // Update modules with the status data from database
            const updatedModules = modules.map(module => ({
              ...module,
              lessons: module.lessons.map(lesson => {
                const progressRecord = data.find(
                  record => record.module_id === module.id && record.lesson_id === lesson.id
                );
                
                return progressRecord 
                  ? { ...lesson, status: progressRecord.status as 'not-started' | 'in-progress' | 'completed' }
                  : lesson;
              })
            }));
            
            setModulesList(updatedModules);
          }
        } catch (error) {
          console.error('Error fetching lesson progress:', error);
        }
      }
    };
    
    fetchLessonProgress();
  }, [modules, isLoggedIn]);

  const handleUpdateLesson = async (moduleId: string, lessonId: string, status: 'not-started' | 'in-progress' | 'completed') => {
    try {
      console.log("Updating lesson status:", { moduleId, lessonId, status });
      
      // Create or update a record in the lesson_progress table
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          module_id: moduleId,
          lesson_id: lessonId,
          status: status,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'module_id,lesson_id'
        });
      
      if (error) {
        console.error('Error in upsert operation:', error);
        throw error;
      }
      
      // Update the local state with the new status
      setModulesList(prevModules => 
        prevModules.map(module => 
          module.id === moduleId 
            ? {
                ...module,
                lessons: module.lessons.map(lesson => 
                  lesson.id === lessonId 
                    ? { ...lesson, status } 
                    : lesson
                )
              }
            : module
        )
      );
      
      toast({
        title: "Lesson status updated",
        description: `Lesson status has been set to ${status}`,
      });
      
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast({
        variant: "destructive",
        title: "Failed to update lesson status",
        description: "Please try again later."
      });
    }
  };

  return (
    <section id="modules" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Course Modules</h2>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <ModuleAccordion 
          modules={modulesList} 
          isEditable={isLoggedIn}
          onUpdateLesson={handleUpdateLesson}
        />
      </ScrollArea>
    </section>
  );
};

export default ModulesSection;
