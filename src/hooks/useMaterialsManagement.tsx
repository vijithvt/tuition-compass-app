
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Material } from '@/types';

export const useMaterialsManagement = () => {
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

  useEffect(() => {
    fetchMaterials();
  }, []);

  return {
    allMaterials,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newMaterial,
    setNewMaterial,
    selectedMaterial,
    handleSubmit,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleFileChange
  };
};
