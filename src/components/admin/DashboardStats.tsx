import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, MessageSquare } from 'lucide-react';

interface DashboardStatsProps {
  onNavigate?: (section: string) => void;
}

export default function DashboardStats({ onNavigate }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalClients: 0,
    unseenDocuments: 0,
    upcomingDeadlines: 0,
    pendingMeetings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [clients, documents, deadlines, meetings] = await Promise.all([
      supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
      supabase.from('documents').select('id', { count: 'exact', head: true }).eq('is_seen_by_admin', false),
      supabase.from('deadlines').select('id', { count: 'exact', head: true }).gte('due_date', new Date().toISOString().split('T')[0]),
      supabase.from('meeting_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    setStats({
      totalClients: clients.count || 0,
      unseenDocuments: documents.count || 0,
      upcomingDeadlines: deadlines.count || 0,
      pendingMeetings: meetings.count || 0,
    });
  };

  const statCards = [
    { title: 'Total Clients', value: stats.totalClients, icon: Users, color: 'text-blue-600', section: 'clients' },
    { title: 'Unseen Documents', value: stats.unseenDocuments, icon: FileText, color: 'text-orange-600', section: 'documents' },
    { title: 'Upcoming Deadlines', value: stats.upcomingDeadlines, icon: Calendar, color: 'text-green-600', section: 'deadlines' },
    { title: 'Pending Meetings', value: stats.pendingMeetings, icon: MessageSquare, color: 'text-purple-600', section: 'meetings' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card 
          key={stat.title}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate?.(stat.section)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
