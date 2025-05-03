
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { moduleData, materials } from '../../data/moduleData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MaterialsPanelProps {
  isEditable: boolean;
}

const MaterialsPanel: React.FC<MaterialsPanelProps> = ({ isEditable }) => {
  const [allMaterials, setAllMaterials] = useState(materials);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    moduleId: '',
    title: '',
    description: '',
    fileUrl: '#'
  });

  const handleSubmit = () => {
    const newId = `material-${Date.now()}`;
    const updatedMaterials = [
      ...allMaterials, 
      { 
        id: newId, 
        ...newMaterial, 
        uploadDate: new Date().toISOString().split('T')[0]
      }
    ];
    setAllMaterials(updatedMaterials);
    setIsAddDialogOpen(false);
    setNewMaterial({
      moduleId: '',
      title: '',
      description: '',
      fileUrl: '#'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle file uploads to a storage service
    // For now, we're just setting a placeholder URL
    if (e.target.files && e.target.files[0]) {
      console.log('File selected:', e.target.files[0].name);
      setNewMaterial({...newMaterial, fileUrl: '#'});
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
            {allMaterials.length === 0 ? (
              <div className="bg-muted p-6 rounded-lg text-center">
                <p className="text-muted-foreground">No materials uploaded yet.</p>
              </div>
            ) : (
              allMaterials.map(material => {
                const module = moduleData.find(m => m.id === material.moduleId);
                return (
                  <MaterialItem 
                    key={material.id}
                    title={material.title}
                    module={module?.title || 'Unknown Module'}
                    description={material.description}
                    fileUrl={material.fileUrl}
                    uploadDate={material.uploadDate}
                  />
                );
              })
            )}
          </div>
        </TabsContent>

        {moduleData.map(module => (
          <TabsContent key={module.id} value={module.id}>
            <div className="space-y-3">
              {allMaterials.filter(m => m.moduleId === module.id).length === 0 ? (
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">No materials for this module.</p>
                </div>
              ) : (
                allMaterials
                  .filter(m => m.moduleId === module.id)
                  .map(material => (
                    <MaterialItem 
                      key={material.id}
                      title={material.title}
                      module={module.title}
                      description={material.description}
                      fileUrl={material.fileUrl}
                      uploadDate={material.uploadDate}
                    />
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Upload Material Dialog */}
      {isAddDialogOpen && (
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
      )}
    </div>
  );
};

interface MaterialItemProps {
  title: string;
  module: string;
  description?: string;
  fileUrl: string;
  uploadDate: string;
}

const MaterialItem: React.FC<MaterialItemProps> = ({ title, module, description, fileUrl, uploadDate }) => {
  return (
    <div className="material-card">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
          <span>{module}</span>
          {uploadDate && <span className="text-xs">Uploaded on {uploadDate}</span>}
          {description && <p className="text-sm mt-1">{description}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <a href={fileUrl} target="_blank" rel="noreferrer">View</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={fileUrl} download>Download</a>
        </Button>
      </div>
    </div>
  );
};

export default MaterialsPanel;
