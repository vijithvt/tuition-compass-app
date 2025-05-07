
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CourseInfoSectionProps {
  examDate: Date;
  nextClass?: null; // Keep parameter for compatibility but don't use it
}

const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({ examDate }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Course Details</h2>
        <div className="mb-4">
          <p className="text-gray-600"><span className="font-medium">Tutor:</span> Vijith V T</p>
          <p className="text-gray-600"><span className="font-medium">Student:</span> Aadira Philip</p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Exam Information</h3>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Date:</span> {examDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Time Remaining:</span> {Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseInfoSection;
