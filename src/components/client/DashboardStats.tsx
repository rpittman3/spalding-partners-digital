import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Download } from 'lucide-react';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    unseenDocuments: 0,
    upcomingDeadlines: 0,
    availableResources: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [documents, deadlines, resources] = await Promise.all([
      supabase
        .from('documents')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_seen_by_client', false)
        .eq('is_expired', false),
      supabase
        .from('deadlines')
        .select('id', { count: 'exact', head: true })
        .gte('due_date', new Date().toISOString().split('T')[0]),
      supabase
        .from('resources')
        .select('id', { count: 'exact', head: true })
    ]);

    setStats({
      unseenDocuments: documents.count || 0,
      upcomingDeadlines: deadlines.count || 0,
      availableResources: resources.count || 0,
    });
  };

  const statCards = [
    { 
      title: 'Upcoming Deadlines', 
      value: stats.upcomingDeadlines, 
      icon: Clock, 
      description: 'Next 90 days' 
    },
    { 
      title: 'New Documents', 
      value: stats.unseenDocuments, 
      icon: FileText, 
      description: 'Unseen documents' 
    },
    { 
      title: 'Resources', 
      value: stats.availableResources, 
      icon: Download, 
      description: 'Available downloads' 
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
