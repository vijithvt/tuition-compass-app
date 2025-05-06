
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../data/moduleData';

// Data fetching function
const fetchClassesFromSupabase = async () => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;

  return data?.map(item => ({
    ...item,
    mode: (item.mode === 'offline' ? 'offline' : 'online') as 'online' | 'offline'
  })) || [];
};

// Default class template
const getDefaultNewClass = (): Partial<ClassSession> => {
  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    day: format(new Date(), 'EEEE'),
    start_time: '18:00',
    end_time: '20:00',
    mode: 'online',
    meet_link: defaultMeetLink
  };
};

// Class data validation
const validateClassData = (classData: Partial<ClassSession>): boolean => {
  if (!classData.date || !classData.start_time || !classData.end_time) {
    toast({
      variant: "destructive",
      title: "Missing required fields",
      description: "Please fill in all required fields."
    });
    return false;
  }
  return true;
};

// Prepare class data for database
const prepareClassData = (classData: Partial<ClassSession>) => {
  const dayOfWeek = new Date(classData.date as string).toLocaleDateString('en-US', { weekday: 'long' });
  return { 
    date: classData.date, 
    day: dayOfWeek,
    start_time: classData.start_time,
    end_time: classData.end_time,
    mode: classData.mode || 'online',
    meet_link: classData.mode === 'online' ? (classData.meet_link || defaultMeetLink) : null
  };
};

export const useClassManagement = (onClassesUpdate?: () => void) => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [newClass, setNewClass] = useState<Partial<ClassSession>>(getDefaultNewClass());

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await fetchClassesFromSupabase();
      setClasses(data);
      
      if (onClassesUpdate) {
        onClassesUpdate();
      }
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

  const handleSubmit = async () => {
    try {
      if (!validateClassData(newClass)) return;

      const classData = prepareClassData(newClass);
      const { error } = await supabase
        .from('classes')
        .insert([classData]);

      if (error) throw error;

      toast({
        title: "Class added successfully",
        description: `Class scheduled for ${format(new Date(newClass.date as string), 'MMM d, yyyy')}`
      });

      setIsAddDialogOpen(false);
      fetchClasses();
      setNewClass(getDefaultNewClass());
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
      if (!validateClassData(newClass)) return;

      const classData = prepareClassData(newClass);
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

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedClass,
    newClass,
    setNewClass,
    handleSubmit,
    handleEdit,
    handleUpdate,
    handleDelete,
    fetchClasses
  };
};
