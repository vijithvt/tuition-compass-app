
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Material } from '@/types';
import { Download, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MaterialItemProps {
  material: Material;
  module: string;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const MaterialItem: React.FC<MaterialItemProps> = ({ material, module, isEditable, onEdit, onDelete }) => {
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  // Function to get file extension from URL
  const getFileExtension = (url: string) => {
    // Remove any URL parameters
    const cleanUrl = url.split('?')[0];
    // Get the file extension
    const extension = cleanUrl.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  const fileExtension = getFileExtension(material.fileUrl);
  const isPdf = fileExtension === 'pdf';

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
        <div className="flex gap-2">
          {isPdf && (
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setPdfViewerOpen(true)}>
              <Eye size={14} />
              <span>View</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => {
            // Create a temporary anchor element to force proper download
            const link = document.createElement('a');
            link.href = material.fileUrl;
            link.download = `${material.title}.${fileExtension || 'pdf'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
            <Download size={14} />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* PDF Viewer Dialog */}
      {isPdf && (
        <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>{material.title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full min-h-[500px] w-full">
              <iframe
                src={`${material.fileUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full border-0"
                title={material.title}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setPdfViewerOpen(false)}>
                <EyeOff className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MaterialItem;
