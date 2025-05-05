
import React from 'react';
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
  const handleUpdateLesson = async (moduleId: string, lessonId: string, status: 'not-started' | 'in-progress' | 'completed') => {
    try {
      console.log("Updating lesson status:", { moduleId, lessonId, status });
      
      // Create a record in the lesson_progress table
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
      
      if (error) throw error;
      
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
          modules={modules} 
          isEditable={isLoggedIn}
          onUpdateLesson={handleUpdateLesson}
        />
      </ScrollArea>
    </section>
  );
};

export default ModulesSection;
