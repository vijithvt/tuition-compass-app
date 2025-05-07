
import React from 'react';
import { Button } from '@/components/ui/button';
import { Material } from '@/types';
import { Download } from 'lucide-react';

interface MaterialItemProps {
  material: Material;
  module: string;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MaterialItem: React.FC<MaterialItemProps> = ({ material, module, isEditable, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border relative hover:shadow-md transition-all animate-fade-in">
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
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h4 className="font-medium">{material.title}</h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
            <span>{module}</span>
            {material.uploadDate && <span className="text-xs">Uploaded on {material.uploadDate}</span>}
            {material.description && <p className="text-sm mt-1">{material.description}</p>}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="ml-2 flex items-center gap-1">
          <a href={material.fileUrl} download>
            <Download size={14} />
            <span>Download</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MaterialItem;
