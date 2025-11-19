import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Briefcase } from "lucide-react";
const BusinessAdvisory = () => {
  const services = [{
    title: "Entity Selection & Formation",
    description: "Expert guidance on choosing the right business structure for your needs.",
    features: ["LLC, Corporation, or Partnership analysis", "Tax implications evaluation", "Liability protection assessment", "Formation document preparation"]
  }, {
    title: "Business Consulting",
    description: "Strategic business guidance to help you navigate challenges and opportunities.",
    features: ["Business process optimization", "Financial systems improvement", "Risk management strategies", "Operational efficiency analysis"]
  }, {
    title: "Growth Strategies",
    description: "Strategic planning and advice to support your business expansion goals.",
    features: ["Market expansion planning", "Acquisition evaluation", "Financing strategy", "Scalability assessment"]
  }, {
    title: "Exit Planning",
    description: "Comprehensive planning for business succession or sale.",
    features: ["Business valuation", "Succession planning", "Exit strategy development", "Tax minimization strategies"]
  }];
  return <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-15 pb-16 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center offset-header">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Briefcase className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent">Business Advisory</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Strategic Business Advisory Services</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Navigate business challenges and capitalize on opportunities with expert guidance on entity selection,
              strategic planning, and growth strategies.
            </p>
            <Button asChild variant="cta" size="xl">
              
            </Button>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Your Trusted Business Advisor</h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Running a successful business requires more than just day-to-day management—it requires strategic
                thinking, careful planning, and expert guidance. Whether you're starting a new venture, growing an
                existing business, or planning your exit, the right advisory support can make all the difference.
              </p>
              <p className="text-lg">
                Our business advisory services combine financial expertise with strategic business acumen to help you
                make informed decisions at every stage of your business journey. From entity selection and formation to
                growth strategies and exit planning, we're here to guide you toward success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Business Advisory Services</h2>
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

      {/* Why Advisory Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Business Advisory Matters</h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-2 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Make Informed Decisions</h4>
                  <p className="text-muted-foreground">
                    Expert guidance helps you evaluate options and make strategic choices with confidence
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-2 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Avoid Costly Mistakes</h4>
                  <p className="text-muted-foreground">
                    Proper structure and planning prevent expensive errors and maximize tax efficiency
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-2 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Plan for Growth</h4>
                  <p className="text-muted-foreground">
                    Strategic planning ensures your business is positioned for sustainable expansion
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-2 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Maximize Value</h4>
                  <p className="text-muted-foreground">
                    Whether growing or exiting, proper advisory helps you maximize your business value
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default BusinessAdvisory;