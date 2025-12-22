import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { format } from 'date-fns';
import { Check, X, Search, Mail, Loader2, RefreshCw } from 'lucide-react';

interface AccessRequest {
  id: string;
  email: string;
  last_name: string;
  status: string;
  requested_at: string | null;
  code_expires_at: string;
  access_code: string;
}

export default function AccessRequestManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'deny' | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['access-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data as AccessRequest[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (request: AccessRequest) => {
      // Generate new access code
      const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      // Update the request with the new code and status
      const { error: updateError } = await supabase
        .from('access_requests')
        .update({
          status: 'pending',
          access_code: accessCode,
          code_expires_at: codeExpiresAt,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Send access code email
      const { error: emailError } = await supabase.functions.invoke('send-access-code', {
        body: { email: request.email, accessCode },
      });

      if (emailError) {
        console.error('Failed to send email:', emailError);
        throw new Error('Failed to send access code email');
      }

      return { accessCode };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
      toast({
        title: 'Request Approved',
        description: 'Access code has been sent to the client.',
      });
      setSelectedRequest(null);
      setActionType(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve request',
        variant: 'destructive',
      });
    },
  });

  const denyMutation = useMutation({
    mutationFn: async (request: AccessRequest) => {
      const { error } = await supabase
        .from('access_requests')
        .update({ status: 'denied' })
        .eq('id', request.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
      toast({
        title: 'Request Denied',
        description: 'The access request has been denied.',
      });
      setSelectedRequest(null);
      setActionType(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to deny request',
        variant: 'destructive',
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (request: AccessRequest) => {
      // Generate new access code
      const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      // Update the request with the new code
      const { error: updateError } = await supabase
        .from('access_requests')
        .update({
          access_code: accessCode,
          code_expires_at: codeExpiresAt,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Send access code email
      const { error: emailError } = await supabase.functions.invoke('send-access-code', {
        body: { email: request.email, accessCode },
      });

      if (emailError) {
        console.error('Failed to send email:', emailError);
        throw new Error('Failed to send access code email');
      }

      return { accessCode };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-requests'] });
      toast({
        title: 'Email Resent',
        description: 'A new access code has been sent to the client.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend email',
        variant: 'destructive',
      });
    },
  });

  const handleAction = () => {
    if (!selectedRequest || !actionType) return;

    if (actionType === 'approve') {
      approveMutation.mutate(selectedRequest);
    } else {
      denyMutation.mutate(selectedRequest);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Approval</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Code Sent</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Denied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRequests = requests?.filter(
    (request) =>
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingApprovalRequests = filteredRequests?.filter(r => r.status === 'pending_approval') || [];
  const otherRequests = filteredRequests?.filter(r => r.status !== 'pending_approval') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or last name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {pendingApprovalRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Approval ({pendingApprovalRequests.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            These clients were not found in the import list and require manual approval.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovalRequests.map((request) => (
                <TableRow key={request.id} className="bg-yellow-50/50">
                  <TableCell className="font-medium">{request.email}</TableCell>
                  <TableCell>{request.last_name}</TableCell>
                  <TableCell>
                    {request.requested_at
                      ? format(new Date(request.requested_at), 'MMM d, yyyy h:mm a')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => {
                          setSelectedRequest(request);
                          setActionType('approve');
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedRequest(request);
                          setActionType('deny');
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {otherRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Access Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.email}</TableCell>
                  <TableCell>{request.last_name}</TableCell>
                  <TableCell>
                    {request.requested_at
                      ? format(new Date(request.requested_at), 'MMM d, yyyy h:mm a')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {format(new Date(request.code_expires_at), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    {(request.status === 'pending' || request.status === 'approved') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resendMutation.mutate(request)}
                        disabled={resendMutation.isPending}
                      >
                        {resendMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Resend
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {(!filteredRequests || filteredRequests.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No access requests found.
        </div>
      )}

      <AlertDialog open={!!selectedRequest && !!actionType} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve Access Request' : 'Deny Access Request'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' ? (
                <>
                  This will generate an access code and send it to <strong>{selectedRequest?.email}</strong>.
                  They will be able to create an account using this code.
                </>
              ) : (
                <>
                  This will deny the access request from <strong>{selectedRequest?.email}</strong>.
                  They will not be notified automatically.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === 'deny' ? 'bg-destructive hover:bg-destructive/90' : ''}
              disabled={approveMutation.isPending || denyMutation.isPending}
            >
              {(approveMutation.isPending || denyMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {actionType === 'approve' ? 'Approve & Send Code' : 'Deny Request'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
