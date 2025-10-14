import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Archive, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface MeetingRequest {
  id: string;
  user_id: string;
  option_1: string;
  option_2: string | null;
  option_3: string | null;
  subject: string;
  status: string;
  requested_at: string;
  is_archived: boolean;
  appointment_set: boolean;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    cell_phone: string | null;
    work_phone: string | null;
  };
}

export default function MeetingRequestManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-meeting-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_requests")
        .select(`
          *,
          profiles!meeting_requests_user_id_fkey (
            first_name,
            last_name,
            email,
            cell_phone,
            work_phone
          )
        `)
        .order("requested_at", { ascending: false });

      if (error) throw error;
      return data as MeetingRequest[];
    }
  });

  const updateRequest = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Pick<MeetingRequest, "is_archived" | "appointment_set">> 
    }) => {
      const { error } = await supabase
        .from("meeting_requests")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-meeting-requests"] });
      toast({
        title: "Updated",
        description: "Meeting request updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update meeting request.",
        variant: "destructive"
      });
      console.error("Update error:", error);
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading meeting requests...</div>
        </CardContent>
      </Card>
    );
  }

  const activeRequests = requests?.filter(r => !r.is_archived) || [];
  const archivedRequests = requests?.filter(r => r.is_archived) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting Requests
          </CardTitle>
          <CardDescription>
            Manage client meeting requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Active Requests</h3>
              {activeRequests.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active meeting requests</p>
              ) : (
                <div className="space-y-3">
                  {activeRequests.map((request) => (
                    <MeetingRequestCard
                      key={request.id}
                      request={request}
                      onUpdate={updateRequest.mutate}
                    />
                  ))}
                </div>
              )}
            </div>

            {archivedRequests.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  Archived Requests
                </h3>
                <div className="space-y-3">
                  {archivedRequests.map((request) => (
                    <MeetingRequestCard
                      key={request.id}
                      request={request}
                      onUpdate={updateRequest.mutate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MeetingRequestCard({ 
  request, 
  onUpdate 
}: { 
  request: MeetingRequest; 
  onUpdate: (params: { id: string; updates: Partial<Pick<MeetingRequest, "is_archived" | "appointment_set">> }) => void;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              {request.profiles.first_name} {request.profiles.last_name}
            </h4>
            {request.appointment_set && (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Appointment Set
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>{request.profiles.email}</p>
            {request.profiles.cell_phone && <p>Cell: {request.profiles.cell_phone}</p>}
            {request.profiles.work_phone && <p>Work: {request.profiles.work_phone}</p>}
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {format(new Date(request.requested_at), "MMM d, yyyy")}
        </Badge>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Subject:</p>
        <p className="text-sm">{request.subject}</p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Preferred Times (Eastern Time):</p>
        <div className="space-y-1 text-sm">
          <p>1. {formatInTimeZone(new Date(request.option_1), "America/New_York", "MMM d, yyyy 'at' h:mm a")}</p>
          {request.option_2 && <p>2. {formatInTimeZone(new Date(request.option_2), "America/New_York", "MMM d, yyyy 'at' h:mm a")}</p>}
          {request.option_3 && <p>3. {formatInTimeZone(new Date(request.option_3), "America/New_York", "MMM d, yyyy 'at' h:mm a")}</p>}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        {!request.appointment_set && (
          <Button
            size="sm"
            variant="default"
            onClick={() => onUpdate({ 
              id: request.id, 
              updates: { appointment_set: true } 
            })}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark as Set
          </Button>
        )}
        
        {request.appointment_set && !request.is_archived && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate({ 
              id: request.id, 
              updates: { appointment_set: false } 
            })}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Unmark
          </Button>
        )}

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onUpdate({ 
            id: request.id, 
            updates: { is_archived: !request.is_archived } 
          })}
        >
          <Archive className="h-4 w-4 mr-1" />
          {request.is_archived ? "Unarchive" : "Archive"}
        </Button>
      </div>
    </div>
  );
}
