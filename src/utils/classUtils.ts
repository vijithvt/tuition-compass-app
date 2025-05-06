
import { format } from 'date-fns';
import { ClassSession } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { defaultMeetLink } from '../data/moduleData';

// Class data validation
export const validateClassData = (classData: Partial<ClassSession>): boolean => {
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
export const prepareClassData = (classData: Partial<ClassSession>) => {
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
