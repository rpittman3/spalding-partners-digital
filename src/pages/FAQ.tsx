import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
const FAQ = () => {
  // Fetch active FAQs from database
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").eq("is_active", true).order("display_order");
      if (error) throw error;
      return data || [];
    },
  });
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-15 pb-4 md:pb-6 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center offset-header">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Get answers to common questions about our boutique financial services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-background md:py-0">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading FAQs...</p>
            ) : faqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-lg px-6 shadow-custom-sm hover:shadow-custom-md transition-smooth"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 pt-2">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground">No FAQs available at this time.</p>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're here to help. Contact us today to discuss your specific needs and learn how our boutique approach can
            benefit you.
          </p>
          <Button asChild variant="cta" size="xl">
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default FAQ;
