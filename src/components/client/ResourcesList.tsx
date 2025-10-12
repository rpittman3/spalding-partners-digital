import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_size: number;
  is_important: boolean;
  created_at: string;
}

export default function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadResources();
  }, [user]);

  const loadResources = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) return;

    // Get user's categories
    const { data: userCategories } = await supabase
      .from('user_categories')
      .select('category_id')
      .eq('user_id', profile.id);

    const categoryIds = userCategories?.map((uc) => uc.category_id) || [];

    // Get resources for user's categories or ALL category
    const { data: resourceCategories } = await supabase
      .from('resource_categories')
      .select('resource_id, categories!inner(name)')
      .or(`category_id.in.(${categoryIds.join(',')}),categories.name.eq.ALL`);

    const resourceIds = [...new Set(resourceCategories?.map((rc) => rc.resource_id))];

    const { data } = await supabase
      .from('resources')
      .select('*')
      .in('id', resourceIds)
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false });

    setResources(data || []);
    setLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="space-y-4">
      {resources.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No resources available
          </CardContent>
        </Card>
      ) : (
        resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {resource.title}
                    {resource.is_important && (
                      <Badge variant="destructive" className="ml-2">
                        Important
                      </Badge>
                    )}
                  </CardTitle>
                  {resource.description && (
                    <CardDescription>{resource.description}</CardDescription>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Size: {formatFileSize(resource.file_size)}
                  </p>
                </div>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}
