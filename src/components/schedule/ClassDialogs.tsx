
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ClassSession } from '@/types';
import { defaultMeetLink } from '../../data/moduleData';

interface ClassDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  newClass: Partial<ClassSession>;
  setNewClass: (newClass: Partial<ClassSession>) => void;
  handleSubmit: () => Promise<void>;
  handleUpdate: () => Promise<void>;
}

const ClassDialogs: React.FC<ClassDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newClass,
  setNewClass,
  handleSubmit,
  handleUpdate
}) => {
  return (
    <>
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
    </>
  );
};

export default ClassDialogs;
