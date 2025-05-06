
import React from 'react';
import { Button } from '@/components/ui/button';
import { useClassManagement } from '../../hooks/useClassManagement';
import ClassTable from './ClassTable';
import ClassDialogs from './ClassDialogs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ClassScheduleProps {
  isEditable: boolean;
  onClassesUpdate?: () => void;
  displayMode?: 'full' | 'nextOnly' | 'completedOnly';
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ 
  isEditable, 
  onClassesUpdate,
  displayMode = 'full' 
}) => {
  const { 
    classes, 
    isLoading, 
    isAddDialogOpen, 
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newClass,
    setNewClass,
    handleSubmit,
    handleEdit,
    handleUpdate,
    handleDelete
  } = useClassManagement(onClassesUpdate);

  return (
    <section id="schedule" className="py-12">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {displayMode === 'nextOnly' ? 'Next Class' : 
               displayMode === 'completedOnly' ? 'Completed Classes' : 
               'Class Schedule'}
            </CardTitle>
          </div>
          {isEditable && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Class
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ClassTable 
            classes={classes}
            isLoading={isLoading}
            isEditable={isEditable}
            onEdit={handleEdit}
            onDelete={handleDelete}
            displayMode={displayMode}
          />
        </CardContent>
      </Card>

      {isEditable && (
        <ClassDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          newClass={newClass}
          setNewClass={setNewClass}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
        />
      )}
    </section>
  );
};

export default ClassSchedule;
