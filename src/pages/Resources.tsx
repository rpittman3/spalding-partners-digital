import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, BookOpen, Download, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PublicResource {
  id: string;
  title: string;
  description: string;
  category: 'tax_resources' | 'guides_articles';
  resource_type: 'url' | 'pdf';
  url: string | null;
  file_path: string | null;
  file_name: string | null;
}

const Resources = () => {
  const [taxResources, setTaxResources] = useState<PublicResource[]>([]);
  const [guides, setGuides] = useState<PublicResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    const { data, error } = await supabase
      .from('public_resources')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (!error && data) {
      setTaxResources(data.filter(r => r.category === 'tax_resources'));
      setGuides(data.filter(r => r.category === 'guides_articles'));
    }
    setLoading(false);
  };

  const getDownloadUrl = (filePath: string) => {
    const { data } = supabase.storage.from('public-resources').getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-15 pb-16 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center offset-header">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Financial Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Helpful tools, guides, and links to support your financial success
            </p>
          </div>
        </div>
      </section>

      {/* Tax Resources */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-12">
            <FileText className="h-8 w-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Tax Resources</h2>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading resources...</div>
          ) : taxResources.length === 0 ? (
            <div className="text-center text-muted-foreground">No tax resources available at this time.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taxResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-custom-lg transition-smooth">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {resource.title}
                      {resource.resource_type === 'url' && <ExternalLink className="h-5 w-5 text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resource.resource_type === 'url' && resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2"
                      >
                        Visit Website
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : resource.file_path ? (
                      <a
                        href={getDownloadUrl(resource.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </a>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Guides & Articles */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-12">
            <BookOpen className="h-8 w-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Guides & Articles</h2>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading guides...</div>
          ) : guides.length === 0 ? (
            <div className="text-center text-muted-foreground">No guides available at this time.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-custom-lg transition-smooth">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      {guide.resource_type === 'url' ? (
                        <ExternalLink className="h-6 w-6 text-primary" />
                      ) : (
                        <Download className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {guide.resource_type === 'url' && guide.url ? (
                      <a
                        href={guide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Visit Website
                        </Button>
                      </a>
                    ) : guide.file_path ? (
                      <a
                        href={getDownloadUrl(guide.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Download PDF
                        </Button>
                      </a>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find what you're looking for? Our team is here to help answer your
              financial questions and provide personalized guidance.
            </p>
            <Button asChild variant="cta" size="lg">
              <Link to="/contact">
                Contact Us for Help
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;