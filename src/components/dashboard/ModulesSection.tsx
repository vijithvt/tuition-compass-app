
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
      
      // In a real implementation, this would update the database
      // For now, we'll just show a success message
      toast({
        title: "Lesson status updated",
        description: `Lesson status has been set to ${status}`,
      });
      
      // Here's how you would update a lesson status in Supabase if there was a lessons table
      // Uncomment this code when you have the appropriate table structure
      /*
      const { error } = await supabase
        .from('lessons')
        .update({ status: status })
        .eq('module_id', moduleId)
        .eq('lesson_id', lessonId);
      
      if (error) throw error;
      */
      
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
