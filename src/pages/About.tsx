import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Heart, Target, Users, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Spalding & Partners
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Building lasting partnerships through integrity, expertise, and personalized service
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Founded in 1987, Spalding & Partners Financial Services, LLC has been serving
                Connecticut's financial needs for over three decades. What began as a vision to
                provide personalized, professional accounting services has grown into a trusted
                firm known for integrity, discipline, and exceptional client service.
              </p>
              <p className="text-lg">
                We specialize in small business financial management, comprehensive tax preparation,
                and Chief Financial Officer consulting services. Our firm is built on the belief that
                every client deserves dedicated attention, expert guidance, and solutions tailored to
                their unique financial situation.
              </p>
              <p className="text-lg">
                With over 30 years of combined experience in tax preparation and accounting services,
                we have fine-tuned and streamlined key accounting processes to deliver high-quality
                service to both corporate and individual clients. Our small staff ensures that your
                information remains confidential and that you receive the personalized attention you
                deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Integrity</h3>
              <p className="text-muted-foreground">
                We maintain the highest standards of professional ethics and confidentiality.
                By maintaining a small staff and hiring from within, we ensure that your
                information is safeguarded by trustworthy and honest accountants. Your trust
                is the foundation of our relationship.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Discipline</h3>
              <p className="text-muted-foreground">
                With over 30 years of experience in tax preparation and accounting services,
                we have fine-tuned and streamlined key accounting processes to deliver
                high-quality service efficiently and accurately. Our systematic approach
                ensures consistent excellence.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Client-Focused</h3>
              <p className="text-muted-foreground">
                Your success is our success. We take the time to understand your unique
                financial situation and goals, providing personalized solutions and advice
                that truly serve your best interests. We're not just your accountants—we're
                your financial partners.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Experience</h3>
              <p className="text-muted-foreground">
                Our team brings decades of experience in accounting, taxation, and financial
                management. We stay current with changing regulations and best practices to
                ensure you receive the most knowledgeable guidance and maximize your financial
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Commitment to You</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              At Spalding & Partners Financial Services, LLC, we understand that your financial
              well-being is paramount. Our commitment goes beyond numbers—we're dedicated to
              building long-term relationships based on trust, transparency, and results.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-12">
              Whether you're an individual seeking personal financial guidance or a business
              owner navigating complex financial challenges, we provide the expertise and
              personalized attention you need to succeed. Our knowledge of small business
              practice, tax law, and economic impacts ensures that our clients receive the
              best service possible.
            </p>
            <Button asChild variant="cta" size="xl">
              <Link to="/contact">
                Partner With Us Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Work With Spalding & Partners?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">30+</div>
              <h3 className="text-xl font-semibold mb-2">Years of Experience</h3>
              <p className="text-muted-foreground">
                Three decades of proven expertise serving Connecticut
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">500+</div>
              <h3 className="text-xl font-semibold mb-2">Satisfied Clients</h3>
              <p className="text-muted-foreground">
                Individuals and businesses trust us with their finances
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">100%</div>
              <h3 className="text-xl font-semibold mb-2">Confidential</h3>
              <p className="text-muted-foreground">
                Your privacy and security are always our top priority
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Let's Start Your Financial Journey
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Experience the difference that personalized, expert financial guidance can make.
            Contact us today for a consultation.
          </p>
          <Button asChild variant="hero" size="xl">
            <Link to="/contact">
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
