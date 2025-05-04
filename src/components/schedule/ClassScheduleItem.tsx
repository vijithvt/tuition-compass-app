
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../../data/moduleData';

interface ClassScheduleItemProps {
  classItem: ClassSession;
  isEditable: boolean;
  onEdit: (classItem: ClassSession) => void;
  onDelete: (id: string) => void;
}

const ClassScheduleItem: React.FC<ClassScheduleItemProps> = ({ 
  classItem, 
  isEditable, 
  onEdit, 
  onDelete 
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
    <div className="bg-white p-4 rounded-lg shadow border">
      {isEditable && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button 
            onClick={() => onEdit(classItem)}
            className="p-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(classItem.id)}
            className="p-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/80"
          >
            Delete
          </button>
        </div>
      )}
      <div className="flex justify-between">
        <h3 className="font-medium">{formatDate(classItem.date)}</h3>
        <span className={`${classItem.mode === 'online' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'} px-2 py-0.5 rounded-full text-xs font-medium`}>
          {classItem.mode === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="text-sm text-gray-700 mt-1">
        {classItem.start_time.slice(0, 5)} - {classItem.end_time.slice(0, 5)}
      </div>
      
      {classItem.mode === 'online' && (
        <div className="mt-2 flex items-center">
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-blue-600">
            {classItem.meet_link || defaultMeetLink}
          </div>
          <button 
            className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80"
            onClick={() => handleCopyMeetLink(classItem.meet_link || defaultMeetLink)}
          >
            {copySuccess || 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassScheduleItem;
