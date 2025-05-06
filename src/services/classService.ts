
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
  const { error } = await supabase
    .from('classes')
    .insert([classData]);
    
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
