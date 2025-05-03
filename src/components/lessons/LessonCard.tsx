
import React, { useState } from 'react';
import { Lesson, LessonStatus } from '../../types';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LessonCardProps {
  lesson: Lesson;
  isEditable: boolean;
  onUpdate?: (updates: Partial<Lesson>) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isEditable, onUpdate }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [status, setStatus] = useState<LessonStatus>(lesson.status);
  const [startDate, setStartDate] = useState<string>(
    lesson.startDate ? 
    format(new Date(lesson.startDate), "yyyy-MM-dd'T'HH:mm") : 
    ''
  );
  const [endDate, setEndDate] = useState<string>(
    lesson.endDate ? 
    format(new Date(lesson.endDate), "yyyy-MM-dd'T'HH:mm") : 
    ''
  );

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return null;
    
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    
    const diffInMs = endDateTime.getTime() - startDateTime.getTime();
    const diffInMinutes = Math.round(diffInMs / (1000 * 60));
    
    return diffInMinutes;
  };
  
  const handleSubmit = () => {
    if (onUpdate) {
      const updates: Partial<Lesson> = {
        status,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
        duration: startDate && endDate ? calculateDuration(startDate, endDate) : null
      };
      
      onUpdate(updates);
      setIsEditDialogOpen(false);
    }
  };

  const getStatusClass = () => {
    switch (lesson.status) {
      case 'not-started':
        return 'status-not-started';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-not-started';
    }
  };

  const getStatusText = () => {
    switch (lesson.status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'Not set';
    return format(new Date(dateTimeString), 'MMM d, yyyy h:mm a');
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`lesson-card ${getStatusClass()}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{lesson.title}</h4>
        {isEditable && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="mt-2 text-sm">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status: {getStatusText()}
          </span>
          
          {lesson.startDate && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Start: {formatDateTime(lesson.startDate)}
            </span>
          )}
          
          {lesson.endDate && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              End: {formatDateTime(lesson.endDate)}
            </span>
          )}
          
          {lesson.duration && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Duration: {formatDuration(lesson.duration)}
            </span>
          )}
        </div>
      </div>
      
      {isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Lesson Status</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="font-medium">Status</label>
                <Select 
                  value={status} 
                  onValueChange={(value: LessonStatus) => setStatus(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="startDate" className="font-medium">Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="endDate" className="font-medium">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {startDate && endDate && calculateDuration(startDate, endDate) && (
                <div className="text-sm text-gray-700">
                  Calculated duration: {formatDuration(calculateDuration(startDate, endDate)!)}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LessonCard;
