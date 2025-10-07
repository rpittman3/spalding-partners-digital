import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/bridge-hero.jpg";
const Hero = () => {
  return <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden py-0 pt-0 mt-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Frog Bridge in Willimantic, Connecticut - symbolizing our commitment to connecting clients with financial success" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-primary-foreground">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in text-primary-foreground">
          Financial & Tax Advisors
          <br />
          <span className="text-accent">to Successful People</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in text-primary-foreground/90 font-normal">Expert accounting, tax preparation, and financial management services in Connecticut for over 25 years</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button asChild variant="hero" size="xl">
            <Link to="/contact">
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link to="/services/accounting">
              Our Services
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">25+</div>
            <div className="text-sm text-primary-foreground/80">Years of Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">500+</div>
            <div className="text-sm text-primary-foreground/80">Satisfied Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">100%</div>
            <div className="text-sm text-primary-foreground/80">Confidential Service</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>;
};
export default Hero;