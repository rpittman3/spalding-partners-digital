import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Mail, Building, Globe } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure your portal settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="supportEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Support Email
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website URL
              </Label>
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Notification Settings</h3>
            <p className="text-sm text-muted-foreground">
              Email notification settings coming soon. Configure when and how clients receive notifications.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Document Retention</h3>
            <p className="text-sm text-muted-foreground">
              Document retention policies coming soon. Set automatic archiving and deletion rules.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Security Settings</h3>
            <p className="text-sm text-muted-foreground">
              Advanced security options coming soon. Configure password policies and two-factor authentication.
            </p>
          </div>

          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
