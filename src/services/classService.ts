
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../data/moduleData';

// Default class template
export const getDefaultNewClass = (): Partial<ClassSession> => {
  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    day: format(new Date(), 'EEEE'),
    start_time: '18:00',
    end_time: '20:00',
    mode: 'online',
    meet_link: defaultMeetLink
  };
};

// Data fetching function
export const fetchClassesFromSupabase = async () => {
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

// Create a new class
export const createClass = async (classData: Partial<ClassSession>) => {
  // Make sure the required fields are present
  if (!classData.date || !classData.day || !classData.start_time || !classData.end_time) {
    throw new Error('Missing required fields: date, day, start_time, and end_time are required');
  }

  const { error } = await supabase
    .from('classes')
    .insert({
      date: classData.date,
      day: classData.day,
      start_time: classData.start_time,
      end_time: classData.end_time,
      mode: classData.mode || 'online',
      meet_link: classData.mode === 'offline' ? null : (classData.meet_link || defaultMeetLink)
    });
    
  if (error) throw error;
};

// Update an existing class
export const updateClass = async (id: string, classData: Partial<ClassSession>) => {
  const { error } = await supabase
    .from('classes')
    .update(classData)
    .eq('id', id);
    
  if (error) throw error;
};

// Delete a class
export const deleteClass = async (id: string) => {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
