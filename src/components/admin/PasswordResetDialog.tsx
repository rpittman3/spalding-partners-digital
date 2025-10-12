import { useState } from 'react';
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
import { Loader2, Copy, Check } from 'lucide-react';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

export default function PasswordResetDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
}: PasswordResetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
    setShowPassword(true);
  };

  const handleReset = async () => {
    if (!newPassword) {
      toast({
        title: 'Error',
        description: 'Please enter or generate a new password',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('reset-client-password', {
        body: {
          client_id: clientId,
          new_password: newPassword,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Success',
        description: 'Password reset successfully',
      });

      // Keep dialog open to show the password
      setShowPassword(true);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      toast({
        title: 'Copied',
        description: 'Password copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy password',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setShowPassword(false);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for {clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="flex gap-2">
              <Input
                id="new_password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter or generate a password"
                minLength={8}
              />
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
              >
                Generate
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Password must be at least 8 characters
            </p>
          </div>

          {showPassword && newPassword && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">New Password:</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="font-mono text-sm break-all">{newPassword}</p>
              <p className="text-xs text-muted-foreground">
                Make sure to save this password. It won't be shown again.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            onClick={handleReset}
            disabled={loading || !newPassword}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
