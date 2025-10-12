import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Upload, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_size: number;
  is_important: boolean;
  created_at: string;
  resource_categories: {
    categories: {
      name: string;
    };
  }[];
}

interface Category {
  id: string;
  name: string;
}

export default function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isImportant, setIsImportant] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
    loadCategories();
  }, []);

  const loadResources = async () => {
    const { data } = await supabase
      .from('resources')
      .select(`
        *,
        resource_categories (
          categories (
            name
          )
        )
      `)
      .order('created_at', { ascending: false });
    setResources(data || []);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_deleted', false)
      .order('name');
    setCategories(data || []);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!file || selectedCategories.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select a file and at least one category',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    // Upload file to storage
    const filePath = `resources/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('admin-resources')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    // Create resource record
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({
        title,
        description,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        is_important: isImportant,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (resourceError || !resource) {
      toast({
        title: 'Error',
        description: 'Failed to create resource',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    // Link to categories
    const categoryLinks = selectedCategories.map((catId) => ({
      resource_id: resource.id,
      category_id: catId,
    }));

    await supabase.from('resource_categories').insert(categoryLinks);

    toast({
      title: 'Success',
      description: 'Resource uploaded successfully',
    });

    setOpen(false);
    setSelectedCategories([]);
    setIsImportant(false);
    loadResources();
    setUploading(false);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsImportant(resource.is_important);
    const categoryIds = resource.resource_categories?.map(rc => {
      // Find the category ID from the categories list by name
      const category = categories.find(c => c.name === rc.categories.name);
      return category?.id;
    }).filter(Boolean) as string[];
    setSelectedCategories(categoryIds);
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingResource) return;

    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (selectedCategories.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one category',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    // Update resource
    const { error: updateError } = await supabase
      .from('resources')
      .update({
        title,
        description,
        is_important: isImportant,
      })
      .eq('id', editingResource.id);

    if (updateError) {
      toast({
        title: 'Error',
        description: 'Failed to update resource',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    // Delete old category links
    await supabase
      .from('resource_categories')
      .delete()
      .eq('resource_id', editingResource.id);

    // Create new category links
    const categoryLinks = selectedCategories.map((catId) => ({
      resource_id: editingResource.id,
      category_id: catId,
    }));

    await supabase.from('resource_categories').insert(categoryLinks);

    toast({
      title: 'Success',
      description: 'Resource updated successfully',
    });

    setEditOpen(false);
    setEditingResource(null);
    setSelectedCategories([]);
    setIsImportant(false);
    loadResources();
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
              <DialogDescription>
                Upload a resource file and assign it to categories
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" name="file" type="file" required />
              </div>
              <div className="space-y-2">
                <Label>Categories (select at least one)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={cat.id}
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={() => toggleCategory(cat.id)}
                      />
                      <label htmlFor={cat.id} className="text-sm cursor-pointer">
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="important"
                  checked={isImportant}
                  onCheckedChange={(checked) => setIsImportant(checked as boolean)}
                />
                <label htmlFor="important" className="text-sm cursor-pointer">
                  Mark as Important (overrides notification preferences)
                </label>
              </div>
              <Button type="submit" disabled={uploading} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Resource'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Important</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No resources uploaded yet
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>{resource.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.resource_categories?.length > 0 ? (
                        resource.resource_categories.map((rc, idx) => (
                          <Badge key={idx} variant="secondary">
                            {rc.categories.name}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary">ALL</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {(resource.file_size / 1024 / 1024).toFixed(2)} MB
                  </TableCell>
                  <TableCell>{resource.is_important ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {new Date(resource.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(resource)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>
              Update resource details and categories
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                name="title" 
                defaultValue={editingResource?.title}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                defaultValue={editingResource?.description || ''}
                rows={3} 
              />
            </div>
            <div className="space-y-2">
              <Label>Categories (select at least one)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${cat.id}`}
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <label htmlFor={`edit-${cat.id}`} className="text-sm cursor-pointer">
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-important"
                checked={isImportant}
                onCheckedChange={(checked) => setIsImportant(checked as boolean)}
              />
              <label htmlFor="edit-important" className="text-sm cursor-pointer">
                Mark as Important (overrides notification preferences)
              </label>
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? 'Updating...' : 'Update Resource'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
