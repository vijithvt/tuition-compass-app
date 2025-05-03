
import React, { useState } from 'react';
import { Module } from '../../types';
import LessonCard from '../lessons/LessonCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ModuleAccordionProps {
  modules: Module[];
  isEditable: boolean;
  onUpdateLesson?: (moduleId: string, lessonId: string, updates: any) => void;
}

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ 
  modules, 
  isEditable,
  onUpdateLesson 
}) => {
  const getModuleProgress = (module: Module) => {
    const totalLessons = module.lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = module.lessons.filter(lesson => lesson.status === 'completed').length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  return (
    <div className="space-y-4 mb-8">
      <Accordion type="single" collapsible className="w-full">
        {modules.map((module) => {
          const progress = getModuleProgress(module);
          
          return (
            <AccordionItem key={module.id} value={module.id} className="border rounded-lg mb-4">
              <AccordionTrigger className="module-header">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{module.title}</h3>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{progress}%</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 space-y-3">
                {module.lessons.map((lesson) => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson}
                    isEditable={isEditable}
                    onUpdate={onUpdateLesson ? 
                      (updates) => onUpdateLesson(module.id, lesson.id, updates) : 
                      undefined
                    }
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ModuleAccordion;
