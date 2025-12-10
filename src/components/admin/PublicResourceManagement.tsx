import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, FileText, Upload } from 'lucide-react';

interface PublicResource {
  id: string;
  title: string;
  description: string;
  category: 'tax_resources' | 'guides_articles';
  resource_type: 'url' | 'pdf';
  url: string | null;
  file_path: string | null;
  file_name: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const PublicResourceManagement = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<PublicResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<PublicResource | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'tax_resources' | 'guides_articles'>('tax_resources');
  const [resourceType, setResourceType] = useState<'url' | 'pdf'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('public_resources')
      .select('*')
      .order('category')
      .order('display_order');

    if (error) {
      toast({ title: 'Error loading resources', description: error.message, variant: 'destructive' });
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('tax_resources');
    setResourceType('url');
    setUrl('');
    setFile(null);
    setDisplayOrder(0);
    setEditingResource(null);
  };

  const openEditDialog = (resource: PublicResource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setDescription(resource.description);
    setCategory(resource.category);
    setResourceType(resource.resource_type);
    setUrl(resource.url || '');
    setDisplayOrder(resource.display_order);
    setFile(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Missing fields', description: 'Title and description are required', variant: 'destructive' });
      return;
    }

    if (resourceType === 'url' && !url.trim()) {
      toast({ title: 'Missing URL', description: 'Please enter a URL', variant: 'destructive' });
      return;
    }

    if (resourceType === 'pdf' && !file && !editingResource?.file_path) {
      toast({ title: 'Missing file', description: 'Please upload a PDF file', variant: 'destructive' });
      return;
    }

    setUploading(true);

    try {
      let filePath = editingResource?.file_path || null;
      let fileName = editingResource?.file_name || null;

      // Upload file if provided
      if (resourceType === 'pdf' && file) {
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public-resources')
          .upload(uniqueName, file);

        if (uploadError) throw uploadError;
        
        filePath = uniqueName;
        fileName = file.name;
      }

      if (editingResource) {
        const { error: updateError } = await supabase
          .from('public_resources')
          .update({
            title: title.trim(),
            description: description.trim(),
            category,
            resource_type: resourceType,
            url: resourceType === 'url' ? url.trim() : null,
            file_path: resourceType === 'pdf' ? filePath : null,
            file_name: resourceType === 'pdf' ? fileName : null,
            display_order: displayOrder,
          })
          .eq('id', editingResource.id);

        if (updateError) throw updateError;
        toast({ title: 'Resource updated successfully' });
      } else {
        const { error: insertError } = await supabase
          .from('public_resources')
          .insert({
            title: title.trim(),
            description: description.trim(),
            category,
            resource_type: resourceType,
            url: resourceType === 'url' ? url.trim() : null,
            file_path: resourceType === 'pdf' ? filePath : null,
            file_name: resourceType === 'pdf' ? fileName : null,
            display_order: displayOrder,
            created_by: user?.id as string,
          });

        if (insertError) throw insertError;
        toast({ title: 'Resource created successfully' });
      }

      setDialogOpen(false);
      resetForm();
      loadResources();
    } catch (error: any) {
      toast({ title: 'Error saving resource', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (resource: PublicResource) => {
    const { error } = await supabase
      .from('public_resources')
      .update({ is_active: !resource.is_active })
      .eq('id', resource.id);

    if (error) {
      toast({ title: 'Error updating resource', description: error.message, variant: 'destructive' });
    } else {
      loadResources();
    }
  };

  const deleteResource = async (resource: PublicResource) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    // Delete file from storage if it exists
    if (resource.file_path) {
      await supabase.storage.from('public-resources').remove([resource.file_path]);
    }

    const { error } = await supabase
      .from('public_resources')
      .delete()
      .eq('id', resource.id);

    if (error) {
      toast({ title: 'Error deleting resource', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Resource deleted successfully' });
      loadResources();
    }
  };

  const getCategoryLabel = (cat: string) => {
    return cat === 'tax_resources' ? 'Tax Resources' : 'Guides & Articles';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage resources displayed on the public Resources page
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
              <DialogDescription>
                {editingResource ? 'Update the resource details below' : 'Add a new resource to the public Resources page'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resource title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a short description"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as 'tax_resources' | 'guides_articles')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tax_resources">Tax Resources</SelectItem>
                      <SelectItem value="guides_articles">Guides & Articles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={resourceType} onValueChange={(v) => setResourceType(v as 'url' | 'pdf')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">External URL</SelectItem>
                      <SelectItem value="pdf">Upload PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {resourceType === 'url' ? (
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="file">PDF File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {editingResource?.file_name && !file && (
                    <p className="text-sm text-muted-foreground">
                      Current file: {editingResource.file_name}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={uploading}>
                {uploading ? 'Saving...' : editingResource ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No resources yet. Click "Add Resource" to create one.
              </TableCell>
            </TableRow>
          ) : (
            resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {resource.resource_type === 'url' ? (
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    {resource.title}
                  </div>
                </TableCell>
                <TableCell>{getCategoryLabel(resource.category)}</TableCell>
                <TableCell className="capitalize">{resource.resource_type}</TableCell>
                <TableCell>{resource.display_order}</TableCell>
                <TableCell>
                  <Switch
                    checked={resource.is_active}
                    onCheckedChange={() => toggleActive(resource)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(resource)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteResource(resource)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicResourceManagement;