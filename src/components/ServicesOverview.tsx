import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import serviceAccounting from "@/assets/service-accounting.jpg";
import serviceTax from "@/assets/service-tax.jpg";
import serviceFinancial from "@/assets/service-financial.jpg";
import serviceAdvisory from "@/assets/service-advisory.jpg";
import servicePlanning from "@/assets/service-planning.jpg";

const services = [
  {
    title: "Accounting Services",
    description: "Professional bookkeeping, financial statements, and payroll support for businesses of all sizes.",
    image: serviceAccounting,
    href: "/services/accounting",
    features: ["Bookkeeping", "Financial Statements", "Payroll Support"],
  },
  {
    title: "Tax Services",
    description: "Comprehensive tax preparation, planning, and IRS representation for individuals and businesses.",
    image: serviceTax,
    href: "/services/tax",
    features: ["Tax Preparation", "Tax Planning", "IRS Representation"],
  },
  {
    title: "Financial Management",
    description: "Strategic budgeting, cash flow analysis, and CFO services to optimize your financial health.",
    image: serviceFinancial,
    href: "/services/financial-management",
    features: ["Budgeting", "Cash Flow Analysis", "CFO Services"],
  },
  {
    title: "Business Advisory",
    description: "Expert guidance on entity selection, business structure, and growth strategies.",
    image: serviceAdvisory,
    href: "/services/business-advisory",
    features: ["Entity Selection", "Business Consulting", "Growth Strategies"],
  },
];

const ServicesOverview = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive financial solutions tailored to your unique needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.href}
              className="group perspective-1000 h-[400px]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                {/* Front of card */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="relative h-full rounded-lg overflow-hidden shadow-custom-lg border-2 border-border">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-primary-foreground">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="h-full rounded-lg bg-card border-2 border-accent shadow-custom-xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      <Link to={service.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="cta" size="lg">
            <Link to="/contact">
              Schedule a Consultation Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;