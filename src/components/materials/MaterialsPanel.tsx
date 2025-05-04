
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMaterialsManagement } from '../../hooks/useMaterialsManagement';
import { moduleData } from '../../data/moduleData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <CardTitle className="text-2xl font-bold">Study Materials</CardTitle>
          {isEditable && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Upload Material
            </Button>
          )}
        </CardHeader>
        <CardContent>
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
              <MaterialsTabContent
                materials={allMaterials}
                isLoading={isLoading}
                isEditable={isEditable}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>

            {moduleData.map(module => (
              <TabsContent key={module.id} value={module.id}>
                <MaterialsTabContent
                  materials={allMaterials}
                  isLoading={isLoading}
                  moduleId={module.id}
                  isEditable={isEditable}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
            ))}
          </Tabs>
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
