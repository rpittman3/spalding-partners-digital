import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:user_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'CREATE': 'default',
      'UPDATE': 'secondary',
      'DELETE': 'destructive',
      'VIEW': 'outline',
    };
    return variants[action] || 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Audit Logs
        </CardTitle>
        <CardDescription>
          System activity and user actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading audit logs...</p>
        ) : logs && logs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {log.profiles && typeof log.profiles === 'object' && 'first_name' in log.profiles
                        ? `${log.profiles.first_name} ${log.profiles.last_name}`
                        : 'System'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadge(log.action_type)}>
                        {log.action_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.entity_type || 'N/A'}</TableCell>
                    <TableCell>
                      {log.details ? (
                        <pre className="text-xs max-w-xs overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>{log.ip_address?.toString() || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground">No audit logs found.</p>
        )}
      </CardContent>
    </Card>
  );
}
