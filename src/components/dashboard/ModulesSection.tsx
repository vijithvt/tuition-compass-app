
import React, { useState } from 'react';
import { Module } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useModuleProgress } from '../../hooks/useModuleProgress';

interface ModulesSectionProps {
  modules: Module[];
  isLoggedIn: boolean;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ modules, isLoggedIn }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const { updateLessonStatus } = useModuleProgress(modules);
  
  // Curriculum outline as per the specifications
  const curriculumOutline = [
    {
      id: "module-1",
      title: "Module 1",
      content: `C Fundamentals - Character Set, Constants, Identifiers, Keywords, Basic Data types, Variables, Operators and its precedence, Bit-wise operators, Expressions; Statements - Input and Output statements; Structure of a C program; Simple programs.
Control Statements - if, if-else, nested if, switch, while, do-while, for, break & continue, nested loops.`,
    },
    {
      id: "module-2",
      title: "Module 2",
      content: `Arrays - Single dimensional arrays, Defining an array, Array initialization, Accessing array elements; Enumerated data type; Type Definition; Two dimensional arrays – Defining a two-dimensional array; Programs for matrix processing; Programs for sequential search; Bubble sort;
Strings - Declaring a string variable, Reading and displaying strings, String related library functions – Programs for string matching.`,
    },
    {
      id: "module-3",
      title: "Module 3",
      content: `Functions - Function definition, Function call, Function prototype, Parameter passing; Recursion; Passing array to function; Macros - Defining and calling macros; Command line Arguments.
Structures - Defining a Structure variable, Accessing members, Array of structures, Passing structure to function; Union.
Storage Class - Storage Classes associated with variables: automatic, static, external and register.`,
    },
    {
      id: "module-4",
      title: "Module 4",
      content: `Pointers - Declaration, Operations on pointers, Passing pointer to a function, Accessing array elements using pointers, Processing strings using pointers, Pointer to pointer, Array of pointers, Pointer to function, Pointer to structure, Dynamic Memory Allocation.
Files- Different types of files in C, Opening & Closing a file, Writing to and Reading from a file, Processing files, Library functions related to file – fseek(), ftell(), fread(), fwrite().`,
    }
  ];

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  // Handle lesson status update
  const handleStatusUpdate = (moduleId: string, lessonId: string, newStatus: 'not-started' | 'in-progress' | 'completed') => {
    updateLessonStatus(moduleId, lessonId, newStatus);
  };

  const getModuleProgress = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const totalLessons = module.lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = module.lessons.filter(lesson => lesson.status === 'completed').length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  return (
    <section id="modules" className="py-8 animate-fade-in">
      <Card className="border-0 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold">Course Modules</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <p className="text-muted-foreground">
              A comprehensive course covering all aspects of C programming from fundamentals to advanced topics.
            </p>
          </div>

          {/* Modern Curriculum Accordions with Udemy-style layout */}
          <div className="space-y-4">
            {modules.map((module) => {
              const progress = getModuleProgress(module.id);
              
              return (
                <div key={module.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all">
                  <button
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{module.title}</h3>
                      {/* Progress bar */}
                      <div className="flex items-center mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{progress}%</span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        expandedModuleId === module.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {expandedModuleId === module.id && (
                    <div className="p-4 border-t bg-gray-50 animate-fade-in">
                      {/* Module content description */}
                      <div className="mb-4 text-gray-700">
                        {curriculumOutline.find(m => m.id === `module-${module.id.split('-')[1]}`)?.content || 
                          "Module content description."}
                      </div>
                      
                      {/* Lessons list with Udemy-style progress tracking */}
                      <div className="space-y-3 mt-4">
                        {module.lessons.map(lesson => (
                          <div key={lesson.id} className="bg-white p-3 rounded border hover:shadow-sm transition-all">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <h4 className="font-medium">{lesson.title}</h4>
                              </div>
                              
                              {isLoggedIn && (
                                <Select
                                  value={lesson.status}
                                  onValueChange={(value) => handleStatusUpdate(
                                    module.id, 
                                    lesson.id, 
                                    value as 'not-started' | 'in-progress' | 'completed'
                                  )}
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="not-started">Not Started</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              
                              {!isLoggedIn && (
                                <span className={`text-sm px-2 py-1 rounded ${
                                  lesson.status === 'completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : lesson.status === 'in-progress'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {lesson.status === 'completed' 
                                    ? 'Completed' 
                                    : lesson.status === 'in-progress'
                                      ? 'In Progress'
                                      : 'Not Started'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ModulesSection;
