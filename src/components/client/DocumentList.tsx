import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Clock } from 'lucide-react';
import { formatDistanceToNow, differenceInMonths } from 'date-fns';

interface Document {
  id: string;
  file_name: string;
  uploaded_at: string;
  file_size: number;
  expires_at: string;
  extension_count: number;
  is_expired: boolean;
}

export default function DocumentList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) loadDocuments();
  }, [user, refreshTrigger]);

  const loadDocuments = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_expired', false)
      .order('uploaded_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const handleExtend = async (docId: string, currentExtensions: number) => {
    if (currentExtensions >= 2) {
      toast({
        title: 'Cannot Extend',
        description: 'Maximum extensions (2) reached for this document',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('documents')
      .update({
        expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        extension_count: currentExtensions + 1,
      })
      .eq('id', docId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to extend expiration',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Document expiration extended by 6 months',
      });
      loadDocuments();
    }
  };

  const getExpirationStatus = (expiresAt: string) => {
    const monthsUntilExpiration = differenceInMonths(new Date(expiresAt), new Date());
    
    if (monthsUntilExpiration < 1) return { color: 'destructive', label: 'Expires Soon' };
    if (monthsUntilExpiration < 3) return { color: 'default', label: 'Expiring' };
    return { color: 'secondary', label: 'Active' };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No documents uploaded yet
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => {
              const status = getExpirationStatus(doc.expires_at);
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.file_name}</TableCell>
                  <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(doc.uploaded_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(doc.expires_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.color as any}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {doc.extension_count < 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExtend(doc.id, doc.extension_count)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
