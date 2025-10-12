import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Papa from 'papaparse';

interface ClientImport {
  email: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  address?: string;
  work_phone?: string;
  cell_phone?: string;
  categories?: string;
}

export default function ImportClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);

  const importMutation = useMutation({
    mutationFn: async (data: ClientImport[]) => {
      const { error } = await supabase
        .from('client_imports')
        .insert(data);
      
      if (error) throw error;
      return data.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['client-imports'] });
      setImportResults({ success: count, errors: [] });
      toast({
        title: 'Success',
        description: `${count} clients imported successfully`,
      });
      setFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResults(null);
    }
  };

  const handleImport = () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as ClientImport[];
        const errors: string[] = [];
        
        const validData = data.filter((row, index) => {
          if (!row.email || !row.first_name || !row.last_name) {
            errors.push(`Row ${index + 2}: Missing required fields (email, first_name, or last_name)`);
            return false;
          }
          return true;
        });

        if (errors.length > 0) {
          setImportResults({ success: 0, errors });
          toast({
            title: 'Validation Errors',
            description: `${errors.length} rows had errors. Check the details below.`,
            variant: 'destructive',
          });
        }

        if (validData.length > 0) {
          importMutation.mutate(validData);
        }
      },
      error: (error) => {
        toast({
          title: 'Parse Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const downloadTemplate = () => {
    const template = [
      {
        email: 'client@example.com',
        first_name: 'John',
        last_name: 'Doe',
        company_name: 'ABC Corp',
        address: '123 Main St, City, State 12345',
        work_phone: '555-0100',
        cell_phone: '555-0101',
        categories: 'Tax, Bookkeeping',
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Clients from CSV</CardTitle>
          <CardDescription>
            Upload a CSV file to bulk import client information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Required columns: email, first_name, last_name
              <br />
              Optional columns: company_name, address, work_phone, cell_phone, categories
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={downloadTemplate}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || importMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {importMutation.isPending ? 'Importing...' : 'Import Clients'}
            </Button>
          </div>

          {importResults && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  {importResults.success > 0 && (
                    <p className="text-green-600">
                      Successfully imported {importResults.success} clients
                    </p>
                  )}
                  {importResults.errors.length > 0 && (
                    <div>
                      <p className="font-semibold text-destructive mb-1">Errors:</p>
                      <ul className="list-disc list-inside text-sm">
                        {importResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Imported clients will need to request access through the access request
          form before they can create accounts. They'll use their email and last name to request access.
        </AlertDescription>
      </Alert>
    </div>
  );
}
