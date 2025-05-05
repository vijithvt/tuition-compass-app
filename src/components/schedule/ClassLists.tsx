
import React, { useState } from 'react';
import { isAfter } from 'date-fns';
import { ClassSession } from '@/types';
import ClassScheduleItem from './ClassScheduleItem';
import { Button } from '@/components/ui/button';

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
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  
  const upcomingClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return isAfter(classDate, new Date());
  });

  const pastClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return !isAfter(classDate, new Date());
  });

  // Get next upcoming class
  const nextUpcomingClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;
  // Get remaining upcoming classes
  const remainingUpcomingClasses = upcomingClasses.slice(1);

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
        <div className="space-y-4">
          {nextUpcomingClass && (
            <div className="mb-4">
              <ClassScheduleItem 
                key={nextUpcomingClass.id} 
                classItem={nextUpcomingClass} 
                isEditable={isEditable}
                onEdit={onEdit}
                onDelete={onDelete}
                isHighlighted={true}
              />
            </div>
          )}
          
          {remainingUpcomingClasses.length > 0 && (
            <>
              {showAllUpcoming ? (
                <div className="space-y-4">
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
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAllUpcoming(false)}
                      className="text-sm"
                    >
                      Hide Additional Classes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllUpcoming(true)}
                    className="text-sm"
                  >
                    Show {remainingUpcomingClasses.length} More Upcoming Classes
                  </Button>
                </div>
              )}
            </>
          )}
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
