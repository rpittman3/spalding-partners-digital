import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, TrendingUp, Briefcase, PiggyBank, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Accounting Services",
    description: "Professional bookkeeping, financial statements, and payroll support for businesses of all sizes.",
    icon: Calculator,
    href: "/services/accounting",
    features: ["Bookkeeping", "Financial Statements", "Payroll Support"],
  },
  {
    title: "Tax Services",
    description: "Comprehensive tax preparation, planning, and IRS representation for individuals and businesses.",
    icon: FileText,
    href: "/services/tax",
    features: ["Tax Preparation", "Tax Planning", "IRS Representation"],
  },
  {
    title: "Financial Management",
    description: "Strategic budgeting, cash flow analysis, and CFO services to optimize your financial health.",
    icon: TrendingUp,
    href: "/services/financial-management",
    features: ["Budgeting", "Cash Flow Analysis", "CFO Services"],
  },
  {
    title: "Business Advisory",
    description: "Expert guidance on entity selection, business structure, and growth strategies.",
    icon: Briefcase,
    href: "/services/business-advisory",
    features: ["Entity Selection", "Business Consulting", "Growth Strategies"],
  },
  {
    title: "Personal Financial Planning",
    description: "Comprehensive planning for retirement, college savings, and estate management.",
    icon: PiggyBank,
    href: "/services/personal-planning",
    features: ["Retirement Planning", "College Savings", "Estate Planning"],
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.href}
                className="group hover:shadow-custom-xl transition-smooth border-2 hover:border-accent/50 bg-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-smooth">
                    <Icon className="h-7 w-7 text-primary group-hover:text-accent transition-smooth" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full group-hover:border-accent group-hover:text-accent">
                    <Link to={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
