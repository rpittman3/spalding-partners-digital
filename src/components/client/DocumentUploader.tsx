import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText } from 'lucide-react';

export default function DocumentUploader({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!user) return;

    setUploading(true);

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('client-documents')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from('documents').insert({
      user_id: user.id,
      uploaded_by: user.id,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type,
      is_seen_by_admin: false,
      is_seen_by_client: true,
    });

    if (dbError) {
      toast({
        title: 'Error',
        description: 'Failed to save document record',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      onUploadComplete?.();
    }

    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted rounded-full">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium mb-1">
              {uploading ? 'Uploading...' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, Excel, Word documents, and images (Max 10MB)
            </p>
          </div>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button disabled={uploading} asChild>
              <span>
                <FileText className="h-4 w-4 mr-2" />
                Select File
              </span>
            </Button>
          </Label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleChange}
            disabled={uploading}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
        </div>
      </div>
    </div>
  );
}
