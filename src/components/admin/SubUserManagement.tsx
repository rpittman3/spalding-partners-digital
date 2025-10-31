import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Users, Edit } from 'lucide-react';
import SubUserEditDialog from './SubUserEditDialog';

export default function SubUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [editingSubUser, setEditingSubUser] = useState<any>(null);

  // Fetch all main client users
  const { data: mainUsers } = useQuery({
    queryKey: ['main-users'],
    queryFn: async () => {
      // First get client user IDs
      const { data: clientRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'client');
      
      if (rolesError) throw rolesError;
      if (!clientRoles || clientRoles.length === 0) return [];
      
      const clientIds = clientRoles.map(r => r.user_id);
      
      // Then get their profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_main_user', true)
        .in('id', clientIds)
        .order('last_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all sub-users
  const { data: subUsers, isLoading } = useQuery({
    queryKey: ['sub-users'],
    queryFn: async () => {
      const { data: subUserData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_main_user', false)
        .order('last_name');
      
      if (error) throw error;
      if (!subUserData || subUserData.length === 0) return [];
      
      // Fetch parent user data separately
      const parentIds = [...new Set(subUserData.map(u => u.parent_user_id).filter(Boolean))];
      
      if (parentIds.length === 0) return subUserData.map(u => ({ ...u, parent: null }));
      
      const { data: parentData, error: parentError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, company_name')
        .in('id', parentIds);
      
      if (parentError) throw parentError;
      
      // Combine the data
      const parentMap = new Map(parentData?.map(p => [p.id, p]) || []);
      
      return subUserData.map(u => ({
        ...u,
        parent: u.parent_user_id ? parentMap.get(u.parent_user_id) : null
      }));
    },
  });

  const createSubUserMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName: string; lastName: string; parentUserId: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const response = await supabase.functions.invoke('create-sub-user', {
        body: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          parentUserId: data.parentUserId,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-users'] });
      toast({
        title: 'Success',
        description: 'Sub-user created successfully',
      });
      setIsDialogOpen(false);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setSelectedParentId('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId) {
      toast({
        title: 'Error',
        description: 'Please select a parent user',
        variant: 'destructive',
      });
      return;
    }
    createSubUserMutation.mutate({ email, password, firstName, lastName, parentUserId: selectedParentId });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Client Team Members
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Sub-User Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="parent">Parent User</Label>
                <Select value={selectedParentId} onValueChange={setSelectedParentId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainUsers?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} {user.company_name ? `(${user.company_name})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createSubUserMutation.isPending}>
                {createSubUserMutation.isPending ? 'Creating...' : 'Create Sub-User'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading sub-users...</p>
        ) : subUsers && subUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Parent User</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.parent 
                      ? `${user.parent.first_name} ${user.parent.last_name}` 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{user.company_name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSubUser(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No sub-users found.</p>
        )}
      </CardContent>
      {editingSubUser && (
        <SubUserEditDialog
          subUser={editingSubUser}
          open={!!editingSubUser}
          onOpenChange={(open) => !open && setEditingSubUser(null)}
        />
      )}
    </Card>
  );
}
