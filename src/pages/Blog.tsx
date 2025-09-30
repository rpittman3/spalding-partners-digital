import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const posts = [
    {
      title: "Year-End Tax Planning Strategies for 2025",
      excerpt: "Essential strategies to minimize your tax liability before the year ends. Learn about deductions, credits, and planning opportunities.",
      date: "December 1, 2025",
      readTime: "5 min read",
      category: "Tax Planning",
    },
    {
      title: "Understanding the New Small Business Tax Regulations",
      excerpt: "Recent changes to small business tax law and what they mean for your business. Stay compliant and optimize your tax position.",
      date: "November 15, 2025",
      readTime: "7 min read",
      category: "Business Tax",
    },
    {
      title: "Retirement Planning: It's Never Too Early to Start",
      excerpt: "A comprehensive guide to retirement planning strategies that can help you build a secure financial future, no matter your age.",
      date: "November 1, 2025",
      readTime: "8 min read",
      category: "Financial Planning",
    },
    {
      title: "Cash Flow Management Tips for Small Businesses",
      excerpt: "Practical strategies to improve your business cash flow and ensure you have the working capital needed for growth and stability.",
      date: "October 15, 2025",
      readTime: "6 min read",
      category: "Business Management",
    },
    {
      title: "Choosing the Right Business Entity: LLC vs. S-Corp",
      excerpt: "Compare different business structures to understand which entity type offers the best tax benefits and liability protection for your situation.",
      date: "October 1, 2025",
      readTime: "10 min read",
      category: "Business Advisory",
    },
    {
      title: "Essential Tax Deductions for Freelancers and Gig Workers",
      excerpt: "Maximize your tax savings by understanding the deductions available to independent contractors and gig economy workers.",
      date: "September 15, 2025",
      readTime: "6 min read",
      category: "Personal Tax",
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
              Financial Insights & Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert advice, tips, and updates to help you navigate your financial journey
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Card
                key={post.title}
                className="hover:shadow-custom-lg transition-smooth flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3 w-fit">
                    {post.category}
                  </div>
                  <CardTitle className="text-xl md:text-2xl hover:text-accent transition-colors">
                    <Link to="#">{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="#">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Informed
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter to receive the latest financial insights,
              tax updates, and business strategies directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="cta" size="lg">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Need Personalized Financial Advice?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            While our blog provides valuable insights, nothing replaces personalized guidance
            from experienced professionals. Let's discuss your specific needs.
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

export default Blog;
