import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from '@/components/admin/DashboardStats';
import ClientManagement from '@/components/admin/ClientManagement';
import DocumentManagement from '@/components/admin/DocumentManagement';
import ResourceManagement from '@/components/admin/ResourceManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  Bell,
  Calendar,
  MessageSquare,
  Tags,
  Upload,
  History,
  Settings,
  LogOut,
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
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'deadlines', label: 'Deadlines', icon: Calendar },
    { id: 'meetings', label: 'Meeting Requests', icon: MessageSquare },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'import', label: 'Import Clients', icon: Upload },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
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
                {activeSection === 'documents' && 'View and manage client documents'}
                {activeSection === 'resources' && 'Upload and organize resources for clients'}
                {activeSection === 'notifications' && 'Create and manage notifications'}
                {activeSection === 'deadlines' && 'Manage tax and financial deadlines'}
                {activeSection === 'meetings' && 'Review and respond to meeting requests'}
                {activeSection === 'categories' && 'Manage client categories'}
                {activeSection === 'import' && 'Import clients from CSV'}
                {activeSection === 'audit' && 'View system audit logs'}
                {activeSection === 'settings' && 'Configure system settings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSection === 'dashboard' && <DashboardStats />}
              {activeSection === 'clients' && <ClientManagement />}
              {activeSection === 'documents' && <DocumentManagement />}
              {activeSection === 'resources' && <ResourceManagement />}
              {activeSection === 'categories' && <CategoryManagement />}
              {['notifications', 'deadlines', 'meetings', 'import', 'audit', 'settings'].includes(activeSection) && (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-lg mb-4">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section coming soon
                  </p>
                  <p className="text-sm">
                    This feature will be implemented next.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
