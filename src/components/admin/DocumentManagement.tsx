import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Download, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SendDocumentDialog from './SendDocumentDialog';

interface Document {
  id: string;
  file_name: string;
  uploaded_at: string;
  file_size: number;
  is_seen_by_admin: boolean;
  profiles: {
    first_name: string;
    last_name: string;
    company_name: string | null;
  };
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          company_name
        )
      `)
      .order('is_seen_by_admin', { ascending: true })
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

  const toggleSeen = async (docId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('documents')
      .update({ is_seen_by_admin: !currentStatus })
      .eq('id', docId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update document status',
        variant: 'destructive',
      });
    } else {
      loadDocuments();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setSendDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Send Document to Client
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading documents...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No documents found
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id} className={!doc.is_seen_by_admin ? 'font-bold' : ''}>
                    <TableCell>{doc.file_name}</TableCell>
                    <TableCell>
                      {doc.profiles.company_name || 
                        `${doc.profiles.first_name} ${doc.profiles.last_name}`}
                    </TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(doc.uploaded_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {!doc.is_seen_by_admin ? (
                        <Badge variant="default">New</Badge>
                      ) : (
                        <Badge variant="secondary">Seen</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSeen(doc.id, doc.is_seen_by_admin)}
                        >
                          {doc.is_seen_by_admin ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <SendDocumentDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        onSuccess={loadDocuments}
      />
    </div>
  );
}
