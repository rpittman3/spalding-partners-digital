import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, PiggyBank } from "lucide-react";

const PersonalPlanning = () => {
  const services = [
    {
      title: "Retirement Planning",
      description: "Comprehensive retirement planning to help you achieve financial security in your golden years.",
      features: [
        "Retirement savings strategies",
        "401(k) and IRA optimization",
        "Social Security planning",
        "Income distribution strategies",
      ],
    },
    {
      title: "College Savings Planning",
      description: "Strategic planning to fund your children's education without compromising your financial goals.",
      features: [
        "529 plan setup and management",
        "Education savings strategies",
        "Financial aid planning",
        "Tax-advantaged savings options",
      ],
    },
    {
      title: "Estate Planning Guidance",
      description: "Coordinate with your attorney to ensure your estate plan aligns with your financial goals.",
      features: [
        "Estate tax planning",
        "Wealth transfer strategies",
        "Trust coordination",
        "Charitable giving planning",
      ],
    },
    {
      title: "Investment Strategy",
      description: "Coordinate investment strategies that align with your financial goals and risk tolerance.",
      features: [
        "Asset allocation guidance",
        "Tax-efficient investing",
        "Risk assessment",
        "Portfolio coordination",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <PiggyBank className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent">Personal Financial Planning</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Personal Financial Planning
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Build a secure financial future with expert guidance on retirement planning,
              college savings, estate planning, and investment strategies.
            </p>
            <Button asChild variant="cta" size="xl">
              <Link to="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Your Financial Future, Carefully Planned
            </h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Achieving your personal financial goals requires more than just earning income—it
                requires strategic planning, disciplined saving, and smart decision-making. Whether
                you're planning for retirement, saving for your children's education, or coordinating
                your estate plan, having expert guidance can help you navigate complex decisions
                and maximize your financial opportunities.
              </p>
              <p className="text-lg">
                Our personal financial planning services integrate seamlessly with our tax and
                accounting expertise to provide you with comprehensive guidance. We help you develop
                strategies that not only meet your financial goals but also optimize your tax
                situation and coordinate with your overall wealth management plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Personal Planning Services
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
              Why Personal Financial Planning Matters
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Achieve Your Goals</h4>
                  <p className="text-muted-foreground">
                    Strategic planning helps you reach retirement, education, and wealth transfer goals
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Tax Optimization</h4>
                  <p className="text-muted-foreground">
                    Coordinate strategies with tax planning to maximize savings and minimize liability
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Peace of Mind</h4>
                  <p className="text-muted-foreground">
                    Comprehensive planning provides confidence that your financial future is secure
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Integrated Approach</h4>
                  <p className="text-muted-foreground">
                    Planning that coordinates with your tax, accounting, and legal strategies
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
            Ready to Secure Your Financial Future?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Let us help you build a comprehensive financial plan that achieves your goals.
          </p>
          <Button asChild variant="hero" size="xl">
            <Link to="/contact">
              Schedule a Planning Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PersonalPlanning;
