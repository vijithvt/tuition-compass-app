
import React, { useState } from 'react';
import { Module, Lesson, LessonStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Circle, CircleDot, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { moduleData } from '@/data/moduleData';
import { useModuleProgress } from '@/hooks/useModuleProgress';

// Component for the Progress Summary Card
const ProgressSummaryCard = ({ modules }: { modules: Module[] }) => {
  // Calculate overall progress stats
  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => lesson.status === 'completed').length;
  }, 0);
  const inProgressLessons = modules.reduce((acc, module) => {
    return acc + module.lessons.filter(lesson => lesson.status === 'in-progress').length;
  }, 0);
  const notStartedLessons = totalLessons - completedLessons - inProgressLessons;
  
  // Calculate completion percentage
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Course Progress Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <span className="text-2xl font-bold text-gray-700">{totalLessons}</span>
          <p className="text-sm text-gray-500">Total Topics</p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <span className="text-2xl font-bold text-green-700">{completedLessons}</span>
          <p className="text-sm text-green-600">Completed</p>
        </div>
        
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <span className="text-2xl font-bold text-yellow-700">{inProgressLessons}</span>
          <p className="text-sm text-yellow-600">In Progress</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <span className="text-2xl font-bold text-gray-500">{notStartedLessons}</span>
          <p className="text-sm text-gray-500">Not Started</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-full mr-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        <span className="text-lg font-semibold text-blue-600">{completionPercentage}%</span>
      </div>
    </div>
  );
};

// Component for individual Status Badges
const StatusBadge = ({ status }: { status: LessonStatus }) => {
  switch (status) {
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <Check className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case 'in-progress':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <CircleDot className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case 'not-started':
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <Circle className="w-3 h-3 mr-1" />
          Not Started
        </Badge>
      );
  }
};

// Component for individual Topic Status Item
const TopicStatusItem = ({ 
  lesson, 
  moduleId,
  onChange 
}: { 
  lesson: Lesson, 
  moduleId: string,
  onChange: (moduleId: string, lessonId: string, status: LessonStatus) => void 
}) => {
  return (
    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 transition duration-150">
      <div className="flex items-center">
        <span className="mr-2">
          {lesson.status === 'completed' && <Check className="w-4 h-4 text-green-600" />}
          {lesson.status === 'in-progress' && <CircleDot className="w-4 h-4 text-yellow-600" />}
          {lesson.status === 'not-started' && <Circle className="w-4 h-4 text-gray-400" />}
        </span>
        <span className="font-medium">{lesson.title}</span>
      </div>
      
      <Select 
        value={lesson.status} 
        onValueChange={(value: LessonStatus) => onChange(moduleId, lesson.id, value)}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Set Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="not-started">Not Started</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Component for Module Sections with Collapsible Lessons
const ModuleSection = ({ 
  module, 
  onStatusChange,
  isOpen,
  onToggle
}: { 
  module: Module, 
  onStatusChange: (moduleId: string, lessonId: string, status: LessonStatus) => void,
  isOpen: boolean,
  onToggle: () => void
}) => {
  // Calculate module completion percentage
  const totalLessons = module.lessons.length;
  const completedLessons = module.lessons.filter(lesson => lesson.status === 'completed').length;
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  return (
    <Card className="mb-4 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full text-left p-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white cursor-pointer">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-600">{completionPercentage}%</span>
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-4 pb-2 space-y-2 bg-gray-50">
            {module.lessons.map((lesson) => (
              <TopicStatusItem 
                key={lesson.id}
                lesson={lesson}
                moduleId={module.id}
                onChange={onStatusChange}
              />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Main Course Progress Component
const CourseProgress = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { toast } = useToast();
  const { modules, updateLessonStatus, isLoading } = useModuleProgress(moduleData);
  const [openModuleId, setOpenModuleId] = useState<string | null>("module-1"); // Default to open first module

  const handleStatusChange = async (moduleId: string, lessonId: string, newStatus: LessonStatus) => {
    try {
      await updateLessonStatus(moduleId, lessonId, newStatus);
      toast({
        title: 'Progress Updated',
        description: `Topic status changed to ${newStatus.replace('-', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast({
        variant: "destructive",
        title: 'Error',
        description: 'Failed to update topic progress.',
      });
    }
  };

  const toggleModule = (moduleId: string) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your course progress...</p>
      </div>
    );
  }

  return (
    <section className="my-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Course Progress</h1>
      
      <ProgressSummaryCard modules={modules} />
      
      <div className="space-y-4">
        {modules.map((module) => (
          <ModuleSection 
            key={module.id}
            module={module}
            onStatusChange={handleStatusChange}
            isOpen={openModuleId === module.id}
            onToggle={() => toggleModule(module.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default CourseProgress;
