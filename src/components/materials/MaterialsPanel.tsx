
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { moduleData } from '../../data/moduleData';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Material } from '@/types';

interface MaterialsPanelProps {
  isEditable: boolean;
}

const MaterialsPanel: React.FC<MaterialsPanelProps> = ({ isEditable }) => {
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    moduleId: '',
    title: '',
    description: '',
    fileUrl: '#',
    fileType: 'pdf'
  });
  
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedMaterials = data.map(item => ({
        id: item.id,
        moduleId: item.module_id,
        title: item.title,
        description: item.description || '',
        fileUrl: item.file_url,
        uploadDate: new Date(item.upload_date).toISOString().split('T')[0]
      }));

      setAllMaterials(formattedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        variant: "destructive",
        title: "Error loading materials",
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('materials')
        .insert([{ 
          module_id: newMaterial.moduleId,
          title: newMaterial.title,
          description: newMaterial.description,
          file_url: newMaterial.fileUrl,
          file_type: newMaterial.fileType
        }]);

      if (error) throw error;

      toast({
        title: "Material added successfully",
        description: `"${newMaterial.title}" has been uploaded.`
      });

      setIsAddDialogOpen(false);
      fetchMaterials();
      
      // Reset form
      setNewMaterial({
        moduleId: '',
        title: '',
        description: '',
        fileUrl: '#',
        fileType: 'pdf'
      });
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        variant: "destructive",
        title: "Failed to add material",
        description: "Please try again."
      });
    }
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setNewMaterial({
      moduleId: material.moduleId,
      title: material.title,
      description: material.description || '',
      fileUrl: material.fileUrl,
      fileType: 'pdf' // Default if not provided
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedMaterial) return;

    try {
      const { error } = await supabase
        .from('materials')
        .update({ 
          module_id: newMaterial.moduleId,
          title: newMaterial.title,
          description: newMaterial.description,
          file_url: newMaterial.fileUrl,
          file_type: newMaterial.fileType
        })
        .eq('id', selectedMaterial.id);

      if (error) throw error;

      toast({
        title: "Material updated successfully",
        description: `"${newMaterial.title}" has been updated.`
      });

      setIsEditDialogOpen(false);
      fetchMaterials();
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        variant: "destructive",
        title: "Failed to update material",
        description: "Please try again."
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Material deleted successfully"
      });

      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete material",
        description: "Please try again."
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle file uploads to a storage service
    // For now, we're just setting a placeholder URL
    if (e.target.files && e.target.files[0]) {
      console.log('File selected:', e.target.files[0].name);
      
      // In a real application, we'd upload to Supabase Storage
      // For now we'll just set a fake URL
      setNewMaterial({...newMaterial, fileUrl: `#${e.target.files[0].name}`});
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Study Materials</h2>
        {isEditable && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Upload Material
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Materials</TabsTrigger>
          {moduleData.map(module => (
            <TabsTrigger key={module.id} value={module.id}>
              {module.title.split(' ')[0]} {module.title.split(' ')[1] || ''}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-3">
            {isLoading ? (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground">Loading materials...</p>
              </div>
            ) : allMaterials.length === 0 ? (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground">No materials uploaded yet.</p>
              </div>
            ) : (
              allMaterials.map(material => {
                const module = moduleData.find(m => m.id === material.moduleId);
                return (
                  <MaterialItem 
                    key={material.id}
                    material={material}
                    module={module?.title || 'Unknown Module'}
                    isEditable={isEditable}
                    onEdit={() => handleEdit(material)}
                    onDelete={() => handleDelete(material.id)}
                  />
                );
              })
            )}
          </div>
        </TabsContent>

        {moduleData.map(module => (
          <TabsContent key={module.id} value={module.id}>
            <div className="space-y-3">
              {isLoading ? (
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">Loading materials...</p>
                </div>
              ) : allMaterials.filter(m => m.moduleId === module.id).length === 0 ? (
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">No materials for this module.</p>
                </div>
              ) : (
                allMaterials
                  .filter(m => m.moduleId === module.id)
                  .map(material => (
                    <MaterialItem 
                      key={material.id}
                      material={material}
                      module={module.title}
                      isEditable={isEditable}
                      onEdit={() => handleEdit(material)}
                      onDelete={() => handleDelete(material.id)}
                    />
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
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
    </div>
  );
};

interface MaterialItemProps {
  material: Material;
  module: string;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MaterialItem: React.FC<MaterialItemProps> = ({ material, module, isEditable, onEdit, onDelete }) => {
  return (
    <div className="material-card relative">
      {isEditable && (
        <div className="absolute top-2 right-2 flex space-x-1">
          <button 
            onClick={onEdit}
            className="p-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="p-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/80"
          >
            Delete
          </button>
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-medium">{material.title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
          <span>{module}</span>
          {material.uploadDate && <span className="text-xs">Uploaded on {material.uploadDate}</span>}
          {material.description && <p className="text-sm mt-1">{material.description}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <a href={material.fileUrl} target="_blank" rel="noreferrer">View</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={material.fileUrl} download>Download</a>
        </Button>
      </div>
    </div>
  );
};

export default MaterialsPanel;
