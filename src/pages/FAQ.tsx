import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What makes Spalding & Partners different from other accounting firms?",
      answer: "We're a boutique firm that takes an 'I know who you are' approach. Unlike large corporate firms where you're just a number, we build genuine, long-term relationships with our clients. As a woman-owned practice with over 25 years of experience, we provide personalized attention and tailored solutions for niche clientele. We're small by design—it allows us to deliver exceptional quality and maintain the personal touch that defines boutique service.",
    },
    {
      question: "What types of clients do you work with?",
      answer: "We specialize in serving small to mid-sized businesses, entrepreneurs, and select individual clients who value a relationship-based approach to financial services. We're not focused on volume—we carefully select clients who appreciate personalized service and deep expertise. Our niche includes businesses that need more than basic bookkeeping and individuals who want a trusted advisor who truly understands their financial goals.",
    },
    {
      question: "What services do you offer?",
      answer: "We offer comprehensive Accounting Services (bookkeeping, financial statements, payroll support), Tax Services (individual & business tax preparation, planning, IRS representation), Financial Management (budgeting, cash flow analysis, CFO services), and Business Advisory (entity selection, consulting, growth strategies). Each service is tailored to your unique needs.",
    },
    {
      question: "How long has your firm been in business?",
      answer: "Spalding & Partners Financial Services, LLC was founded in 2000. We've been providing boutique accounting and financial services to Connecticut businesses and individuals for over 25 years.",
    },
    {
      question: "Do you provide services to individuals or just businesses?",
      answer: "We work with both businesses and individuals. Our business clients range from small startups to established companies needing CFO-level guidance, while our individual clients typically seek expert tax preparation, planning, and financial advice. In all cases, we provide the same personalized, relationship-focused approach.",
    },
    {
      question: "What is your approach to client service?",
      answer: "We believe in building lasting relationships. When you work with us, you're not passed around to different team members—you work directly with experienced professionals who get to know you, your business, and your goals. We take the time to understand your story, remember what matters to you, and provide solutions that are truly customized to your situation.",
    },
    {
      question: "How do you ensure confidentiality?",
      answer: "We maintain the highest standards of professional ethics and confidentiality. Our boutique model, with a small dedicated staff, ensures that your sensitive financial information is handled by trusted professionals. We've built our reputation on integrity, and client confidentiality is paramount to everything we do.",
    },
    {
      question: "Can you help with IRS issues or audits?",
      answer: "Yes. We provide IRS representation services and can assist with tax issues, audits, and disputes. With over 25 years of tax expertise, we know how to navigate complex IRS matters and advocate for our clients effectively.",
    },
    {
      question: "Do you offer CFO services for small businesses?",
      answer: "Absolutely. Many small businesses need CFO-level financial guidance but can't afford a full-time CFO. We provide strategic financial management, budgeting, forecasting, cash flow analysis, and high-level business advisory services tailored to your company's size and needs.",
    },
    {
      question: "How do I get started working with your firm?",
      answer: "Simply contact us to schedule a consultation. We'll take the time to understand your needs, discuss how we can help, and determine if we're the right fit for each other. We're selective about who we work with because we're committed to providing exceptional, personalized service to every client.",
    },
    {
      question: "What are your fees?",
      answer: "Our fees vary based on the scope and complexity of services required. We believe in transparent pricing and will provide a clear fee structure during your initial consultation. Because we offer boutique, customized service, our pricing reflects the value of personalized attention and deep expertise rather than one-size-fits-all packages.",
    },
    {
      question: "Are you accepting new clients?",
      answer: "We carefully evaluate new client opportunities to ensure we can provide the level of service that defines our practice. We're not focused on rapid growth—we're focused on quality relationships. Contact us to discuss your needs, and we'll let you know if we're currently able to take on new clients.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Get answers to common questions about our boutique financial services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6 shadow-custom-sm hover:shadow-custom-md transition-smooth"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're here to help. Contact us today to discuss your specific needs and learn how
            our boutique approach can benefit you.
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
