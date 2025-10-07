import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import WhyChooseUs from "@/components/WhyChooseUs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import handshakeImage from "@/assets/handshake-trust.jpg";

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
                Your Boutique Financial Partner Since 2000
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Spalding & Partners Financial Services, LLC is a boutique accounting firm
                that takes a different approach. We're not a traditional bookkeeping service—we're
                your dedicated financial partner who knows you, your business, and your unique goals.
                Since 2000, we've specialized in providing personalized financial management, tax
                expertise, and CFO consulting to select clients who value a hands-on, relationship-based approach.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Unlike large corporate firms where you're just a number, our boutique model means
                you work directly with experienced professionals who understand your story. We know
                who you are, and we're invested in your success. With over 25 years of expertise,
                we deliver timely, confidential, and genuinely personalized service.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Over 25 years of trusted expertise</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Boutique, relationship-focused approach—we know who you are</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">Tailored solutions for niche clientele, not cookie-cutter services</span>
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
              <img 
                src={handshakeImage} 
                alt="Building trust and lasting relationships with our clients through personalized financial guidance" 
                className="w-full h-auto rounded-lg shadow-custom-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServicesOverview />
      
      <WhyChooseUs />

      {/* CTA Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#918a6e' }}>
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
