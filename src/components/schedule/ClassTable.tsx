
import React from 'react';
import { ClassSession } from '@/types';
import { format, isPast, isFuture } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ClassTableProps {
  classes: ClassSession[];
  isLoading: boolean;
  isEditable: boolean;
  onEdit: (classItem: ClassSession) => void;
  onDelete: (id: string) => void;
  displayMode?: 'full' | 'nextOnly' | 'completedOnly';
}

const ClassTable: React.FC<ClassTableProps> = ({ 
  classes, 
  isLoading, 
  isEditable, 
  onEdit, 
  onDelete,
  displayMode = 'full'
}) => {
  if (isLoading) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">Loading class schedule...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">No classes scheduled.</p>
      </div>
    );
  }

  // Split into future and past classes
  const now = new Date();
  const futureClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return isFuture(classDate);
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time}`);
    const dateB = new Date(`${b.date}T${b.start_time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const pastClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return isPast(classDate);
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time}`);
    const dateB = new Date(`${b.date}T${b.start_time}`);
    return dateB.getTime() - dateA.getTime(); // Newest past classes first
  });

  // Get only the next upcoming class if displayMode is 'nextOnly'
  const nextClass = futureClasses.length > 0 ? [futureClasses[0]] : [];
  
  let classesToShow;
  
  if (displayMode === 'nextOnly') {
    classesToShow = nextClass;
  } else if (displayMode === 'completedOnly') {
    classesToShow = pastClasses;
  } else {
    classesToShow = [...futureClasses, ...pastClasses];
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Sl No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Class Mode</TableHead>
            <TableHead>Status</TableHead>
            {isEditable && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {classesToShow.map((classItem, index) => {
            const classDate = new Date(`${classItem.date}T${classItem.start_time}`);
            const isPastClass = isPast(classDate);
            const isNextUpcoming = index === 0 && displayMode === 'nextOnly';
            
            return (
              <TableRow 
                key={classItem.id} 
                className={isNextUpcoming ? "bg-primary/10 border-primary" : ""}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{format(new Date(classItem.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(`2000-01-01T${classItem.start_time}`), 'h:mm a')}</TableCell>
                <TableCell>{format(new Date(`2000-01-01T${classItem.end_time}`), 'h:mm a')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.mode === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {classItem.mode === 'online' ? 'Online' : 'Offline'}
                  </span>
                </TableCell>
                <TableCell>
                  {isPastClass ? (
                    <span className="inline-flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-blue-600">Upcoming</span>
                  )}
                </TableCell>
                {isEditable && (
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(classItem)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(classItem.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {displayMode === 'nextOnly' && futureClasses.length > 1 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {futureClasses.length - 1} more upcoming {futureClasses.length - 1 === 1 ? 'class' : 'classes'} scheduled.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassTable;
