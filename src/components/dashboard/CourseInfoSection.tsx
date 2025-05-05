
import React from 'react';
import ExamCountdown from './ExamCountdown';
import { format, isFuture } from 'date-fns';
import { ClassSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { defaultMeetLink } from '../../data/moduleData';

interface CourseInfoSectionProps {
  examDate: Date;
  nextClass?: ClassSession | null;
}

const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({ examDate, nextClass }) => {
  const handleCopyMeetLink = (link?: string) => {
    const linkToCopy = link || defaultMeetLink;
    navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        toast({ description: "Meeting link copied to clipboard" });
      })
      .catch(() => {
        toast({ 
          variant: "destructive", 
          description: "Failed to copy link" 
        });
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Course Info Card */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Course Details</h2>
            <div className="mb-4">
              <p className="text-gray-600"><span className="font-medium">Tutor:</span> Vijith V T</p>
              <p className="text-gray-600"><span className="font-medium">Student:</span> Aadira Philip</p>
            </div>
            
            {nextClass && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-lg mb-3">Next Class</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{format(new Date(nextClass.date), 'MMM dd, yyyy')}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      nextClass.mode === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {nextClass.mode === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">
                    {format(new Date(`2000-01-01T${nextClass.start_time}`), 'hh:mm a')} - {format(new Date(`2000-01-01T${nextClass.end_time}`), 'hh:mm a')}
                  </p>
                  
                  {nextClass.mode === 'online' && (
                    <div className="border rounded p-3 bg-white">
                      <p className="text-sm text-gray-500 mb-1">Meeting Link:</p>
                      <div className="flex justify-between items-center">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-blue-600 max-w-[80%]">
                          {nextClass.meet_link || defaultMeetLink}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handleCopyMeetLink(nextClass.meet_link)}
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Exam Countdown */}
      <div className="md:col-span-1">
        <ExamCountdown examDate={examDate} examTitle="C Programming Final Exam" />
      </div>
    </div>
  );
};

export default CourseInfoSection;
