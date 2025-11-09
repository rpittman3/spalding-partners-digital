import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Calculator } from "lucide-react";
import accountingImage from "@/assets/services-accounting.jpg";
const Accounting = () => {
  const services = [{
    title: "Bookkeeping Services",
    description: "Professional bookkeeping, financial statements, and payroll support for businesses of all sizes.",
    features: ["Daily transaction recording", "Bank reconciliation", "Accounts payable and receivable", "General ledger maintenance"]
  }, {
    title: "Financial Statements",
    description: "Comprehensive financial reporting to give you clear insights into your business performance.",
    features: ["Balance sheets", "Income statements", "Cash flow statements", "Custom financial reports"]
  }, {
    title: "Payroll Support",
    description: "Complete payroll processing services to ensure your employees are paid accurately and on time.",
    features: ["Payroll processing", "Tax withholding calculations", "Quarterly payroll tax returns", "W-2 and 1099 preparation"]
  }, {
    title: "QuickBooks Services",
    description: "Expert setup, training, and ongoing support for QuickBooks accounting software.",
    features: ["QuickBooks setup and customization", "Staff training", "Ongoing technical support", "Data cleanup and optimization"]
  }];
  return <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-15 pb-16 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="offset-header">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <Calculator className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent">Accounting Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Professional Accounting Services
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Keep your business finances organized and accurate with our comprehensive
                bookkeeping, financial statement preparation, and payroll support services.
              </p>
              <Button asChild variant="cta" size="xl">
                <Link to="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img src={accountingImage} alt="Professional accounting services" className="rounded-lg shadow-custom-xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Professional Accounting Matters
            </h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Accurate accounting is the foundation of every successful business. Whether you're
                a small startup or an established company, maintaining clear, organized financial
                records is essential for making informed decisions, ensuring compliance, and
                achieving your business goals.
              </p>
              <p className="text-lg">
                Our accounting services are designed to take the burden of financial record-keeping
                off your shoulders, allowing you to focus on what you do best—running and growing
                your business. With decades of experience, we provide reliable, accurate accounting
                services tailored to your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Accounting Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => <div key={service.title} className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map(feature => <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Benefits of Our Accounting Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Save Time</h4>
                  <p className="text-muted-foreground">
                    Focus on growing your business while we handle the numbers
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Ensure Accuracy</h4>
                  <p className="text-muted-foreground">
                    Professional expertise minimizes errors and ensures compliance
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Make Better Decisions</h4>
                  <p className="text-muted-foreground">
                    Clear financial insights help you make informed business choices
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Stay Compliant</h4>
                  <p className="text-muted-foreground">
                    Meet all regulatory requirements and avoid costly penalties
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24" style={{
      backgroundColor: '#918a6e'
    }}>
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Streamline Your Accounting?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Let our experienced team handle your accounting needs so you can focus on what matters most.
          </p>
          <Button asChild variant="hero" size="xl">
            
          </Button>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Accounting;