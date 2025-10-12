import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface SendDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string;
}

export default function SendDocumentDialog({ open, onOpenChange, onSuccess }: SendDocumentDialogProps) {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch clients (main users only)
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients-for-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, company_name, email')
        .eq('is_main_user', true)
        .order('last_name');
      
      if (error) throw error;
      return data as Client[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedClient || !selectedFile) {
        throw new Error('Please select a client and file');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${selectedClient}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: selectedClient,
          uploaded_by: user.id,
          file_name: selectedFile.name,
          file_path: fileName,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          category: category || null,
          notes: notes || null,
          is_direct_to_client: true,
          is_seen_by_admin: true,
          is_seen_by_client: false,
        });

      if (dbError) throw dbError;

      // Get client details for email
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        try {
          // Send notification email
          const { error: emailError } = await supabase.functions.invoke('send-document-notification', {
            body: {
              clientEmail: client.email || '',
              clientName: client.company_name || `${client.first_name} ${client.last_name}`,
              documentName: selectedFile.name,
              category: category || undefined,
            },
          });

          if (emailError) {
            console.error('Email notification failed:', emailError);
            // Don't throw - document is uploaded, email failure is non-critical
          }
        } catch (emailError) {
          console.error('Email notification error:', emailError);
          // Don't throw - document is uploaded successfully
        }
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Document sent to client successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      onSuccess?.();
      onOpenChange(false);
      // Reset form
      setSelectedClient('');
      setSelectedFile(null);
      setCategory('');
      setNotes('');
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
    uploadMutation.mutate();
  };

  const getClientDisplayName = (client: Client) => {
    return client.company_name || `${client.first_name} ${client.last_name}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Document to Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client *</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clientsLoading ? (
                  <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {getClientDisplayName(client)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Document File *</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Tax Returns, Financial Statements"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes for the client..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedClient || !selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Document
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
