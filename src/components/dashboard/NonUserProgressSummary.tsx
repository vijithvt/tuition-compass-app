
import React from 'react';
import { Progress } from '@/components/ui/progress';

const NonUserProgressSummary: React.FC = () => {
  return (
    <div className="mb-8 bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-all animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Course Progress</h2>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-4">
        {/* Progress Statistics */}
        <div className="bg-success/10 rounded-lg p-4 hover:scale-105 transition-transform">
          <h3 className="text-lg font-medium mb-1">Completed</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-muted-foreground mt-1">of 24 lessons</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 hover:scale-105 transition-transform">
          <h3 className="text-lg font-medium mb-1">Planned</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-muted-foreground mt-1">total lessons</p>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-4 hover:scale-105 transition-transform">
          <h3 className="text-lg font-medium mb-1">Remaining</h3>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-muted-foreground mt-1">lessons to complete</p>
        </div>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Overall Progress</h3>
          <span className="text-lg font-bold">50%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full animate-pulse" style={{ width: '50%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NonUserProgressSummary;
