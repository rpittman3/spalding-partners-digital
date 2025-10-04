import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Upload, Download, Clock, CheckCircle, AlertCircle, File } from "lucide-react";

// Mock data
const upcomingDeadlines = [{
  id: 1,
  title: "Q1 Tax Filing",
  date: "2025-04-15",
  status: "upcoming",
  description: "Individual tax return deadline"
}, {
  id: 2,
  title: "Quarterly Estimated Payment",
  date: "2025-06-15",
  status: "upcoming",
  description: "Q2 estimated tax payment due"
}, {
  id: 3,
  title: "Financial Statement Review",
  date: "2025-03-31",
  status: "urgent",
  description: "Monthly financial review meeting"
}];
const resources = [{
  id: 1,
  title: "Tax Planning Guide 2025",
  type: "PDF",
  size: "2.4 MB",
  date: "2025-01-15"
}, {
  id: 2,
  title: "Quarterly Tax Organizer",
  type: "Excel",
  size: "1.2 MB",
  date: "2025-01-10"
}, {
  id: 3,
  title: "Business Expense Categories",
  type: "PDF",
  size: "856 KB",
  date: "2024-12-20"
}];
const recentDocuments = [{
  id: 1,
  name: "2024_Tax_Return_Final.pdf",
  uploadedBy: "Sarah Spalding",
  date: "2025-02-15",
  size: "3.2 MB"
}, {
  id: 2,
  name: "January_Financial_Statements.xlsx",
  uploadedBy: "Jennifer Martinez",
  date: "2025-02-10",
  size: "1.8 MB"
}, {
  id: 3,
  name: "W2_Forms_2024.pdf",
  uploadedBy: "You",
  date: "2025-02-05",
  size: "524 KB"
}];
const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-15 pb-16">
        <div className="container-custom">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, Client Name
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your account and important dates
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Quick Stats */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Deadlines
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
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
                    <div className="text-2xl font-bold">12</div>
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
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      Available downloads
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Important Deadlines
                  </CardTitle>
                  <CardDescription>
                    Stay on top of your upcoming tax and financial deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.map(deadline => <div key={deadline.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-accent transition-fast">
                        {deadline.status === "urgent" ? <AlertCircle className="h-5 w-5 text-accent mt-0.5" /> : <CheckCircle className="h-5 w-5 text-primary mt-0.5" />}
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {deadline.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {deadline.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(deadline.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>)}
                  </div>
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
                <CardContent>
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-8 mb-6 hover:border-accent transition-fast">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        Upload Documents
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your files here, or click to browse
                      </p>
                      <Button variant="outline">
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {/* Recent Documents */}
                  <div>
                    <h3 className="font-semibold mb-4">Recent Documents</h3>
                    <div className="space-y-3">
                      {recentDocuments.map(doc => <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-fast">
                          <div className="flex items-center gap-4">
                            <File className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded by {doc.uploadedBy} on{" "}
                                {new Date(doc.date).toLocaleDateString()} • {doc.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>)}
                    </div>
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
                  <div className="grid gap-4 md:grid-cols-2">
                    {resources.map(resource => <div key={resource.id} className="p-6 rounded-lg border border-border hover:border-accent hover:shadow-custom-md transition-smooth">
                        <div className="flex items-start justify-between mb-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {resource.type}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-2">{resource.title}</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                          Updated {new Date(resource.date).toLocaleDateString()} • {resource.size}
                        </p>
                        <Button variant="outline" className="w-full" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Our team is here to assist you with any questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      View FAQ
                    </Button>
                    <Button variant="cta" className="w-full justify-start">
                      Contact Your Accountant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>;
};
export default ClientPortal;