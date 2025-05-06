
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ClassSession } from '@/types';
import { fetchClassesFromSupabase, createClass, updateClass, deleteClass, getDefaultNewClass } from '@/services/classService';
import { validateClassData, prepareClassData } from '@/utils/classUtils';

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
      await createClass(classData);

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
      await updateClass(selectedClass.id, classData);

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
      await deleteClass(id);

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

// Missing import fix
import { format } from 'date-fns';
import { defaultMeetLink } from '../data/moduleData';
