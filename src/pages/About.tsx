import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Heart, Target, Users, ArrowRight } from "lucide-react";
const About = () => {
  return <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pb-24 bg-gradient-to-b from-secondary/50 to-background py-[25px]">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center offset-header">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Spalding & Partners
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              A boutique firm where you're more than a client number—you're a valued partner we know by name
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background md:py-0">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-lg">
                Founded in 2000, Spalding & Partners Financial Services, LLC was born from a
                simple but powerful vision: to create a boutique accounting firm where clients
                aren't just account numbers—they're valued partners in a lasting relationship.
                For over 25 years, we've remained true to that vision, building a practice that
                prioritizes personal connection, deep expertise, and genuinely customized service.
              </p>
              <p className="text-lg">
                We're woman-owned and operated, bringing a unique perspective to financial
                management, tax strategy, and CFO consulting. Unlike traditional bookkeeping
                firms or large corporate practices, we take an "I know who you are" approach.
                We remember your goals, understand your challenges, and celebrate your wins.
                This isn't about volume—it's about building meaningful, long-term partnerships
                with niche clientele who value expertise paired with genuine personal attention.
              </p>
              <p className="text-lg">
                With over 25 years of specialized experience, we've refined our processes and
                deepened our expertise while staying small by design. Our boutique model allows
                us to maintain the highest standards of confidentiality, deliver exceptional
                quality, and ensure that every client receives the dedicated, hands-on service
                they deserve. You'll work directly with experienced professionals who truly
                know your business and your story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary/30 md:py-[35px]">
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
                With over 25 years of experience, we've fine-tuned and streamlined our
                processes to deliver exceptional quality efficiently and accurately. Our
                systematic, detail-oriented approach ensures consistent excellence while
                maintaining the personal touch that defines boutique service.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg shadow-custom-md hover:shadow-custom-lg transition-smooth">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Relationship-Centered</h3>
              <p className="text-muted-foreground">
                This is what sets us apart: we know who you are. Your success is our success,
                and we're invested in your journey. We take the time to deeply understand your
                unique situation and goals, delivering solutions that are truly tailored to you.
                We're not transactional—we're your trusted financial partners for the long haul.
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
      <section className="py-16 bg-background md:py-[35px]">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Commitment to You</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              At Spalding & Partners, we're redefining what boutique accounting means. We're not
              chasing volume or treating you like just another file. Our commitment is to select
              clients who value what we offer: deep expertise, genuine relationships, and truly
              personalized service. We're small by design because it allows us to deliver
              exceptional quality and maintain the "I know who you are" approach that defines us.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-12">
              As a woman-owned firm with over 25 years of specialized expertise, we bring both
              technical excellence and a human touch to every engagement. We understand small
              business intricacies, tax complexities, and financial strategy—but more importantly,
              we understand you. If you're looking for a firm that prioritizes relationships over
              transactions and quality over quantity, you've found your financial partner.
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
      <section className="py-16 bg-secondary/30 md:py-[35px]">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Work With Spalding & Partners?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">25+</div>
              <h3 className="text-xl font-semibold mb-2">Years of Excellence</h3>
              <p className="text-muted-foreground">
                Over two decades of boutique, relationship-focused service
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">100%</div>
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-muted-foreground">
                Every client receives dedicated, hands-on attention
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-4">
                <Heart className="h-16 w-16 mx-auto text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Woman-Owned</h3>
              <p className="text-muted-foreground">
                Bringing unique perspective and care to financial services
              </p>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>;
};
export default About;