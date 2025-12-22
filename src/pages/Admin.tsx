import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DashboardStats from '@/components/admin/DashboardStats';
import ClientManagement from '@/components/admin/ClientManagement';
import DocumentManagement from '@/components/admin/DocumentManagement';
import ResourceManagement from '@/components/admin/ResourceManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import SubUserManagement from '@/components/admin/SubUserManagement';
import ImportClients from '@/components/admin/ImportClients';
import ViewImportedClients from '@/components/admin/ViewImportedClients';
import AccessRequestManagement from '@/components/admin/AccessRequestManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import MeetingRequestManagement from '@/components/admin/MeetingRequestManagement';
import Settings from '@/components/admin/Settings';
import NotificationManagement from '@/components/admin/NotificationManagement';
import DeadlineManagement from '@/components/admin/DeadlineManagement';
import FAQManagement from '@/components/admin/FAQManagement';
import StaffManagement from '@/components/admin/StaffManagement';
import PublicResourceManagement from '@/components/admin/PublicResourceManagement';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserCircle,
  FolderOpen,
  Bell,
  Calendar,
  MessageSquare,
  Tags,
  Globe,
  Upload,
  Eye,
  History,
  Settings as SettingsIcon,
  LogOut,
  HelpCircle,
  Home,
  ChevronDown,
} from 'lucide-react';

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [clientsOpen, setClientsOpen] = useState(true);
  const [siteUpdatesOpen, setSiteUpdatesOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const clientMenuItems = [
    { id: 'clients', label: 'Current Clients', icon: Users },
    { id: 'sub-users', label: 'Client Members', icon: Users },
    { id: 'documents', label: 'Client Documents', icon: FileText },
    { id: 'meetings', label: 'Meeting Requests', icon: MessageSquare },
    { id: 'view-imports', label: 'Imported Clients', icon: Eye },
    { id: 'access-requests', label: 'Access Requests', icon: UserCircle },
    { id: 'categories', label: 'Client Categories', icon: Tags },
  ];

  const siteUpdatesMenuItems = [
    { id: 'resources', label: 'Client Resources', icon: FolderOpen },
    { id: 'public-resources', label: 'Public Resources', icon: Globe },
    { id: 'deadlines', label: 'Deadlines', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'staff', label: 'Staff', icon: UserCircle },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  const topLevelItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const bottomItems = [
    { id: 'import', label: 'Import Clients', icon: Upload },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const isClientSection = clientMenuItems.some(item => item.id === activeSection);
  const isSiteUpdatesSection = siteUpdatesMenuItems.some(item => item.id === activeSection);

  const renderMenuItem = (item: { id: string; label: string; icon: React.ElementType }, indent = false) => (
    <button
      key={item.id}
      onClick={() => setActiveSection(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        indent ? 'pl-8' : ''
      } ${
        activeSection === item.id
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
        </div>
        <nav className="p-4 space-y-2">
          {/* Dashboard */}
          {topLevelItems.map((item) => renderMenuItem(item))}

          {/* Clients Group */}
          <Collapsible open={clientsOpen} onOpenChange={setClientsOpen}>
            <CollapsibleTrigger className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-muted ${isClientSection ? 'text-primary font-medium' : ''}`}>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>Clients</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${clientsOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {clientMenuItems.map((item) => renderMenuItem(item, true))}
            </CollapsibleContent>
          </Collapsible>

          {/* Site Updates Group */}
          <Collapsible open={siteUpdatesOpen} onOpenChange={setSiteUpdatesOpen}>
            <CollapsibleTrigger className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-muted ${isSiteUpdatesSection ? 'text-primary font-medium' : ''}`}>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5" />
                <span>Site Updates</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${siteUpdatesOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {siteUpdatesMenuItems.map((item) => renderMenuItem(item, true))}
            </CollapsibleContent>
          </Collapsible>

          {/* Bottom Items */}
          {bottomItems.map((item) => renderMenuItem(item))}

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted"
          >
            <Home className="h-5 w-5" />
            <span>Home Page</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {[...topLevelItems, ...clientMenuItems, ...siteUpdatesMenuItems, ...bottomItems].find((item) => item.id === activeSection)?.label || 'Dashboard'}
              </CardTitle>
              <CardDescription>
                {activeSection === 'dashboard' && 'Overview of your admin portal'}
                {activeSection === 'clients' && 'Manage client accounts and information'}
                {activeSection === 'sub-users' && 'Manage client team member accounts'}
                {activeSection === 'staff' && 'Manage staff members'}
                {activeSection === 'documents' && 'View and manage client documents'}
                {activeSection === 'resources' && 'Upload and organize resources for clients'}
                {activeSection === 'public-resources' && 'Manage resources on the public Resources page'}
                {activeSection === 'notifications' && 'Create and manage notifications'}
                {activeSection === 'deadlines' && 'Manage tax and financial deadlines'}
                {activeSection === 'meetings' && 'Review and respond to meeting requests'}
                {activeSection === 'categories' && 'Manage client categories'}
                {activeSection === 'faqs' && 'Manage frequently asked questions'}
                {activeSection === 'import' && 'Import clients from CSV'}
                {activeSection === 'view-imports' && 'View imported clients and their access request status'}
                {activeSection === 'access-requests' && 'Approve or deny access requests from clients not in import list'}
                {activeSection === 'audit' && 'View system audit logs'}
                {activeSection === 'settings' && 'Configure system settings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSection === 'dashboard' && <DashboardStats onNavigate={setActiveSection} />}
              {activeSection === 'clients' && <ClientManagement />}
              {activeSection === 'sub-users' && <SubUserManagement />}
              {activeSection === 'staff' && <StaffManagement />}
              {activeSection === 'documents' && <DocumentManagement />}
              {activeSection === 'resources' && <ResourceManagement />}
              {activeSection === 'public-resources' && <PublicResourceManagement />}
              {activeSection === 'meetings' && <MeetingRequestManagement />}
              {activeSection === 'categories' && <CategoryManagement />}
              {activeSection === 'faqs' && <FAQManagement />}
              {activeSection === 'import' && <ImportClients />}
              {activeSection === 'view-imports' && <ViewImportedClients />}
              {activeSection === 'access-requests' && <AccessRequestManagement />}
              {activeSection === 'audit' && <AuditLogs />}
              {activeSection === 'settings' && <Settings />}
              {activeSection === 'notifications' && <NotificationManagement />}
              {activeSection === 'deadlines' && <DeadlineManagement />}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
