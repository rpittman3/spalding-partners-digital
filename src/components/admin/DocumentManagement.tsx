import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff, Download, Upload, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SendDocumentDialog from './SendDocumentDialog';

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  uploaded_by: string;
  user_id: string;
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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
        profiles!documents_user_id_fkey (
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
      setSelectedIds(new Set());
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

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('client-documents')
        .download(filePath);

      if (!downloadError && fileBlob) {
        const url = URL.createObjectURL(fileBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      console.warn('Direct download failed, falling back to signed URL:', downloadError);
      const { data, error } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      const signedUrl = data?.signedUrl;
      if (!signedUrl) throw new Error('Missing signed URL');

      const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const absoluteUrl = signedUrl.startsWith('http')
        ? signedUrl
        : `${baseUrl}/storage/v1${signedUrl}`;

      window.location.assign(absoluteUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) return;

    setIsDownloading(true);
    const selectedDocs = documents.filter(doc => selectedIds.has(doc.id));
    
    let successCount = 0;
    let failCount = 0;

    for (const doc of selectedDocs) {
      try {
        const { data: fileBlob, error: downloadError } = await supabase.storage
          .from('client-documents')
          .download(doc.file_path);

        if (!downloadError && fileBlob) {
          const url = URL.createObjectURL(fileBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.file_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          successCount++;
          // Small delay between downloads to avoid browser blocking
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setIsDownloading(false);

    if (failCount === 0) {
      toast({
        title: 'Success',
        description: `Downloaded ${successCount} document${successCount !== 1 ? 's' : ''}`,
      });
    } else {
      toast({
        title: 'Partial Success',
        description: `Downloaded ${successCount}, failed ${failCount}`,
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    const selectedDocs = documents.filter(doc => selectedIds.has(doc.id));
    
    let successCount = 0;
    let failCount = 0;

    for (const doc of selectedDocs) {
      try {
        // Delete from storage first
        const { error: storageError } = await supabase.storage
          .from('client-documents')
          .remove([doc.file_path]);

        if (storageError) {
          console.warn('Storage delete failed:', storageError);
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', doc.id);

        if (dbError) {
          failCount++;
        } else {
          successCount++;
        }
      } catch {
        failCount++;
      }
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);

    if (failCount === 0) {
      toast({
        title: 'Success',
        description: `Deleted ${successCount} document${successCount !== 1 ? 's' : ''}`,
      });
    } else {
      toast({
        title: 'Partial Success',
        description: `Deleted ${successCount}, failed ${failCount}`,
        variant: 'destructive',
      });
    }

    loadDocuments();
  };

  const toggleSelection = (docId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = (docs: Document[]) => {
    const docIds = docs.map(d => d.id);
    const allSelected = docIds.every(id => selectedIds.has(id));
    
    const newSelected = new Set(selectedIds);
    if (allSelected) {
      docIds.forEach(id => newSelected.delete(id));
    } else {
      docIds.forEach(id => newSelected.add(id));
    }
    setSelectedIds(newSelected);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const clientDocs = documents.filter(doc => doc.uploaded_by === doc.user_id);
  const adminDocs = documents.filter(doc => doc.uploaded_by !== doc.user_id);

  const renderDocumentTable = (docs: Document[], emptyMessage: string) => {
    const docIds = docs.map(d => d.id);
    const allSelected = docs.length > 0 && docIds.every(id => selectedIds.has(id));
    const someSelected = docIds.some(id => selectedIds.has(id));

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => toggleSelectAll(docs)}
                aria-label="Select all"
                disabled={docs.length === 0}
                className={someSelected && !allSelected ? 'data-[state=checked]:bg-primary/50' : ''}
              />
            </TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => (
              <TableRow 
                key={doc.id} 
                className={`${!doc.is_seen_by_admin ? 'font-bold' : ''} ${selectedIds.has(doc.id) ? 'bg-muted/50' : ''}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(doc.id)}
                    onCheckedChange={() => toggleSelection(doc.id)}
                    aria-label={`Select ${doc.file_name}`}
                  />
                </TableCell>
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(doc.file_path, doc.file_name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={handleBulkDownload}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : `Download (${selectedIds.size})`}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedIds.size})
              </Button>
            </>
          )}
        </div>
        <Button onClick={() => setSendDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Send Document to Client
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading documents...</div>
      ) : (
        <div className="space-y-6">
          {clientDocs.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Documents from Clients</h3>
              <div className="border rounded-lg">
                {renderDocumentTable(clientDocs, "No documents from clients yet")}
              </div>
            </div>
          )}
          
          {adminDocs.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Documents Sent to Clients</h3>
              <div className="border rounded-lg">
                {renderDocumentTable(adminDocs, "No documents sent to clients yet")}
              </div>
            </div>
          )}

          {documents.length === 0 && (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              No documents yet
            </div>
          )}
        </div>
      )}

      <SendDocumentDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        onSuccess={loadDocuments}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} document{selectedIds.size !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected documents will be permanently deleted from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
