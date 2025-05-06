
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
          <p className="text-gray-600 mt-2"><span className="font-medium">Course:</span> C Programming</p>
          <p className="text-gray-600"><span className="font-medium">Scheme:</span> KTU B.Tech 2024</p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Progress Stats</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Completed Lessons:</span> 12/24
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Live Hours:</span> 18h completed
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-primary">48%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseInfoSection;
