
import { useState, useEffect } from 'react';
import { Module, Lesson, LessonStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useModuleProgress = (initialModules: Module[]) => {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load lesson progress from database when component mounts
  useEffect(() => {
    fetchLessonProgress();
  }, []);

  const fetchLessonProgress = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('lesson_progress').select('*');
      
      if (error) {
        console.error('Error fetching lesson progress:', error);
        toast({
          variant: "destructive",
          title: "Error loading progress",
          description: "Could not load your saved progress."
        });
        return;
      }
      
      if (data && data.length > 0) {
        // Update modules with the status data from database
        const updatedModules = initialModules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => {
            const progressRecord = data.find(
              record => record.module_id === module.id && record.lesson_id === lesson.id
            );
            
            return progressRecord 
              ? { ...lesson, status: progressRecord.status as LessonStatus }
              : lesson;
          })
        }));
        
        setModules(updatedModules);
      } else if (data && data.length === 0) {
        // If no data, set all module 1 lessons to completed by default
        const defaultModules = initialModules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => {
            // If it's module 1, set all lessons to completed by default
            if (module.id === 'module-1') {
              // First save to database
              supabase.from('lesson_progress').upsert({
                module_id: module.id,
                lesson_id: lesson.id,
                status: 'completed' as LessonStatus,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'module_id,lesson_id'
              }).then(() => {
                console.log(`Initialized ${lesson.title} as completed`);
              });
              
              // Return the lesson with completed status
              return { ...lesson, status: 'completed' as LessonStatus };
            }
            return lesson;
          })
        }));
        
        setModules(defaultModules);
      }
    } catch (error) {
      console.error('Error in fetchLessonProgress:', error);
      toast({
        variant: "destructive",
        title: "Error loading progress",
        description: "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateLessonStatus = async (moduleId: string, lessonId: string, status: LessonStatus) => {
    console.log(`Updating lesson status: moduleId=${moduleId}, lessonId=${lessonId}, status=${status}`);
    
    try {
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
      setModules(prevModules => 
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
      
      return true;
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast({
        variant: "destructive",
        title: "Failed to update topic status",
        description: "Please try again later."
      });
      return false;
    }
  };

  // Update specific lessons based on a named configuration
  const applyStatusUpdates = async (updates: {moduleTitle: string, lessonTitle: string, status: LessonStatus}[]) => {
    let success = true;
    
    for (const update of updates) {
      const moduleToUpdate = modules.find(m => m.title.includes(update.moduleTitle));
      if (!moduleToUpdate) {
        console.error(`Module with title containing "${update.moduleTitle}" not found`);
        continue;
      }
      
      const lessonToUpdate = moduleToUpdate.lessons.find(l => l.title.includes(update.lessonTitle));
      if (!lessonToUpdate) {
        console.error(`Lesson with title containing "${update.lessonTitle}" not found in module "${moduleToUpdate.title}"`);
        continue;
      }
      
      const result = await updateLessonStatus(moduleToUpdate.id, lessonToUpdate.id, update.status);
      if (!result) success = false;
    }
    
    return success;
  };

  return {
    modules,
    isLoading,
    updateLessonStatus,
    applyStatusUpdates,
    fetchLessonProgress
  };
};
