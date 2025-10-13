import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Trash2, Send, Edit } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Category {
  id: string;
  name: string;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  created_at: string;
  is_important: boolean;
}

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    loadCategories();
  }, []);

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    setNotifications(data || []);
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

  const handleEdit = async (notification: Notification) => {
    setEditingId(notification.id);
    setTitle(notification.title);
    setBody(notification.body);
    setIsImportant(notification.is_important);
    setShowForm(true);

    // Load categories for this notification
    const { data: notificationCategories } = await supabase
      .from('notification_categories')
      .select('category_id')
      .eq('notification_id', notification.id);

    setSelectedCategories(notificationCategories?.map(nc => nc.category_id) || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
    setSelectedCategories([]);
    setIsImportant(false);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      toast({
        title: 'Error',
        description: 'Title and body are required',
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
        // Update existing notification
        const { error: notificationError } = await supabase
          .from('notifications')
          .update({
            title,
            body,
            is_important: isImportant,
          })
          .eq('id', editingId);

        if (notificationError) throw notificationError;

        // Delete old category links
        await supabase
          .from('notification_categories')
          .delete()
          .eq('notification_id', editingId);

        // Create new category links
        const categoryLinks = selectedCategories.map(categoryId => ({
          notification_id: editingId,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('notification_categories')
          .insert(categoryLinks);

        if (categoryError) throw categoryError;

        toast({
          title: 'Success',
          description: 'Notification updated successfully',
        });
      } else {
        // Create new notification
        const { data: notification, error: notificationError } = await supabase
          .from('notifications')
          .insert({
            title,
            body,
            is_important: isImportant,
            created_by: user.id,
          })
          .select()
          .single();

        if (notificationError) throw notificationError;

        // Link notification to categories
        const categoryLinks = selectedCategories.map(categoryId => ({
          notification_id: notification.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('notification_categories')
          .insert(categoryLinks);

        if (categoryError) throw categoryError;

        // Send emails via edge function
        const { error: emailError } = await supabase.functions.invoke('send-notification-emails', {
          body: {
            notificationId: notification.id,
            title,
            body,
            categoryIds: selectedCategories,
          },
        });

        if (emailError) {
          console.error('Email sending error:', emailError);
          toast({
            title: 'Notification Created',
            description: 'Notification created but some emails may have failed to send',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Notification created and emails sent',
          });
        }
      }

      // Reset form
      setEditingId(null);
      setTitle('');
      setBody('');
      setSelectedCategories([]);
      setIsImportant(false);
      setShowForm(false);
      loadNotifications();
    } catch (error: any) {
      console.error('Error creating notification:', error);
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
    if (!confirm('Are you sure you want to delete this notification?')) return;

    const { error } = await supabase
      .from('notifications')
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
        description: 'Notification deleted',
      });
      loadNotifications();
    }
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Notifications</h3>
            <Button onClick={() => setShowForm(true)}>
              <Send className="h-4 w-4 mr-2" />
              Add New Notification
            </Button>
          </div>
          
          {notifications.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No notifications yet. Create your first notification to get started.</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {notification.is_important && (
                        <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                          Important
                        </span>
                      )}
                    </div>
                    <div 
                      className="text-sm text-muted-foreground mt-2"
                      dangerouslySetInnerHTML={{ __html: notification.body }}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(notification)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(notification.id)}
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
              {editingId ? 'Edit Notification' : 'Create New Notification'}
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
              placeholder="New Tax Deadline Added!!"
              required
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                placeholder="Enter your message..."
                style={{ minHeight: '200px' }}
              />
            </div>
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="important"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="important" className="cursor-pointer">Mark as Important</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {editingId ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Notification'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Notification'}
              </>
            )}
          </Button>
        </form>
      </Card>
      )}
    </div>
  );
}
