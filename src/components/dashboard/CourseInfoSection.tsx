
import React from 'react';
import ExamCountdown from './ExamCountdown';

interface CourseInfoSectionProps {
  examDate: Date;
}

const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({ examDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Course Info Card */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <h2 className="text-xl font-bold mb-4">Course Details</h2>
          <div>
            <p className="text-gray-600"><span className="font-medium">Tutor:</span> Vijith V T</p>
            <p className="text-gray-600"><span className="font-medium">Student:</span> Aadira Philip</p>
          </div>
        </div>
      </div>
      
      {/* Exam Countdown */}
      <div className="md:col-span-1">
        <ExamCountdown examDate={examDate} examTitle="C Programming Final Exam" />
      </div>
    </div>
  );
};

export default CourseInfoSection;
