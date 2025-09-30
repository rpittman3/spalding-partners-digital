import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Calculator, BookOpen, Download, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Resources = () => {
  const taxResources = [
    {
      title: "IRS Tax Forms & Publications",
      description: "Access commonly used tax forms and publications",
      link: "https://www.irs.gov/forms-instructions",
      external: true,
    },
    {
      title: "Connecticut DRS",
      description: "Connecticut Department of Revenue Services information",
      link: "https://portal.ct.gov/DRS",
      external: true,
    },
    {
      title: "Tax Deadline Calendar",
      description: "Important tax dates and filing deadlines",
      link: "#",
      external: false,
    },
  ];

  const calculators = [
    {
      title: "Tax Estimator",
      description: "Estimate your federal tax liability",
      icon: Calculator,
    },
    {
      title: "Retirement Calculator",
      description: "Calculate retirement savings needs",
      icon: Calculator,
    },
    {
      title: "Business Loan Calculator",
      description: "Evaluate business financing options",
      icon: Calculator,
    },
  ];

  const guides = [
    {
      title: "Small Business Tax Guide",
      description: "Essential tax information for small business owners",
    },
    {
      title: "Retirement Planning Guide",
      description: "Comprehensive retirement planning strategies",
    },
    {
      title: "Year-End Tax Planning",
      description: "Tips to minimize your tax liability",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taxResources.map((resource) => (
              <Card key={resource.title} className="hover:shadow-custom-lg transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {resource.title}
                    {resource.external && <ExternalLink className="h-5 w-5 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {resource.external ? (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2"
                    >
                      Visit Website
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Button variant="outline" size="sm">
                      View Resource
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Calculators */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-12">
            <Calculator className="h-8 w-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Financial Calculators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calculator) => {
              const Icon = calculator.icon;
              return (
                <Card key={calculator.title} className="hover:shadow-custom-lg transition-smooth">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>{calculator.title}</CardTitle>
                    <CardDescription>{calculator.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Calculator
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guides & Articles */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-12">
            <BookOpen className="h-8 w-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Guides & Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.title} className="hover:shadow-custom-lg transition-smooth">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Need Personalized Financial Guidance?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            While these resources are helpful, nothing beats personalized advice from
            experienced professionals. Let's discuss your specific situation.
          </p>
          <Button asChild variant="hero" size="xl">
            <Link to="/contact">
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
