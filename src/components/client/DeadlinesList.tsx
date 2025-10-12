import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';

interface Deadline {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
}

export default function DeadlinesList() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadDeadlines();
  }, [user]);

  const loadDeadlines = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) return;

    // Get user's categories
    const { data: userCategories } = await supabase
      .from('user_categories')
      .select('category_id')
      .eq('user_id', profile.id);

    const categoryIds = userCategories?.map((uc) => uc.category_id) || [];

    // Get deadlines for user's categories or ALL category
    const { data: deadlineCategories } = await supabase
      .from('deadline_categories')
      .select('deadline_id, categories!inner(name)')
      .or(`category_id.in.(${categoryIds.join(',')}),categories.name.eq.ALL`);

    const deadlineIds = [...new Set(deadlineCategories?.map((dc) => dc.deadline_id))];

    const { data } = await supabase
      .from('deadlines')
      .select('*')
      .in('id', deadlineIds)
      .gte('due_date', new Date().toISOString().split('T')[0])
      .order('due_date', { ascending: true });

    setDeadlines(data || []);
    setLoading(false);
  };

  const getUrgency = (dueDate: string) => {
    const days = differenceInDays(new Date(dueDate), new Date());
    if (days <= 7) return { color: 'destructive', label: 'Urgent' };
    if (days <= 30) return { color: 'default', label: 'Coming Up' };
    return { color: 'secondary', label: 'Upcoming' };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Loading deadlines...</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {deadlines.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No upcoming deadlines
          </CardContent>
        </Card>
      ) : (
        deadlines.map((deadline) => {
          const urgency = getUrgency(deadline.due_date);
          return (
            <Card key={deadline.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {deadline.title}
                    </CardTitle>
                    <CardDescription>
                      Due {format(new Date(deadline.due_date), 'MMMM d, yyyy')}
                    </CardDescription>
                  </div>
                  <Badge variant={urgency.color as any}>{urgency.label}</Badge>
                </div>
              </CardHeader>
              {deadline.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{deadline.description}</p>
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
