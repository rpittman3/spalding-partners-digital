import { Shield, Users, Clock, Award } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We maintain the highest standards of professional ethics and client confidentiality. Your trust is our foundation.",
  },
  {
    icon: Users,
    title: "Personalized Service",
    description: "Small staff, big expertise. We provide tailored solutions that match your unique financial situation and goals.",
  },
  {
    icon: Clock,
    title: "Discipline",
    description: "Over 25 years of experience have refined our processes to deliver consistent, high-quality service every time.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Our commitment to staying current with tax laws and best practices ensures you receive expert guidance you can count on.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose Spalding & Partners?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Built on a foundation of trust, expertise, and dedicated client service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-accent/10 transition-smooth">
                  <Icon className="h-10 w-10 text-primary group-hover:text-accent transition-smooth" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-primary">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
