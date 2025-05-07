
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ExamCountdown from './ExamCountdown';
import { Progress } from '@/components/ui/progress';

interface CourseInfoSectionProps {
  examDate: Date;
  nextClass?: null; // Keep parameter for compatibility but don't use it
}

const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({ examDate }) => {
  // Calculate completed hours for display
  const totalHours = 30;
  const completedHours = 4;
  const remainingHours = totalHours - completedHours;
  const hoursProgress = Math.round((completedHours / totalHours) * 100);

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Course Details</h2>
        <div className="mb-4">
          <p className="text-gray-600"><span className="font-medium">Tutor:</span> Vijith V T</p>
          <p className="text-gray-600"><span className="font-medium">Student:</span> Aadira Philip</p>
        </div>
        
        {/* Class Hours Breakdown */}
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-medium mb-3">Class Hours Breakdown</h3>
          <div className="flex items-center mb-2">
            <Progress value={hoursProgress} className="flex-1 mr-2" />
            <span className="font-medium">{hoursProgress}%</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-success/10 p-2 rounded-lg">
              <p className="font-medium">Completed</p>
              <p className="text-lg font-bold">4h 0m</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="font-medium">Planned</p>
              <p className="text-lg font-bold">30h 0m</p>
            </div>
            <div className="bg-warning/10 p-2 rounded-lg">
              <p className="font-medium">Remaining</p>
              <p className="text-lg font-bold">26h 0m</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseInfoSection;
