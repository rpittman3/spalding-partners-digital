import { Mail, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const staffMembers = [
  {
    name: "Sarah Spalding",
    title: "Managing Partner, CPA",
    email: "sarah@sp-financial.com",
    phone: "(860) 456-1661 ext. 101",
    bio: "Sarah founded Spalding & Partners with a vision to create a boutique accounting firm that truly knows its clients. With over 25 years of experience in public accounting, she specializes in tax planning and small business advisory. Sarah is dedicated to building long-term relationships with clients and providing personalized financial guidance tailored to each client's unique situation.",
  },
  {
    name: "Jennifer Martinez",
    title: "Senior Accountant",
    email: "jennifer@sp-financial.com",
    phone: "(860) 456-1661 ext. 102",
    bio: "Jennifer brings 15 years of accounting expertise to our team, specializing in financial statement preparation and bookkeeping services. Her attention to detail and commitment to accuracy ensure that our clients' financial records are always in perfect order. Jennifer takes pride in helping small businesses navigate complex accounting requirements with ease and confidence.",
  },
  {
    name: "Michael Chen",
    title: "Tax Specialist, EA",
    email: "michael@sp-financial.com",
    phone: "(860) 456-1661 ext. 103",
    bio: "As an Enrolled Agent with 12 years of experience, Michael specializes in tax preparation, planning, and IRS representation. He stays current with the latest tax law changes to ensure our clients benefit from every available deduction and credit. Michael's approachable style makes complex tax matters easy to understand, and he's passionate about helping clients achieve their financial goals.",
  },
  {
    name: "Emily Thompson",
    title: "Business Advisor",
    email: "emily@sp-financial.com",
    phone: "(860) 456-1661 ext. 104",
    bio: "Emily combines her background in business management with financial expertise to help clients make strategic decisions for growth. With 10 years of experience advising small to medium-sized businesses, she specializes in financial management, budgeting, and cash flow optimization. Emily believes that strong financial planning is the foundation for business success and works closely with clients to develop customized strategies.",
  },
];

const Staff = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 md:pt-40">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Meet Our Team
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Dedicated professionals committed to your financial success. We believe in the power of personal relationships and providing boutique service that makes a difference.
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid gap-12 md:gap-16">
              {staffMembers.map((member, index) => (
                <div
                  key={member.email}
                  className={`grid md:grid-cols-2 gap-8 items-start ${
                    index % 2 === 1 ? "md:grid-flow-dense" : ""
                  }`}
                >
                  {/* Photo Placeholder */}
                  <div
                    className={`${
                      index % 2 === 1 ? "md:col-start-2" : ""
                    }`}
                  >
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-custom-md">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                          <span className="text-5xl font-bold text-primary">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Photo Coming Soon</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div
                    className={`flex flex-col justify-center ${
                      index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
                    }`}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
                      {member.name}
                    </h2>
                    <p className="text-xl text-accent font-semibold mb-4">
                      {member.title}
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex flex-col gap-2 text-sm">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-primary hover:text-accent transition-fast"
                      >
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </a>
                      <a
                        href={`tel:${member.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 text-primary hover:text-accent transition-fast"
                      >
                        <Phone className="h-4 w-4" />
                        {member.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-accent">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
              Ready to Work With Us?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Experience the difference of personalized financial services. Let's discuss how we can help you achieve your goals.
            </p>
            <Button asChild size="lg" variant="secondary" className="shadow-custom-lg">
              <Link to="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Staff;
