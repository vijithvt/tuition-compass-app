import React, { useState } from 'react';
import { Module } from '../../types';
import ModuleAccordion from '../modules/ModuleAccordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronDown } from 'lucide-react';

interface ModulesSectionProps {
  modules: Module[];
  isLoggedIn: boolean;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ modules, isLoggedIn }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  
  // Curriculum outline as per the specifications
  const curriculumOutline = [
    {
      id: "module-1",
      title: "Module 1",
      content: `C Fundamentals - Character Set, Constants, Identifiers, Keywords, Basic Data types, Variables, Operators and its precedence, Bit-wise operators, Expressions; Statements - Input and Output statements; Structure of a C program; Simple programs.
Control Statements - if, if-else, nested if, switch, while, do-while, for, break & continue, nested loops.`,
      difficulty: "beginner"
    },
    {
      id: "module-2",
      title: "Module 2",
      content: `Arrays - Single dimensional arrays, Defining an array, Array initialization, Accessing array elements; Enumerated data type; Type Definition; Two dimensional arrays – Defining a two-dimensional array; Programs for matrix processing; Programs for sequential search; Bubble sort;
Strings - Declaring a string variable, Reading and displaying strings, String related library functions – Programs for string matching.`,
      difficulty: "beginner"
    },
    {
      id: "module-3",
      title: "Module 3",
      content: `Functions - Function definition, Function call, Function prototype, Parameter passing; Recursion; Passing array to function; Macros - Defining and calling macros; Command line Arguments.
Structures - Defining a Structure variable, Accessing members, Array of structures, Passing structure to function; Union.
Storage Class - Storage Classes associated with variables: automatic, static, external and register.`,
      difficulty: "intermediate"
    },
    {
      id: "module-4",
      title: "Module 4",
      content: `Pointers - Declaration, Operations on pointers, Passing pointer to a function, Accessing array elements using pointers, Processing strings using pointers, Pointer to pointer, Array of pointers, Pointer to function, Pointer to structure, Dynamic Memory Allocation.
Files- Different types of files in C, Opening & Closing a file, Writing to and Reading from a file, Processing files, Library functions related to file – fseek(), ftell(), fread(), fwrite().`,
      difficulty: "advanced"
    }
  ];

  const toggleModule = (id: string) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  return (
    <section id="modules" className="py-8">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold">Course Curriculum</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <p className="text-muted-foreground">
              A comprehensive course covering all aspects of C programming from fundamentals to advanced topics.
            </p>
          </div>

          {/* Modern Curriculum Accordions */}
          <div className="space-y-4">
            {curriculumOutline.map((module) => (
              <div key={module.id} className="border rounded-lg overflow-hidden bg-white">
                <button
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleModule(module.id)}
                >
                  <div>
                    <h3 className="font-medium text-lg">{module.title}</h3>
                    <span className={`mt-1 inline-block difficulty-${module.difficulty}`}>
                      {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      expandedModuleId === module.id ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                
                {expandedModuleId === module.id && (
                  <div className="p-4 border-t bg-gray-50 animate-fade-in">
                    <p className="whitespace-pre-line text-gray-700">{module.content}</p>
                    
                    {/* Code sample example - can be customized per module */}
                    {module.id === "module-1" && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Example Code:</h4>
                        <pre className="rounded-md overflow-auto text-sm">
                          <code>
                            <span className="code-keyword">#include</span> <span className="code-string">&lt;stdio.h&gt;</span><br/>
                            <br/>
                            <span className="code-keyword">int</span> <span className="code-function">main</span>() &#123;<br/>
                            &nbsp;&nbsp;<span className="code-keyword">printf</span>(<span className="code-string">"Hello, World!\n"</span>);<br/>
                            &nbsp;&nbsp;<span className="code-keyword">return</span> 0;<br/>
                            &#125;
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Existing module accordion with progress tracking */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
            <ModuleAccordion 
              modules={modules} 
              isEditable={isLoggedIn}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ModulesSection;
