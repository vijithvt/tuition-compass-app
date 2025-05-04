
import React from 'react';
import { isAfter } from 'date-fns';
import { ClassSession } from '@/types';
import ClassScheduleItem from './ClassScheduleItem';

interface ClassListsProps {
  classes: ClassSession[];
  isLoading: boolean;
  isEditable: boolean;
  onEdit: (classItem: ClassSession) => void;
  onDelete: (id: string) => void;
}

const ClassLists: React.FC<ClassListsProps> = ({ 
  classes, 
  isLoading, 
  isEditable, 
  onEdit, 
  onDelete 
}) => {
  const upcomingClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return isAfter(classDate, new Date());
  });

  const pastClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return !isAfter(classDate, new Date());
  });

  // Get next 5 upcoming classes for featured display
  const featuredClasses = upcomingClasses.slice(0, 5);
  const remainingUpcomingClasses = upcomingClasses.slice(5);

  if (isLoading) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">Loading class schedule...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
      
      {upcomingClasses.length === 0 ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-muted-foreground">No upcoming classes scheduled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Featured upcoming classes (left side) */}
          <div className="md:col-span-5 space-y-4">
            {featuredClasses.map((classItem, index) => (
              <ClassScheduleItem 
                key={classItem.id} 
                classItem={classItem} 
                isEditable={isEditable}
                onEdit={onEdit}
                onDelete={onDelete}
                isHighlighted={index === 0}
              />
            ))}
          </div>
          
          {/* Remaining classes (right side) */}
          <div className="md:col-span-7">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {remainingUpcomingClasses.map((classItem) => (
                <ClassScheduleItem 
                  key={classItem.id} 
                  classItem={classItem}
                  isEditable={isEditable}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isHighlighted={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {pastClasses.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4 mt-8">Past Classes</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastClasses.map((classItem) => (
              <ClassScheduleItem 
                key={classItem.id} 
                classItem={classItem} 
                isEditable={isEditable}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ClassLists;
