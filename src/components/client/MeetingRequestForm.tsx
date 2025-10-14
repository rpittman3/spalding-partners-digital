import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock } from "lucide-react";
import { fromZonedTime } from "date-fns-tz";

export default function MeetingRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    option1: "",
    option2: "",
    option3: "",
    subject: ""
  });

  const requestMeeting = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error("Not authenticated");

      const tz = "America/New_York";
      const option1Utc = fromZonedTime(data.option1, tz).toISOString();
      const option2Utc = data.option2 ? fromZonedTime(data.option2, tz).toISOString() : null;
      const option3Utc = data.option3 ? fromZonedTime(data.option3, tz).toISOString() : null;

      const { data: insertData, error } = await supabase
        .from("meeting_requests")
        .insert({
          user_id: user.id,
          option_1: option1Utc,
          option_2: option2Utc,
          option_3: option3Utc,
          subject: data.subject,
          status: "pending"
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification email to admin
      const { error: emailError } = await supabase.functions.invoke("send-meeting-notification", {
        body: { requestId: insertData.id }
      });

      if (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't throw - the request was created successfully
      }

      return insertData;
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["meeting-requests"] });
      toast({
        title: "Meeting Request Submitted",
        description: "We'll be in touch soon to confirm your appointment."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit meeting request. Please try again.",
        variant: "destructive"
      });
      console.error("Meeting request error:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.option1 || !formData.subject) {
      toast({
        title: "Required Fields",
        description: "Please provide at least one date/time option and a meeting subject.",
        variant: "destructive"
      });
      return;
    }

    requestMeeting.mutate(formData);
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Request Submitted</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg">
            Someone from our office will be in touch with you to schedule an appointment.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Request a Meeting
        </CardTitle>
        <CardDescription>
          Provide up to three date and time options that work for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">What is this meeting for? *</Label>
              <Textarea
                id="subject"
                placeholder="Brief description of what you'd like to discuss..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Date & Time Options
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="option1">Option 1 *</Label>
                <Input
                  id="option1"
                  type="datetime-local"
                  value={formData.option1}
                  onChange={(e) => setFormData({ ...formData, option1: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="option2">Option 2 (Optional)</Label>
                <Input
                  id="option2"
                  type="datetime-local"
                  value={formData.option2}
                  onChange={(e) => setFormData({ ...formData, option2: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="option3">Option 3 (Optional)</Label>
                <Input
                  id="option3"
                  type="datetime-local"
                  value={formData.option3}
                  onChange={(e) => setFormData({ ...formData, option3: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={requestMeeting.isPending}
          >
            {requestMeeting.isPending ? "Submitting..." : "Submit Meeting Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
