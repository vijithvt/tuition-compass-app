
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { moduleData } from '../../data/moduleData';
import { Material } from '@/types';

interface MaterialDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  newMaterial: {
    moduleId: string;
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
  };
  setNewMaterial: (material: any) => void;
  handleSubmit: () => Promise<void>;
  handleUpdate: () => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MaterialDialogs: React.FC<MaterialDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newMaterial,
  setNewMaterial,
  handleSubmit,
  handleUpdate,
  handleFileChange
}) => {
  return (
    <>
      {/* Upload Material Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Material</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="moduleId" className="font-medium">Module</label>
              <select
                id="moduleId"
                value={newMaterial.moduleId}
                onChange={(e) => setNewMaterial({...newMaterial, moduleId: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Module</option>
                {moduleData.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="title" className="font-medium">Title</label>
              <input
                type="text"
                id="title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="font-medium">Description (Optional)</label>
              <textarea
                id="description"
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
              ></textarea>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="file" className="font-medium">File</label>
              <input
                type="file"
                id="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!newMaterial.moduleId || !newMaterial.title}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-moduleId" className="font-medium">Module</label>
              <select
                id="edit-moduleId"
                value={newMaterial.moduleId}
                onChange={(e) => setNewMaterial({...newMaterial, moduleId: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Module</option>
                {moduleData.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-title" className="font-medium">Title</label>
              <input
                type="text"
                id="edit-title"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-description" className="font-medium">Description (Optional)</label>
              <textarea
                id="edit-description"
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
              ></textarea>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-file" className="font-medium">File</label>
              <input
                type="file"
                id="edit-file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX</p>
              
              <div className="text-sm">
                <span className="font-medium">Current file:</span> {newMaterial.fileUrl.replace('#', '')}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdate}
              disabled={!newMaterial.moduleId || !newMaterial.title}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaterialDialogs;
