
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, isAfter } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { scheduledClasses, defaultMeetLink } from '../../data/moduleData';

interface ClassScheduleProps {
  isEditable: boolean;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ isEditable }) => {
  const [classes, setClasses] = useState(scheduledClasses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '20:00',
    mode: 'online'
  });
  const [copySuccess, setCopySuccess] = useState('');

  const sortedClasses = [...classes].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingClasses = sortedClasses.filter(c => {
    const classDate = new Date(`${c.date}T${c.startTime}`);
    return isAfter(classDate, new Date());
  });

  const handleSubmit = () => {
    const newId = `class-${Date.now()}`;
    const updatedClasses = [...classes, { id: newId, ...newClass, mode: newClass.mode as 'online' | 'offline' }];
    setClasses(updatedClasses);
    setIsAddDialogOpen(false);
  };

  const handleCopyMeetLink = () => {
    navigator.clipboard.writeText(defaultMeetLink)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

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
      
      {upcomingClasses.length === 0 ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <p className="text-muted-foreground">No upcoming classes scheduled.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingClasses.map((classItem) => (
            <div key={classItem.id} className="schedule-card">
              <div className="flex justify-between">
                <h3 className="font-medium">{formatDate(classItem.date)}</h3>
                <span className={classItem.mode === 'online' ? 'badge-online' : 'badge-offline'}>
                  {classItem.mode === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="text-sm text-gray-700">
                {classItem.startTime} - {classItem.endTime}
              </div>
              
              {classItem.mode === 'online' && (
                <div className="mt-2 flex items-center">
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-blue-600">
                    {defaultMeetLink}
                  </div>
                  <button 
                    className="ml-2 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80"
                    onClick={handleCopyMeetLink}
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
      {isAddDialogOpen && (
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
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="endTime" className="font-medium">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
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
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Add Class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClassSchedule;
