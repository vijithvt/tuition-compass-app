
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMaterialsManagement } from '../../hooks/useMaterialsManagement';
import MaterialDialogs from './MaterialDialogs';
import MaterialsTabContent from './MaterialsTabContent';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MaterialsPanelProps {
  isEditable: boolean;
}

const MaterialsPanel: React.FC<MaterialsPanelProps> = ({ isEditable }) => {
  const {
    allMaterials,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newMaterial,
    setNewMaterial,
    handleSubmit,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleFileChange
  } = useMaterialsManagement();

  return (
    <section id="materials" className="py-12">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Study Materials</CardTitle>
            <p className="text-muted-foreground mt-1">Complete C Programming Resources</p>
          </div>
          {isEditable && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Upload Material
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <MaterialsTabContent
            materials={allMaterials}
            isLoading={isLoading}
            isEditable={isEditable}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <MaterialDialogs 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        newMaterial={newMaterial}
        setNewMaterial={setNewMaterial}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdate}
        handleFileChange={handleFileChange}
      />
    </section>
  );
};

export default MaterialsPanel;
