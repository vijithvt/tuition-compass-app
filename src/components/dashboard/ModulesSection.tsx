
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModuleAccordion from '../modules/ModuleAccordion';
import { Module, LessonStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { useModuleProgress } from '@/hooks/useModuleProgress';
import { Button } from '@/components/ui/button';

interface ModulesSectionProps {
  modules: Module[];
  isLoggedIn: boolean;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ modules, isLoggedIn }) => {
  const { 
    modules: modulesList, 
    isLoading, 
    updateLessonStatus,
    applyStatusUpdates
  } = useModuleProgress(modules);

  const handleUpdateLesson = async (moduleId: string, lessonId: string, updates: any) => {
    if (updates.status) {
      await updateLessonStatus(moduleId, lessonId, updates.status as LessonStatus);
    }
  };

  const handleApplyRequestedUpdates = async () => {
    const requestedUpdates = [
      // C Fundamentals as Completed
      { moduleTitle: "C Fundamentals", lessonTitle: "Control Statements", status: 'completed' as LessonStatus },
      
      // Arrays & Strings modules in progress
      { moduleTitle: "Arrays & Strings", lessonTitle: "1D & 2D Arrays", status: 'in-progress' as LessonStatus },
      { moduleTitle: "Arrays & Strings", lessonTitle: "Enum, Typedef", status: 'in-progress' as LessonStatus },
      { moduleTitle: "Arrays & Strings", lessonTitle: "Matrix Programs", status: 'in-progress' as LessonStatus }
    ];
    
    const success = await applyStatusUpdates(requestedUpdates);
    
    if (success) {
      toast({
        title: "Status updates applied",
        description: "The requested lesson statuses have been updated.",
      });
    }
  };

  return (
    <section id="modules" className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        
        {isLoggedIn && (
          <Button 
            onClick={handleApplyRequestedUpdates}
            variant="outline"
            className="text-sm"
          >
            Apply Requested Updates
          </Button>
        )}
      </div>
      
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
