
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, isAfter } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../../data/moduleData';

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
  const [copySuccess, setCopySuccess] = useState('');

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

      setClasses(data || []);
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
      // Update day based on date
      const dayOfWeek = new Date(newClass.date as string).toLocaleDateString('en-US', { weekday: 'long' });
      const classData = { ...newClass, day: dayOfWeek };

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
      // Update day based on date
      const dayOfWeek = new Date(newClass.date as string).toLocaleDateString('en-US', { weekday: 'long' });
      const classData = { ...newClass, day: dayOfWeek };

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

  const handleCopyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link || defaultMeetLink)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const upcomingClasses = classes.filter(c => {
    const classDate = new Date(`${c.date}T${c.start_time}`);
    return isAfter(classDate, new Date());
  });

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Upcoming Classes</h2>
        {isEditable && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Class
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-muted-foreground">Loading class schedule...</p>
        </div>
      ) : upcomingClasses.length === 0 ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-muted-foreground">No upcoming classes scheduled.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingClasses.map((classItem) => (
            <div key={classItem.id} className="schedule-card relative">
              {isEditable && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button 
                    onClick={() => handleEdit(classItem)}
                    className="p-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(classItem.id)}
                    className="p-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/80"
                  >
                    Delete
                  </button>
                </div>
              )}
              <div className="flex justify-between">
                <h3 className="font-medium">{formatDate(classItem.date)}</h3>
                <span className={classItem.mode === 'online' ? 'badge-online' : 'badge-offline'}>
                  {classItem.mode === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="text-sm text-gray-700">
                {classItem.start_time.slice(0, 5)} - {classItem.end_time.slice(0, 5)}
              </div>
              
              {classItem.mode === 'online' && (
                <div className="mt-2 flex items-center">
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-blue-600">
                    {classItem.meet_link || defaultMeetLink}
                  </div>
                  <button 
                    className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80"
                    onClick={() => handleCopyMeetLink(classItem.meet_link || defaultMeetLink)}
                  >
                    {copySuccess || 'Copy'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a Class</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="date" className="font-medium">Date</label>
              <input
                type="date"
                id="date"
                value={newClass.date}
                onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="startTime" className="font-medium">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  value={newClass.start_time}
                  onChange={(e) => setNewClass({...newClass, start_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="endTime" className="font-medium">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  value={newClass.end_time}
                  onChange={(e) => setNewClass({...newClass, end_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="font-medium">Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="online"
                    checked={newClass.mode === 'online'}
                    onChange={() => setNewClass({...newClass, mode: 'online'})}
                    className="mr-2"
                  />
                  Online
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="offline"
                    checked={newClass.mode === 'offline'}
                    onChange={() => setNewClass({...newClass, mode: 'offline'})}
                    className="mr-2"
                  />
                  Offline
                </label>
              </div>
            </div>

            {newClass.mode === 'online' && (
              <div className="grid gap-2">
                <label htmlFor="meetLink" className="font-medium">Meet Link</label>
                <input
                  type="text"
                  id="meetLink"
                  value={newClass.meet_link}
                  onChange={(e) => setNewClass({...newClass, meet_link: e.target.value})}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-date" className="font-medium">Date</label>
              <input
                type="date"
                id="edit-date"
                value={newClass.date}
                onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-start-time" className="font-medium">Start Time</label>
                <input
                  type="time"
                  id="edit-start-time"
                  value={newClass.start_time}
                  onChange={(e) => setNewClass({...newClass, start_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-end-time" className="font-medium">End Time</label>
                <input
                  type="time"
                  id="edit-end-time"
                  value={newClass.end_time}
                  onChange={(e) => setNewClass({...newClass, end_time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="font-medium">Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="edit-mode"
                    value="online"
                    checked={newClass.mode === 'online'}
                    onChange={() => setNewClass({...newClass, mode: 'online'})}
                    className="mr-2"
                  />
                  Online
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="edit-mode"
                    value="offline"
                    checked={newClass.mode === 'offline'}
                    onChange={() => setNewClass({...newClass, mode: 'offline'})}
                    className="mr-2"
                  />
                  Offline
                </label>
              </div>
            </div>

            {newClass.mode === 'online' && (
              <div className="grid gap-2">
                <label htmlFor="edit-meet-link" className="font-medium">Meet Link</label>
                <input
                  type="text"
                  id="edit-meet-link"
                  value={newClass.meet_link}
                  onChange={(e) => setNewClass({...newClass, meet_link: e.target.value})}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Update Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassSchedule;
