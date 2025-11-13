import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Staff {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string | null;
  bio: string | null;
  photo_path: string | null;
  display_order: number;
  is_active: boolean;
}

export default function StaffManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    display_order: 0
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Staff[];
    }
  });

  const createStaffMutation = useMutation({
    mutationFn: async (data: typeof formData & { photo_path?: string }) => {
      const { error } = await supabase
        .from('staff')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: 'Staff member added successfully' });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding staff member', description: error.message, variant: 'destructive' });
    }
  });

  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData & { photo_path?: string }> }) => {
      const { error } = await supabase
        .from('staff')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: 'Staff member updated successfully' });
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating staff member', description: error.message, variant: 'destructive' });
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: 'Staff member deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting staff member', description: error.message, variant: 'destructive' });
    }
  });

  const uploadPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `staff/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('team-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let photo_path = editingStaff?.photo_path;
      
      if (photoFile) {
        photo_path = await uploadPhoto(photoFile);
      }

      const staffData = { ...formData, photo_path };

      if (editingStaff) {
        await updateStaffMutation.mutateAsync({ id: editingStaff.id, data: staffData });
      } else {
        await createStaffMutation.mutateAsync(staffData);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', position: '', email: '', phone: '', bio: '', display_order: 0 });
    setPhotoFile(null);
    setEditingStaff(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (member: Staff) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone || '',
      bio: member.bio || '',
      display_order: member.display_order
    });
    setIsDialogOpen(true);
  };

  const getPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    const { data } = supabase.storage.from('team-photos').getPublicUrl(photoPath);
    return data.publicUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Staff Management</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingStaff(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStaff ? 'Edit' : 'Add'} Staff Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <div className="[&_.ql-editor]:min-h-[120px]">
                    <ReactQuill
                      theme="snow"
                      value={formData.bio}
                      onChange={(value) => setFormData({ ...formData, bio: value })}
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="photo">Photo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {(editingStaff?.photo_path || photoFile) && (
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={photoFile ? URL.createObjectURL(photoFile) : getPhotoUrl(editingStaff?.photo_path || null) || undefined} 
                        />
                        <AvatarFallback>{formData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <label htmlFor="photo" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        <span>Upload Photo</span>
                      </div>
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingStaff ? 'Update' : 'Add'} Staff Member
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading staff...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={getPhotoUrl(member.photo_path) || undefined} />
                      <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.display_order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteStaffMutation.mutate(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
