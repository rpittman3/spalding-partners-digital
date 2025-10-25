import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";
import financialImage from "@/assets/services-financial.jpg";

const FinancialManagement = () => {
  const services = [
    {
      title: "Budgeting & Forecasting",
      description: "Strategic budget development and financial forecasting to guide your business decisions.",
      features: [
        "Annual budget creation",
        "Multi-year financial projections",
        "Variance analysis",
        "Performance tracking",
      ],
    },
    {
      title: "Cash Flow Management",
      description: "Optimize your cash flow to ensure liquidity and financial stability.",
      features: [
        "Cash flow analysis and reporting",
        "Working capital optimization",
        "Payment cycle management",
        "Seasonal planning",
      ],
    },
    {
      title: "CFO Services",
      description: "Part-time CFO consulting to provide strategic financial leadership without full-time costs.",
      features: [
        "Financial strategy development",
        "KPI development and monitoring",
        "Board presentation support",
        "Financial systems optimization",
      ],
    },
    {
      title: "Strategic Planning",
      description: "Long-term financial planning to support your business growth and success.",
      features: [
        "Growth strategy development",
        "Financial modeling",
        "Scenario planning",
        "Investment analysis",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-15 pb-16 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="offset-header">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent">Financial Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Strategic Financial Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Drive business success with expert budgeting, cash flow management, CFO services,
                and strategic financial planning tailored to your goals.
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
                src={financialImage}
                alt="Financial management services"
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
              Financial Leadership for Growth
            </h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Effective financial management is essential for business success. Whether you're
                a growing startup or an established company, having clear financial direction,
                strong cash flow management, and strategic planning can make the difference between
                surviving and thriving.
              </p>
              <p className="text-lg">
                Our financial management services provide you with the expertise and insights of
                a seasoned CFO without the cost of a full-time executive. We work closely with you
                to develop budgets, manage cash flow, track performance, and plan for the future—
                helping you make informed decisions that drive profitability and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Financial Management Services
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

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Benefits of Professional Financial Management
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Improved Cash Flow</h4>
                  <p className="text-muted-foreground">
                    Better management of receivables, payables, and working capital ensures steady cash flow
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Strategic Decision Making</h4>
                  <p className="text-muted-foreground">
                    Data-driven insights and financial modeling support better business decisions
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Growth Support</h4>
                  <p className="text-muted-foreground">
                    Strategic planning and forecasting prepare your business for sustainable growth
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Cost-Effective Expertise</h4>
                  <p className="text-muted-foreground">
                    Access CFO-level financial leadership without the expense of a full-time hire
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default FinancialManagement;
