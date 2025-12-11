import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, Clock, XCircle, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface ImportedClient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  categories: string | null;
  imported_at: string | null;
  account_created: boolean | null;
  access_request_status: 'none' | 'pending' | 'approved' | 'expired';
  access_requested_at: string | null;
}

export default function ViewImportedClients() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['imported-clients-with-status'],
    queryFn: async () => {
      // Fetch all client imports
      const { data: imports, error: importsError } = await supabase
        .from('client_imports')
        .select('*')
        .order('imported_at', { ascending: false });

      if (importsError) throw importsError;

      // Fetch all access requests
      const { data: accessRequests, error: accessError } = await supabase
        .from('access_requests')
        .select('email, status, requested_at, code_expires_at');

      if (accessError) throw accessError;

      // Create a map of access requests by email
      const accessMap = new Map<string, { status: string; requested_at: string | null; code_expires_at: string }>();
      accessRequests?.forEach(req => {
        const existing = accessMap.get(req.email.toLowerCase());
        // Keep the most recent request
        if (!existing || (req.requested_at && existing.requested_at && req.requested_at > existing.requested_at)) {
          accessMap.set(req.email.toLowerCase(), {
            status: req.status || 'pending',
            requested_at: req.requested_at,
            code_expires_at: req.code_expires_at,
          });
        }
      });

      // Combine the data
      const combined: ImportedClient[] = (imports || []).map(client => {
        const accessInfo = accessMap.get(client.email.toLowerCase());
        let accessStatus: ImportedClient['access_request_status'] = 'none';
        
        if (accessInfo) {
          if (accessInfo.status === 'approved' || client.account_created) {
            accessStatus = 'approved';
          } else if (new Date(accessInfo.code_expires_at) < new Date()) {
            accessStatus = 'expired';
          } else {
            accessStatus = 'pending';
          }
        } else if (client.account_created) {
          accessStatus = 'approved';
        }

        return {
          id: client.id,
          email: client.email,
          first_name: client.first_name,
          last_name: client.last_name,
          company_name: client.company_name,
          categories: client.categories,
          imported_at: client.imported_at,
          account_created: client.account_created,
          access_request_status: accessStatus,
          access_requested_at: accessInfo?.requested_at || null,
        };
      });

      return combined;
    },
  });

  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase();
    return (
      client.email.toLowerCase().includes(search) ||
      client.first_name.toLowerCase().includes(search) ||
      client.last_name.toLowerCase().includes(search) ||
      (client.company_name?.toLowerCase().includes(search) ?? false)
    );
  });

  const getStatusBadge = (status: ImportedClient['access_request_status'], accountCreated: boolean | null) => {
    if (accountCreated) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Account Created
        </Badge>
      );
    }

    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Access Requested
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
            <XCircle className="w-3 h-3 mr-1" />
            Code Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <UserPlus className="w-3 h-3 mr-1" />
            Not Requested
          </Badge>
        );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading imported clients...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredClients.length} imported client{filteredClients.length !== 1 ? 's' : ''}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Imported</TableHead>
              <TableHead>Access Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No clients match your search' : 'No clients have been imported yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.company_name || '-'}</TableCell>
                  <TableCell>
                    {client.categories ? (
                      <span className="text-sm">{client.categories}</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {client.imported_at
                      ? format(new Date(client.imported_at), 'MMM d, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(client.access_request_status, client.account_created)}
                      {client.access_requested_at && !client.account_created && (
                        <span className="text-xs text-muted-foreground">
                          Requested: {format(new Date(client.access_requested_at), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
