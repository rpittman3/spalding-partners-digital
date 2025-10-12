import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Clock, FileText, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentUploader from "@/components/client/DocumentUploader";
import DocumentList from "@/components/client/DocumentList";
import DeadlinesList from "@/components/client/DeadlinesList";
import ResourcesList from "@/components/client/ResourcesList";

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
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Deadlines
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">
                      Next 90 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Documents
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">
                      Total uploaded
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Resources
                    </CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">
                      Available downloads
                    </p>
                  </CardContent>
                </Card>
              </div>

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
                  
                  <div>
                    <h3 className="font-semibold mb-4">Your Documents</h3>
                    <DocumentList refreshTrigger={refreshDocuments} />
                  </div>
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
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
