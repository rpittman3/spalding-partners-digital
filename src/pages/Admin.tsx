import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'sub-users', label: 'Client Members', icon: Users },
    { id: 'staff', label: 'Staff', icon: UserCircle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'resources', label: 'Client Resources', icon: FolderOpen },
    { id: 'public-resources', label: 'Public Resources', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'deadlines', label: 'Deadlines', icon: Calendar },
    { id: 'meetings', label: 'Meeting Requests', icon: MessageSquare },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'import', label: 'Import Clients', icon: Upload },
    { id: 'view-imports', label: 'Imported Clients', icon: Eye },
    { id: 'access-requests', label: 'Access Requests', icon: UserCircle },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
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
                {menuItems.find((item) => item.id === activeSection)?.label || 'Dashboard'}
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
