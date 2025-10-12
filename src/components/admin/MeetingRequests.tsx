import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Calendar, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export default function MeetingRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: requests, isLoading } = useQuery({
    queryKey: ['meeting-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_requests')
        .select(`
          *,
          client:profiles!meeting_requests_user_id_fkey(first_name, last_name, email, company_name)
        `)
        .order('requested_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, status, option, notes }: { 
      id: string; 
      status: string; 
      option: number | null; 
      notes: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('meeting_requests')
        .update({
          status,
          selected_option: option,
          admin_notes: notes,
          responded_by: user?.id,
          responded_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-requests'] });
      toast({
        title: 'Success',
        description: 'Meeting request updated',
      });
      setSelectedRequest(null);
      setSelectedOption(null);
      setAdminNotes('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleRespond = (status: string) => {
    if (!selectedRequest) return;
    respondMutation.mutate({
      id: selectedRequest.id,
      status,
      option: selectedOption,
      notes: adminNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'pending': 'outline',
      'approved': 'default',
      'declined': 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Meeting Requests
          </CardTitle>
          <CardDescription>
            Review and respond to client meeting requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading meeting requests...</p>
          ) : requests && requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {request.client?.first_name} {request.client?.last_name}
                      {request.client?.company_name && (
                        <span className="text-muted-foreground text-sm block">
                          {request.client.company_name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{request.subject}</TableCell>
                    <TableCell>
                      {format(new Date(request.requested_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No meeting requests found.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Meeting Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label>Client</Label>
                <p className="mt-1">
                  {selectedRequest.client?.first_name} {selectedRequest.client?.last_name}
                  {selectedRequest.client?.company_name && (
                    <span className="text-muted-foreground"> ({selectedRequest.client.company_name})</span>
                  )}
                </p>
              </div>

              <div>
                <Label>Subject</Label>
                <p className="mt-1">{selectedRequest.subject}</p>
              </div>

              <div>
                <Label>Proposed Times</Label>
                <div className="space-y-2 mt-2">
                  {[1, 2, 3].map((num) => {
                    const date = selectedRequest[`option_${num}`];
                    return date ? (
                      <div key={num} className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(date), 'EEEE, MMMM dd, yyyy - h:mm a')}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <>
                  <div>
                    <Label htmlFor="selectedOption">Select Time Slot</Label>
                    <Select
                      value={selectedOption?.toString() || ''}
                      onValueChange={(value) => setSelectedOption(parseInt(value))}
                    >
                      <SelectTrigger id="selectedOption">
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map((num) => {
                          const date = selectedRequest[`option_${num}`];
                          return date ? (
                            <SelectItem key={num} value={num.toString()}>
                              {format(new Date(date), 'EEEE, MMMM dd - h:mm a')}
                            </SelectItem>
                          ) : null;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="adminNotes">Notes (optional)</Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add any notes or alternate time suggestions..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRespond('approved')}
                      disabled={respondMutation.isPending}
                      className="flex-1"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRespond('declined')}
                      disabled={respondMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                </>
              )}

              {selectedRequest.status !== 'pending' && (
                <div>
                  <Label>Response</Label>
                  <Badge variant={getStatusBadge(selectedRequest.status)} className="mt-1">
                    {selectedRequest.status}
                  </Badge>
                  {selectedRequest.selected_option && (
                    <p className="mt-2 text-sm">
                      Selected time: {format(
                        new Date(selectedRequest[`option_${selectedRequest.selected_option}`]),
                        'EEEE, MMMM dd, yyyy - h:mm a'
                      )}
                    </p>
                  )}
                  {selectedRequest.admin_notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Notes: {selectedRequest.admin_notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
