import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <Hero />

      {/* About Section Preview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Trusted Financial Partners Since 1987
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Spalding & Partners Financial Services, LLC is a full-service accounting firm
                located in Connecticut, serving the area's accounting needs for over 30 years.
                We specialize in small business financial management, tax preparation, and
                Chief Financial Officer consulting services.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our firm provides service in a timely, confidential, and professional manner.
                With a small, dedicated staff and decades of expertise, we ensure your
                financial information is handled with the utmost care and precision.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Over 30 years of combined experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Personalized service from a small, expert team</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Comprehensive financial solutions for individuals and businesses</span>
                </div>
              </div>
              <Button asChild variant="cta" size="lg">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-bold text-primary mb-4">30+</div>
                  <div className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                    Years of Excellence
                  </div>
                  <p className="text-muted-foreground">
                    Serving Connecticut with integrity and expertise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesOverview />
      
      <WhyChooseUs />

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Let our experienced team help you achieve your financial goals with personalized
            accounting, tax, and advisory services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/contact">
                Schedule a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/services/accounting">
                Explore Our Services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
