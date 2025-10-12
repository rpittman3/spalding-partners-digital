import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SubUserEditDialogProps {
  subUser: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubUserEditDialog({ subUser, open, onOpenChange }: SubUserEditDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPassword, setNewPassword] = useState('');
  const [isActive, setIsActive] = useState(subUser.is_active);

  const updateStatusMutation = useMutation({
    mutationFn: async (active: boolean) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: active })
        .eq('id', subUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-users'] });
      toast({
        title: 'Success',
        description: 'Sub-user status updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setIsActive(subUser.is_active);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await supabase.functions.invoke('reset-subuser-password', {
        body: {
          sub_user_id: subUser.id,
          new_password: password,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Password reset successfully',
      });
      setNewPassword('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    updateStatusMutation.mutate(checked);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }
    resetPasswordMutation.mutate(newPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sub-User: {subUser.first_name} {subUser.last_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={subUser.email} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Active Status</Label>
              <p className="text-sm text-muted-foreground">
                {isActive ? 'User can log in' : 'User is deactivated and cannot log in'}
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusChange}
              disabled={updateStatusMutation.isPending}
            />
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Reset Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={resetPasswordMutation.isPending || !newPassword}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}