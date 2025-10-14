import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Archive, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  body: string;
  created_at: string;
  is_important: boolean;
  notification_status: {
    is_seen: boolean;
    is_archived: boolean;
  }[];
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, showArchived]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Fetch notifications allowed by RLS (by category/ALL)
      const { data: notifs, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Notifications query result:', { notifs, notifError });

      if (notifError) throw notifError;

      const ids = (notifs || []).map((n: any) => n.id);
      if (ids.length === 0) {
        setNotifications([]);
        return;
      }

      // Fetch status rows for this user for those ids
      const { data: statusRows, error: statusError } = await supabase
        .from('notification_status')
        .select('notification_id, is_seen, is_archived')
        .eq('user_id', user.id)
        .in('notification_id', ids);

      if (statusError) throw statusError;

      const byId: Record<string, any> = {};
      (statusRows || []).forEach((s: any) => {
        byId[s.notification_id] = s;
      });

      const withStatus = (notifs || []).map((n: any) => ({
        ...n,
        notification_status: byId[n.id] ? [byId[n.id]] : [],
      }));

      // Apply archive filter (default when no status: not archived)
      const filtered = withStatus.filter((n: any) => {
        const s = n.notification_status[0];
        const archived = s ? s.is_archived : false;
        return archived === showArchived;
      });

      setNotifications(filtered);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async (notificationId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notification_status')
      .update({ is_seen: true, seen_at: new Date().toISOString() })
      .eq('notification_id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking as seen:', error);
    } else {
      loadNotifications();
    }
  };

  const toggleArchive = async (notificationId: string, currentArchived: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('notification_status')
      .update({ 
        is_archived: !currentArchived,
        archived_at: !currentArchived ? new Date().toISOString() : null
      })
      .eq('notification_id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error toggling archive:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: currentArchived ? 'Notification unarchived' : 'Notification archived',
      });
      loadNotifications();
    }
  };

  const unseenCount = notifications.filter(n => !n.notification_status[0]?.is_seen).length;

  if (loading) {
    return <div className="text-center py-8">Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span className="text-sm font-medium">
            {unseenCount > 0 && !showArchived && (
              <Badge variant="destructive" className="ml-2">
                {unseenCount} New
              </Badge>
            )}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? 'Show Active' : 'Show Archived'}
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {showArchived 
              ? 'No archived notifications' 
              : 'No notifications yet'}
          </p>
        </Card>
      ) : (
        notifications.map((notification) => {
          const isSeen = notification.notification_status[0]?.is_seen;
          const isArchived = notification.notification_status[0]?.is_archived;

          return (
            <Card
              key={notification.id}
              className={`p-4 ${!isSeen ? 'border-primary' : ''}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{notification.title}</h4>
                    {notification.is_important && (
                      <Badge variant="destructive">Important</Badge>
                    )}
                    {!isSeen && (
                      <Badge variant="default">New</Badge>
                    )}
                  </div>
                  <div
                    className="text-sm text-muted-foreground mb-2"
                    dangerouslySetInnerHTML={{ __html: notification.body }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isSeen && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => markAsSeen(notification.id)}
                      title="Mark as seen"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleArchive(notification.id, isArchived)}
                    title={isArchived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
