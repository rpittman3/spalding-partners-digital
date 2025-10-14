import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Clock, FileText, Download, Bell } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentUploader from "@/components/client/DocumentUploader";
import DocumentList from "@/components/client/DocumentList";
import DeadlinesList from "@/components/client/DeadlinesList";
import ResourcesList from "@/components/client/ResourcesList";
import SubUserManager from "@/components/client/SubUserManager";
import DashboardStats from "@/components/client/DashboardStats";
import NotificationsList from "@/components/client/NotificationsList";
import MeetingRequestForm from "@/components/client/MeetingRequestForm";

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow offset-header py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Client Portal</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email}! Access your documents, deadlines, and more.
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="meeting">Schedule Meeting</TabsTrigger>
              <TabsTrigger value="team">My Team</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <DashboardStats />

              <Card>
                <CardHeader>
                  <CardTitle>Important Deadlines</CardTitle>
                  <CardDescription>
                    Stay on top of your upcoming tax and financial deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeadlinesList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Important updates and announcements from Spalding & Partners Financial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationsList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>
                    Upload and manage your financial documents securely
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DocumentUploader 
                    onUploadComplete={() => setRefreshDocuments(prev => prev + 1)}
                  />
                  
                  <DocumentList refreshTrigger={refreshDocuments} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Resources</CardTitle>
                  <CardDescription>
                    Helpful guides, templates, and tools from your accounting team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourcesList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Meeting Tab */}
            <TabsContent value="meeting" className="space-y-6">
              <MeetingRequestForm />
            </TabsContent>

            {/* My Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <SubUserManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
