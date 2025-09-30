import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, FileText } from "lucide-react";
import taxImage from "@/assets/services-tax.jpg";

const Tax = () => {
  const services = [
    {
      title: "Individual Tax Preparation",
      description: "Comprehensive tax preparation for individuals to maximize deductions and minimize liability.",
      features: [
        "Federal and state tax returns",
        "Itemized deduction analysis",
        "Investment income reporting",
        "Self-employment tax preparation",
      ],
    },
    {
      title: "Business Tax Preparation",
      description: "Expert tax preparation for all business entity types, ensuring compliance and optimization.",
      features: [
        "Corporate tax returns",
        "Partnership and LLC returns",
        "S-Corporation returns",
        "Multi-state tax filings",
      ],
    },
    {
      title: "Tax Planning & Strategy",
      description: "Proactive tax planning to minimize your tax burden and maximize savings throughout the year.",
      features: [
        "Year-round tax planning",
        "Estimated tax calculations",
        "Tax-saving strategies",
        "Retirement planning coordination",
      ],
    },
    {
      title: "IRS Representation",
      description: "Professional representation and support for IRS audits, notices, and disputes.",
      features: [
        "IRS audit representation",
        "Notice response and resolution",
        "Payment plan negotiations",
        "Tax dispute mediation",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <FileText className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent">Tax Services</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Expert Tax Preparation & Planning
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Maximize your tax savings with comprehensive preparation, strategic planning,
                and professional IRS representation from experienced tax professionals.
              </p>
              <Button asChild variant="cta" size="xl">
                <Link to="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={taxImage}
                alt="Professional tax services"
                className="rounded-lg shadow-custom-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Navigate Tax Complexity with Confidence
            </h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Tax laws are complex and constantly changing. Whether you're an individual taxpayer
                or a business owner, staying compliant while maximizing your tax benefits requires
                expertise, attention to detail, and strategic planning.
              </p>
              <p className="text-lg">
                At Spalding & Partners, our experienced tax professionals stay current with the
                latest tax regulations and strategies to ensure you pay only what you owe—and not
                a penny more. We provide comprehensive tax services for individuals and businesses
                throughout Connecticut.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Tax Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Why Choose Our Tax Services?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">30+ Years of Experience</h4>
                  <p className="text-muted-foreground">
                    Decades of expertise in tax preparation and planning for individuals and businesses
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Proactive Tax Planning</h4>
                  <p className="text-muted-foreground">
                    Year-round guidance to minimize tax liability and maximize savings
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">IRS Expertise</h4>
                  <p className="text-muted-foreground">
                    Professional representation and support for audits, notices, and disputes
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Personalized Service</h4>
                  <p className="text-muted-foreground">
                    Tailored strategies based on your unique financial situation and goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Optimize Your Tax Strategy?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Let our tax experts help you navigate complexity and maximize your tax savings.
          </p>
          <Button asChild variant="hero" size="xl">
            <Link to="/contact">
              Schedule a Tax Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tax;
