
import React from 'react';
import { Material } from '@/types';
import MaterialItem from './MaterialItem';
import { moduleData } from '../../data/moduleData';

interface MaterialsTabContentProps {
  materials: Material[];
  isLoading: boolean;
  moduleId?: string;
  isEditable: boolean;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialsTabContent: React.FC<MaterialsTabContentProps> = ({
  materials,
  isLoading,
  moduleId,
  isEditable,
  onEdit,
  onDelete
}) => {
  // Filter by module ID if provided
  const filteredMaterials = moduleId 
    ? materials.filter(m => m.moduleId === moduleId)
    : materials;

  if (isLoading) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">Loading materials...</p>
      </div>
    );
  }

  if (filteredMaterials.length === 0) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">
          {moduleId ? "No materials for this module." : "No materials uploaded yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredMaterials.map(material => {
        const module = moduleData.find(m => m.id === material.moduleId);
        return (
          <MaterialItem 
            key={material.id}
            material={material}
            module={module?.title || 'Unknown Module'}
            isEditable={isEditable}
            onEdit={() => onEdit(material)}
            onDelete={() => onDelete(material.id)}
          />
        );
      })}
    </div>
  );
};

export default MaterialsTabContent;
