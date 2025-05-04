
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModuleAccordion from '../modules/ModuleAccordion';
import { Module } from '@/types';

interface ModulesSectionProps {
  modules: Module[];
  isLoggedIn: boolean;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ modules, isLoggedIn }) => {
  return (
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
  );
};

export default ModulesSection;
