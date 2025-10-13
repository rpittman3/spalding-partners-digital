import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Edit, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
}

interface Deadline {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  created_at: string;
}

export default function DeadlineManagement() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDeadlines();
    loadCategories();
  }, []);

  const loadDeadlines = async () => {
    const { data } = await supabase
      .from('deadlines')
      .select('*')
      .order('due_date', { ascending: true });
    
    setDeadlines(data || []);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_deleted', false)
      .order('name');
    
    setCategories(data || []);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEdit = async (deadline: Deadline) => {
    setEditingId(deadline.id);
    setTitle(deadline.title);
    setDescription(deadline.description || '');
    setDueDate(new Date(deadline.due_date));
    setShowForm(true);

    // Load categories for this deadline
    const { data: deadlineCategories } = await supabase
      .from('deadline_categories')
      .select('category_id')
      .eq('deadline_id', deadline.id);

    setSelectedCategories(deadlineCategories?.map(dc => dc.category_id) || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setSelectedCategories([]);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) {
      toast({
        title: 'Error',
        description: 'Title and due date are required',
        variant: 'destructive',
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one category',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      if (editingId) {
        // Update existing deadline
        const { error: deadlineError } = await supabase
          .from('deadlines')
          .update({
            title,
            description,
            due_date: format(dueDate, 'yyyy-MM-dd'),
          })
          .eq('id', editingId);

        if (deadlineError) throw deadlineError;

        // Delete old category links
        await supabase
          .from('deadline_categories')
          .delete()
          .eq('deadline_id', editingId);

        // Create new category links
        const categoryLinks = selectedCategories.map(categoryId => ({
          deadline_id: editingId,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('deadline_categories')
          .insert(categoryLinks);

        if (categoryError) throw categoryError;

        toast({
          title: 'Success',
          description: 'Deadline updated successfully',
        });
      } else {
        // Create new deadline
        const { data: deadline, error: deadlineError } = await supabase
          .from('deadlines')
          .insert({
            title,
            description,
            due_date: format(dueDate, 'yyyy-MM-dd'),
            created_by: user.id,
          })
          .select()
          .single();

        if (deadlineError) throw deadlineError;

        // Link deadline to categories
        const categoryLinks = selectedCategories.map(categoryId => ({
          deadline_id: deadline.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('deadline_categories')
          .insert(categoryLinks);

        if (categoryError) throw categoryError;

        toast({
          title: 'Success',
          description: 'Deadline created successfully',
        });
      }

      // Reset form
      setEditingId(null);
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setSelectedCategories([]);
      setShowForm(false);
      loadDeadlines();
    } catch (error: any) {
      console.error('Error saving deadline:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deadline?')) return;

    const { error } = await supabase
      .from('deadlines')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Deadline deleted',
      });
      loadDeadlines();
    }
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Deadlines</h3>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Deadline
            </Button>
          </div>
          
          {deadlines.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No deadlines yet. Create your first deadline to get started.</p>
            </Card>
          ) : (
            deadlines.map((deadline) => (
              <Card key={deadline.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{deadline.title}</h4>
                    {deadline.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {deadline.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Due: {format(new Date(deadline.due_date), 'PPP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(deadline)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(deadline.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Edit Deadline' : 'Create New Deadline'}
            </h3>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Q4 Tax Filing Deadline"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details about this deadline..."
                rows={3}
              />
            </div>

            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {editingId ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  {loading ? 'Updating...' : 'Update Deadline'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? 'Creating...' : 'Create Deadline'}
                </>
              )}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
