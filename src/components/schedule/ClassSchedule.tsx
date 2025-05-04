
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, isAfter, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../../data/moduleData';
import ClassScheduleItem from './ClassScheduleItem';
import ClassDialogs from './ClassDialogs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { differenceInHours, differenceInMinutes } from 'date-fns';

interface ClassScheduleProps {
  isEditable: boolean;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ isEditable }) => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [newClass, setNewClass] = useState<Partial<ClassSession>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    day: format(new Date(), 'EEEE'),
    start_time: '18:00',
    end_time: '20:00',
    mode: 'online',
    meet_link: defaultMeetLink
  });
  const [teachingHours, setTeachingHours] = useState(0);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      // Cast the mode to the correct type
      const typedData = data?.map(item => ({
        ...item,
        mode: (item.mode === 'offline' ? 'offline' : 'online') as 'online' | 'offline'
      })) || [];

      setClasses(typedData);
      calculateTeachingHours(typedData);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        variant: "destructive",
        title: "Error loading class schedule",
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTeachingHours = (classData: ClassSession[]) => {
    const now = new Date();
    let totalMinutes = 0;
    
    classData.forEach(session => {
      const sessionDate = parseISO(`${session.date}T${session.end_time}`);
      
      // Only count sessions that have already ended
      if (sessionDate < now) {
        const startTime = parseISO(`${session.date}T${session.start_time}`);
        const endTime = parseISO(`${session.date}T${session.end_time}`);
        const sessionMinutes = differenceInMinutes(endTime, startTime);
        totalMinutes += sessionMinutes;
      }
    });
    
    setTeachingHours(Math.round(totalMinutes / 60 * 10) / 10); // Round to 1 decimal place
  };

  const handleSubmit = async () => {
    try {
      // Ensure required fields are present
      if (!newClass.date || !newClass.start_time || !newClass.end_time) {
        toast({
          variant: "destructive",
          title: "Missing required fields",
          description: "Please fill in all required fields."
        });
        return;
      }

      // Update day based on date
      const dayOfWeek = new Date(newClass.date).toLocaleDateString('en-US', { weekday: 'long' });
      const classData = { 
        date: newClass.date, 
        day: dayOfWeek,
        start_time: newClass.start_time,
        end_time: newClass.end_time,
        mode: newClass.mode || 'online',
        meet_link: newClass.mode === 'online' ? (newClass.meet_link || defaultMeetLink) : null
      };

      const { error } = await supabase
        .from('classes')
        .insert([classData]);

      if (error) throw error;

      toast({
        title: "Class added successfully",
        description: `Class scheduled for ${format(new Date(newClass.date), 'MMM d, yyyy')}`
      });

      setIsAddDialogOpen(false);
      fetchClasses();
      
      // Reset form
      setNewClass({
        date: format(new Date(), 'yyyy-MM-dd'),
        day: format(new Date(), 'EEEE'),
        start_time: '18:00',
        end_time: '20:00',
        mode: 'online',
        meet_link: defaultMeetLink
      });
    } catch (error) {
      console.error('Error adding class:', error);
      toast({
        variant: "destructive",
        title: "Failed to add class",
        description: "Please try again."
      });
    }
  };

  const handleEdit = (classItem: ClassSession) => {
    setSelectedClass(classItem);
    setNewClass({
      date: classItem.date,
      day: classItem.day,
      start_time: classItem.start_time,
      end_time: classItem.end_time,
      mode: classItem.mode,
      meet_link: classItem.meet_link || defaultMeetLink
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedClass) return;

    try {
      // Ensure required fields are present
      if (!newClass.date || !newClass.start_time || !newClass.end_time) {
        toast({
          variant: "destructive",
          title: "Missing required fields",
          description: "Please fill in all required fields."
        });
        return;
      }

      // Update day based on date
      const dayOfWeek = new Date(newClass.date as string).toLocaleDateString('en-US', { weekday: 'long' });
      const classData = { 
        date: newClass.date, 
        day: dayOfWeek,
        start_time: newClass.start_time,
        end_time: newClass.end_time,
        mode: newClass.mode || 'online',
        meet_link: newClass.mode === 'online' ? (newClass.meet_link || defaultMeetLink) : null
      };

      const { error } = await supabase
        .from('classes')
        .update(classData)
        .eq('id', selectedClass.id);

      if (error) throw error;

      toast({
        title: "Class updated successfully",
        description: `Class for ${format(new Date(newClass.date as string), 'MMM d, yyyy')} has been updated.`
      });

      setIsEditDialogOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        variant: "destructive",
        title: "Failed to update class",
        description: "Please try again."
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Class deleted successfully"
      });

      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete class",
        description: "Please try again."
      });
    }
  };

  const upcomingClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return isAfter(classDate, new Date());
  });

  const pastClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return !isAfter(classDate, new Date());
  });

  // Get next 3-5 upcoming classes for featured display
  const featuredClasses = upcomingClasses.slice(0, 5);
  const remainingUpcomingClasses = upcomingClasses.slice(5);

  return (
    <section id="schedule" className="py-12">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Class Schedule</CardTitle>
          </div>
          {isEditable && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Class
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          
          {isLoading ? (
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-muted-foreground">Loading class schedule...</p>
            </div>
          ) : upcomingClasses.length === 0 ? (
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
                      onEdit={handleEdit}
                      onDelete={handleDelete}
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

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
    </section>
  );
};

export default ClassSchedule;
