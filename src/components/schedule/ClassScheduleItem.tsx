
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../../data/moduleData';
import { cn } from '@/lib/utils';

interface ClassScheduleItemProps {
  classItem: ClassSession;
  isEditable: boolean;
  onEdit: (classItem: ClassSession) => void;
  onDelete: (id: string) => void;
  isHighlighted?: boolean;
}

const ClassScheduleItem: React.FC<ClassScheduleItemProps> = ({ 
  classItem, 
  isEditable, 
  onEdit, 
  onDelete,
  isHighlighted = false
}) => {
  const [copySuccess, setCopySuccess] = useState('');

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleCopyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link || defaultMeetLink)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className={cn(
      "bg-white p-4 rounded-lg shadow border transition-all duration-300 hover:shadow-md", 
      isHighlighted && "border-primary bg-primary-50/50 shadow-md transform scale-[1.02]"
    )}>
      {isHighlighted && (
        <div className="absolute -top-2 right-2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
          Next Class
        </div>
      )}
      {isEditable && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button 
            onClick={() => onEdit(classItem)}
            className="p-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(classItem.id)}
            className="p-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/80 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{formatDate(classItem.date)}</h3>
        <span className={`${classItem.mode === 'online' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} px-2 py-0.5 rounded-full text-xs font-medium`}>
          {classItem.mode === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="text-sm text-gray-700 mt-2 font-medium">
        {classItem.start_time.slice(0, 5)} - {classItem.end_time.slice(0, 5)}
      </div>
      
      {classItem.mode === 'online' && (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-gray-500 mb-1">Meeting Link:</p>
          <div className="flex items-center bg-gray-50 rounded p-2">
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-blue-600">
              {classItem.meet_link || defaultMeetLink}
            </div>
            <button 
              className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
              onClick={() => handleCopyMeetLink(classItem.meet_link || defaultMeetLink)}
            >
              {copySuccess || 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassScheduleItem;
