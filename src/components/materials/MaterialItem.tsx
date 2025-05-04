
import React from 'react';
import { Button } from '@/components/ui/button';
import { Material } from '@/types';

interface MaterialItemProps {
  material: Material;
  module: string;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MaterialItem: React.FC<MaterialItemProps> = ({ material, module, isEditable, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border relative">
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
      <div className="flex items-center space-x-2 mt-3">
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

export default MaterialItem;
