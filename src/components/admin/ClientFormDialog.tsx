import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface ClientFormData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  company_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cell_phone: string;
  work_phone: string;
  category_ids: string[];
}

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    cell_phone: string | null;
    work_phone: string | null;
  };
  onSuccess: () => void;
}

export default function ClientFormDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
}: ClientFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ClientFormData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    company_name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cell_phone: '',
    work_phone: '',
    category_ids: [],
  });
  const { toast } = useToast();
  const isEdit = !!client;

  useEffect(() => {
    if (open) {
      loadCategories();
      if (client) {
        loadClientData();
      } else {
        resetForm();
      }
    }
  }, [open, client]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_deleted', false)
      .order('name');
    
    if (data) {
      setCategories(data);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (field: 'cell_phone' | 'work_phone', value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const loadClientData = async () => {
    if (!client) return;

    // Load assigned categories
    const { data: userCategories } = await supabase
      .from('user_categories')
      .select('category_id')
      .eq('user_id', client.id);

    setFormData({
      email: client.email,
      first_name: client.first_name,
      last_name: client.last_name,
      company_name: client.company_name || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zip: client.zip || '',
      cell_phone: formatPhoneNumber(client.cell_phone || ''),
      work_phone: formatPhoneNumber(client.work_phone || ''),
      category_ids: userCategories?.map(uc => uc.category_id) || [],
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      company_name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      cell_phone: '',
      work_phone: '',
      category_ids: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await handleUpdate();
      } else {
        await handleCreate();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.password) {
      throw new Error('Password is required');
    }

    const { data, error } = await supabase.functions.invoke('create-client', {
      body: {
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        company_name: formData.company_name.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        zip: formData.zip.trim() || null,
        cell_phone: formData.cell_phone.trim() || null,
        work_phone: formData.work_phone.trim() || null,
        category_ids: formData.category_ids,
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    toast({
      title: 'Success',
      description: 'Client created successfully',
    });

    onOpenChange(false);
    onSuccess();
  };

  const handleUpdate = async () => {
    if (!client) return;

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        company_name: formData.company_name.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        zip: formData.zip.trim() || null,
        cell_phone: formData.cell_phone.trim() || null,
        work_phone: formData.work_phone.trim() || null,
      })
      .eq('id', client.id);

    if (profileError) throw profileError;

    // Update categories - delete existing and insert new
    const { error: deleteError } = await supabase
      .from('user_categories')
      .delete()
      .eq('user_id', client.id);

    if (deleteError) throw deleteError;

    if (formData.category_ids.length > 0) {
      const { error: insertError } = await supabase
        .from('user_categories')
        .insert(
          formData.category_ids.map(category_id => ({
            user_id: client.id,
            category_id,
          }))
        );

      if (insertError) throw insertError;
    }

    toast({
      title: 'Success',
      description: 'Client updated successfully',
    });

    onOpenChange(false);
    onSuccess();
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update client information' : 'Create a new client account'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isEdit}
              required
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={8}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="12345"
                maxLength={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cell_phone">Cell Phone</Label>
              <Input
                id="cell_phone"
                type="tel"
                value={formData.cell_phone}
                onChange={(e) => handlePhoneChange('cell_phone', e.target.value)}
                placeholder="(555) 555-5555"
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_phone">Work Phone</Label>
              <Input
                id="work_phone"
                type="tel"
                value={formData.work_phone}
                onChange={(e) => handlePhoneChange('work_phone', e.target.value)}
                placeholder="(555) 555-5555"
                maxLength={14}
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.category_ids.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Client' : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
