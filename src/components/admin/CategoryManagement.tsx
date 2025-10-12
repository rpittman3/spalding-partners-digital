import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  is_built_in: boolean;
  is_deleted: boolean;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('is_built_in', { ascending: false })
      .order('name');
    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', editingCategory.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update category',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Success', description: 'Category updated' });
        setOpen(false);
        setEditingCategory(null);
        loadCategories();
      }
    } else {
      const { error } = await supabase
        .from('categories')
        .insert({ name, is_built_in: false });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create category',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Success', description: 'Category created' });
        setOpen(false);
        loadCategories();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Success', description: 'Category deleted' });
      loadCategories();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setEditingCategory(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Update the category name'
                  : 'Create a new category for organizing clients'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCategory ? 'Update' : 'Create'} Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.is_built_in && (
                    <Badge variant="secondary">Built-in</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {category.is_deleted ? (
                    <Badge variant="destructive">Deleted</Badge>
                  ) : (
                    <Badge>Active</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {!category.is_built_in && !category.is_deleted && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
