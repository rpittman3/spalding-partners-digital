import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground">
              Spalding & Partners
            </h3>
            <p className="text-sm text-primary-foreground/80">
              Financial Services, LLC
            </p>
            <p className="text-sm text-primary-foreground/70">
              A boutique accounting firm offering personalized financial solutions for niche clientele since 2000.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Home
              </Link>
              <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                About Us
              </Link>
              <Link to="/staff" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Our Team
              </Link>
              <Link to="/services/accounting" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Services
              </Link>
              <Link to="/resources" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Resources
              </Link>
              <Link to="/faq" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                FAQ
              </Link>
              <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">Services</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/services/accounting" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Accounting Services
              </Link>
              <Link to="/services/tax" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Tax Services
              </Link>
              <Link to="/services/financial-management" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Financial Management
              </Link>
              <Link to="/services/business-advisory" className="text-sm text-primary-foreground/70 hover:text-accent transition-fast">
                Business Advisory
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:(860)456-1661"
                className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-fast group"
              >
                <Phone className="h-5 w-5 mt-0.5 group-hover:text-accent" />
                <span>(860) 456-1661</span>
              </a>
              <a
                href="mailto:info@sp-financial.com"
                className="flex items-start gap-3 text-sm text-primary-foreground/70 hover:text-accent transition-fast group"
              >
                <Mail className="h-5 w-5 mt-0.5 group-hover:text-accent" />
                <span>info@sp-financial.com</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-5 w-5 mt-0.5" />
                <span>452 Jackson Street<br />Willimantic, CT 06226</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>
              © {new Date().getFullYear()} Spalding & Partners Financial Services, LLC. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-accent transition-fast">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-accent transition-fast">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
